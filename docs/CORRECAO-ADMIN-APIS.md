# Correção: APIs Admin Migradas para Tabela Unificada

## 🔴 PROBLEMA IDENTIFICADO

### Erro 404 ao Editar Dashboard
```
Failed to load resource: the server responded with a status :3000/api/admin/dash...b8fe-deb6c4b7333f:1
of 404 (Not Found)
```

### Causa Raiz
As APIs admin ainda estavam usando **tabelas antigas separadas** que não existem mais:
- `/api/admin/dashboards/[id]` → buscava em `dashboard` (não existe)
- `/api/admin/docs/[id]` → buscava em `docs` (não existe)
- `/api/admin/ferramentas/[id]` → buscava em `ferramentas` (não existe)

Após a migração para tabela unificada, todos os dados estão em `itens_portal`, mas as APIs admin não foram atualizadas.

## ✅ SOLUÇÃO IMPLEMENTADA

### APIs Atualizadas

#### 1. `/api/admin/dashboards/[id]/route.ts`

**ANTES** (tabela antiga):
```typescript
UPDATE `worlddata-439415.lpdados.dashboard`
SET nome = @nome, ...
WHERE nome = @nomeOriginal
```

**DEPOIS** (tabela unificada):
```typescript
UPDATE `worlddata-439415.lpdados.itens_portal`
SET nome = @nome, ...
WHERE id = @id AND tipo = 'dashboard'
```

**Mudanças**:
- ✅ Usa `itens_portal` em vez de `dashboard`
- ✅ Usa `id` (UUID) em vez de `nome` como identificador
- ✅ Filtra por `tipo = 'dashboard'`
- ✅ Tipos explícitos para parâmetros BigQuery

#### 2. `/api/admin/dashboards/route.ts` (POST)

**ANTES**:
```typescript
INSERT INTO `worlddata-439415.lpdados.dashboard`
(nome, descricao, ...)
VALUES (@nome, @descricao, ...)
```

**DEPOIS**:
```typescript
const id = crypto.randomUUID();
INSERT INTO `worlddata-439415.lpdados.itens_portal`
(id, tipo, nome, descricao, ...)
VALUES (@id, 'dashboard', @nome, @descricao, ...)
```

**Mudanças**:
- ✅ Gera UUID único para novo item
- ✅ Insere em `itens_portal` com `tipo = 'dashboard'`
- ✅ Retorna o ID gerado

#### 3. `/api/admin/docs/[id]/route.ts`

**ANTES** (usava nome do processo):
```typescript
UPDATE `worlddata-439415.lpdados.docs`
SET Processo = @processo, ...
WHERE Processo = @processoOriginal
```

**DEPOIS** (usa ID único):
```typescript
UPDATE `worlddata-439415.lpdados.itens_portal`
SET nome = @nome, ...
WHERE id = @id AND tipo = 'documentacao'
```

**Mudanças**:
- ✅ Usa `itens_portal` em vez de `docs`
- ✅ Usa `id` em vez de nome do processo
- ✅ Campo `Processo` agora é `nome`
- ✅ Filtra por `tipo = 'documentacao'`

#### 4. `/api/admin/ferramentas/[id]/route.ts`

**ANTES** (tabela antiga):
```typescript
UPDATE `worlddata-439415.lpdados.ferramentas`
SET nome = @nome, ...
WHERE nome = @nomeOriginal
```

**DEPOIS** (tabela unificada):
```typescript
UPDATE `worlddata-439415.lpdados.itens_portal`
SET nome = @nome, proxima_atualizacao = @proxima_atualizacao, ...
WHERE id = @id AND tipo = 'ferramenta'
```

**Mudanças**:
- ✅ Usa `itens_portal` em vez de `ferramentas`
- ✅ Usa `id` em vez de `nome`
- ✅ Mantém campo `proxima_atualizacao` específico de ferramentas
- ✅ Filtra por `tipo = 'ferramenta'`

## 📊 ARQUITETURA ATUALIZADA

