import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Future implementation: API call to search
  };

  const handleLogin = () => {
    console.log('Login clicked');
    // Future implementation: Redirect to /login
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-text-primary hover:text-brand-primary font-medium transition duration-150">
              Home
            </a>
            <a href="#projects" className="text-text-primary hover:text-brand-primary font-medium transition duration-150">
              Projetos
            </a>
            <a href="#reports" className="text-text-primary hover:text-brand-primary font-medium transition duration-150">
              Relatórios
            </a>
            <a href="#insights" className="text-text-primary hover:text-brand-primary font-medium transition duration-150">
              Insights
            </a>
            <a href="#feedback" className="text-text-primary hover:text-brand-primary font-medium transition duration-150">
              Feedback
            </a>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-grow max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Login Button - Desktop */}
          <div className="hidden lg:block">
            <button
              onClick={handleLogin}
              className="bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-150"
            >
              Entrar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-text-primary hover:text-brand-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            </form>

            {/* Navigation Links - Mobile */}
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-text-primary hover:text-brand-primary font-medium transition duration-150 py-2">
                Home
              </a>
              <a href="#projects" className="text-text-primary hover:text-brand-primary font-medium transition duration-150 py-2">
                Projetos
              </a>
              <a href="#reports" className="text-text-primary hover:text-brand-primary font-medium transition duration-150 py-2">
                Relatórios
              </a>
              <a href="#insights" className="text-text-primary hover:text-brand-primary font-medium transition duration-150 py-2">
                Insights
              </a>
              <a href="#feedback" className="text-text-primary hover:text-brand-primary font-medium transition duration-150 py-2">
                Feedback
              </a>
            </nav>

            {/* Login Button - Mobile */}
            <div className="mt-4">
              <button
                onClick={handleLogin}
                className="w-full bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-150"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;