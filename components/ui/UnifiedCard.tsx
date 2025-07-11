import { ArrowUpRight } from 'lucide-react';

interface UnifiedCardProps {
  titulo: string;
  descricao: string;
  area: string;
  link: string;
  badgeColor?: string;
}

export default function UnifiedCard({ titulo, descricao, area, link, badgeColor = "blue" }: UnifiedCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 flex flex-col justify-between h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${badgeColor}-100 text-${badgeColor}-800`}>
            {area}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{titulo}</h3>
        <p className="text-sm text-zinc-600">{descricao}</p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        Acessar <ArrowUpRight size={16} />
      </a>
    </div>
  );
} 