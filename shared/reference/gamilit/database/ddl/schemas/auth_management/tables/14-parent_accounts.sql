-- =====================================================================================
-- Tabla: parent_accounts
-- Descripción: Cuentas de padres/tutores con configuraciones específicas del portal
-- Documentación: docs/03-fase-extensiones/EXT-010-parent-notifications/
-- Epic: EXT-010
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS auth_management.parent_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relación con profile (cada padre tiene un profile)
    profile_id UUID NOT NULL UNIQUE REFERENCES auth_management.profiles(id) ON DELETE CASCADE,

    -- Información del padre/tutor
    relationship_type TEXT CHECK (relationship_type IN (
        'mother',
        'father',
        'guardian',
        'tutor',
        'other'
    )),

    -- Preferencias de notificaciones
    notification_frequency TEXT DEFAULT 'weekly' CHECK (notification_frequency IN (
        'realtime',     -- En tiempo real
        'daily',        -- Resumen diario
        'weekly',       -- Resumen semanal
        'monthly',      -- Resumen mensual
        'on_demand'     -- Solo cuando el padre lo solicite
    )),

    -- Configuración de alertas
    alert_on_low_performance BOOLEAN DEFAULT true,      -- Alerta si hijo tiene bajo rendimiento
    alert_on_inactivity_days INTEGER DEFAULT 7,         -- Alerta si inactividad > N días
    alert_on_achievement_unlocked BOOLEAN DEFAULT true, -- Alerta cuando hijo desbloquea logro
    alert_on_rank_promotion BOOLEAN DEFAULT true,       -- Alerta en promoción de rango

    -- Preferencias de reporte
    preferred_report_format TEXT DEFAULT 'email' CHECK (preferred_report_format IN (
        'email',
        'in_app',
        'both'
    )),
    preferred_language TEXT DEFAULT 'es-MX',

    -- Dashboard preferences
    dashboard_widgets JSONB DEFAULT '["progress", "achievements", "activity", "recommendations"]',

    -- Nivel de acceso
    can_view_detailed_progress BOOLEAN DEFAULT true,
    can_view_exercise_attempts BOOLEAN DEFAULT true,
    can_receive_alerts BOOLEAN DEFAULT true,
    can_download_reports BOOLEAN DEFAULT true,

    -- Estado
    is_verified BOOLEAN DEFAULT false,      -- Verificado por la escuela/admin
    is_active BOOLEAN DEFAULT true,

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_parent_accounts_profile ON auth_management.parent_accounts(profile_id);
CREATE INDEX idx_parent_accounts_active ON auth_management.parent_accounts(is_active) WHERE is_active = true;
CREATE INDEX idx_parent_accounts_verified ON auth_management.parent_accounts(is_verified) WHERE is_verified = true;
CREATE INDEX idx_parent_accounts_notification_freq ON auth_management.parent_accounts(notification_frequency);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_parent_accounts_widgets ON auth_management.parent_accounts USING GIN(dashboard_widgets);

-- Trigger para updated_at
CREATE TRIGGER trg_parent_accounts_updated_at
    BEFORE UPDATE ON auth_management.parent_accounts
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE auth_management.parent_accounts IS 'Cuentas de padres/tutores con preferencias del portal y configuración de notificaciones. Epic EXT-010.';
COMMENT ON COLUMN auth_management.parent_accounts.relationship_type IS 'Tipo de relación con el estudiante (mother, father, guardian, tutor)';
COMMENT ON COLUMN auth_management.parent_accounts.notification_frequency IS 'Frecuencia de notificaciones (realtime, daily, weekly, monthly)';
COMMENT ON COLUMN auth_management.parent_accounts.alert_on_inactivity_days IS 'Días de inactividad para enviar alerta';
COMMENT ON COLUMN auth_management.parent_accounts.is_verified IS 'Indica si la cuenta fue verificada por la escuela o administrador';
