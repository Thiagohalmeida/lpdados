import { ExternalLink, BarChart3, Database, FileText, TrendingUp, Info } from "lucide-react";
import Link from "next/link";

interface FerramentaCardProps {
  id?: string;
  nome: string;
  descricao: string;
  link: string;
  proxAtualizacao?: string;
}

// Defina cores e ícones por nome ou ordem
const CARD_STYLES: Record<string, { color: string; icon: React.ReactNode; button: string }> = {
  "Consulta Banco": {
    color: "border-l-4 border-l-blue-400",
    icon: <Database className="h-8 w-8 text-blue-500" />,
    button: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
  },
  "Insights Automáticos": {
    color: "border-l-4 border-l-purple-400",
    icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  },
  "Consulta Fornecedores": {
    color: "border-l-4 border-l-yellow-400",
    icon: <TrendingUp className="h-8 w-8 text-yellow-400" />,
    button: "bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600",
  },
  // Adicione mais conforme necessário
};

export default function FerramentaCard({ id, nome, descricao, link, proxAtualizacao }: FerramentaCardProps) {
  const style = CARD_STYLES[nome] || {
    color: "border-l-4 border-l-blue-400",
    icon: <FileText className="h-8 w-8 text-blue-600" />,
    button: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  };
  
  // Usar ID se disponível, fallback para nome normalizado
  const detailsId = id || nome.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md border p-6 gap-4 mb-4 ${style.color}`}>
      <div className="flex flex-col items-center justify-center mr-6">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-r from-blue-100 to-purple-100">
          {style.icon}
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-zinc-900 mb-1">{nome}</h2>
          {proxAtualizacao && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ml-2">
              Próxima Atualização: {proxAtualizacao}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-700 mb-4">{descricao}</p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/ferramentas/${detailsId}`}
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
          >
            <Info size={16} /> Ver Detalhes
          </Link>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-xl text-white ${style.button} transition`}
          >
            Acessar <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
