# Correção CRUD - Executada

## ✅ PROBLEMA IDENTIFICADO

As APIs públicas (`/api/docs`, `/api/dashboards`, `/api/ferramentas`, `/api/pesquisas`) **não estavam retornando os campos de gestão** salvos no BigQuery.

### Evidência:
- BigQuery tinha: `data_inicio`, `responsavel`, `cliente`, `observacao`
- API retornava apenas: `id`, `nome`, `descricao`, `link`, `area`
- Página de detalhes mostrava: "Não definida" para todos os campos

---

## 🔧 CORREÇÕES APLICADAS

### 1. API Docs (`app/api/docs/route.ts`)
**Adicionado**:
```typescript
// Campos de gestão
data_inicio: out.data_inicio || null,
ultima_atualizacao: out.ultima_atualizacao || null,
responsavel: out.responsavel || null,
cliente: out.cliente || null,
observacao: out.observacao || null
```

### 2. API Dashboards (`app/api/dashboards/route.ts`)
**Adicionado**: Mesmos campos de gestão

### 3. API Ferramentas (`app/api/ferramentas/route.ts`)
**Adicionado**: Mesmos campos de gestão

### 4. API Pesquisas (`app/api/pesquisas/route.ts`)
**Adicionado**: Mesmos campos de gestão

---

## 🧪 COMO TESTAR

### Teste 1: Verificar API
```bash
# Abra o navegador e acesse:
http://localhost:3000/api/docs

# Verifique se o JSON retornado inclui:
{
  "id": "...",
  "nome": "Conectores de dados",
  "data_inicio": "2024-02-09T16:33:27.940Z",
  "responsavel": "Thiago",
  "cliente": "Interno",
  ...
}
```

### Teste 2: Verificar Página de Detalhes
```bash
# Acesse:
http://localhost:3000/docs/conectores-de-dados

# Verifique se aparece:
- Data Início: 09/02/2024
- Responsável: Thiago
- Cliente: Interno
```

### Teste 3: Verificar Admin
```bash
# Acesse:
http://localhost:3000/admin/docs

# Edite "Conectores de dados"
# Altere algum campo (ex: Responsável para "Leandro")
# Clique em "Salvar"
# Volte para a página de detalhes
# Verifique se mudou para "Leandro"
```

---

## 📋 PRÓXIMOS PASSOS

### Passo 1: Testar Correção ✅
- [ ] Reiniciar servidor Next.js
- [ ] Acessar `/docs/conectores-de-dados`
- [ ] Verificar se campos de gestão aparecem
- [ ] Testar outras entidades (dashboards, ferramentas, pesquisas)

### Passo 2: Verificar Formato de Datas
Se as datas ainda aparecerem como "Não definida", pode ser problema de formato.

**Solução**: Adicionar função helper nas páginas de detalhes:

```typescript
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Não definida';
  
  try {
    // BigQuery retorna timestamp como string ISO ou objeto
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

// Usar assim:
<InfoRow 
  label="Data Início" 
  value={formatDate(doc.data_inicio)} 
  icon={<Calendar className="h-4 w-4" />}
/>
```

### Passo 3: Adicionar Endpoint de Debug (Opcional)
Para facilitar diagnóstico futuro, criar:

**Arquivo**: `app/api/debug-entity/route.ts`
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity'); // docs, dashboards, etc
  const id = searchParams.get('id');
  
  // Buscar diretamente do BigQuery e retornar RAW
  // Útil para ver exatamente o que está no banco
}
```

### Passo 4: Documentar Fluxo CRUD
Criar documento explicando:
- Como adicionar novo item
- Como editar item existente
- Como os dados fluem (BigQuery → API → Frontend)
- Troubleshooting comum

---

## 🎯 RESULTADO ESPERADO

Após as correções:

### Antes:
```
Página de Detalhes:
- Data Início: Não definida
- Responsável: Não atribuído
- Cliente: Não definido
```

### Depois:
```
Página de Detalhes:
- Data Início: 09/02/2024
- Responsável: Thiago
- Cliente: Interno
- Observações: (se houver)
```

---

## 🔍 DIAGNÓSTICO ADICIONAL

Se após as correções os dados ainda não aparecerem:

### Verificar 1: BigQuery tem os dados?
```sql
SELECT 
  Processo,
  data_inicio,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.docs`
WHERE Processo = 'Conectores de dados';
```

