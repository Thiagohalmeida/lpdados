"use client";

import { FormEvent, useMemo, useState } from "react";
import useSWR from "swr";
import { Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StatusTabela, TabelaBigQueryCatalogo, TabelaStatus } from "@/types/bi-platform";

const fetcher = async (url: string) => (await fetch(url, { cache: "no-store" })).json();

const initialForm = {
  dataset_name: "",
  table_name: "",
  nome_tabela: "",
  descricao: "",
  proxima_atualizacao: "",
  status: "ok" as StatusTabela,
  impacto: "",
  responsavel: "",
  fonte: "",
  observacao: "",
  ativo_portal: true,
};

const statusOptions: StatusTabela[] = ["ok", "alerta", "atrasado"];

export function DataHealthAdminManager() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBusyId, setIsBusyId] = useState<string | null>(null);
  const { data, mutate, isLoading } = useSWR<TabelaStatus[]>("/api/admin/tabelas-status", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  const { data: catalog, isLoading: loadingCatalog } = useSWR<TabelaBigQueryCatalogo[]>("/api/admin/tabelas-status/catalogo", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const catalogByDataset = useMemo(() => {
    const groups = new Map<string, TabelaBigQueryCatalogo[]>();

    for (const item of catalog || []) {
      const group = groups.get(item.dataset_name) || [];
      group.push(item);
      groups.set(item.dataset_name, group);
    }

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [catalog]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/tabelas-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Nao foi possivel criar o registro.");
        return;
      }

      setForm(initialForm);
      await mutate();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function patchItem(id: string, payload: Partial<TabelaStatus>) {
    setIsBusyId(id);
    try {
      await fetch(`/api/admin/tabelas-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await mutate();
    } finally {
      setIsBusyId(null);
    }
  }

  async function removeItem(id: string) {
    setIsBusyId(id);
    try {
      await fetch(`/api/admin/tabelas-status/${id}`, { method: "DELETE" });
      await mutate();
    } finally {
      setIsBusyId(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-600">Saude dos Dados</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Curadoria operacional das tabelas prioritarias</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Selecione tabelas reais do BigQuery para monitoramento e complemente com contexto de negocio, impacto e observacao para o portal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.3fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Novo monitoramento</CardTitle>
            <CardDescription>Selecione a tabela prioritaria e defina o contexto que sera exibido aos usuarios.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreate}>
              <Field label="Tabela do BigQuery">
                <select
                  value={form.dataset_name && form.table_name ? `${form.dataset_name}.${form.table_name}` : ""}
                  onChange={(event) => {
                    const [dataset_name, table_name] = event.target.value.split(".");
                    setForm((current) => ({
                      ...current,
                      dataset_name,
                      table_name,
                      nome_tabela: current.nome_tabela || table_name || "",
                    }));
                  }}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  required
                >
                  <option value="">{loadingCatalog ? "Carregando catalogo..." : "Selecione uma tabela"}</option>
                  {catalogByDataset.map(([dataset, items]) => (
                    <optgroup key={dataset} label={dataset}>
                      {items.map((item) => (
                        <option key={`${item.dataset_name}.${item.table_name}`} value={`${item.dataset_name}.${item.table_name}`}>
                          {item.table_name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>

              <Field label="Nome de exibicao">
                <Input value={form.nome_tabela} onChange={(event) => setForm({ ...form, nome_tabela: event.target.value })} required />
              </Field>

              <Field label="Descricao">
                <Input value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} />
              </Field>

              <Field label="Impacto">
                <Input
                  value={form.impacto}
                  onChange={(event) => setForm({ ...form, impacto: event.target.value })}
                  placeholder="Ex: Afeta dashboards de Growth e relatorio executivo"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Proxima atualizacao esperada">
                  <Input value={form.proxima_atualizacao} onChange={(event) => setForm({ ...form, proxima_atualizacao: event.target.value })} />
                </Field>
                <Field label="Fonte">
                  <Input value={form.fonte} onChange={(event) => setForm({ ...form, fonte: event.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Responsavel">
                  <Input value={form.responsavel} onChange={(event) => setForm({ ...form, responsavel: event.target.value })} />
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value as StatusTabela })}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Observacao">
                <textarea
                  value={form.observacao}
                  onChange={(event) => setForm({ ...form, observacao: event.target.value })}
                  className="min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </Field>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.ativo_portal}
                  onChange={(event) => setForm({ ...form, ativo_portal: event.target.checked })}
                />
                Exibir esta tabela no portal
              </label>

              {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando
                  </>
                ) : (
                  "Salvar monitoramento"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Tabelas priorizadas</CardTitle>
            <CardDescription>Curadoria das tabelas que serao consideradas na visibilidade operacional do portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-36 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : data && data.length > 0 ? (
              data.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.nome_tabela}</h3>
                      <p className="text-xs text-slate-500">
                        {item.dataset_name}.{item.table_name}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={item.ativo_portal !== false}
                          onChange={(event) => patchItem(item.id, { ativo_portal: event.target.checked })}
                          disabled={isBusyId === item.id}
                        />
                        Exibir no portal
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_170px_120px_56px]">
                    <div className="space-y-3">
                      <Field label="Nome de exibicao">
                        <Input
                          defaultValue={item.nome_tabela}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value && value !== item.nome_tabela) {
                              patchItem(item.id, { nome_tabela: value });
                            }
                          }}
                          disabled={isBusyId === item.id}
                        />
                      </Field>
                      <Field label="Descricao">
                        <Input
                          defaultValue={item.descricao || ""}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value !== (item.descricao || "")) {
                              patchItem(item.id, { descricao: value });
                            }
                          }}
                          disabled={isBusyId === item.id}
                        />
                      </Field>
                      <Field label="Impacto">
                        <Input
                          defaultValue={item.impacto || ""}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value !== (item.impacto || "")) {
                              patchItem(item.id, { impacto: value });
                            }
                          }}
                          disabled={isBusyId === item.id}
                        />
                      </Field>
                      <Field label="Observacao">
                        <Input
                          defaultValue={item.observacao || ""}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value !== (item.observacao || "")) {
                              patchItem(item.id, { observacao: value });
                            }
                          }}
                          disabled={isBusyId === item.id}
                        />
                      </Field>
                    </div>

                    <div className="space-y-3">
                      <Field label="Fonte">
                        <Input
                          defaultValue={item.fonte || ""}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value !== (item.fonte || "")) {
                              patchItem(item.id, { fonte: value });
                            }
                          }}
                          disabled={isBusyId === item.id}
                        />
                      </Field>
                      <Field label="Responsavel">
                        <Input
                          defaultValue={item.responsavel || ""}
                          onBlur={(event) => {
                            const value = event.target.value.trim();
                            if (value !== (item.responsavel || "")) {
                              patchItem(item.id, { responsavel: value });
                            }
                          }}
                          disabled={isBusyId === item.id}
                        />
                      </Field>
                      <Field label="Ultima atualizacao real">
                        <Input value={item.ultima_atualizacao || "Nao localizada no BigQuery"} readOnly />
                      </Field>
                    </div>

                    <Field label="Proxima esperada">
                      <Input
                        defaultValue={item.proxima_atualizacao || ""}
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          if (value !== (item.proxima_atualizacao || "")) {
                            patchItem(item.id, { proxima_atualizacao: value });
                          }
                        }}
                        disabled={isBusyId === item.id}
                      />
                    </Field>

                    <Field label="Status">
                      <select
                        value={item.status}
                        onChange={(event) => patchItem(item.id, { status: event.target.value as StatusTabela })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        disabled={isBusyId === item.id}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                        disabled={isBusyId === item.id}
                      >
                        {isBusyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Nenhuma tabela priorizada ainda.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}
