import { ArrowUpRight } from 'lucide-react';

interface DocCardProps {
  processo: string;
  area: string;
  link: string;
}

export const DocCard: React.FC<DocCardProps> = ({ processo, area, link }) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-sm text-zinc-500 font-medium uppercase tracking-wide mb-1">
          {area}
        </h3>
        <p className="text-lg font-semibold text-zinc-900">{processo}</p>
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