### Verificar 2: API retorna os dados?
```bash
curl http://localhost:3000/api/docs | jq '.[] | select(.nome == "Conectores de dados")'
```

### Verificar 3: Página encontra o documento?
Adicionar console.log na página:
```typescript
async function getDoc(id: string) {
  const res = await fetch(...);
  const docs = await res.json();
  console.log('Todos os docs:', docs);
  console.log('Procurando por ID:', id);
  const found = docs.find(...);
  console.log('Encontrado:', found);
  return found;
}
```

---

## 📊 ESTRUTURA DE DADOS

### BigQuery (Tabela `docs`)
```
Processo: string
Link: string
Area: string
id: string
data_inicio: TIMESTAMP
ultima_atualizacao: TIMESTAMP
responsavel: string
cliente: string
observacao: string
```

### API Response (`/api/docs`)
```json
{
  "id": "abc123",
  "nome": "Conectores de dados",
  "descricao": "Descrição",
  "link": "https://...",
  "area": "Planejamento",
  "data_inicio": "2024-02-09T16:33:27.940Z",
  "ultima_atualizacao": "2024-02-09T16:33:27.940Z",
  "responsavel": "Thiago",
  "cliente": "Interno",
  "observacao": null
}
```

### Frontend (Página de Detalhes)
```typescript
interface Doc {
  id: string;
  nome: string;
  descricao?: string;
  link: string;
  area: string;
  data_inicio?: string | null;
  ultima_atualizacao?: string | null;
  responsavel?: string | null;
  cliente?: string | null;
  observacao?: string | null;
}
```

---

## ⚠️ PONTOS DE ATENÇÃO

### 1. Formato de Data do BigQuery
BigQuery pode retornar timestamps em diferentes formatos:
- String ISO: `"2024-02-09T16:33:27.940Z"`
- Objeto: `{ value: "2024-02-09T16:33:27.940000" }`

A função `extractValue` já trata isso, mas verifique se está funcionando.

### 2. Valores Null vs Undefined
- BigQuery retorna `null` para campos vazios
- JavaScript pode ter `undefined` se campo não existir
- Sempre usar `|| null` para normalizar

### 3. Cache do Next.js
As páginas de detalhes usam `cache: 'no-store'`, mas o navegador pode cachear.
- Fazer hard refresh (Ctrl+Shift+R)
- Ou abrir em aba anônima

### 4. Tipos TypeScript
Verificar se `types/bi-platform.ts` tem os campos de gestão definidos:
```typescript
export interface Documentacao {
  id: string;
  nome: string;
  descricao?: string;
  link: string;
  area: string;
  // Campos de gestão
  data_inicio?: string | null;
  ultima_atualizacao?: string | null;
  responsavel?: string | null;
  cliente?: string | null;
  observacao?: string | null;
}
```

---

## 🚀 DEPLOY

Após testar localmente e confirmar que funciona:

1. **Commit das mudanças**:
```bash
git add .
git commit -m "fix: adicionar campos de gestão nas APIs públicas"
```

2. **Push para repositório**:
```bash
git push origin main
```

3. **Vercel fará deploy automático**

4. **Testar em produção**:
- Acessar URL de produção
- Verificar páginas de detalhes
- Confirmar que dados aparecem

---

## 📞 SUPORTE

Se os dados ainda não aparecerem após as correções:

1. Verificar logs do servidor Next.js
2. Verificar console do navegador (F12)
3. Usar endpoint de debug (se criado)
4. Verificar diretamente no BigQuery
5. Compartilhar prints/logs para análise
