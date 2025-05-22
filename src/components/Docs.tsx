import { useEffect, useState } from "react";
import DocsCard from "./DocsCard";

type Doc = {
  Processo: string;
  Link: string;
  Área: string;
};

export default function Docs() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://lpdados.onrender.com/docs')
      .then((res) => res.json())
      .then((data) => {
        console.log('Dados recebidos:', data);  // ✅ Adicione esse log!
        setDocs(data);
      })
      .catch((err) => console.error('Erro ao buscar docs:', err))
      .finally(() => setIsLoading(false));
  }, []);
  

  return (
    <section id="docs" className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Docs & Processos</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="animate-pulse bg-gray-200 h-40 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {docs.map((d, idx) => (
              <DocsCard
                key={idx}
                Processo={d.Processo}
                Link={d.Link}
                Área={d.Área}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
