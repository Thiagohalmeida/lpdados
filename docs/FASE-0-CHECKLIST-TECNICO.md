# Fase 0 - Checklist Tecnico

**Data:** 16 de marco de 2026  
**Objetivo:** Preparar a base tecnica para receber `Nova solicitacao`, `Demandas` e `Saude dos Dados` sem regressao

---

## 0. Status

**Fase 0 concluida.**

Itens efetivamente entregues:

- base compartilhada de navegacao e CTAs
- rota publica `Nova solicitacao`
- CTAs publicos na home, portal e Central de Ajuda
- tipos para `Demanda` e `TabelaStatus`
- expansao inicial do admin para os novos dominios
- preparacao do portal para crescimento com widget de `Saude dos Dados`

Itens ainda pendentes fora da Fase 0:

- revisao da busca global para os novos dominios
- refinamentos de acabamento e analise na experiencia final do portal

---

## 1. Resultado Esperado da Fase 0

Ao final da Fase 0, a plataforma deve estar pronta para crescer sem remendos estruturais. Isso significa:

- navegacao preparada para novos modulos
- CTAs globais definidos
- contratos de tipos preparados para novas entidades
- estrategia de busca pronta para expansao
- pontos de acoplamento mapeados

Nenhuma funcionalidade nova precisa estar ativa ao usuario final nesta fase. O foco aqui e preparar o terreno.

---

## 2. Escopo da Fase 0

### Inclui

- organizacao de navegacao
- definicao de rotas alvo futuras
- preparacao dos tipos
- revisao do modelo de busca global
- definicao de pontos de CTA
- alinhamento de padroes entre home, portal, ajuda e admin

### Nao inclui

- criacao de tabelas novas no BigQuery
- criacao do formulario de `Nova solicitacao`
- criacao do widget de `Saude dos Dados`
- vinculacao entre demanda e projeto

---

## 3. Mapa Atual dos Pontos que Entram na Fase 0

### Home principal

Arquivo principal:

- [app/page.tsx](/c:/Users/AdministradorCF5/Documents/lpdados/app/page.tsx)

Pontos atuais relevantes:

- CTA para portal em [app/page.tsx:122](/c:/Users/AdministradorCF5/Documents/lpdados/app/page.tsx:122)
- CTA para Central de Ajuda em [app/page.tsx:128](/c:/Users/AdministradorCF5/Documents/lpdados/app/page.tsx:128)
- CTA para admin em [app/page.tsx:133](/c:/Users/AdministradorCF5/Documents/lpdados/app/page.tsx:133)

### Portal principal

Arquivo principal:

- [app/portal/page.tsx](/c:/Users/AdministradorCF5/Documents/lpdados/app/portal/page.tsx)

Pontos atuais relevantes:

- busca global em [app/portal/page.tsx:142](/c:/Users/AdministradorCF5/Documents/lpdados/app/portal/page.tsx:142)
- tabs fixas em [app/portal/page.tsx:209](/c:/Users/AdministradorCF5/Documents/lpdados/app/portal/page.tsx:209)
- estrutura baseada em 5 modulos atuais em [app/portal/page.tsx:209](/c:/Users/AdministradorCF5/Documents/lpdados/app/portal/page.tsx:209)

### Central de Ajuda

Arquivo principal:

- [app/central-ajuda/page.tsx](/c:/Users/AdministradorCF5/Documents/lpdados/app/central-ajuda/page.tsx)

Pontos atuais relevantes:

- CTA para portal em [app/central-ajuda/page.tsx:28](/c:/Users/AdministradorCF5/Documents/lpdados/app/central-ajuda/page.tsx:28)
- CTA para admin em [app/central-ajuda/page.tsx:33](/c:/Users/AdministradorCF5/Documents/lpdados/app/central-ajuda/page.tsx:33)

### Busca global

Arquivos principais:

- [components/GlobalSearch.tsx](/c:/Users/AdministradorCF5/Documents/lpdados/components/GlobalSearch.tsx)
- [app/api/busca/route.ts](/c:/Users/AdministradorCF5/Documents/lpdados/app/api/busca/route.ts)

