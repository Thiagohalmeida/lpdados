# 🚀 Guia Rápido - Painel Administrativo

## ⚡ Início Rápido

### 1. Configurar Senha (IMPORTANTE!)

**No Vercel:**
1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** `sua-senha-segura` (escolha uma senha forte!)
4. Clique em **Save**
5. Faça **Redeploy** do projeto

### 2. Preparar BigQuery (OBRIGATÓRIO!)

Execute este script no BigQuery Console:

```sql
-- Adicionar coluna id
ALTER TABLE `worlddata-439415.lpdados.projeto` ADD COLUMN IF NOT EXISTS id STRING;
ALTER TABLE `worlddata-439415.lpdados.dashboard` ADD COLUMN IF NOT EXISTS id STRING;
ALTER TABLE `worlddata-439415.lpdados.docs` ADD COLUMN IF NOT EXISTS id STRING;

-- Preencher IDs
UPDATE `worlddata-439415.lpdados.projeto` SET id = GENERATE_UUID() WHERE id IS NULL;
UPDATE `worlddata-439415.lpdados.dashboard` SET id = GENERATE_UUID() WHERE id IS NULL;
UPDATE `worlddata-439415.lpdados.docs` SET id = GENERATE_UUID() WHERE id IS NULL;
```

**Arquivo completo:** `bigquery-admin-setup.sql`

### 3. Acessar o Painel

1. Acesse: `https://seu-site.vercel.app/admin`
2. Digite a senha configurada
3. Pronto! 🎉

---

## 📝 Como Usar

### Criar Novo Item

1. Escolha a seção (Projetos, Dashboards, Docs)
2. Clique em **"Novo [Item]"**
3. Preencha os campos
4. Clique em **"Salvar"**

### Editar Item

1. Encontre o item na lista
2. Clique no ícone de **lápis** ✏️
3. Modifique os campos
4. Clique em **"Salvar"**

### Excluir Item

1. Encontre o item na lista
2. Clique no ícone de **lixeira** 🗑️
3. Confirme a exclusão

---

## ✅ Checklist de Implementação

### Antes de Usar
- [ ] Executar script SQL no BigQuery (`bigquery-admin-setup.sql`)
- [ ] Configurar `ADMIN_PASSWORD` no Vercel
- [ ] Fazer redeploy do projeto
- [ ] Testar login em `/admin`

### Funcionalidades Disponíveis
- [x] Login com senha
- [x] Gerenciar Projetos
- [x] Gerenciar Dashboards
- [x] Gerenciar Documentação
- [ ] Gerenciar Ferramentas (criar página)
- [ ] Gerenciar Pesquisas (criar página)

---

## 🎯 Campos por Seção

### Projetos
- **Nome** * (obrigatório)
- **Descrição** *
- **Status** * (Entregue / Em Desenvolvimento / Standby)
- **Data** *
- **Área** * (Tráfego, Growth, Financeiro, etc.)
- Link (opcional)
- Link da Documentação (opcional)
- Tecnologias (separadas por vírgula)

### Dashboards
- **Nome** *
- **Descrição** *
- **Link** *
- **Área** * (Tráfego, Growth, Financeiro, RH, Comercial, Planejamento)

### Documentação
- **Processo** * (nome do documento)
- **Descrição** *
- **Link** *
- **Área** *

---

## ⚠️ Importante

1. **Sempre execute o script SQL primeiro!** Sem isso, editar e excluir não funcionarão.
2. **Use uma senha forte** em produção (não use `admin123`).
3. **Teste em desenvolvimento** antes de usar em produção.
4. **Faça backup** antes de excluir itens importantes.

---

## 🐛 Problemas Comuns

### "Senha incorreta"
- Verifique se configurou `ADMIN_PASSWORD` no Vercel
- Verifique se fez redeploy após adicionar a variável

### "Erro ao salvar/excluir"
- Execute o script SQL `bigquery-admin-setup.sql`
- Verifique se as tabelas têm a coluna `id`

### "Não consigo acessar /admin"
- Verifique se o deploy foi bem-sucedido
- Limpe o cache do navegador (Ctrl+Shift+R)

---

## 📊 Status Atual

**Implementado:**
- ✅ Sistema de login
- ✅ Dashboard principal
- ✅ Gerenciamento de Projetos (completo)
- ✅ Gerenciamento de Dashboards (completo)
- ✅ Gerenciamento de Documentação (completo)

**Próximos Passos:**
- Criar páginas para Ferramentas e Pesquisas
- Adicionar notificações de sucesso/erro
- Adicionar validação de campos
- Adicionar busca dentro do admin

---

## 💡 Dicas

1. **Organize por área** - Use áreas consistentes para facilitar filtros
2. **URLs completas** - Sempre use `https://` nos links
3. **Descrições claras** - Ajudam os usuários a entender o conteúdo
4. **Teste antes de publicar** - Verifique se os links funcionam

---

**Precisa de ajuda?** Consulte o arquivo `PAINEL-ADMIN.md` para documentação completa.
