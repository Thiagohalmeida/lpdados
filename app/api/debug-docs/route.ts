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
    // Buscar todos os docs para ver a estrutura
    const query = `
      SELECT *
      FROM \`worlddata-439415.lpdados.docs\`
      LIMIT 5
    `;
    
    const [rows] = await bigquery.query({ query });
    
    // Pegar os nomes das colunas do primeiro registro
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    
    return NextResponse.json({
      success: true,
      totalRows: rows.length,
      columns: columns,
      sampleData: rows,
    });
  } catch (error) {
    console.error('Erro ao buscar docs:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar docs', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
