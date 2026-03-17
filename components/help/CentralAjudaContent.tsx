"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ClipboardPlus,
  Database,
  LifeBuoy,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { platformRoutes } from "@/lib/platform-config";

type HelpIntent = {
  id: string;
  label: string;
  description: string;
  href: string;
  external?: boolean;
  icon: typeof BarChart3;
};

type HelpStep = {
  id: string;
  title: string;
  description: string;
  example: string;
};

type HelpModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
};

type FaqItem = {
  id: string;
  category: "acesso" | "dashboards" | "dados" | "solicitacoes" | "admin";
  question: string;
  answer: string;
};

const intents: HelpIntent[] = [
  {
    id: "dashboards",
    label: "Quero ver dashboards",
    description: "Acesso rapido ao portal e ao modulo de dashboards.",
    href: `${platformRoutes.portal}#dashboards`,
    icon: BarChart3,
  },
  {
    id: "solicitacao",
    label: "Quero abrir solicitacao",
    description: "Entrada publica para pedir analises, dashboards ou novas entregas.",
    href: platformRoutes.newRequest,
    icon: ClipboardPlus,
  },
  {
    id: "dados",
    label: "Quero entender os dados",
    description: "Consulta banco para explorar tabelas existentes, schema e amostras de ate 10 linhas.",
    href: platformRoutes.dataExplorer,
    external: true,
    icon: Database,
  },
  {
    id: "admin",
    label: "Sou admin",
    description: "Acesso a fluxos de cadastro, importacao e manutencao.",
    href: platformRoutes.admin,
    icon: Settings,
  },
];

const steps: HelpStep[] = [
  {
    id: "explore",
    title: "Explore os modulos",
    description: "O portal centraliza projetos, dashboards, documentacao, ferramentas e pesquisas.",
    example: "Se o objetivo for consultar entregas e acessos, comece pelo portal principal.",
  },
  {
    id: "filtre",
    title: "Use filtros e busca",
    description: "Cada modulo permite reduzir resultados por area, status ou tema.",
    example: "Em projetos, voce pode focar no que esta em desenvolvimento.",
  },
  {
    id: "aprofunde",
    title: "Consulte a estrutura dos dados",
    description: "Quando precisar entender tabelas e schema, use o modulo Consulta banco como apoio a cultura de dados.",
    example: "Esse modulo mostra tabelas existentes, schema e amostras controladas de ate 10 linhas.",
  },
  {
    id: "solicite",
    title: "Abra uma nova solicitacao",
    description: "Quando o portal ainda nao cobre sua necessidade, use o canal publico de solicitacoes.",
    example: "Esse fluxo ja funciona como ponto unico para novas demandas de BI.",
  },
];

const modules: HelpModule[] = [
  {
    id: "portal",
    title: "Portal de conteudos",
    description: "Ponto central com projetos, dashboards, docs, ferramentas e pesquisas.",
    href: platformRoutes.portal,
  },
  {
    id: "solicitacao",
    title: "Nova solicitacao",
    description: "Canal publico para abertura de novas demandas de BI.",
    href: platformRoutes.newRequest,
    badge: "Fluxo ativo",
  },
  {
    id: "consulta-banco",
    title: "Consulta banco",
    description: "Modulo externo para consultar tabelas, schema e amostras controladas de dados.",
    href: platformRoutes.dataExplorer,
    badge: "Cultura de dados",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Area administrativa para manutencao de conteudos e operacao interna.",
    href: platformRoutes.admin,
  },
];

const userChecklist = [
  "Entre no portal e encontre o modulo mais proximo da sua necessidade.",
  "Use a busca global e os filtros para reduzir o volume de resultados.",
  "Quando precisar entender a base por tras dos dashboards, abra Consulta banco.",
  "Se nao encontrar o que precisa, use Nova solicitacao.",
];

const adminChecklist = [
  "Use o admin para cadastro, ajuste e publicacao de conteudos existentes.",
  "Separe conteudo publico de regras operacionais para evitar ruido ao usuario.",
  "Prefira rotas e contratos compartilhados antes de duplicar logica de CRUD.",
  "Mantenha Demandas e Saude dos Dados como dominios operacionais proprios.",
];

const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    category: "acesso",
    question: "Como comeco a usar a plataforma?",
    answer: "Comece pela home e pelo portal principal. A home destaca a Saude dos Dados e o portal concentra os modulos de conteudo.",
  },
  {
    id: "faq-2",
    category: "dashboards",
    question: "Onde encontro os dashboards da minha area?",
    answer: "Entre no portal, abra a aba de dashboards e filtre pela area correspondente. Se o dashboard nao estiver disponivel, abra uma nova solicitacao.",
  },
  {
    id: "faq-3",
    category: "dados",
    question: "Como entendo uma tabela ou o schema dos dados?",
    answer: "Use o modulo Consulta banco. Ele permite localizar tabelas existentes, ver o schema e consultar amostras controladas de ate 10 linhas.",
  },
  {
    id: "faq-4",
    category: "dados",
    question: "Como vou saber se um dado esta atualizado?",
    answer: "A home principal ja destaca a Saude dos Dados com o status operacional das tabelas priorizadas. Para estrutura e exemplos, use Consulta banco.",
  },
  {
    id: "faq-5",
    category: "solicitacoes",
    question: "Quando devo usar Nova solicitacao?",
    answer: "Use quando precisar de uma analise, dashboard, automacao ou outra entrega que ainda nao exista no portal.",
  },
  {
    id: "faq-6",
    category: "admin",
    question: "A Central de Ajuda serve tambem para admin?",
    answer: "Sim. O usuario comum encontra caminhos de uso. O admin encontra fluxos de manutencao, governanca e operacao.",
  },
];

