# Documentacao: Dicionario de Dados e Insights por Dashboard

Projeto: LP Dados  
Dataset BigQuery: `worlddata-439415.lpdados`  
Versao: 2.0.0  
Atualizado em: 2026-02-11

---

## 1. Objetivo

Este documento define a estrutura para armazenar e exibir, por dashboard:

- glossario (dicionario de dados)
- insights analiticos
- organizacao por guias (ex.: Instagram, Linkedin, YouTube)

A proposta foi ajustada para o estado atual do projeto, que ja usa `itens_portal` como tabela principal e pagina de detalhes em `/dashboards/[id]`.

---

## 2. Como encaixa no projeto atual

- Cadastro de dashboards continua em `itens_portal` (`tipo='dashboard'`)
- Novo modulo de conhecimento usa tabelas dedicadas:
  - `dashboard_doc_views`
  - `dashboard_doc_insights`
  - `dashboard_doc_glossary`
  - `dashboard_doc_payloads`
- A exibicao acontece dentro da pagina de detalhes do dashboard (`/dashboards/[id]`), agrupando por guia.

---

## 3. Modelo conceitual

### 3.1 Entidade `dashboard_doc_views`
Representa cada guia/seccao do dashboard (ex.: instagram, linkedin, youtube).

Campos principais:

- `dashboard_id` (STRING): ID do dashboard em `itens_portal`
- `view_id` (STRING): slug unico da guia
- `title` (STRING): nome exibido da guia
- `view_type` (STRING): `analysis` | `glossary` | `mixed`
- `sort_order` (INT64): ordem de exibicao
- `status` (STRING): `ativo` | `inativo`

### 3.2 Entidade `dashboard_doc_insights`
Insights analiticos de cada guia.

Campos principais:

- `dashboard_id`, `view_id`, `insight_id`
- `title`, `description`
- `notes` (ARRAY<STRING>)
- `tags` (ARRAY<STRING>)
- `sort_order`, `is_active`

### 3.3 Entidade `dashboard_doc_glossary`
Campos do glossario da guia.

Campos principais:

- `dashboard_id`, `view_id`, `field_id`
- `name`, `description`
- `formula`, `example`, `unit`
- `tags` (ARRAY<STRING>)
- `sort_order`, `is_active`

### 3.4 Entidade `dashboard_doc_payloads`
Snapshot JSON consolidado para historico, auditoria e rollback.

---

## 4. Contrato JSON de importacao (oficial)

```json
{
  "mode": "replace",
  "dashboard_id": "UUID_DO_DASHBOARD",
  "version": "1.0.0",
  "generated_at": "2026-02-11T10:00:00Z",
  "source": "Dashboard de BI | Visao - Control",
  "views": [
    {
      "view_id": "instagram",
      "title": "Instagram",
      "view_type": "mixed",
      "sort_order": 1,
      "status": "ativo",
      "metric_owner": "Time BI",
      "data_source": "Meta API",
      "insights": [
        {
          "insight_id": "top_posts_engagement",
          "title": "Top posts por engajamento",
          "description": "Posts com maior taxa de engajamento no periodo.",
          "notes": [
            "Comparar com periodo anterior",
            "Segregar por formato"
          ],
          "tags": ["engajamento", "conteudo"],
          "sort_order": 1
        }
      ],
      "glossary_fields": [
        {
          "field_id": "engagement_rate",
          "name": "% Engajamento",
          "description": "Interacoes / Alcance * 100",
          "formula": "(interacoes / alcance) * 100",
          "example": "4.3",
          "unit": "%",
          "tags": ["kpi", "instagram"],
          "sort_order": 1
        }
      ]
    }
  ]
}
```

### Regras do payload

- `dashboard_id` obrigatorio e deve existir em `itens_portal` como `tipo='dashboard'`
- `mode`:
  - `replace`: apaga docs anteriores do dashboard e grava o payload atual
  - `upsert`: atualiza/insere por chave e preserva registros nao enviados
- `view_id`, `insight_id`, `field_id` devem ser estaveis entre cargas
- arrays (`notes`, `tags`) devem ser sempre arrays (nunca `null`)

Aceitamos aliases para facilitar transformacao de extracao de PDF (via endpoint de normalizacao):

- Topo: `views` ou `tabs`/`guias`/`sections`
- Insights: `insights` ou `analises`/`items`
- Glossario: `glossary_fields` ou `dicionario`/`campos`

---

## 5. APIs implementadas

### 5.1 Publica

`GET /api/dashboard-docs/[dashboardId]`

Retorna payload consolidado por dashboard para exibicao no front.

### 5.2 Admin

`POST /api/admin/dashboard-docs/import`

- autenticacao via cookie `admin_auth=true`
- importa JSON em lote
- suporta `mode=replace|upsert`
- cria snapshot em `dashboard_doc_payloads`

`GET /api/admin/dashboard-docs/[dashboardId]`

- preview/auditoria do payload consolidado

`DELETE /api/admin/dashboard-docs/[dashboardId]?delete_snapshots=true|false`

- remove docs do dashboard
- opcionalmente remove snapshots

Painel web de operacao:

- `/admin/dashboard-docs` (upload de JSON, normalizacao e importacao)

---

## 6. Exibicao no portal

Sim: glossario e insights ficam dentro da pagina de detalhes do dashboard.

Fluxo pensado para o seu caso:

1. abrir dashboard (ex.: `Dashboard de BI | Visao - Control`)
2. exibir bloco "Dicionario de Dados e Insights"
3. dentro desse bloco, cada guia (Instagram, Linkedin, YouTube...) aparece separada
4. cada guia mostra:
   - lista de insights
   - tabela de glossario

Para outros dashboards, o comportamento e o mesmo, mudando apenas o conteudo importado por `dashboard_id`.

---

## 7. Fluxo operacional recomendado

1. cadastrar/confirmar dashboard em `itens_portal`
2. gerar JSON do dashboard (manual, script ou IA)
3. enviar para `POST /api/admin/dashboard-docs/import`
4. validar em `/dashboards/[id]`
5. repetir para cada dashboard

---

## 8. Governanca minima

- versionar sempre (`version`)
- preencher `source`
- padronizar slugs em `snake_case`
- usar `mode=replace` para publicacoes completas
- manter snapshots para rollback

---

## 9. SQL de setup

Executar arquivo:

- `bigquery-dashboard-docs-setup.sql`

Ele cria todas as tabelas necessarias para o modulo.

---

## 10. Status atual

- Documento atualizado para arquitetura atual
- SQL de criacao pronto
- APIs de leitura/importacao/admin criadas
- Painel admin `/admin/dashboard-docs` criado para normalizar/importar payload
- Tela de detalhes de dashboard preparada para exibir guias + glossario + insights
