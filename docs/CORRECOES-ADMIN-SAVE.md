# Correções do Botão Salvar - Painel Admin

## Problema Identificado
O botão salvar no painel admin não estava funcionando devido a múltiplos problemas:

1. **APIs usando GENERATE_UUID() incorretamente**: As queries UPDATE usavam `WHERE GENERATE_UUID() = @id`, que gera um novo UUID a cada execução e nunca encontra o registro
2. **Campos de gestão faltando**: As APIs não estavam incluindo os novos campos de gestão (data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
3. **Frontends não enviando campos**: Os formulários não tinham inputs para os campos de gestão

## Correções Implementadas

### 1. APIs PUT/DELETE Corrigidas
Todas as APIs agora usam a estratégia correta:
- Buscar o registro pelo índice do array
- Pegar o nome/título original
- Usar o nome/título como identificador único no WHERE

**Arquivos corrigidos:**
- ✅ `app/api/admin/projetos/[id]/route.ts`
- ✅ `app/api/admin/dashboards/[id]/route.ts`
- ✅ `app/api/admin/docs/[id]/route.ts`
- ✅ `app/api/admin/ferramentas/[id]/route.ts`
- ✅ `app/api/admin/pesquisas/[id]/route.ts`

### 2. APIs POST Atualizadas
Todas as APIs POST agora incluem os campos de gestão:

**Arquivos atualizados:**
- ✅ `app/api/admin/projetos/route.ts` - Inclui campos de gestão + CURRENT_TIMESTAMP()
- ✅ `app/api/admin/dashboards/route.ts` - Inclui campos de gestão + CURRENT_TIMESTAMP()
- ✅ `app/api/admin/docs/route.ts` - Inclui campos de gestão + CURRENT_TIMESTAMP()
- ✅ `app/api/admin/ferramentas/route.ts` - Inclui campos de gestão + CURRENT_TIMESTAMP()
- ✅ `app/api/admin/pesquisas/route.ts` - Inclui campos de gestão + CURRENT_TIMESTAMP()

### 3. Frontends Atualizados
Todos os formulários agora incluem seção "Campos de Gestão" com:
- Data Início (date input)
- Responsável (select: Thiago/Leandro)
- Cliente (select: Interno/Externo)
- Observação (textarea)

**Arquivos atualizados:**
- ✅ `app/admin/projetos/page.tsx`
- ✅ `app/admin/dashboards/page.tsx`
- ✅ `app/admin/docs/page.tsx`
- ✅ `app/admin/ferramentas/page.tsx` - Criado do zero
- ✅ `app/admin/pesquisas/page.tsx` - Criado do zero

## Estrutura das Queries

### UPDATE (exemplo)
```sql
UPDATE `worlddata-439415.lpdados.projeto`
SET 
  Nome = @nome,
  Descricao = @descricao,
  status = @status,
  Data = @data,
  Link = @link,
  Docs = @docs,
  Area = @area,
  tecnologias = @tecnologias,
  data_inicio = @data_inicio,
  ultima_atualizacao = CURRENT_TIMESTAMP(),
  responsavel = @responsavel,
  cliente = @cliente,
  observacao = @observacao
WHERE Nome = @nomeOriginal OR nome = @nomeOriginal
```

### INSERT (exemplo)
```sql
INSERT INTO `worlddata-439415.lpdados.projeto` 
(Nome, Descricao, status, Data, Link, Docs, Area, tecnologias, data_inicio, ultima_atualizacao, responsavel, cliente, observacao)
VALUES (@nome, @descricao, @status, @data, @link, @docs, @area, @tecnologias, @data_inicio, CURRENT_TIMESTAMP(), @responsavel, @cliente, @observacao)
```

### DELETE (exemplo)
```sql
DELETE FROM `worlddata-439415.lpdados.projeto`
WHERE Nome = @nome OR nome = @nome
```

## Campos de Gestão

Todos os itens (Projetos, Dashboards, Docs, Ferramentas, Pesquisas) agora têm:

| Campo | Tipo | Obrigatório | Valores |
|-------|------|-------------|---------|
| data_inicio | DATE | Não | Qualquer data |
| ultima_atualizacao | TIMESTAMP | Sim (auto) | CURRENT_TIMESTAMP() |
| responsavel | STRING | Não | "Thiago" ou "Leandro" |
| cliente | STRING | Não | "Interno" ou "Externo" |
| observacao | STRING | Não | Texto livre |

## Próximos Passos

1. Testar o botão salvar em cada seção do admin:
   - [ ] Projetos - Editar projeto existente
   - [ ] Dashboards - Editar dashboard existente
   - [ ] Docs - Editar doc existente
   - [ ] Ferramentas - Editar ferramenta existente
   - [ ] Pesquisas - Editar pesquisa existente

2. Testar criação de novos itens com campos de gestão

3. Verificar se os campos de gestão aparecem nas páginas de detalhes

## Notas Técnicas

- O campo `ultima_atualizacao` é sempre atualizado automaticamente com `CURRENT_TIMESTAMP()`
- Os campos de gestão são opcionais (podem ser NULL)
- A estratégia de usar nome/título como identificador funciona porque são únicos por natureza
- O índice do array (`parseInt(id)`) é usado apenas para buscar o nome original, não como identificador permanente
