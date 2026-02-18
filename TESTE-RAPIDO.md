# 🧪 Teste Rápido - Verificar se Está Funcionando

## ✅ CHECKLIST DE TESTE

### 1. Reiniciar o Servidor

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
pnpm dev
```

### 2. Testar APIs Diretamente

Abra no navegador:

#### **Projetos:**
```
http://localhost:3000/api/projetos
```
**Deve mostrar:** Array com projetos, cada um tendo `nome`, `descricao`, `status`, etc.

#### **Debug (ver estrutura):**
```
http://localhost:3000/api/debug-projetos
```
**Deve mostrar:** Estrutura completa dos dados

#### **Dashboards:**
```
http://localhost:3000/api/dashboards
```

#### **Docs:**
```
http://localhost:3000/api/docs
```

### 3. Verificar Console do Navegador

1. Abra a plataforma: `http://localhost:3000`
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**
4. **Procure por erros** (texto vermelho)

**Se tiver erro, me envie o texto!**

### 4. Verificar Network

1. Com DevTools aberto (F12)
2. Vá na aba **Network**
3. Recarregue a página (F5)
4. Procure por:
   - `/api/projetos` - deve retornar **200 OK**
   - `/api/dashboards` - deve retornar **200 OK**
   - `/api/busca` - deve retornar **200 OK**

**Se algum retornar erro (vermelho), clique nele e me envie a resposta**

---

## 🔍 PROBLEMAS COMUNS

### **Problema 1: Nomes dos projetos não aparecem**

**Causa:** Campos com nomes diferentes no BigQuery

**Solução:** Acesse `http://localhost:3000/api/debug-projetos` e me envie o resultado

---

### **Problema 2: Busca não funciona**

**Teste:**
1. Pressione Ctrl+K
2. Digite qualquer coisa
3. Abra o Console (F12)
4. Veja se aparece erro

**Possíveis causas:**
- API de busca com erro
- Views não criadas no BigQuery

**Solução:** Me envie o erro do console

---

### **Problema 3: Dados não carregam**

**Teste:**
1. Abra `http://localhost:3000/api/projetos`
2. Veja se retorna dados

**Se retornar vazio `[]`:**
- Views não têm dados
- Execute no BigQuery: `SELECT * FROM \`worlddata-439415.lpdados.projetos_v1\` LIMIT 5;`

---

## 📸 ME ENVIE

Para eu ajudar melhor, me envie:

1. **Screenshot da aba Projetos** (mostrando os cards)
2. **Resultado de:** `http://localhost:3000/api/debug-projetos`
3. **Console do navegador** (F12 → Console) se tiver erros
4. **Resultado de:** `SELECT * FROM \`worlddata-439415.lpdados.projetos_v1\` LIMIT 1;` no BigQuery

---

## ✅ SE TUDO FUNCIONAR

Você deve ver:
- ✅ Cards de projetos com **nomes visíveis**
- ✅ Busca global funcionando (Ctrl+K)
- ✅ Todas as abas carregando dados
- ✅ Filtros funcionando

---

## 🚀 PRÓXIMO PASSO

Depois que tudo funcionar, podemos:
1. Fazer deploy no Vercel
2. Implementar páginas de detalhes
3. Criar interface de atualização de dados

**Me avise o resultado dos testes!** 😊
