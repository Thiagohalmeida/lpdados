"use client";
import useSWR from "swr";
import ProjetoCard from "@/components/ui/ProjetoCard";

export default function ProjetosPage() {
  const { data, error, isLoading } = useSWR(
    "/api/projetos",
    async (url: string) => (await fetch(url)).json()
  );

  if (error) return <div className="text-red-500">Erro ao carregar projetos.</div>;

  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Projetos</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {data?.map((item: any, i: number) => (
            <ProjetoCard
              key={i}
              nome={item.projeto || item.nome || item.Nome || item.titulo || item.Processo}
              descricao={item.descricao || item.Descricao || item.conteudo || ""}
              status={item.status || ""}
              data={item.data || item.Data || ""}
              link={item.link || item.Link}
              docs={item.docs || item.Docs}
              tecnologias={item.tecnologias || []}
              area={item.area || item.Area || ""}
            />
          ))}
        </div>
      )}
    </section>
  );
}
