"use client";
import useSWR from "swr";
import { DocCard } from "@/components/ui/DocCard";
import { fetchFerramentas } from "@/lib/fetchFerramentas";

const AREA_COLORS = {
  // Adapte conforme as áreas das ferramentas (ou deixe azul)
  Banco: "blue",
  Insights: "purple",
  Fornecedores: "green",
};

export default function FerramentasPage() {
  const { data, error } = useSWR("ferramentas", fetchFerramentas);

  if (error) return <p className="text-red-500">Erro ao carregar ferramentas.</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Ferramentas</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((tool: any, i: number) => (
          <DocCard
            key={i}
            processo={tool.Nome}
            area={tool.Area || tool.ProxAtualizacao || ""}
            link={tool.Link}
          />
        ))}
      </div>
    </section>
  );
}
