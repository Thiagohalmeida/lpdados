// app/api/projetos/route.ts
import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import type { Projeto } from '@/types/bi-platform';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export async function GET() {
  try {
    // Usar a view de projetos que filtra por tipo='projeto'
    const query = `SELECT * FROM \`worlddata-439415.lpdados.projetos_v1\``;
    const [rows] = await bigquery.query({ query });
    
    // Normalizar dados para garantir compatibilidade
    const normalized = (rows as any[]).map((item, i) => {
      const extractValue = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) {
          return val.value;
        }
        return val;
      };

      const out: Record<string, any> = {};
      for (const key in item) {
        out[key] = extractValue(item[key]);
      }

      const nome = out.nome || out.Nome || out.projeto || '';

      return {
        id: out.id || out.Id || String(i),
        nome,
        descricao: out.descricao || out.Descricao || '',
        status: out.status || out.Status || 'standby',
        data: out.data || out.Data || '',
        link: out.link || out.Link || '',
        docs: out.docs || out.Docs || '',
        area: out.area || out.Area || 'Geral',
        tecnologias: normalizeStringArray(out.tecnologias ?? out.Tecnologias),
        data_inicio: out.data_inicio || null,
        ultima_atualizacao: out.ultima_atualizacao || null,
        responsavel: out.responsavel || null,
        cliente: out.cliente || null,
        observacao: out.observacao || null
      };
    });
    
    return NextResponse.json(normalized as Projeto[]);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar projetos' }, 
      { status: 500 }
    );
  }
}
