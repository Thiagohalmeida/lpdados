// components/ui/DashboardCard.tsx
import { ExternalLink, Info } from "lucide-react";
import Link from "next/link";

interface DashboardCardProps {
  id?: string;
  nome: string;
  descricao: string;
  link: string;
  area: string;
  corBorda?: string;
}

const areaColors: Record<string, string> = {
  "Tráfego": "border-l-blue-400",
  "Growth": "border-l-purple-400",
  "Planejamento": "border-l-pink-400",
  "RH": "border-l-blue-200",
  "Atendimento": "border-l-yellow-400",
  "Geral": "border-l-blue-400",
  "Financeiro": "border-l-purple-300"
};

export default function DashboardCard({
  id,
  nome,
  descricao,
  link,
  area,
}: DashboardCardProps) {
  const borderColor = areaColors[area] || "border-l-blue-500";
  
  // Usar ID se disponível, fallback para nome normalizado
  const detailsId = id || nome.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`rounded-2xl bg-white shadow-md border ${borderColor} border-l-4 p-6 flex flex-col justify-between h-full hover:shadow-lg`}>
      <span className="inline-block mb-3 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{area}</span>
      <div>
        <h2 className="text-lg font-bold text-zinc-900 mb-1">{nome}</h2>
        <p className="text-sm text-zinc-700 mb-4">{descricao}</p>
      </div>
      <div className="flex gap-2 justify-end">
        <Link
          href={`/dashboards/${detailsId}`}
          className="inline-flex items-center gap-2 px-3 py-2 font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
        >
          <Info size={16} />
          Detalhes
        </Link>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-blue-700 transition"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
