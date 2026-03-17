# 📋 Plano de Melhorias V2 - Plataforma BI

**Data:** 06 de Fevereiro de 2026  
**Objetivo:** Aperfeiçoar cultura de dados com gestão completa e visualização de arquitetura

---

## 🎯 RESUMO DAS MELHORIAS SOLICITADAS

### 1. **Navegação Admin ↔ Principal**
- ✅ Botão "Admin" no header da página principal
- ✅ Atalho de teclado (Ctrl+Shift+A)
- ✅ Botão "Voltar" no painel admin

### 2. **Novos Campos para Gestão**
Adicionar em TODOS os itens (Projetos, Dashboards, Docs, Ferramentas, Pesquisas):
- ✅ `data_inicio` - Data de início
- ✅ `ultima_atualizacao` - Última atualização
- ✅ `responsavel` - Listbox: Thiago ou Leandro
- ✅ `cliente` - Listbox: Interno ou Externo
- ✅ `observacao` - Campo de texto livre

### 3. **Página de Detalhes**
- ✅ Botão "Detalhes" em cada card
- ✅ Modal ou página mostrando TODOS os campos
- ✅ Campos atuais + novos campos de gestão

### 4. **Filtro Automático**
- ✅ Aba "Projetos" abrir filtrada por "Em Desenvolvimento"

### 5. **Visualização de Arquitetura**
- ✅ Nova aba "Arquitetura"
- ✅ Diagrama mostrando como projetos se conectam
- ✅ Mapa visual da infraestrutura de dados

---

## 📊 ESTRUTURA DE IMPLEMENTAÇÃO

### **FASE 1: Preparação do Banco de Dados** (30 min)
Adicionar novos campos nas tabelas do BigQuery

### **FASE 2: Navegação Admin** (20 min)
Botões e atalhos para ir/voltar do admin

### **FASE 3: Páginas de Detalhes** (1h)
Modal com todos os campos + novos campos

### **FASE 4: Filtro Automático** (10 min)
Projetos filtrados por "Em Desenvolvimento" por padrão

### **FASE 5: Visualização de Arquitetura** (1h)
Nova aba com diagrama interativo

---

## 🗂️ FASE 1: PREPARAÇÃO DO BANCO DE DADOS

### 1.1. Adicionar Novos Campos no BigQuery

```sql
-- Adicionar colunas nas tabelas originais

-- PROJETOS
ALTER TABLE `worlddata-439415.lpdados.projeto`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- DASHBOARDS
ALTER TABLE `worlddata-439415.lpdados.dashboard`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- DOCS
ALTER TABLE `worlddata-439415.lpdados.docs`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- FERRAMENTAS
ALTER TABLE `worlddata-439415.lpdados.ferramentas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- PESQUISAS
ALTER TABLE `worlddata-439415.lpdados.pesquisas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;
```

### 1.2. Atualizar Tipos TypeScript

```typescript
// types/bi-platform.ts

// Campos comuns de gestão
export interface CamposGestao {
  data_inicio?: string;
  ultima_atualizacao?: string;
  responsavel?: 'Thiago' | 'Leandro' | null;
  cliente?: 'Interno' | 'Externo' | null;
  observacao?: string;
}

// Atualizar interfaces existentes
export interface Projeto extends CamposGestao {
  id: string;
  nome: string;
  descricao: string;
  status: StatusProjeto;
  data: string;
  link?: string;
  docs?: string;
  area: string;
  tecnologias: string[];
  atualizado_em: string;
}

// Similar para Dashboard, Documentacao, Ferramenta, Pesquisa
```

---

## 🔗 FASE 2: NAVEGAÇÃO ADMIN ↔ PRINCIPAL

### 2.1. Botão Admin no Header Principal

```typescript
// app/page.tsx - Adicionar no header

<div className="flex items-center space-x-3">
  <GlobalSearch />
  
  {/* Novo botão Admin */}
  <Link href="/admin">
    <Button 
      variant="outline" 
      size="sm" 
      className="border-purple-200 hover:bg-purple-50"
    >
      <Settings className="h-4 w-4 mr-2" />
      Admin
    </Button>
  </Link>
</div>
```

### 2.2. Atalho de Teclado (Ctrl+Shift+A)

```typescript
// app/page.tsx - Adicionar useEffect

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      window.location.href = '/admin';
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);
```

### 2.3. Botão Voltar no Admin

```typescript
// app/admin/layout.tsx - Criar layout para admin

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Portal
            </Button>
          </Link>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
}
```

---

## 📄 FASE 3: PÁGINAS DE DETALHES

### 3.1. Estrutura de Rotas

