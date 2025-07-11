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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function BIPortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Image src="/images/f5-logo.png" alt="Control F5 Logo" width={120} height={32} className="h-8 w-auto" />
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                BI & Analytics
              </h1>
              <p className="text-xs text-gray-500">Business Intelligence Hub</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#projetos" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Projetos
            </a>
            <a href="#documentacao" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Documentação
            </a>
            <a href="#dashboards" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Dashboards
            </a>
            <a href="#ferramentas" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Ferramentas
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50 bg-transparent">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/25">
              📊 Área de Business Intelligence
            </Badge>

            <h1 className="text-4xl font-bold mb-4">Portfólio de Projetos e Soluções de BI</h1>

            <p className="text-lg text-blue-100 mb-8 max-w-2xl">
              Centralizamos aqui todos os projetos, documentações, dashboards e recursos desenvolvidos pela nossa equipe
              de Business Intelligence para apoiar a tomada de decisões estratégicas.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">47</div>
                <div className="text-sm text-blue-100">Projetos Ativos</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">23</div>
                <div className="text-sm text-blue-100">Dashboards</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">156</div>
                <div className="text-sm text-blue-100">Relatórios</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">8</div>
                <div className="text-sm text-blue-100">Analistas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="projetos" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <TabsTrigger
                value="projetos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Projetos
              </TabsTrigger>
              <TabsTrigger
                value="dashboards"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Dashboards
              </TabsTrigger>
              <TabsTrigger
                value="documentacao"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Documentação
              </TabsTrigger>
              <TabsTrigger
                value="ferramentas"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                Ferramentas
              </TabsTrigger>
            </TabsList>

            {/* Projetos Tab */}
            <TabsContent value="projetos" id="projetos">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Projetos Recentes
                </h2>
                <div className="flex gap-2">
                  <Input placeholder="Buscar projetos..." className="w-64 border-purple-200 focus:border-purple-400" />
                  <Button variant="outline" size="icon" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                    <Filter className="h-4 w-4 text-purple-600" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>
                      <span className="text-sm text-gray-500">Nov 2024</span>
                    </div>
                    <CardTitle className="text-lg">Dashboard Vendas Q4</CardTitle>
                    <CardDescription>
                      Análise completa de performance de vendas do último trimestre com KPIs principais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Power BI
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        SQL Server
                      </Badge>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                        DAX
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visualizar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>
                      <span className="text-sm text-gray-500">Dez 2024</span>
                    </div>
                    <CardTitle className="text-lg">Análise de Churn</CardTitle>
                    <CardDescription>
                      Modelo preditivo para identificação de clientes com risco de cancelamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Python
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Machine Learning
                      </Badge>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                        Tableau
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-transparent" disabled variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Em Desenvolvimento
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Specs
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>
                      <span className="text-sm text-gray-500">Out 2024</span>
                    </div>
                    <CardTitle className="text-lg">ETL Financeiro</CardTitle>
                    <CardDescription>
                      Pipeline automatizado para consolidação de dados financeiros de múltiplas fontes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        SSIS
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Azure Data Factory
                      </Badge>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                        SQL
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Database className="h-3 w-3 mr-1" />
                        Monitorar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500 hover:border-l-yellow-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Planejado</Badge>
                      <span className="text-sm text-gray-500">Jan 2025</span>
                    </div>
                    <CardTitle className="text-lg">Dashboard RH</CardTitle>
                    <CardDescription>
                      Métricas de recursos humanos incluindo turnover, satisfação e performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Power BI
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        SharePoint
                      </Badge>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                        Excel
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent border-yellow-300 hover:bg-yellow-50"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Agendar Kickoff
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Requisitos
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>
                      <span className="text-sm text-gray-500">Set 2024</span>
                    </div>
                    <CardTitle className="text-lg">Análise de Estoque</CardTitle>
                    <CardDescription>
                      Dashboard para otimização de estoque com alertas de reposição automática
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Qlik Sense
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Oracle
                      </Badge>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                        API REST
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Acessar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Manual
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>
                      <span className="text-sm text-gray-500">Dez 2024</span>
                    </div>
                    <CardTitle className="text-lg">Data Lake Migration</CardTitle>
                    <CardDescription>Migração de dados legados para arquitetura moderna de Data Lake</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Azure
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Databricks
                      </Badge>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                        Spark
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Progresso
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50 bg-transparent"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Dashboards Tab */}
            <TabsContent value="dashboards" id="dashboards">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Dashboards Ativos
                </h2>
                <p className="text-gray-600">Acesse os principais dashboards organizados por área de negócio</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                    Comercial & Vendas
                  </h3>
                  <div className="space-y-3">
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-blue-400 hover:border-l-blue-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Performance de Vendas</h4>
                          <p className="text-sm text-gray-500">Atualizado há 2 horas</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-purple-400 hover:border-l-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Funil de Conversão</h4>
                          <p className="text-sm text-gray-500">Atualizado há 1 hora</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-pink-400 hover:border-l-pink-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Análise de Território</h4>
                          <p className="text-sm text-gray-500">Atualizado há 4 horas</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                    Operações & Logística
                  </h3>
                  <div className="space-y-3">
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-green-400 hover:border-l-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Controle de Estoque</h4>
                          <p className="text-sm text-gray-500">Tempo real</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-400 hover:border-l-yellow-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Logística de Entrega</h4>
                          <p className="text-sm text-gray-500">Atualizado há 30 min</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-blue-400 hover:border-l-blue-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Qualidade & SLA</h4>
                          <p className="text-sm text-gray-500">Atualizado há 1 hora</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-3"></div>
                    Financeiro
                  </h3>
                  <div className="space-y-3">
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-purple-400 hover:border-l-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">DRE Gerencial</h4>
                          <p className="text-sm text-gray-500">Mensal</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-blue-400 hover:border-l-blue-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Fluxo de Caixa</h4>
                          <p className="text-sm text-gray-500">Diário</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-pink-400 hover:border-l-pink-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Contas a Receber</h4>
                          <p className="text-sm text-gray-500">Tempo real</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mr-3"></div>
                    Recursos Humanos
                  </h3>
                  <div className="space-y-3">
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-orange-400 hover:border-l-orange-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Headcount & Turnover</h4>
                          <p className="text-sm text-gray-500">Mensal</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-purple-400 hover:border-l-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Performance Review</h4>
                          <p className="text-sm text-gray-500">Trimestral</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-blue-400 hover:border-l-blue-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Absenteísmo</h4>
                          <p className="text-sm text-gray-500">Semanal</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-purple-400" />
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Documentação Tab */}
            <TabsContent value="documentacao" id="documentacao">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Documentação Técnica
                </h2>
                <p className="text-gray-600">Guias, manuais e documentação de processos da área de BI</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Guias de Usuário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Como acessar dashboards</span>
                      <ExternalLink className="h-3 w-3 text-purple-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Solicitação de relatórios</span>
                      <ExternalLink className="h-3 w-3 text-purple-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">FAQ - Perguntas frequentes</span>
                      <ExternalLink className="h-3 w-3 text-purple-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Glossário de termos</span>
                      <ExternalLink className="h-3 w-3 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-purple-500 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Database className="h-5 w-5 mr-2 text-purple-600" />
                      Documentação Técnica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Arquitetura de dados</span>
                      <ExternalLink className="h-3 w-3 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Dicionário de dados</span>
                      <ExternalLink className="h-3 w-3 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Processos ETL</span>
                      <ExternalLink className="h-3 w-3 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">APIs disponíveis</span>
                      <ExternalLink className="h-3 w-3 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-pink-500 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="h-5 w-5 mr-2 text-pink-600" />
                      Processos & Governança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-pink-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Política de dados</span>
                      <ExternalLink className="h-3 w-3 text-pink-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-pink-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">SLA de entregas</span>
                      <ExternalLink className="h-3 w-3 text-pink-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-pink-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Processo de aprovação</span>
                      <ExternalLink className="h-3 w-3 text-pink-400" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-pink-50 rounded cursor-pointer transition-colors">
                      <span className="text-sm">Backup e recovery</span>
                      <ExternalLink className="h-3 w-3 text-pink-400" />
                    </div>
                  </CardContent>
                </Card>
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

              {/* Ferramentas Principais */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-t-purple-400 hover:border-t-purple-500 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Power BI Service</h3>
                  <p className="text-sm text-gray-600 mb-4">Dashboards e relatórios interativos</p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Acessar Portal <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-t-blue-400 hover:border-t-blue-500 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Data Warehouse</h3>
                  <p className="text-sm text-gray-600 mb-4">Repositório central de dados</p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Conectar <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-t-pink-400 hover:border-t-pink-500 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Confluence</h3>
                  <p className="text-sm text-gray-600 mb-4">Wiki e documentação</p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    Navegar <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-t-yellow-400 hover:border-t-yellow-500 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Tableau Server</h3>
                  <p className="text-sm text-gray-600 mb-4">Visualizações avançadas</p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  >
                    Abrir <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Card>
              </div>

              {/* Ferramentas Desenvolvidas Internamente */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Ferramentas Desenvolvidas Internamente
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-400 hover:border-l-blue-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Portal de Vendas</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Dashboard executivo com métricas de vendas em tempo real
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Acessar <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-400 hover:border-l-purple-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Monitor Financeiro</h4>
                    <p className="text-sm text-gray-600 mb-4">Acompanhamento de indicadores financeiros e DRE</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Acessar <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-pink-400 hover:border-l-pink-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Em Desenvolvimento</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Analytics Hub</h4>
                    <p className="text-sm text-gray-600 mb-4">Central de análises preditivas e machine learning</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-pink-300 hover:bg-pink-50 bg-transparent"
                    >
                      Em Breve <Calendar className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-400 hover:border-l-yellow-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Relatórios Automatizados</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Sistema de geração e distribuição automática de relatórios
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                    >
                      Acessar <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400 hover:border-l-green-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Data Quality Monitor</h4>
                    <p className="text-sm text-gray-600 mb-4">Monitoramento da qualidade e integridade dos dados</p>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Monitorar <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-400 hover:border-l-indigo-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Beta</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">Self-Service BI</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Plataforma para criação de relatórios pelos usuários finais
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-indigo-300 hover:bg-indigo-50 bg-transparent"
                    >
                      Testar Beta <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Card>
                </div>
              </div>

              {/* Templates e Recursos */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Templates e Recursos
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 border-l-4 border-l-blue-400 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Template Dashboard</h4>
                        <p className="text-sm text-gray-500">Modelo padrão Power BI</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-300 hover:bg-blue-50 bg-transparent">
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-purple-400 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Especificação Técnica</h4>
                        <p className="text-sm text-gray-500">Template para novos projetos</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 hover:bg-purple-50 bg-transparent"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-pink-400 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Checklist de Entrega</h4>
                        <p className="text-sm text-gray-500">Lista de verificação</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-pink-300 hover:bg-pink-50 bg-transparent">
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white py-8">
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
              <div className="border-l border-gray-400 pl-4">
                <div className="font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  BI & Analytics Hub
                </div>
                <div className="text-sm text-gray-300">Business Intelligence</div>
              </div>
            </div>

            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors">
                Suporte Técnico
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors">
                Solicitar Acesso
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors">
                Feedback
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            © 2024 Control F5 - Área de Business Intelligence. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
