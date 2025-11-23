-- Tabla: maya_ranks
-- Descripción: Configuración de rangos maya del sistema de gamificación
-- Schema: gamification_system
-- Creado: 2025-11-07
-- Versión: 1.0
-- Referencia: Migrado desde backend ranks.service.ts

-- ============================================================================
-- TABLA: maya_ranks (Configuración de rangos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS gamification_system.maya_ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificación del rango
    rank_name gamification_system.maya_rank NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Requisitos de XP
    min_xp_required BIGINT NOT NULL,
    max_xp_threshold BIGINT, -- NULL para el rango máximo (K'uk'ulkan)

    -- Recompensas y beneficios
    ml_coins_bonus INTEGER NOT NULL DEFAULT 0,
    xp_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.00,

    -- Requisitos adicionales
    missions_required INTEGER DEFAULT 0,
    modules_required INTEGER DEFAULT 0,

    -- Beneficios adicionales (JSONB flexible)
    perks JSONB DEFAULT '[]'::jsonb,
    -- Ejemplo: ["unlock_exclusive_content", "priority_support", "custom_avatar"]

    -- UI/UX
    icon TEXT,
    color TEXT,
    badge_image_url TEXT,

    -- Ordenamiento
    rank_order INTEGER NOT NULL UNIQUE,

    -- Progresión
    next_rank gamification_system.maya_rank,

    -- Metadatos
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT maya_ranks_xp_check CHECK (
        min_xp_required >= 0 AND
        (max_xp_threshold IS NULL OR max_xp_threshold > min_xp_required)
    ),
    CONSTRAINT maya_ranks_order_check CHECK (rank_order >= 1 AND rank_order <= 5),
    CONSTRAINT maya_ranks_multiplier_check CHECK (xp_multiplier >= 1.00 AND xp_multiplier <= 3.00)
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_maya_ranks_order
    ON gamification_system.maya_ranks(rank_order);

CREATE INDEX IF NOT EXISTS idx_maya_ranks_xp_range
    ON gamification_system.maya_ranks(min_xp_required, max_xp_threshold);

CREATE INDEX IF NOT EXISTS idx_maya_ranks_active
    ON gamification_system.maya_ranks(is_active)
    WHERE is_active = true;

-- ============================================================================
-- TRIGGER: Actualizar updated_at
-- ============================================================================

CREATE TRIGGER trg_maya_ranks_updated_at
    BEFORE UPDATE ON gamification_system.maya_ranks
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON TABLE gamification_system.maya_ranks IS
'Configuración de rangos maya del sistema de gamificación. Define requisitos de XP, recompensas y beneficios por rango.';

COMMENT ON COLUMN gamification_system.maya_ranks.rank_name IS
'Nombre del rango (ENUM): Ajaw, Nacom, Ah K''in, Halach Uinic, K''uk''ulkan';

COMMENT ON COLUMN gamification_system.maya_ranks.min_xp_required IS
'XP mínimo requerido para alcanzar este rango';

COMMENT ON COLUMN gamification_system.maya_ranks.max_xp_threshold IS
'XP máximo de este rango (NULL para rango máximo)';

COMMENT ON COLUMN gamification_system.maya_ranks.ml_coins_bonus IS
'ML Coins otorgados al alcanzar este rango';

COMMENT ON COLUMN gamification_system.maya_ranks.xp_multiplier IS
'Multiplicador de XP para usuarios con este rango (1.00 = 100%, 1.50 = 150%)';

COMMENT ON COLUMN gamification_system.maya_ranks.perks IS
'Beneficios adicionales del rango en formato JSONB (array de strings)';

COMMENT ON COLUMN gamification_system.maya_ranks.rank_order IS
'Orden del rango (1 = Ajaw, 5 = K''uk''ulkan)';

-- ============================================================================
-- REFERENCIADO POR
-- ============================================================================
-- Funciones que usan esta tabla:
-- - calculate_user_rank.sql
-- - get_user_rank_progress.sql
-- - get_user_rank_requirements.sql
-- - update_user_rank.sql

-- ============================================================================
-- NOTAS DE MIGRACIÓN
-- ============================================================================
-- Esta tabla fue creada para sincronizar la configuración de rangos que
-- estaba hardcodeada en backend (ranks.service.ts) con la base de datos.
--
-- Antes: Configuración en TypeScript (no actualizable sin deploy)
-- Después: Configuración en DB (actualizable dinámicamente)
--
-- Ver seed: seeds/prod/gamification_system/03-maya_ranks.sql
