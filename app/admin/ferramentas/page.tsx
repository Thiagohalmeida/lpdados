"use client";
import useSWR from 'swr';
import ToolCard from '@/components/ui/ToolCard';
import { fetchFerramentas } from '@/lib/fetchFerramentas';

export default function FerramentasPage() {
  const { data, error, isLoading } = useSWR('ferramentas', fetchFerramentas);

  // Escolha as cores conforme área, se desejar. Aqui para exemplo, todas azuis.
  function getBorderColor(nome: string) {
    if (nome.includes("Automáticos")) return "border-l-purple-500";
    if (nome.includes("Fornecedores")) return "border-l-pink-500";
    return "border-l-blue-500";
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-zinc-900 mb-10">Ferramentas</h1>
      {error ? (
        <p className="text-red-500">Erro ao carregar ferramentas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
              ))
            : data?.map((tool: any, i: number) => (
                <ToolCard
                  key={i}
                  nome={tool.Nome}
                  descricao={tool.Descricao}
                  link={tool.Link}
                  corBorda={getBorderColor(tool.Nome)}
                />
              ))}
        </div>
      )}
    </section>
  );
}
