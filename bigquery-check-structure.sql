-- ============================================
-- VERIFICAR ESTRUTURA DAS TABELAS
-- Execute estas queries PRIMEIRO para ver os nomes das colunas
-- ============================================

-- 1. Ver estrutura da tabela PROJETO
SELECT column_name, data_type 
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'projeto'
ORDER BY ordinal_position;

-- 2. Ver estrutura da tabela DASHBOARD
SELECT column_name, data_type 
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'dashboard'
ORDER BY ordinal_position;

-- 3. Ver estrutura da tabela DOCS
SELECT column_name, data_type 
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'docs'
ORDER BY ordinal_position;

-- 4. Ver estrutura da tabela FERRAMENTAS
SELECT column_name, data_type 
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'ferramentas'
ORDER BY ordinal_position;

-- 5. Ver estrutura da tabela PESQUISAS
SELECT column_name, data_type 
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'pesquisas'
ORDER BY ordinal_position;

-- ============================================
-- OU use estas queries mais simples:
-- ============================================

-- Ver dados de exemplo de cada tabela
SELECT * FROM `worlddata-439415.lpdados.projeto` LIMIT 1;
SELECT * FROM `worlddata-439415.lpdados.dashboard` LIMIT 1;
SELECT * FROM `worlddata-439415.lpdados.docs` LIMIT 1;
SELECT * FROM `worlddata-439415.lpdados.ferramentas` LIMIT 1;
SELECT * FROM `worlddata-439415.lpdados.pesquisas` LIMIT 1;
