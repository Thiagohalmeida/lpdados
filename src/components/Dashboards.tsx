import { motion } from "framer-motion";

type DashboardItem = {
  titulo: string;
  linkFull: string;
  emoji?: string;
};

const dashboards: DashboardItem[] = [
  { titulo: "Dashboard Tráfego", linkFull: "https://...", emoji: "📊" },
  { titulo: "Dashboard Growth", linkFull: "https://...", emoji: "🚀" },
  { titulo: "Dashboard Pesquisa Kantar", linkFull: "https://...", emoji: "🔍" },
  { titulo: "Avaliação de Desempenho", linkFull: "https://...", emoji: "📈" },
];

export default function Dashboards() {
  return (
    <section id="dashboards" className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dashboards.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {item.titulo}
                </h3>
              </div>
              <a
                href={item.linkFull}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Acessar dashboard
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
