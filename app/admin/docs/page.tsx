"use client";
import useSWR from "swr";
import { DocCard } from "@/components/ui/DocCard";
import { fetchDocs } from "@/lib/fetchDocs";

const AREA_COLORS = {
  "Guias de Usuário": "blue",
  "Documentação Técnica": "purple",
  "Processos & Governança": "pink",
};

export default function DocsPage() {
  const { data, error } = useSWR("docs", fetchDocs);

  if (error) return <p className="text-red-500">Erro ao carregar documentos.</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Documentação Técnica</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((doc: any, i: number) => (
          <DocCard
            key={i}
            processo={doc.Processo}
            area={doc["Área"]}
            link={doc.Link}
          />
        ))}
      </div>
    </section>
  );
}
