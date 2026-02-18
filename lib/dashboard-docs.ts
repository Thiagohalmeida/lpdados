import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = process.env.PROJECT_ID || 'worlddata-439415';
const DATASET = 'worlddata-439415.lpdados';

const TABLE_VIEWS = `${DATASET}.dashboard_doc_views`;
const TABLE_INSIGHTS = `${DATASET}.dashboard_doc_insights`;
const TABLE_GLOSSARY = `${DATASET}.dashboard_doc_glossary`;

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: PROJECT_ID,
});

export type DashboardDocViewType = 'analysis' | 'glossary' | 'mixed';

export interface DashboardDocInsight {
  insight_id: string;
  title: string;
  description: string;
  notes: string[];
  tags: string[];
  sort_order: number;
}

export interface DashboardDocGlossaryField {
  field_id: string;
  name: string;
  description: string;
  formula: string | null;
  example: string | null;
  unit: string | null;
  tags: string[];
  sort_order: number;
}

export interface DashboardDocView {
  view_id: string;
  title: string;
  view_type: DashboardDocViewType;
  source: string | null;
  version: string | null;
  generated_at: string | null;
  sort_order: number;
  status: string;
  metric_owner: string | null;
  data_source: string | null;
  insights: DashboardDocInsight[];
  glossary_fields: DashboardDocGlossaryField[];
}

export interface DashboardDocsPayload {
  version: string;
  generated_at: string;
  source: string;
  dashboard_id: string;
  views: DashboardDocView[];
}

function unwrapValue(value: any): any {
  if (value && typeof value === 'object' && 'value' in value) {
    return value.value;
  }
  return value;
}

function normalizeRow(row: any): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key in row) {
    out[key] = unwrapValue(row[key]);
  }
  return out;
}

function toSlug(input: string, fallback: string): string {
  const base = String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return base || fallback;
}

function toStringOrNull(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function toStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) return [];

  return value
    .map(item => {
      const normalized = unwrapValue(item);
      return normalized === undefined || normalized === null ? '' : String(normalized).trim();
    })
    .filter(Boolean);
}

