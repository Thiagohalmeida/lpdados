# Guia Técnico de Implementação Incremental para o Portal de BI

**Autor:** Manus AI
**Data:** 03 de fevereiro de 2026

## 1. Introdução

Este documento serve como um guia técnico detalhado para a implementação incremental das melhorias propostas no portal de Business Intelligence (BI) `lpdados2.vercel.app`. O objetivo é fornecer instruções claras e exemplos de código para facilitar o desenvolvimento, garantindo que as alterações sejam feitas de forma modular e sem quebrar as funcionalidades existentes. Abordaremos as modificações necessárias nos arquivos atuais e a criação de novos componentes, focando na evolução do portal para um hub de cultura de dados.

## 2. Fase 1: Refatoração da Estrutura de Dados e API (Conceitual e Impacto no Frontend)

Conforme a análise anterior, a unificação e o enriquecimento da fonte de dados são cruciais. Embora a implementação da nova API e do banco de dados seja uma tarefa de backend, é fundamental entender como essa mudança impactará o frontend.

### 2.1. Modelo de Dados Unificado (Exemplo Conceitual)

Em vez de ter tipos `Projeto`, `DashboardItem`, `Doc` e `Pesquisa` separados, podemos pensar em um modelo mais genérico, ou pelo menos em modelos mais ricos para cada entidade. Por exemplo, para `Projeto`:

```typescript
// src/types/global.d.ts (novo arquivo para tipos globais)

export type Projeto = {
  id: string; // Novo campo para identificação única
  nome: string;
  resumo: string;
  descricaoDetalhada: string; // Novo campo
  status: 'Entregue' | 'Em desenvolvimento' | 'Standby';
  proximaAtualizacao: string;
  linkAcesso: string; // Renomeado para clareza
  area: string;
  ultimaEntrega: string;
  objetivo: string; // Novo campo
  tecnologias: string[]; // Novo campo (array de strings)
  equipeResponsavel: string[]; // Novo campo (array de strings)
  impactoResultados: string; // Novo campo
  dataInicio: string; // Novo campo
  dataConclusao: string; // Novo campo
  tags: string[]; // Novo campo
};

// Tipos similares seriam criados para Dashboards, Documentações, Ferramentas e Pesquisas
// Exemplo para Dashboard:
export type Dashboard = {
  id: string;
  titulo: string;
  linkAcesso: string;
  emoji?: string;
  objetivo: string; // Novo campo
  metricasPrincipais: string[]; // Novo campo
  publicoAlvo: string; // Novo campo
  fontesDeDados: string[]; // Novo campo
  frequenciaAtualizacao: string; // Novo campo
  contatoResponsavel: string; // Novo campo
  tags: string[]; // Novo campo
  // ... outros campos
};
```

### 2.2. Impacto nas Chamadas de API Existentes

Atualmente, `Projects.tsx` usa Sheetbest e `Docs.tsx`/`Pesquisas.tsx` usam uma API customizada. Com uma nova API unificada, todas as chamadas `fetch` precisarão ser atualizadas para apontar para os novos endpoints e processar a nova estrutura de dados.

## 3. Fase 2: Melhorias no Frontend (Funcionalidades)

### 3.1. Componente `Projects.tsx`

Este componente é responsável por listar os projetos. As principais alterações serão na forma como os dados são buscados e exibidos.

#### 3.1.1. Alterações na Chamada da API

Atualmente, a chamada é:

```typescript
// src/components/Projects.tsx (trecho atual)

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/7f50c243-705f-4d02-84aa-ab6a09ad17f0")
      .then((res) => res.json())
      .then((data) => {
        const projetosValidados = data.filter((p: Projeto) => p.nome && p.status);
        setProjetos(projetosValidados);
      });
  }, []);
```

**Sugestão de Alteração:** Substituir a URL do Sheetbest pela URL da nova API unificada. O `filter` pode ser removido se a nova API garantir dados válidos.

