import { motion } from "framer-motion";

type ProjetoProps = {
  nome: string;
  resumo: string;
  status: string;
  proximaAtualizacao: string;
  link?: string;
  area?: string;
  ultimaEntrega?: string;
};

const statusClasses: Record<string, string> = {
  "Entregue": "bg-green-100 text-green-800",
  "Em desenvolvimento": "bg-yellow-100 text-yellow-800",
  "Standby": "bg-red-100 text-red-700",
};

export default function ProjectCard({
  nome,
  resumo,
  status,
  proximaAtualizacao,
  link,
  area,
  ultimaEntrega,
}: ProjetoProps) {
  const statusStyle = statusClasses[status] || "bg-gray-100 text-gray-800";

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-gray-900">{nome}</h3>
        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusStyle}`}>
          {status}
        </span>
      </div>

      {(area || ultimaEntrega) && (
        <p className="text-[10px] text-gray-500 italic mt-1">
          {area && <span>{area}</span>}
          {area && ultimaEntrega && " • "}
          {ultimaEntrega && <span>Última entrega: {ultimaEntrega}</span>}
        </p>
      )}

      {resumo && (
        <p className="text-xs text-gray-700 mt-2 mb-2 line-clamp-5">{resumo}</p>
      )}

      {proximaAtualizacao && (
        <p className="text-[10px] text-gray-600 mt-1 mb-2">
          <strong>Próxima atualização:</strong> {proximaAtualizacao}
        </p>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-auto bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-700 transition"
        >
          Ver mais
        </a>
      )}
    </motion.div>
  );
}
