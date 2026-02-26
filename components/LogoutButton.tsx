'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
