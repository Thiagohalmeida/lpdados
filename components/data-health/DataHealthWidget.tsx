"use client";

import useSWR from "swr";
import { AlertTriangle, CheckCircle2, Clock3, Database, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonCardSmall } from "@/components/ui/SkeletonCard";
import type { TabelaStatus, TabelasStatusResponse } from "@/types/bi-platform";

const fetcher = async (url: string) => (await fetch(url, { cache: "no-store" })).json();

export function DataHealthWidget({ embedded = false }: { embedded?: boolean }) {
  const { data, error, isLoading, mutate } = useSWR<TabelasStatusResponse>("/api/tabelas-status", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const tables = data?.items ?? [];
  const totalOk = tables.filter((item) => item.status === "ok").length;
  const totalAlert = tables.filter((item) => item.status === "alerta").length;
  const totalLate = tables.filter((item) => item.status === "atrasado").length;
  const issues = tables.filter((item) => item.status === "alerta" || item.status === "atrasado");
  const fetchedAtLabel = formatTimestamp(data?.fetchedAt);
  const lastRealUpdateLabel = formatTimestamp(data?.lastRealUpdate);

  return (
    <section id="saude-dos-dados" className={embedded ? "py-4" : "py-12"}>
      <div className={embedded ? "" : "container mx-auto px-4"}>
        <div className="mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-blue-600">Saude dos Dados</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Visibilidade operacional para os dados</h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              Este bloco mostra apenas as tabelas priorizadas pela equipe de BI, com foco em problemas operacionais e impacto no negocio.
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
          <p className="font-medium text-slate-900">Status verificado em {fetchedAtLabel}</p>
          {lastRealUpdateLabel ? (
            <p className="mt-1 text-slate-500">Ultima atualizacao real identificada nas tabelas monitoradas: {lastRealUpdateLabel}</p>
          ) : null}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard icon={CheckCircle2} label="Atualizadas" value={totalOk} tone="emerald" />
          <SummaryCard icon={AlertTriangle} label="Alerta" value={totalAlert} tone="amber" />
          <SummaryCard icon={Clock3} label="Atrasadas" value={totalLate} tone="red" />
          <SummaryCard icon={Database} label="Total monitorado" value={tables.length} tone="blue" />
        </div>

        {error ? (
          <Card className="border-slate-200 bg-white">
            <CardContent>
              <ErrorState message="Erro ao carregar a Saude dos Dados." onRetry={() => mutate()} />
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <SkeletonCardSmall key={index} />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Info className="h-5 w-5 text-blue-700" />
                Nenhuma tabela priorizada ainda
              </CardTitle>
              <CardDescription>
                Use o admin para selecionar as tabelas que devem entrar na visibilidade operacional do portal.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : issues.length === 0 ? (
          <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="h-5 w-5" />
                Sem alertas operacionais no momento
              </CardTitle>
              <CardDescription className="text-emerald-800">
                As tabelas priorizadas monitoradas pela equipe de BI estao em situacao controlada.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Atencao operacional</CardTitle>
              <CardDescription>
                Os itens abaixo explicam onde ha problema e qual o impacto percebido pelos usuarios do portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {issues.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 ${
                    item.status === "atrasado" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "atrasado" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.fonte ? (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{item.fonte}</span>
                        ) : null}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.nome_tabela}</h3>
                      {item.descricao ? <p className="mt-2 text-sm text-slate-700">{item.descricao}</p> : null}
                      {item.impacto ? (
                        <p className="mt-3 rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700">
                          <span className="font-semibold">Impacto:</span> {item.impacto}
                        </p>
                      ) : null}
                      {item.observacao ? (
                        <p className="mt-3 rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700">
                          <span className="font-semibold">Observacao:</span> {item.observacao}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-sm text-slate-600">
                      <p>Ultima atualizacao real:</p>
                      <p className="font-medium text-slate-900">{item.ultima_atualizacao || "Nao localizada"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

function formatTimestamp(value?: string) {
  if (!value) {
    return "agora";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red" | "blue";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  } as const;

  return (
    <Card className={`border shadow-sm ${tones[tone]}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-xl bg-white/80 p-3">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
