-- ============================================
-- VIEWS SIMPLES - SEM ERROS
-- Execute estas queries no BigQuery Console
-- ============================================

-- View de Projetos (copia tudo da tabela original)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT * FROM `worlddata-439415.lpdados.projeto`;

-- View de Dashboards (copia tudo da tabela original)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.dashboards_v1` AS
SELECT * FROM `worlddata-439415.lpdados.dashboard`;

-- View de Docs (copia tudo da tabela original)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.docs_v1` AS
SELECT * FROM `worlddata-439415.lpdados.docs`;

-- View de Ferramentas (copia tudo da tabela original)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.ferramentas_v1` AS
SELECT * FROM `worlddata-439415.lpdados.ferramentas`;

-- View de Pesquisas (copia tudo da tabela original)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.pesquisas_v1` AS
SELECT * FROM `worlddata-439415.lpdados.pesquisas`;

-- ============================================
-- VERIFICAR SE FUNCIONOU
-- ============================================

-- Testar cada view
SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.docs_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.ferramentas_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.pesquisas_v1` LIMIT 3;
