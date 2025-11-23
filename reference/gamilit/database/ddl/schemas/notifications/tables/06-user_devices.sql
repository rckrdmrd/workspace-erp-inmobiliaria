-- =====================================================
-- Tabla: user_devices
-- Schema: notifications
-- Descripción: Dispositivos registrados de usuarios para push notifications
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE notifications.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Usuario propietario del dispositivo
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Tipo de dispositivo
    -- Valores: 'web', 'mobile', 'desktop'
    device_type VARCHAR(20) NOT NULL,

    -- Token del dispositivo para push notifications
    -- (Firebase Cloud Messaging token, Web Push token, etc.)
    device_token TEXT NOT NULL,

    -- Información del navegador/dispositivo
    browser VARCHAR(50),
    os VARCHAR(50),

    -- Estado del dispositivo
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    last_used_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    created_at TIMESTAMP DEFAULT gamilit.now_mexico(),

    -- Constraint: Un usuario no puede tener el mismo token dos veces
    UNIQUE(user_id, device_token),

    -- Constraint: Tipo de dispositivo válido
    CONSTRAINT chk_user_devices_type CHECK (device_type IN ('web', 'mobile', 'desktop'))
);

-- Índices
CREATE INDEX idx_user_devices_user_id ON notifications.user_devices(user_id);

-- Índice para dispositivos activos (los únicos que reciben notificaciones)
CREATE INDEX idx_user_devices_active ON notifications.user_devices(is_active, user_id)
    WHERE is_active = true;

CREATE INDEX idx_user_devices_last_used ON notifications.user_devices(last_used_at DESC);

-- Comentarios
COMMENT ON TABLE notifications.user_devices IS 'Dispositivos registrados de usuarios para envío de push notifications';
COMMENT ON COLUMN notifications.user_devices.device_token IS 'Token del dispositivo para push (FCM, Web Push, etc.)';
COMMENT ON COLUMN notifications.user_devices.device_type IS 'Tipo de dispositivo: web, mobile, desktop';
COMMENT ON COLUMN notifications.user_devices.is_active IS 'Si el dispositivo está activo para recibir notificaciones';
COMMENT ON COLUMN notifications.user_devices.last_used_at IS 'Última vez que el usuario usó este dispositivo';
