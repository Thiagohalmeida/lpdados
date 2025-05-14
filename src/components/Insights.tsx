import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const insightsData = [
  {
    title: "Tendências de mercado para o próximo trimestre",
    date: "2025-03-18",
    readTime: "5 min",
    summary: "Uma análise detalhada das tendências e previsões de mercado para o próximo trimestre, baseada em dados internos e externos.",
    link: "#"
  },
  {
    title: "Como o uso de IA está transformando a análise de dados",
    date: "2025-03-12",
    readTime: "7 min",
    summary: "Descubra como a inteligência artificial está mudando a forma como analisamos grandes volumes de dados e extraímos insights valiosos.",
    link: "#"
  },
  {
    title: "Business Intelligence: implementação e melhores práticas",
    date: "2025-03-05",
    readTime: "10 min",
    summary: "Um guia completo sobre implementação de BI em organizações, destacando as melhores práticas e casos de sucesso internos.",
    link: "#"
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const Insights: React.FC = () => {
  return (
    <section id="insights" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Insights & Notícias</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Acompanhe as últimas novidades, análises e tendências do mercado de Business Intelligence.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {insightsData.map((insight, index) => (
            <div 
              key={index} 
              className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {insight.title}
                </h3>
                <div className="flex items-center text-text-secondary text-sm mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(insight.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {insight.readTime} de leitura
                  </div>
                </div>
                <p className="text-text-secondary mb-4">
                  {insight.summary}
                </p>
                <a 
                  href={insight.link} 
                  className="inline-block text-brand-primary hover:text-blue-700 font-medium"
                >
                  Leia mais →
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="#" 
            className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition duration-300"
          >
            Ver Todos os Insights
          </a>
        </div>
      </div>
    </section>
  );
};

export default Insights;