function toInt(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function normalizeGeneratedAt(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  const asString = toStringOrNull(value);
  if (!asString) return new Date().toISOString();

  const parsed = new Date(asString);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();

  return parsed.toISOString();
}

function normalizeViewType(value: unknown): DashboardDocViewType {
  const current = String(value || '').toLowerCase();
  if (current === 'analysis' || current === 'glossary' || current === 'mixed') {
    return current;
  }
  return 'mixed';
}

function firstArray(...candidates: unknown[]): unknown[] {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function pickString(...candidates: unknown[]): string {
  for (const candidate of candidates) {
    const text = toStringOrNull(candidate);
    if (text) return text;
  }
  return '';
}

function pickStringOrNull(...candidates: unknown[]): string | null {
  for (const candidate of candidates) {
    const text = toStringOrNull(candidate);
    if (text) return text;
  }
  return null;
}

function normalizeInsights(rawInsights: unknown[]): DashboardDocInsight[] {
  return rawInsights.map((raw, index) => {
    const insight = (raw || {}) as Record<string, unknown>;
    const title = pickString(insight.title, insight.name, insight.nome, insight.insight);
    const description = pickString(insight.description, insight.descricao, insight.texto, insight.resumo);

    return {
      insight_id: toSlug(String(insight.insight_id || title || `insight_${index + 1}`), `insight_${index + 1}`),
      title: title || `Insight ${index + 1}`,
      description,
      notes: toStringArray((insight.notes ?? insight.observacoes ?? insight.notas) as unknown),
      tags: toStringArray(insight.tags),
      sort_order: toInt(insight.sort_order, index),
    };
  });
}

function normalizeGlossary(rawGlossary: unknown[]): DashboardDocGlossaryField[] {
  return rawGlossary.map((raw, index) => {
    const field = (raw || {}) as Record<string, unknown>;
    const name = pickString(field.name, field.nome, field.campo, field.metrica);
    const description = pickString(field.description, field.descricao, field.definicao);

    return {
      field_id: toSlug(String(field.field_id || name || `field_${index + 1}`), `field_${index + 1}`),
      name: name || `Campo ${index + 1}`,
      description,
      formula: pickStringOrNull(field.formula, field.calculo),
      example: pickStringOrNull(field.example, field.exemplo),
      unit: pickStringOrNull(field.unit, field.unidade),
      tags: toStringArray(field.tags),
      sort_order: toInt(field.sort_order, index),
    };
  });
}

export function normalizeDashboardDocsPayload(rawBody: unknown, forcedDashboardId?: string): DashboardDocsPayload {
  const raw = (rawBody || {}) as Record<string, any>;
  const dashboardId = String(forcedDashboardId || raw.dashboard_id || '').trim();

  if (!dashboardId) {
    throw new Error('dashboard_id e obrigatorio.');
  }

  const viewsInput = firstArray(raw.views, raw.tabs, raw.guias, raw.sections, raw.paginas);

  const views: DashboardDocView[] = viewsInput.map((rawView, index) => {
    const view = (rawView || {}) as Record<string, unknown>;
    const title = pickString(view.title, view.nome, view.name, view.tab_name, view.guia);

    const insightsInput = firstArray(
      view.insights,
      view.items,
      view.analises,
      view.analysis,
      view.insights_list
    );

    const glossaryInput = firstArray(
      view.glossary_fields,
      view.glossary,
      view.dicionario,
      view.fields,
      view.campos
    );

    return {
      view_id: toSlug(
        String(view.view_id || view.tab_id || view.guia_id || title || `view_${index + 1}`),
        `view_${index + 1}`
      ),
      title: title || `View ${index + 1}`,
      view_type: normalizeViewType(view.view_type),
      source: pickStringOrNull(view.source, raw.source),
      version: pickStringOrNull(view.version, raw.version),
      generated_at: pickStringOrNull(view.generated_at, raw.generated_at),
      sort_order: toInt(view.sort_order, index),
      status: String(view.status || 'ativo').toLowerCase(),
      metric_owner: pickStringOrNull(view.metric_owner, view.owner),
      data_source: pickStringOrNull(view.data_source, view.fonte_dados),
      insights: normalizeInsights(insightsInput),
      glossary_fields: normalizeGlossary(glossaryInput),
    };
  });

  return {
    version: String(raw.version || '1.0.0'),
    generated_at: normalizeGeneratedAt(raw.generated_at),
    source: String(raw.source || 'Dashboard docs import'),
    dashboard_id: dashboardId,
    views,
  };
}

export async function dashboardExists(dashboardId: string): Promise<boolean> {
  const query = `
    SELECT id
    FROM \`${DATASET}.itens_portal\`
    WHERE id = @dashboard_id AND tipo = 'dashboard'
    LIMIT 1
  `;

  const [rows] = await bigquery.query({
    query,
    params: { dashboard_id: dashboardId },
    types: { dashboard_id: 'STRING' },
  });

  return rows.length > 0;
}

export async function getDashboardDocsPayload(dashboardId: string): Promise<DashboardDocsPayload | null> {
  const [viewRowsRaw, insightRowsRaw, glossaryRowsRaw] = await Promise.all([
    bigquery.query({
      query: `
        SELECT
          dashboard_id,
          view_id,
          title,
          view_type,
          source,
          version,
          generated_at,
          sort_order,
          status,
          metric_owner,
          data_source
        FROM \`${TABLE_VIEWS}\`
        WHERE dashboard_id = @dashboard_id AND status = 'ativo'
        ORDER BY sort_order, title
      `,
      params: { dashboard_id: dashboardId },
      types: { dashboard_id: 'STRING' },
    }),
    bigquery.query({
      query: `
        SELECT
          dashboard_id,
          view_id,
          insight_id,
          title,
          description,
          notes,
          tags,
          sort_order
        FROM \`${TABLE_INSIGHTS}\`
        WHERE dashboard_id = @dashboard_id AND is_active = TRUE
        ORDER BY view_id, sort_order, title
      `,
      params: { dashboard_id: dashboardId },
      types: { dashboard_id: 'STRING' },
    }),
    bigquery.query({
      query: `
        SELECT
          dashboard_id,
          view_id,
          field_id,
          name,
          description,
          formula,
          example,
          unit,
          tags,
          sort_order
        FROM \`${TABLE_GLOSSARY}\`
        WHERE dashboard_id = @dashboard_id AND is_active = TRUE
        ORDER BY view_id, sort_order, name
      `,
      params: { dashboard_id: dashboardId },
      types: { dashboard_id: 'STRING' },
    }),
  ]);

  const viewRows = (viewRowsRaw[0] as any[]).map(normalizeRow);
  const insightRows = (insightRowsRaw[0] as any[]).map(normalizeRow);
  const glossaryRows = (glossaryRowsRaw[0] as any[]).map(normalizeRow);

  if (viewRows.length === 0) {
    return null;
  }

  const viewsMap = new Map<string, DashboardDocView>();

  for (const row of viewRows) {
    viewsMap.set(String(row.view_id), {
      view_id: String(row.view_id),
      title: String(row.title || row.view_id),
      view_type: normalizeViewType(row.view_type),
      source: toStringOrNull(row.source),
      version: toStringOrNull(row.version),
      generated_at: toStringOrNull(row.generated_at),
      sort_order: toInt(row.sort_order),
      status: String(row.status || 'ativo'),
      metric_owner: toStringOrNull(row.metric_owner),
      data_source: toStringOrNull(row.data_source),
      insights: [],
      glossary_fields: [],
    });
  }

  for (const row of insightRows) {
    const viewId = String(row.view_id);
    const current = viewsMap.get(viewId);
    if (!current) continue;

    current.insights.push({
      insight_id: String(row.insight_id),
      title: String(row.title || ''),
      description: String(row.description || ''),
      notes: toStringArray(row.notes),
      tags: toStringArray(row.tags),
      sort_order: toInt(row.sort_order),
    });
  }

  for (const row of glossaryRows) {
    const viewId = String(row.view_id);
    const current = viewsMap.get(viewId);
    if (!current) continue;

    current.glossary_fields.push({
      field_id: String(row.field_id),
      name: String(row.name || ''),
      description: String(row.description || ''),
      formula: toStringOrNull(row.formula),
      example: toStringOrNull(row.example),
      unit: toStringOrNull(row.unit),
      tags: toStringArray(row.tags),
      sort_order: toInt(row.sort_order),
    });
  }

  const views = Array.from(viewsMap.values()).sort((a, b) => a.sort_order - b.sort_order);
  const firstView = views[0];

  return {
    version: firstView.version || '1.0.0',
    generated_at: firstView.generated_at || new Date().toISOString(),
    source: firstView.source || 'Dashboard docs',
    dashboard_id: dashboardId,
    views,
  };
}

export function getDashboardDocsBigQuery() {
  return bigquery;
}

export const dashboardDocsTables = {
  DATASET,
  TABLE_VIEWS,
  TABLE_INSIGHTS,
  TABLE_GLOSSARY,
  TABLE_PAYLOADS: `${DATASET}.dashboard_doc_payloads`,
};
