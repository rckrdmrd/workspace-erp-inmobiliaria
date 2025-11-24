-- Índice: idx_audit_logs_correlation
-- Tabla: ON
-- Schema: audit_logging

CREATE INDEX idx_audit_logs_correlation ON audit_logging.audit_logs(correlation_id) WHERE correlation_id IS NOT NULL;