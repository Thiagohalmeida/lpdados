import { ArrowUpRight, Info } from 'lucide-react';
import Link from 'next/link';

interface DocCardProps {
  id?: string;
  processo: string;
  area: string;
  link: string;
}

export const DocCard: React.FC<DocCardProps> = ({ id, processo, area, link }) => {
  // Usar ID se disponível, fallback para processo normalizado
  const detailsId = id || processo.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-sm text-blue-700 font-medium uppercase tracking-wide mb-1">
          {area}
        </h3>
        <p className="text-lg font-semibold text-blue-900">{processo}</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Link
          href={`/docs/${detailsId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <Info size={16} /> Ver Detalhes
        </Link>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          Acessar conteúdo <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
};
