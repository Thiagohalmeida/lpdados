-- ============================================
-- VIEWS PADRONIZADAS PARA PLATAFORMA DE BI
-- Execute estes comandos no BigQuery Console
-- ============================================

-- 1. VIEW PARA PROJETOS
-- Padroniza nomenclatura e adiciona campos úteis
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  GENERATE_UUID() as id,
  CAST(nome AS STRING) as nome,
  CAST(COALESCE(descricao, '') AS STRING) as descricao,
  LOWER(TRIM(CAST(COALESCE(status, 'standby') AS STRING))) as status,
  CAST(COALESCE(data, '') AS STRING) as data,
  CAST(link AS STRING) as link,
  CAST(docs AS STRING) as docs,
  CAST(COALESCE(area, 'Geral') AS STRING) as area,
  COALESCE(tecnologias, []) as tecnologias,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.projeto`;

-- 2. VIEW PARA DASHBOARDS
-- Padroniza nomenclatura
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.dashboards_v1` AS
SELECT 
  GENERATE_UUID() as id,
  Nome as nome,
  COALESCE(Descricao, '') as descricao,
  Link as link,
  COALESCE(Area, 'Geral') as area,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.dashboard`;

-- 3. VIEW PARA DOCUMENTAÇÃO
-- Padroniza nomenclatura
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.docs_v1` AS
SELECT 
  GENERATE_UUID() as id,
  CAST(Processo AS STRING) as nome,
  CAST(COALESCE(Descricao, '') AS STRING) as descricao,
  CAST(Link AS STRING) as link,
  CAST(COALESCE(Area, 'Geral') AS STRING) as area,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.docs`;

-- 4. VIEW PARA FERRAMENTAS
-- Padroniza nomenclatura
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.ferramentas_v1` AS
SELECT 
  GENERATE_UUID() as id,
  Nome as nome,
  COALESCE(Descricao, '') as descricao,
  Link as link,
  ProxAtualizacao as proxima_atualizacao,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.ferramentas`;

-- 5. VIEW PARA PESQUISAS
-- Padroniza nomenclatura
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.pesquisas_v1` AS
SELECT 
  GENERATE_UUID() as id,
  Titulo as titulo,
  fonte,
  link,
  data,
  conteudo,
  tema,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.pesquisas`;

-- ============================================
-- VERIFICAÇÃO (Execute após criar as views)
-- ============================================

-- Testar view de projetos
SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 5;

-- Testar view de dashboards
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 5;

-- Testar view de docs
SELECT * FROM `worlddata-439415.lpdados.docs_v1` LIMIT 5;

-- Testar view de ferramentas
SELECT * FROM `worlddata-439415.lpdados.ferramentas_v1` LIMIT 5;

-- Testar view de pesquisas
SELECT * FROM `worlddata-439415.lpdados.pesquisas_v1` LIMIT 5;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. GENERATE_UUID() cria IDs únicos para cada linha
-- 2. COALESCE() garante que sempre há um valor (fallback)
-- 3. LOWER(TRIM()) padroniza o status para comparações
-- 4. Views são atualizadas automaticamente quando as tabelas base mudam
-- 5. Não há custo adicional de storage para views
