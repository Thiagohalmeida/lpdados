import { ExternalLink, Download, Info } from "lucide-react";
import Link from "next/link";

interface ProjetoCardProps {
  id?: string;
  nome: string;
  descricao: string;
  status: string;
  data?: string;
  link?: string;
  docs?: string;
  tecnologias?: string[];
  area?: string;
}

const STATUS_COLORS: Record<string, string> = {
  "Entregue": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Em Desenvolvimento": "bg-blue-100 text-blue-800 border-blue-200",
  "Standby": "bg-purple-100 text-purple-800 border-purple-200",
};

export default function ProjetoCard({ id, nome, descricao, status, data, link, docs, tecnologias = [], area }: ProjetoCardProps) {
  // Gerar ID baseado no nome se não tiver ID
  const projetoId = id || nome.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="rounded-2xl border bg-white shadow-md p-6 flex flex-col justify-between h-full transition-all hover:shadow-lg border-l-4 border-l-blue-400 hover:border-l-blue-500">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${STATUS_COLORS[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>{status}</span>
          {data && <span className="text-sm text-gray-500">{data}</span>}
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">{nome}</h2>
        {area && <span className="inline-block mb-2 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">{area}</span>}
        <p className="text-sm text-zinc-700 mb-4">{descricao}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tecnologias.map((tec, i) => (
            <span key={i} className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">{tec}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {/* Botão Detalhes */}
        <Link
          href={`/projetos/${projetoId}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition"
        >
          <Info className="h-4 w-4" /> Detalhes
        </Link>
        
        <div className="flex gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition"
            >
              <ExternalLink className="h-4 w-4" /> Acessar
            </a>
          )}
          {docs && (
            <a
              href={docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 transition"
            >
              <Download className="h-4 w-4" /> Docs
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 