```
app/
  projetos/
    [id]/
      page.tsx          # Página de detalhes do projeto
  dashboards/
    [id]/
      page.tsx          # Página de detalhes do dashboard
  docs/
    [id]/
      page.tsx          # Página de detalhes da doc
  ferramentas/
    [id]/
      page.tsx          # Página de detalhes da ferramenta
  pesquisas/
    [id]/
      page.tsx          # Página de detalhes da pesquisa
```

### 3.2. Exemplo: Página de Detalhes de Projeto

```typescript
// app/projetos/[id]/page.tsx

export default async function ProjetoDetalhes({ params }: { params: { id: string } }) {
  const projeto = await getProjeto(params.id);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          Portal
        </Link>
        {' > '}
        <span>Projetos</span>
        {' > '}
        <span className="font-semibold">{projeto.nome}</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">{projeto.nome}</h1>
        <p className="text-xl">{projeto.descricao}</p>
      </div>

      {/* Conteúdo em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Status" value={projeto.status} />
            <InfoRow label="Área" value={projeto.area} />
            <InfoRow label="Data" value={projeto.data} />
            {projeto.link && (
              <InfoRow 
                label="Link" 
                value={
                  <a href={projeto.link} target="_blank" className="text-blue-600 hover:underline">
                    Acessar Projeto
                  </a>
                } 
              />
            )}
          </CardContent>
        </Card>

        {/* Gestão (NOVOS CAMPOS) */}
        <Card>
          <CardHeader>
            <CardTitle>Gestão do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Data Início" value={projeto.data_inicio || 'Não definida'} />
            <InfoRow label="Última Atualização" value={projeto.ultima_atualizacao || 'Não definida'} />
            <InfoRow label="Responsável" value={projeto.responsavel || 'Não atribuído'} />
            <InfoRow label="Cliente" value={projeto.cliente || 'Não definido'} />
          </CardContent>
        </Card>

        {/* Tecnologias */}
        {projeto.tecnologias?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tecnologias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projeto.tecnologias.map((tec, i) => (
                  <Badge key={i} variant="secondary">{tec}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observações */}
        {projeto.observacao && (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{projeto.observacao}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ações */}
      <div className="mt-8 flex gap-4">
        {projeto.link && (
          <Button asChild size="lg">
            <a href={projeto.link} target="_blank">
              <ExternalLink className="mr-2 h-5 w-5" />
              Acessar Projeto
            </a>
          </Button>
        )}
        
        {projeto.docs && (
          <Button asChild variant="outline" size="lg">
            <a href={projeto.docs} target="_blank">
              <FileText className="mr-2 h-5 w-5" />
              Ver Documentação
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
```

### 3.3. Atualizar Cards para Linkar para Detalhes

