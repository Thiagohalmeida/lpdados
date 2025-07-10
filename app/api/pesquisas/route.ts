import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: 'worlddata-439415',
});

export async function GET() {
  try {
    const query = `
      SELECT *
      FROM \`worlddata-439415.lpdados.pesquisas\`
      LIMIT 100
    `;
    const [rows] = await bigquery.query({ query });
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return NextResponse.json({ error: 'Erro ao consultar dados do BigQuery' }, { status: 500 });
  }
}
