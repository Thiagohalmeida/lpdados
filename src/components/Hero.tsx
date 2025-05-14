import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-brand-primary to-blue-800 text-white pt-24 pb-12">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Portal BI ControlF5
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in-delay">
            Central de projetos e ferramentas de Business Intelligence
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-2">
            <a 
              href="/login" 
              className="bg-brand-secondary text-text-primary px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition duration-300 shadow-lg"
            >
              Acessar Portal
            </a>
            <a 
              href="#projects" 
              className="bg-white bg-opacity-20 text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-30 transition duration-300 backdrop-blur-sm"
            >
              Ver Projetos
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;