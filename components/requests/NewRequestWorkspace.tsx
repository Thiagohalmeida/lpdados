"use client";

import { FormEvent, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, ClipboardPlus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { platformRoutes } from "@/lib/platform-config";
import type { Demanda, PrioridadeDemanda, Projeto } from "@/types/bi-platform";

const fetcher = async (url: string) => (await fetch(url, { cache: "no-store" })).json();

const initialForm = {
  titulo: "",
  descricao: "",
  area: "",
  solicitante: "",
  email: "",
  tipo: "Dashboard",
  prioridade: "media" as PrioridadeDemanda,
};

const priorityOptions: PrioridadeDemanda[] = ["baixa", "media", "alta", "urgente"];

const statusLabel: Record<Demanda["status"], string> = {
  nova: "Nova",
  "em analise": "Em analise",
  "em desenvolvimento": "Em desenvolvimento",
  entregue: "Entregue",
  cancelada: "Cancelada",
};

export function NewRequestWorkspace() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, mutate, isLoading } = useSWR<Demanda[]>("/api/demandas", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  const { data: projetos } = useSWR<Projeto[]>("/api/itens?tipo=projeto", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/demandas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Nao foi possivel abrir a solicitacao.");
        setFieldErrors(result.fields || {});
        return;
      }

      setForm(initialForm);
      setFieldErrors({});
      setSuccess("Solicitacao aberta com sucesso. O status inicial ja esta visivel abaixo.");
      await mutate();
    } catch (submitError) {
      console.error(submitError);
      setError("Erro inesperado ao enviar a solicitacao.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-[radial-gradient(120%_90%_at_50%_0%,#1d4ed8_0%,#1e3a8a_45%,#0f172a_100%)] text-white">
        <div className="container mx-auto px-4 py-14">
          <Link href={platformRoutes.home} className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao inicio
          </Link>
          <div className="mt-6 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-100">Nova solicitacao</p>
            <h1 className="mt-3 text-4xl font-bold">Abra uma nova demanda para o time de BI</h1>
            <p className="mt-4 text-lg text-blue-100">
              Use este formulario para solicitar analises, dashboards, automacoes ou outras entregas que ainda nao existem no portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={platformRoutes.portal}>
                <Button className="bg-white text-blue-700 hover:bg-blue-50">Ir para o portal</Button>
              </Link>
              <Link href={platformRoutes.help}>
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                  Ver Central de Ajuda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <ClipboardPlus className="h-5 w-5 text-blue-700" />
                Abrir solicitacao
              </CardTitle>
              <CardDescription>Preencha os dados principais para que a triagem aconteca com contexto suficiente.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Titulo</label>
                  <Input
                    value={form.titulo}
                    onChange={(event) => setForm({ ...form, titulo: event.target.value })}
                    required
                    minLength={5}
                    maxLength={120}
                  />
                  <p className="text-xs text-slate-500">Minimo de 5 caracteres.</p>
                  <FieldError errors={fieldErrors.titulo} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Area</label>
                    <Input
                      value={form.area}
                      onChange={(event) => setForm({ ...form, area: event.target.value })}
                      required
                      minLength={2}
                      maxLength={80}
                    />
                    <FieldError errors={fieldErrors.area} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <Input value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })} maxLength={80} />
                    <p className="text-xs text-slate-500">Exemplo: Dashboard, Analise, Automacao ou Relatorio.</p>
                    <FieldError errors={fieldErrors.tipo} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Descricao</label>
                  <textarea
                    value={form.descricao}
                    onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                    required
                    minLength={10}
                    maxLength={2000}
                    className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <p className="text-xs text-slate-500">Descreva contexto, objetivo e resultado esperado. Minimo de 10 caracteres.</p>
                  <FieldError errors={fieldErrors.descricao} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Solicitante</label>
                    <Input
                      value={form.solicitante}
                      onChange={(event) => setForm({ ...form, solicitante: event.target.value })}
                      required
                      minLength={2}
                      maxLength={120}
                    />
                    <FieldError errors={fieldErrors.solicitante} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">E-mail</label>
                    <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                    <FieldError errors={fieldErrors.email} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Prioridade</label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {priorityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm({ ...form, prioridade: option })}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          form.prioridade === option
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
                {success ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando
                    </>
                  ) : (
                    "Enviar solicitacao"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Status recentes</CardTitle>
              <CardDescription>Visao simples das solicitacoes abertas neste fluxo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : data && data.length > 0 ? (
                data.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {statusLabel[item.status]}
                      </span>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{item.area}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{item.prioridade}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.titulo}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.descricao}</p>
                    {item.projeto_id ? (
                      <p className="mt-3 text-xs font-medium text-emerald-700">
                        Projeto vinculado: {(projetos || []).find((projeto) => projeto.id === item.projeto_id)?.nome || item.projeto_id}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs text-slate-500">
                      Aberta por {item.solicitante} em {new Date(item.data_abertura).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                  Nenhuma solicitacao registrada ainda.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return <p className="text-xs text-red-600">{errors[0]}</p>;
}
