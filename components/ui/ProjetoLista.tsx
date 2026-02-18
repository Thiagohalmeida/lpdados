// components/ui/ProjetoLista.tsx
import { ExternalLink, Download, Calendar, Info } from "lucide-react";
import Link from "next/link";

interface ProjetoListaProps {
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
  "Entregue": "bg-green-100 text-green-800 border-green-200",
  "Em Desenvolvimento": "bg-blue-100 text-blue-800 border-blue-200",
  "Standby": "bg-gray-100 text-gray-800 border-gray-200",
};

export default function ProjetoLista({ 
  id,
  nome, 
  descricao, 
  status, 
  data, 
  link, 
  docs, 
  tecnologias = [], 
  area 
}: ProjetoListaProps) {
  // Gerar ID baseado no nome se não tiver ID
  const projetoId = id || nome.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{nome}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
            {status}
          </span>
          {area && (
            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
              {area}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{descricao}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {data && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {data}
            </span>
          )}
          {tecnologias.map((tec, i) => (
            <span key={i} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {tec}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {/* Botão Detalhes */}
        <Link
          href={`/projetos/${projetoId}`}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition text-sm"
        >
          <Info className="h-4 w-4" /> Detalhes
        </Link>
        
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition text-sm"
          >
            <ExternalLink className="h-4 w-4" /> Acessar
          </a>
        )}
        {docs && (
          <a
            href={docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition text-sm"
          >
            <Download className="h-4 w-4" /> Docs
          </a>
        )}
      </div>
    </div>
  );
}
