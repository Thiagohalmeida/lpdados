# 📝 Como Atualizar os Dados da Plataforma

## 🎯 VISÃO GERAL

A plataforma busca dados do **BigQuery**, que por sua vez lê das tabelas originais. Para atualizar os dados, você tem 3 opções:

---

## OPÇÃO 1: Atualizar Diretamente no BigQuery (ATUAL)

### Como funciona:
- Você atualiza as tabelas originais no BigQuery
- As views `*_v1` refletem automaticamente as mudanças
- A plataforma mostra os dados atualizados

### Como atualizar:

#### **Via Console do BigQuery:**

```sql
-- Exemplo: Adicionar um novo projeto
INSERT INTO `worlddata-439415.lpdados.projeto` (nome, descricao, status, area, link)
VALUES ('Novo Projeto', 'Descrição do projeto', 'Em Desenvolvimento', 'Growth', 'https://...');

-- Exemplo: Atualizar um projeto existente
UPDATE `worlddata-439415.lpdados.projeto`
SET status = 'Entregue', data = '2026-02-06'
WHERE nome = 'Nome do Projeto';

-- Exemplo: Deletar um projeto
DELETE FROM `worlddata-439415.lpdados.projeto`
WHERE nome = 'Projeto Antigo';
```

### ✅ Vantagens:
- Simples e direto
- Não precisa de código adicional
- Funciona imediatamente

### ❌ Desvantagens:
- Precisa saber SQL
- Acesso manual ao BigQuery
- Sem interface amigável

---

## OPÇÃO 2: Continuar Usando Google Sheets (RECOMENDADO PARA AGORA)

### Como funciona:
- Você mantém os dados no Google Sheets (como antes)
- Um script sincroniza Sheets → BigQuery
- A plataforma lê do BigQuery

### Como implementar:

#### **1. Manter Google Sheets como fonte**

Você já tem os dados em Sheets. Podemos criar um script que:
- Roda a cada X minutos/horas
- Lê o Google Sheets
- Atualiza o BigQuery

#### **2. Script de Sincronização (Node.js)**

```javascript
// scripts/sync-sheets-to-bigquery.js
import { BigQuery } from '@google-cloud/bigquery';
import { google } from 'googleapis';

const bigquery = new BigQuery();
const sheets = google.sheets('v4');

async function syncSheetsToBigQuery() {
  // 1. Ler dados do Google Sheets
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: 'SEU_SHEET_ID',
    range: 'Projetos!A2:Z',
  });

  const rows = response.data.values;

  // 2. Limpar tabela do BigQuery
  await bigquery.query(`DELETE FROM \`worlddata-439415.lpdados.projeto\` WHERE TRUE`);

  // 3. Inserir dados no BigQuery
  const dataset = bigquery.dataset('lpdados');
  const table = dataset.table('projeto');
  
  await table.insert(rows.map(row => ({
    nome: row[0],
    descricao: row[1],
    status: row[2],
    // ... outros campos
  })));

  console.log('✅ Sincronização concluída!');
}

syncSheetsToBigQuery();
```

#### **3. Agendar Sincronização**

**Opção A: GitHub Actions (Gratuito)**
```yaml
# .github/workflows/sync-data.yml
name: Sync Sheets to BigQuery
on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas
  workflow_dispatch:  # Manual

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: node scripts/sync-sheets-to-bigquery.js
```

**Opção B: Vercel Cron Jobs**
```javascript
// api/cron/sync.ts
export default async function handler(req, res) {
  await syncSheetsToBigQuery();
  res.json({ success: true });
}
```

### ✅ Vantagens:
- Interface familiar (Google Sheets)
- Fácil de atualizar
- Não precisa saber SQL

### ❌ Desvantagens:
- Precisa configurar sincronização
- Delay entre atualização e visualização

---

## OPÇÃO 3: Interface Admin na Plataforma (FUTURO)

### Como funciona:
- Criar uma área `/admin` na plataforma
- Formulários para adicionar/editar/deletar
- Salva diretamente no BigQuery

### Exemplo de tela:

```
/admin/projetos
┌─────────────────────────────────────┐
│ ➕ Novo Projeto                     │
├─────────────────────────────────────┤
│ Nome: [________________]            │
│ Descrição: [________________]       │
│ Status: [▼ Em Desenvolvimento]      │
│ Área: [▼ Growth]                    │
│ Link: [________________]            │
│                                     │
│ [Salvar] [Cancelar]                 │
└─────────────────────────────────────┘
```

### Como implementar:

```typescript
// app/admin/projetos/page.tsx
'use client';

