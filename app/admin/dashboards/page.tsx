"use client";
import useSWR from 'swr';
import DashboardCard from '@/components/ui/DashboardCard';
import { fetchDashboards } from '@/lib/fetchDashboards';

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('dashboards', fetchDashboards);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-zinc-900 mb-10">Dashboards Ativos</h1>
      {error ? (
        <p className="text-red-500">Erro ao carregar dashboards.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
              ))
            : data?.map((dash: any, i: number) => (
                <DashboardCard
                  key={i}
                  nome={dash.Nome}
                  descricao={dash.Descricao}
                  link={dash.Link}
                  area={dash.Area}
                />
              ))}
        </div>
      )}
    </section>
  );
}
