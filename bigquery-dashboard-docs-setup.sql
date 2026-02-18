-- =============================================================
-- DASHBOARD DOCS SETUP (Glossary + Insights per dashboard tab)
-- Projeto: worlddata-439415
-- Dataset: lpdados
-- Data: 2026-02-11
-- =============================================================

-- 1) Views/tabs de contexto por dashboard
CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.dashboard_doc_views` (
  dashboard_id STRING NOT NULL,
  view_id STRING NOT NULL,
  title STRING NOT NULL,
  view_type STRING NOT NULL, -- analysis | glossary | mixed
  source STRING,
  version STRING,
  generated_at TIMESTAMP,
  sort_order INT64 DEFAULT 0,
  status STRING DEFAULT 'ativo', -- ativo | inativo
  metric_owner STRING,
  data_source STRING,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(created_at)
CLUSTER BY dashboard_id, view_id;

-- 2) Insights analiticos
CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.dashboard_doc_insights` (
  dashboard_id STRING NOT NULL,
  view_id STRING NOT NULL,
  insight_id STRING NOT NULL,
  title STRING NOT NULL,
  description STRING NOT NULL,
  notes ARRAY<STRING>,
  tags ARRAY<STRING>,
  sort_order INT64 DEFAULT 0,
  is_active BOOL DEFAULT TRUE,
  source_file STRING,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(created_at)
CLUSTER BY dashboard_id, view_id, insight_id;

-- 3) Glossario de dados
CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.dashboard_doc_glossary` (
  dashboard_id STRING NOT NULL,
  view_id STRING NOT NULL,
  field_id STRING NOT NULL,
  name STRING NOT NULL,
  description STRING NOT NULL,
  formula STRING,
  example STRING,
  unit STRING,
  tags ARRAY<STRING>,
  sort_order INT64 DEFAULT 0,
  is_active BOOL DEFAULT TRUE,
  source_file STRING,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(created_at)
CLUSTER BY dashboard_id, view_id, field_id;

-- 4) Snapshot do payload consolidado para rollback/versionamento
CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.dashboard_doc_payloads` (
  payload_id STRING NOT NULL,
  dashboard_id STRING NOT NULL,
  version STRING,
  generated_at TIMESTAMP,
  source STRING,
  payload_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(created_at)
CLUSTER BY dashboard_id;

-- -------------------------------------------------------------
-- Queries de verificacao
-- -------------------------------------------------------------

SELECT table_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.TABLES`
WHERE table_name IN (
  'dashboard_doc_views',
  'dashboard_doc_insights',
  'dashboard_doc_glossary',
  'dashboard_doc_payloads'
)
ORDER BY table_name;

SELECT column_name, data_type, is_nullable
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'dashboard_doc_views'
ORDER BY ordinal_position;

-- -------------------------------------------------------------
-- Recomendado para rotina de carga
-- 1) use /api/admin/dashboard-docs/import com mode='replace' para carga completa
-- 2) use mode='upsert' para incrementos
-- -------------------------------------------------------------
