// app/admin/pesquisas/page.tsx
"use client";
import useSWR from "swr";
import { CardItem } from "@/components/ui/CardItem";

// Interface para tipagem dos dados de pesquisa
interface PesquisaData {
  titulo: string;
  fonte: string;
  link: string;
  data: string;
  conteudo: string;
  tema: string;
}

// Fetcher: chama a API e garante valores primitivos
async function fetcher(url: string): Promise<PesquisaData[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return (data as any[]).map((r) => ({
    titulo:   typeof r.titulo   === 'object' ? r.titulo.value   : r.titulo,
    fonte:    typeof r.fonte    === 'object' ? r.fonte.value    : r.fonte,
    link:     typeof r.link     === 'object' ? r.link.value     : r.link,
    data:     typeof r.data     === 'object' ? r.data.value     : r.data,
    conteudo: typeof r.conteudo === 'object' ? r.conteudo.value : r.conteudo,
    tema:     typeof r.tema     === 'object' ? r.tema.value     : r.tema,
  }));
}

export default function PesquisasPage() {
  const { data, error, isLoading } = useSWR<PesquisaData[]>(
    "/api/pesquisas",
    fetcher
  );

  if (error) return <div className="text-red-500">Erro ao carregar pesquisas.</div>;

  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Central de Pesquisas</h1>
      {isLoading || !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 grid-flow-row-dense">
          {data.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90"
            >
              <CardItem
                title={item.titulo}
                description={item.conteudo}
                link={item.link}
                area={item.tema}
              />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
