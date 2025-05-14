import React from 'react';
import { Logo } from './Logo';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-gray-400 text-sm">
              Transformando dados em insights para decisões estratégicas.
            </p>
            <div className="mt-6">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-brand-secondary mr-2" />
                <p className="text-gray-400 text-sm">bi@controlf5.com.br</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Home
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Projetos
                </a>
              </li>
              <li>
                <a href="#reports" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Relatórios
                </a>
              </li>
              <li>
                <a href="#insights" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Insights
                </a>
              </li>
              <li>
                <a href="#feedback" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Tutoriais
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition duration-150">
                  Suporte
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Inscreva-se para receber novidades sobre BI e análise de dados.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-secondary"
              />
              <button
                type="submit"
                className="bg-brand-secondary text-text-primary px-4 py-2 rounded-r-md hover:bg-yellow-400 transition duration-150"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} ControlF5. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-300 transition duration-150">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-300 transition duration-150">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-300 transition duration-150">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;