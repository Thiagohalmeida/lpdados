import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';
import type { NextRequest } from 'next/server';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

// GET - Buscar itens (com filtro opcional por tipo)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo'); // 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta'
    
    let query = `SELECT * FROM \`worlddata-439415.lpdados.itens_portal\``;
    
    if (tipo) {
      query += ` WHERE tipo = @tipo`;
    }
    
    const options = {
      query,
      params: tipo ? { tipo } : undefined,
    };
    
    const [rows] = await bigquery.query(options);
    
    // Normalizar dados
    const normalized = (rows as any[]).map((item) => {
      const extractValue = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) return val.value;
        return val;
      };

      const out: Record<string, any> = {};
      for (const key in item) {
        out[key] = extractValue(item[key]);
      }

      return {
        id: out.id,
        tipo: out.tipo,
        nome: out.nome || '',
        descricao: out.descricao || '',
        link: out.link || '',
        area: out.area || 'Geral',
        status: out.status || null,
        proxima_atualizacao: out.proxima_atualizacao || null,
        tecnologias: out.tecnologias || [],
        data_inicio: out.data_inicio || null,
        ultima_atualizacao: out.ultima_atualizacao || null,
        responsavel: out.responsavel || null,
        cliente: out.cliente || null,
        observacao: out.observacao || null,
      };
    });
    
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar itens', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Criar novo item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tipo,
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

    // Validação básica
    if (!tipo || !nome) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: tipo, nome' },
        { status: 400 }
      );
    }

    // Gerar ID único
    const id = crypto.randomUUID();

    const query = `
      INSERT INTO \`worlddata-439415.lpdados.itens_portal\`
      (id, tipo, nome, descricao, link, area, status, proxima_atualizacao, tecnologias, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
      VALUES (@id, @tipo, @nome, @descricao, @link, @area, @status, @proxima_atualizacao, @tecnologias, @data_inicio, CURRENT_TIMESTAMP(), @responsavel, @cliente, @observacao)
    `;

    const options = {
      query,
      params: {
        id,
        tipo,
        nome,
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
        tipo: 'STRING',
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

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    return NextResponse.json(
      { error: 'Erro ao criar item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