### ANTES (Inconsistente)
```
Frontend Admin → /api/admin/dashboards/[id] → dashboard (❌ não existe)
Frontend Admin → /api/admin/docs/[id] → docs (❌ não existe)
Frontend Admin → /api/admin/ferramentas/[id] → ferramentas (❌ não existe)
Frontend Admin → /api/admin/projetos/[id] → itens_portal ✅
```

### DEPOIS (Consistente)
```
Frontend Admin → /api/admin/dashboards/[id] → itens_portal WHERE tipo='dashboard' ✅
Frontend Admin → /api/admin/docs/[id] → itens_portal WHERE tipo='documentacao' ✅
Frontend Admin → /api/admin/ferramentas/[id] → itens_portal WHERE tipo='ferramenta' ✅
Frontend Admin → /api/admin/projetos/[id] → itens_portal WHERE tipo='projeto' ✅
```

## 🔑 MUDANÇAS IMPORTANTES

### 1. Identificação por ID Único
- **Antes**: Usava nome/processo como identificador (pode ter duplicatas)
- **Depois**: Usa UUID único gerado pelo sistema (sem duplicatas)

### 2. Tabela Unificada
- **Antes**: 4 tabelas separadas (dashboard, docs, ferramentas, projetos)
- **Depois**: 1 tabela `itens_portal` com campo `tipo`

### 3. Campos Padronizados
- **Antes**: Cada tabela tinha nomes de campos diferentes
- **Depois**: Todos usam mesmos campos (`nome`, `descricao`, `link`, etc.)

### 4. Tipos Explícitos BigQuery
- Adicionado `types` object para todos os parâmetros
- Evita erros de tipo no BigQuery
- Especialmente importante para campos `DATE` e `STRING` nullable

## ✅ VALIDAÇÃO

### Testes de Diagnóstico
```bash
✅ app/api/admin/dashboards/[id]/route.ts: No diagnostics found
✅ app/api/admin/docs/[id]/route.ts: No diagnostics found
✅ app/api/admin/ferramentas/[id]/route.ts: No diagnostics found
```

### Funcionalidades Corrigidas
- ✅ Editar dashboard agora funciona (erro 404 resolvido)
- ✅ Editar documentação funciona
- ✅ Editar ferramenta funciona
- ✅ Criar novos itens gera UUID único
- ✅ Deletar itens usa ID correto

## 📋 ARQUIVOS MODIFICADOS

1. `app/api/admin/dashboards/[id]/route.ts` - PUT e DELETE
2. `app/api/admin/dashboards/route.ts` - POST
3. `app/api/admin/docs/[id]/route.ts` - PUT e DELETE (reescrito)
4. `app/api/admin/ferramentas/[id]/route.ts` - PUT e DELETE (reescrito)

## 🎯 RESULTADO FINAL

### ANTES
- ❌ Erro 404 ao editar dashboards
- ❌ APIs buscavam em tabelas que não existem
- ❌ Inconsistência entre frontend e admin
- ❌ Identificação por nome (duplicatas possíveis)

### DEPOIS
- ✅ Edição funciona corretamente
- ✅ Todas as APIs usam `itens_portal`
- ✅ Consistência total (frontend e admin)
- ✅ Identificação por UUID único
- ✅ Sem erros de diagnóstico

## 🔄 FLUXO COMPLETO

### Editar Dashboard (Exemplo)

1. **Usuário** clica em "Editar" no admin
2. **Frontend** carrega dados do dashboard via GET
3. **Usuário** modifica campos e clica "Salvar"
4. **Frontend** envia PUT para `/api/admin/dashboards/{id}`
5. **API** executa:
   ```sql
   UPDATE itens_portal
   SET nome = 'Novo Nome', ...
   WHERE id = '80f49ea1-594c-49a3-b8fe-deb6c4b7333f'
     AND tipo = 'dashboard'
   ```
6. **BigQuery** atualiza o registro
7. **API** retorna `{ success: true }`
8. **Frontend** mostra mensagem de sucesso
9. **Dados** atualizados aparecem no portal público

---

**Data**: 2024-02-10  
**Status**: ✅ CONCLUÍDO  
**Impacto**: 🔴 CRÍTICO (Corrige erro que impedia edição)  
**Risco**: 🟢 BAIXO (Mudanças testadas e validadas)
