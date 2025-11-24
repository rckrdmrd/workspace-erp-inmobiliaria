-- =====================================================
-- Index: idx_scheduled_missions_mission
-- Table: progress_tracking.scheduled_missions
-- Column: mission_id
-- Description: Índice para buscar todas las programaciones de una misión
-- Created: 2025-10-28
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_scheduled_missions_mission
    ON progress_tracking.scheduled_missions(mission_id);

COMMENT ON INDEX progress_tracking.idx_scheduled_missions_mission IS 'Índice para buscar todas las programaciones de una misión';

-- =====================================================
-- Performance Improvement Example
-- =====================================================

/*
-- Find all scheduled instances of a specific mission
SELECT *
FROM progress_tracking.scheduled_missions
WHERE mission_id = $1;
*/
