-- Índice: idx_audit_logs_actor
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_audit_logs_actor ON audit_logging.audit_logs(actor_id);