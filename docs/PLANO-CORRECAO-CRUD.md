# Plano de Correção - CRUD Completo

## 🎯 OBJETIVO
Garantir que o fluxo CRUD funcione corretamente: dados salvos no admin apareçam nas páginas de detalhes.

---

## 📊 ANÁLISE DO PROBLEMA ATUAL

### Evidências dos Prints:
1. **Página Detalhes** (`/docs/conectores-de-dados`):
   - Data Início: "Não definida"
   - Última Atualização: "Não definida"
   - Responsável: "Não atribuído"
   - Cliente: "Não definido"

2. **BigQuery** (tabela `docs`):
   - `data_inicio`: 2024-02-09 16:33:27.940000 UTC
   - `responsavel`: Thiago
   - `cliente`: Interno
   - `observacao`: null

3. **Admin** (`/admin/docs`):
   - Formulário mostrando campos preenchidos
   - Data Início com formato dd/mm/aaaa

### Diagnóstico:
✅ **Dados ESTÃO sendo salvos no BigQuery**
❌ **Página de detalhes NÃO está lendo os dados corretamente**

---

## 🔍 CAUSAS PROVÁVEIS

### 1. API de Leitura Pública (`/api/docs`)
- Pode não estar retornando os campos de gestão
- Pode estar usando views antigas sem os novos campos
- Pode ter problema de normalização de nomes de colunas

### 2. Página de Detalhes (`/docs/[id]/page.tsx`)
- Pode estar buscando campos com nomes errados
- Pode ter problema de tipagem TypeScript
- Pode não estar fazendo fallback correto para valores null

### 3. Formato de Dados
- BigQuery retorna timestamps em formato específico
- Frontend pode não estar parseando corretamente
- Pode haver problema com timezone (UTC vs local)

---

## 🛠️ PLANO DE CORREÇÃO

### FASE 1: DIAGNÓSTICO DETALHADO

#### 1.1. Verificar API Pública
**Arquivo**: `app/api/docs/route.ts`

**Verificar**:
- [ ] Está usando a view `docs_v1` ou tabela `docs` diretamente?
- [ ] Está retornando os campos: `data_inicio`, `ultima_atualizacao`, `responsavel`, `cliente`, `observacao`?
- [ ] Está fazendo normalização correta dos nomes de colunas?

**Ação**: Adicionar logs ou criar endpoint de debug

---

#### 1.2. Verificar Estrutura da View
**Arquivo**: `bigquery-views.sql`

**Verificar**:
- [ ] View `docs_v1` inclui os campos de gestão?
- [ ] Nomes das colunas estão corretos (Processo vs nome)?

**Ação**: Recriar view se necessário

---

#### 1.3. Verificar Página de Detalhes
**Arquivo**: `app/docs/[id]/page.tsx`

**Verificar**:
- [ ] Está acessando os campos corretos do objeto `doc`?
- [ ] Está fazendo parse correto de datas?
- [ ] Fallbacks estão funcionando?

**Ação**: Adicionar console.log para debug

---

### FASE 2: CORREÇÕES

#### 2.1. Corrigir API Pública
**Objetivo**: Garantir que `/api/docs` retorne TODOS os campos

**Mudanças**:
```typescript
// app/api/docs/route.ts
export async function GET() {
  const query = `
    SELECT 
      Processo as nome,
      Link as link,
      Area as area,
      id,
      data_inicio,
      ultima_atualizacao,
      responsavel,
      cliente,
      observacao
    FROM \`${dataset}.docs\`
  `;
  
  const [rows] = await bigquery.query({ query });
  
  // Normalizar dados
  const normalized = rows.map(row => ({
    id: row.id,
    nome: row.nome || row.Processo,
    link: row.link || row.Link,
    area: row.area || row.Area,
    data_inicio: row.data_inicio,
    ultima_atualizacao: row.ultima_atualizacao,
    responsavel: row.responsavel,
    cliente: row.cliente,
    observacao: row.observacao
  }));
  
  return Response.json(normalized);
}
```

---

#### 2.2. Atualizar Views do BigQuery
**Objetivo**: Garantir que views incluam campos de gestão

**SQL**:
```sql
-- Recriar view docs_v1
CREATE OR REPLACE VIEW `seu-projeto.seu-dataset.docs_v1` AS
SELECT 
  Processo,
  Link,
  Area,
  id,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `seu-projeto.seu-dataset.docs`;
