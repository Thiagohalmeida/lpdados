import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

// GET - Buscar item específico por ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const query = `
      SELECT * FROM \`worlddata-439415.lpdados.itens_portal\`
      WHERE id = @id
      LIMIT 1
    `;

    const options = {
      query,
      params: { id },
    };

    const [rows] = await bigquery.query(options);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar item existente
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      nome,
      descricao,
      link,
      area,
      status,
      proxima_atualizacao,
      tecnologias,
      data_inicio,
      responsavel,
      cliente,
      observacao,
    } = body;

    const query = `
      UPDATE \`worlddata-439415.lpdados.itens_portal\`
      SET 
        nome = @nome,
        descricao = @descricao,
        link = @link,
        area = @area,
        status = @status,
        proxima_atualizacao = @proxima_atualizacao,
        tecnologias = @tecnologias,
        data_inicio = @data_inicio,
        ultima_atualizacao = CURRENT_TIMESTAMP(),
        responsavel = @responsavel,
        cliente = @cliente,
        observacao = @observacao
      WHERE id = @id
    `;

    const options = {
      query,
      params: {
        id,
        nome: nome || null,
        descricao: descricao || null,
        link: link || null,
        area: area || null,
        status: status || null,
        proxima_atualizacao: proxima_atualizacao || null,
        tecnologias: Array.isArray(tecnologias) ? tecnologias : [],
        data_inicio: data_inicio || null,
        responsavel: responsavel || null,
        cliente: cliente || null,
        observacao: observacao || null,
      },
      types: {
        id: 'STRING',
        nome: 'STRING',
        descricao: 'STRING',
        link: 'STRING',
        area: 'STRING',
        status: 'STRING',
        proxima_atualizacao: 'STRING',
        tecnologias: ['STRING'],
        data_inicio: 'DATE',
        responsavel: 'STRING',
        cliente: 'STRING',
        observacao: 'STRING',
      },
    };

    await bigquery.query(options);

    return NextResponse.json({ success: true, message: 'Item atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar item
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const query = `
      DELETE FROM \`worlddata-439415.lpdados.itens_portal\`
      WHERE id = @id
    `;

    const options = {
      query,
      params: { id },
    };

    await bigquery.query(options);

    return NextResponse.json({ success: true, message: 'Item deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