export default function AdminProjetos() {
  const handleSubmit = async (data) => {
    await fetch('/api/admin/projetos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome do projeto" />
      <textarea name="descricao" placeholder="Descrição" />
      <select name="status">
        <option>Em Desenvolvimento</option>
        <option>Entregue</option>
        <option>Standby</option>
      </select>
      <button type="submit">Salvar</button>
    </form>
  );
}
```

```typescript
// app/api/admin/projetos/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  
  // Inserir no BigQuery
  await bigquery.query(`
    INSERT INTO \`worlddata-439415.lpdados.projeto\`
    (nome, descricao, status, area, link)
    VALUES (@nome, @descricao, @status, @area, @link)
  `, { params: data });

  return NextResponse.json({ success: true });
}
```

### ✅ Vantagens:
- Interface integrada
- Fácil de usar
- Atualização instantânea
- Controle de acesso

### ❌ Desvantagens:
- Precisa desenvolver
- Precisa autenticação
- Mais complexo

---

## 🎯 RECOMENDAÇÃO

### **Para AGORA (Lançamento):**
Use **OPÇÃO 1** (BigQuery direto) ou continue com **Google Sheets** manualmente

### **Para CURTO PRAZO (1-2 meses):**
Implemente **OPÇÃO 2** (Sincronização Sheets → BigQuery)

### **Para MÉDIO PRAZO (3-6 meses):**
Desenvolva **OPÇÃO 3** (Interface Admin)

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Agora (0 custo)
- [ ] Documentar processo de atualização manual
- [ ] Treinar equipe para usar BigQuery Console
- [ ] Criar templates SQL para operações comuns

### Fase 2: Curto Prazo (~4h dev)
- [ ] Criar script de sincronização Sheets → BigQuery
- [ ] Configurar GitHub Actions ou Vercel Cron
- [ ] Testar sincronização automática

### Fase 3: Médio Prazo (~2 semanas dev)
- [ ] Criar área `/admin` com autenticação
- [ ] Desenvolver formulários CRUD
- [ ] Implementar validações
- [ ] Adicionar logs de auditoria

---

## 🔄 FLUXO ATUAL vs FUTURO

### **ATUAL:**
```
Google Sheets → BigQuery (manual) → Views → API → Frontend
```

### **CURTO PRAZO:**
```
Google Sheets → Script → BigQuery → Views → API → Frontend
                 ↑
            (automático)
```

### **MÉDIO PRAZO:**
```
Interface Admin → API → BigQuery → Views → API → Frontend
                         ↑
                    (instantâneo)
```

---

## ❓ FAQ

### **P: Posso continuar usando Google Sheets?**
R: Sim! Basta configurar a sincronização automática (Opção 2)

### **P: Quanto custa cada opção?**
R: Todas são gratuitas! BigQuery tem 1TB/mês grátis, GitHub Actions é grátis para repos públicos

### **P: Qual é mais fácil?**
R: Opção 1 (BigQuery direto) é mais simples agora. Opção 2 é melhor a longo prazo.

### **P: Preciso saber programar?**
R: Opção 1: Não (só SQL básico). Opção 2: Sim (ou contratar). Opção 3: Sim (mais complexo)

---

## 🚀 PRÓXIMOS PASSOS

**Quer que eu implemente alguma dessas opções?**

1. Criar script de sincronização Sheets → BigQuery
2. Criar interface admin básica
3. Documentar processo manual atual

**Me avise qual você prefere!** 😊
