-- Índice: idx_alerts_severity
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_alerts_severity ON audit_logging.system_alerts(severity);