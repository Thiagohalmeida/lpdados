import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, FileText, Calendar, User, Building2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findPortalItemByIdOrSlug } from '@/lib/detail-data';

async function getProjeto(id: string) {
  try {
    return await findPortalItemByIdOrSlug('projeto', id);
  } catch (error) {
    console.error('Erro ao carregar detalhes de projeto:', error);
    return null;
  }
}

export default async function ProjetoDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projeto = await getProjeto(id);

  if (!projeto) {
    notFound();
  }

  // Função para determinar a cor do badge de status
  const getStatusColor = (status: string) => {
    const statusNorm = status.toLowerCase();
    if (statusNorm.includes('entregue')) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    if (statusNorm.includes('desenvolvimento')) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    }
    if (statusNorm.includes('standby')) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
    return 'bg-purple-100 text-purple-700 border-purple-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/portal" className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Projetos</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{projeto.nome}</span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{projeto.nome}</h1>
              <p className="text-xl text-blue-100">{projeto.descricao}</p>
            </div>
            {projeto.status && (
              <Badge className={`${getStatusColor(projeto.status)} text-sm px-4 py-2`}>
                {projeto.status}
              </Badge>
            )}
          </div>
          {projeto.area && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              📁 {projeto.area}
            </div>
          )}
        </div>

        {/* Conteúdo em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Informações Básicas */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow label="Data" value={projeto.data || 'Não informada'} icon={<Calendar className="h-4 w-4" />} />
              <InfoRow label="Área" value={projeto.area || 'Não informada'} icon={<Building2 className="h-4 w-4" />} />
              {projeto.link && (
                <div className="pt-2">
                  <a
                    href={projeto.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Acessar Projeto
                  </a>
                </div>
              )}
              {projeto.docs && (
                <div>
                  <a
                    href={projeto.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:underline font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    Ver Documentação
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gestão do Projeto */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Gestão do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow 
                label="Data Início" 
                value={projeto.data_inicio ? new Date(projeto.data_inicio).toLocaleDateString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Última Atualização" 
                value={projeto.ultima_atualizacao ? new Date(projeto.ultima_atualizacao).toLocaleString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Responsável" 
                value={projeto.responsavel || 'Não atribuído'} 
                icon={<User className="h-4 w-4" />}
              />
              <InfoRow 
                label="Cliente" 
                value={projeto.cliente || 'Não definido'} 
                icon={<Building2 className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Tecnologias */}
          {projeto.tecnologias && projeto.tecnologias.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle>💻 Tecnologias</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {projeto.tecnologias.map((tec: string, i: number) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                      {tec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {projeto.observacao && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{projeto.observacao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-4 justify-center">
          <Link href="/portal">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Portal
            </Button>
          </Link>
          
          {projeto.link && (
            <a href={projeto.link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <ExternalLink className="h-5 w-5" />
                Acessar Projeto
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar
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
