import { promises as fs } from "fs";
import path from "path";
import { BigQuery } from "@google-cloud/bigquery";
import { z } from "zod";
import type { Demanda, PrioridadeDemanda, StatusDemanda } from "@/types/bi-platform";

const dataDir = path.join(process.cwd(), "data");
const demandasFile = path.join(dataDir, "demandas.json");
const projectId = process.env.PROJECT_ID || "worlddata-439415";
const datasetId = process.env.BIGQUERY_DATASET || "lpdados";
const demandasTable = process.env.BIGQUERY_DEMANDAS_TABLE || "demandas";

const createDemandaSchema = z.object({
  titulo: z.string().trim().min(5, "O titulo precisa ter pelo menos 5 caracteres.").max(120, "O titulo pode ter no maximo 120 caracteres."),
  descricao: z.string().trim().min(10, "A descricao precisa ter pelo menos 10 caracteres.").max(2000, "A descricao pode ter no maximo 2000 caracteres."),
  area: z.string().trim().min(2, "Informe a area solicitante.").max(80, "A area pode ter no maximo 80 caracteres."),
  solicitante: z.string().trim().min(2, "Informe o nome do solicitante.").max(120, "O nome do solicitante pode ter no maximo 120 caracteres."),
  email: z.string().trim().email("Informe um e-mail valido.").optional().or(z.literal("")),
  tipo: z.string().trim().max(80, "O tipo pode ter no maximo 80 caracteres.").optional().or(z.literal("")),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]).default("media"),
});

const updateDemandaSchema = z.object({
  status: z.enum(["nova", "em analise", "em desenvolvimento", "entregue", "cancelada"]).optional(),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
  observacao: z.string().trim().max(1500, "A observacao pode ter no maximo 1500 caracteres.").optional(),
  projeto_id: z.string().trim().max(120, "O identificador do projeto pode ter no maximo 120 caracteres.").nullable().optional(),
});

export type CreateDemandaInput = z.infer<typeof createDemandaSchema>;
export type UpdateDemandaInput = z.infer<typeof updateDemandaSchema>;

const bigquery =
  new BigQuery({
    credentials: process.env.GOOGLE_CREDENTIALS_JSON
      ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
      : undefined,
    projectId,
  });

function canUseBigQuery() {
  return true;
}

function tableRef() {
  return `\`${projectId}.${datasetId}.${demandasTable}\``;
}

function extractValue(val: unknown) {
  if (val && typeof val === "object" && "value" in (val as Record<string, unknown>)) {
    return (val as { value: unknown }).value;
  }
  return val;
}

function normalizeDemandaRow(row: Record<string, unknown>): Demanda {
  const out: Record<string, unknown> = {};
  for (const key in row) {
    out[key] = extractValue(row[key]);
  }

  return {
    id: String(out.id || ""),
    titulo: String(out.titulo || ""),
    descricao: String(out.descricao || ""),
    area: String(out.area || ""),
    solicitante: String(out.solicitante || ""),
    email: out.email ? String(out.email) : undefined,
    tipo: out.tipo ? String(out.tipo) : undefined,
    prioridade: String(out.prioridade || "media") as PrioridadeDemanda,
    status: String(out.status || "nova") as StatusDemanda,
    projeto_id: out.projeto_id ? String(out.projeto_id) : null,
    data_abertura: String(out.data_abertura || new Date().toISOString()),
    data_atualizacao: out.data_atualizacao ? String(out.data_atualizacao) : undefined,
    observacao: out.observacao ? String(out.observacao) : undefined,
  };
}

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(demandasFile);
  } catch {
    await fs.writeFile(demandasFile, "[]", "utf8");
  }
}

async function readDemandasLocal(): Promise<Demanda[]> {
  await ensureStoreFile();
  const raw = await fs.readFile(demandasFile, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Demanda[]) : [];
  } catch {
    return [];
  }
}

async function writeDemandasLocal(demandas: Demanda[]) {
  await ensureStoreFile();
  await fs.writeFile(demandasFile, JSON.stringify(demandas, null, 2), "utf8");
}

function sortDemandas(demandas: Demanda[]) {
  return [...demandas].sort((a, b) => {
    const dateA = new Date(a.data_atualizacao || a.data_abertura).getTime();
    const dateB = new Date(b.data_atualizacao || b.data_abertura).getTime();
    return dateB - dateA;
  });
}

async function listDemandasBigQuery() {
  const [rows] = await bigquery!.query({
    query: `
      SELECT *
      FROM ${tableRef()}
      ORDER BY data_atualizacao DESC, data_abertura DESC
    `,
  });

  return sortDemandas((rows as Record<string, unknown>[]).map(normalizeDemandaRow));
}

