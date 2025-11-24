-- Índice: idx_alerts_triggered
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_alerts_triggered ON audit_logging.system_alerts(triggered_at DESC);