-- =====================================================
-- Index: idx_user_achievements_completed
-- Schema: gamification_system
-- Position: 239/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_achievements_completed ON gamification_system.user_achievements(user_id, is_completed);

COMMENT ON INDEX gamification_system.idx_user_achievements_completed IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
