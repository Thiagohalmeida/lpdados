# Análise: Problemas no Painel Admin

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. Páginas Admin Separadas Não Funcionam
**Problema**: Dashboards, Docs e Ferramentas têm páginas admin separadas mas não funcionam corretamente.

**Causa**: 
- Páginas carregam dados de APIs antigas (`/api/dashboards`, `/api/docs`, `/api/ferramentas`)
- Essas APIs ainda usam views antigas ou tabelas que podem não existir
- Inconsistência com a arquitetura unificada

**Solução**: 
- ✅ **MANTER** apenas "Gerenciar Projetos" (funciona corretamente)
- ❌ **REMOVER** páginas separadas de Dashboards, Docs, Ferramentas
- ✅ **CRIAR** página unificada "Gerenciar Itens" que gerencia todos os tipos

### 2. Campo Status Não Atualiza no Frontend
**Problema**: Alteração de status no admin não aparece no frontend.

**Causa Raiz**:
- Admin salva em `itens_portal` com campo `status` ✅
- Frontend carrega de `/api/projetos` que usa view `projetos_v1` ✅
- **MAS**: A view `projetos_v1` pode não estar retornando o campo `status` atualizado
- Ou o frontend está fazendo cache dos dados

**Investigação Necessária**:
- Verificar se a view `projetos_v1` está correta
- Verificar se o frontend está fazendo cache (SWR)

### 3. Campos de Data Não Salvam
**Problema**: `data_inicio` não salva no BigQuery.

**Causa Provável**:
- Formato de data incorreto sendo enviado
- BigQuery espera formato `YYYY-MM-DD` para tipo DATE
- Frontend pode estar enviando formato diferente
- Ou o campo está sendo enviado como `null`/`undefined`

**Investigação**:
- Ver o que está sendo enviado no body do PUT
- Verificar se o tipo DATE está correto no BigQuery

## 📊 ARQUITETURA ATUAL vs IDEAL

### ATUAL (Problemática)
```
Admin Dashboard:
├── Gerenciar Projetos ✅ (funciona - usa itens_portal)
├── Gerenciar Dashboards ❌ (não funciona - usa API antiga)
├── Gerenciar Docs ❌ (não funciona - usa API antiga)
├── Gerenciar Ferramentas ❌ (não funciona - usa API antiga)
└── Gerenciar Pesquisas ✅ (separada - OK)
```

### IDEAL (Unificada)
```
Admin Dashboard:
├── Gerenciar Itens ✅ (NOVO - gerencia projetos, dashboards, docs, ferramentas)
│   ├── Filtro por Tipo (projeto/dashboard/documentacao/ferramenta)
│   ├── Form adapta campos baseado no tipo
│   └── Usa /api/itens diretamente
└── Gerenciar Pesquisas ✅ (separada - OK, estrutura diferente)
```

## 🔧 SOLUÇÕES A IMPLEMENTAR

### Solução 1: Remover Páginas Admin Antigas

**Arquivos a Deletar**:
- `app/admin/dashboards/page.tsx`
- `app/admin/docs/page.tsx`
- `app/admin/ferramentas/page.tsx`

**Arquivos a Manter**:
- `app/admin/projetos/page.tsx` (renomear para `itens`)
- `app/admin/pesquisas/page.tsx`

### Solução 2: Criar Página Admin Unificada

**Novo Arquivo**: `app/admin/itens/page.tsx`

**Funcionalidades**:
1. Dropdown para selecionar tipo (projeto/dashboard/documentacao/ferramenta)
2. Lista de itens filtrada por tipo
3. Form que adapta campos baseado no tipo:
   - **Projeto**: status, tecnologias, data, docs
   - **Dashboard**: sem status, sem tecnologias
   - **Documentação**: sem status, sem tecnologias
   - **Ferramenta**: proxima_atualizacao, sem status
4. Usa `/api/itens` diretamente (já existe e funciona)

### Solução 3: Corrigir Problema de Status

**Opção A**: Atualizar view `projetos_v1`
```sql
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  id,
  nome,
  descricao,
  status,  -- GARANTIR que está aqui
  link,
  area,
  tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.itens_portal`
WHERE tipo = 'projeto'
```

**Opção B**: Frontend usar `/api/itens?tipo=projeto` em vez de `/api/projetos`
- Mais simples
- Elimina dependência de views
- Consistente com arquitetura unificada

### Solução 4: Corrigir Salvamento de Datas

**Problema**: Campo `data_inicio` não salva

**Verificações**:
1. Formato enviado pelo frontend: `YYYY-MM-DD` ✅
2. Tipo no BigQuery: `DATE` ✅
3. Parâmetro na query: `@data_inicio` ✅
4. Tipo explícito: `data_inicio: 'DATE'` ✅

**Possível Causa**: String vazia `""` em vez de `null`

**Correção no Frontend**:
```typescript
// ANTES
data_inicio: formData.data_inicio || ''

// DEPOIS
data_inicio: formData.data_inicio || null
```

**Correção na API**:
```typescript
// Garantir que string vazia vira null
data_inicio: data.data_inicio && data.data_inicio.trim() !== '' 
  ? data.data_inicio 
  : null
```

## 📋 PLANO DE IMPLEMENTAÇÃO

### Fase 1: Corrigir Problemas Imediatos
1. ✅ Corrigir salvamento de datas (string vazia → null)
2. ✅ Atualizar frontend para usar `/api/itens?tipo=projeto`
3. ✅ Adicionar revalidação de cache após salvar

### Fase 2: Simplificar Admin
1. ✅ Atualizar `app/admin/page.tsx` - remover links para dashboards/docs/ferramentas
2. ✅ Renomear "Gerenciar Projetos" para "Gerenciar Itens"
3. ✅ Atualizar `app/admin/projetos/page.tsx` para gerenciar todos os tipos

### Fase 3: Limpeza
1. ❌ Deletar `app/admin/dashboards/page.tsx`
2. ❌ Deletar `app/admin/docs/page.tsx`
3. ❌ Deletar `app/admin/ferramentas/page.tsx`
4. ❌ Deletar APIs antigas se não forem mais usadas

## 🎯 RESULTADO ESPERADO

### Admin Simplificado
- 1 página para gerenciar todos os itens (projetos, dashboards, docs, ferramentas)
- 1 página para gerenciar pesquisas (separada)
- Form inteligente que adapta campos baseado no tipo
- Sem duplicação de código

### Dados Consistentes
- Status atualiza corretamente no frontend
- Datas salvam corretamente
- Sem cache desatualizado
- Fonte única de verdade (itens_portal)

---

**Prioridade**: 🔴 ALTA  
**Impacto**: 🔴 CRÍTICO (Admin não funciona corretamente)  
**Complexidade**: 🟡 MÉDIA (requer refatoração)
