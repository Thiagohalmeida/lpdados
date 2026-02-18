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
      INSERT INTO \`worlddata-439415.lpdados.docs\` 
      (Processo, Link, Area, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
      VALUES (@processo, @link, @area, @data_inicio, CURRENT_TIMESTAMP(), @responsavel, @cliente, @observacao)
    `;

    await bigquery.query({
      query,
      params: {
        processo: data.nome,
        link: data.link || null,
        area: data.area,
        data_inicio: data.data_inicio || null,
        responsavel: data.responsavel || null,
        cliente: data.cliente || null,
        observacao: data.observacao || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao criar doc:', error);
    return NextResponse.json(
      { error: 'Erro ao criar doc', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
