import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequestAuthorized } from '@/lib/admin-access';
import { BigQuery } from '@google-cloud/bigquery';
import { createHash } from 'crypto';

const bigquery = new BigQuery({
  credentials: process.env.GOOGLE_CREDENTIALS_JSON
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
    : undefined,
  projectId: process.env.PROJECT_ID || 'worlddata-439415',
});

async function checkAuth() {
  return isAdminRequestAuthorized();
}

type ImportMode = 'upsert' | 'replace';

type PesquisaRow = {
  id: string;
  titulo: string;
  fonte: string;
  link: string | null;
  data: string;
  conteudo: string;
  tema: string;
  data_inicio: string | null;
  responsavel: string | null;
  cliente: string | null;
  observacao: string | null;
};

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function detectDelimiter(headerLine: string) {
  const candidates = [',', ';', '\t'];
  let best = ',';
  let bestCount = -1;
  for (const delimiter of candidates) {
    const count = headerLine.split(delimiter).length - 1;
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  }
  return best;
}

function parseDelimited(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(field);
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);
  rows.push(row);

  return rows;
}

function normalizeDate(raw: string) {
  const value = raw.trim();
  if (!value) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return value;
  }

  const brMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, '0');
    const month = brMatch[2].padStart(2, '0');
    const year = brMatch[3];
    return `${year}-${month}-${day}`;
  }

  const slashMatch = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (slashMatch) {
    const year = slashMatch[1];
    const month = slashMatch[2].padStart(2, '0');
    const day = slashMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
}

function buildDeterministicId(input: string) {
  return createHash('sha256').update(input).digest('hex').slice(0, 32);
}

function buildNaturalKey(titulo: string, fonte: string, data: string, tema: string) {
  return `${titulo}|${fonte}|${data}|${tema}`;
}

async function upsertRow(row: PesquisaRow) {
  const query = `
    MERGE \`worlddata-439415.lpdados.pesquisas\` T
    USING (
      SELECT
        @id AS id,
        @titulo AS titulo,
        @fonte AS fonte,
        @link AS link,
        @data AS data_raw,
        @conteudo AS conteudo,
        @tema AS tema,
        @data_inicio AS data_inicio_raw,
        @responsavel AS responsavel,
        @cliente AS cliente,
        @observacao AS observacao
    ) S
    ON T.titulo = S.titulo
      AND T.fonte = S.fonte
      AND DATE(T.data) = COALESCE(
        SAFE.PARSE_DATE('%Y-%m-%d', S.data_raw),
        SAFE.PARSE_DATE('%d/%m/%Y', S.data_raw)
      )
      AND T.tema = S.tema
    WHEN MATCHED THEN
      UPDATE SET
        id = S.id,
        titulo = S.titulo,
        fonte = S.fonte,
        link = S.link,
        data = DATETIME(COALESCE(
          SAFE.PARSE_DATE('%Y-%m-%d', S.data_raw),
          SAFE.PARSE_DATE('%d/%m/%Y', S.data_raw)
        )),
        conteudo = S.conteudo,
        tema = S.tema,
        data_inicio = COALESCE(
          SAFE.PARSE_DATE('%Y-%m-%d', S.data_inicio_raw),
          SAFE.PARSE_DATE('%d/%m/%Y', S.data_inicio_raw)
        ),
        ultima_atualizacao = CURRENT_TIMESTAMP(),
        responsavel = S.responsavel,
        cliente = S.cliente,
        observacao = S.observacao
    WHEN NOT MATCHED THEN
      INSERT (id, titulo, fonte, link, data, conteudo, tema, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
      VALUES (
        S.id,
        S.titulo,
        S.fonte,
        S.link,
        DATETIME(COALESCE(
          SAFE.PARSE_DATE('%Y-%m-%d', S.data_raw),
          SAFE.PARSE_DATE('%d/%m/%Y', S.data_raw)
        )),
        S.conteudo,
        S.tema,
        COALESCE(
          SAFE.PARSE_DATE('%Y-%m-%d', S.data_inicio_raw),
          SAFE.PARSE_DATE('%d/%m/%Y', S.data_inicio_raw)
        ),
        CURRENT_TIMESTAMP(),
        S.responsavel,
        S.cliente,
        S.observacao
      )
  `;

  await bigquery.query({
    query,
    params: row,
    types: {
      id: 'STRING',
      titulo: 'STRING',
      fonte: 'STRING',
      link: 'STRING',
      data: 'STRING',
      conteudo: 'STRING',
      tema: 'STRING',
      data_inicio: 'STRING',
      responsavel: 'STRING',
      cliente: 'STRING',
      observacao: 'STRING',
    },
  });
}

