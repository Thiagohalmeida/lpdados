import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  ChartNoAxesCombined,
  Database,
  Filter,
  Files,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const destaques = [
  {
    titulo: "Nossa miss\u00e3o",
    descricao: "Apoiar todas as \u00e1reas para decis\u00f5es estrat\u00e9gicas guiadas por dados, an\u00e1lises e insights extra\u00eddos de informa\u00e7\u00f5es concretas.",
    icone: ChartNoAxesCombined,
  },
  {
    titulo: "Fontes de dados",
    descricao: "Coletarmos dados de m\u00eddias sociais, ADS, SEO, CRM e streamming de informa\u00e7\u00f5es relevantes para nossas decis\u00f5es.",
    icone: Database,
  },
  {
    titulo: "Cloud",
    descricao: "Temos um armazenamento centralizado para os dados de diferentes fontes, como CRM, redes sociais e sites. Dessa forma, temos hist\u00f3rico detalhado em um formato estruturado, permitindo an\u00e1lises aprofundadas de tend\u00eancias e padr\u00f5es.",
    icone: ShieldCheck,
  },
];

const pipelineBenefits = ["Eficiência", "Qualidade", "Agilidade", "Escalabilidade"];

const pipelineStages = [
  {
    titulo: "Fontes de dados",
    descricao: "Redes sociais, ADS, SEO, CRM e sites.",
    icone: Files,
  },
  {
    titulo: "ETL",
    descricao: "Coleta, limpeza e padronizacao dos dados.",
    icone: Filter,
  },
  {
    titulo: "Armazenamento",
    descricao: "Dados estruturados em base centralizada.",
    icone: Database,
  },
  {
    titulo: "Analise",
    descricao: "Modelagem, visoes e insights acionaveis.",
    icone: BarChart3,
  },
  {
    titulo: "Uso",
    descricao: "Decisoes estrategicas com suporte analitico.",
    icone: Rocket,
  },
];

const dataDrivenImpacts = [
  {
    numero: "01",
    titulo: "Decisões mais assertivas",
    descricao:
      "Decisões com base em dados concretos, reduzindo a subjetividade e aumentando a precisão nas escolhas estratégicas.",
  },
  {
    numero: "02",
    titulo: "Identificação de oportunidades",
    descricao:
      "Dados organizados e acessíveis permitem detectar padrões, comportamento de clientes e áreas de melhoria, gerando insights para inovações ou novos negócios.",
  },
  {
    numero: "03",
    titulo: "Otimização de processos",
    descricao:
      "Permite identificar gargalos e ineficiências operacionais, levando à automação e à melhoria contínua dos processos internos.",
  },
  {
    numero: "04",
    titulo: "Experiência do cliente",
    descricao:
      "Melhora a experiência do cliente e impulsiona o crescimento ao entender melhor o comportamento.",
  },
  {
    numero: "05",
    titulo: "Eficiência da performance financeira",
    descricao:
      "Reduz custos e maximiza o retorno sobre investimentos ao priorizar ações com maior potencial de sucesso.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#1d4ed8_0%,#1e3a8a_45%,#0f172a_100%)] text-white">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent_0%,#ffffff_30%,transparent_60%)]" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="mt-8 flex items-center gap-4">
              <Image src="/images/f5-logo.png" alt="Control F5 Logo" width={120} height={32} className="h-8 w-auto" />
              <span className="text-blue-100 text-sm">Business Intelligence | Planejamento e Estrategia</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
              Portal Bussines Intelligence
            </h1>
            <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-3xl">
              Bem-vindo ao seu hub de dados! Este portal centraliza nossas ferramentas, dashboards e projetos de BI em um so lugar.
              Descubra como nossa area esta estruturada, entenda nossos fluxos e acesse materiais de apoio criados para impulsionar a cultura data-driven no seu time.
              Conecte-se, analise e decida com confianca.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/portal">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                  Entrar no Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/central-ajuda">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                  Ver Central de Ajuda
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="text-blue-100 hover:text-white hover:bg-white/10">
                  Area administrativa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {destaques.map((item) => {
            const Icon = item.icone;
            return (
              <Card key={item.titulo} className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold text-slate-900">
                    <Icon className="h-6 w-6 text-blue-700" />
                    {item.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base md:text-lg leading-relaxed text-slate-700">
                    {item.descricao}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 px-6 py-8 md:px-8 md:py-10 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Pipeline</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Pipeline de Dados</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {pipelineBenefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((stage, index) => {
              const Icon = stage.icone;
              const isLast = index === pipelineStages.length - 1;

              return (
                <div key={stage.titulo} className="relative">
                  <Card className="h-full border-white/20 bg-white/10 text-white backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm uppercase tracking-wide text-blue-50">
                        {stage.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/20 p-2.5">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-blue-50">{stage.descricao}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {!isLast && (
                    <>
                      <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white text-blue-700 shadow">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div className="flex md:hidden justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-blue-100" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 md:p-8 shadow-xl">
          <div className="pointer-events-none absolute -top-20 -right-10 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-6 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />

          <div className="relative mb-7">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cultura Data-Driven</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">5 impactos para o negócio</h2>
            <p className="mt-2 text-sm md:text-base text-slate-600">
              Como a cultura orientada por dados gera valor real para as áreas da empresa.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataDrivenImpacts.map((item) => (
              <Card
                key={item.numero}
                className="group border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-300"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 min-w-[84px]">
                      <span className="h-2.5 w-2.5 rounded-sm bg-slate-400 mt-2 group-hover:bg-blue-500 transition-colors"></span>
                      <span className="text-4xl font-black leading-none text-amber-500">{item.numero}</span>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 group-hover:decoration-blue-400">
                        {item.titulo}
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-slate-600">{item.descricao}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[linear-gradient(120deg,#0f172a_0%,#1e293b_45%,#111827_100%)] text-slate-200 border-t border-slate-700/60">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/images/f5-logo.png"
                alt="Control F5 Logo"
                width={120}
                height={32}
                className="h-8 w-auto opacity-95"
              />
              <div className="border-l border-slate-500 pl-4">
                <p className="text-sm font-semibold text-white">Business Intelligence</p>
                <p className="text-xs text-slate-300">Planejamento e Estrategia</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/portal" className="hover:text-white transition-colors">
                Portal
              </Link>
              <Link href="/central-ajuda" className="hover:text-white transition-colors">
                Central de Ajuda
              </Link>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
              <a href="mailto:thiago@controlf5.com.br" className="hover:text-white transition-colors">
                Contato
              </a>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-600/70 pt-5 text-center text-sm text-slate-300">
            {"\u00a9 2024 Control F5 - \u00c1rea de Business Intelligence. Todos os direitos reservados."}
          </div>
        </div>
      </footer>
    </main>
  );
}
