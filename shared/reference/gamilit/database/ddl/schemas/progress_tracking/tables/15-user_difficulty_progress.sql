-- =====================================================
-- Table: user_difficulty_progress
-- Description: Tracking del progreso de cada usuario por nivel de dificultad CEFR
-- Schema: progress_tracking
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================

CREATE TABLE IF NOT EXISTS progress_tracking.user_difficulty_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    difficulty_level educational_content.difficulty_level NOT NULL,

    -- Métricas de desempeño
    exercises_attempted INT NOT NULL DEFAULT 0,
    exercises_completed INT NOT NULL DEFAULT 0,
    exercises_correct_first_attempt INT NOT NULL DEFAULT 0,

    -- Tasa de éxito (calculada automáticamente)
    success_rate NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN exercises_attempted > 0
            THEN ROUND((exercises_correct_first_attempt::NUMERIC / exercises_attempted) * 100, 2)
            ELSE 0
        END
    ) STORED,

    -- Tiempo promedio
    total_time_spent_seconds BIGINT NOT NULL DEFAULT 0,
    avg_time_per_exercise NUMERIC(10,2) GENERATED ALWAYS AS (
        CASE
            WHEN exercises_completed > 0
            THEN ROUND(total_time_spent_seconds::NUMERIC / exercises_completed, 2)
            ELSE 0
        END
    ) STORED,

    -- Estado de promoción
    is_ready_for_promotion BOOLEAN NOT NULL DEFAULT FALSE,
    promoted_at TIMESTAMPTZ,

    -- Timestamps
    first_attempt_at TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMPTZ DEFAULT gamilit.now_mexico(),

    PRIMARY KEY (user_id, difficulty_level)
);

-- Índices para búsquedas y analytics
CREATE INDEX IF NOT EXISTS idx_user_difficulty_progress_user
    ON progress_tracking.user_difficulty_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_difficulty_progress_level
    ON progress_tracking.user_difficulty_progress(difficulty_level);

CREATE INDEX IF NOT EXISTS idx_user_difficulty_progress_success_rate
    ON progress_tracking.user_difficulty_progress(difficulty_level, success_rate DESC);

CREATE INDEX IF NOT EXISTS idx_user_difficulty_progress_ready_promotion
    ON progress_tracking.user_difficulty_progress(user_id, is_ready_for_promotion)
    WHERE is_ready_for_promotion = TRUE;

-- Política RLS
ALTER TABLE progress_tracking.user_difficulty_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_difficulty_progress_select_own
ON progress_tracking.user_difficulty_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY user_difficulty_progress_select_teacher
ON progress_tracking.user_difficulty_progress
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM auth_management.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_name = 'teacher'
    )
);

-- Trigger para updated_at
CREATE TRIGGER trg_user_difficulty_progress_updated_at
    BEFORE UPDATE ON progress_tracking.user_difficulty_progress
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE progress_tracking.user_difficulty_progress IS
'Tracking del progreso de cada usuario por nivel de dificultad CEFR (A1-C2+).
Incluye métricas de desempeño, tasas de éxito y tiempos promedio.
Las columnas success_rate y avg_time_per_exercise se calculan automáticamente.';

COMMENT ON COLUMN progress_tracking.user_difficulty_progress.success_rate IS
'Tasa de éxito calculada automáticamente: (correct_first_attempt / attempted) * 100';

COMMENT ON COLUMN progress_tracking.user_difficulty_progress.is_ready_for_promotion IS
'Flag que indica si el usuario cumple los criterios para promoción al siguiente nivel';

-- Grants
GRANT SELECT ON progress_tracking.user_difficulty_progress TO authenticated;
