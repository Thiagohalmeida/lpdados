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

function normalizeTipo(value: unknown): 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta' {
  const tipo = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (ALLOWED_TYPES.has(tipo)) {
    return tipo as 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta';
  }
  return 'projeto';
}

async function checkAuth() {
  return isAdminRequestAuthorized();
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const tipo = normalizeTipo(data.tipo);

    const id = crypto.randomUUID();

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

    const query = `
      INSERT INTO \`worlddata-439415.lpdados.itens_portal\`
      (id, tipo, nome, descricao, status, link, area, proxima_atualizacao, tecnologias, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
      VALUES (@id, @tipo, @nome, @descricao, @status, @link, @area, @proxima_atualizacao, @tecnologias, @data_inicio, CURRENT_TIMESTAMP(), @responsavel, @cliente, @observacao)
    `;

    const options = {
      query,
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
    };

    await bigquery.query(options);

    return NextResponse.json({ success: true, id, tipo });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    return NextResponse.json(
      { error: 'Erro ao criar item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
