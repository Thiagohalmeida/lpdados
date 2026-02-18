import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

export async function GET() {
  try {
    const tables = ['projeto', 'dashboard', 'docs', 'ferramentas', 'pesquisas'];
    const results: Record<string, any> = {};

    for (const table of tables) {
      const query = `SELECT * FROM \`worlddata-439415.lpdados.${table}\` LIMIT 2`;
      const [rows] = await bigquery.query({ query });
      
      results[table] = {
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        sampleData: rows,
      };
    }
    
    return NextResponse.json({
      success: true,
      tables: results,
    });
  } catch (error) {
    console.error('Erro ao buscar tabelas:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar tabelas', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
