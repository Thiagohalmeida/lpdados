import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, User, Building2, MessageSquare, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { findPesquisaByIdOrSlug } from '@/lib/detail-data';

async function getPesquisa(id: string) {
  try {
    return await findPesquisaByIdOrSlug(id);
  } catch (error) {
    console.error('Erro ao carregar detalhes de pesquisa:', error);
    return null;
  }
}

export default async function PesquisaDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pesquisa = await getPesquisa(id);

  if (!pesquisa) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Pesquisas</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{pesquisa.titulo}</span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <BookOpen className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{pesquisa.titulo}</h1>
              <p className="text-lg text-pink-100 mb-2">Fonte: {pesquisa.fonte}</p>
              {pesquisa.data && (
                <p className="text-sm text-pink-200">📅 {pesquisa.data}</p>
              )}
            </div>
          </div>
          {pesquisa.tema && (
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2">
              {pesquisa.tema}
            </Badge>
          )}
        </div>

        {/* Conteúdo em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Conteúdo da Pesquisa */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-600" />
                Conteúdo da Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                {pesquisa.conteudo}
              </p>
              {pesquisa.link && (
                <div className="mt-6 pt-6 border-t">
                  <a
                    href={pesquisa.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:underline font-medium text-lg"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Acessar Pesquisa Completa
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow label="Tema" value={pesquisa.tema || 'Não informado'} />
              <InfoRow label="Fonte" value={pesquisa.fonte || 'Não informada'} />
              <InfoRow 
                label="Data" 
                value={pesquisa.data || 'Não informada'} 
                icon={<Calendar className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Gestão */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Gestão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow 
                label="Data Início" 
                value={pesquisa.data_inicio ? new Date(pesquisa.data_inicio).toLocaleDateString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Última Atualização" 
                value={pesquisa.ultima_atualizacao ? new Date(pesquisa.ultima_atualizacao).toLocaleString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Responsável" 
                value={pesquisa.responsavel || 'Não atribuído'} 
                icon={<User className="h-4 w-4" />}
              />
              <InfoRow 
                label="Cliente" 
                value={pesquisa.cliente || 'Não definido'} 
                icon={<Building2 className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Observações */}
          {pesquisa.observacao && (
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{pesquisa.observacao}</p>
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
          
          {pesquisa.link && (
            <a href={pesquisa.link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <ExternalLink className="h-5 w-5" />
                Acessar Pesquisa
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