```

---

#### 2.3. Corrigir Página de Detalhes
**Objetivo**: Garantir parse correto de datas e exibição

**Mudanças**:
```typescript
// app/docs/[id]/page.tsx

// Função helper para formatar data
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Não definida';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Não definida';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Não definida';
  }
}

// No componente
<InfoRow 
  label="Data Início" 
  value={formatDate(doc.data_inicio)} 
  icon={<Calendar className="h-4 w-4" />}
/>
```

---

#### 2.4. Adicionar Endpoint de Debug
**Objetivo**: Facilitar diagnóstico de problemas

**Novo arquivo**: `app/api/debug-docs-detail/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const processo = searchParams.get('processo');
  
  if (!processo) {
    return NextResponse.json({ error: 'Processo parameter required' }, { status: 400 });
  }
  
  const query = `
    SELECT *
    FROM \`${process.env.BIGQUERY_DATASET}.docs\`
    WHERE Processo = @processo
    LIMIT 1
  `;
  
  const options = {
    query,
    params: { processo }
  };
  
  const [rows] = await bigquery.query(options);
  
  return NextResponse.json({
    found: rows.length > 0,
    data: rows[0] || null,
    raw: JSON.stringify(rows[0], null, 2)
  });
}
```

---

### FASE 3: TESTES

#### 3.1. Teste de API
**Endpoint**: `GET /api/docs`

**Verificar**:
- [ ] Retorna array de documentos
- [ ] Cada documento tem campos de gestão
- [ ] Valores não são null quando existem no BQ
- [ ] Formato de data está correto

**Comando**:
```bash
curl http://localhost:3000/api/docs | jq '.[0]'
```

---

#### 3.2. Teste de Debug
**Endpoint**: `GET /api/debug-docs-detail?processo=Conectores de dados`

**Verificar**:
- [ ] Encontra o documento
- [ ] Mostra todos os campos
- [ ] Valores correspondem ao BigQuery

---

#### 3.3. Teste de Página de Detalhes
**URL**: `/docs/conectores-de-dados`

**Verificar**:
- [ ] Página carrega sem erro
- [ ] Campos de gestão aparecem preenchidos
- [ ] Datas estão formatadas corretamente (dd/mm/aaaa)
- [ ] Responsável e Cliente aparecem

---

#### 3.4. Teste de Admin
**URL**: `/admin/docs`

**Verificar**:
- [ ] Formulário carrega com dados atuais
- [ ] Ao salvar, dados são atualizados no BQ
- [ ] Mensagem de sucesso aparece
- [ ] Página de detalhes reflete mudanças (após refresh)

---

### FASE 4: APLICAR PARA TODAS AS ENTIDADES

Após corrigir `docs`, aplicar mesma correção para:

#### 4.1. Dashboards
- [ ] API: `/api/dashboards/route.ts`
- [ ] Página: `/app/dashboards/[id]/page.tsx`
- [ ] Admin: `/app/admin/dashboards/page.tsx`

#### 4.2. Ferramentas
- [ ] API: `/api/ferramentas/route.ts`
- [ ] Página: `/app/ferramentas/[id]/page.tsx`
- [ ] Admin: `/app/admin/ferramentas/page.tsx`

#### 4.3. Pesquisas
- [ ] API: `/api/pesquisas/route.ts`
- [ ] Página: `/app/pesquisas/[id]/page.tsx`
- [ ] Admin: `/app/admin/pesquisas/page.tsx`

#### 4.4. Projetos
- [ ] API: `/api/projetos/route.ts`
- [ ] Página: `/app/projetos/[id]/page.tsx`
- [ ] Admin: `/app/admin/projetos/page.tsx`

---

## 🔄 FLUXO CORRETO (COMO DEVE FUNCIONAR)

### 1. LEITURA (READ)
```
Usuário acessa /docs/conectores-de-dados
  ↓
Next.js chama getDocs(id)
  ↓
Faz fetch para /api/docs
  ↓
API consulta BigQuery (tabela docs)
  ↓
Retorna TODOS os campos (básicos + gestão)
  ↓
Página encontra doc pelo ID/nome normalizado
  ↓
Renderiza com todos os dados
```

### 2. ATUALIZAÇÃO (UPDATE)
```
Admin acessa /admin/docs
  ↓
