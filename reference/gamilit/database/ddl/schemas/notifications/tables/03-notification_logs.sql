-- =====================================================
-- Tabla: notification_logs
-- Schema: notifications
-- Descripción: Log de envío de notificaciones por canal
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE notifications.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Notificación relacionada
    notification_id UUID NOT NULL REFERENCES notifications.notifications(id) ON DELETE CASCADE,

    -- Canal por el que se envió
    -- Valores: 'in_app', 'email', 'push'
    channel VARCHAR(20) NOT NULL,

    -- Estado del envío
    -- Valores: 'sent', 'delivered', 'failed', 'bounced'
    status VARCHAR(20) NOT NULL,

    -- Timestamps
    sent_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    delivered_at TIMESTAMP,

    -- Información de error (si falló)
    error_message TEXT,

    -- Respuesta del proveedor (SendGrid, Firebase, etc.)
    provider_response JSONB,

    -- Metadata adicional
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Constraints
    CONSTRAINT chk_notif_log_channel CHECK (channel IN ('in_app', 'email', 'push')),
    CONSTRAINT chk_notif_log_status CHECK (status IN ('sent', 'delivered', 'failed', 'bounced'))
);

-- Índices
CREATE INDEX idx_notif_logs_notification_id ON notifications.notification_logs(notification_id);
CREATE INDEX idx_notif_logs_channel ON notifications.notification_logs(channel);
CREATE INDEX idx_notif_logs_status ON notifications.notification_logs(status);
CREATE INDEX idx_notif_logs_sent_at ON notifications.notification_logs(sent_at DESC);

-- Comentarios
COMMENT ON TABLE notifications.notification_logs IS 'Log de envío de notificaciones por cada canal';
COMMENT ON COLUMN notifications.notification_logs.channel IS 'Canal de envío: in_app, email, push';
COMMENT ON COLUMN notifications.notification_logs.status IS 'Estado del envío: sent, delivered, failed, bounced';
COMMENT ON COLUMN notifications.notification_logs.provider_response IS 'Respuesta del proveedor externo (SendGrid, Firebase, etc.)';
