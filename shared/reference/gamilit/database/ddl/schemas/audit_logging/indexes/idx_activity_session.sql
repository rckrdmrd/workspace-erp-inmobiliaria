-- Índice: idx_activity_session
-- Tabla: ON
-- Schema: audit_logging

CREATE INDEX idx_activity_session ON audit_logging.user_activity_logs(session_id);