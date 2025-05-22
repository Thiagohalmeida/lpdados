import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

type Projeto = {
  nome: string;
  resumo: string;
  status: string;
  proximaAtualizacao: string;
  link?: string;
  area?: string;
  ultimaEntrega?: string;
};

export default function Projects() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/7f50c243-705f-4d02-84aa-ab6a09ad17f0")
      .then((res) => res.json())
      .then((data) => {
        const projetosValidados = data.filter((p: Projeto) => p.nome && p.status);
        setProjetos(projetosValidados);
      });
  }, []);

  const statusAgrupado = {
    "Entregue": projetos.filter((p) => p.status?.toLowerCase() === "entregue"),
    "Em desenvolvimento": projetos.filter((p) => p.status?.toLowerCase() === "em desenvolvimento"),
    "Standby": projetos.filter((p) => p.status?.toLowerCase() === "standby"),
  };

  return (
    <section id="projects" className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Projetos da Área de BI
        </h2>

        <div className="space-y-12">
          {Object.entries(statusAgrupado).map(([status, lista]) => (
            <div key={status}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {status}
                  <span className="ml-2 text-sm text-gray-500">({lista.length})</span>
                </h3>
                <div className={`inline-block px-3 py-1 text-xs rounded-full ${
                  status === "Entregue"
                    ? "bg-green-100 text-green-800"
                    : status === "Em desenvolvimento"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {status}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {lista.map((p, i) => (
                  <ProjectCard key={i} {...p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
