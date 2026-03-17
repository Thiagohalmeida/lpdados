# Proposta: Tabela Única para Portal BI

## 🎯 Objetivo
Unificar Projetos, Dashboards, Documentação e Ferramentas em uma única tabela com campo `tipo`, mantendo Pesquisas separada.

---

## 📊 Estrutura Proposta

### Tabela 1: `itens_portal`
Unifica: Projetos, Dashboards, Docs, Ferramentas

```sql
CREATE TABLE `worlddata-439415.lpdados.itens_portal` (
  -- Identificação
  id STRING NOT NULL,
  tipo STRING NOT NULL,  -- 'projeto' | 'dashboard' | 'documentacao' | 'ferramenta'
  
  -- Campos Comuns
  nome STRING,
  descricao STRING,
  link STRING,
  area STRING,
  
  -- Campos Específicos (nullable)
  status STRING,                    -- Apenas projetos
  proxima_atualizacao STRING,       -- Apenas ferramentas
  tecnologias ARRAY<STRING>,        -- Apenas projetos
  
  -- Campos de Gestão (todos os tipos)
  data_inicio DATE,
  ultima_atualizacao TIMESTAMP,
  responsavel STRING,
  cliente STRING,
  observacao STRING
);
```

### Tabela 2: `pesquisas`
Mantém separada (campos únicos)

```sql
-- Já existe, apenas adicionar campos de gestão se não tiver
ALTER TABLE `worlddata-439415.lpdados.pesquisas`
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS responsavel STRING,
ADD COLUMN IF NOT EXISTS cliente STRING,
ADD COLUMN IF NOT EXISTS observacao STRING;
```

---

## ✅ Vantagens

### 1. CRUD Único
- Uma API para criar/editar/deletar
- Um formulário admin reutilizável
- Menos código, menos bugs

### 2. Consistência
- Todos os itens têm os mesmos campos de gestão
- Mesma estrutura de dados
- Fácil de entender e manter

### 3. Queries Simples
```sql
-- Buscar todos os projetos
SELECT * FROM itens_portal WHERE tipo = 'projeto';

-- Buscar todos os dashboards
SELECT * FROM itens_portal WHERE tipo = 'dashboard';

-- Buscar tudo de uma área
SELECT * FROM itens_portal WHERE area = 'Comercial';

-- Buscar por responsável
SELECT * FROM itens_portal WHERE responsavel = 'Thiago';
```

### 4. Escalabilidade
Adicionar novo tipo é trivial:
```sql
INSERT INTO itens_portal (tipo, nome, ...) 
VALUES ('relatorio', 'Relatório Mensal', ...);
```

---

## 🔄 Migração dos Dados Existentes

### Passo 1: Criar Nova Tabela
```sql
CREATE TABLE `worlddata-439415.lpdados.itens_portal` (
  id STRING NOT NULL,
  tipo STRING NOT NULL,
  nome STRING,
  descricao STRING,
  link STRING,
  area STRING,
  status STRING,
  proxima_atualizacao STRING,
  tecnologias ARRAY<STRING>,
  data_inicio DATE,
  ultima_atualizacao TIMESTAMP,
  responsavel STRING,
  cliente STRING,
  observacao STRING
);
```

### Passo 2: Migrar Projetos
```sql
INSERT INTO `worlddata-439415.lpdados.itens_portal`
SELECT 
  id,
  'projeto' as tipo,
  projeto as nome,
  descricao,
  link,
  area,
  status,
  NULL as proxima_atualizacao,
  ARRAY<STRING>[] as tecnologias,  -- Ajustar se tiver tecnologias
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.projeto`;
```

### Passo 3: Migrar Dashboards
```sql
INSERT INTO `worlddata-439415.lpdados.itens_portal`
SELECT 
  id,
  'dashboard' as tipo,
  nome,
  descricao,
  link,
  area,
  NULL as status,
  NULL as proxima_atualizacao,
  NULL as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.dashboard`;
```

### Passo 4: Migrar Docs
```sql
INSERT INTO `worlddata-439415.lpdados.itens_portal`
SELECT 
  id,
  'documentacao' as tipo,
  Processo as nome,
  '' as descricao,
  Link as link,
  Area as area,
  NULL as status,
  NULL as proxima_atualizacao,
  NULL as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.docs`;
```

### Passo 5: Migrar Ferramentas
```sql
INSERT INTO `worlddata-439415.lpdados.itens_portal`
SELECT 
  id,
  'ferramenta' as tipo,
  nome,
  descricao,
  link,
  area,
  NULL as status,
  proxima_atualizacao,
  NULL as tecnologias,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.ferramentas`;
```

---

## 🔧 Mudanças no Código

### 1. Nova API Unificada
```typescript
// app/api/itens/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tipo = searchParams.get('tipo'); // 'projeto' | 'dashboard' | etc
  
  let query = `SELECT * FROM \`worlddata-439415.lpdados.itens_portal\``;
  if (tipo) {
    query += ` WHERE tipo = '${tipo}'`;
  }
  
  const [rows] = await bigquery.query({ query });
  return NextResponse.json(rows);
}
```

### 2. APIs Específicas (compatibilidade)
```typescript
// app/api/projetos/route.ts
export async function GET() {
  const res = await fetch('/api/itens?tipo=projeto');
  return res;
}

// app/api/dashboards/route.ts
export async function GET() {
  const res = await fetch('/api/itens?tipo=dashboard');
  return res;
}
```

### 3. Admin Unificado
```typescript
// app/admin/itens/page.tsx
// Um formulário que se adapta ao tipo selecionado
// Campos condicionais baseados no tipo
```

---

## 📋 Checklist de Implementação

### Fase 1: Preparação
- [ ] Criar tabela `itens_portal` no BigQuery
- [ ] Migrar dados das 4 tabelas antigas
- [ ] Verificar integridade dos dados migrados

### Fase 2: Backend
- [ ] Criar API `/api/itens` (GET, POST, PUT, DELETE)
- [ ] Manter APIs antigas para compatibilidade
- [ ] Testar todas as operações CRUD

### Fase 3: Frontend
- [ ] Criar admin unificado `/admin/itens`
- [ ] Adaptar páginas de detalhes (já funcionam)
- [ ] Testar fluxo completo

### Fase 4: Limpeza
- [ ] Remover tabelas antigas (backup antes!)
- [ ] Remover código duplicado
- [ ] Documentar nova estrutura

---

## ⚠️ Considerações

### Manter Compatibilidade
Durante a transição, manter as APIs antigas funcionando:
- `/api/projetos` → chama `/api/itens?tipo=projeto`
- `/api/dashboards` → chama `/api/itens?tipo=dashboard`
- etc.

### Backup
Antes de deletar tabelas antigas:
```sql
-- Exportar para Cloud Storage
EXPORT DATA OPTIONS(
  uri='gs://seu-bucket/backup/*.json',
  format='JSON'
) AS
SELECT * FROM `worlddata-439415.lpdados.projeto`;
```

---

## 🎯 Resultado Final

### Antes (4 tabelas)
- `projeto` (12 colunas)
- `dashboard` (10 colunas)
- `docs` (8 colunas)
- `ferramentas` (11 colunas)
- `pesquisas` (10 colunas)

**Total**: 5 tabelas, ~50 colunas, 5 APIs, 5 admins

### Depois (2 tabelas)
- `itens_portal` (14 colunas) → 4 tipos
- `pesquisas` (10 colunas)

**Total**: 2 tabelas, 24 colunas, 2 APIs, 2 admins

**Redução**: 60% menos código, 50% menos complexidade
