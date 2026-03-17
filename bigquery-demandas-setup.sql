-- ============================================
-- SETUP DA TABELA DE DEMANDAS
-- Execute no BigQuery Console
-- ============================================

CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.demandas` (
  id STRING NOT NULL,
  titulo STRING NOT NULL,
  descricao STRING NOT NULL,
  area STRING NOT NULL,
  solicitante STRING NOT NULL,
  email STRING,
  tipo STRING,
  prioridade STRING NOT NULL,
  status STRING NOT NULL,
  projeto_id STRING,
  data_abertura TIMESTAMP NOT NULL,
  data_atualizacao TIMESTAMP NOT NULL,
  observacao STRING
);

-- Consulta rapida de verificacao
SELECT
  id,
  titulo,
  area,
  prioridade,
  status,
  data_abertura,
  data_atualizacao
FROM `worlddata-439415.lpdados.demandas`
ORDER BY data_atualizacao DESC
LIMIT 20;
