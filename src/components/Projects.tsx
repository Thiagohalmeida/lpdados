import React from 'react';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    title: "Dashboard Comercial",
    description: "Acompanhamento em tempo real de todos os indicadores da equipe comercial, com projeções e metas.",
    link: "#",
    tags: ["PowerBI", "Vendas", "KPIs"]
  },
  {
    title: "Análise de Mercado",
    description: "Comparativo entre concorrentes do setor, com análises de share de mercado e tendências.",
    link: "#",
    tags: ["Tableau", "Concorrentes", "Market Share"]
  },
  {
    title: "BI Operacional",
    description: "Monitoramento de KPIs operacionais, com alertas e notificações automáticas.",
    link: "#",
    tags: ["Looker", "Operações", "Monitoramento"]
  },
  {
    title: "Previsões Financeiras",
    description: "Modelos preditivos para análise de cenários financeiros e apoio à tomada de decisão.",
    link: "#",
    tags: ["Python", "Finanças", "Previsões"]
  }
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Projetos em Destaque</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Conheça nossos principais projetos de Business Intelligence desenvolvidos para impulsionar decisões baseadas em dados.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              link={project.link}
              tags={project.tags}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition duration-300"
          >
            Ver Todos os Projetos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;