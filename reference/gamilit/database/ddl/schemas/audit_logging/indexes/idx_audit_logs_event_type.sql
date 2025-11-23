-- Índice: idx_audit_logs_event_type
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_audit_logs_event_type ON audit_logging.audit_logs(event_type);