async function insertRow(row: PesquisaRow) {
  const query = `
    INSERT INTO \`worlddata-439415.lpdados.pesquisas\`
    (id, titulo, fonte, link, data, conteudo, tema, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
    VALUES (
      @id,
      @titulo,
      @fonte,
      @link,
      DATETIME(COALESCE(
        SAFE.PARSE_DATE('%Y-%m-%d', @data),
        SAFE.PARSE_DATE('%d/%m/%Y', @data)
      )),
      @conteudo,
      @tema,
      COALESCE(
        SAFE.PARSE_DATE('%Y-%m-%d', @data_inicio),
        SAFE.PARSE_DATE('%d/%m/%Y', @data_inicio)
      ),
      CURRENT_TIMESTAMP(),
      @responsavel,
      @cliente,
      @observacao
    )
  `;

  await bigquery.query({
    query,
    params: row,
    types: {
      id: 'STRING',
      titulo: 'STRING',
      fonte: 'STRING',
      link: 'STRING',
      data: 'STRING',
      conteudo: 'STRING',
      tema: 'STRING',
      data_inicio: 'STRING',
      responsavel: 'STRING',
      cliente: 'STRING',
      observacao: 'STRING',
    },
  });
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const csvText = typeof body.csvText === 'string' ? body.csvText : '';
    const mode: ImportMode = body.mode === 'replace' ? 'replace' : 'upsert';

    if (!csvText.trim()) {
      return NextResponse.json({ error: 'CSV vazio ou invalido.' }, { status: 400 });
    }

    const cleaned = csvText.replace(/^\uFEFF/, '');
    const firstLine = cleaned.split(/\r?\n/)[0] || '';
    const delimiter = detectDelimiter(firstLine);
    const parsed = parseDelimited(cleaned, delimiter);

    if (parsed.length < 2) {
      return NextResponse.json({ error: 'CSV precisa ter cabecalho e pelo menos uma linha.' }, { status: 400 });
    }

    const header = parsed[0].map((value) => normalizeHeader(value));
    const headerMap = new Map<string, number>();
    header.forEach((value, index) => headerMap.set(value, index));

    const rows: PesquisaRow[] = [];
    const errors: string[] = [];

    for (let i = 1; i < parsed.length; i += 1) {
      const rawRow = parsed[i];
      if (!rawRow || rawRow.every((value) => !String(value || '').trim())) {
        continue;
      }

      const get = (key: string) => {
        const idx = headerMap.get(key);
        if (idx === undefined) return '';
        return String(rawRow[idx] ?? '').trim();
      };

      const titulo = get('titulo');
      const fonte = get('fonte');
      const link = get('link');
      const rawData = get('data') || '';
      const data = normalizeDate(rawData);
      const conteudo = get('conteudo') || get('conteudo_da_pesquisa') || get('conteudo_pesquisa');
      const tema = get('tema');
      const dataInicio = normalizeDate(get('data_inicio') || '');
      const responsavel = get('responsavel') || null;
      const cliente = get('cliente') || null;
      const observacao = get('observacao') || null;
      const id = get('id');

      const missing: string[] = [];
      if (!titulo) missing.push('titulo');
      if (!fonte) missing.push('fonte');
      if (!data) missing.push('data');
      if (!conteudo) missing.push('conteudo');
      if (!tema) missing.push('tema');

      if (missing.length > 0) {
        const dataInfo = rawData ? ` (valor recebido: "${rawData}")` : '';
        errors.push(
          `Linha ${i + 1}: campos obrigatorios faltando (${missing.join(', ')}).${missing.includes('data') ? dataInfo : ''}`
        );
        continue;
      }

      const normalizedData = data as string;
      const naturalKey = buildNaturalKey(titulo, fonte, normalizedData, tema);
      const rowId = id || buildDeterministicId(naturalKey);

      rows.push({
        id: rowId,
        titulo,
        fonte,
        link: link || null,
        data: normalizedData,
        conteudo,
        tema,
        data_inicio: dataInicio,
        responsavel,
        cliente,
        observacao,
      });
    }

    if (!rows.length) {
      return NextResponse.json({ error: 'Nenhuma linha valida para importar.', errors }, { status: 400 });
    }

    let existingCount = 0;
    if (mode === 'upsert') {
      const keys = rows.map((row) => row.id);
      const [existingRows] = await bigquery.query({
        query: `
          SELECT COUNT(1) AS total
          FROM \`worlddata-439415.lpdados.pesquisas\`
          WHERE TO_HEX(SHA256(CONCAT(
            TRIM(titulo), '|', TRIM(fonte), '|', IFNULL(FORMAT_DATE('%Y-%m-%d', DATE(data)), ''), '|', TRIM(tema)
          ))) IN UNNEST(@keys)
        `,
        params: { keys },
        types: { keys: ['STRING'] },
      });
      existingCount = Array.isArray(existingRows) && existingRows[0]?.total ? Number(existingRows[0].total) : 0;
    }

    if (mode === 'replace') {
      const backupSuffix = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
      const backupTable = `worlddata-439415.lpdados.pesquisas_backup_${backupSuffix}`;

      await bigquery.query({
        query: `CREATE TABLE \`${backupTable}\` AS SELECT * FROM \`worlddata-439415.lpdados.pesquisas\``,
      });

      await bigquery.query({ query: 'TRUNCATE TABLE `worlddata-439415.lpdados.pesquisas`' });

      for (const row of rows) {
        await insertRow(row);
      }

      return NextResponse.json({
        success: true,
        mode,
        total: parsed.length - 1,
        valid: rows.length,
        skipped: errors.length,
        inserted: rows.length,
        updated: 0,
        errors: errors.slice(0, 50),
        backup_table: backupTable,
      });
    }

    for (const row of rows) {
      await upsertRow(row);
    }

    const inserted = Math.max(rows.length - existingCount, 0);
    const updated = Math.min(existingCount, rows.length);

    return NextResponse.json({
      success: true,
      mode,
      total: parsed.length - 1,
      valid: rows.length,
      skipped: errors.length,
      inserted,
      updated,
      errors: errors.slice(0, 50),
    });
  } catch (error) {
    console.error('Erro ao importar pesquisas:', error);
    return NextResponse.json(
      { error: 'Erro ao importar pesquisas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
