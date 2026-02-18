import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin com botão Voltar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Painel Admin
          </h1>
          
          <div className="flex items-center gap-3">
            <Link href="/">
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