```typescript
// src/components/Projects.tsx (trecho sugerido)

import { Projeto } from '../types/global'; // Importar o novo tipo

  useEffect(() => {
    // Supondo que a nova API tenha um endpoint /api/projetos
    fetch("https://sua-nova-api.com/api/projetos") 
      .then((res) => res.json())
      .then((data: Projeto[]) => {
        setProjetos(data); // A nova API já deve retornar dados validados
      })
      .catch(error => console.error("Erro ao buscar projetos:", error));
  }, []);
```

#### 3.1.2. Exibição de Novos Campos no `ProjectCard.tsx`

O componente `ProjectCard.tsx` precisará ser atualizado para receber e exibir os novos campos do tipo `Projeto`.

**Arquivo:** `src/components/ProjectCard.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/ProjectCard.tsx (trecho sugerido)

import { Projeto } from '../types/global'; // Importar o novo tipo

// Atualizar a interface Props para incluir os novos campos
interface ProjectCardProps extends Projeto {}

export default function ProjectCard({ nome, resumo, status, proximaAtualizacao, linkAcesso, area, ultimaEntrega, tags }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{nome}</h3>
        <p className="text-sm text-gray-600 mb-4">{resumo}</p>
        {/* Novos campos podem ser adicionados aqui */}
        {tags && tags.length > 0 && (
          <div className="mb-2">
            {tags.map(tag => (
              <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500">Status: {status}</p>
        {proximaAtualizacao && <p className="text-xs text-gray-500">Próxima Atualização: {proximaAtualizacao}</p>}
        {ultimaEntrega && <p className="text-xs text-gray-500">Última Entrega: {ultimaEntrega}</p>}
      </div>
      {linkAcesso && (
        <a
          href={linkAcesso}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition mt-4"
        >
          Visualizar
        </a>
      )}
    </div>
  );
}
```

#### 3.1.3. Implementação de Busca e Filtro (Exemplo Básico)

Para adicionar busca e filtro, você precisará de estados para o termo de busca e os filtros selecionados, e uma lógica para filtrar os `projetos` exibidos.

**Arquivo:** `src/components/Projects.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Projects.tsx (trecho sugerido)

import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Projeto } from '../types/global'; // Importar o novo tipo

export default function Projects() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterArea, setFilterArea] = useState<string>('Todas');

  useEffect(() => {
    fetch("https://sua-nova-api.com/api/projetos")
      .then((res) => res.json())
      .then((data: Projeto[]) => {
        setProjetos(data);
      })
      .catch(error => console.error("Erro ao buscar projetos:", error));
  }, []);

  const areasUnicas = Array.from(new Set(projetos.map(p => p.area))).sort();

  const projetosFiltrados = projetos.filter(projeto => {
    const matchesSearch = projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          projeto.resumo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'Todas' || projeto.area === filterArea;
    return matchesSearch && matchesArea;
  });

  const statusAgrupado = {
    "Entregue": projetosFiltrados.filter((p) => p.status?.toLowerCase() === "entregue"),
    "Em desenvolvimento": projetosFiltrados.filter((p) => p.status?.toLowerCase() === "em desenvolvimento"),
    "Standby": projetosFiltrados.filter((p) => p.status?.toLowerCase() === "standby"),
  };

  return (
    <section id="projects" className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Projetos da Área de BI
        </h2>

        {/* Componentes de Busca e Filtro */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar projetos..."
            className="p-2 border border-gray-300 rounded-md flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
          >
            <option value="Todas">Todas as Áreas</option>
            {areasUnicas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

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
```

### 3.2. Componente `Dashboards.tsx`

Similar aos projetos, os dashboards precisarão de uma estrutura de dados mais rica e a chamada da API será atualizada.

