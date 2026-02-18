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
    
    // Gerar ID único
    const id = crypto.randomUUID();
    
    const query = `
      INSERT INTO \`worlddata-439415.lpdados.itens_portal\` 
      (id, tipo, nome, descricao, link, area, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
      VALUES (@id, 'dashboard', @nome, @descricao, @link, @area, @data_inicio, CURRENT_TIMESTAMP(), @responsavel, @cliente, @observacao)
    `;

    const options = {
      query,
      params: {
        id,
        nome: data.nome,
        descricao: data.descricao || null,
        link: data.link || null,
        area: data.area || null,
        data_inicio: data.data_inicio || null,
        responsavel: data.responsavel || null,
        cliente: data.cliente || null,
        observacao: data.observacao || null,
      },
      types: {
        id: 'STRING',
        nome: 'STRING',
        descricao: 'STRING',
        link: 'STRING',
        area: 'STRING',
        data_inicio: 'DATE',
        responsavel: 'STRING',
        cliente: 'STRING',
        observacao: 'STRING',
      },
    };

    await bigquery.query(options);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao criar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao criar dashboard', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
