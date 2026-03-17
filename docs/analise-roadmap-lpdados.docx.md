**Portal LP Dados — Control F5 BI**

Análise Completa, Diagnóstico e Roadmap de Evolução

*Março de 2026*

# **1\. Visão Geral do Projeto**

O portal LP Dados é uma plataforma interna da agência de marketing Control F5 criada para fomentar a cultura data-driven entre os colaboradores. Desenvolvida em Next.js 14 com App Router, TypeScript, Tailwind CSS e shadcn/ui, utiliza o Google BigQuery como banco de dados principal, acessado via APIs REST próprias do framework.

**A arquitetura atual é madura e bem estruturada:**

* Stack moderna: Next.js 14 \+ TypeScript \+ Tailwind CSS \+ shadcn/ui

* Banco: Google BigQuery com tabela unificada de itens \+ tabelas específicas (pesquisas, telemetria, dashboard-docs)

* Autenticação: NextAuth \+ cookie de admin para área administrativa

* Telemetria: rastreamento de eventos de uso no portal

* CRUD completo: projetos, dashboards, documentação, ferramentas, pesquisas

* Importação em lote: CSV para pesquisas, JSON para dashboard-docs

O projeto já passou por múltiplas iterações documentadas (25+ arquivos de log de correções), demonstrando maturidade e comprometimento com qualidade.

# **2\. Diagnóstico — Estado Atual vs. Oportunidades**

| Área / Componente | Situação Atual | Oportunidade de Melhoria |
| :---- | :---- | :---- |
| Landing Page (home) | Explica missão, pipeline e impactos. Boa apresentação institucional. | Adicionar acesso rápido a 'Abrir demanda' e status das tabelas. |
| Portal (/portal) | Tabs: Projetos, Dashboards, Docs, Ferramentas, Pesquisas com filtros. | Adicionar aba 'Demandas' e widget de Status de Tabelas. |
| Central de Ajuda | Conteúdo técnico estático, foco em admin/CSV/JSON. UI básica. | Reformular com UX orientada ao usuário final, interativa e fluida. |
| Painel Admin | CRUD completo: projetos, dashboards, docs, ferramentas, pesquisas. | Adicionar gestão de Demandas e Status de Tabelas. |
| APIs / Backend | BigQuery como BD. APIs REST completas via Next.js route handlers. | Novas rotas para demandas e tabela de status de atualização. |
| Banco de Dados (BigQuery) | Tabela unificada \+ tabelas de pesquisas, telemetria, dashboard-docs. | Novas tabelas: demandas e tabelas\_status. |
| Tipos TypeScript | Arquivo bi-platform.ts com interfaces para todos os recursos. | Adicionar tipos Demanda e TabelaStatus. |

# **3\. As Três Iniciativas Prioritárias**

## **3.1 Sistema de Demandas**

Atualmente não existe um canal formal para os colaboradores solicitarem análises, novos dashboards ou projetos de dados. O objetivo é criar um fluxo completo:

* Portal público: formulário de abertura de demanda acessível a qualquer colaborador

* Campos essenciais: título, descrição, área solicitante, nome, e-mail, prioridade (baixa/média/alta/urgente)

* Listagem no portal: nova aba 'Demandas' mostrando status das solicitações abertas

* Admin: tela de gestão com filtros por status, área e prioridade; possibilidade de vincular demanda a um projeto existente

* Integração bidirecional: quando um projeto for criado no admin, ele pode ser vinculado a uma demanda aberta; o status da demanda atualiza automaticamente

**Fluxo de status da demanda:**

* Nova → Em Análise → Em Desenvolvimento → Entregue / Cancelada

Impacto esperado: visibilidade para os colaboradores de que suas solicitações estão sendo tratadas; para a equipe de BI, um backlog organizado e rastreável.

## **3.2 Status de Atualização de Tabelas**

Os dashboards dependem da atualização periódica das tabelas do BigQuery. Hoje, quando um dashboard mostra dados defasados, o colaborador não tem como saber se é problema de visualização ou de dados. A solução é um widget de transparência operacional:

* Nova seção no portal: 'Saúde dos Dados' — lista de tabelas com última atualização, próxima atualização e status visual

