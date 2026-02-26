import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, BookOpen, Home, FileJson } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';
import { authOptions, isAdminEmail } from '@/lib/auth-options';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const isAuthenticated = !!email && isAdminEmail(email);

  if (!isAuthenticated) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  const sections = [
    {
      title: 'Gerenciar Itens',
      description: 'Gerenciar projetos, dashboards, documentação e ferramentas',
      icon: FolderKanban,
      href: '/admin/projetos',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Pesquisas',
      description: 'Gerenciar pesquisas',
      icon: BookOpen,
      href: '/admin/pesquisas',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      title: 'Dicionario e Insights',
      description: 'Importar JSON, normalizar e publicar docs por dashboard',
      icon: FileJson,
      href: '/admin/dashboard-docs',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <>
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
            <div className="flex gap-4">
              <Link href="/portal" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <Home className="h-4 w-4" />
                Ver Site
              </Link>
            </div>
          </div>
          <LogoutButton />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie todo o conteúdo da plataforma de BI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 ${section.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
