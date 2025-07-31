// app/api/pesquisas/route.ts
import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

// Configura cliente BigQuery com credenciais e projectId
const bigquery = new BigQuery({
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * GET /api/pesquisas
 * Retorna registros de pesquisas normalizados
 */
export async function GET() {
  try {
    const query = `
      SELECT
        titulo,
        fonte,
        link,
        data,
        conteudo,
        tema
      FROM \`worlddata-439415.lpdados.pesquisas\`
      ORDER BY data DESC
      LIMIT 100
    `;

    const [rows] = await bigquery.query({ query });

    // Normaliza objetos { value } para valores primitivos
    const normalized = (rows as any[]).map((row) => {
      const out: Record<string, any> = {};
      for (const key of Object.keys(row)) {
        const val = (row as any)[key];
        out[key] = val && typeof val === 'object' && 'value' in val ? val.value : val;
      }
      return out;
    });

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar pesquisas' },
      { status: 500 }
    );
  }
}