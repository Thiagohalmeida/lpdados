// app/api/busca/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import type { ResultadoBusca } from '@/types/bi-platform';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Buscar TODOS os dados de cada tabela (sem filtro SQL)
    const queries = [
      bigquery.query({
        query: `SELECT * FROM \`worlddata-439415.lpdados.projetos_v1\``,
      }),
      bigquery.query({
        query: `SELECT * FROM \`worlddata-439415.lpdados.dashboards_v1\``,
      }),
      bigquery.query({
        query: `SELECT * FROM \`worlddata-439415.lpdados.docs_v1\``,
      }),
      bigquery.query({
        query: `SELECT * FROM \`worlddata-439415.lpdados.ferramentas_v1\``,
      }),
      bigquery.query({
        query: `SELECT * FROM \`worlddata-439415.lpdados.pesquisas_v1\``,
      }),
    ];

    // Executar todas as queries em paralelo
    const results = await Promise.all(queries);
    
    // Processar resultados
    const tipos = ['projeto', 'dashboard', 'doc', 'ferramenta', 'pesquisa'];
    const allRows: any[] = [];
    
    results.forEach(([rows], index) => {
      rows.forEach((row: any) => {
        allRows.push({ tipo: tipos[index], ...row });
      });
    });
    
    // Normalizar dados
    const normalized = allRows.map((row: any) => {
      const extractValue = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) return val.value;
        return val;
      };

      const item: any = {};
      for (const key in row) {
        item[key] = extractValue(row[key]);
      }
      return item;
    });
    
    // Filtrar por query (busca em JavaScript)
    const q = query.toLowerCase();
    const filtered = normalized.filter((item: any) => {
      const searchText = JSON.stringify(item).toLowerCase();
      return searchText.includes(q);
    });
    
    // Calcular score e ordenar
    const resultados: ResultadoBusca[] = filtered
      .map((item: any) => ({
        tipo: item.tipo,
        item,
        score: calculateScore(item, query),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Limitar a 20 resultados

    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar busca', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateScore(item: any, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  
  // Buscar em todos os campos do item
  const allText = JSON.stringify(item).toLowerCase();
  
  // Contar quantas vezes o termo aparece
  const matches = (allText.match(new RegExp(q, 'g')) || []).length;
  score = matches * 2;
  
  // Bonus se aparecer em campos principais
  const nome = String(item.nome || item.Nome || item.titulo || item.Titulo || '').toLowerCase();
  if (nome.includes(q)) score += 5;
  
  return score;
}
