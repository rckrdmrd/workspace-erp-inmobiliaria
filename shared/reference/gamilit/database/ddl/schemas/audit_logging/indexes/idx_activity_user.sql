-- Índice: idx_activity_user
-- Tabla: audit_logging
-- Schema: audit_logging

CREATE INDEX idx_activity_user ON audit_logging.user_activity_logs(user_id);