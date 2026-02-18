# Painel Administrativo - Plataforma BI

## 📋 Visão Geral

O Painel Administrativo permite gerenciar todo o conteúdo da plataforma de BI sem precisar acessar o BigQuery Console diretamente.

## 🔐 Acesso

### URL
```
https://seu-dominio.vercel.app/admin
```

### Senha
A senha é configurada via variável de ambiente `ADMIN_PASSWORD`.

**Configurar no Vercel:**
1. Acesse o projeto no Vercel
2. Vá em Settings → Environment Variables
3. Adicione: `ADMIN_PASSWORD` = `sua-senha-segura`
4. Redeploy o projeto

**Padrão (desenvolvimento):**
- Senha: `admin123`

## 🎯 Funcionalidades

### 1. Gerenciar Projetos
- ✅ Criar novos projetos
- ✅ Editar projetos existentes
- ✅ Excluir projetos
- ✅ Campos: Nome, Descrição, Status, Data, Área, Link, Docs, Tecnologias

### 2. Gerenciar Dashboards
- ✅ Criar novos dashboards
- ✅ Editar dashboards existentes
- ✅ Excluir dashboards
- ✅ Campos: Nome, Descrição, Link, Área

### 3. Gerenciar Documentação
- ✅ Criar nova documentação
- ✅ Editar documentação existente
- ✅ Excluir documentação
- ✅ Campos: Processo (Nome), Descrição, Link, Área

### 4. Gerenciar Ferramentas
- ✅ Criar novas ferramentas
- ✅ Editar ferramentas existentes
- ✅ Excluir ferramentas
- ✅ Campos: Nome, Descrição, Link, Próxima Atualização

### 5. Gerenciar Pesquisas
- ✅ Criar novas pesquisas
- ✅ Editar pesquisas existentes
- ✅ Excluir pesquisas
- ✅ Campos: Título, Fonte, Link, Data, Conteúdo, Tema

## 📁 Estrutura de Arquivos Criados

```
app/
├── admin/
│   ├── layout.tsx              # Layout do painel admin
│   ├── page.tsx                # Dashboard principal
│   ├── login/
│   │   └── page.tsx            # Página de login
│   ├── logout/
│   │   └── route.ts            # Rota de logout
│   ├── projetos/
│   │   └── page.tsx            # Gerenciar projetos
│   └── dashboards/
│       └── page.tsx            # Gerenciar dashboards
│
├── api/
│   └── admin/
│       ├── login/
│       │   └── route.ts        # API de autenticação
│       ├── projetos/
│       │   ├── route.ts        # POST (criar projeto)
│       │   └── [id]/
│       │       └── route.ts    # PUT/DELETE (editar/excluir)
│       └── dashboards/
│           ├── route.ts        # POST (criar dashboard)
│           └── [id]/
│               └── route.ts    # PUT/DELETE (editar/excluir)
```

## 🚀 Como Usar

### 1. Acessar o Painel
1. Acesse `https://seu-dominio.vercel.app/admin`
2. Digite a senha configurada
3. Clique em "Entrar"

### 2. Criar Novo Item
1. Escolha a seção (Projetos, Dashboards, etc.)
2. Clique em "Novo [Item]"
3. Preencha os campos obrigatórios (marcados com *)
4. Clique em "Salvar"

### 3. Editar Item Existente
1. Encontre o item na lista
2. Clique no botão de editar (ícone de lápis)
3. Modifique os campos desejados
4. Clique em "Salvar"

### 4. Excluir Item
1. Encontre o item na lista
2. Clique no botão de excluir (ícone de lixeira)
3. Confirme a exclusão

### 5. Sair do Painel
- Clique em "Sair" no canto superior direito

## ⚠️ Importante

