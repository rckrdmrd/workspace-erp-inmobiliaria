-- =====================================================================================
-- Tabla: parent_notifications
-- Descripción: Notificaciones específicas para padres sobre progreso de hijos
-- Documentación: docs/03-fase-extensiones/EXT-010-parent-notifications/
-- Epic: EXT-010
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS auth_management.parent_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relaciones
    parent_account_id UUID NOT NULL REFERENCES auth_management.parent_accounts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,

    -- Tipo de notificación
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'daily_summary',        -- Resumen diario
        'weekly_report',        -- Reporte semanal
        'monthly_report',       -- Reporte mensual
        'low_performance',      -- Bajo rendimiento
        'inactivity_alert',     -- Alerta de inactividad
        'achievement_unlocked', -- Logro desbloqueado
        'rank_promotion',       -- Promoción de rango
        'assignment_due',       -- Assignment próximo a vencer
        'assignment_submitted', -- Assignment entregado
        'recommendation',       -- Recomendación pedagógica
        'custom'                -- Notificación personalizada
    )),

    -- Contenido
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    summary TEXT,                           -- Resumen breve

    -- Datos del estudiante (snapshot)
    student_snapshot JSONB DEFAULT '{}',   -- {total_xp, current_rank, modules_completed, etc.}

    -- Prioridad
    priority TEXT DEFAULT 'normal' CHECK (priority IN (
        'low',
        'normal',
        'high',
        'urgent'
    )),

    -- Canales de envío
    sent_via_email BOOLEAN DEFAULT false,
    sent_via_in_app BOOLEAN DEFAULT false,
    sent_via_push BOOLEAN DEFAULT false,

    -- Estado
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Pendiente de envío
        'sent',         -- Enviada
        'read',         -- Leída
        'archived'      -- Archivada
    )),

    -- Entidad relacionada (opcional)
    related_entity_type TEXT,               -- 'module', 'exercise', 'achievement', etc.
    related_entity_id UUID,

    -- Action URL (para abrir detalles)
    action_url TEXT,

    -- Timing
    scheduled_for TIMESTAMP WITH TIME ZONE, -- Cuándo enviar (para reportes programados)
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_parent_notifications_parent ON auth_management.parent_notifications(parent_account_id);
CREATE INDEX idx_parent_notifications_student ON auth_management.parent_notifications(student_id);
CREATE INDEX idx_parent_notifications_type ON auth_management.parent_notifications(notification_type);
CREATE INDEX idx_parent_notifications_status ON auth_management.parent_notifications(status);
CREATE INDEX idx_parent_notifications_priority ON auth_management.parent_notifications(priority);
CREATE INDEX idx_parent_notifications_unread ON auth_management.parent_notifications(parent_account_id, created_at DESC)
    WHERE status IN ('pending', 'sent');
CREATE INDEX idx_parent_notifications_scheduled ON auth_management.parent_notifications(scheduled_for)
    WHERE status = 'pending' AND scheduled_for IS NOT NULL;
CREATE INDEX idx_parent_notifications_created_at ON auth_management.parent_notifications(created_at DESC);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_parent_notifications_snapshot ON auth_management.parent_notifications USING GIN(student_snapshot);
CREATE INDEX idx_parent_notifications_metadata ON auth_management.parent_notifications USING GIN(metadata);

-- Trigger para updated_at
CREATE TRIGGER trg_parent_notifications_updated_at
    BEFORE UPDATE ON auth_management.parent_notifications
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE auth_management.parent_notifications IS 'Notificaciones específicas para padres sobre progreso, achievements y alertas de sus hijos. Epic EXT-010.';
COMMENT ON COLUMN auth_management.parent_notifications.notification_type IS 'Tipo de notificación (daily_summary, low_performance, achievement_unlocked, etc.)';
COMMENT ON COLUMN auth_management.parent_notifications.student_snapshot IS 'Snapshot del estado del estudiante en el momento de la notificación';
COMMENT ON COLUMN auth_management.parent_notifications.scheduled_for IS 'Timestamp para envío programado (reportes diarios/semanales/mensuales)';
COMMENT ON COLUMN auth_management.parent_notifications.sent_via_email IS 'Indica si se envió por email';
