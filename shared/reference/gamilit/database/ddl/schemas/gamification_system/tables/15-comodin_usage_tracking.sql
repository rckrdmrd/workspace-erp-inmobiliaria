-- =====================================================
-- Table: gamification_system.comodin_usage_tracking
-- Description: Tracking de uso de comodines por ejercicio para validar límites
-- Documentación: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-002-comodines.md
-- Epic: EAI-003
-- Created: 2025-11-08
-- =====================================================

CREATE TABLE gamification_system.comodin_usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL,
    attempt_id UUID NOT NULL,

    -- Contadores por tipo de comodín
    pistas_used INTEGER DEFAULT 0 CHECK (pistas_used >= 0 AND pistas_used <= 3),
    vision_lectora_used INTEGER DEFAULT 0 CHECK (vision_lectora_used >= 0 AND vision_lectora_used <= 1),
    segunda_oportunidad_used INTEGER DEFAULT 0 CHECK (segunda_oportunidad_used >= 0 AND segunda_oportunidad_used <= 1),

    -- Límites alcanzados
    pistas_limit_reached BOOLEAN DEFAULT false,
    vision_lectora_limit_reached BOOLEAN DEFAULT false,
    segunda_oportunidad_limit_reached BOOLEAN DEFAULT false,

    -- Metadata
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraint único por intento
    UNIQUE(user_id, exercise_id, attempt_id)
);

-- Índices
CREATE INDEX idx_comodin_tracking_user_id ON gamification_system.comodin_usage_tracking(user_id);
CREATE INDEX idx_comodin_tracking_exercise ON gamification_system.comodin_usage_tracking(exercise_id);
CREATE INDEX idx_comodin_tracking_attempt ON gamification_system.comodin_usage_tracking(attempt_id);
CREATE INDEX idx_comodin_tracking_limits ON gamification_system.comodin_usage_tracking(user_id, exercise_id)
    WHERE pistas_limit_reached = false
       OR vision_lectora_limit_reached = false
       OR segunda_oportunidad_limit_reached = false;

-- Trigger para actualizar last_used_at
CREATE TRIGGER trg_comodin_tracking_updated
    BEFORE UPDATE ON gamification_system.comodin_usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE gamification_system.comodin_usage_tracking IS 'Tracking de uso de comodines por intento para validar límites (máx 3 pistas, 1 visión lectora, 1 segunda oportunidad)';
COMMENT ON COLUMN gamification_system.comodin_usage_tracking.pistas_used IS 'Pistas usadas en este intento (máx 3)';
COMMENT ON COLUMN gamification_system.comodin_usage_tracking.vision_lectora_used IS 'Visión Lectora usada (máx 1)';
COMMENT ON COLUMN gamification_system.comodin_usage_tracking.segunda_oportunidad_used IS 'Segunda Oportunidad usada (máx 1)';
