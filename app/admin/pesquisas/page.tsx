'use client';

import useSWR from 'swr';
import { PesquisaCard } from '@/components/ui/PesquisaCard';
import { fetchPesquisas } from '@/lib/fetchPesquisas';

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID_PESQUISAS!;
const SHEET_RANGE = process.env.NEXT_PUBLIC_SHEET_RANGE_PESQUISAS!;

export default function PesquisasPage() {
  const { data, error, isLoading } = useSWR('pesquisas', () =>
    fetch('/api/pesquisas').then(res => res.json())
  );

  const safeData = Array.isArray(data) ? data : [];

  if (error) return <p className="text-red-500">Erro ao carregar pesquisas.</p>;

  return (
    <section>
      <h1>Central de Pesquisas</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {safeData.map((p: any, i: number) => (
            <div key={i}>
              <span>{p.titulo}</span>
              <span>{p.tema}</span>
              <a href={p.link} target="_blank" rel="noopener noreferrer">🔗</a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
