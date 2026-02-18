"use client";

import {
  BarChart3,
  Database,
  FileText,
  TrendingUp,
  Calendar,
  ExternalLink,
  Download,
  Search,
  Filter,
  BookOpen,
  FolderKanban,
  Grid3x3,
  List,
  ArrowUpDown,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr";
import { CardItem } from "@/components/ui/CardItem";
import ProjetoCard from "@/components/ui/ProjetoCard";
import ProjetoLista from "@/components/ui/ProjetoLista";
import { useState, useEffect } from "react";
import FerramentaCard from "@/components/ui/FerramentaCard";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonCard, SkeletonCardSmall } from "@/components/ui/SkeletonCard";
import type { Projeto, Dashboard, Documentacao, Ferramenta, Pesquisa } from "@/types/bi-platform";

function normalizar(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default function BIPortfolioPage() {
  // SWR usando API unificada /api/itens?tipo=X com revalidação
  const { data: projetos, error: errorProjetos, isLoading: loadingProjetos, mutate: mutateProjetos } = useSWR<Projeto[]>(
    "/api/itens?tipo=projeto",
    async (url: string) => (await fetch(url, { cache: 'no-store' })).json(),
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const { data: dashboards, error: errorDash, isLoading: loadingDash, mutate: mutateDash } = useSWR<Dashboard[]>(
    "/api/itens?tipo=dashboard",
    async (url: string) => (await fetch(url, { cache: 'no-store' })).json(),
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const { data: docs, error: errorDocs, isLoading: loadingDocs, mutate: mutateDocs } = useSWR<Documentacao[]>(
    "/api/itens?tipo=documentacao",
    async (url: string) => (await fetch(url, { cache: 'no-store' })).json(),
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const { data: ferramentas, error: errorFerr, isLoading: loadingFerr, mutate: mutateFerr } = useSWR<Ferramenta[]>(
    "/api/itens?tipo=ferramenta",
    async (url: string) => (await fetch(url, { cache: 'no-store' })).json(),
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const { data: pesquisas, error: errorPesquisas, isLoading: loadingPesquisas, mutate: mutatePesquisas } = useSWR<Pesquisa[]>(
    "/api/pesquisas",
    async (url: string) => (await fetch(url, { cache: 'no-store' })).json(),
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("em desenvolvimento"); // Filtro padrão: Em Desenvolvimento
  const [areaFiltro, setAreaFiltro] = useState("todas");
  const [areaFiltroDocs, setAreaFiltroDocs] = useState("todas");
  const [areaFiltroDash, setAreaFiltroDash] = useState("todas");
  const [ordenacao, setOrdenacao] = useState<"recente" | "alfabetica">("recente");
  const [visualizacao, setVisualizacao] = useState<"grid" | "lista">("grid");
  const [visualizacaoDash, setVisualizacaoDash] = useState<"grid" | "tabela">("grid");
  const [visualizacaoDocs, setVisualizacaoDocs] = useState<"grid" | "tabela">("grid");

  // Atalho de teclado Ctrl+Shift+A para Admin
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Filtragem dos projetos com tipos corretos
  const projetosFiltrados = projetos?.filter((item: Projeto) => {
    const status = normalizar(item.status || "");
    const nome = (item.nome || "").toLowerCase();
    const filtroStatus = normalizar(statusFiltro);
    return (
      (filtroStatus === "todos" || status === filtroStatus) &&
      nome.includes(busca.toLowerCase())
    );
  }).sort((a, b) => {
    if (ordenacao === "alfabetica") {
      return a.nome.localeCompare(b.nome);
    }
    return 0; // recente (ordem original do BigQuery)
  });

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Image src="/images/f5-logo.png" alt="Control F5 Logo" width={120} height={32} className="h-8 w-auto" />
            <div className="border-l border-blue-200 pl-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                BI & Analytics
              </h1>
              <p className="text-xs text-blue-400">Business Intelligence Hub</p>
            </div>
          </div>

          {/* Remover menu de navegação do header */}
          {/* <nav className="hidden md:flex items-center space-x-6">
            <a href="/projetos" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Projetos
            </a>
            <a href="/documentacao" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Documentação
            </a>
            <a href="/dashboards" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Dashboards
            </a>
            <a href="/ferramentas" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Ferramentas
            </a>
          </nav> */}

          <div className="flex items-center space-x-3">
            <GlobalSearch />
            
            {/* Botão Admin */}
            <Link href="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-200 hover:bg-purple-50 bg-transparent text-blue-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white">
            {/* Remover badge */}
            {/* <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/25">
              📊 Área de Business Intelligence
            </Badge> */}

            <h1 className="text-4xl font-bold mb-4">Projetos e Soluções de BI</h1>

            <p className="text-lg text-blue-100 mb-8 max-w-2xl">
              Centralizamos projetos, documentações, dashboards, pesquisas e ferramentas que impulsionam nossa cultura de dados e apoiam a tomada de decisões estratégicas.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{projetos ? projetos.length : 0}</div>
                <div className="text-sm text-blue-100">Projetos</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{dashboards ? dashboards.length : 0}</div>
                <div className="text-sm text-blue-100">Dashboards</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{docs ? docs.length : 0}</div>
                <div className="text-sm text-blue-100">Documentação</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{ferramentas ? ferramentas.length : 0}</div>
                <div className="text-sm text-blue-100">Ferramentas</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{pesquisas ? pesquisas.length : 0}</div>
                <div className="text-sm text-blue-100">Pesquisas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="projetos" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <TabsTrigger
                value="projetos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Projetos
              </TabsTrigger>
              <TabsTrigger
                value="dashboards"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Dashboards
              </TabsTrigger>
              <TabsTrigger
                value="documentacao"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Documentação
              </TabsTrigger>
              <TabsTrigger
                value="ferramentas"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Ferramentas
              </TabsTrigger>
              <TabsTrigger
                value="pesquisas"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Pesquisas
              </TabsTrigger>
            </TabsList>

            {/* Projetos Tab */}
            <TabsContent value="projetos" id="projetos">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Projetos
                </h2>
                <div className="flex gap-2 flex-wrap items-center">
                  <Input
                    placeholder="Buscar projetos..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className="w-64 border-purple-200 focus:border-purple-400"
                  />
                  <select
                    value={statusFiltro}
                    onChange={e => setStatusFiltro(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  >
                    <option value="todos">Todos Status</option>
                    <option value="entregue">Entregue</option>
                    <option value="em desenvolvimento">Em Desenvolvimento</option>
                    <option value="standby">Standby</option>
                  </select>
                  <select
                    value={ordenacao}
                    onChange={e => setOrdenacao(e.target.value as "recente" | "alfabetica")}
                    className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  >
                    <option value="recente">Mais Recentes</option>
                    <option value="alfabetica">A-Z</option>
                  </select>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() => setVisualizacao("grid")}
                      className={`px-3 py-2 ${visualizacao === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                      title="Visualização em grade"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setVisualizacao("lista")}
                      className={`px-3 py-2 ${visualizacao === "lista" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                      title="Visualização em lista"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-12">
                {visualizacao === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                    {errorProjetos ? (
                      <div className="col-span-full">
                        <ErrorState 
                          message="Erro ao carregar projetos. Tente novamente." 
                          onRetry={() => mutateProjetos()}
                        />
                      </div>
                    ) : loadingProjetos ? (
                      [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                      projetosFiltrados?.map((item: Projeto) => (
                        <ProjetoCard
                          key={item.id}
                          id={item.id}
                          nome={item.nome}
                          descricao={item.descricao}
                          status={item.status}
                          data={item.data}
                          link={item.link}
                          docs={item.docs}
                          tecnologias={item.tecnologias || []}
                          area={item.area}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {errorProjetos ? (
                      <ErrorState 
                        message="Erro ao carregar projetos. Tente novamente." 
                        onRetry={() => mutateProjetos()}
                      />
                    ) : loadingProjetos ? (
                      [...Array(8)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                      ))
                    ) : (
                      projetosFiltrados?.map((item: Projeto) => (
                        <ProjetoLista
                          key={item.id}
                          id={item.id}
                          nome={item.nome}
                          descricao={item.descricao}
                          status={item.status}
                          data={item.data}
                          link={item.link}
                          docs={item.docs}
                          tecnologias={item.tecnologias || []}
                          area={item.area}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Dashboards Tab */}
            <TabsContent value="dashboards" id="dashboards">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Dashboards
                </h2>
                <div className="flex gap-2 items-center">
                  <select
                    value={areaFiltroDash}
                    onChange={e => setAreaFiltroDash(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  >
                    <option value="todas">Todas Áreas</option>
                    <option value="Tráfego">Tráfego</option>
                    <option value="Growth">Growth</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Planejamento">Planejamento</option>
                  </select>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() => setVisualizacaoDash("grid")}
                      className={`px-3 py-2 ${visualizacaoDash === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                      title="Visualização em grade"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setVisualizacaoDash("tabela")}
                      className={`px-3 py-2 ${visualizacaoDash === "tabela" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                      title="Visualização em tabela"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {visualizacaoDash === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 grid-flow-row-dense">
                  {errorDash ? (
                    <div className="col-span-full">
                      <ErrorState 
                        message="Erro ao carregar dashboards. Tente novamente." 
                        onRetry={() => mutateDash()}
                      />
                    </div>
                  ) : loadingDash ? (
                    [...Array(12)].map((_, i) => <SkeletonCardSmall key={i} />)
                  ) : (
                    (dashboards || [])
                      ?.filter((item: Dashboard) =>
                        areaFiltroDash === "todas" ||
                        normalizar(item.area || "") === normalizar(areaFiltroDash)
                      )
                      .map((item: Dashboard) => (
                        <CardItem
                          key={item.id}
                          id={item.id}
                          title={item.nome}
                          description={item.descricao}
                          link={item.link}
                          area={item.area}
                          icon={<BarChart3 className="w-5 h-5" />}
                          detailPath="/dashboards"
                        />
                      ))
                  )}
                  {!loadingDash && (dashboards || []).filter((item: Dashboard) =>
                    areaFiltroDash === "todas" ||
                    normalizar(item.area || "") === normalizar(areaFiltroDash)
                  ).length === 0 && (
                    <div className="col-span-full text-center text-gray-500">Nenhum resultado encontrado.</div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {errorDash ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12">
                            <ErrorState 
                              message="Erro ao carregar dashboards. Tente novamente." 
                              onRetry={() => mutateDash()}
                            />
                          </td>
                        </tr>
                      ) : loadingDash ? (
                        [...Array(6)].map((_, i) => (
                          <tr key={i}>
                            <td colSpan={4} className="px-6 py-4">
                              <div className="h-6 bg-gray-100 animate-pulse rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        (dashboards || [])
                          ?.filter((item: Dashboard) =>
                            areaFiltroDash === "todas" ||
                            normalizar(item.area || "") === normalizar(areaFiltroDash)
                          )
                          .map((item: Dashboard) => {
                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.nome}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.descricao}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
                                    {item.area}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex gap-3">
                                    <Link
                                      href={`/dashboards/${item.id}`}
                                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                                    >
                                      Detalhes
                                    </Link>
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                                    >
                                      Acessar <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  {!loadingDash && (dashboards || []).filter((item: Dashboard) =>
                    areaFiltroDash === "todas" ||
                    normalizar(item.area || "") === normalizar(areaFiltroDash)
                  ).length === 0 && (
                    <div className="text-center py-12 text-gray-500">Nenhum resultado encontrado.</div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Documentação Tab */}
            <TabsContent value="documentacao" id="documentacao">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Documentação
                </h2>
                <div className="flex gap-2 items-center">
                  <select
                    value={areaFiltroDocs}
                    onChange={e => setAreaFiltroDocs(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                  >
                    <option value="todas">Todas Áreas</option>
                    <option value="Tráfego">Tráfego</option>
                    <option value="Growth">Growth</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Planejamento">Planejamento</option>
                  </select>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() => setVisualizacaoDocs("grid")}
                      className={`px-3 py-2 ${visualizacaoDocs === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                      title="Visualização em grade"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setVisualizacaoDocs("tabela")}
                      className={`px-3 py-2 ${visualizacaoDocs === "tabela" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                      title="Visualização em tabela"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {visualizacaoDocs === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 grid-flow-row-dense">
                  {errorDocs ? (
                    <div className="col-span-full">
                      <ErrorState 
                        message="Erro ao carregar documentação. Tente novamente." 
                        onRetry={() => mutateDocs()}
                      />
                    </div>
                  ) : loadingDocs ? (
                    [...Array(12)].map((_, i) => <SkeletonCardSmall key={i} />)
                  ) : (
                    (docs || [])
                      ?.filter((item: Documentacao) =>
                        areaFiltroDocs === "todas" ||
                        normalizar(item.area || "") === normalizar(areaFiltroDocs)
                      )
                      .map((item: Documentacao) => (
                        <div key={item.id} className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 flex flex-col justify-between h-full">
                          <div className="mb-4">
                            {item.area && (
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium mb-2">{item.area}</span>
                            )}
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">{item.nome}</h3>
                            <p className="text-sm text-blue-700">{item.descricao || ""}</p>
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <Link
                              href={`/docs/${item.id}`}
                              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                            >
                              Detalhes
                            </Link>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                            >
                              Acessar <FileText className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      ))
                  )}
                  {!loadingDocs && (docs || []).filter((item: Documentacao) =>
                    areaFiltroDocs === "todas" ||
                    normalizar(item.area || "") === normalizar(areaFiltroDocs)
                  ).length === 0 && (
                    <div className="col-span-full text-center text-gray-500">Nenhum resultado encontrado.</div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {errorDocs ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12">
                            <ErrorState 
                              message="Erro ao carregar documentação. Tente novamente." 
                              onRetry={() => mutateDocs()}
                            />
                          </td>
                        </tr>
                      ) : loadingDocs ? (
                        [...Array(6)].map((_, i) => (
                          <tr key={i}>
                            <td colSpan={4} className="px-6 py-4">
                              <div className="h-6 bg-gray-100 animate-pulse rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        (docs || [])
                          ?.filter((item: Documentacao) =>
                            areaFiltroDocs === "todas" ||
                            normalizar(item.area || "") === normalizar(areaFiltroDocs)
                          )
                          .map((item: Documentacao) => {
                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.nome}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.descricao}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
                                    {item.area}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex gap-3">
                                    <Link
                                      href={`/docs/${item.id}`}
                                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                                    >
                                      Detalhes
                                    </Link>
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                                    >
                                      Acessar <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                  {!loadingDocs && (docs || []).filter((item: Documentacao) =>
                    areaFiltroDocs === "todas" ||
                    normalizar(item.area || "") === normalizar(areaFiltroDocs)
                  ).length === 0 && (
                    <div className="text-center py-12 text-gray-500">Nenhum resultado encontrado.</div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Ferramentas Tab */}
            <TabsContent value="ferramentas" id="ferramentas">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Portal de Ferramentas
                </h2>
                <p className="text-gray-600">
                  Acesso direto às principais ferramentas e plataformas utilizadas pela equipe de BI
                </p>
              </div>
              {errorFerr ? (
                <ErrorState 
                  message="Erro ao carregar ferramentas. Tente novamente." 
                  onRetry={() => mutateFerr()}
                />
              ) : loadingFerr ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-zinc-100 animate-pulse rounded-2xl mb-4"></div>
                ))
              ) : (
                ferramentas?.map((item: Ferramenta) => (
                  <FerramentaCard
                    key={item.id}
                    id={item.id}
                    nome={item.nome}
                    descricao={item.descricao}
                    link={item.link}
                    proxAtualizacao={item.proxima_atualizacao}
                  />
                ))
              )}
            </TabsContent>

            {/* Pesquisas Tab */}
            <TabsContent value="pesquisas" id="pesquisas">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Pesquisas
                </h2>
                <div className="flex gap-2 w-full max-w-xs">
                  <select
                    value={areaFiltro}
                    onChange={e => setAreaFiltro(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm text-gray-700 w-full"
                  >
                    <option value="todas">Todos os Temas</option>
                    {Array.from(new Set((pesquisas || []).map((p: any) => String(p.tema)).filter(Boolean))).map((tema, i) => (
                      <option key={i} value={String(tema)}>{String(tema)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {errorPesquisas ? (
                  <ErrorState 
                    message="Erro ao carregar pesquisas. Tente novamente." 
                    onRetry={() => mutatePesquisas()}
                  />
                ) : loadingPesquisas ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
                  ))
                ) : (
                  (pesquisas || [])
                    .filter((item: Pesquisa) => areaFiltro === "todas" || item.tema === areaFiltro)
                    .map((item: Pesquisa) => {
                      return (
                        <div key={item.id} className="bg-white rounded-xl shadow-md border-l-4 border-l-blue-400 hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-2">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold mb-1 md:mb-0">{item.tema}</span>
                            <span className="text-xs text-gray-500">{item.data}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.titulo}</h3>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <BookOpen className="w-5 h-5" />
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1"><span className="font-semibold">Fonte:</span> {item.fonte}</div>
                          <div className="text-sm text-gray-700 whitespace-pre-line mb-2 line-clamp-3">{item.conteudo}</div>
                          <div className="flex gap-3 flex-wrap">
                            <Link href={`/pesquisas/${item.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm">
                              Ver Detalhes
                            </Link>
                            {item.link ? (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm">
                                Acessar pesquisa
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">Link indisponível</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
                {!loadingPesquisas && (pesquisas || []).filter((item: Pesquisa) => areaFiltro === "todas" || item.tema === areaFiltro).length === 0 && (
                  <div className="col-span-full text-center text-gray-500">Nenhum resultado encontrado.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/images/f5-logo.png"
                alt="Control F5 Logo"
                width={100}
                height={26}
                className="h-6 w-auto opacity-90"
              />
              <div className="border-l border-blue-200 pl-4">
                <div className="font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  BI & Analytics Hub
                </div>
                <div className="text-sm text-blue-300">Business Intelligence</div>
              </div>
            </div>

            <div className="flex space-x-6 text-sm">
              {/* <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors">
                Suporte Técnico
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors">
                Solicitar Acesso
              </a> */}
              <a href="mailto:thiago@controlf5.com.br" className="text-blue-100 hover:text-yellow-300 transition-colors">
                Feedback
              </a>
            </div>
          </div>

          <div className="border-t border-blue-700 mt-6 pt-6 text-center text-sm text-blue-200">
            © 2024 Control F5 - Área de Business Intelligence. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
