// pages/api/dashboards.ts (or app/api/dashboards/route.ts in Next 13)
import { BigQuery } from '@google-cloud/bigquery';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { Dashboard } from '@/types/bi-platform';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

export async function GET(_req: NextRequest) {
  try {
    // Usar a view de dashboards que filtra por tipo='dashboard'
    const query = `SELECT * FROM \`worlddata-439415.lpdados.dashboards_v1\``;
    const options = { query: query };
    const [rows] = await bigquery.query(options);
    
    // Normalizar dados
    const normalized = (rows as any[]).map((item, i) => {
      const extractValue = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) return val.value;
        return val;
      };

      const out: Record<string, any> = {};
      for (const key in item) {
        out[key] = extractValue(item[key]);
      }

      const nome = out.nome || out.Nome || '';

      return {
        id: out.id || out.Id || String(i),
        nome,
        descricao: out.descricao || out.Descricao || '',
        link: out.link || out.Link || '',
        area: out.area || out.Area || 'Geral',
        data_inicio: out.data_inicio || null,
        ultima_atualizacao: out.ultima_atualizacao || null,
        responsavel: out.responsavel || null,
        cliente: out.cliente || null,
        observacao: out.observacao || null
      };
    });
    
    return NextResponse.json(normalized as Dashboard[]);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dashboards' }, 
      { status: 500 }
    );
  }
}