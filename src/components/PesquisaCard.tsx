import { motion } from "framer-motion";

type PesquisaCardProps = {
  titulo: string;
  fonte: string;
  link: string;
  data: string;
  conteudo: string;
  tema: string;
};

export default function PesquisaCard({ titulo, fonte, link, data, conteudo, tema }: PesquisaCardProps) {
  return (
    <motion.div
      className="border-l-4 border-blue-600 bg-white shadow-sm p-5 rounded-md hover:shadow-md transition space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
      <p className="text-sm text-gray-500">{conteudo}</p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        <span className="bg-gray-100 px-2 py-1 rounded">Fonte: {fonte}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">Tema: {tema}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">Data: {data}</span>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Acessar conteúdo
      </a>
    </motion.div>
  );
}
