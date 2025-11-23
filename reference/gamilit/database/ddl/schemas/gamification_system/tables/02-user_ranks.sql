-- =====================================================================================
-- Table: user_ranks
-- Schema: gamification_system
-- Description: Progresión de rangos maya del sistema de gamificación
--              Ajaw → Nacom → Ah K'in → Halach Uinic → K'uk'ulkan
-- =====================================================================================

CREATE TABLE gamification_system.user_ranks (
    -- Identificación
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tenant_id uuid,

    -- Información de rango
    current_rank gamification_system.maya_rank DEFAULT 'Ajaw'::gamification_system.maya_rank NOT NULL,
    previous_rank gamification_system.maya_rank,

    -- Progreso y métricas
    rank_progress_percentage integer DEFAULT 0,
    modules_required_for_next integer,
    modules_completed_for_rank integer DEFAULT 0,
    xp_required_for_next integer,
    xp_earned_for_rank integer DEFAULT 0,
    ml_coins_bonus integer DEFAULT 0,

    -- Certificaciones y badges
    certificate_url text,
    badge_url text,

    -- Fechas de logros
    achieved_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    previous_rank_achieved_at timestamp with time zone,

    -- Control de estado
    is_current boolean DEFAULT true,
    rank_metadata jsonb DEFAULT '{}'::jsonb,

    -- Auditoría
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),

    -- Constraints
    CONSTRAINT user_ranks_pkey PRIMARY KEY (id),
    CONSTRAINT user_ranks_rank_progress_percentage_check
        CHECK ((rank_progress_percentage >= 0) AND (rank_progress_percentage <= 100))
);

-- =====================================================================================
-- Comments
-- =====================================================================================

COMMENT ON TABLE gamification_system.user_ranks IS
    'Progresión de rangos maya: Ajaw → Nacom → Ah K''in → Halach Uinic → K''uk''ulkan';

COMMENT ON COLUMN gamification_system.user_ranks.current_rank IS
    'Rango maya actual del usuario';

COMMENT ON COLUMN gamification_system.user_ranks.ml_coins_bonus IS
    'Bonus de ML Coins otorgado al alcanzar el rango';

-- =====================================================================================
-- Indexes
-- =====================================================================================

CREATE INDEX idx_user_ranks_user_id
    ON gamification_system.user_ranks USING btree (user_id);

CREATE INDEX idx_user_ranks_current
    ON gamification_system.user_ranks USING btree (current_rank);

CREATE INDEX idx_user_ranks_is_current
    ON gamification_system.user_ranks USING btree (user_id, is_current)
    WHERE (is_current = true);

-- =====================================================================================
-- Foreign Keys
-- =====================================================================================

ALTER TABLE ONLY gamification_system.user_ranks
    ADD CONSTRAINT user_ranks_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY gamification_system.user_ranks
    ADD CONSTRAINT user_ranks_tenant_id_fkey
    FOREIGN KEY (tenant_id) REFERENCES auth_management.tenants(id) ON DELETE CASCADE;

-- =====================================================================================
-- Triggers
-- =====================================================================================

CREATE TRIGGER trg_user_ranks_updated_at
    BEFORE UPDATE ON gamification_system.user_ranks
    FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- =====================================================================================
-- Permissions
-- =====================================================================================

GRANT ALL ON TABLE gamification_system.user_ranks TO gamilit_user;
