-- Índice: idx_alerts_status
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_alerts_status ON audit_logging.system_alerts(status);