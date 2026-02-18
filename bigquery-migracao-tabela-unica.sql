-- ============================================
-- MIGRAÇÃO PARA TABELA ÚNICA
-- Execute no BigQuery Console
-- ============================================

-- ============================================
-- PASSO 1: CRIAR NOVA TABELA UNIFICADA
-- ============================================

CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.itens_portal` (
  -- Identificação
  id STRING NOT NULL,
  tipo STRING NOT NULL,  -- 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta'
  
  -- Campos Comuns
  nome STRING,
  descricao STRING,
  link STRING,
  area STRING,
  
  -- Campos Específicos (nullable)
  status STRING,                    -- Apenas projetos
  proxima_atualizacao STRING,       -- Apenas ferramentas
  tecnologias ARRAY<STRING>,        -- Apenas projetos
  
  -- Campos de Gestão
  data_inicio DATE,
  ultima_atualizacao TIMESTAMP,
  responsavel STRING,
  cliente STRING,
  observacao STRING
);

-- ============================================
-- PASSO 2: MIGRAR PROJETOS
-- ============================================

INSERT INTO `worlddata-439415.lpdados.itens_portal` (
  id,
  tipo,
  nome,
  descricao,
  link,
  area,
  status,
  proxima_atualizacao,
  tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
)
SELECT 
  COALESCE(id, GENERATE_UUID()) as id,
  'projeto' as tipo,
  projeto as nome,
  COALESCE(descricao, '') as descricao,
  COALESCE(link, '') as link,
  COALESCE(area, 'Geral') as area,
  COALESCE(status, 'Em Desenvolvimento') as status,
  NULL as proxima_atualizacao,
  ARRAY<STRING>[] as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.projeto`;

-- ============================================
-- PASSO 3: MIGRAR DASHBOARDS
-- ============================================

INSERT INTO `worlddata-439415.lpdados.itens_portal` (
  id,
  tipo,
  nome,
  descricao,
  link,
  area,
  status,
  proxima_atualizacao,
  tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
)
SELECT 
  COALESCE(id, GENERATE_UUID()) as id,
  'dashboard' as tipo,
  nome,
  COALESCE(descricao, '') as descricao,
  COALESCE(link, '') as link,
  COALESCE(area, 'Geral') as area,
  NULL as status,
  NULL as proxima_atualizacao,
  NULL as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.dashboard`;

-- ============================================
-- PASSO 4: MIGRAR DOCUMENTAÇÃO
-- ============================================

INSERT INTO `worlddata-439415.lpdados.itens_portal` (
  id,
  tipo,
  nome,
  descricao,
  link,
  area,
  status,
  proxima_atualizacao,
  tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
)
SELECT 
  COALESCE(id, GENERATE_UUID()) as id,
  'documentacao' as tipo,
  Processo as nome,
  '' as descricao,
  COALESCE(Link, '') as link,
  COALESCE(Area, 'Geral') as area,
  NULL as status,
  NULL as proxima_atualizacao,
  NULL as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.docs`;

-- ============================================
-- PASSO 5: MIGRAR FERRAMENTAS
-- ============================================

INSERT INTO `worlddata-439415.lpdados.itens_portal` (
  id,
  tipo,
  nome,
  descricao,
  link,
  area,
  status,
  proxima_atualizacao,
  tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
)
SELECT 
  COALESCE(id, GENERATE_UUID()) as id,
  'ferramenta' as tipo,
  nome,
  COALESCE(descricao, '') as descricao,
  COALESCE(link, '') as link,
  COALESCE(area, 'Geral') as area,
  NULL as status,
  proxatualizacao as proxima_atualizacao,  -- CORRIGIDO: nome correto da coluna
  NULL as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.ferramentas`;

-- ============================================
-- PASSO 6: VERIFICAR MIGRAÇÃO
-- ============================================

-- Contar registros por tipo
SELECT 
  tipo,
  COUNT(*) as total
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY tipo
ORDER BY tipo;

-- Ver exemplos de cada tipo
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'projeto' LIMIT 2;
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'dashboard' LIMIT 2;
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'documentacao' LIMIT 2;
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'ferramenta' LIMIT 2;

-- ============================================
-- PASSO 7: CRIAR VIEW PARA COMPATIBILIDADE
-- ============================================

-- View de projetos (para manter compatibilidade)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  id,
  nome as projeto,
  descricao,
  status,
  link,
  area,
  tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.itens_portal`
WHERE tipo = 'projeto';

-- View de dashboards
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.dashboards_v1` AS
SELECT 
  id,
  nome,
  descricao,
  link,
  area,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.itens_portal`
WHERE tipo = 'dashboard';

-- View de docs
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.docs_v1` AS
SELECT 
  id,
  nome as Processo,
  link as Link,
  area as Area,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.itens_portal`
WHERE tipo = 'documentacao';

-- View de ferramentas
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.ferramentas_v1` AS
SELECT 
  id,
  nome,
  descricao,
  link,
  proxima_atualizacao,
  area,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.itens_portal`
WHERE tipo = 'ferramenta';

-- ============================================
-- PASSO 8: TESTAR VIEWS
-- ============================================

SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.docs_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.ferramentas_v1` LIMIT 3;

-- ============================================
-- PASSO 9 (OPCIONAL): BACKUP TABELAS ANTIGAS
-- ============================================

-- Criar cópias de backup antes de deletar
CREATE TABLE `worlddata-439415.lpdados.projeto_backup` AS
SELECT * FROM `worlddata-439415.lpdados.projeto`;

CREATE TABLE `worlddata-439415.lpdados.dashboard_backup` AS
SELECT * FROM `worlddata-439415.lpdados.dashboard`;

CREATE TABLE `worlddata-439415.lpdados.docs_backup` AS
SELECT * FROM `worlddata-439415.lpdados.docs`;

CREATE TABLE `worlddata-439415.lpdados.ferramentas_backup` AS
SELECT * FROM `worlddata-439415.lpdados.ferramentas`;

-- ============================================
-- PASSO 10 (CUIDADO!): DELETAR TABELAS ANTIGAS
-- ============================================
-- ATENÇÃO: Só execute depois de confirmar que tudo funciona!
-- Descomente as linhas abaixo quando tiver certeza:

-- DROP TABLE `worlddata-439415.lpdados.projeto`;
-- DROP TABLE `worlddata-439415.lpdados.dashboard`;
-- DROP TABLE `worlddata-439415.lpdados.docs`;
-- DROP TABLE `worlddata-439415.lpdados.ferramentas`;
