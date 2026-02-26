# Proposta Detalhada para o Portal de BI e Cultura de Dados

## 1. Objetivo
Consolidar a evolucao do portal de BI (`https://lpdados2.vercel.app/`) com melhorias graduais, sem quebrar o que ja esta em producao, fortalecendo a cultura de dados na empresa.

## 2. Principios para Evoluir Sem Quebra
- Manter contratos atuais das APIs publicas (`/api/itens`, `/api/pesquisas`, `/api/dashboard-docs/[id]`).
- Fazer mudancas aditivas no banco (novas tabelas/colunas, sem remocoes abruptas).
- Liberar novas funcionalidades por etapas e, quando necessario, via feature flag.
- Preservar o fluxo atual do admin (`/admin`) e adicionar modulos novos em paralelo.
- Validar sempre em homologacao/deploy preview antes de producao.

## 3. Diagnostico do Estado Atual
### 3.1 O que ja esta bem consolidado
- Front moderno em Next.js + Vercel.
- Estrutura em abas clara: Projetos, Dashboards, Documentacao, Ferramentas, Pesquisas.
- CRUD administrativo funcional para itens.
- Importacao em lote de pesquisas via CSV (admin).
- Importacao de glossario/insights por dashboard via JSON (admin).
- Paginas de detalhe por tipo de conteudo.
- Busca global ja disponivel.

### 3.2 Lacunas principais
- Personalizacao por perfil (analista, gestor, cliente) ainda nao implementada.
- Acessibilidade nao formalizada com checklist WCAG.
- Arquitetura de dados editavel ainda nao implementada.
- Onboarding de clientes ainda nao implementado.
- Comunidade/Forum e trilhas de Data Literacy ainda nao implementadas como modulos dedicados.
- Central de Ajuda/Funcionalidades ainda nao implementada como modulo dedicado.

## 4. Controle de Implementacao (Campo de Acompanhamento)
Legenda:
- SIM = implementado
- PARCIAL = implementado em parte
- NAO = nao implementado

| Frente | Implementado? | Evidencia Atual | Proximo Passo |
|---|---|---|---|
| Base moderna (Next.js + Vercel) | SIM | Projeto em producao na Vercel | Manter atualizacao de dependencias |
| Estrutura em abas por dominio | SIM | Home com abas de conteudo | Ajustes finos de UX |
| CRUD admin de itens | SIM | /admin + APIs admin | Fortalecer permissoes por perfil |
| Importacao de Pesquisas em lote (CSV) | SIM | /admin/pesquisas + /api/admin/pesquisas/import | Adicionar export de erros e historico de cargas |
| Importacao de docs de dashboard (JSON) | SIM | /admin/dashboard-docs + APIs dedicadas | Templates por dashboard/tipo |
| Detalhes por tipo (projeto/dashboard/doc/ferramenta/pesquisa) | SIM | Rotas [id] implementadas | Melhorar performance e telemetria |
| Busca global | PARCIAL | Componente de busca e API de busca | Incluir termos de glossario e metricas com ranking |
| Skeleton/loading em todos os fluxos | PARCIAL | Home com skeletons | Expandir para telas de detalhe e admin |
| Dicionario de dados centralizado | PARCIAL | Glossario/insights por dashboard ja existem | Criar visao corporativa unificada de metricas |
| Nova pagina principal institucional (o que e o portal e como usar) | SIM | Rota / como LP institucional e rota /portal para conteudos | Evoluir narrativa por perfil e medir adocao |
| Central de Ajuda / Funcionalidades | PARCIAL | Rota /central-ajuda com catalogo, fluxo e FAQ basico | Adicionar governanca de conteudo e ajuda contextual no admin |
| Telemetria de uso do portal (page views por usuario/pagina) | PARCIAL | API `/api/telemetria/event`, API admin `/api/admin/telemetria/overview`, tela `/admin/telemetria` | Criar alertas e painel historico com comparativos |
| Personalizacao por perfil (RBAC) | NAO | Sem segregacao por papel | Implementar autenticacao + autorizacao por perfil |
| Acessibilidade (WCAG) | NAO | Sem checklist formal | Auditoria + correcao por prioridade |
| Modulo Arquitetura de Dados editavel | NAO | Nao existe no portal | Comecar com visualizacao read-only + fase editavel |
| Modulo Onboarding de Clientes | NAO | Nao existe no portal | Criar fluxo de checklist dinamico por servico |
| Validacao automatica de acessos (APIs externas) | NAO | Nao existe | Integrar em etapa posterior do onboarding |
| Status de prontidao de onboarding | NAO | Nao existe | Painel com etapas e SLA |
| Alertas/Notificacoes de pendencias | NAO | Nao existe | Notificacoes por e-mail/Slack |
| Comunidade/Forum de duvidas | NAO | Nao existe | Definir escopo minimo (FAQ + perguntas) |
| Trilha de educacao em dados (Data Literacy) | NAO | Nao existe modulo dedicado | Criar secao com trilhas curtas e materiais |
| Cases de sucesso orientados a dados | NAO | Nao existe secao dedicada | Criar modulo de publicacao de cases |

## 5. Plano Priorizado (Foco em Adocao, sem quebra)
### 5.1 Prioridade imediata (Agora)
Objetivo: aumentar uso e entendimento do portal por usuarios internos com entregas de baixo risco.

