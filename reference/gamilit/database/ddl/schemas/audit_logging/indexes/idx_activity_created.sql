-- Índice: idx_activity_created
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_activity_created ON audit_logging.user_activity_logs(created_at DESC);