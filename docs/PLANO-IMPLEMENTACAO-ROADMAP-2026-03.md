# Plano de Implementacao do Roadmap

**Data:** 16 de marco de 2026  
**Escopo:** Planejamento de evolucao da plataforma LP Dados sem implementacao imediata  
**Objetivo:** Organizar a entrega das melhorias propostas com baixo risco de regressao

---

## 0. Status Atual da Implementacao

### Entregue

- Fase 0 - Preparacao tecnica e de navegacao
- Fase 1 - Reformulacao da Central de Ajuda
- Fase 2 - `Saude dos Dados` em modelo hibrido com catalogo real do BigQuery, curadoria admin e exibicao operacional no portal
- Fase 3 - Fluxo funcional de `Demandas` com `Nova solicitacao`, API publica, triagem admin e persistencia em BigQuery

### Entregue parcialmente

- Fase 4 - Integracao demanda-projeto
  - ja existe vinculacao opcional no admin
  - ja existe exibicao do vinculo na visao publica da solicitacao
  - ainda faltam refinamentos em detalhes de projeto e possivel timeline

### Pendente

- Fase 5 - Evolucao continua
- Revisao da busca global para os novos dominios

### Observacao importante

O modulo `Saude dos Dados` ja foi migrado para o modelo hibrido recomendado. O BigQuery fornece a ultima atualizacao real da tabela; o admin seleciona apenas as tabelas prioritarias e preenche o contexto operacional.

Direcao consolidada na implementacao:

- o BigQuery fornece a ultima atualizacao real da tabela
- o admin seleciona apenas as tabelas prioritarias que entram no portal
- o admin continua preenchendo os campos de negocio e operacao, incluindo `descricao`, `observacao`, `fonte` e `impacto`
- o portal exibe os cards-resumo e um bloco adicional com os itens em `alerta` ou `atrasado`, incluindo observacao e impacto

---

## 1. Resumo Executivo

O roadmap analisado faz sentido e esta alinhado com a maturidade atual da plataforma. As tres frentes principais sao:

- Reformulacao da Central de Ajuda
- Exibicao de Status de Tabelas
- Sistema de Demandas, com entrada publica orientada ao usuario como `Nova solicitacao`

A melhor estrategia nao e adicionar tudo diretamente ao portal atual. O portal ja funciona, mas parte da navegacao, da busca e das APIs esta acoplada aos modulos atuais. O caminho mais seguro e incluir uma **Fase 0 de preparacao tecnica**, seguida por entregas incrementais e isoladas por dominio.

---

## 2. Decisoes de Produto e Nomenclatura

### 2.1 Nomes recomendados na interface

- Interface publica: `Nova solicitacao`
- Nome interno do dominio: `Demandas`
- Nome administrativo: `Gestao de demandas`
- Widget operacional: `Saude dos Dados`

### 2.2 Racional

`Nova solicitacao` comunica melhor a acao esperada pelo colaborador. `Demandas` continua sendo o melhor nome tecnico para tabelas, tipos, status, APIs e painel admin.

### 2.3 Ponto de entrada principal

Adicionar um CTA na home principal com o texto `Nova solicitacao`, apontando para a futura pagina de abertura de solicitacao. Esse CTA deve existir tambem:

- no portal
- na Central de Ajuda
- no bloco final de contato e suporte

---

## 3. Principios para Implementar sem Quebrar

- Nao expandir `itens_portal` para tudo. `demandas` e `tabelas_status` devem ser dominios proprios.
- Nao misturar melhoria visual com mudanca estrutural sem faseamento.
- Nao acoplar o novo fluxo de solicitacao ao modulo de projetos desde o inicio.
- Nao alterar o comportamento das abas atuais enquanto os novos modulos nao estiverem estaveis.
- Tratar navegacao, busca e contratos de tipos como base compartilhada antes da expansao funcional.

---

## 4. Diagnostico Tecnico Relevante

### 4.1 Pontos fortes atuais

- Stack moderna e consistente com Next.js App Router, TypeScript e componentes reutilizaveis
- Estrutura de detalhes ja existente para projetos, dashboards, docs, ferramentas e pesquisas
- Painel admin ja organizado em secoes expansiveis
- API unificada para itens do portal funcionando para o escopo atual

### 4.2 Pontos de atencao antes de crescer

- O portal principal ainda esta estruturado em torno de 5 modulos fixos
- A Central de Ajuda atual e estatica e excessivamente tecnica
- A busca global faz varredura ampla demais e ficara mais cara com novas entidades
- Existem pontos de duplicacao entre rotas admin e rotas publicas
- Parte da navegacao ainda depende de estrutura hardcoded

