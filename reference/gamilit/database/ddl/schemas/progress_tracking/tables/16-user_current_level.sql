-- =====================================================
-- Table: user_current_level
-- Description: Nivel actual del estudiante (denormalizado para performance)
-- Schema: progress_tracking
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================

CREATE TABLE IF NOT EXISTS progress_tracking.user_current_level (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_level educational_content.difficulty_level NOT NULL DEFAULT 'beginner',
    previous_level educational_content.difficulty_level,

    -- Control de zona de desarrollo próximo
    max_allowed_level educational_content.difficulty_level NOT NULL DEFAULT 'elementary',

    -- Placement test
    placement_test_completed BOOLEAN NOT NULL DEFAULT FALSE,
    placement_test_score NUMERIC(5,2),
    placement_test_date TIMESTAMPTZ,

    -- Timestamps
    level_changed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMPTZ DEFAULT gamilit.now_mexico()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_current_level_level
    ON progress_tracking.user_current_level(current_level);

CREATE INDEX IF NOT EXISTS idx_user_current_level_max_allowed
    ON progress_tracking.user_current_level(max_allowed_level);

-- Política RLS
ALTER TABLE progress_tracking.user_current_level ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_current_level_select_own
ON progress_tracking.user_current_level
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY user_current_level_manage_system
ON progress_tracking.user_current_level
FOR ALL
USING (TRUE)
WITH CHECK (TRUE);

-- Trigger para updated_at
CREATE TRIGGER trg_user_current_level_updated_at
    BEFORE UPDATE ON progress_tracking.user_current_level
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE progress_tracking.user_current_level IS
'Nivel actual del estudiante (denormalizado para performance).
Incluye control de zona de desarrollo próximo y resultados de placement test.';

COMMENT ON COLUMN progress_tracking.user_current_level.max_allowed_level IS
'Nivel máximo permitido según zona de desarrollo próximo (ZDP)';

COMMENT ON COLUMN progress_tracking.user_current_level.placement_test_completed IS
'Indica si el usuario completó el placement test inicial';

-- Grants
GRANT SELECT ON progress_tracking.user_current_level TO authenticated;
