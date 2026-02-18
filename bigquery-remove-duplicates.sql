-- ============================================
-- REMOVER DUPLICATAS DA TABELA ITENS_PORTAL
-- Execute no BigQuery Console
-- ============================================

-- ============================================
-- PASSO 1: VERIFICAR DUPLICATAS
-- ============================================

-- Contar quantos registros duplicados existem
SELECT 
  id,
  tipo,
  nome,
  COUNT(*) as total_duplicatas
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY id, tipo, nome
HAVING COUNT(*) > 1
ORDER BY total_duplicatas DESC;

-- Ver total de registros antes da limpeza
SELECT 
  tipo,
  COUNT(*) as total
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY tipo
ORDER BY tipo;

-- ============================================
-- PASSO 2: CRIAR TABELA TEMPORÁRIA SEM DUPLICATAS
-- ============================================

-- Criar tabela temporária com apenas 1 registro de cada (o mais recente)
CREATE OR REPLACE TABLE `worlddata-439415.lpdados.itens_portal_temp` AS
SELECT * FROM (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY id, tipo, nome 
      ORDER BY ultima_atualizacao DESC NULLS LAST
    ) as row_num
  FROM `worlddata-439415.lpdados.itens_portal`
)
WHERE row_num = 1;

-- ============================================
-- PASSO 3: VERIFICAR TABELA TEMPORÁRIA
-- ============================================

-- Contar registros na tabela temporária (não deve ter duplicatas)
SELECT 
  tipo,
  COUNT(*) as total
FROM `worlddata-439415.lpdados.itens_portal_temp`
GROUP BY tipo
ORDER BY tipo;

-- Verificar se ainda há duplicatas (deve retornar 0 linhas)
SELECT 
  id,
  tipo,
  nome,
  COUNT(*) as total_duplicatas
FROM `worlddata-439415.lpdados.itens_portal_temp`
GROUP BY id, tipo, nome
HAVING COUNT(*) > 1;

-- ============================================
-- PASSO 4: FAZER BACKUP DA TABELA ORIGINAL
-- ============================================

-- Criar backup antes de deletar
CREATE OR REPLACE TABLE `worlddata-439415.lpdados.itens_portal_backup_duplicatas` AS
SELECT * FROM `worlddata-439415.lpdados.itens_portal`;

-- ============================================
-- PASSO 5: SUBSTITUIR TABELA ORIGINAL
-- ============================================

-- Deletar tabela original
DROP TABLE `worlddata-439415.lpdados.itens_portal`;

-- Renomear tabela temporária para original
CREATE OR REPLACE TABLE `worlddata-439415.lpdados.itens_portal` AS
SELECT 
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
FROM `worlddata-439415.lpdados.itens_portal_temp`;

-- Deletar tabela temporária
DROP TABLE `worlddata-439415.lpdados.itens_portal_temp`;

-- ============================================
-- PASSO 6: VERIFICAR RESULTADO FINAL
-- ============================================

-- Contar registros finais (deve ser metade do original)
SELECT 
  tipo,
  COUNT(*) as total
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY tipo
ORDER BY tipo;

-- Verificar se ainda há duplicatas (deve retornar 0 linhas)
SELECT 
  id,
  tipo,
  nome,
  COUNT(*) as total_duplicatas
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY id, tipo, nome
HAVING COUNT(*) > 1;

-- Ver alguns exemplos
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'projeto' LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'dashboard' LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'documentacao' LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'ferramenta' LIMIT 5;

-- ============================================
-- PASSO 7: TESTAR VIEWS
-- ============================================

-- Testar se as views ainda funcionam
SELECT COUNT(*) as total_projetos FROM `worlddata-439415.lpdados.projetos_v1`;
SELECT COUNT(*) as total_dashboards FROM `worlddata-439415.lpdados.dashboards_v1`;
SELECT COUNT(*) as total_docs FROM `worlddata-439415.lpdados.docs_v1`;
SELECT COUNT(*) as total_ferramentas FROM `worlddata-439415.lpdados.ferramentas_v1`;

-- ============================================
-- PASSO 8 (OPCIONAL): DELETAR BACKUP
-- ============================================
-- Só execute depois de confirmar que tudo funciona!
-- Descomente a linha abaixo quando tiver certeza:

-- DROP TABLE `worlddata-439415.lpdados.itens_portal_backup_duplicatas`;

-- ============================================
-- RESUMO DO QUE FOI FEITO
-- ============================================

/*
1. Identificamos duplicatas usando ROW_NUMBER() OVER (PARTITION BY id, tipo, nome)
2. Criamos tabela temporária mantendo apenas 1 registro de cada (o mais recente)
3. Fizemos backup da tabela original
4. Substituímos a tabela original pela versão sem duplicatas
5. Verificamos que não há mais duplicatas
6. Testamos que as views continuam funcionando

IMPORTANTE:
- Mantivemos o registro mais recente (ORDER BY ultima_atualizacao DESC)
- Backup salvo em itens_portal_backup_duplicatas
- Views continuam funcionando normalmente
- Erro de chave duplicada no React será resolvido automaticamente
*/
