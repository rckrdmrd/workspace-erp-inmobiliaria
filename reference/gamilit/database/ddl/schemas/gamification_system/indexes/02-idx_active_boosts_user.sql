-- =====================================================
-- Index: idx_active_boosts_user
-- Table: gamification_system.active_boosts
-- Column: user_id
-- Description: Índice para consultar todos los boosts de un usuario
-- Created: 2025-10-28
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_active_boosts_user
    ON gamification_system.active_boosts(user_id);

COMMENT ON INDEX gamification_system.idx_active_boosts_user IS 'Índice para consultar todos los boosts de un usuario';

-- =====================================================
-- Performance Improvement Example
-- =====================================================

/*
-- Find all boosts for a specific user
SELECT *
FROM gamification_system.active_boosts
WHERE user_id = $1
ORDER BY expires_at DESC;
*/