* Três estados: OK (verde), Alerta — atualização próxima (amarelo), Atrasado (vermelho)

* Visível para todos no portal, gerenciado pela equipe de BI no admin

* Campo de observação para explicar atrasos ou manutenções programadas

Impacto esperado: redução de dúvidas e tickets de suporte sobre dados desatualizados; credibilidade da área de BI perante as outras áreas.

## **3.3 Central de Ajuda — Reformulação UX/UI**

A Central de Ajuda atual contém informações corretas, mas sua apresentação é técnica e pouco intuitiva para o usuário final (não técnico). A seção 'Como usar em 4 passos' é uma lista simples de texto sem hierarquia visual, sem interatividade e sem orientação por perfil de uso.

**Problemas identificados:**

* Mistura conteúdo técnico (erros 401, 500, CSV headers, JSON schema) com orientação para o usuário final

* Sem busca — usuário precisa ler tudo para encontrar o que precisa

* '4 passos' não comunica o caminho de forma visual e envolvente

* Sem diferenciação de perfil (usuário regular vs. admin)

* Sem CTA claro ao final — onde ir depois de ler?

# **4\. Central de Ajuda — Plano Detalhado de Reformulação**

| Seção | Problema Atual | Solução Proposta |
| :---- | :---- | :---- |
| Hero / Cabeçalho | Texto estático genérico, sem contexto do usuário. | Buscador em destaque \+ cards de 'acesso rápido' por intenção (Quero ver dashboards / Quero abrir demanda / Sou novo aqui). |
| Como usar em 4 passos | Lista simples de texto, pouco visual, não interativa. | Stepper visual horizontal/vertical com ícones, animação de progresso e exemplos práticos em cada passo. |
| Catálogo de módulos | Grid de cards sem hierarquia de relevância. | Cards com ícone, cor por categoria, link direto e badge 'Novidade' quando aplicável. |
| Fluxos CSV/JSON | Conteúdo técnico exposto para todos os perfis. | Colapso (accordion) com indicação clara 'para usuários admin'. Perfil regular não vê poluição técnica. |
| FAQ de erros | Lista fixa de erros técnicos (401, 500, etc). | Buscador de FAQ \+ categorias (Acesso, Dados, Dashboards, Demandas). Accordion por categoria. |
| Contato / Feedback | Link de e-mail no rodapé. Sem chamada visível. | Card de contato fixo no final: 'Não encontrou o que precisava? Fale com a equipe de BI.' \+ botão abrir demanda. |

### **Proposta de estrutura da nova página:**

* Hero: título forte \+ buscador centralizado \+ 3 cards de intenção rápida

* Onboarding visual: stepper 'Como funciona o portal' com 4 etapas animadas

* Módulos do portal: grid de cards com cor, ícone e descrição de uso

* Guia por perfil: abas 'Sou usuário' / 'Sou admin' com conteúdo separado

* FAQ com accordion por categoria: Acesso, Dashboards, Demandas, Dados, Admin

* Bloco de contato: card chamativo com e-mail \+ botão 'Abrir demanda'

# **5\. Roadmap de Implementação**

As fases são ordenadas por impacto imediato e dependência técnica:

| Fase | Módulo | Entregável | Impacto |
| :---- | :---- | :---- | :---- |
| 1 | Central de Ajuda (refactor) | Nova UI/UX: hero dinâmico, busca inteligente, cards por perfil de uso, FAQ com accordion, onboarding visual. | Reduz atrito dos funcionários no uso do portal. Resultado imediato. |
| 2 | Status de Tabelas (novo) | Widget no portal mostrando última atualização, próxima atualização e status (ok/atrasado/alerta) de cada tabela do BD. | Transparência operacional. Equipe vê saúde dos dados sem precisar perguntar. |
| 3 | Sistema de Demandas (novo) | Formulário de abertura de demanda \+ listagem no portal \+ gestão no admin vinculada aos projetos existentes. | Canal formal de pedidos. Liga demanda ao projeto entregue. |
| 4 | Integração Demanda–Projeto | Campo projeto\_id em demandas, badge 'Em andamento' no card do projeto, timeline de status. | Fecha o ciclo: demanda → projeto → entrega. Alta visibilidade. |
| 5 | Evolução contínua | Notificações de status por e-mail, dashboard de demandas por área, SLA de atendimento, painel de saúde de dados histórico. | Amadurece a plataforma como ferramenta estratégica de gestão. |

