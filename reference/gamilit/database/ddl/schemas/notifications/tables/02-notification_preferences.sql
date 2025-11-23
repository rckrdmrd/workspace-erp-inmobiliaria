-- =====================================================
-- Tabla: notification_preferences
-- Schema: notifications
-- Descripción: Preferencias de notificaciones por usuario
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE notifications.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Usuario
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Tipo de notificación para el que aplica esta preferencia
    notification_type VARCHAR(50) NOT NULL,

    -- Canales habilitados
    in_app_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,

    -- Frecuencia de email
    -- Valores: 'immediate', 'daily', 'weekly', 'never'
    email_frequency VARCHAR(20) DEFAULT 'immediate',

    -- Horario de silencio (quiet hours)
    quiet_hours_start TIME,
    quiet_hours_end TIME,

    -- Zona horaria del usuario
    timezone VARCHAR(50) DEFAULT 'America/Mexico_City',

    -- Timestamps
    created_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMP DEFAULT gamilit.now_mexico(),

    -- Constraint: Un usuario solo puede tener una preferencia por tipo
    UNIQUE(user_id, notification_type),

    -- Constraint: Email frequency
    CONSTRAINT chk_email_frequency CHECK (email_frequency IN ('immediate', 'daily', 'weekly', 'never'))
);

-- Índices
CREATE INDEX idx_notif_prefs_user_id ON notifications.notification_preferences(user_id);
CREATE INDEX idx_notif_prefs_type ON notifications.notification_preferences(notification_type);

-- Comentarios
COMMENT ON TABLE notifications.notification_preferences IS 'Preferencias de notificaciones configuradas por cada usuario';
COMMENT ON COLUMN notifications.notification_preferences.notification_type IS 'Tipo de notificación: achievement, mission, assignment, etc.';
COMMENT ON COLUMN notifications.notification_preferences.email_frequency IS 'Frecuencia de envío de emails: immediate, daily, weekly, never';
COMMENT ON COLUMN notifications.notification_preferences.quiet_hours_start IS 'Hora de inicio del horario de silencio (no enviar notificaciones)';
COMMENT ON COLUMN notifications.notification_preferences.quiet_hours_end IS 'Hora de fin del horario de silencio';
COMMENT ON COLUMN notifications.notification_preferences.timezone IS 'Zona horaria del usuario para cálculo de quiet hours';
