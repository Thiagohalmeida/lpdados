import { NextResponse } from 'next/server';
import { getDocsFromBigQuery } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getDocsFromBigQuery();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    return NextResponse.json({ error: 'Erro ao consultar dados do BigQuery' }, { status: 500 });
  }
}
