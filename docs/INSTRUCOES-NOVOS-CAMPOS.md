# 📋 Instruções: Adicionar Novos Campos de Gestão

## ✅ O que foi implementado até agora

1. **Filtro Automático** - Projetos abrem filtrados por "Em Desenvolvimento"
2. **Navegação Admin** - Botão Admin no header + atalho Ctrl+Shift+A + botão Voltar
3. **SQL Preparado** - Arquivo `bigquery-add-campos-gestao.sql` criado
4. **Tipos TypeScript** - Interfaces atualizadas com novos campos
5. **Estrutura correta** - Status APENAS em Projetos (não em produtos)

## 📊 Estrutura da Plataforma

### Hierarquia Correta:
```
PROJETO (tem status: Em Desenvolvimento/Entregue/Standby)
  ├── Dashboard (produto final - sem status)
  ├── Documentação (produto final - sem status)
  ├── Ferramenta (produto final - sem status)
  └── Pesquisa (produto final - sem status)
```

### Lógica:
- **Projetos** = Iniciativas com ciclo de vida → TEM status
- **Dashboards/Docs/Ferramentas/Pesquisas** = Produtos/entregas → SEM status
- **Campos de gestão** = Todos têm (data_inicio, responsavel, cliente, etc.)

## 🔧 Próximos Passos

### PASSO 1: Executar SQL no BigQuery

1. Abra o BigQuery Console
2. Abra o arquivo `bigquery-add-campos-gestao.sql`
3. Execute o SQL completo
4. Aguarde confirmação de sucesso

**Novos campos adicionados em TODAS as tabelas:**
- `data_inicio` (DATE) - Data de início
- `ultima_atualizacao` (TIMESTAMP) - Última atualização
- `responsavel` (STRING) - "Thiago" ou "Leandro"
- `cliente` (STRING) - "Interno" ou "Externo"
- `observacao` (STRING) - Observações gerais

**Campo status:**
- Já existe na tabela `projeto`
- NÃO foi adicionado nas outras tabelas (correto!)

### PASSO 2: Testar a Plataforma

Após executar o SQL:

1. Acesse a página principal
2. Verifique se o botão "Admin" aparece no header
3. Teste o atalho **Ctrl+Shift+A** para ir ao admin
4. No admin, clique em "Voltar ao Portal"
5. Na aba Projetos, verifique se está filtrado por "Em Desenvolvimento"
6. Veja os badges de status APENAS nos cards de projetos

### PASSO 3: Próximas Implementações

Agora vamos para a **Fase 3: Páginas de Detalhes** (1h)

#### O que será implementado:
- Criar rotas `/projetos/[id]`, `/dashboards/[id]`, `/docs/[id]`, etc.
- Adicionar botão "Detalhes" em cada card
- Página de detalhes mostrará:
  - **Informações básicas** (nome, descrição, área, link)
  - **Campos de gestão** (data_inicio, responsavel, cliente, observacao)
  - **Status** (apenas para projetos)
  - **Campos específicos** (tecnologias para projetos, etc.)

#### Objetivo:
Executivo pode clicar em "Detalhes" e ver todas as informações de gestão de forma organizada.

## 📝 Observações

- As views `*_v1` já incluem os novos campos automaticamente (usam `SELECT *`)
- As APIs já estão preparadas para normalizar os dados
- A busca global continuará funcionando normalmente
- Status aparece APENAS em projetos (design correto!)

## ❓ Pronto para continuar?

Execute o SQL e me avise para implementarmos a **Fase 3: Páginas de Detalhes**!
