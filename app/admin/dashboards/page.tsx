"use client";
import useSWR from "swr";
import { DocCard } from "@/components/ui/DocCard";
import { fetchDashboards } from "@/lib/fetchDashboards";

const AREA_COLORS = {
  Tráfego: "blue",
  Growth: "purple",
  Planejamento: "pink",
  Atendimento: "green",
  RH: "blue",
  Geral: "yellow",
};

interface Dashboard {
  Nome: string;
  Descricao: string;
  Area: keyof typeof AREA_COLORS;
  Link: string;
}

export default function DashboardsPage() {
  const { data, error } = useSWR("dashboards", fetchDashboards);

  if (error) return <p className="text-red-500">Erro ao carregar dashboards.</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboards Ativos</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((dash: Dashboard, i: number) => (
          <DocCard
            key={i}
            processo={dash.Nome}
            area={dash.Area}
            link={dash.Link}
          />
        ))}
      </div>
    </section>
  );
}
