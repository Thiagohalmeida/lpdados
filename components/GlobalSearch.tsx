'use client';

import { useState, useEffect } from 'react';
import { Search, X, FileText, BarChart3, BookOpen, Wrench, FolderKanban } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ResultadoBusca } from '@/types/bi-platform';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [loading, setLoading] = useState(false);

  // Atalho de teclado Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Buscar quando query muda
  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      return;
    }

    const buscar = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/busca?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResultados(data);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(buscar, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-purple-200 hover:bg-purple-50 bg-transparent text-blue-600"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Buscar
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buscar em todo o portal</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite para buscar projetos, dashboards, docs..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Buscando...
              </div>
            )}

            {!loading && query.length >= 2 && resultados.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum resultado encontrado para "{query}"
              </div>
            )}

            {!loading && resultados.length > 0 && (
              <div className="space-y-2">
                {resultados.map((resultado, i) => (
                  <ResultadoItem
                    key={i}
                    resultado={resultado}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResultadoItem({ 
  resultado, 
  onClick 
}: { 
  resultado: ResultadoBusca; 
  onClick: () => void;
}) {
  const { tipo, item } = resultado;
  
  const getTipoConfig = () => {
    const configs = {
      projeto: { label: 'Projeto', icon: FolderKanban, color: 'text-blue-600' },
      dashboard: { label: 'Dashboard', icon: BarChart3, color: 'text-purple-600' },
      doc: { label: 'Documentação', icon: FileText, color: 'text-green-600' },
      ferramenta: { label: 'Ferramenta', icon: Wrench, color: 'text-orange-600' },
      pesquisa: { label: 'Pesquisa', icon: BookOpen, color: 'text-pink-600' },
    };
    return configs[tipo];
  };

  const config = getTipoConfig();
  const Icon = config.icon;

  const getLink = () => {
    if ('link' in item && item.link) return item.link;
    return '#';
  };

  const getNome = () => {
    if ('nome' in item) return item.nome;
    if ('titulo' in item) return item.titulo;
    return 'Sem título';
  };

  const getDescricao = () => {
    if ('descricao' in item) return item.descricao;
    if ('conteudo' in item) return item.conteudo.substring(0, 150);
    return '';
  };

  return (
    <a
      href={getLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border p-3 hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {config.label}
            </span>
            {'area' in item && item.area && (
              <span className="text-xs text-muted-foreground">
                • {item.area}
              </span>
            )}
            {'tema' in item && item.tema && (
              <span className="text-xs text-muted-foreground">
                • {item.tema}
              </span>
            )}
          </div>
          <h4 className="font-medium truncate">{getNome()}</h4>
          {getDescricao() && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {getDescricao()}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
