# Estudo - Saude dos Dados com Fonte Direta do BigQuery

**Data:** 16 de marco de 2026  
**Contexto:** Consolidacao do modelo de `Saude dos Dados` para aumentar visibilidade operacional e reduzir manutencao manual

---

## 1. Direcao Definida

O modelo aprovado para `Saude dos Dados` e:

- usar o BigQuery como fonte real da ultima atualizacao das tabelas
- manter o admin como camada de gestao e curadoria
- no admin, selecionar as tabelas relevantes para o portal em vez de digitar manualmente toda a informacao operacional
- manter o status como decisao operacional do admin
- exibir no portal apenas o contexto de negocio, sem metadado tecnico bruto

Essa direcao ja foi implementada e passa a ser a referencia do modulo.

---

## 2. Leitura Consolidada

Esse desenho atende bem aos objetivos de:

- reduzir manutencao manual
- aumentar confianca no dado exibido
- evitar que o card do portal dependa de alguem lembrar de atualizar a data
- dar contexto claro ao usuario quando houver problema

O ponto central e este:

**o metadado do BigQuery nao substitui totalmente a camada de gestao.**

Ele resolve muito bem:

- nome do dataset
- nome da tabela
- ultima atualizacao real

Ele nao resolve sozinho:

- nome amigavel para o portal
- quais tabelas devem aparecer para o usuario final
- impacto operacional ou de negocio
- observacao operacional
- proxima atualizacao esperada
- status operacional validado pela equipe

A conclusao consolidada e esta:

- BigQuery como fonte de ultima atualizacao real
- admin como camada de curadoria
- portal como camada de exibicao operacional amigavel

---

## 3. Modelo Aplicado

### Camada 1 - Metadado automatico do BigQuery

Fonte tecnica de verdade:

- `dataset_name`
- `table_name`
- `last_updated`

Na implementacao atual, essa camada vem da API de metadados do BigQuery.

### Camada 2 - Curadoria administrativa

Tabela propria do portal, no dominio `tabelas_status`, contendo:

- `id`
- `dataset_name`
- `table_name`
- `nome_tabela`
- `descricao`
- `impacto`
- `fonte`
- `responsavel`
- `proxima_atualizacao`
- `observacao`
- `ativo_portal`
- `status`

### Resultado final no portal

O frontend nao mostra a tabela bruta do BigQuery. Ele mostra a juncao:

- configuracao admin
- ultimo metadado real da tabela

Esse desenho melhora a confianca sem perder controle de experiencia.

---

## 4. Vantagens da Abordagem Hibrida

- elimina digitacao manual da ultima atualizacao
- reduz erro humano
- evita divergencia entre card e estado real da tabela
- mantem o portal limpo e orientado ao usuario
- permite escolher apenas as tabelas relevantes para o negocio
- preserva observacoes e contexto operacional no admin
- permite explicitar onde o problema afeta o negocio por meio do campo `impacto`

---

## 5. Riscos Evitados

### Risco 1 - Excesso de tabelas tecnicas

O portal nao le tudo do BigQuery sem curadoria.

### Risco 2 - `last_updated` nao significa sozinho saude do dado

Uma tabela pode ter sido atualizada tecnicamente e ainda assim merecer `alerta` ou `atrasado` por decisao operacional.

### Risco 3 - Nomes tecnicos ruins para usuario final

Os nomes tecnicos ficam restritos ao admin. O portal usa `nome_tabela` amigavel.

### Risco 4 - Falsa sensacao de automacao completa

Mesmo com `last_updated` automatico, ainda pode existir:

- manutencao programada
- atraso conhecido
- dependencia de pipeline externo
- impacto diferente dependendo da entrega afetada

Por isso a camada admin continua necessaria.

---

## 6. Como Foi Implementado sem Quebrar o que Ja Existia

### Fase A - Preservar a estrutura atual

O modulo existente foi mantido, mas a persistencia foi refatorada para que `ultima_atualizacao` deixe de ser entrada manual.

### Fase B - Criar fonte automatica do BigQuery

O catalogo de tabelas passou a ser carregado via API de metadados do BigQuery. Isso reduz dependencia de permissoes regionais em `INFORMATION_SCHEMA`.

### Fase C - Mudar a tabela admin

O admin agora salva:

- referencia da tabela real
- nome amigavel
- status operacional
- descricao
- impacto
- fonte
- observacoes e contexto
- ativo no portal

### Fase D - Juntar no backend

O backend monta a resposta do portal com:

- configuracao admin
- `last_updated` vindo do BigQuery
- `status` definido pela operacao admin
- `impacto` e `observacao` vindos da configuracao admin

### Fase E - Exibicao operacional no portal

O portal exibe:

- cards-resumo com total de `ok`, `alerta` e `atrasado`
- bloco adicional de atencao quando houver itens em `alerta` ou `atrasado`

Esse bloco adicional lista:

- nome amigavel da tabela
- impacto
- observacao

---

## 7. Impacto na Implementacao Atual

### O que foi reaproveitado

- widget publico do portal
- rotas publicas e admin de `Saude dos Dados`
- tela admin como ponto de operacao
- tipos TypeScript do dominio

### O que foi ajustado

- store deixou de tratar `ultima_atualizacao` como entrada manual
- admin passou a escolher tabela real do BigQuery
- backend passou a consultar metadados reais
- schema da tabela admin mudou de foco: de status manual puro para configuracao curada
- portal ganhou um bloco de visibilidade para itens com problema
- campo `impacto` entrou como parte da comunicacao operacional

---

## 8. Recomendacao Objetiva

O modelo correto para esta plataforma e:

- **BigQuery como fonte de ultima atualizacao**
- **admin como camada de curadoria**
- **portal como camada de exibicao amigavel**

Esse e o ponto de equilibrio entre automacao, governanca e UX.

---

## 9. Resultado Esperado para a Operacao

1. O admin seleciona as tabelas prioritarias a partir do catalogo real do BigQuery.
2. Cada tabela recebe status, descricao, observacao, fonte e impacto.
3. O portal exibe os totais por status.
4. Quando houver `alerta` ou `atrasado`, o portal explica claramente o problema com impacto e observacao.
5. O metadado tecnico bruto fica restrito ao admin.

---

## 10. Conclusao

- A ideia e boa
- O ganho operacional e real
- A implementacao correta e **hibrida**
- O portal nao deve mostrar leitura bruta de tabelas
- O modelo atual consolidado atende melhor ao objetivo operacional
