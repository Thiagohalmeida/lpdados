import { BigQuery } from "@google-cloud/bigquery";
import { z } from "zod";
import type { StatusTabela, TabelaBigQueryCatalogo, TabelaStatus } from "@/types/bi-platform";

const projectId = process.env.PROJECT_ID || "worlddata-439415";
const datasetId = process.env.BIGQUERY_DATASET || "lpdados";
const tableName = process.env.BIGQUERY_TABELAS_STATUS_TABLE || "tabelas_status";

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId,
});

export class TabelaStatusValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TabelaStatusValidationError";
  }
}

const createTabelaStatusSchema = z.object({
  dataset_name: z.string().trim().min(1, "Selecione o dataset da tabela."),
  table_name: z.string().trim().min(1, "Selecione a tabela a ser monitorada."),
  nome_tabela: z.string().trim().min(2, "Informe o nome de exibicao.").max(120, "O nome de exibicao pode ter no maximo 120 caracteres."),
  descricao: z.string().trim().max(500, "A descricao pode ter no maximo 500 caracteres.").optional().or(z.literal("")),
  proxima_atualizacao: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ok", "alerta", "atrasado"]),
  impacto: z.string().trim().max(500, "O impacto pode ter no maximo 500 caracteres.").optional().or(z.literal("")),
  responsavel: z.string().trim().max(120, "O responsavel pode ter no maximo 120 caracteres.").optional().or(z.literal("")),
  fonte: z.string().trim().max(120, "A fonte pode ter no maximo 120 caracteres.").optional().or(z.literal("")),
  observacao: z.string().trim().max(1000, "A observacao pode ter no maximo 1000 caracteres.").optional().or(z.literal("")),
  ativo_portal: z.boolean().default(true),
});

const updateTabelaStatusSchema = z.object({
  nome_tabela: z.string().trim().min(2, "Informe o nome de exibicao.").max(120, "O nome de exibicao pode ter no maximo 120 caracteres.").optional(),
  descricao: z.string().trim().max(500, "A descricao pode ter no maximo 500 caracteres.").optional(),
  proxima_atualizacao: z.string().trim().max(120, "A proxima atualizacao pode ter no maximo 120 caracteres.").optional(),
  status: z.enum(["ok", "alerta", "atrasado"]).optional(),
  impacto: z.string().trim().max(500, "O impacto pode ter no maximo 500 caracteres.").optional(),
  responsavel: z.string().trim().max(120, "O responsavel pode ter no maximo 120 caracteres.").optional(),
  fonte: z.string().trim().max(120, "A fonte pode ter no maximo 120 caracteres.").optional(),
  observacao: z.string().trim().max(1000, "A observacao pode ter no maximo 1000 caracteres.").optional(),
  ativo_portal: z.boolean().optional(),
});

export type CreateTabelaStatusInput = z.infer<typeof createTabelaStatusSchema>;
export type UpdateTabelaStatusInput = z.infer<typeof updateTabelaStatusSchema>;

function configTableRef() {
  return `\`${projectId}.${datasetId}.${tableName}\``;
}

function extractValue(val: unknown) {
  if (val && typeof val === "object" && "value" in (val as Record<string, unknown>)) {
    return (val as { value: unknown }).value;
  }
  return val;
}

function normalizeConfigRow(row: Record<string, unknown>): TabelaStatus {
  const out: Record<string, unknown> = {};
  for (const key in row) {
    out[key] = extractValue(row[key]);
  }

  return {
    id: String(out.id || ""),
    dataset_name: out.dataset_name ? String(out.dataset_name) : undefined,
    table_name: out.table_name ? String(out.table_name) : undefined,
    nome_tabela: String(out.nome_tabela || out.table_name || ""),
    descricao: out.descricao ? String(out.descricao) : undefined,
    ultima_atualizacao: out.ultima_atualizacao ? String(out.ultima_atualizacao) : undefined,
    proxima_atualizacao: out.proxima_atualizacao ? String(out.proxima_atualizacao) : undefined,
    status: String(out.status || "ok") as StatusTabela,
    impacto: out.impacto ? String(out.impacto) : undefined,
    responsavel: out.responsavel ? String(out.responsavel) : undefined,
    fonte: out.fonte ? String(out.fonte) : undefined,
    observacao: out.observacao ? String(out.observacao) : undefined,
    ativo_portal: typeof out.ativo_portal === "boolean" ? out.ativo_portal : out.ativo_portal === "true" || out.ativo_portal === "1",
  };
}

