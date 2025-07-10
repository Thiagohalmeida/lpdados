// components/ui/ToolCard.tsx
import { ExternalLink } from "lucide-react";

interface ToolCardProps {
  nome: string;
  descricao: string;
  link: string;
  corBorda?: string;
}

export default function ToolCard({
  nome,
  descricao,
  link,
  corBorda = "border-l-blue-500"
}: ToolCardProps) {
  return (
    <div className={`rounded-2xl bg-white shadow-md border ${corBorda} border-l-4 p-6 flex flex-col justify-between h-full transition-all hover:shadow-lg`}>
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-2">{nome}</h2>
        <p className="text-sm text-zinc-700 mb-4">{descricao}</p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 mt-auto font-semibold rounded-xl bg-black text-white hover:bg-zinc-900 transition"
      >
        Acessar <ExternalLink size={16} />
      </a>
    </div>
  );
}
