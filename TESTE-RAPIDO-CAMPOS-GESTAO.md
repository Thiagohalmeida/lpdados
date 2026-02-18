# Teste Rápido - Verificar Campos de Gestão

## 🎯 Objetivo
Verificar se os dados salvos no admin estão aparecendo nas páginas de detalhes.

---

## 📝 TESTE PASSO A PASSO

### 1️⃣ Escolha um Item para Testar
Escolha um projeto, dashboard, doc, ferramenta ou pesquisa que você editou recentemente no admin.

**Exemplo**: Vamos usar um projeto chamado "Portal BI"

---

### 2️⃣ Verifique no BigQuery
Abra o BigQuery Console e execute:

```sql
SELECT 
  projeto,
  data_inicio,
  ultima_atualizacao,
  responsavel,
  cliente,
  observacao
FROM `worlddata-439415.lpdados.projeto`
WHERE projeto = 'Portal BI'  -- Substitua pelo nome do seu projeto
LIMIT 1;
```

**Resultado Esperado**: Você deve ver os valores que salvou no admin.

---

### 3️⃣ Teste a API Debug
Abra no navegador:
```
http://localhost:3000/api/debug-all-tables
```

**O que verificar**:
- A tabela `projeto` deve ter as colunas: `data_inicio`, `ultima_atualizacao`, `responsavel`, `cliente`, `observacao`
- Os dados de exemplo devem mostrar valores (não null)

---

### 4️⃣ Teste a API Pública
Abra no navegador:
```
http://localhost:3000/api/projetos
```

**O que verificar**:
Procure o seu projeto no JSON e verifique se tem:
```json
{
  "id": "...",
  "nome": "Portal BI",
  "data_inicio": "2024-01-15",
  "ultima_atualizacao": "2024-02-09T10:30:00",
  "responsavel": "Thiago",
  "cliente": "Interno",
  "observacao": "Projeto prioritário para Q1"
}
```

---

### 5️⃣ Teste a Página de Detalhes

#### A. Limpe o Cache
Pressione **Ctrl+Shift+R** (ou **Ctrl+F5**) para fazer hard refresh

#### B. Acesse a Página
```
http://localhost:3000/projetos/portal-bi
```
(Substitua pelo ID correto do seu projeto)

#### C. Verifique os Cards

**Card "Gestão do Projeto"** deve mostrar:
- ✅ Data Início: 15/01/2024
- ✅ Última Atualização: 09/02/2024 10:30
- ✅ Responsável: Thiago
- ✅ Cliente: Interno

**Card "Observações"** deve aparecer se você preencheu o campo observação:
- ✅ Texto da observação

---

## 🔍 DIAGNÓSTICO POR ETAPA

### ❌ Dados NÃO aparecem no BigQuery (Etapa 2)
**Problema**: Dados não foram salvos
**Causa**: Erro ao salvar no admin
**Solução**: 
1. Verifique o console do navegador ao salvar
2. Verifique se há erros na API PUT
3. Tente salvar novamente

---

### ✅ BigQuery OK, ❌ API Debug NÃO mostra colunas (Etapa 3)
**Problema**: Views do BigQuery desatualizadas
**Solução**: Execute no BigQuery:
```sql
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT * FROM `worlddata-439415.lpdados.projeto`;
```

---

### ✅ API Debug OK, ❌ API Pública NÃO retorna campos (Etapa 4)
**Problema**: Código de normalização
**Solução**: Verificar código em `app/api/projetos/route.ts`

---

### ✅ API Pública OK, ❌ Página NÃO mostra dados (Etapa 5)
**Problema**: Cache ou erro de renderização
**Solução**:
1. Hard refresh (Ctrl+Shift+R)
2. Abra DevTools (F12) → Console → Verifique erros
3. Abra DevTools (F12) → Network → Verifique resposta da API

---

## 🎯 RESULTADO ESPERADO

Se tudo estiver funcionando:
1. ✅ BigQuery tem os dados
2. ✅ API debug mostra as colunas
3. ✅ API pública retorna os dados
4. ✅ Página de detalhes exibe os dados
5. ✅ Card de observações aparece (se preenchido)

---

## 📞 PRÓXIMOS PASSOS

Depois de fazer este teste, me informe:
1. **Em qual etapa parou de funcionar?**
2. **Qual mensagem de erro apareceu (se houver)?**
3. **Screenshot da página de detalhes**

Com essas informações, posso identificar exatamente onde está o problema e corrigi-lo.
