-- =====================================================
-- TABLE: gamification_system.user_stats
-- =====================================================
-- Description: Estadísticas de gamificación por usuario
-- Includes: ML Coins, XP, levels, streaks, rankings, progress
-- Author: SA-MIGRACION-GAM-01
-- Date: 2025-11-02
-- Version: 1.0 (Migrated with validations)
--
-- 📚 Documentación:
-- Requerimiento: docs/01-requerimientos/02-gamificacion/RF-GAM-001-achievements.md
-- Requerimiento: docs/01-requerimientos/gamificacion/02-ECONOMIA-ML-COINS.md
-- Requerimiento: docs/01-requerimientos/02-gamificacion/RF-GAM-003-rangos-maya.md
-- Especificación: docs/02-especificaciones-tecnicas/02-gamificacion/ET-GAM-001-achievements.md
-- Especificación: docs/02-especificaciones-tecnicas/02-gamificacion/ET-GAM-002-comodines.md
--   (Nota: Incluye economía ML Coins y sistema de comodines)
-- Especificación: docs/02-especificaciones-tecnicas/02-gamificacion/ET-GAM-003-rangos-maya.md
-- =====================================================

-- =====================================================
-- DEPENDENCIES
-- =====================================================
-- Requires:
--   - auth.users (user_id FK)
--   - auth_management.tenants (tenant_id FK)
--   - gamilit.now_mexico() function
--   - gamilit.update_updated_at_column() function
--   - gamification_system.maya_rank ENUM (for current_rank)

-- =====================================================
-- TABLE DEFINITION
-- =====================================================

