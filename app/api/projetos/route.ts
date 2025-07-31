// app/api/projetos/route.ts
import { NextResponse } from 'next/server';
import { getProjetosFromBigQuery } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getProjetosFromBigQuery();
    const normalized = (data as any[]).map(item => {
      const out: Record<string, any> = {};
      for (const key in item) {
        const val = (item as any)[key];
        out[key] = val && typeof val === 'object' && 'value' in val ? val.value : val;
      }
      return out;
    });
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Erro em projetos:', error);
    return NextResponse.json({ error: 'Erro interno em projetos' }, { status: 500 });
  }
}
