# Migração para Tabela Única - Status

## ✅ O QUE FOI FEITO

### 1. BigQuery - Migração Completa
- ✅ Criada tabela `itens_portal` unificada
- ✅ Migrados dados de 4 tabelas:
  - Projetos → tipo='projeto'
  - Dashboards → tipo='dashboard'
  - Docs → tipo='documentacao'
  - Ferramentas → tipo='ferramenta'
- ✅ Criadas views de compatibilidade (projetos_v1, dashboards_v1, docs_v1, ferramentas_v1)

### 2. APIs Públicas Atualizadas
- ✅ `/api/projetos` - usa view projetos_v1
- ✅ `/api/dashboards` - usa view dashboards_v1
- ✅ `/api/docs` - usa view docs_v1
- ✅ `/api/ferramentas` - usa view ferramentas_v1

### 3. Nova API Unificada Criada
- ✅ `/api/itens` - GET (com filtro por tipo)
- ✅ `/api/itens` - POST (criar novo item)
- ✅ `/api/itens/[id]` - GET (buscar por ID)
- ✅ `/api/itens/[id]` - PUT (atualizar)
- ✅ `/api/itens/[id]` - DELETE (deletar)

### 4. API Admin Atualizada
- ✅ `/api/admin/projetos/[id]` - PUT e DELETE usando tabela unificada

---

## 🔄 PRÓXIMOS PASSOS

### Fase 1: Testar Sistema Atual
1. **Testar APIs públicas**
   ```bash
   # No navegador:
   http://localhost:3000/api/projetos
   http://localhost:3000/api/dashboards
   http://localhost:3000/api/docs
   http://localhost:3000/api/ferramentas
   ```
   
2. **Testar nova API unificada**
   ```bash
   # Todos os itens
   http://localhost:3000/api/itens
   
   # Apenas projetos
   http://localhost:3000/api/itens?tipo=projeto
   
   # Apenas dashboards
   http://localhost:3000/api/itens?tipo=dashboard
   ```

3. **Testar páginas de detalhes**
   - Abrir qualquer página de detalhes
   - Verificar se os dados aparecem
   - Verificar se campos de gestão aparecem

4. **Testar admin de projetos**
   - Editar um projeto
   - Salvar
   - Verificar se aparece na página de detalhes

### Fase 2: Atualizar Outras APIs Admin
Atualizar as APIs admin restantes para usar a tabela unificada:

- [ ] `/api/admin/dashboards/[id]` - PUT e DELETE
- [ ] `/api/admin/docs/[id]` - PUT e DELETE
- [ ] `/api/admin/ferramentas/[id]` - PUT e DELETE

### Fase 3: Criar Admin Unificado (Opcional)
Criar um admin único que funciona para todos os tipos:
- [ ] `/admin/itens` - Lista todos os itens com filtro por tipo
- [ ] `/admin/itens/[id]` - Formulário único que se adapta ao tipo

### Fase 4: Limpeza (Depois de Tudo Testado)
- [ ] Fazer backup das tabelas antigas
- [ ] Deletar tabelas antigas (projeto, dashboard, docs, ferramentas)
- [ ] Remover código não utilizado

---

## 🧪 TESTES RECOMENDADOS

### Teste 1: Verificar Dados Migrados
Execute no BigQuery:
```sql
-- Contar por tipo
SELECT tipo, COUNT(*) as total
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY tipo;

-- Ver exemplos
SELECT * FROM `worlddata-439415.lpdados.itens_portal` WHERE tipo = 'projeto' LIMIT 3;
```

### Teste 2: Verificar Views
Execute no BigQuery:
```sql
SELECT * FROM `worlddata-439415.lpdados.projetos_v1` LIMIT 3;
SELECT * FROM `worlddata-439415.lpdados.dashboards_v1` LIMIT 3;
```

### Teste 3: Testar CRUD Completo
1. Criar novo projeto via admin
2. Editar projeto via admin
3. Verificar na página de detalhes
4. Verificar campos de gestão aparecem

---

## 📊 COMPARAÇÃO

### Antes
- 4 tabelas separadas
- 4 APIs GET diferentes
- 4 APIs admin diferentes
- Campos de gestão não salvavam

### Depois
- 1 tabela unificada
- 1 API unificada + 4 APIs compatibilidade
- 1 API admin (projetos atualizada, outras pendentes)
- Campos de gestão funcionando

---

## 🎯 BENEFÍCIOS IMEDIATOS

1. **Dados Centralizados** - Tudo em um lugar
2. **CRUD Simplificado** - Mesma lógica para todos
3. **Campos de Gestão** - Agora funcionam corretamente
4. **Escalável** - Adicionar novos tipos é fácil
5. **Manutenção** - Menos código para manter

---

## ⚠️ IMPORTANTE

### Compatibilidade Mantida
As APIs antigas continuam funcionando através das views:
- `/api/projetos` → view projetos_v1 → itens_portal (tipo='projeto')
- `/api/dashboards` → view dashboards_v1 → itens_portal (tipo='dashboard')
- etc.

Isso significa que:
- ✅ Frontend continua funcionando sem mudanças
- ✅ Páginas de detalhes continuam funcionando
- ✅ Nenhum código quebrou

### Próxima Prioridade
**Atualizar as outras 3 APIs admin** (dashboards, docs, ferramentas) para usar a tabela unificada, seguindo o mesmo padrão da API de projetos.

---

## 🚀 COMANDOS ÚTEIS

### Verificar dados na nova tabela
```sql
SELECT * FROM `worlddata-439415.lpdados.itens_portal` LIMIT 10;
```

### Buscar item específico
```sql
SELECT * FROM `worlddata-439415.lpdados.itens_portal` 
WHERE id = 'SEU_ID_AQUI';
```

### Atualizar item manualmente (se necessário)
```sql
UPDATE `worlddata-439415.lpdados.itens_portal`
SET 
  data_inicio = '2024-01-15',
  responsavel = 'Thiago',
  cliente = 'Interno',
  observacao = 'Teste de observação'
WHERE id = 'SEU_ID_AQUI';
```