Frentes prioritarias:
- Central de Ajuda / Funcionalidades.
- Nova pagina principal institucional (explica o que e o portal, o que contem e como usar).
- Navegacao guiada para os fluxos mais usados (Pesquisar, Ver Dashboards, Abrir Detalhes, Importar no Admin).

Entregaveis do ciclo imediato:
- Aba/pagina de Central de Ajuda publicada.
- Pagina principal institucional com proposta de valor, modulos e passos de uso.
- FAQ com erros comuns e correcoes rapidas.
- Links contextuais "Como usar" dentro do admin.

### 5.2 Prioridade seguinte (Depois do ciclo imediato)
- Busca global ampliada para glossario e insights com melhor ranking.
- Historico e export de erros de importacoes no admin.
- Checklist e correcoes iniciais de acessibilidade (WCAG basico).

### 5.3 Backlog posterior (Nao prioritario agora)
- Arquitetura de dados editavel.
- Onboarding de clientes com validacoes automaticas.
- Modulos de comunidade/forum e trilhas extensas de Data Literacy.

## 6. Melhorias Tecnicas Recomendadas por Ordem
1. Implementar RBAC simples no admin (papeis e permissoes).
2. Criar camada de auditoria de alteracoes (quem alterou o que e quando).
3. Adicionar endpoints de health-check e metricas operacionais.
4. Padronizar contratos de resposta das APIs (`success`, `data`, `errors`).
5. Adicionar testes minimos para rotas criticas (importacoes e detalhes).

## 7. Criterios de Pronto por Etapa
- Sem regressao das rotas e modulos existentes.
- Testado em preview e validado com checklist funcional.
- Documentacao atualizada neste arquivo e no guia tecnico.
- Campo `Implementado?` atualizado apos cada entrega.

## 8. Backlog Priorizado por Ciclo
| ID | Item Tecnico | Implementado? | Prioridade | Dependencias | Criterio de Aceite |
|---|---|---|---|---|---|
| P0-01 | Criar nova pagina principal institucional do portal | SIM | Alta | Nenhuma | Pagina explica objetivo, modulos, publico e caminhos de uso |
| P0-02 | Criar Central de Ajuda/Funcionalidades (MVP) | SIM | Alta | P0-01 | Pagina lista todos os modulos e como usar cada um |
| P0-03 | Documentar fluxos de operacao (cadastro, CSV, JSON) | PARCIAL | Alta | P0-02 | Guias passo a passo publicados com exemplos validos |
| P0-04 | Publicar FAQ de erros recorrentes + troubleshooting | PARCIAL | Alta | P0-03 | FAQ cobre 401, 404, 500, schema/tipo, encoding e duplicidade |
| P0-05 | Adicionar links contextuais de ajuda no Admin | NAO | Media | P0-02 | Admin com atalhos de ajuda sem alterar fluxo atual |
| P1-01 | Expandir busca global para glossario e insights | NAO | Media | P0-02 | Busca retorna conteudo de itens, pesquisas e dashboard docs |
| P1-02 | Melhorar ranking da busca (nome > tags > descricao) | NAO | Media | P1-01 | Ordenacao por relevancia consistente |
| P1-03 | Historico de importacoes de pesquisas (admin) | NAO | Media | Nenhuma | Tela mostra data, modo, totais, erros e usuario |
| P1-04 | Export de erros da importacao CSV (admin) | NAO | Media | P1-03 | Botao gera CSV de erros com linha e motivo |
| P1-05 | Checklist basico de acessibilidade + correcoes criticas | NAO | Media | P0-01 | Foco visivel, labels e teclado funcionais nas telas principais |
| P2-01 | Modulo de arquitetura de dados (read-only) | NAO | Baixa | P1 concluido | Visualizacao publicada sem edicao |
| P2-02 | Modulo de onboarding de clientes | NAO | Baixa | P1 concluido | Checklist dinamico por servico com status por etapa |

### 8.1 Escopo minimo recomendado (MVP da adocao)
- Visao geral da plataforma: o que existe hoje e para que serve cada aba/modulo.
- Como navegar no portal e encontrar conteudos rapidamente.
- Como cadastrar itens no admin (campos, tipo de tarefa, status, area).
- Como importar pesquisas por CSV (cabecalho, validacoes, modos upsert/replace).
- Como importar docs de dashboard por JSON (estrutura de `views`, `insights`, `glossary_fields`).
- Erros comuns e correcoes rapidas com linguagem direta.

### 8.2 Estrategia para nao quebrar o que ja funciona
- Implementar como modulo novo de conteudo, sem alterar contratos de API existentes.
- Reaproveitar layout e componentes atuais para reduzir risco de regressao.
- Liberar em duas ondas: primeiro paginas de leitura, depois ajuda contextual no admin.
- Validar em preview com smoke test de rotas criticas antes de promover para producao.

### 8.3 Regra de atualizacao deste documento
- Sempre que um item for entregue, atualizar `Implementado?` para SIM ou PARCIAL.
- Registrar no PR/commit o ID do backlog (ex.: P0-02).
- Nao iniciar item dependente sem concluir o anterior (salvo excecao aprovada).

## 9. Referencias
- React Flow: https://reactflow.dev/
- Praticas de UX para BI: SDG Group / Grow
- Cultura Data-Driven: Confluent
