-- =============================================================
-- PORTAL TELEMETRY SETUP
-- Projeto: worlddata-439415
-- Dataset: lpdados
-- =============================================================

CREATE TABLE IF NOT EXISTS `worlddata-439415.lpdados.portal_telemetry_events` (
  event_id STRING NOT NULL,
  event_ts TIMESTAMP NOT NULL,
  user_email STRING NOT NULL,
  event_type STRING NOT NULL,
  page_path STRING NOT NULL,
  page_title STRING,
  referrer STRING,
  session_id STRING,
  user_agent STRING,
  ip_hash STRING,
  metadata_json JSON
)
PARTITION BY DATE(event_ts)
CLUSTER BY user_email, page_path, event_type;

-- Verificacao
SELECT table_name
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.TABLES`
WHERE table_name = 'portal_telemetry_events';

SELECT column_name, data_type, is_nullable
FROM `worlddata-439415.lpdados.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'portal_telemetry_events'
ORDER BY ordinal_position;
