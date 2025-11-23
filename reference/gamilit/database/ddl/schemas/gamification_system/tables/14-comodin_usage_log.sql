-- =====================================================
-- Table: gamification_system.comodin_usage_log
-- Description: Registro histórico de uso de comodines por usuario
-- Documentación: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-002-comodines.md
-- Epic: EAI-003
-- Created: 2025-11-08
-- =====================================================

CREATE TABLE gamification_system.comodin_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
    comodin_type gamification_system.comodin_type NOT NULL,

    -- Contexto de uso
    exercise_id UUID, -- Referencia al ejercicio donde se usó
    attempt_id UUID,  -- Referencia al intento específico
    module_id UUID,   -- Módulo asociado

    -- Efecto del comodín
    effect_applied TEXT, -- Descripción del efecto (ej: "revealed_hint_1", "highlighted_paragraph_3")
    value_provided JSONB, -- Valor específico proporcionado (ej: hint text, highlighted text)

    -- Metadata
    usage_context JSONB DEFAULT '{}', -- Contexto adicional (ej: tiempo restante, intentos previos)
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Índice para evitar duplicados en mismo intento
    UNIQUE(user_id, exercise_id, attempt_id, comodin_type)
);

-- Índices para queries comunes
CREATE INDEX idx_comodin_usage_log_user_id ON gamification_system.comodin_usage_log(user_id);
CREATE INDEX idx_comodin_usage_log_type ON gamification_system.comodin_usage_log(comodin_type);
CREATE INDEX idx_comodin_usage_log_exercise ON gamification_system.comodin_usage_log(exercise_id) WHERE exercise_id IS NOT NULL;
CREATE INDEX idx_comodin_usage_log_used_at ON gamification_system.comodin_usage_log(used_at DESC);
CREATE INDEX idx_comodin_usage_log_user_type_date ON gamification_system.comodin_usage_log(user_id, comodin_type, used_at DESC);

-- Índice GIN para context JSONB
CREATE INDEX idx_comodin_usage_log_context_gin ON gamification_system.comodin_usage_log USING GIN(usage_context);

-- Comentarios
COMMENT ON TABLE gamification_system.comodin_usage_log IS 'Log histórico de uso de comodines con contexto completo';
COMMENT ON COLUMN gamification_system.comodin_usage_log.effect_applied IS 'Efecto específico aplicado (revealed_hint_1, highlight, retry)';
COMMENT ON COLUMN gamification_system.comodin_usage_log.value_provided IS 'Valor JSONB del contenido proporcionado al usuario';
COMMENT ON COLUMN gamification_system.comodin_usage_log.usage_context IS 'Contexto adicional: tiempo restante, intentos previos, etc.';
