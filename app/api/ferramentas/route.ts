import { BigQuery } from '@google-cloud/bigquery';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

export async function GET(_req: NextRequest) {
  try {
    const query = `SELECT Nome, Descricao, Link, ProxAtualizacao 
                   FROM \`worlddata-439415.lpdados.ferramentas\``;
    const options = { query };
    const [rows] = await bigquery.query(options);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return NextResponse.json({ error: 'Erro ao consultar dados do BigQuery' }, { status: 500 });
  }
}
  