-- ============================================
-- VIEWS PADRONIZADAS - VERSÃO SEGURA
-- Use estas queries se as outras derem erro
-- ============================================

-- 1. VIEW PARA PROJETOS (versão segura)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  GENERATE_UUID() as id,
  * EXCEPT(id),
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.projeto`;

-- 2. VIEW PARA DASHBOARDS (versão segura)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.dashboards_v1` AS
SELECT 
  GENERATE_UUID() as id,
  Nome as nome,
  COALESCE(CAST(Descricao AS STRING), '') as descricao,
  CAST(Link AS STRING) as link,
  COALESCE(CAST(Area AS STRING), 'Geral') as area,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.dashboard`;

-- 3. VIEW PARA DOCUMENTAÇÃO (versão segura)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.docs_v1` AS
SELECT 
  GENERATE_UUID() as id,
  * EXCEPT(id),
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.docs`;

-- 4. VIEW PARA FERRAMENTAS (versão segura)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.ferramentas_v1` AS
SELECT 
  GENERATE_UUID() as id,
  * EXCEPT(id),
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.ferramentas`;

-- 5. VIEW PARA PESQUISAS (versão segura)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.pesquisas_v1` AS
SELECT 
  GENERATE_UUID() as id,
  * EXCEPT(id),
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.pesquisas`;

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Testar views
SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.docs_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.ferramentas_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.pesquisas_v1` LIMIT 5;
