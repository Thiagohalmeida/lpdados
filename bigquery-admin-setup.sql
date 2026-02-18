-- ============================================
-- SETUP DO PAINEL ADMINISTRATIVO
-- Execute estas queries no BigQuery Console
-- ============================================

-- PASSO 1: Adicionar coluna 'id' em todas as tabelas
-- ============================================

ALTER TABLE `worlddata-439415.lpdados.projeto`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.dashboard`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.docs`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.ferramentas`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.pesquisas`
ADD COLUMN IF NOT EXISTS id STRING;


-- PASSO 2: Preencher IDs para registros existentes
-- ============================================

UPDATE `worlddata-439415.lpdados.projeto`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.dashboard`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.docs`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.ferramentas`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.pesquisas`
SET id = GENERATE_UUID()
WHERE id IS NULL;


-- PASSO 3: Atualizar as views para incluir o id real
-- ============================================
-- IMPORTANTE: Estas views mantêm TODOS os campos originais

CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT * FROM `worlddata-439415.lpdados.projeto`;

CREATE OR REPLACE VIEW `worlddata-439415.lpdados.dashboards_v1` AS
SELECT * FROM `worlddata-439415.lpdados.dashboard`;

CREATE OR REPLACE VIEW `worlddata-439415.lpdados.docs_v1` AS
SELECT * FROM `worlddata-439415.lpdados.docs`;

CREATE OR REPLACE VIEW `worlddata-439415.lpdados.ferramentas_v1` AS
SELECT * FROM `worlddata-439415.lpdados.ferramentas`;

CREATE OR REPLACE VIEW `worlddata-439415.lpdados.pesquisas_v1` AS
SELECT * FROM `worlddata-439415.lpdados.pesquisas`;


-- PASSO 4: Verificar se tudo está correto
-- ============================================

-- Verificar se todos os registros têm ID
SELECT 'projeto' as tabela, COUNT(*) as total, COUNT(id) as com_id
FROM `worlddata-439415.lpdados.projeto`
UNION ALL
SELECT 'dashboard', COUNT(*), COUNT(id)
FROM `worlddata-439415.lpdados.dashboard`
UNION ALL
SELECT 'docs', COUNT(*), COUNT(id)
FROM `worlddata-439415.lpdados.docs`
UNION ALL
SELECT 'ferramentas', COUNT(*), COUNT(id)
FROM `worlddata-439415.lpdados.ferramentas`
UNION ALL
SELECT 'pesquisas', COUNT(*), COUNT(id)
FROM `worlddata-439415.lpdados.pesquisas`;

-- Verificar as views
SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.docs_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.ferramentas_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.pesquisas_v1` LIMIT 5;


-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Execute os comandos na ordem apresentada
-- 2. Aguarde cada comando terminar antes de executar o próximo
-- 3. Verifique se não há erros após cada comando
-- 4. Os IDs gerados são únicos e permanentes
-- 5. Novos registros precisarão ter ID gerado automaticamente

-- ============================================
-- PRÓXIMOS PASSOS
-- ============================================

-- Após executar este script:
-- 1. Configure a senha admin no Vercel (ADMIN_PASSWORD)
-- 2. Acesse /admin no seu site
-- 3. Teste criar, editar e excluir itens
-- 4. Verifique se as mudanças aparecem no site principal
