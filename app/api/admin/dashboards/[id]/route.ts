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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id } = await params;

    // Atualizar na tabela unificada itens_portal usando ID
    const updateQuery = `
      UPDATE \`worlddata-439415.lpdados.itens_portal\`
      SET 
        nome = @nome,
        descricao = @descricao,
        link = @link,
        area = @area,
        data_inicio = @data_inicio,
        ultima_atualizacao = CURRENT_TIMESTAMP(),
        responsavel = @responsavel,
        cliente = @cliente,
        observacao = @observacao
      WHERE id = @id AND tipo = 'dashboard'
    `;

    const options = {
      query: updateQuery,
      params: {
        id,
        nome: data.nome,
        descricao: data.descricao || null,
        link: data.link || null,
        area: data.area || null,
        data_inicio: (data.data_inicio && data.data_inicio.trim() !== '') ? data.data_inicio : null,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar dashboard', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Deletar da tabela unificada itens_portal usando ID
    const deleteQuery = `
      DELETE FROM \`worlddata-439415.lpdados.itens_portal\`
      WHERE id = @id AND tipo = 'dashboard'
    `;

    await bigquery.query({
      query: deleteQuery,
      params: { id },
      types: { id: 'STRING' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar dashboard', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
