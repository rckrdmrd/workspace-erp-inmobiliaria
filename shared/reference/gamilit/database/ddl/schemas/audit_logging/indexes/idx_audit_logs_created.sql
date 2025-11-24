-- Índice: idx_audit_logs_created
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_audit_logs_created ON audit_logging.audit_logs(created_at DESC);