CREATE TABLE IF NOT EXISTS gamification_system.user_stats (
    -- =====================================================
    -- PRIMARY KEYS & IDENTIFIERS
    -- =====================================================
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tenant_id uuid,

    -- =====================================================
    -- LEVEL & XP SYSTEM
    -- =====================================================
    level integer DEFAULT 1 NOT NULL,
    total_xp integer DEFAULT 0 NOT NULL,
    xp_to_next_level integer DEFAULT 100 NOT NULL,

    -- =====================================================
    -- RANK SYSTEM (Maya Ranks)
    -- =====================================================
    -- AJUSTE 1: Agregado campo current_rank para alineación con tipo TS
    current_rank gamification_system.maya_rank DEFAULT 'Ajaw'::gamification_system.maya_rank,
    -- AJUSTE 2: Agregado campo rank_progress para alineación con tipo TS
    rank_progress numeric(5,2) DEFAULT 0.00,

    -- =====================================================
    -- ML COINS SYSTEM
    -- =====================================================
    ml_coins integer DEFAULT 100 NOT NULL,
    ml_coins_earned_total integer DEFAULT 100 NOT NULL,
    ml_coins_spent_total integer DEFAULT 0 NOT NULL,
    ml_coins_earned_today integer DEFAULT 0 NOT NULL,
    last_ml_coins_reset timestamp with time zone,

    -- =====================================================
    -- STREAK SYSTEM
    -- =====================================================
    current_streak integer DEFAULT 0 NOT NULL,
    max_streak integer DEFAULT 0 NOT NULL,
    streak_started_at timestamp with time zone,
    days_active_total integer DEFAULT 0 NOT NULL,

    -- =====================================================
    -- PROGRESS & COMPLETION METRICS
    -- =====================================================
    exercises_completed integer DEFAULT 0 NOT NULL,
    modules_completed integer DEFAULT 0 NOT NULL,
    total_score integer DEFAULT 0 NOT NULL,
    average_score numeric(5,2),
    -- AJUSTE 3: Agregado campo perfect_scores para alineación con tipo TS
    perfect_scores integer DEFAULT 0 NOT NULL,

    -- =====================================================
    -- ACHIEVEMENTS & REWARDS
    -- =====================================================
    achievements_earned integer DEFAULT 0 NOT NULL,
    certificates_earned integer DEFAULT 0 NOT NULL,

    -- =====================================================
    -- TIME TRACKING
    -- =====================================================
    total_time_spent interval DEFAULT '00:00:00'::interval NOT NULL,
    weekly_time_spent interval DEFAULT '00:00:00'::interval NOT NULL,
    sessions_count integer DEFAULT 0 NOT NULL,

    -- =====================================================
    -- PERIODIC XP & ACTIVITY
    -- =====================================================
    weekly_xp integer DEFAULT 0 NOT NULL,
    monthly_xp integer DEFAULT 0 NOT NULL,
    weekly_exercises integer DEFAULT 0 NOT NULL,

    -- =====================================================
    -- RANKING POSITIONS
    -- =====================================================
    global_rank_position integer,
    class_rank_position integer,
    school_rank_position integer,

    -- =====================================================
    -- ACTIVITY TIMESTAMPS
    -- =====================================================
    last_activity_at timestamp with time zone,
    last_login_at timestamp with time zone,

    -- =====================================================
    -- METADATA & AUDIT
    -- =====================================================
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico() NOT NULL,
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico() NOT NULL,

    -- =====================================================
    -- CONSTRAINTS
    -- =====================================================
    -- Primary Key
    CONSTRAINT user_stats_pkey PRIMARY KEY (id),

    -- Unique Constraints
    CONSTRAINT user_stats_user_id_key UNIQUE (user_id),

    -- Level Constraints
    CONSTRAINT user_stats_level_check CHECK (level > 0),
    CONSTRAINT user_stats_total_xp_check CHECK (total_xp >= 0),

    -- AJUSTE 4: Agregado constraint para rank_progress
    CONSTRAINT user_stats_rank_progress_check CHECK (rank_progress >= 0 AND rank_progress <= 100),

    -- AJUSTE 5: Removed constraint (current_rank now uses maya_rank ENUM type)
    -- CONSTRAINT user_stats_current_rank_check - Not needed, enforced by ENUM type

    -- ML Coins Constraints
    CONSTRAINT user_stats_ml_coins_check CHECK (ml_coins >= 0),
    CONSTRAINT user_stats_ml_coins_earned_total_check CHECK (ml_coins_earned_total >= 0),
    CONSTRAINT user_stats_ml_coins_spent_total_check CHECK (ml_coins_spent_total >= 0),

    -- Streak Constraints
    CONSTRAINT user_stats_current_streak_check CHECK (current_streak >= 0),
    CONSTRAINT user_stats_max_streak_check CHECK (max_streak >= 0),

    -- Progress Constraints
    CONSTRAINT user_stats_exercises_completed_check CHECK (exercises_completed >= 0),
    CONSTRAINT user_stats_modules_completed_check CHECK (modules_completed >= 0),
    -- AJUSTE 6: Agregado constraint para perfect_scores
    CONSTRAINT user_stats_perfect_scores_check CHECK (perfect_scores >= 0),

    -- AJUSTE 7: Agregado constraint para average_score
    CONSTRAINT user_stats_average_score_check CHECK (
        average_score IS NULL OR (average_score >= 0 AND average_score <= 100)
    ),

    -- Foreign Keys
    CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_stats_tenant_id_fkey FOREIGN KEY (tenant_id)
        REFERENCES auth_management.tenants(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================
-- User lookup (redundant due to UNIQUE, but explicit for documentation)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id
    ON gamification_system.user_stats USING btree (user_id);

-- Tenant filtering
CREATE INDEX IF NOT EXISTS idx_user_stats_tenant_id
    ON gamification_system.user_stats USING btree (tenant_id);

-- Leaderboard queries - Level
CREATE INDEX IF NOT EXISTS idx_user_stats_level
    ON gamification_system.user_stats USING btree (level);

-- AJUSTE 8: Agregado índice compuesto para leaderboard por nivel y tenant
CREATE INDEX IF NOT EXISTS idx_user_stats_tenant_level
    ON gamification_system.user_stats USING btree (tenant_id, level DESC);

-- Leaderboard queries - ML Coins
CREATE INDEX IF NOT EXISTS idx_user_stats_ml_coins
    ON gamification_system.user_stats USING btree (ml_coins);

-- Leaderboard queries - Streak
CREATE INDEX IF NOT EXISTS idx_user_stats_streak
    ON gamification_system.user_stats USING btree (current_streak DESC);

-- Leaderboard queries - Global Rank (partial index)
CREATE INDEX IF NOT EXISTS idx_user_stats_global_rank
    ON gamification_system.user_stats USING btree (global_rank_position)
    WHERE global_rank_position IS NOT NULL;

-- AJUSTE 9: Agregado índice para current_rank para queries de rankings mayas
CREATE INDEX IF NOT EXISTS idx_user_stats_current_rank
    ON gamification_system.user_stats USING btree (current_rank);

-- AJUSTE 10: Agregado índice para perfect_scores para leaderboards de perfección
CREATE INDEX IF NOT EXISTS idx_user_stats_perfect_scores
    ON gamification_system.user_stats USING btree (perfect_scores DESC);

-- =====================================================
-- TRIGGERS
-- =====================================================
-- Auto-update updated_at timestamp
CREATE TRIGGER trg_user_stats_updated_at
    BEFORE UPDATE ON gamification_system.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS (commented, to be enabled in separate RLS file)
-- ALTER TABLE gamification_system.user_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own stats
CREATE POLICY user_stats_select_own
    ON gamification_system.user_stats
    FOR SELECT
    USING (user_id = gamilit.get_current_user_id());

-- Policy: Admins can view all stats
CREATE POLICY user_stats_select_admin
    ON gamification_system.user_stats
    FOR SELECT
    USING (gamilit.is_admin());

-- Policy: System can update all stats (for triggers/functions)
CREATE POLICY user_stats_update_system
    ON gamification_system.user_stats
    FOR UPDATE
    USING (true);

-- =====================================================
-- GRANTS
-- =====================================================
GRANT ALL ON TABLE gamification_system.user_stats TO gamilit_user;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE gamification_system.user_stats IS
    'Estadísticas de gamificación por usuario - ML Coins, XP, streaks, rankings';

COMMENT ON COLUMN gamification_system.user_stats.level IS
    'Nivel actual del usuario (comienza en 1)';

COMMENT ON COLUMN gamification_system.user_stats.xp_to_next_level IS
    'XP necesaria para alcanzar el siguiente nivel';

COMMENT ON COLUMN gamification_system.user_stats.current_rank IS
    'Rango Maya actual del usuario (Ajaw, Nacom, Ah K''in, Halach Uinic, K''uk''ulkan)';

COMMENT ON COLUMN gamification_system.user_stats.rank_progress IS
    'Progreso hacia el siguiente rango (0-100%)';

COMMENT ON COLUMN gamification_system.user_stats.ml_coins IS
    'Monedas ML actuales del usuario (balance actual)';

COMMENT ON COLUMN gamification_system.user_stats.current_streak IS
    'Racha de días consecutivos activa';

COMMENT ON COLUMN gamification_system.user_stats.perfect_scores IS
    'Cantidad de ejercicios completados con puntuación perfecta (100%)';

COMMENT ON COLUMN gamification_system.user_stats.average_score IS
    'Puntuación promedio de todos los ejercicios (0-100)';

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- AJUSTES APLICADOS (10 total):
-- 1. Agregado campo current_rank (maya_rank ENUM) para alineación con tipo TS
-- 2. Agregado campo rank_progress (numeric 0-100) para alineación con tipo TS
-- 3. Agregado campo perfect_scores para alineación con tipo TS
-- 4. Agregado constraint rank_progress_check (0-100)
-- 5. ACTUALIZADO (2025-11-07): current_rank ahora usa maya_rank ENUM (constraint eliminado)
-- 6. Agregado constraint perfect_scores_check (>= 0)
-- 7. Agregado constraint average_score_check (0-100 o NULL)
-- 8. Agregado índice compuesto idx_user_stats_tenant_level
-- 9. Agregado índice idx_user_stats_current_rank
-- 10. Agregado índice idx_user_stats_perfect_scores
--
-- CAMPOS MANTENIDOS DEL BACKUP (no en tipo TS pero útiles):
-- - tenant_id: Necesario para multi-tenancy
-- - xp_to_next_level: Útil para UI de progreso
-- - ml_coins_earned_today: Para límites diarios
-- - days_active_total: Métrica de engagement
-- - modules_completed: Progreso educativo
-- - total_score: Suma total de puntos
-- - achievements_earned: Contador rápido
-- - certificates_earned: Contador rápido
-- - total_time_spent: Analítica de uso
-- - weekly_time_spent: Analítica semanal
-- - sessions_count: Métrica de engagement
-- - weekly_xp, monthly_xp: Leaderboards temporales
-- - weekly_exercises: Actividad semanal
-- - global_rank_position, class_rank_position, school_rank_position: Rankings pre-calculados
-- - last_ml_coins_reset: Control de resets diarios
-- - streak_started_at: Inicio de racha actual
-- - metadata: Flexibilidad para datos adicionales
--
-- DISCREPANCIAS DE NOMENCLATURA (mantenidas de backup):
-- - level (SQL) vs current_level (TS): Se mantiene "level" por simplicidad
-- - current_streak (SQL) vs streak_days (TS): Se mantiene "current_streak" por claridad
-- - max_streak (SQL) vs longest_streak (TS): Se mantiene "max_streak" por brevedad
-- - exercises_completed (SQL) vs total_exercises_completed (TS): Se mantiene sin "total_"
--
-- RECOMENDACIONES:
-- 1. Actualizar tipo TS UserStats para incluir campos extra útiles del SQL
-- 2. ✅ COMPLETADO (2025-11-07): Se creó ENUM maya_rank en gamification_system
-- 3. Evaluar si current_rank debe ser NOT NULL con default 'Ajaw'
-- 4. Documentar en tipo TS los campos de ranking pre-calculado
-- =====================================================
