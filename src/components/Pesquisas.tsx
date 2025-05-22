import { useEffect, useState } from "react";
import PesquisaCard from "./PesquisaCard";

type Pesquisa = {
  titulo: string;
  fonte: string;
  link: string;
  data: string;
  conteudo: string;
  tema: string;
};

export default function Pesquisas() {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://lpdados.onrender.com/pesquisas')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((item: any) => ({
          titulo: item.Titulo,
          fonte: item.Fonte,
          link: item.Link,
          data: item.Data,
          conteudo: item.Conteudo,
          tema: item.Tema
        }));

        setPesquisas(mapped);
      })
      .catch(err => console.error('Erro ao buscar pesquisas:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="pesquisas" className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Central de Pesquisas</h2>

        {isLoading ? (
          <p className="text-gray-500">Carregando pesquisas...</p>
        ) : (
          <div className="space-y-4">
            {pesquisas.map((p, idx) => (
              <PesquisaCard
                key={idx}
                titulo={p.titulo}
                fonte={p.fonte}
                link={p.link}
                data={p.data}
                conteudo={p.conteudo}
                tema={p.tema}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