const categories = [
  { id: "todos", label: "Todos" },
  { id: "acesso", label: "Acesso" },
  { id: "dashboards", label: "Dashboards" },
  { id: "dados", label: "Dados" },
  { id: "solicitacoes", label: "Solicitacoes" },
  { id: "admin", label: "Admin" },
] as const;

export function CentralAjudaContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("todos");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredModules = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return modules;
    }

    return modules.filter((module) =>
      `${module.title} ${module.description} ${module.badge || ""}`.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredFaq = faqItems.filter((item) => {
    const matchCategory = category === "todos" || item.category === category;
    const matchQuery =
      normalizedQuery.length === 0 ||
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery);

    return matchCategory && matchQuery;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#1d4ed8_0%,#1e3a8a_45%,#0f172a_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_30%,transparent_60%)] opacity-40" />
        <div className="container mx-auto px-4 py-14 relative z-10">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Central de Ajuda</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">Como usar o portal sem friccao</h1>
            <p className="mt-5 max-w-3xl text-lg text-blue-100">
              Esta pagina organiza os fluxos principais por intencao de uso. O objetivo e reduzir o atrito para quem
              precisa consultar conteudos, entender dados ou abrir uma nova solicitacao.
            </p>

            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex-1">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Busque na ajuda por dashboards, consulta banco, solicitacao ou admin..."
                    className="border-white/30 bg-white text-slate-900 placeholder:text-slate-500"
                  />
                  <p className="mt-2 text-sm text-blue-100">
                    A busca filtra os modulos e o FAQ desta pagina. Os atalhos abaixo levam direto para o fluxo correto.
                  </p>
                </div>
                <Link href={platformRoutes.newRequest}>
                  <Button className="w-full md:w-auto bg-white text-blue-700 hover:bg-blue-50">
                    Nova solicitacao
                    <ClipboardPlus className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {intents.map((intent) => {
                  const Icon = intent.icon;
                  const content = (
                    <>
                      <div className="flex items-center gap-2 text-white">
                        <Icon className="h-4 w-4" />
                        <span className="font-semibold">{intent.label}</span>
                      </div>
                      <p className="mt-2 text-sm text-blue-100">{intent.description}</p>
                    </>
                  );

                  return intent.external ? (
                    <a
                      key={intent.id}
                      href={intent.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-white/20 bg-white/10 p-4 text-left transition hover:bg-white/20"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      key={intent.id}
                      href={intent.href}
                      className="rounded-xl border border-white/20 bg-white/10 p-4 text-left transition hover:bg-white/20"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {filteredModules.map((module) => (
            <Card key={module.id} className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg text-slate-900">{module.title}</CardTitle>
                  {module.badge ? (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {module.badge}
                    </span>
                  ) : null}
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {module.href.startsWith("http") ? (
                  <a href={module.href} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                      Acessar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                ) : (
                  <Link href={module.href}>
                    <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                      Acessar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-blue-700" />
              Como o portal funciona
            </CardTitle>
            <CardDescription>Um caminho simples para consultar conteudo, entender dados e pedir algo novo sem suporte ad hoc.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">{step.example}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <Tabs defaultValue="usuario" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-50">
            <TabsTrigger value="usuario">Sou usuario</TabsTrigger>
            <TabsTrigger value="admin">Sou admin</TabsTrigger>
          </TabsList>
          <TabsContent value="usuario">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Fluxo recomendado para usuario final</CardTitle>
                <CardDescription>O caminho mais direto para consultar informacao e escalar uma nova necessidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                {userChecklist.map((item) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Fluxo recomendado para administracao</CardTitle>
                <CardDescription>Separacao entre vitrine publica, operacao interna e crescimento da plataforma.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                {adminChecklist.map((item) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <LifeBuoy className="h-5 w-5 text-blue-700" />
              Perguntas frequentes
            </CardTitle>
            <CardDescription>FAQ com filtro por tema e busca local em tempo real.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    category === item.id
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {filteredFaq.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                Nenhum resultado encontrado para o filtro atual.
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-left text-slate-900 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-3xl border border-blue-200 bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_100%)] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.18em] text-blue-700">Proximo passo</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Nao encontrou o que precisava?</h2>
              <p className="mt-3 text-slate-700">
                Use Nova solicitacao para pedir uma nova entrega ou abra Consulta banco quando o objetivo for entender
                melhor a estrutura dos dados ja existentes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={platformRoutes.newRequest}>
                <Button className="bg-blue-700 hover:bg-blue-800">
                  Nova solicitacao
                  <ClipboardPlus className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href={platformRoutes.dataExplorer} target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-white">
                  Abrir Consulta banco
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
