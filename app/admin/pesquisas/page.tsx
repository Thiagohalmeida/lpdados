"use client";
import useSWR from "swr";
import { DocCard } from "@/components/ui/DocCard";
import { fetchPesquisas } from "@/lib/fetchPesquisas";

const AREA_COLORS = {
  B2B: "blue",
  Credibilidade: "purple",
  Influência: "pink",
  Mercado: "green",
  // Coloque mais temas se houver
};

export default function PesquisasPage() {
  const { data, error } = useSWR("pesquisas", fetchPesquisas);

  if (error) return <p className="text-red-500">Erro ao carregar pesquisas.</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Central de Pesquisas</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((pesq: any, i: number) => (
          <DocCard
            key={i}
            processo={pesq.Tema}
            area={pesq.Categoria || pesq.Tema}
            link={pesq.Link}
          />
        ))}
      </div>
    </section>
  );
}
