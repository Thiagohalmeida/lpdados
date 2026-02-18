import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

type PortalTipo = 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta';

export interface PortalItem {
  id: string;
  tipo: PortalTipo;
  nome: string;
  descricao: string;
  link: string;
  area: string;
  status: string | null;
  proxima_atualizacao: string | null;
  tecnologias: string[];
  data_inicio: string | null;
  ultima_atualizacao: string | null;
  responsavel: string | null;
  cliente: string | null;
  observacao: string | null;
  data?: string;
  docs?: string;
}

export interface PesquisaItem {
  id: string;
  titulo: string;
  fonte: string;
  link: string;
  data: string;
  conteudo: string;
  tema: string;
  data_inicio: string | null;
  ultima_atualizacao: string | null;
  responsavel: string | null;
  cliente: string | null;
  observacao: string | null;
}

function unwrapValue(value: unknown): unknown {
  if (value && typeof value === 'object' && 'value' in (value as Record<string, unknown>)) {
    return (value as Record<string, unknown>).value;
  }
  return value;
}

function normalizeRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key in row) {
    out[key] = unwrapValue(row[key]);
  }
  return out;
}

function asText(value: unknown, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function asNullableText(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function asArrayOfText(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(unwrapValue(v))).map((v) => v.trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function asDateLike(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  const text = String(value).trim();
  return text || null;
}

export function normalizeForUrl(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

function toPortalItem(raw: Record<string, unknown>): PortalItem {
  const out = normalizeRow(raw);
  return {
    id: asText(out.id),
    tipo: asText(out.tipo) as PortalTipo,
    nome: asText(out.nome),
    descricao: asText(out.descricao),
    link: asText(out.link),
    area: asText(out.area, 'Geral'),
    status: asNullableText(out.status),
    proxima_atualizacao: asDateLike(out.proxima_atualizacao),
    tecnologias: asArrayOfText(out.tecnologias),
    data_inicio: asDateLike(out.data_inicio),
    ultima_atualizacao: asDateLike(out.ultima_atualizacao),
    responsavel: asNullableText(out.responsavel),
    cliente: asNullableText(out.cliente),
    observacao: asNullableText(out.observacao),
    data: asNullableText(out.data) ?? '',
    docs: asNullableText(out.docs) ?? '',
  };
}

function toPesquisaItem(raw: Record<string, unknown>): PesquisaItem {
  const out = normalizeRow(raw);
  return {
    id: asText(out.id),
    titulo: asText(out.titulo),
    fonte: asText(out.fonte),
    link: asText(out.link),
    data: asDateLike(out.data) || '',
    conteudo: asText(out.conteudo),
    tema: asText(out.tema),
    data_inicio: asDateLike(out.data_inicio),
    ultima_atualizacao: asDateLike(out.ultima_atualizacao),
    responsavel: asNullableText(out.responsavel),
    cliente: asNullableText(out.cliente),
    observacao: asNullableText(out.observacao),
  };
}

export async function getPortalItemById(tipo: PortalTipo, id: string): Promise<PortalItem | null> {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.itens_portal\`
    WHERE tipo = @tipo AND id = @id
    LIMIT 1
  `;

  const [rows] = await bigquery.query({
    query,
    params: { tipo, id },
    types: { tipo: 'STRING', id: 'STRING' },
  });

  if (!Array.isArray(rows) || rows.length === 0) return null;
  return toPortalItem(rows[0] as Record<string, unknown>);
}

export async function listPortalItemsByTipo(tipo: PortalTipo): Promise<PortalItem[]> {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.itens_portal\`
    WHERE tipo = @tipo
  `;

  const [rows] = await bigquery.query({
    query,
    params: { tipo },
    types: { tipo: 'STRING' },
  });

  if (!Array.isArray(rows)) return [];
  return rows.map((row) => toPortalItem(row as Record<string, unknown>));
}

export async function findPortalItemByIdOrSlug(tipo: PortalTipo, idOrSlug: string): Promise<PortalItem | null> {
  const byId = await getPortalItemById(tipo, idOrSlug);
  if (byId) return byId;

  const normalizedTarget = normalizeForUrl(idOrSlug);
  const all = await listPortalItemsByTipo(tipo);
  return all.find((item) => normalizeForUrl(item.nome) === normalizedTarget) || null;
}

export async function getPesquisaById(id: string): Promise<PesquisaItem | null> {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.pesquisas\`
    WHERE id = @id
    LIMIT 1
  `;

  const [rows] = await bigquery.query({
    query,
    params: { id },
    types: { id: 'STRING' },
  });

  if (!Array.isArray(rows) || rows.length === 0) return null;
  return toPesquisaItem(rows[0] as Record<string, unknown>);
}

export async function listPesquisas(): Promise<PesquisaItem[]> {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.pesquisas\`
  `;

  const [rows] = await bigquery.query({ query });
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => toPesquisaItem(row as Record<string, unknown>));
}

export async function findPesquisaByIdOrSlug(idOrSlug: string): Promise<PesquisaItem | null> {
  const byId = await getPesquisaById(idOrSlug);
  if (byId) return byId;

  const normalizedTarget = normalizeForUrl(idOrSlug);
  const all = await listPesquisas();
  return all.find((item) => normalizeForUrl(item.titulo) === normalizedTarget) || null;
}
