import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const query = `
      INSERT INTO \`worlddata-439415.lpdados.ferramentas\` 
      (nome, descricao, link, proxatualizacao, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
      VALUES (@nome, @descricao, @link, @proxima_atualizacao, @data_inicio, CURRENT_TIMESTAMP(), @responsavel, @cliente, @observacao)
    `;

    await bigquery.query({
      query,
      params: {
        nome: data.nome,
        descricao: data.descricao,
        link: data.link || null,
        proxima_atualizacao: data.proxima_atualizacao || null,
        data_inicio: data.data_inicio || null,
        ultima_atualizacao: data.ultima_atualizacao || null,
        responsavel: data.responsavel || null,
        cliente: data.cliente || null,
        observacao: data.observacao || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao criar ferramenta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ferramenta', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
