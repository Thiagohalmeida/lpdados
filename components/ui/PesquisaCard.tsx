import { ArrowUpRight } from 'lucide-react';

interface PesquisaCardProps {
  titulo: string;
  resumo: string;
  tema: string;
  link: string;
}

export const PesquisaCard: React.FC<PesquisaCardProps> = ({
  titulo,
  resumo,
  tema,
  link,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 flex flex-col justify-between h-full">
      <div className="mb-4">
        <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium mb-2">
          {tema}
        </span>
        <h3 className="text-lg font-semibold text-blue-900 mb-1">{titulo}</h3>
        <p className="text-sm text-blue-700 line-clamp-3">{resumo}</p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        Acessar conteúdo <ArrowUpRight size={16} />
      </a>
    </div>
  );
};
