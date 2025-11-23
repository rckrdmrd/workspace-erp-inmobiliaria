-- =====================================================
-- Tabla: notifications
-- Schema: notifications
-- Descripción: Notificaciones enviadas a usuarios (in-app, email, push)
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE notifications.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Usuario destinatario
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Tipo de notificación
    -- Valores: 'achievement', 'mission', 'assignment', 'social', 'system', 'gamification'
    type VARCHAR(50) NOT NULL,

    -- Contenido
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    -- Datos adicionales (contexto específico del tipo)
    data JSONB DEFAULT '{}'::jsonb,

    -- Prioridad de la notificación
    -- Valores: 'low', 'normal', 'high', 'urgent'
    priority VARCHAR(20) DEFAULT 'normal',

    -- Canales de envío (array)
    -- Valores: 'in_app', 'email', 'push'
    channels VARCHAR(50)[] DEFAULT ARRAY['in_app'],

    -- Estado de la notificación
    -- Valores: 'pending', 'sent', 'read', 'failed'
    status VARCHAR(20) DEFAULT 'pending',

    -- Timestamps
    read_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    expires_at TIMESTAMP,

    -- Metadata adicional
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Constraints
    CONSTRAINT chk_notif_type CHECK (type IN ('achievement', 'mission', 'assignment', 'social', 'system', 'gamification')),
    CONSTRAINT chk_notif_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    CONSTRAINT chk_notif_status CHECK (status IN ('pending', 'sent', 'read', 'failed'))
);

-- Índices
CREATE INDEX idx_notif_user_id ON notifications.notifications(user_id);
CREATE INDEX idx_notif_status ON notifications.notifications(status);
CREATE INDEX idx_notif_type ON notifications.notifications(type);
CREATE INDEX idx_notif_created_at ON notifications.notifications(created_at DESC);
CREATE INDEX idx_notif_priority ON notifications.notifications(priority);

-- Índice compuesto para notificaciones no leídas por usuario
CREATE INDEX idx_notif_user_unread ON notifications.notifications(user_id, status)
    WHERE status IN ('pending', 'sent');

-- Índice para expiración
CREATE INDEX idx_notif_expires_at ON notifications.notifications(expires_at)
    WHERE expires_at IS NOT NULL;

-- Comentarios
COMMENT ON TABLE notifications.notifications IS 'Notificaciones enviadas a usuarios (in-app, email, push web)';
COMMENT ON COLUMN notifications.notifications.type IS 'Tipo de notificación: achievement, mission, assignment, social, system, gamification';
COMMENT ON COLUMN notifications.notifications.data IS 'Datos adicionales en formato JSON (IDs relacionados, payload específico)';
COMMENT ON COLUMN notifications.notifications.channels IS 'Array de canales por los que se envió: in_app, email, push';
COMMENT ON COLUMN notifications.notifications.status IS 'Estado: pending, sent, read, failed';
COMMENT ON COLUMN notifications.notifications.expires_at IS 'Fecha de expiración (opcional, para notificaciones temporales)';