### Limitações Atuais
1. **UPDATE e DELETE não funcionam com GENERATE_UUID()**
   - O BigQuery não permite usar `GENERATE_UUID()` em WHERE clauses
   - **Solução temporária:** As tabelas precisam ter uma coluna `id` real
   - **Próximo passo:** Adicionar coluna `id` nas tabelas do BigQuery

### Como Corrigir (Executar no BigQuery Console)

```sql
-- 1. Adicionar coluna id nas tabelas
ALTER TABLE `worlddata-439415.lpdados.projeto`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.dashboard`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.docs`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.ferramentas`
ADD COLUMN IF NOT EXISTS id STRING;

ALTER TABLE `worlddata-439415.lpdados.pesquisas`
ADD COLUMN IF NOT EXISTS id STRING;

-- 2. Preencher IDs existentes
UPDATE `worlddata-439415.lpdados.projeto`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.dashboard`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.docs`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.ferramentas`
SET id = GENERATE_UUID()
WHERE id IS NULL;

UPDATE `worlddata-439415.lpdados.pesquisas`
SET id = GENERATE_UUID()
WHERE id IS NULL;

-- 3. Atualizar as views para usar o id real
CREATE OR REPLACE VIEW `worlddata-439415.lpdados.projetos_v1` AS
SELECT 
  id,
  COALESCE(Nome, nome, projeto) as nome,
  COALESCE(Descricao, descricao) as descricao,
  LOWER(TRIM(status)) as status,
  COALESCE(Data, data) as data,
  COALESCE(Link, link) as link,
  COALESCE(Docs, docs) as docs,
  COALESCE(Area, area) as area,
  IFNULL(tecnologias, []) as tecnologias,
  CURRENT_TIMESTAMP() as atualizado_em
FROM `worlddata-439415.lpdados.projeto`;

-- Repetir para outras views...
```

## 🔄 Próximos Passos

### Funcionalidades Pendentes
- [ ] Criar páginas admin para Docs, Ferramentas e Pesquisas
- [ ] Adicionar validação de campos
- [ ] Adicionar confirmação visual após salvar
- [ ] Adicionar paginação para listas grandes
- [ ] Adicionar busca dentro do admin
- [ ] Adicionar upload de imagens (opcional)
- [ ] Adicionar logs de auditoria (quem alterou o quê)

### Melhorias de Segurança
- [ ] Implementar autenticação mais robusta (NextAuth.js)
- [ ] Adicionar múltiplos usuários admin
- [ ] Adicionar permissões por usuário
- [ ] Adicionar rate limiting nas APIs

## 📊 Status Atual

### ✅ Implementado
- Login com senha
- Dashboard principal
- Gerenciamento de Projetos (UI completa)
- Gerenciamento de Dashboards (UI completa)
- APIs de CRUD para Projetos
- APIs de CRUD para Dashboards

### ⏳ Pendente
- Páginas admin para Docs, Ferramentas e Pesquisas
- Correção das queries UPDATE/DELETE (adicionar coluna id)
- Testes completos de todas as funcionalidades

## 🐛 Problemas Conhecidos

1. **UPDATE e DELETE não funcionam**
   - Causa: `GENERATE_UUID()` não pode ser usado em WHERE
   - Solução: Adicionar coluna `id` real nas tabelas (SQL acima)

2. **Sem feedback visual após salvar**
   - Solução: Adicionar toast notifications

3. **Sem validação de URLs**
   - Solução: Adicionar validação de formato de URL

## 💡 Dicas de Uso

1. **Sempre preencha os campos obrigatórios** (marcados com *)
2. **Use URLs completas** (começando com https://)
3. **Para tecnologias**, separe por vírgula: `Python, BigQuery, Looker`
4. **Teste em ambiente de desenvolvimento** antes de usar em produção
5. **Faça backup dos dados** antes de excluir itens importantes

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do Vercel
3. Verifique se a senha está configurada corretamente
4. Verifique se as credenciais do BigQuery estão corretas

---

**Última atualização:** 06 de Fevereiro de 2026
