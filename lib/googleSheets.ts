import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: 'worlddata-439415',
});

export async function getDocsFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.docs\`
    LIMIT 100
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}

export async function getPesquisasFromBigQuery() {
  const query = `
    SELECT *
    FROM \`worlddata-439415.lpdados.pesquisas\`
    LIMIT 100
  `;
  const [rows] = await bigquery.query({ query });
  return rows;
}
