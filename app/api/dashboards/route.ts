// pages/api/dashboards.ts (or app/api/dashboards/route.ts in Next 13)
import { BigQuery } from '@google-cloud/bigquery';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const bigquery = new BigQuery();  // uses credentials from env or GCP setup

export async function GET(_req: NextRequest) {
  try {
    const query = `SELECT Nome, Descricao, Link, Area 
                   FROM \`worlddata-439415.lpdados.dashboard\``;
    const options = { query: query };
    const [rows] = await bigquery.query(options);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return NextResponse.json({ error: 'Erro ao consultar dados do BigQuery' }, { status: 500 });
  }
}