function normalizeCatalogRow(row: Record<string, unknown>): TabelaBigQueryCatalogo {
  const out: Record<string, unknown> = {};
  for (const key in row) {
    out[key] = extractValue(row[key]);
  }

  const rawLastUpdated = out.last_updated ? String(out.last_updated) : undefined;
  const normalizedLastUpdated =
    rawLastUpdated && /^\d+$/.test(rawLastUpdated)
      ? new Date(Number(rawLastUpdated)).toISOString()
      : rawLastUpdated;

  return {
    dataset_name: String(out.dataset_name || ""),
    table_name: String(out.table_name || ""),
    last_updated: normalizedLastUpdated,
  };
}

export async function listBigQueryTableCatalog() {
  const [datasets] = await bigquery.getDatasets();
  const catalog = await Promise.all(
    datasets.map(async (dataset) => {
      try {
        const [tables] = await dataset.getTables({ autoPaginate: true });

        const entries = await Promise.all(
          tables.map(async (table) => {
            try {
              const [metadata] = await table.getMetadata();
              return normalizeCatalogRow({
                dataset_name: dataset.id,
                table_name: table.id,
                last_updated: metadata.lastModifiedTime,
              });
            } catch {
              return null;
            }
          })
        );

        return entries.filter((item): item is TabelaBigQueryCatalogo => item !== null);
      } catch {
        return [];
      }
    })
  );

  return catalog
    .flat()
    .filter((item) => item.dataset_name && item.table_name)
    .sort((a, b) => {
      const datasetCompare = a.dataset_name.localeCompare(b.dataset_name);
      return datasetCompare !== 0 ? datasetCompare : a.table_name.localeCompare(b.table_name);
    });
}

async function listTabelaStatusConfigs() {
  const [rows] = await bigquery.query({
    query: `
      SELECT *
      FROM ${configTableRef()}
      ORDER BY nome_tabela ASC
    `,
  });

  return (rows as Record<string, unknown>[]).map(normalizeConfigRow);
}

export async function listTabelasStatus(options?: { activeOnly?: boolean }) {
  const [configs, catalog] = await Promise.all([listTabelaStatusConfigs(), listBigQueryTableCatalog()]);
  const catalogMap = new Map(
    catalog.map((item) => [`${item.dataset_name}.${item.table_name}`, item])
  );

  const items = configs
    .filter((item) => (options?.activeOnly ? item.ativo_portal !== false : true))
    .map((item) => {
      const catalogItem =
        item.dataset_name && item.table_name
          ? catalogMap.get(`${item.dataset_name}.${item.table_name}`)
          : undefined;

      return {
        ...item,
        ultima_atualizacao: catalogItem?.last_updated || item.ultima_atualizacao,
      };
    });

  return items;
}