**Arquivo:** `src/components/Dashboards.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Dashboards.tsx (trecho sugerido)

import { motion } from "framer-motion";
import { Dashboard } from '../types/global'; // Importar o novo tipo

// Remover o array 'dashboards' hardcoded
// const dashboards: DashboardItem[] = [
//   { titulo: "Dashboard Tráfego", linkFull: "https://...", emoji: "📊" },
//   // ...
// ];

export default function Dashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    // Supondo que a nova API tenha um endpoint /api/dashboards
    fetch("https://sua-nova-api.com/api/dashboards")
      .then((res) => res.json())
      .then((data: Dashboard[]) => {
        setDashboards(data);
      })
      .catch(error => console.error("Erro ao buscar dashboards:", error));
  }, []);

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
                <div className="text-4xl mb-4">{item.emoji || '📊'}</div> {/* Usar emoji padrão se não houver */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {item.titulo}
                </h3>
                {/* Exibir novos campos, como objetivo ou métricas principais */}
                {item.objetivo && <p className="text-sm text-gray-600 mb-2">Objetivo: {item.objetivo}</p>}
                {item.metricasPrincipais && item.metricasPrincipais.length > 0 && (
                  <p className="text-sm text-gray-600">Métricas: {item.metricasPrincipais.join(', ')}</p>
                )}
              </div>
              <a
                href={item.linkAcesso}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition mt-4"
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
```

### 3.3. Componentes `Docs.tsx` e `Pesquisas.tsx`

Esses componentes já buscam dados de uma API, então a alteração principal será na URL da API e no mapeamento dos dados para os novos tipos enriquecidos.

**Arquivo:** `src/components/Docs.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Docs.tsx (trecho sugerido)

import { useEffect, useState } from "react";
import DocsCard from "./DocsCard";
import { Documentacao } from '../types/global'; // Importar o novo tipo

export default function Docs() {
  const [docs, setDocs] = useState<Documentacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Supondo que a nova API tenha um endpoint /api/documentacoes
    fetch("https://sua-nova-api.com/api/documentacoes")
      .then((res) => res.json())
      .then((data: Documentacao[]) => {
        // O mapeamento pode ser mais simples se a API já retornar no formato correto
        setDocs(data);
      })
      .catch((err) => console.error("Erro ao buscar docs:", err))
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
                // Passar todos os campos do novo tipo
                Processo={d.titulo}
                Link={d.linkAcesso}
                Área={d.area}
                resumo={d.resumo} // Novo campo
                // ... outros campos
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

**Arquivo:** `src/components/Pesquisas.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Pesquisas.tsx (trecho sugerido)

import { useEffect, useState } from "react";
import PesquisaCard from "./PesquisaCard";
import { Pesquisa } from '../types/global'; // Importar o novo tipo

