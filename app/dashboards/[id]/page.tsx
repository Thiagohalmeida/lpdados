import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, User, Building2, MessageSquare, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAppBaseUrl } from '@/lib/runtime-url';

interface DashboardDocInsight {
  insight_id: string;
  title: string;
  description: string;
  notes: string[];
}

interface DashboardDocGlossaryField {
  field_id: string;
  name: string;
  description: string;
  formula: string | null;
  example: string | null;
  unit: string | null;
}

interface DashboardDocView {
  view_id: string;
  title: string;
  insights: DashboardDocInsight[];
  glossary_fields: DashboardDocGlossaryField[];
}

interface DashboardDocsPayload {
  dashboard_id: string;
  views: DashboardDocView[];
}

async function getDashboard(id: string) {
  try {
    const baseUrl = await getAppBaseUrl();
    const res = await fetch(`${baseUrl}/api/dashboards`, { cache: 'no-store' });
    if (!res.ok) return null;
    const dashboards = await res.json();

  const normalizeForUrl = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

    return dashboards.find((d: any) => {
      const normalizedNome = d.nome ? normalizeForUrl(d.nome) : '';
      const normalizedId = normalizeForUrl(id);
      return d.id === id || normalizedNome === normalizedId;
    });
  } catch (error) {
    console.error('Erro ao carregar detalhes de dashboard:', error);
    return null;
  }
}

async function getDashboardDocs(dashboardId: string): Promise<DashboardDocsPayload | null> {
  try {
    const baseUrl = await getAppBaseUrl();
    const res = await fetch(`${baseUrl}/api/dashboard-docs/${dashboardId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Erro ao carregar docs do dashboard:', error);
    return null;
  }
}

export default async function DashboardDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dashboard = await getDashboard(id);

  if (!dashboard) {
    notFound();
  }

  const dashboardDocs = await getDashboardDocs(dashboard.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Dashboards</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{dashboard.nome}</span>
        </nav>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <BarChart3 className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{dashboard.nome}</h1>
              <p className="text-xl text-purple-100">{dashboard.descricao}</p>
            </div>
          </div>
          {dashboard.area && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              Area: {dashboard.area}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Informacoes do Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow label="Area" value={dashboard.area || 'Nao informada'} icon={<Building2 className="h-4 w-4" />} />
              {dashboard.link && (
                <div className="pt-2">
                  <a
                    href={dashboard.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Acessar Dashboard
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Gestao
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow
                label="Data Inicio"
                value={dashboard.data_inicio ? new Date(dashboard.data_inicio).toLocaleDateString('pt-BR') : 'Nao definida'}
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow
                label="Ultima Atualizacao"
                value={dashboard.ultima_atualizacao ? new Date(dashboard.ultima_atualizacao).toLocaleString('pt-BR') : 'Nao definida'}
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow
                label="Responsavel"
                value={dashboard.responsavel || 'Nao atribuido'}
                icon={<User className="h-4 w-4" />}
              />
              <InfoRow
                label="Cliente"
                value={dashboard.cliente || 'Nao definido'}
                icon={<Building2 className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {dashboardDocs && dashboardDocs.views.length > 0 && (
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Dicionario de Dados e Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {dashboardDocs.views.map((view) => (
                  <div key={view.view_id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{view.title}</h3>
                      <p className="text-xs text-gray-500">Guia: {view.view_id}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Insights</h4>
                        {view.insights.length === 0 ? (
                          <p className="text-sm text-gray-500">Sem insights cadastrados.</p>
                        ) : (
                          <div className="space-y-3">
                            {view.insights.map((insight) => (
                              <div key={insight.insight_id} className="rounded-md bg-gray-50 p-3">
                                <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{insight.description}</p>
                                {insight.notes.length > 0 && (
                                  <ul className="mt-2 text-xs text-gray-600 list-disc pl-4 space-y-1">
                                    {insight.notes.map((note, idx) => (
                                      <li key={`${insight.insight_id}-note-${idx}`}>{note}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Glossario</h4>
                        {view.glossary_fields.length === 0 ? (
                          <p className="text-sm text-gray-500">Sem campos de glossario cadastrados.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-left p-2 border-b">Campo</th>
                                  <th className="text-left p-2 border-b">Descricao</th>
                                  <th className="text-left p-2 border-b">Formula</th>
                                </tr>
                              </thead>
                              <tbody>
                                {view.glossary_fields.map((field) => (
                                  <tr key={field.field_id} className="border-b last:border-b-0">
                                    <td className="p-2 font-medium text-gray-900">{field.name}</td>
                                    <td className="p-2 text-gray-700">{field.description}</td>
                                    <td className="p-2 text-gray-600">{field.formula || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {dashboard.observacao && (
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Observacoes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{dashboard.observacao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Portal
            </Button>
          </Link>

          {dashboard.link && (
            <a href={dashboard.link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <ExternalLink className="h-5 w-5" />
                Acessar Dashboard
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between border-b border-gray-100 pb-3">
      <span className="font-medium text-gray-600 flex items-center gap-2">
        {icon}
        {label}:
      </span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}
