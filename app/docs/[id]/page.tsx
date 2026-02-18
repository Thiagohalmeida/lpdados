import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, User, Building2, MessageSquare, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

async function getDoc(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/docs`, {
    cache: 'no-store',
  });
  
  if (!res.ok) return null;
  
  const docs = await res.json();
  
  // Função para normalizar string (remove acentos e converte para kebab-case)
  const normalizeForUrl = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^\w-]/g, ''); // Remove caracteres especiais exceto hífens
  };
  
  return docs.find((d: any) => {
    const normalizedNome = d.nome ? normalizeForUrl(d.nome) : '';
    const normalizedId = normalizeForUrl(id);
    return d.id === id || normalizedNome === normalizedId;
  });
}

export default async function DocDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getDoc(id);

  if (!doc) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Documentação</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{doc.nome}</span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <FileText className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{doc.nome}</h1>
              <p className="text-xl text-green-100">{doc.descricao}</p>
            </div>
          </div>
          {doc.area && (
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              📁 {doc.area}
            </div>
          )}
        </div>

        {/* Conteúdo em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Informações Básicas */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Informações da Documentação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <InfoRow label="Área" value={doc.area || 'Não informada'} icon={<Building2 className="h-4 w-4" />} />
              {doc.link && (
                <div className="pt-2">
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Acessar Documentação
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
                value={doc.data_inicio ? new Date(doc.data_inicio).toLocaleDateString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Última Atualização" 
                value={doc.ultima_atualizacao ? new Date(doc.ultima_atualizacao).toLocaleString('pt-BR') : 'Não definida'} 
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow 
                label="Responsável" 
                value={doc.responsavel || 'Não atribuído'} 
                icon={<User className="h-4 w-4" />}
              />
              <InfoRow 
                label="Cliente" 
                value={doc.cliente || 'Não definido'} 
                icon={<Building2 className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Observações */}
          {doc.observacao && (
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{doc.observacao}</p>
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
          
          {doc.link && (
            <a href={doc.link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <ExternalLink className="h-5 w-5" />
                Acessar Documentação
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
