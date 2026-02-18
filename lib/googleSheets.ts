// lib/googleSheets.ts
import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.PROJECT_ID || "worlddata-439415",
});

export async function getDocsFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.docs_v1\`
    LIMIT 100
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}

export async function getPesquisasFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.pesquisas_v1\`
    LIMIT 1000
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}

export async function getDashboardsFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.dashboards_v1\`
    LIMIT 100
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}

export async function getFerramentasFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.ferramentas_v1\`
    LIMIT 100
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}

export async function getProjetosFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.projetos_v1\`
    LIMIT 100
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}
