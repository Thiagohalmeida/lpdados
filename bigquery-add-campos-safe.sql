-- SQL SEGURO: Adiciona campos de gestão apenas se não existirem
-- Execute este SQL no BigQuery Console

-- 1. PROJETO - Adicionar campos de gestão
-- Primeiro, verificar se as colunas já existem
-- Se der erro "Column already exists", ignore e continue

ALTER TABLE `worlddata-439415.lpdados.projeto`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- 2. DASHBOARD - Adicionar campos de gestão
ALTER TABLE `worlddata-439415.lpdados.dashboard`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- 3. DOCS - Adicionar campos de gestão
ALTER TABLE `worlddata-439415.lpdados.docs`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- 4. FERRAMENTAS - Adicionar campos de gestão
ALTER TABLE `worlddata-439415.lpdados.ferramentas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- 5. PESQUISAS - Adicionar campos de gestão
ALTER TABLE `worlddata-439415.lpdados.pesquisas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- VERIFICAÇÃO: Conferir se as colunas foram criadas
SELECT 'projeto' as tabela, column_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'projeto' AND column_name IN ('data_inicio', 'ultima_atualizacao', 'responsavel', 'cliente', 'observacao')
UNION ALL
SELECT 'dashboard' as tabela, column_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'dashboard' AND column_name IN ('data_inicio', 'ultima_atualizacao', 'responsavel', 'cliente', 'observacao')
UNION ALL
SELECT 'docs' as tabela, column_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'docs' AND column_name IN ('data_inicio', 'ultima_atualizacao', 'responsavel', 'cliente', 'observacao')
UNION ALL
SELECT 'ferramentas' as tabela, column_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'ferramentas' AND column_name IN ('data_inicio', 'ultima_atualizacao', 'responsavel', 'cliente', 'observacao')
UNION ALL
SELECT 'pesquisas' as tabela, column_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'pesquisas' AND column_name IN ('data_inicio', 'ultima_atualizacao', 'responsavel', 'cliente', 'observacao')
ORDER BY tabela, column_name;
