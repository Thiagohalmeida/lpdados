"use client";

import useSWR from "swr";
import { CardItem } from "@/components/ui/CardItem";

interface DashboardData {
  Nome: string;
  Descricao: string;
  Link: string;
  Area: string;
}

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR<DashboardData[]>(
    "/api/dashboard",
    async (url: string) => {
      const res = await fetch(url);
      return res.json();
    }
  );

  if (error) return <div className="text-red-500">Erro ao carregar dashboards.</div>;

  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Dashboards</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 grid-flow-row-dense">
          {data?.map((item: any, i: number) => (
            <CardItem
              key={i}
              title={item.Nome}
              description={item.Descricao}
              link={item.Link}
              area={item.Area}
            />
          ))}
        </div>
      )}
    </section>
  );
}