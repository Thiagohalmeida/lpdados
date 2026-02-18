// app/api/docs/route.ts
import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import type { Documentacao } from '@/types/bi-platform';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

export async function GET() {
  try {
    // Usar a view de docs que filtra por tipo='documentacao'
    const query = `SELECT * FROM \`worlddata-439415.lpdados.docs_v1\``;
    const [rows] = await bigquery.query({ query });
    
    const normalized = (rows as any[]).map((item, i) => {
      const extractValue = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) return val.value;
        return val;
      };

      const out: Record<string, any> = {};
      for (const key in item) {
        out[key] = extractValue(item[key]);
      }

      const nome = out.nome || out.Nome || out.Processo || '';

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
    
    return NextResponse.json(normalized as Documentacao[]);
  } catch (error) {
    console.error('Erro ao buscar documentação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar documentação' },
      { status: 500 }
    );
  }
}