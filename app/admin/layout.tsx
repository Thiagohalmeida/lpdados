import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { LogoutButton } from '@/components/LogoutButton';
import { Button } from '@/components/ui/button';
import { authOptions, isAdminEmail } from '@/lib/auth-options';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  if (!isAdminEmail(email)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Acesso restrito</h1>
          <p className="text-sm text-gray-600 mb-4">
            Seu usuario esta autenticado, mas nao possui permissao para acessar o painel administrativo.
          </p>
          <Link href="/portal" className="text-blue-600 hover:underline text-sm font-medium">
            Voltar para o Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Painel Admin
          </h1>

          <div className="flex items-center gap-3">
            <Link href="/portal">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Portal
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
