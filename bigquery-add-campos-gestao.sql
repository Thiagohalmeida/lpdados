-- ============================================
-- ADICIONAR NOVOS CAMPOS DE GESTÃO
-- ============================================
-- Execute este SQL no BigQuery para adicionar os campos de gestão
-- em todas as tabelas da plataforma BI

-- PROJETOS
ALTER TABLE `worlddata-439415.lpdados.projeto`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- DASHBOARDS
ALTER TABLE `worlddata-439415.lpdados.dashboard`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- DOCS
ALTER TABLE `worlddata-439415.lpdados.docs`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- FERRAMENTAS
ALTER TABLE `worlddata-439415.lpdados.ferramentas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- PESQUISAS
ALTER TABLE `worlddata-439415.lpdados.pesquisas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;

-- ============================================
-- NOTAS:
-- ============================================
-- 1. data_inicio: Data de início do projeto/dashboard/doc/ferramenta/pesquisa
-- 2. ultima_atualizacao: Timestamp da última atualização
-- 3. responsavel: Valores esperados: "Thiago" ou "Leandro"
-- 4. cliente: Valores esperados: "Interno" ou "Externo"
-- 5. observacao: Campo de texto livre para observações gerais
--
-- Após executar este SQL, as views (*_v1) automaticamente incluirão
-- os novos campos, pois usam SELECT *