Pontos atuais relevantes:

- dialogo da busca em [components/GlobalSearch.tsx:75](/c:/Users/AdministradorCF5/Documents/lpdados/components/GlobalSearch.tsx:75)
- placeholder orientado aos modulos atuais em [components/GlobalSearch.tsx:81](/c:/Users/AdministradorCF5/Documents/lpdados/components/GlobalSearch.tsx:81)
- consulta ampla em [app/api/busca/route.ts:26](/c:/Users/AdministradorCF5/Documents/lpdados/app/api/busca/route.ts:26)
- busca em memoria com `JSON.stringify` em [app/api/busca/route.ts:72](/c:/Users/AdministradorCF5/Documents/lpdados/app/api/busca/route.ts:72)

### Tipos compartilhados

Arquivo principal:

- [types/bi-platform.ts](/c:/Users/AdministradorCF5/Documents/lpdados/types/bi-platform.ts)

Pontos atuais relevantes:

- base comum de campos em [types/bi-platform.ts:12](/c:/Users/AdministradorCF5/Documents/lpdados/types/bi-platform.ts:12)
- contratos atuais de itens e busca em [types/bi-platform.ts:23](/c:/Users/AdministradorCF5/Documents/lpdados/types/bi-platform.ts:23) e [types/bi-platform.ts:101](/c:/Users/AdministradorCF5/Documents/lpdados/types/bi-platform.ts:101)

### Admin

Arquivo principal:

- [app/admin/page.tsx](/c:/Users/AdministradorCF5/Documents/lpdados/app/admin/page.tsx)

Pontos atuais relevantes:

- secoes admin em [app/admin/page.tsx:18](/c:/Users/AdministradorCF5/Documents/lpdados/app/admin/page.tsx:18)

---

## 4. Checklist Tecnico por Frente

## 4.1 Navegacao e CTAs

### Objetivo

Remover dependencia de navegacao hardcoded para facilitar a entrada de novos modulos.

### Tarefas

- Definir um inventario unico de modulos publicos e administrativos
- Definir labels publicos e internos
- Definir onde `Nova solicitacao` aparece
- Definir rota publica futura para abertura de solicitacao
- Definir se `Saude dos Dados` entra como aba, bloco da home do portal ou ambos
- Padronizar breadcrumbs para novos modulos

### Decisoes que precisam sair desta frente

- label final: `Nova solicitacao`
- rota futura sugerida: `/solicitacoes/nova` ou equivalente
- nome administrativo: `Demandas`
- nome do bloco operacional: `Saude dos Dados`

### Saida esperada

- documento ou configuracao unica de navegacao
- matriz de CTAs por tela

---

## 4.2 Home principal

### Objetivo

Preparar a landing para virar ponto de entrada do novo fluxo sem comprometer a proposta institucional atual.

### Tarefas

- Reservar posicao para novo CTA principal ou secundario de `Nova solicitacao`
- Validar impacto visual do CTA em relacao a `Entrar no Portal`
- Definir se `Nova solicitacao` entra no hero ou em um bloco de acoes rapidas
- Definir se o CTA deve aparecer tambem no rodape

### Recomendacao

- manter `Entrar no Portal` como CTA principal
- inserir `Nova solicitacao` como CTA secundario de alta visibilidade

### Saida esperada

- decisao de posicionamento do CTA na home

---

## 4.3 Portal principal

### Objetivo

Preparar a pagina principal para crescer alem das 5 abas atuais.

### Tarefas

- mapear o que hoje esta preso a `grid-cols-5`
- decidir se novos modulos entram como tabs, cards de destaque ou secoes independentes
- extrair metadados das abas para estrutura reutilizavel
- definir se `Nova solicitacao` deve ser CTA permanente no header do portal
- definir se `Saude dos Dados` entra primeiro como widget antes de virar aba

### Recomendacao

- `Nova solicitacao` como CTA de destaque fora da grade de tabs
- `Saude dos Dados` iniciar como widget ou bloco resumido
- `Demandas` entrar como modulo proprio apenas quando a fase 3 estiver pronta

