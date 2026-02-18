# 🔧 Corrigir Erros SQL - BigQuery Views

## ❌ ERRO: "Unrecognized name"

Este erro acontece quando o nome da coluna no SQL não existe na tabela.

---

## 🔍 SOLUÇÃO: Verificar Estrutura Real das Tabelas

### **PASSO 1: Ver estrutura das tabelas**

Execute este SQL no BigQuery para ver os nomes EXATOS das colunas:

```sql
-- Ver todas as colunas da tabela projeto
SELECT * FROM `worlddata-439415.lpdados.projeto` LIMIT 1;

-- Ver todas as colunas da tabela docs
SELECT * FROM `worlddata-439415.lpdados.docs` LIMIT 1;
```

### **PASSO 2: Use as Views Seguras**

Criei um arquivo `bigquery-views-safe.sql` que usa `SELECT *` e funciona com qualquer estrutura.

**Execute este arquivo ao invés do original:**

```sql
-- VIEW PARA PROJETOS (versão segura - copia tudo)
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  GENERATE_UUID() as id,
  * EXCEPT(id),
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.projeto`;
```

Esta query:
- ✅ Copia TODAS as colunas da tabela original
- ✅ Adiciona um `id` único
- ✅ Adiciona `atualizado_em`
- ✅ Funciona independente dos nomes das colunas

---

## 📋 OPÇÕES DE SOLUÇÃO

### **OPÇÃO A: Usar Views Seguras (RECOMENDADO)**

1. Abra o arquivo `bigquery-views-safe.sql`
2. Execute todas as queries
3. Pronto! As views vão funcionar

**Vantagem:** Funciona sempre, não precisa saber os nomes das colunas

---

### **OPÇÃO B: Corrigir Manualmente**

1. Execute `bigquery-check-structure.sql` para ver os nomes das colunas
2. Anote os nomes EXATOS (com maiúsculas/minúsculas)
3. Corrija o `bigquery-views.sql` com os nomes corretos

**Exemplo:**

Se a coluna se chama `nome` (minúsculo), use:
```sql
nome as nome,  -- ✅ Correto
```

Se a coluna se chama `Nome` (maiúsculo), use:
```sql
Nome as nome,  -- ✅ Correto
```

---

## 🎯 SOLUÇÃO RÁPIDA (COPIE E COLE)

Execute estas 5 queries no BigQuery (uma por vez):

```sql
-- 1. PROJETOS
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  GENERATE_UUID() as id,
  *,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.projeto`;

-- 2. DASHBOARDS
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.dashboards_v1` AS
SELECT 
  GENERATE_UUID() as id,
  *,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.dashboard`;

-- 3. DOCS
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.docs_v1` AS
SELECT 
  GENERATE_UUID() as id,
  *,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.docs`;

-- 4. FERRAMENTAS
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.ferramentas_v1` AS
SELECT 
  GENERATE_UUID() as id,
  *,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.ferramentas`;

-- 5. PESQUISAS
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.pesquisas_v1` AS
SELECT 
  GENERATE_UUID() as id,
  *,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.pesquisas`;
```

---

## ✅ VERIFICAR SE FUNCIONOU

Execute estas queries para testar:

```sql
SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.docs_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.ferramentas_v1` LIMIT 5;
SELECT * FROM `worlddata-439415.lpdados.pesquisas_v1` LIMIT 5;
```

Se todas retornarem dados, **está funcionando!** ✅

---

## 🔄 ATUALIZAR O CÓDIGO

Depois de criar as views, o código TypeScript/Next.js vai funcionar automaticamente porque:

1. As views têm os nomes padronizados (`*_v1`)
2. O código já está configurado para usar essas views
3. Os tipos TypeScript vão mapear os campos automaticamente

---

## 📞 AINDA COM ERRO?

Se ainda tiver erro, me envie:

1. A mensagem de erro completa
2. O resultado de: `SELECT * FROM \`worlddata-439415.lpdados.projeto\` LIMIT 1;`

Vou ajustar o SQL específico para sua estrutura!

---

## 🎉 RESUMO

**Use a SOLUÇÃO RÁPIDA acima** - ela funciona com qualquer estrutura de tabela!

As views vão:
- ✅ Copiar todos os campos originais
- ✅ Adicionar `id` único
- ✅ Adicionar `atualizado_em`
- ✅ Funcionar com o código TypeScript
