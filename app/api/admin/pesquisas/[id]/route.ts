import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/admin-access';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

async function checkAuth() {
  return isAdminRequestAuthorized();
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id } = await params;

    const updateQuery = `
      UPDATE \`worlddata-439415.lpdados.pesquisas\`
      SET
        titulo = @titulo,
        fonte = @fonte,
        link = @link,
        data = @data,
        conteudo = @conteudo,
        tema = @tema,
        data_inicio = @data_inicio,
        ultima_atualizacao = CURRENT_TIMESTAMP(),
        responsavel = @responsavel,
        cliente = @cliente,
        observacao = @observacao
      WHERE id = @id
    `;

    await bigquery.query({
      query: updateQuery,
      params: {
        id,
        titulo: data.titulo,
        fonte: data.fonte,
        link: data.link || null,
        data: data.data,
        conteudo: data.conteudo,
        tema: data.tema,
        data_inicio: data.data_inicio || null,
        responsavel: data.responsavel || null,
        cliente: data.cliente || null,
        observacao: data.observacao || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar pesquisa:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pesquisa', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const deleteQuery = `
      DELETE FROM \`worlddata-439415.lpdados.pesquisas\`
      WHERE id = @id
    `;

    await bigquery.query({
      query: deleteQuery,
      params: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar pesquisa:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar pesquisa', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
