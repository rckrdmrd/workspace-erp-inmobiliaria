-- =====================================================
-- Tabla: notification_queue
-- Schema: notifications
-- Descripción: Cola de envío de notificaciones (para procesamiento asíncrono)
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE notifications.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Notificación a enviar
    notification_id UUID NOT NULL REFERENCES notifications.notifications(id) ON DELETE CASCADE,

    -- Canal por el que se debe enviar
    -- Valores: 'in_app', 'email', 'push'
    channel VARCHAR(20) NOT NULL,

    -- Cuándo enviar (para notificaciones programadas)
    scheduled_for TIMESTAMP NOT NULL,

    -- Prioridad numérica (mayor = más prioritario)
    -- Valores: 10 (urgent), 5 (high), 0 (normal), -5 (low)
    priority INTEGER DEFAULT 0,

    -- Control de reintentos
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,

    -- Estado
    -- Valores: 'queued', 'processing', 'sent', 'failed'
    status VARCHAR(20) DEFAULT 'queued',

    -- Timestamp del último intento
    last_attempt_at TIMESTAMP,

    -- Mensaje de error (si falló)
    error_message TEXT,

    -- Timestamp de creación
    created_at TIMESTAMP DEFAULT gamilit.now_mexico(),

    -- Constraints
    CONSTRAINT chk_notif_queue_channel CHECK (channel IN ('in_app', 'email', 'push')),
    CONSTRAINT chk_notif_queue_status CHECK (status IN ('queued', 'processing', 'sent', 'failed')),
    CONSTRAINT chk_notif_queue_attempts CHECK (attempts >= 0 AND attempts <= max_attempts)
);

-- Índices
-- Índice principal para procesar cola (por fecha programada y estado)
CREATE INDEX idx_notif_queue_scheduled ON notifications.notification_queue(scheduled_for, status)
    WHERE status IN ('queued', 'processing');

CREATE INDEX idx_notif_queue_status ON notifications.notification_queue(status);
CREATE INDEX idx_notif_queue_priority ON notifications.notification_queue(priority DESC);
CREATE INDEX idx_notif_queue_notification_id ON notifications.notification_queue(notification_id);

-- Índice para limpiar registros viejos
CREATE INDEX idx_notif_queue_created_at ON notifications.notification_queue(created_at)
    WHERE status IN ('sent', 'failed');

-- Comentarios
COMMENT ON TABLE notifications.notification_queue IS 'Cola de envío de notificaciones para procesamiento asíncrono';
COMMENT ON COLUMN notifications.notification_queue.scheduled_for IS 'Timestamp para envío programado';
COMMENT ON COLUMN notifications.notification_queue.priority IS 'Prioridad numérica: 10 (urgent), 5 (high), 0 (normal), -5 (low)';
COMMENT ON COLUMN notifications.notification_queue.attempts IS 'Número de intentos de envío realizados';
COMMENT ON COLUMN notifications.notification_queue.status IS 'Estado: queued, processing, sent, failed';
