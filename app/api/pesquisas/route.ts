// app/api/pesquisas/route.ts
import { NextResponse } from 'next/server';
import { getPesquisasFromBigQuery } from '@/lib/googleSheets';
import type { Pesquisa } from '@/types/bi-platform';

export async function GET() {
  try {
    const data = await getPesquisasFromBigQuery();

    const normalized = (data as any[]).map((item, i) => {
      const extractValue = (val: any) => {
        if (val && typeof val === 'object' && 'value' in val) return val.value;
        return val;
      };

      const out: Record<string, any> = {};
      for (const key in item) {
        out[key] = extractValue(item[key]);
      }

      const titulo = out.titulo || out.Titulo || '';

      return {
        id: out.id || out.Id || String(i),
        titulo,
        fonte: out.fonte || out.Fonte || '',
        link: out.link || out.Link || '',
        data: out.data || out.Data || '',
        conteudo: out.conteudo || out.Conteudo || '',
        tema: out.tema || out.Tema || '',
        // Campos de gestão
        data_inicio: out.data_inicio || null,
        ultima_atualizacao: out.ultima_atualizacao || null,
        responsavel: out.responsavel || null,
        cliente: out.cliente || null,
        observacao: out.observacao || null
      };
    });

    const dedupedById = new Map<string, Pesquisa>();
    let duplicateIds = 0;

    for (const pesquisa of normalized as Pesquisa[]) {
      const current = dedupedById.get(pesquisa.id);
      if (!current) {
        dedupedById.set(pesquisa.id, pesquisa);
        continue;
      }

      duplicateIds += 1;
      const currentTs = new Date(current.ultima_atualizacao || current.data || '').getTime();
      const nextTs = new Date(pesquisa.ultima_atualizacao || pesquisa.data || '').getTime();

      if (Number.isFinite(nextTs) && (!Number.isFinite(currentTs) || nextTs >= currentTs)) {
        dedupedById.set(pesquisa.id, pesquisa);
      }
    }

    if (duplicateIds > 0) {
      console.warn(`GET /api/pesquisas deduplicou ${duplicateIds} registro(s) por id repetido.`);
    }

    return NextResponse.json(Array.from(dedupedById.values()));
  } catch (error) {
    console.error('Erro ao buscar pesquisas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pesquisas' },
      { status: 500 }
    );
  }
}