export async function createTabelaStatus(input: CreateTabelaStatusInput) {
  const parsed = createTabelaStatusSchema.parse(input);
  const existing = (await listTabelaStatusConfigs()).find(
    (item) => item.dataset_name === parsed.dataset_name && item.table_name === parsed.table_name
  );

  if (existing) {
    throw new TabelaStatusValidationError("Esta tabela ja foi priorizada no monitoramento.");
  }

  const item: TabelaStatus = {
    id: crypto.randomUUID(),
    dataset_name: parsed.dataset_name,
    table_name: parsed.table_name,
    nome_tabela: parsed.nome_tabela,
    descricao: parsed.descricao || undefined,
    proxima_atualizacao: parsed.proxima_atualizacao || undefined,
    status: parsed.status,
    impacto: parsed.impacto || undefined,
    responsavel: parsed.responsavel || undefined,
    fonte: parsed.fonte || undefined,
    observacao: parsed.observacao || undefined,
    ativo_portal: parsed.ativo_portal,
  };

  await bigquery.query({
    query: `
      INSERT INTO ${configTableRef()}
      (id, dataset_name, table_name, nome_tabela, descricao, proxima_atualizacao, status, impacto, responsavel, fonte, observacao, ativo_portal)
      VALUES (@id, @dataset_name, @table_name, @nome_tabela, @descricao, @proxima_atualizacao, @status, @impacto, @responsavel, @fonte, @observacao, @ativo_portal)
    `,
    params: {
      id: item.id,
      dataset_name: item.dataset_name,
      table_name: item.table_name,
      nome_tabela: item.nome_tabela,
      descricao: item.descricao || null,
      proxima_atualizacao: item.proxima_atualizacao || null,
      status: item.status,
      impacto: item.impacto || null,
      responsavel: item.responsavel || null,
      fonte: item.fonte || null,
      observacao: item.observacao || null,
      ativo_portal: item.ativo_portal ?? true,
    },
    types: {
      id: "STRING",
      dataset_name: "STRING",
      table_name: "STRING",
      nome_tabela: "STRING",
      descricao: "STRING",
      proxima_atualizacao: "STRING",
      status: "STRING",
      impacto: "STRING",
      responsavel: "STRING",
      fonte: "STRING",
      observacao: "STRING",
      ativo_portal: "BOOL",
    },
  });

  return item;
}

export async function updateTabelaStatus(id: string, input: UpdateTabelaStatusInput) {
  const parsed = updateTabelaStatusSchema.parse(input);
  const current = (await listTabelaStatusConfigs()).find((item) => item.id === id);

  if (!current) {
    return null;
  }

  const next: TabelaStatus = {
    ...current,
    nome_tabela: parsed.nome_tabela ?? current.nome_tabela,
    descricao: parsed.descricao === "" ? undefined : parsed.descricao ?? current.descricao,
    proxima_atualizacao:
      parsed.proxima_atualizacao === "" ? undefined : parsed.proxima_atualizacao ?? current.proxima_atualizacao,
    status: (parsed.status ?? current.status) as StatusTabela,
    impacto: parsed.impacto === "" ? undefined : parsed.impacto ?? current.impacto,
    responsavel: parsed.responsavel === "" ? undefined : parsed.responsavel ?? current.responsavel,
    fonte: parsed.fonte === "" ? undefined : parsed.fonte ?? current.fonte,
    observacao: parsed.observacao === "" ? undefined : parsed.observacao ?? current.observacao,
    ativo_portal: parsed.ativo_portal ?? current.ativo_portal,
  };

  await bigquery.query({
    query: `
      UPDATE ${configTableRef()}
      SET
        nome_tabela = @nome_tabela,
        descricao = @descricao,
        proxima_atualizacao = @proxima_atualizacao,
        status = @status,
        impacto = @impacto,
        responsavel = @responsavel,
        fonte = @fonte,
        observacao = @observacao,
        ativo_portal = @ativo_portal
      WHERE id = @id
    `,
    params: {
      id,
      nome_tabela: next.nome_tabela,
      descricao: next.descricao || null,
      proxima_atualizacao: next.proxima_atualizacao || null,
      status: next.status,
      impacto: next.impacto || null,
      responsavel: next.responsavel || null,
      fonte: next.fonte || null,
      observacao: next.observacao || null,
      ativo_portal: next.ativo_portal ?? true,
    },
    types: {
      id: "STRING",
      nome_tabela: "STRING",
      descricao: "STRING",
      proxima_atualizacao: "STRING",
      status: "STRING",
      impacto: "STRING",
      responsavel: "STRING",
      fonte: "STRING",
      observacao: "STRING",
      ativo_portal: "BOOL",
    },
  });

  return next;
}

export async function deleteTabelaStatus(id: string) {
  const [rows] = await bigquery.query({
    query: `SELECT id FROM ${configTableRef()} WHERE id = @id LIMIT 1`,
    params: { id },
    types: { id: "STRING" },
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  await bigquery.query({
    query: `DELETE FROM ${configTableRef()} WHERE id = @id`,
    params: { id },
    types: { id: "STRING" },
  });

  return true;
}
