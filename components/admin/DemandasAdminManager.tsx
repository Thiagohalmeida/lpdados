"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Demanda, PrioridadeDemanda, Projeto, StatusDemanda } from "@/types/bi-platform";

const fetcher = async (url: string) => (await fetch(url, { cache: "no-store" })).json();

const statusOptions: StatusDemanda[] = ["nova", "em analise", "em desenvolvimento", "entregue", "cancelada"];
const priorityOptions: PrioridadeDemanda[] = ["baixa", "media", "alta", "urgente"];

export function DemandasAdminManager() {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isBusyId, setIsBusyId] = useState<string | null>(null);
  const { data, mutate, isLoading } = useSWR<Demanda[]>(
    statusFilter === "todos" ? "/api/admin/demandas" : `/api/admin/demandas?status=${encodeURIComponent(statusFilter)}`,
    fetcher,
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const { data: projetos } = useSWR<Projeto[]>("/api/itens?tipo=projeto", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  async function patchDemanda(id: string, payload: Partial<Demanda>) {
    setIsBusyId(id);
    try {
      await fetch(`/api/admin/demandas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await mutate();
    } finally {
      setIsBusyId(null);
    }
  }

  async function removeDemanda(id: string) {
    setIsBusyId(id);
    try {
      await fetch(`/api/admin/demandas/${id}`, { method: "DELETE" });
      await mutate();
    } finally {
      setIsBusyId(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-blue-600">Gestao de demandas</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Triagem inicial das solicitacoes</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Esta tela permite acompanhar o backlog inicial do fluxo publico de Nova solicitacao e ajustar status, prioridade e observacao sem depender ainda de BigQuery.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "todos" ? "default" : "outline"}
            onClick={() => setStatusFilter("todos")}
            className={statusFilter === "todos" ? "bg-blue-700 hover:bg-blue-800" : ""}
          >
            Todas
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? "bg-blue-700 hover:bg-blue-800" : ""}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Demandas abertas</CardTitle>
          <CardDescription>Fluxo administrativo inicial com persistencia local isolada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            data.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{item.prioridade}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{item.area}</span>
                      {item.projeto_id ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Projeto vinculado
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-slate-900">{item.titulo}</h2>
                    <p className="mt-2 text-sm text-slate-600">{item.descricao}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      {item.solicitante}
                      {item.email ? ` • ${item.email}` : ""}
                      {item.tipo ? ` • ${item.tipo}` : ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4 xl:w-[580px]">
                    <select
                      value={item.status}
                      onChange={(event) => patchDemanda(item.id, { status: event.target.value as StatusDemanda })}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                      disabled={isBusyId === item.id}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.prioridade}
                      onChange={(event) => patchDemanda(item.id, { prioridade: event.target.value as PrioridadeDemanda })}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                      disabled={isBusyId === item.id}
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.projeto_id || ""}
                      onChange={(event) => patchDemanda(item.id, { projeto_id: event.target.value || null })}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                      disabled={isBusyId === item.id}
                    >
                      <option value="">Sem projeto</option>
                      {(projetos || []).map((projeto) => (
                        <option key={projeto.id} value={projeto.id}>
                          {projeto.nome}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => removeDemanda(item.id)}
                      disabled={isBusyId === item.id}
                    >
                      {isBusyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  {item.projeto_id ? (
                    <p className="mb-3 text-xs font-medium text-emerald-700">
                      Projeto vinculado: {(projetos || []).find((projeto) => projeto.id === item.projeto_id)?.nome || item.projeto_id}
                    </p>
                  ) : null}
                  <label className="mb-2 block text-sm font-medium text-slate-700">Observacao interna</label>
                  <Input
                    defaultValue={item.observacao || ""}
                    placeholder="Observacao de triagem, contexto ou proximo passo"
                    onBlur={(event) => {
                      const nextValue = event.target.value.trim();
                      if (nextValue !== (item.observacao || "")) {
                        patchDemanda(item.id, { observacao: nextValue });
                      }
                    }}
                    disabled={isBusyId === item.id}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Nenhuma demanda encontrada para o filtro atual.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