Página carrega dados via /api/docs
  ↓
Preenche formulário com dados atuais
  ↓
Admin edita campos de gestão
  ↓
Clica em "Salvar"
  ↓
Frontend faz PUT para /api/admin/docs/[id]
  ↓
API atualiza BigQuery com UPDATE
  ↓
Retorna sucesso
  ↓
Frontend mostra mensagem de sucesso
  ↓
Dados atualizados aparecem na página de detalhes
```

### 3. CRIAÇÃO (CREATE)
```
Admin acessa /admin/docs
  ↓
Clica em "Adicionar Novo"
  ↓
Preenche formulário
  ↓
Clica em "Salvar"
  ↓
Frontend faz POST para /api/admin/docs
  ↓
API insere no BigQuery com INSERT
  ↓
Retorna sucesso com ID
  ↓
Novo item aparece na lista e tem página de detalhes
```

### 4. EXCLUSÃO (DELETE)
```
Admin acessa /admin/docs
  ↓
Clica em "Excluir" em um item
  ↓
Confirma exclusão
  ↓
Frontend faz DELETE para /api/admin/docs/[id]
  ↓
API remove do BigQuery com DELETE
  ↓
Item desaparece da lista e página de detalhes
```

---

## 📋 CHECKLIST DE VALIDAÇÃO FINAL

### Para cada entidade (Docs, Dashboards, Ferramentas, Pesquisas, Projetos):

#### API Pública (`/api/[entidade]`)
- [ ] Retorna todos os campos básicos
- [ ] Retorna todos os campos de gestão
- [ ] Normaliza nomes de colunas corretamente
- [ ] Trata valores null adequadamente

#### API Admin (`/api/admin/[entidade]` e `/api/admin/[entidade]/[id]`)
- [ ] GET retorna dados completos
- [ ] POST cria novo registro com todos os campos
- [ ] PUT atualiza registro existente
- [ ] DELETE remove registro
- [ ] Retorna mensagens de erro claras

#### Página de Detalhes (`/[entidade]/[id]`)
- [ ] Busca dados corretamente
- [ ] Exibe todos os campos básicos
- [ ] Exibe todos os campos de gestão
- [ ] Formata datas corretamente (dd/mm/aaaa)
- [ ] Mostra fallbacks quando dados não existem
- [ ] Lida com caracteres especiais na URL

#### Página Admin (`/admin/[entidade]`)
- [ ] Lista todos os registros
- [ ] Carrega dados atuais no formulário de edição
- [ ] Salva alterações corretamente
- [ ] Mostra mensagem de sucesso/erro
- [ ] Atualiza lista após salvar
- [ ] Valida campos obrigatórios

#### BigQuery
- [ ] Tabelas têm todos os campos necessários
- [ ] Views incluem campos de gestão
- [ ] Índices/IDs funcionam corretamente
- [ ] Dados persistem após salvar

---

## 🚀 ORDEM DE EXECUÇÃO

1. **Diagnóstico** (30 min)
   - Verificar API `/api/docs`
   - Verificar dados no BigQuery
   - Criar endpoint de debug

2. **Correção Docs** (1h)
   - Corrigir API pública
   - Corrigir página de detalhes
   - Testar fluxo completo

3. **Aplicar para outras entidades** (2h)
   - Dashboards
   - Ferramentas
   - Pesquisas
   - Projetos

4. **Testes finais** (30 min)
   - Testar CRUD completo para cada entidade
   - Verificar páginas de detalhes
   - Validar dados no BigQuery

---

## 📝 NOTAS IMPORTANTES

### Formato de Datas
- **BigQuery**: Armazena como TIMESTAMP (UTC)
- **API**: Retorna como string ISO 8601
- **Frontend**: Converte para formato brasileiro (dd/mm/aaaa)

### Normalização de Nomes
- **BigQuery**: Pode ter `Processo`, `Nome`, `titulo` (inconsistente)
- **API**: Deve normalizar para `nome` sempre
- **Frontend**: Usa `nome` consistentemente

### Cache
- Páginas de detalhes usam `cache: 'no-store'`
- Garante dados sempre atualizados
- Pode impactar performance (avaliar depois)

### Tipos TypeScript
- Interfaces em `types/bi-platform.ts`
- Devem incluir campos de gestão opcionais
- Usar `| null | undefined` para campos opcionais
