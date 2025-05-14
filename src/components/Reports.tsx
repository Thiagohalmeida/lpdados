import React from 'react';

const reportsData = [
  {
    title: "Dashboard de Vendas",
    description: "Análise completa do funil de vendas com conversões por etapa",
    embedUrl: "https://lookerstudio.google.com/embed/reporting/sample-report-1"
  },
  {
    title: "Análise de Performance",
    description: "Visualização de KPIs de performance por departamento",
    embedUrl: "https://lookerstudio.google.com/embed/reporting/sample-report-2"
  }
];

const Reports: React.FC = () => {
  return (
    <section id="reports" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Relatórios</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Dashboards e relatórios interativos com os principais indicadores de performance da companhia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reportsData.map((report, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">{report.title}</h3>
                <p className="text-text-secondary mb-4">{report.description}</p>
              </div>
              <div className="relative w-full aspect-[16/9] bg-gray-100">
                {/* For the demo, we'll show a placeholder instead of the actual embed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-text-secondary mb-4">Visualização do dashboard embedado</p>
                    <p className="text-sm text-gray-400">
                      {report.embedUrl}
                    </p>
                  </div>
                </div>
                {/* Uncomment to use real embeds 
                <iframe
                  src={report.embedUrl}
                  frameBorder="0"
                  style={{ width: '100%', height: '100%' }}
                  allowFullScreen
                ></iframe>
                */}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition duration-300"
          >
            Ver Todos os Relatórios
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reports;