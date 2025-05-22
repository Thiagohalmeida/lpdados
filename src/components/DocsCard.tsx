import { motion } from "framer-motion";

type DocsCardProps = {
  Processo: string;
  Link: string;
  Área: string;
};

export default function DocsCard({ Processo, Link, Área }: DocsCardProps) {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{Processo}</h3>
      <p className="text-xs text-gray-500 mb-4">Área: {Área}</p>
      <a
        href={Link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        Acessar documento
      </a>
    </motion.div>
  );
}