### 4.3 Conclusao

O projeto comporta a evolucao proposta, mas precisa primeiro de um pequeno ajuste de arquitetura para que as novas entregas nao aumentem a divergencia interna.

---

## 5. Fase 0 - Preparacao Tecnica e de Navegacao

### Objetivo

Criar uma base segura para inserir novos modulos e CTAs sem retrabalho e sem regressao no portal atual.

### Entregaveis

- Estrutura centralizada de navegacao do portal e do admin
- Definicao dos modulos visiveis e seus metadados em configuracao unica
- Contratos TypeScript preparados para `Demanda`, `TabelaStatus` e estados relacionados
- Estrategia de busca revisada para suportar expansao futura
- Definicao dos CTAs globais, incluindo `Nova solicitacao`
- Mapeamento dos pontos que hoje estao hardcoded no portal

### O que deve entrar nesta fase

- Mapear tabs, atalhos, cards de acesso rapido e links recorrentes
- Extrair a definicao dos modulos para configuracao unica
- Definir a rota alvo da futura solicitacao publica
- Preparar o plano de evolucao da busca global
- Definir padrao de breadcrumbs e navegacao secundaria para novos modulos

### O que nao deve entrar nesta fase

- Criacao de tabelas no BigQuery
- Criacao de formularios finais
- Exibicao publica de dados novos
- Integracao demanda-projeto

### Beneficio

Reduz retrabalho na `Fase 1`, `Fase 2` e `Fase 3` e evita espalhar condicionais no `app/portal/page.tsx`.

---

## 6. Fase 1 - Reformulacao da Central de Ajuda

### Objetivo

Melhorar a experiencia do usuario sem depender de banco de dados novo.

### Entregaveis

- Novo hero com busca e acessos por intencao
- Onboarding visual em passos
- Separacao de conteudo por perfil de uso
- FAQ por categoria
- CTA final para `Nova solicitacao`

### Recomendacoes de implementacao

- Modelar o conteudo da ajuda em estrutura de dados, nao apenas JSX estatico
- Separar conteudo publico de conteudo admin
- Tratar a busca como filtro local inicialmente
- Reaproveitar componentes existentes de accordion, tabs, cards e breadcrumb

### Riscos

- Virar apenas um redesign visual sem organizacao de conteudo
- Expor informacao tecnica demais ao usuario comum

### Validacao

- Usuario consegue encontrar o que fazer sem ler a pagina inteira
- Existe caminho claro para portal, admin e abertura de solicitacao

---

## 7. Fase 2 - Status de Tabelas

### Objetivo

Dar transparencia operacional sobre a atualizacao das fontes de dados utilizadas nos dashboards.

### Entregaveis

- Tabela `tabelas_status` no BigQuery
- Rotas publicas e administrativas especificas
- Widget `Saude dos Dados`
- Tela admin para selecao das tabelas prioritarias, edicao e observacoes

### Estrutura recomendada

Campos minimos:

- `id`
- `dataset_name`
- `table_name`
- `nome_tabela`
- `descricao`
- `ultima_atualizacao`
- `proxima_atualizacao`
- `status`
- `impacto`
- `responsavel`
- `fonte`
- `observacao`
- `ativo_portal`

### Recomendacoes de implementacao

- Manter este dominio separado de `itens_portal`
- Tratar o BigQuery como fonte da ultima atualizacao real
- Usar o admin como camada de curadoria das tabelas prioritarias
- Exibir estado vazio amigavel quando ainda nao houver registros
- Priorizar leitura publica simples e escrita administrativa segura
- Definir status por contrato, nao por texto livre

### Riscos

- Misturar status operacional com status de projeto
- Gerar informacao manual dificil de manter sem padronizacao

### Validacao

- Usuario entende rapidamente se o problema e de dado ou de visualizacao
- Admin consegue manter os registros sem fluxo complexo
- Portal nao expoe metadados tecnicos desnecessarios

---

## 8. Fase 3 - Demandas com Entrada Publica "Nova solicitacao"

### Objetivo

Criar um fluxo formal de solicitacao para analises, dashboards e novas entregas de BI.

### Entregaveis

- Pagina publica de abertura de solicitacao
- Formulario inicial com validacao basica
- Listagem publica opcional ou resumo de status
- Modulo admin de gestao de demandas
- CTA `Nova solicitacao` na home, portal e Central de Ajuda

### Estrutura recomendada

Campos minimos:

