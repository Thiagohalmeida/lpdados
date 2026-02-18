import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, User, Building2, MessageSquare, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAppBaseUrl } from '@/lib/runtime-url';

async function getFerramenta(id: string) {
  try {
    const baseUrl = await getAppBaseUrl();
    const res = await fetch(`${baseUrl}/api/ferramentas`, { cache: 'no-store' });
    if (!res.ok) return null;
    const ferramentas = await res.json();
  
  // Função para normalizar string (remove acentos e converte para kebab-case)
  const normalizeForUrl = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^\w-]/g, ''); // Remove caracteres especiais exceto hífens
  };
  
    return ferramentas.find((f: any) => {
      const normalizedNome = f.nome ? normalizeForUrl(f.nome) : '';
      const normalizedId = normalizeForUrl(id);
      return f.id === id || normalizedNome === normalizedId;
    });
  } catch (error) {
    console.error('Erro ao carregar detalhes de ferramenta:', error);
    return null;
  }
}

export default async function FerramentaDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ferramenta = await getFerramenta(id);

  if (!ferramenta) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Ferramentas</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{ferramenta.nome}</span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Wrench className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{ferramenta.nome}</h1>
              <p className="text-xl text-orange-100">{ferramenta.descricao}</p>
            </div>
          </div>
          {ferramenta.proxima_atualizacao && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              📅 Próxima Atualização: {ferramenta.proxima_atualizacao}
            </div>
          )}
        </div>

        {/* Conteúdo em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Informações Básicas */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                Informações da Ferramenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {ferramenta.proxima_atualizacao && (
                <InfoRow 
                  label="Próxima Atualização" 
                  value={ferramenta.proxima_atualizacao} 
                  icon={<Calendar className="h-4 w-4" />} 
                />
              )}
              {ferramenta.link && (
                <div className="pt-2">
                  <a
                    href={ferramenta.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-orange-600 hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Acessar Ferramenta
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gestão */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow 
                label="Data Início" 
                value={ferramenta.data_inicio ? new Date(ferramenta.data_inicio).toLocaleDateString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Última Atualização" 
                value={ferramenta.ultima_atualizacao ? new Date(ferramenta.ultima_atualizacao).toLocaleString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Responsável" 
                value={ferramenta.responsavel || 'Não atribuído'} 
                icon={<User className="h-4 w-4" />}
              />
              <InfoRow 
                label="Cliente" 
                value={ferramenta.cliente || 'Não definido'} 
                icon={<Building2 className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Observações */}
          {ferramenta.observacao && (
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{ferramenta.observacao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Portal
            </Button>
          </Link>
          
          {ferramenta.link && (
            <a href={ferramenta.link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <ExternalLink className="h-5 w-5" />
                Acessar Ferramenta
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
