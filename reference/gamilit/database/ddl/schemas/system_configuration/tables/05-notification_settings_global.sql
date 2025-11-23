-- =====================================================
-- Table: system_configuration.notification_settings_global
-- Description: Configuración global de notificaciones del sistema
-- Version: 1.0
-- Created: 2025-11-11
-- Author: Database Team
-- =====================================================
--
-- PROPÓSITO:
-- Define configuración a nivel de sistema para tipos de notificaciones.
-- Configuración GLOBAL que aplica por defecto a todos los usuarios.
--
-- DIFERENCIA CON auth_management.notification_settings:
-- - Esta tabla: Configuración GLOBAL del sistema (sin user_id)
-- - auth_management.notification_settings: Preferencias POR USUARIO (con user_id NOT NULL)
--
-- ALCANCE:
-- - Templates de notificaciones por tipo
-- - Canales habilitados globalmente
-- - Throttling y batching de notificaciones
-- - Prioridades por defecto
--
-- CASOS DE USO:
-- 1. Definir qué notificaciones están habilitadas a nivel sistema
-- 2. Configurar templates para cada tipo de notificación
-- 3. Establecer throttling para evitar spam
-- 4. Configurar batching de notificaciones similares
--
-- DEPENDENCIAS:
-- - Ninguna (tabla standalone de configuración)
--
-- SEGURIDAD:
-- - RLS habilitado para solo admins
-- - Auditoría de cambios en updated_at
--
-- REFERENCIAS:
-- - Docs: docs/02-especificaciones-tecnicas/system-configuration/
-- - Seed: seeds/prod/system_configuration/03-notification_settings_global.sql
-- - User settings: auth_management.notification_settings
--
-- =====================================================

-- Validar schema existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'system_configuration') THEN
        RAISE EXCEPTION 'Schema system_configuration no existe. Ejecutar 00-prerequisites.sql primero.';
    END IF;
END $$;

-- Crear tabla
CREATE TABLE IF NOT EXISTS system_configuration.notification_settings_global (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tipo de notificación
    notification_type TEXT NOT NULL,

    -- Canal de entrega
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'in_app')),

    -- Control
    is_enabled BOOLEAN NOT NULL DEFAULT true,

    -- Prioridad
    priority TEXT CHECK (priority IN ('urgent', 'high', 'normal', 'low')),

    -- Template
    template_id UUID,

    -- Throttling
    throttle_minutes INTEGER DEFAULT 0 CHECK (throttle_minutes >= 0),

    -- Batching
    batch_enabled BOOLEAN DEFAULT false,
    batch_window_minutes INTEGER CHECK (
        (batch_enabled = false) OR
        (batch_enabled = true AND batch_window_minutes IS NOT NULL AND batch_window_minutes > 0)
    ),

    -- Configuración adicional
    settings JSONB DEFAULT '{}'::jsonb,

    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT gamilit.now_mexico(),

    -- Constraints
    CONSTRAINT notification_settings_global_unique
        UNIQUE(notification_type, channel)
);

-- Comentarios de tabla
COMMENT ON TABLE system_configuration.notification_settings_global IS
'Configuración GLOBAL de notificaciones a nivel de sistema.
Define comportamiento por defecto para cada tipo de notificación y canal.

IMPORTANTE: Esta es configuración GLOBAL del sistema.
Para preferencias de usuario, ver auth_management.notification_settings

Versión: 1.0
Creado: 2025-11-11
Propósito: Configuración de sistema de notificaciones';

-- Comentarios de columnas
COMMENT ON COLUMN system_configuration.notification_settings_global.id IS
'Identificador único de la configuración';

COMMENT ON COLUMN system_configuration.notification_settings_global.notification_type IS
'Tipo de notificación. Ejemplos:
- achievement_unlocked
- rank_promotion
- message_received
- assignment_due
- exercise_feedback
- level_up
- ml_coins_earned
- streak_milestone
Ver gamification_system.notification_type ENUM para valores válidos.';

COMMENT ON COLUMN system_configuration.notification_settings_global.channel IS
'Canal de entrega de la notificación:
- email: Correo electrónico
- sms: Mensaje de texto
- push: Notificación push (móvil/web)
- in_app: Notificación dentro de la app';

COMMENT ON COLUMN system_configuration.notification_settings_global.is_enabled IS
'Si este tipo de notificación está habilitado globalmente.
false = ningún usuario recibirá esta notificación, sin importar sus preferencias.';

COMMENT ON COLUMN system_configuration.notification_settings_global.priority IS
'Prioridad de la notificación:
- urgent: Requiere acción inmediata
- high: Importante pero no urgente
- normal: Informativa estándar
- low: Informativa de baja prioridad';

COMMENT ON COLUMN system_configuration.notification_settings_global.template_id IS
'ID del template a usar para renderizar la notificación.
Referencia a content_management.content_templates (si existe).
NULL = usar template por defecto del sistema.';

COMMENT ON COLUMN system_configuration.notification_settings_global.throttle_minutes IS
'Minutos mínimos entre notificaciones del mismo tipo al mismo usuario.
0 = sin throttling (enviar siempre).
Ejemplo: 60 = máximo 1 notificación por hora de este tipo.';

COMMENT ON COLUMN system_configuration.notification_settings_global.batch_enabled IS
'Si se deben agrupar notificaciones similares antes de enviar.
true = esperar batch_window_minutes y enviar resumen.
false = enviar cada notificación individualmente.';

COMMENT ON COLUMN system_configuration.notification_settings_global.batch_window_minutes IS
'Ventana de tiempo para agrupar notificaciones en batch.
Solo aplicable si batch_enabled = true.
Ejemplo: 30 = agrupar notificaciones de los últimos 30 minutos.';

COMMENT ON COLUMN system_configuration.notification_settings_global.settings IS
'Configuración adicional en formato JSON. Puede incluir:
{
  "sender_name": "GAMILIT Platform",
  "sender_email": "noreply@gamilit.com",
  "cc": ["admin@gamilit.com"],
  "reply_to": "support@gamilit.com",
  "attachments_enabled": false,
  "rich_formatting": true,
  "include_unsubscribe_link": true
}';

-- Validación de datos
DO $$
BEGIN
    -- Validar que gamilit.now_mexico() existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'gamilit' AND p.proname = 'now_mexico'
    ) THEN
        RAISE WARNING 'Función gamilit.now_mexico() no existe. Los timestamps usarán UTC.';
    END IF;

    RAISE NOTICE '✓ Tabla system_configuration.notification_settings_global creada exitosamente';
END $$;