- `id`
- `titulo`
- `descricao`
- `area`
- `solicitante`
- `email`
- `prioridade`
- `status`
- `tipo`
- `projeto_id`
- `data_abertura`
- `data_atualizacao`
- `observacao`

### Fluxo inicial recomendado

`Nova` -> `Em analise` -> `Em desenvolvimento` -> `Entregue` ou `Cancelada`

### Recomendacoes de implementacao

- O nome do botao e da pagina pode ser publico e mais amigavel
- O dominio de dados continua `demandas`
- Nao obrigar vinculacao a projeto na primeira versao
- Comecar com notificacao interna manual antes de automacoes
- Exibir status de forma simples e compreensivel

### Riscos

- Criar formulario sem governanca minima e gerar backlog desorganizado
- Tentar acoplar automaticamente a projetos ja na primeira entrega

### Validacao

- Colaborador abre solicitacao sem apoio tecnico
- Equipe de BI consegue classificar, priorizar e atualizar o status

---

## 9. Fase 4 - Integracao Demanda-Projeto

### Objetivo

Fechar o ciclo entre solicitacao recebida e entrega executada.

### Entregaveis

- Relacionamento opcional entre demanda e projeto
- Exibicao do vinculo no admin
- Indicadores visuais em detalhes de projeto e demanda
- Possivel badge de projeto originado por solicitacao

### Recomendacoes de implementacao

- Implementar como vinculo opcional
- Evitar dependencia obrigatoria no cadastro de projeto
- Exibir historico de status ou timeline apenas se a base estiver pronta para isso

### Riscos

- Acoplamento excessivo entre gestao operacional e vitrine publica
- Complexidade desnecessaria antes da estabilizacao da fase 3

---

## 10. Fase 5 - Evolucao Continua

### Itens recomendados

- Notificacoes por e-mail quando o status de demanda mudar
- Dashboard administrativo de demandas por area e prioridade
- Historico de saude das tabelas
- Telemetria da Central de Ajuda
- Area pessoal com solicitacoes do colaborador
- Integracao automatica do status de tabelas com pipelines

---

## 11. Ordem Recomendada de Execucao

1. Fase 0 - Preparacao tecnica e de navegacao
2. Fase 1 - Central de Ajuda
3. Fase 2 - Status de Tabelas
4. Fase 3 - Demandas com `Nova solicitacao`
5. Fase 4 - Integracao demanda-projeto
6. Fase 5 - Evolucao continua

---

## 12. Dependencias por Fase

### Fase 0 depende de

- Leitura da estrutura atual
- Definicao funcional minima das novas areas

### Fase 1 depende de

- Fase 0 concluida

### Fase 2 depende de

- Fase 0 concluida
- Definicao da modelagem BigQuery para status operacional

### Fase 3 depende de

- Fase 0 concluida
- Definicao da modelagem BigQuery para demandas
- Definicao da rota publica de `Nova solicitacao`

### Fase 4 depende de

- Fase 3 estavel
- Cadastro de projetos consistente

---

## 13. Riscos Gerais e Mitigacoes

### Risco 1: crescer por remendo no portal atual

Mitigacao:

- fazer a Fase 0 antes de qualquer modulo novo

### Risco 2: duplicar logica entre APIs publicas, admin e busca

Mitigacao:

- definir contratos por dominio
- centralizar acesso a dados onde fizer sentido

### Risco 3: criar nova UX sem governanca de conteudo

Mitigacao:

- estruturar dados e textos antes da camada visual

### Risco 4: regressao no portal principal

Mitigacao:

- inserir novos modulos inicialmente de forma isolada
- evitar reescrever a pagina inteira em uma unica entrega

---

## 14. Quick Wins Recomendados

Podem entrar logo apos a Fase 0 ou junto da Fase 1:

- CTA `Nova solicitacao` na home principal
- CTA `Nova solicitacao` no portal
- CTA `Nova solicitacao` no fechamento da Central de Ajuda
- Tooltip explicando status de projeto
- Filtro por area em projetos
- Destaque para novidades recentes

---

## 15. Recomendacao Final

O melhor inicio nao e construir o formulario de solicitacao imediatamente. O melhor inicio e executar a **Fase 0**, porque ela prepara a navegacao, a expansao dos tipos, a estrategia de busca e os pontos de entrada do novo fluxo.

Depois disso, a entrega com maior retorno e menor risco e a **nova Central de Ajuda**, ja incorporando o CTA `Nova solicitacao`. Na sequencia, entram `Saude dos Dados` e o dominio de `Demandas`.

Esse caminho preserva o que ja esta construido, reduz retrabalho e cria uma base mais limpa para evolucao futura.