### Saida esperada

- diretriz de expansao do portal sem reescrita completa

---

## 4.4 Central de Ajuda

### Objetivo

Preparar a ajuda para o refactor da fase seguinte com conteudo orientado a intencao.

### Tarefas

- separar conteudo publico de conteudo admin
- definir intents principais
- definir FAQ por categorias
- definir em qual ponto `Nova solicitacao` entra no fluxo da ajuda

### Intents iniciais recomendadas

- ver dashboards
- encontrar documentacao
- entender dados e atualizacoes
- abrir `Nova solicitacao`
- acessar area admin

### Saida esperada

- estrutura de conteudo para o redesign da fase 1

---

## 4.5 Tipos e contratos

### Objetivo

Preparar a camada de tipos para evolucao por dominio, sem misturar novos objetos com os itens ja existentes.

### Tarefas

- definir `Demanda`
- definir `StatusDemanda`
- definir `PrioridadeDemanda`
- definir `TabelaStatus`
- definir `StatusTabela`
- revisar `ResultadoBusca` para suportar novos tipos sem acoplamento excessivo

### Recomendacao

- manter `Projeto`, `Dashboard`, `Documentacao`, `Ferramenta` e `Pesquisa` como vitrine de conteudo
- tratar `Demanda` e `TabelaStatus` como entidades operacionais separadas

### Saida esperada

- desenho dos novos contratos TypeScript

---

## 4.6 Busca global

### Objetivo

Evitar que a busca atual se torne lenta e inconsistente ao receber novas entidades.

### Tarefas

- revisar a estrategia atual de consultas
- decidir quais entidades entram na busca global e em que momento
- definir se resultados devem priorizar paginas internas em vez de links externos
- preparar o contrato de resultado para novos tipos
- definir limite e ranking de resultados por tipo

### Problemas atuais que a fase 0 precisa registrar

- consulta ampla em varias tabelas
- filtro e score em memoria
- pouca distincao entre navegar para pagina interna e abrir link externo

### Recomendacao

- primeiro redesenhar o contrato da busca
- depois decidir expansao de indexacao
- nao incluir `Demandas` na busca publica antes de definir regra de privacidade e exibicao

### Saida esperada

- diretriz tecnica para revisao da busca antes da fase 3

---

## 4.7 Admin

### Objetivo

Preparar o admin para receber os novos dominios sem ampliar a duplicacao de logica.

### Tarefas

- definir a futura secao `Gestao de demandas`
- definir a futura secao `Saude dos Dados`
- mapear o padrao de CRUD ja utilizado
- registrar pontos onde ha sobreposicao entre APIs admin e rotas publicas

### Recomendacao

- manter uma entrada por dominio no admin
- evitar criar novas rotas copiando o padrao atual sem consolidacao minima

### Saida esperada

- mapa de crescimento do admin

---

## 5. Ordem Interna Recomendada da Fase 0

1. Mapear navegacao atual e CTAs
2. Definir nomes e rotas-alvo futuras
3. Definir estrategia de expansao do portal
4. Preparar contratos TypeScript
5. Revisar estrategia da busca global
6. Fechar desenho de crescimento do admin
7. Consolidar checklist da fase 1, fase 2 e fase 3

---

## 6. Critérios de Conclusao da Fase 0

A Fase 0 pode ser considerada concluida quando:

- existir decisao formal sobre o CTA `Nova solicitacao`
- existir rota-alvo definida para o fluxo publico futuro
- existir desenho claro de como o portal vai crescer
- os novos tipos estiverem especificados
- a busca global tiver estrategia revisada
- o admin tiver caminho definido para novos dominios
- o inicio da fase 1 puder acontecer sem incerteza estrutural

---

## 7. Proxima Entrega apos a Fase 0

Assim que esta fase estiver fechada, a proxima entrega recomendada e:

- refatorar a `Central de Ajuda`

Motivo:

- alto impacto para o usuario
- baixo risco tecnico
- ja permite inserir o CTA `Nova solicitacao`
- prepara o usuario para as fases seguintes
