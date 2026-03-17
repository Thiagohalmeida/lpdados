# Correção de Duplicatas - itens_portal

## 🔴 PROBLEMA IDENTIFICADO

### Erro no React
```
Error: Encountered two children with the same key, `1411c38f-bde4-4ded-8b3c-b18fefc3256b`
```

### Causa Raiz
- Os INSERTs da migração foram executados **duas vezes**
- Todos os registros foram duplicados na tabela `itens_portal`
- React detectou IDs duplicados ao renderizar listas
- Cada item aparece duas vezes nas views

## 📊 IMPACTO

### Dados Afetados
- ✅ Projetos: duplicados
- ✅ Dashboards: duplicados
- ✅ Documentação: duplicados
- ✅ Ferramentas: duplicados

### Sintomas
1. Erro de console no React (chave duplicada)
2. Itens aparecem duas vezes nas listagens
3. Contadores mostram o dobro do valor real
4. Performance degradada (queries retornam 2x mais dados)

## 🔧 SOLUÇÃO

### Script Criado
`bigquery-remove-duplicates.sql`

### Estratégia
1. **Identificar duplicatas**: Usar `ROW_NUMBER() OVER (PARTITION BY id, tipo, nome)`
2. **Manter registro mais recente**: `ORDER BY ultima_atualizacao DESC`
3. **Criar tabela temporária**: Sem duplicatas
4. **Fazer backup**: Salvar original antes de deletar
5. **Substituir tabela**: Trocar original pela versão limpa
6. **Verificar**: Confirmar que não há mais duplicatas

### Critério de Desduplicação
Para cada grupo de duplicatas (mesmo id, tipo, nome):
- **Mantém**: Registro com `ultima_atualizacao` mais recente
- **Remove**: Registros mais antigos

Se `ultima_atualizacao` for NULL em todos:
- **Mantém**: Primeiro registro encontrado

## 📝 INSTRUÇÕES DE EXECUÇÃO

### Passo 1: Abrir BigQuery Console
1. Acesse: https://console.cloud.google.com/bigquery
2. Selecione projeto: `worlddata-439415`
3. Abra o editor de queries

### Passo 2: Executar Verificação
```sql
-- Ver quantas duplicatas existem
SELECT 
  id,
  tipo,
  nome,
  COUNT(*) as total_duplicatas
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY id, tipo, nome
HAVING COUNT(*) > 1
ORDER BY total_duplicatas DESC;
```

**Resultado Esperado**: Lista de IDs duplicados (cada um aparece 2 vezes)

### Passo 3: Executar Script Completo
1. Copie todo o conteúdo de `bigquery-remove-duplicates.sql`
2. Cole no editor do BigQuery
3. Execute **PASSO POR PASSO** (não execute tudo de uma vez!)
4. Verifique o resultado de cada passo antes de continuar

### Passo 4: Verificar Resultado
```sql
-- Deve retornar 0 linhas (sem duplicatas)
SELECT 
  id,
  tipo,
  nome,
  COUNT(*) as total_duplicatas
FROM `worlddata-439415.lpdados.itens_portal`
GROUP BY id, tipo, nome
HAVING COUNT(*) > 1;
```

### Passo 5: Testar Aplicação
1. Recarregue a página no navegador (Ctrl+Shift+R)
2. Verifique que o erro de console desapareceu
3. Verifique que os contadores mostram valores corretos
4. Verifique que cada item aparece apenas 1 vez

## ✅ VALIDAÇÃO

### Checklist Pós-Execução
- [ ] Query de verificação retorna 0 duplicatas
- [ ] Contadores no hero section mostram valores corretos
- [ ] Erro de console React desapareceu
- [ ] Cada item aparece apenas 1 vez nas listagens
- [ ] Views continuam funcionando (projetos_v1, dashboards_v1, etc.)
- [ ] APIs retornam dados corretos
- [ ] Páginas de detalhes funcionam

### Valores Esperados (Aproximados)
Após remoção de duplicatas, você deve ter aproximadamente:
- **Projetos**: ~18 (metade do que tinha antes)
- **Dashboards**: ~X (metade)
- **Documentação**: ~Y (metade)
- **Ferramentas**: ~Z (metade)

## 🔄 ROLLBACK

Se algo der errado, você pode restaurar o backup:

```sql
-- Deletar tabela atual
DROP TABLE `worlddata-439415.lpdados.itens_portal`;

-- Restaurar do backup
CREATE OR REPLACE TABLE `worlddata-439415.lpdados.itens_portal` AS
SELECT * FROM `worlddata-439415.lpdados.itens_portal_backup_duplicatas`;
```

## 🎯 PREVENÇÃO FUTURA

### Como Evitar Duplicatas
1. **Antes de executar INSERTs**: Sempre verificar se os dados já existem
2. **Usar MERGE ao invés de INSERT**: Para operações idempotentes
3. **Adicionar constraint UNIQUE**: No BigQuery (se possível)
4. **Verificar contagem**: Antes e depois de cada operação

### Query Segura para Inserção
```sql
-- Ao invés de INSERT direto, use MERGE:
MERGE `worlddata-439415.lpdados.itens_portal` T
USING (SELECT * FROM fonte_dados) S
ON T.id = S.id AND T.tipo = S.tipo
WHEN NOT MATCHED THEN
  INSERT (id, tipo, nome, ...) VALUES (S.id, S.tipo, S.nome, ...);
```

## 📊 ESTATÍSTICAS

### Antes da Correção
```
Total de registros: ~72 (36 duplicados)
- Projetos: 36 (18 duplicados)
- Dashboards: X (X/2 duplicados)
- Docs: Y (Y/2 duplicados)
- Ferramentas: Z (Z/2 duplicados)
```

### Depois da Correção
```
Total de registros: ~36 (sem duplicatas)
- Projetos: 18 (únicos)
- Dashboards: X/2 (únicos)
- Docs: Y/2 (únicos)
- Ferramentas: Z/2 (únicos)
```

## 🚨 IMPORTANTE

### Backup Automático
O script cria automaticamente um backup em:
`worlddata-439415.lpdados.itens_portal_backup_duplicatas`

**NÃO DELETE O BACKUP** até confirmar que tudo funciona perfeitamente por pelo menos 24 horas.

### Impacto Zero
- ✅ Views continuam funcionando
- ✅ APIs continuam funcionando
- ✅ Frontend continua funcionando
- ✅ Nenhum código precisa ser alterado
- ✅ Apenas remove duplicatas, mantém dados corretos

## 📞 SUPORTE

Se encontrar problemas:
1. **NÃO ENTRE EM PÂNICO** - temos backup
2. Verifique os logs do BigQuery
3. Execute a query de rollback
4. Documente o erro encontrado
5. Peça ajuda se necessário

---

**Status**: 🟡 Aguardando Execução  
**Prioridade**: 🔴 ALTA (Erro bloqueando uso da aplicação)  
**Tempo Estimado**: 10-15 minutos  
**Risco**: 🟢 BAIXO (temos backup automático)
