import { BigQuery } from '@google-cloud/bigquery';
import { createHash, randomUUID } from 'crypto';

const PROJECT_ID = process.env.PROJECT_ID || 'worlddata-439415';
const TELEMETRY_TABLE = 'worlddata-439415.lpdados.portal_telemetry_events';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: PROJECT_ID,
});

export type TelemetryEventInput = {
  userEmail: string;
  eventType: string;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  sessionId?: string;
  userAgent?: string;
  ipHash?: string;
  metadataJson?: string;
};

export function getTelemetryTable() {
  return TELEMETRY_TABLE;
}

export function getTelemetryBigQuery() {
  return bigquery;
}

export function toSha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function normalizePagePath(pagePath: string) {
  const value = (pagePath || '').trim();
  if (!value) return '';
  if (value.startsWith('/')) return value;
  return `/${value}`;
}

export function shouldTrackPage(pagePath: string) {
  const path = normalizePagePath(pagePath).toLowerCase();
  if (!path) return false;

  const allowedPrefixes = [
    '/portal',
    '/projetos/',
    '/dashboards/',
    '/docs/',
    '/ferramentas/',
    '/pesquisas/',
    '/central-ajuda',
  ];

  return allowedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix));
}

export async function insertTelemetryEvent(input: TelemetryEventInput) {
  const query = `
    INSERT INTO \`${TELEMETRY_TABLE}\`
      (event_id, event_ts, user_email, event_type, page_path, page_title, referrer, session_id, user_agent, ip_hash, metadata_json)
    VALUES
      (
        @event_id,
        CURRENT_TIMESTAMP(),
        @user_email,
        @event_type,
        @page_path,
        NULLIF(@page_title, ''),
        NULLIF(@referrer, ''),
        NULLIF(@session_id, ''),
        NULLIF(@user_agent, ''),
        NULLIF(@ip_hash, ''),
        PARSE_JSON(@metadata_json)
      )
  `;

  await bigquery.query({
    query,
    params: {
      event_id: randomUUID(),
      user_email: input.userEmail.toLowerCase(),
      event_type: input.eventType || 'page_view',
      page_path: normalizePagePath(input.pagePath),
      page_title: input.pageTitle || '',
      referrer: input.referrer || '',
      session_id: input.sessionId || '',
      user_agent: input.userAgent || '',
      ip_hash: input.ipHash || '',
      metadata_json: input.metadataJson || '{}',
    },
    types: {
      event_id: 'STRING',
      user_email: 'STRING',
      event_type: 'STRING',
      page_path: 'STRING',
      page_title: 'STRING',
      referrer: 'STRING',
      session_id: 'STRING',
      user_agent: 'STRING',
      ip_hash: 'STRING',
      metadata_json: 'STRING',
    },
  });
}