async function createDemandaBigQuery(input: CreateDemandaInput) {
  const parsed = createDemandaSchema.parse(input);
  const now = new Date().toISOString();
  const demanda: Demanda = {
    id: crypto.randomUUID(),
    titulo: parsed.titulo,
    descricao: parsed.descricao,
    area: parsed.area,
    solicitante: parsed.solicitante,
    email: parsed.email || undefined,
    tipo: parsed.tipo || undefined,
    prioridade: parsed.prioridade as PrioridadeDemanda,
    status: "nova",
    projeto_id: null,
    data_abertura: now,
    data_atualizacao: now,
  };

  await bigquery!.query({
    query: `
      INSERT INTO ${tableRef()}
      (id, titulo, descricao, area, solicitante, email, tipo, prioridade, status, projeto_id, data_abertura, data_atualizacao, observacao)
      VALUES (@id, @titulo, @descricao, @area, @solicitante, @email, @tipo, @prioridade, @status, @projeto_id, @data_abertura, @data_atualizacao, @observacao)
    `,
    params: {
      ...demanda,
      email: demanda.email || null,
      tipo: demanda.tipo || null,
      data_abertura: new Date(demanda.data_abertura),
      data_atualizacao: new Date(demanda.data_atualizacao || demanda.data_abertura),
      observacao: null,
    },
    types: {
      id: "STRING",
      titulo: "STRING",
      descricao: "STRING",
      area: "STRING",
      solicitante: "STRING",
      email: "STRING",
      tipo: "STRING",
      prioridade: "STRING",
      status: "STRING",
      projeto_id: "STRING",
      data_abertura: "TIMESTAMP",
      data_atualizacao: "TIMESTAMP",
      observacao: "STRING",
    },
  });

  return demanda;
}

async function updateDemandaBigQuery(id: string, input: UpdateDemandaInput) {
  const parsed = updateDemandaSchema.parse(input);
  const currentItems = await listDemandasBigQuery();
  const current = currentItems.find((item) => item.id === id);

  if (!current) {
    return null;
  }

  const demanda: Demanda = {
    ...current,
    status: (parsed.status ?? current.status) as StatusDemanda,
    prioridade: (parsed.prioridade ?? current.prioridade) as PrioridadeDemanda,
    observacao: parsed.observacao ?? current.observacao,
    projeto_id: parsed.projeto_id === undefined ? current.projeto_id : parsed.projeto_id,
    data_atualizacao: new Date().toISOString(),
  };

  await bigquery!.query({
    query: `
      UPDATE ${tableRef()}
      SET
        prioridade = @prioridade,
        status = @status,
        projeto_id = @projeto_id,
        observacao = @observacao,
        data_atualizacao = @data_atualizacao
      WHERE id = @id
    `,
    params: {
      id,
      prioridade: demanda.prioridade,
      status: demanda.status,
      projeto_id: demanda.projeto_id,
      observacao: demanda.observacao || null,
      data_atualizacao: new Date(demanda.data_atualizacao || new Date().toISOString()),
    },
    types: {
      id: "STRING",
      prioridade: "STRING",
      status: "STRING",
      projeto_id: "STRING",
      observacao: "STRING",
      data_atualizacao: "TIMESTAMP",
    },
  });

  return demanda;
}

async function deleteDemandaBigQuery(id: string) {
  const [rows] = await bigquery!.query({
    query: `SELECT id FROM ${tableRef()} WHERE id = @id LIMIT 1`,
    params: { id },
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  await bigquery!.query({
    query: `DELETE FROM ${tableRef()} WHERE id = @id`,
    params: { id },
  });

  return true;
}

export async function listDemandas() {
  if (canUseBigQuery()) {
    return listDemandasBigQuery();
  }

  return sortDemandas(await readDemandasLocal());
}

export async function createDemanda(input: CreateDemandaInput) {
  if (canUseBigQuery()) {
    return createDemandaBigQuery(input);
  }

  const parsed = createDemandaSchema.parse(input);
  const now = new Date().toISOString();

  const demanda: Demanda = {
    id: crypto.randomUUID(),
    titulo: parsed.titulo,
    descricao: parsed.descricao,
    area: parsed.area,
    solicitante: parsed.solicitante,
    email: parsed.email || undefined,
    tipo: parsed.tipo || undefined,
    prioridade: parsed.prioridade as PrioridadeDemanda,
    status: "nova",
    projeto_id: null,
    data_abertura: now,
    data_atualizacao: now,
  };

  const demandas = await readDemandasLocal();
  demandas.unshift(demanda);
  await writeDemandasLocal(demandas);

  return demanda;
}

export async function updateDemanda(id: string, input: UpdateDemandaInput) {
  if (canUseBigQuery()) {
    return updateDemandaBigQuery(id, input);
  }

  const parsed = updateDemandaSchema.parse(input);
  const demandas = await readDemandasLocal();
  const index = demandas.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const current = demandas[index];
  const nextStatus = parsed.status ?? current.status;
  const nextPriority = parsed.prioridade ?? current.prioridade;

  demandas[index] = {
    ...current,
    status: nextStatus as StatusDemanda,
    prioridade: nextPriority as PrioridadeDemanda,
    observacao: parsed.observacao ?? current.observacao,
    projeto_id: parsed.projeto_id === undefined ? current.projeto_id : parsed.projeto_id,
    data_atualizacao: new Date().toISOString(),
  };

  await writeDemandasLocal(demandas);
  return demandas[index];
}

export async function deleteDemanda(id: string) {
  if (canUseBigQuery()) {
    return deleteDemandaBigQuery(id);
  }

  const demandas = await readDemandasLocal();
  const filtered = demandas.filter((item) => item.id !== id);

  if (filtered.length === demandas.length) {
    return false;
  }

  await writeDemandasLocal(filtered);
  return true;
}
