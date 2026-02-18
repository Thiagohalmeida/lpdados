-- Query para verificar as colunas reais de cada tabela

-- 1. Verificar colunas da tabela docs
SELECT column_name, data_type
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'docs'
ORDER BY ordinal_position;

-- 2. Verificar colunas da tabela dashboard
SELECT column_name, data_type
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'dashboard'
ORDER BY ordinal_position;

-- 3. Verificar colunas da tabela projeto
SELECT column_name, data_type
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'projeto'
ORDER BY ordinal_position;

-- 4. Verificar colunas da tabela ferramentas
SELECT column_name, data_type
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'ferramentas'
ORDER BY ordinal_position;

-- 5. Verificar colunas da tabela pesquisas
SELECT column_name, data_type
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'pesquisas'
ORDER BY ordinal_position;
