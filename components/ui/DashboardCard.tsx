// components/ui/DashboardCard.tsx
import { ExternalLink } from "lucide-react";

interface DashboardCardProps {
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
  nome,
  descricao,
  link,
  area,
}: DashboardCardProps) {
  const borderColor = areaColors[area] || "border-l-blue-500";
  return (
    <div className={`rounded-2xl bg-white shadow-md border ${borderColor} border-l-4 p-6 flex flex-col justify-between h-full hover:shadow-lg`}>
      <span className="inline-block mb-3 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{area}</span>
      <div>
        <h2 className="text-lg font-bold text-zinc-900 mb-1">{nome}</h2>
        <p className="text-sm text-zinc-700 mb-4">{descricao}</p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-blue-700 transition ml-auto"
      >
        <ExternalLink size={16} />
      </a>
    </div>
  );
}
