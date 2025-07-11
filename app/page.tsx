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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import useSWR from "swr";
import { CardItem } from "@/components/ui/CardItem";
import ProjetoCard from "@/components/ui/ProjetoCard";
import { useState } from "react";
import FerramentaCard from "@/components/ui/FerramentaCard";

function normalizar(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default function BIPortfolioPage() {
  // SWR para cada aba
  const { data: projetos, error: errorProjetos, isLoading: loadingProjetos } = useSWR(
    "/api/projetos",
    async (url: string) => (await fetch(url)).json()
  );
  const { data: dashboards, error: errorDash, isLoading: loadingDash } = useSWR(
    "/api/dashboards",
    async (url: string) => (await fetch(url)).json()
  );
  const { data: docs, error: errorDocs, isLoading: loadingDocs } = useSWR(
    "/api/docs",
    async (url: string) => (await fetch(url)).json()
  );
  const { data: ferramentas, error: errorFerr, isLoading: loadingFerr } = useSWR(
    "/api/ferramentas",
    async (url: string) => (await fetch(url)).json()
  );
  const { data: pesquisas, error: errorPesquisas, isLoading: loadingPesquisas } = useSWR(
    "/api/pesquisas",
    async (url: string) => (await fetch(url)).json()
  );

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [areaFiltro, setAreaFiltro] = useState("todas");
  const [areaFiltroDocs, setAreaFiltroDocs] = useState("todas");
  const [areaFiltroDash, setAreaFiltroDash] = useState("todas");

  // Filtragem dos projetos
  const projetosFiltrados = projetos?.filter((item: any) => {
    const status = normalizar(item.status || "");
    const nome = (item.nome || item.Nome || "").toLowerCase();
    const filtroStatus = normalizar(statusFiltro);
    return (
      (filtroStatus === "todos" || status === filtroStatus) &&
      nome.includes(busca.toLowerCase())
    );
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
            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50 bg-transparent text-blue-600">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar projetos..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className="w-64 border-purple-200 focus:border-purple-400"
                  />
                  <select
                    value={statusFiltro}
                    onChange={e => setStatusFiltro(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm text-gray-700"
                  >
                    <option value="todos">Todos</option>
                    <option value="entregue">Entregue</option>
                    <option value="em desenvolvimento">Em Desenvolvimento</option>
                    <option value="standby">Standby</option>
                  </select>
                  <Button variant="outline" size="icon" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                    <Filter className="h-4 w-4 text-purple-600" />
                  </Button>
                </div>
              </div>

              <div className="px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                  {projetosFiltrados?.map((item: any, i: number) => (
                    <ProjetoCard
                      key={i}
                      nome={item.projeto || item.nome || item.Nome || item.titulo || item.Processo}
                      descricao={item.descricao || item.Descricao || item.conteudo || ""}
                      status={item.status || ""}
                      data={item.data || item.Data || ""}
                      link={item.link || item.Link}
                      docs={item.docs || item.Docs}
                      tecnologias={item.tecnologias || []}
                      area={item.area || item.Area || ""}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Dashboards Tab */}
            <TabsContent value="dashboards" id="dashboards">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Dashboards
                </h2>
                <div className="flex gap-2">
                  <select
                    value={areaFiltroDash}
                    onChange={e => setAreaFiltroDash(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm text-gray-700"
                  >
                    <option value="todas">Todas</option>
                    <option value="Tráfego">Tráfego</option>
                    <option value="Growth">Growth</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Planejamento">Planejamento</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 grid-flow-row-dense">
                {errorDash ? (
                  <div className="text-red-500">Erro ao carregar dashboards.</div>
                ) : loadingDash ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
                  ))
                ) : (
                  dashboards
                    ?.filter((item: any) =>
                      areaFiltroDash === "todas" ||
                      normalizar(item.Area || "") === normalizar(areaFiltroDash)
                    )
                    .map((item: any, i: number) => (
                      <CardItem
                        key={i}
                        title={item.Nome}
                        description={item.Descricao}
                        link={item.Link}
                        area={item.Area}
                        icon={<BarChart3 className="w-5 h-5" />}
                      />
                    ))
                )}
                {!loadingDash && dashboards?.filter((item: any) =>
                  areaFiltroDash === "todas" ||
                  normalizar(item.Area || "") === normalizar(areaFiltroDash)
                ).length === 0 && (
                  <div className="col-span-full text-center text-gray-500">Nenhum resultado encontrado.</div>
                )}
              </div>
            </TabsContent>

            {/* Documentação Tab */}
            <TabsContent value="documentacao" id="documentacao">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Documentação
                </h2>
                <div className="flex gap-2">
                  <select
                    value={areaFiltroDocs}
                    onChange={e => setAreaFiltroDocs(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm text-gray-700"
                  >
                    <option value="todas">Todas</option>
                    <option value="Tráfego">Tráfego</option>
                    <option value="Growth">Growth</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Planejamento">Planejamento</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 grid-flow-row-dense">
                {errorDocs ? (
                  <div className="col-span-full text-red-500">Erro ao carregar documentação.</div>
                ) : loadingDocs ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
                  ))
                ) : (
                  docs
                    ?.filter((item: any) =>
                      areaFiltroDocs === "todas" ||
                      normalizar(item["Area"] || "") === normalizar(areaFiltroDocs)
                    )
                    .map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 flex flex-col justify-between h-full">
                        <div className="mb-4">
                          {item["Area"] && (
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium mb-2">{item["Area"]}</span>
                          )}
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">{item.Processo}</h3>
                          <p className="text-sm text-blue-700">{item.Descricao || ""}</p>
                        </div>
                        <a
                          href={item.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                        >
                          Acessar <FileText className="w-5 h-5" />
                        </a>
                      </div>
                    ))
                )}
                {!loadingDocs && docs?.filter((item: any) =>
                  areaFiltroDocs === "todas" ||
                  normalizar(item["Area"] || "") === normalizar(areaFiltroDocs)
                ).length === 0 && (
                  <div className="col-span-full text-center text-gray-500">Nenhum resultado encontrado.</div>
                )}
              </div>
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
                <div className="text-red-500">Erro ao carregar ferramentas.</div>
              ) : loadingFerr ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-zinc-100 animate-pulse rounded-2xl mb-4"></div>
                ))
              ) : (
                ferramentas?.map((item: any, i: number) => (
                  <FerramentaCard
                    key={i}
                    nome={item.Nome}
                    descricao={item.Descricao}
                    link={item.Link}
                    proxAtualizacao={item.ProxAtualizacao}
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
                  <div className="col-span-full text-red-500">Erro ao carregar pesquisas.</div>
                ) : loadingPesquisas ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl"></div>
                  ))
                ) : (
                  (pesquisas || [])
                    .filter((item: any) => areaFiltro === "todas" || item.tema === areaFiltro)
                    .map((item: any, i: number) => (
                      <div key={i} className="bg-white rounded-xl shadow-md border-l-4 border-l-blue-400 hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold mb-1 md:mb-0">{item.tema}</span>
                          <span className="text-xs text-gray-500">{item.data}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.Titulo}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <BookOpen className="w-5 h-5" />
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1"><span className="font-semibold">Fonte:</span> {item.fonte}</div>
                        <div className="text-sm text-gray-700 whitespace-pre-line mb-2">{item.conteudo}</div>
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm">
                            Acessar pesquisa
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">Link indisponível</span>
                        )}
                      </div>
                    ))
                )}
                {!loadingPesquisas && (pesquisas || []).filter((item: any) => areaFiltro === "todas" || item.tema === areaFiltro).length === 0 && (
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
