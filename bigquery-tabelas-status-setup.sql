-- ============================================
-- SETUP DA TABELA DE SAUDE DOS DADOS
-- Execute no BigQuery Console
-- ============================================

CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.tabelas_status` (
  id STRING NOT NULL,
  dataset_name STRING NOT NULL,
  table_name STRING NOT NULL,
  nome_tabela STRING NOT NULL,
  descricao STRING,
  proxima_atualizacao STRING,
  status STRING NOT NULL,
  impacto STRING,
  responsavel STRING,
  fonte STRING,
  observacao STRING,
  ativo_portal BOOL NOT NULL
);

ALTER TABLE `worlddata-439415.lpdados.tabelas_status`
ADD COLUMN IF NOT EXISTS dataset_name STRING;

ALTER TABLE `worlddata-439415.lpdados.tabelas_status`
ADD COLUMN IF NOT EXISTS table_name STRING;

ALTER TABLE `worlddata-439415.lpdados.tabelas_status`
ADD COLUMN IF NOT EXISTS impacto STRING;

ALTER TABLE `worlddata-439415.lpdados.tabelas_status`
ADD COLUMN IF NOT EXISTS ativo_portal BOOL;

-- Consulta rapida de verificacao
SELECT
  id,
  dataset_name,
  table_name,
  nome_tabela,
  status,
  impacto,
  ativo_portal,
  proxima_atualizacao
FROM `worlddata-439415.lpdados.tabelas_status`
ORDER BY nome_tabela ASC
LIMIT 20;