# **6\. Estrutura Técnica das Novas Funcionalidades**

## **6.1 Novas Tabelas no BigQuery**

| Tabela BigQuery | Fase | Campos Principais |
| :---- | :---- | :---- |
| demandas | Fase 3 | id, titulo, descricao, area, solicitante, email, status (nova/em análise/em desenvolvimento/entregue/cancelada), prioridade, projeto\_id (FK), data\_abertura, data\_atualizacao, observacao |
| tabelas\_status | Fase 2 | id, nome\_tabela, descricao, ultima\_atualizacao, proxima\_atualizacao, status (ok/atrasado/alerta), responsavel, fonte, observacao |

## **6.2 Novas Rotas de API (Next.js Route Handlers)**

* GET/POST /api/demandas — listagem pública e criação de demanda

* GET/PATCH/DELETE /api/admin/demandas/\[id\] — gestão admin

* GET/POST /api/admin/tabelas-status — gestão do status das tabelas

* GET /api/tabelas-status — leitura pública para exibição no portal

## **6.3 Novos Componentes React**

* DemandaForm.tsx — formulário de abertura de demanda

* DemandaCard.tsx — card de exibição de demanda no portal

* TabelasStatusWidget.tsx — widget de saúde dos dados

* HelpStepper.tsx — stepper visual para os 4 passos da Central de Ajuda

* HelpSearch.tsx — buscador inteligente com resultados em tempo real

* PerfilSelector.tsx — seletor 'usuário / admin' na Central de Ajuda

## **6.4 Novos Types TypeScript**

* Demanda — com campos de status, prioridade, vinculação a projeto

* TabelaStatus — com campos de datas, status e observação

* PerfilAjuda — para controle da view da Central de Ajuda

# **7\. Recomendações de Melhoria Adicional**

## **7.1 Quick Wins (podem ser feitos agora, sem nova infraestrutura)**

* Adicionar link 'Abrir Demanda' no header do portal e na landing page

* Badge de novidade nos projetos criados nos últimos 30 dias

* Filtro de área na aba Projetos (atualmente só existe filtro de status)

* Tooltip explicativo nos status de projeto (ex: o que significa 'Standby'?)

* Breadcrumb nas páginas de detalhe para facilitar navegação

## **7.2 Médio Prazo**

* Notificação por e-mail quando o status de uma demanda muda

* Dashboard de demandas por área — gráfico de pizza no painel admin

* Histórico de atualizações de cada tabela de status (log de registros anteriores)

* Modo escuro no portal — infraestrutura já preparada com theme-provider

* Página de perfil do colaborador com suas demandas abertas

## **7.3 Longo Prazo**

* Integração automática do status de tabelas via pipeline (atualização automática ao rodar ETL)

* Sistema de SLA: alertas quando demanda ultrapassa X dias sem resposta

* Analytics da Central de Ajuda: quais perguntas são mais buscadas

* API pública de status para integração em outros sistemas da agência

# **8\. Como Começar — Primeiros Passos**

Recomendação de sequência para obter resultados rápidos:

* Passo 1 — Refatorar a Central de Ajuda (impacto imediato, sem BD): redesenhar a página com nova estrutura visual, stepper animado e FAQ por accordion. Não requer banco de dados.

* Passo 2 — Criar tabela tabelas\_status no BigQuery \+ API \+ widget no portal. Equipe de BI começa a cadastrar status das tabelas manualmente.

* Passo 3 — Criar tabela demandas no BigQuery \+ API \+ formulário público. Usuários já podem abrir demandas. Admin já pode gerenciar.

* Passo 4 — Vincular demandas a projetos no admin \+ mostrar badge no card do projeto. Fecha o ciclo de transparência.

*Cada passo entrega valor independente e pode ser validado com os usuários antes de avançar para o próximo.*

Portal LP Dados — Control F5 Business Intelligence

*Documento gerado em Março de 2026 | Roadmap e Análise para Evolução Gradual da Plataforma*