export default function Pesquisas() {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Supondo que a nova API tenha um endpoint /api/pesquisas
    fetch("https://sua-nova-api.com/api/pesquisas")
      .then(res => res.json())
      .then(data => {
        // O mapeamento pode ser removido se a API já retornar no formato correto
        setPesquisas(data);
      })
      .catch(err => console.error("Erro ao buscar pesquisas:", err))
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
                // Passar todos os campos do novo tipo
                titulo={p.titulo}
                fonte={p.fonte}
                link={p.linkAcesso}
                data={p.dataPublicacao} // Renomeado para clareza
                conteudo={p.resumo} // Novo campo
                tema={p.tema}
                // ... outros campos
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

### 3.4. Componente `Header.tsx` (Busca Global)

Para adicionar uma barra de busca global, você pode integrar um campo de input no cabeçalho que, ao ser preenchido, redireciona para uma página de resultados de busca ou filtra os resultados na página atual (se for uma SPA).

**Arquivo:** `src/components/Header.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Header.tsx (trecho sugerido)

import { useState } from "react";
import { Menu, X, Search } from "lucide-react"; // Importar o ícone de busca
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para a busca

  const menuItems = [
    { label: "Projetos", href: "#projects" },
    { label: "Docs", href: "#docs" },
    { label: "Dashboards", href: "#dashboards" },
    { label: "Pesquisas", href: "#pesquisas" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirecionar para uma página de resultados de busca ou disparar um evento global
      console.log("Realizando busca por:", searchQuery);
      // Exemplo: window.location.href = `/search?q=${searchQuery}`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-gray-700 hover:text-blue-600 transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Barra de Busca no Header */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Buscar em todo o portal..."
            className="p-2 pl-8 border border-gray-300 rounded-md text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} className="absolute left-2 text-gray-400" />
          <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Buscar
          </button>
        </form>

        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col p-4 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {/* Barra de Busca no menu mobile */}
              <form onSubmit={handleSearch} className="flex items-center relative mt-4">
                <input
                  type="text"
                  placeholder="Buscar em todo o portal..."
                  className="p-2 pl-8 border border-gray-300 rounded-md flex-grow text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="absolute left-2 text-gray-400" />
                <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Buscar
                </button>
              </form>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

### 3.5. Criação de Páginas de Detalhes (Exemplo para Projeto)

Para exibir as informações enriquecidas de cada item, é fundamental criar páginas de detalhes. Isso geralmente envolve configurar rotas no seu aplicativo (se você estiver usando React Router, por exemplo).

**Novo Arquivo:** `src/pages/ProjectDetailPage.tsx`

```typescript
// src/pages/ProjectDetailPage.tsx (novo arquivo)

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Se estiver usando React Router
import { Projeto } from '../types/global';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>(); // Obtém o ID do projeto da URL
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Supondo que a nova API tenha um endpoint /api/projetos/:id
      fetch(`https://sua-nova-api.com/api/projetos/${id}`)
        .then(res => res.json())
        .then((data: Projeto) => {
          setProjeto(data);
        })
        .catch(error => console.error("Erro ao buscar detalhes do projeto:", error))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-12">Carregando detalhes do projeto...</div>;
  }

  if (!projeto) {
    return <div className="text-center py-12 text-red-500">Projeto não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{projeto.nome}</h1>
      <p className="text-xl text-gray-700 mb-6">{projeto.resumo}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Detalhes</h2>
          <p><strong>Status:</strong> {projeto.status}</p>
          <p><strong>Área:</strong> {projeto.area}</p>
          {projeto.dataInicio && <p><strong>Início:</strong> {projeto.dataInicio}</p>}
          {projeto.dataConclusao && <p><strong>Conclusão:</strong> {projeto.dataConclusao}</p>}
          {projeto.ultimaEntrega && <p><strong>Última Entrega:</strong> {projeto.ultimaEntrega}</p>}
          {projeto.proximaAtualizacao && <p><strong>Próxima Atualização:</strong> {projeto.proximaAtualizacao}</p>}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Informações Adicionais</h2>
          {projeto.objetivo && <p><strong>Objetivo:</strong> {projeto.objetivo}</p>}
          {projeto.tecnologias && projeto.tecnologias.length > 0 && (
            <p><strong>Tecnologias:</strong> {projeto.tecnologias.join(', ')}</p>
          )}
          {projeto.equipeResponsavel && projeto.equipeResponsavel.length > 0 && (
            <p><strong>Equipe:</strong> {projeto.equipeResponsavel.join(', ')}</p>
          )}
          {projeto.impactoResultados && <p><strong>Impacto/Resultados:</strong> {projeto.impactoResultados}</p>}
        </div>
      </div>

      {projeto.descricaoDetalhada && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Descrição Detalhada</h2>
          <p className="text-gray-600 leading-relaxed">{projeto.descricaoDetalhada}</p>
        </div>
      )}

      {projeto.tags && projeto.tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {projeto.tags.map(tag => (
              <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {projeto.linkAcesso && (
        <a
          href={projeto.linkAcesso}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          Acessar Projeto
        </a>
      )}
    </div>
  );
}
```

Para que esta página funcione, você precisará configurar as rotas no seu `App.tsx` (ou onde suas rotas são definidas). Por exemplo:

```typescript
// src/App.tsx (trecho sugerido com React Router)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Docs from './components/Docs';
import Dashboards from './components/Dashboards';
import Pesquisas from './components/Pesquisas';
import Insights from './components/Insights';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import ProjectDetailPage from './pages/ProjectDetailPage'; // Importar a nova página

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light scroll-smooth">
        <Header />
        <main className="pt-20 space-y-16">
          <Routes>
            <Route path="/" element={
              <>
                <section id="hero"><Hero /></section>
                <section id="projects"><Projects /></section>
                <section id="docs"><Docs /></section>
                <section id="dashboards"><Dashboards /></section>
                <section id="insights"><Insights /></section>
                <section id="pesquisas"><Pesquisas /></section>
                <section id="feedback"><Feedback /></section>
              </>
            } />
            <Route path="/projetos/:id" element={<ProjectDetailPage />} /> {/* Nova rota */}
            {/* Adicionar rotas para detalhes de Dashboards, Docs, etc. */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

E no `ProjectCard.tsx`, o link de 
acesso deve ser alterado para apontar para a nova página de detalhes:

```typescript
// src/components/ProjectCard.tsx (trecho sugerido para o link)

// ... dentro do componente ProjectCard

      {linkAcesso && (
        <a
          href={`/projetos/${id}`} // Alterar para a rota de detalhes
          // target="_blank" // Remover se a navegação for interna
          // rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition mt-4"
        >
          Visualizar Detalhes
        </a>
      )}
// ...
```

### 3.6. Componente `DocsCard.tsx` e `PesquisaCard.tsx`

Esses componentes seguirão a mesma lógica do `ProjectCard.tsx`, onde a interface de props será atualizada para incluir os novos campos do tipo `Documentacao` e `Pesquisa`, e a exibição será ajustada para mostrar as informações enriquecidas. O link de acesso também deve ser alterado para apontar para uma página de detalhes específica para cada tipo de conteúdo.

#### 3.6.1. `DocsCard.tsx`

**Arquivo:** `src/components/DocsCard.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/DocsCard.tsx (trecho sugerido)

import { Documentacao } from "../types/global"; // Importar o novo tipo

// Atualizar a interface Props para incluir os novos campos
interface DocsCardProps extends Documentacao {}

export default function DocsCard({ id, titulo, area, resumo, linkAcesso }: DocsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="text-sm font-medium text-blue-600 mb-2">{area}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
        {resumo && <p className="text-sm text-gray-600 mb-4">{resumo}</p>}
      </div>
      {linkAcesso && (
        <a
          href={`/documentacao/${id}`} // Alterar para a rota de detalhes
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          Acessar Documento
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-6 6"></path></svg>
        </a>
      )}
    </div>
  );
}
```

#### 3.6.2. `PesquisaCard.tsx`

**Arquivo:** `src/components/PesquisaCard.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/PesquisaCard.tsx (trecho sugerido)

import { Pesquisa } from "../types/global"; // Importar o novo tipo

// Atualizar a interface Props para incluir os novos campos
interface PesquisaCardProps extends Pesquisa {}

export default function PesquisaCard({ id, titulo, fonte, dataPublicacao, resumo, tema, linkAcesso }: PesquisaCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="text-sm font-medium text-purple-600 mb-2">{tema}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
        <p className="text-sm text-gray-600 mb-2">Fonte: {fonte}</p>
        {dataPublicacao && <p className="text-xs text-gray-500 mb-4">Publicado em: {new Date(dataPublicacao).toLocaleDateString()}</p>}
        {resumo && <p className="text-sm text-gray-600 mb-4">{resumo}</p>}
      </div>
      {linkAcesso && (
        <a
          href={`/pesquisas/${id}`} // Alterar para a rota de detalhes
          className="inline-flex items-center text-purple-600 hover:text-purple-800 transition"
        >
          Acessar Pesquisa
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-6 6"></path></svg>
        </a>
      )}
    </div>
  );
}
```

### 3.7. Seção de Insights (`Insights.tsx`)

Atualmente, o componente `Insights.tsx` está presente no código, mas não é visível no site. Para ativá-lo e implementar a funcionalidade de 
insights gerados por IA, você precisará:

**Arquivo:** `src/components/Insights.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Insights.tsx (trecho sugerido)

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Insight = {
  id: string;
  titulo: string;
  conteudo: string;
  dataGeracao: string;
  fonteDados: string[];
};

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Supondo que a nova API tenha um endpoint /api/insights
    // Esta API pode chamar um LLM internamente para gerar os insights
    fetch("https://sua-nova-api.com/api/insights")
      .then(res => res.json())
      .then((data: Insight[]) => {
        setInsights(data);
      })
      .catch(err => console.error("Erro ao buscar insights:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="insights" className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Insights Inteligentes</h2>
        <p className="text-lg text-gray-600 mb-8">Geração automática de insights usando IA baseada nos dados e período selecionados.</p>

        {isLoading ? (
          <p className="text-gray-500">Carregando insights...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-100 border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{insight.titulo}</h3>
                <p className="text-gray-700 mb-4">{insight.conteudo}</p>
                <p className="text-sm text-gray-500">Gerado em: {new Date(insight.dataGeracao).toLocaleDateString()}</p>
                {insight.fonteDados && insight.fonteDados.length > 0 && (
                  <p className="text-sm text-gray-500">Fontes: {insight.fonteDados.join(", ")}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

Para que esta seção seja visível, certifique-se de que ela está incluída no `App.tsx` e que não há estilos ocultando-a.

### 3.8. Seção de Feedback (`Feedback.tsx`)

A seção de feedback pode ser aprimorada para ser mais interativa e talvez enviar os dados para um endpoint específico da sua nova API.

**Arquivo:** `src/components/Feedback.tsx`

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/Feedback.tsx (trecho sugerido)

import { useState } from "react";

export default function Feedback() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("https://sua-nova-api.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, mensagem }),
      });

      if (response.ok) {
        setStatus("success");
        setNome("");
        setEmail("");
        setMensagem("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      setStatus("error");
    }
  };

  return (
    <section id="feedback" className="bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Deixe seu Feedback</h2>
        <p className="text-lg text-gray-600 mb-8 text-center">Sua opinião é muito importante para nós! Ajude-nos a melhorar o portal.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
            <input
              type="text"
              id="nome"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="mensagem" className="block text-gray-700 text-sm font-bold mb-2">Mensagem:</label>
            <textarea
              id="mensagem"
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Enviando..." : "Enviar Feedback"}
            </button>
            {status === "success" && <p className="text-green-500 text-sm">Feedback enviado com sucesso!</p>}
            {status === "error" && <p className="text-red-500 text-sm">Erro ao enviar feedback. Tente novamente.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
```

## 4. Fase 3: Melhorias no Frontend (Layout e UX) e Novas Seções

Esta fase envolve principalmente ajustes visuais e de experiência do usuário, que podem ser aplicados de forma iterativa após as funcionalidades básicas estarem no lugar.

### 4.1. Refinamento do Design System (`tailwind.config.js`)

Para alinhar o design com a identidade visual da empresa, você pode expandir as definições de cores, fontes e outros utilitários no seu arquivo `tailwind.config.js`.

**Arquivo:** `tailwind.config.js`

**Exemplo de Expansão:**

```javascript
// tailwind.config.js (trecho sugerido)

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores da marca da empresa
        "primary-brand": "#0055A4", // Exemplo de cor primária
        "secondary-brand": "#FFDD00", // Exemplo de cor secundária
        "accent-brand": "#00A651", // Exemplo de cor de destaque
        
        // Cores neutras aprimoradas
        "gray-100": "#F7FAFC",
        "gray-200": "#EDF2F7",
        "gray-300": "#E2E8F0",
        "gray-400": "#CBD5E0",
        "gray-500": "#A0AEC0",
        "gray-600": "#718096",
        "gray-700": "#4A5568",
        "gray-800": "#2D3748",
        "gray-900": "#1A202C",

        // Cores de status
        "status-success": "#38A169",
        "status-warning": "#DD6B20",
        "status-danger": "#E53E3E",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // Manter ou ajustar
        heading: ["Open Sans", "system-ui", "sans-serif"], // Manter ou ajustar
        // Adicionar outras fontes se necessário
      },
      // Outras extensões de tema, como espaçamento, tamanhos de fonte, etc.
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
```

### 4.2. Aprimoramento da Navegação (Breadcrumbs)

Para adicionar breadcrumbs, você precisará de um componente que receba a rota atual e gere os links de navegação. Isso geralmente é feito em conjunto com a configuração de rotas.

**Novo Componente:** `src/components/Breadcrumbs.tsx`

```typescript
// src/components/Breadcrumbs.tsx (novo arquivo)

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Lógica para construir os breadcrumbs com base na rota
  pathnames.forEach((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    // Você pode adicionar lógica para mapear IDs para nomes aqui, se necessário
    // Ex: if (value === 'projetos' && pathnames[index + 1]) { label = getProjectName(pathnames[index + 1]); }
    breadcrumbs.push({ label: value.charAt(0).toUpperCase() + value.slice(1), path: to });
  });

  return (
    <nav className="flex py-4 px-6 bg-gray-100 text-gray-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-medium text-gray-500">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

Para usar este componente, você o adicionaria ao seu `App.tsx` ou em layouts de página específicos, por exemplo, logo abaixo do `Header` e acima do `main`.

```typescript
// src/App.tsx (trecho sugerido com Breadcrumbs)

// ... imports existentes
import Breadcrumbs from './components/Breadcrumbs'; // Importar o novo componente

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light scroll-smooth">
        <Header />
        <Breadcrumbs /> {/* Adicionar Breadcrumbs aqui */}
        <main className="pt-20 space-y-16">
          <Routes>
            {/* ... suas rotas */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

### 4.3. Visualização de Status de Projetos (Exemplo de Barra de Progresso)

Para projetos com status "Em desenvolvimento", você pode adicionar uma barra de progresso visual no `ProjectCard.tsx` ou na `ProjectDetailPage.tsx`.

**Arquivo:** `src/components/ProjectCard.tsx` (ou `ProjectDetailPage.tsx`)

**Alteração Sugerida (Exemplo):**

```typescript
// src/components/ProjectCard.tsx (trecho sugerido para barra de progresso)

// ... dentro do componente ProjectCard

      <div>
        {/* ... outros campos */}
        <p className="text-xs text-gray-500">Status: {status}</p>
        {status === "Em desenvolvimento" && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "50%" }}></div> {/* Exemplo: 50% de progresso */}
          </div>
        )}
        {/* ... */}
      </div>
// ...
```

O valor do `width` da barra de progresso precisaria ser dinâmico, talvez vindo de um novo campo `progresso` no tipo `Projeto`.

## 5. Considerações Finais para Implementação

*   **Testes:** Após cada alteração, realize testes rigorosos para garantir que as funcionalidades existentes não foram quebradas e que as novas estão funcionando conforme o esperado.
*   **Controle de Versão:** Utilize um sistema de controle de versão (Git) e faça commits pequenos e atômicos para cada funcionalidade ou correção. Isso facilita o rastreamento de mudanças e a reversão, se necessário.
*   **Documentação Interna:** Mantenha a documentação do código atualizada, especialmente para os novos tipos e componentes.
*   **Feedback Contínuo:** Colete feedback dos usuários internos durante o processo de desenvolvimento para garantir que as melhorias atendam às suas necessidades.
*   **Performance:** Monitore a performance do site, especialmente após a integração da nova API e o enriquecimento dos dados. Otimize o carregamento de dados e a renderização, se necessário.

Este guia fornece um ponto de partida sólido para a implementação incremental das melhorias. Lembre-se de que a flexibilidade é fundamental, e você pode adaptar essas sugestões com base nas especificidades do seu ambiente e nas ferramentas que sua equipe já utiliza. A chave é evoluir o portal de forma contínua, sempre com o objetivo de democratizar o acesso aos dados e fortalecer a cultura de dados na empresa.