```typescript
// components/ui/ProjetoCard.tsx

export default function ProjetoCard({ id, nome, ... }: ProjetoCardProps) {
  return (
    <div className="...">
      {/* Conteúdo do card */}
      
      <div className="flex gap-2 mt-2">
        {/* Botão Detalhes (NOVO) */}
        <Link href={`/projetos/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <Info className="h-4 w-4 mr-2" />
            Detalhes
          </Button>
        </Link>
        
        {/* Botão Visualizar (existente) */}
        {link && (
          <a href={link} target="_blank" className="flex-1">
            <Button className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
```

---

## 🔍 FASE 4: FILTRO AUTOMÁTICO

### 4.1. Projetos Filtrados por "Em Desenvolvimento"

```typescript
// app/page.tsx

export default function BIPortfolioPage() {
  // Estado inicial do filtro = "em desenvolvimento"
  const [statusFiltro, setStatusFiltro] = useState("em desenvolvimento");
  
  // Resto do código permanece igual
}
```

---

## 🏗️ FASE 5: VISUALIZAÇÃO DE ARQUITETURA

### 5.1. Nova Aba "Arquitetura"

```typescript
// app/page.tsx - Adicionar nova aba

<TabsList className="grid w-full grid-cols-6 mb-8">
  {/* Abas existentes */}
  <TabsTrigger value="projetos">Projetos</TabsTrigger>
  <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
  <TabsTrigger value="documentacao">Documentação</TabsTrigger>
  <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
  <TabsTrigger value="pesquisas">Pesquisas</TabsTrigger>
  
  {/* Nova aba */}
  <TabsTrigger value="arquitetura">
    <Network className="h-4 w-4 mr-2" />
    Arquitetura
  </TabsTrigger>
</TabsList>
```

### 5.2. Componente de Arquitetura

```typescript
// components/ArquiteturaBI.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ArquiteturaBI() {
  return (
    <div className="space-y-8">
      {/* Visão Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Arquitetura de Dados - Control F5</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Visualização da infraestrutura de dados e como os projetos se conectam.
          </p>
          
          {/* Diagrama Simplificado */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex flex-col items-center space-y-6">
              
              {/* Camada 1: Fontes de Dados */}
              <div className="w-full">
                <h3 className="text-center font-semibold mb-4">📊 Fontes de Dados</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="px-4 py-2">Google Sheets</Badge>
                  <Badge variant="outline" className="px-4 py-2">APIs Externas</Badge>
                  <Badge variant="outline" className="px-4 py-2">Banco de Dados</Badge>
                </div>
              </div>

              {/* Seta */}
              <div className="text-4xl text-gray-400">↓</div>

              {/* Camada 2: Processamento */}
              <div className="w-full">
                <h3 className="text-center font-semibold mb-4">⚙️ Processamento</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="px-4 py-2 bg-blue-500">BigQuery</Badge>
                  <Badge className="px-4 py-2 bg-purple-500">ETL Scripts</Badge>
                </div>
              </div>

              {/* Seta */}
              <div className="text-4xl text-gray-400">↓</div>

              {/* Camada 3: Visualização */}
              <div className="w-full">
                <h3 className="text-center font-semibold mb-4">📈 Visualização</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="px-4 py-2 bg-green-500">Dashboards</Badge>
                  <Badge className="px-4 py-2 bg-yellow-500">Relatórios</Badge>
                  <Badge className="px-4 py-2 bg-pink-500">Portal BI</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projetos por Camada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coleta de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Integração Google Sheets</li>
              <li>• APIs de Tráfego</li>
              <li>• Dados Financeiros</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• ETL Automatizado</li>
              <li>• Limpeza de Dados</li>
              <li>• Agregações</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Dashboards Looker</li>
              <li>• Relatórios Automáticos</li>
              <li>• Portal de BI</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Conexões entre Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Conexões entre Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ConexaoProjeto
              origem="Dashboard Tráfego"
              destino="Relatório Mensal"
              tipo="Alimenta dados"
            />
            <ConexaoProjeto
              origem="ETL Growth"
              destino="Dashboard Growth"
              tipo="Processa dados"
            />
            <ConexaoProjeto
              origem="API Financeiro"
              destino="Dashboard Financeiro"
              tipo="Fonte de dados"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConexaoProjeto({ origem, destino, tipo }: { origem: string; destino: string; tipo: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <Badge variant="outline">{origem}</Badge>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
        <span className="text-xs text-gray-500">{tipo}</span>
        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
      </div>
      <Badge variant="outline">{destino}</Badge>
    </div>
  );
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Banco de Dados
- [ ] Executar ALTER TABLE no BigQuery
- [ ] Atualizar tipos TypeScript
- [ ] Testar APIs com novos campos

### Fase 2: Navegação
- [ ] Adicionar botão Admin no header
- [ ] Implementar atalho Ctrl+Shift+A
- [ ] Criar layout admin com botão voltar

### Fase 3: Detalhes
- [ ] Criar páginas de detalhes para cada tipo
- [ ] Adicionar botão "Detalhes" nos cards
- [ ] Testar navegação

### Fase 4: Filtro
- [ ] Alterar estado inicial do filtro
- [ ] Testar filtro automático

### Fase 5: Arquitetura
- [ ] Criar componente ArquiteturaBI
- [ ] Adicionar aba Arquitetura
- [ ] Popular com dados reais

---

## ⏱️ ESTIMATIVA DE TEMPO

| Fase | Tempo | Complexidade |
|------|-------|--------------|
| 1. Banco de Dados | 30 min | Baixa |
| 2. Navegação | 20 min | Baixa |
| 3. Detalhes | 1h | Média |
| 4. Filtro | 10 min | Baixa |
| 5. Arquitetura | 1h | Média |
| **TOTAL** | **~3h** | **Média** |

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

1. **Fase 4** (10 min) - Filtro automático (mais rápido)
2. **Fase 2** (20 min) - Navegação admin
3. **Fase 1** (30 min) - Banco de dados
4. **Fase 3** (1h) - Páginas de detalhes
5. **Fase 5** (1h) - Arquitetura

**Total: ~3 horas de desenvolvimento**

---

## ❓ PERGUNTAS PARA VOCÊ

1. **Quer que eu implemente tudo de uma vez ou fase por fase?**
2. **Prefere modal ou página separada para detalhes?**
3. **Tem alguma preferência para o diagrama de arquitetura?** (simples, interativo, etc)
4. **Quer adicionar mais responsáveis além de Thiago e Leandro?**

---

**Pronto para começar! Qual fase você quer que eu implemente primeiro?** 🚀
