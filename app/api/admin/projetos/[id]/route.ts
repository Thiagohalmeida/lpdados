import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/admin-access';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

const ALLOWED_TYPES = new Set(['projeto', 'dashboard', 'documentacao', 'ferramenta']);

function normalizeTipo(value: unknown): 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta' | null {
  const tipo = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (ALLOWED_TYPES.has(tipo)) {
    return tipo as 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta';
  }
  return null;
}

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

    const tipo =
      normalizeTipo(request.nextUrl.searchParams.get('tipo')) ||
      normalizeTipo(data.tipo) ||
      'projeto';

    const tecnologias = Array.isArray(data.tecnologias)
      ? data.tecnologias.map((item: unknown) => String(item).trim()).filter(Boolean)
      : [];

    const dataInicioBruta = data.data_inicio || data.data;
    const dataInicio =
      typeof dataInicioBruta === 'string' && dataInicioBruta.trim() !== ''
        ? dataInicioBruta
        : null;

    const status = typeof data.status === 'string' && data.status.trim() !== '' ? data.status : null;
    const proximaAtualizacao =
      typeof data.proxima_atualizacao === 'string' && data.proxima_atualizacao.trim() !== ''
        ? data.proxima_atualizacao
        : null;

    const updateQuery = `
      UPDATE \`worlddata-439415.lpdados.itens_portal\`
      SET
        tipo = @tipo,
        nome = @nome,
        descricao = @descricao,
        status = @status,
        link = @link,
        area = @area,
        proxima_atualizacao = @proxima_atualizacao,
        tecnologias = @tecnologias,
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
        tipo,
        nome: data.nome,
        descricao: data.descricao,
        status,
        link: data.link || null,
        area: data.area || null,
        proxima_atualizacao: proximaAtualizacao,
        tecnologias,
        data_inicio: dataInicio,
        responsavel: data.responsavel || null,
        cliente: data.cliente || null,
        observacao: data.observacao || null,
      },
      types: {
        id: 'STRING',
        tipo: 'STRING',
        nome: 'STRING',
        descricao: 'STRING',
        status: 'STRING',
        link: 'STRING',
        area: 'STRING',
        proxima_atualizacao: 'STRING',
        tecnologias: ['STRING'],
        data_inicio: 'DATE',
        responsavel: 'STRING',
        cliente: 'STRING',
        observacao: 'STRING',
      },
    });

    return NextResponse.json({ success: true, tipo });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const tipo = normalizeTipo(request.nextUrl.searchParams.get('tipo')) || 'projeto';

    const deleteQuery = `
      DELETE FROM \`worlddata-439415.lpdados.itens_portal\`
      WHERE id = @id AND tipo = @tipo
    `;

    await bigquery.query({
      query: deleteQuery,
      params: { id, tipo },
      types: {
        id: 'STRING',
        tipo: 'STRING',
      },
    });

    return NextResponse.json({ success: true, tipo });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
