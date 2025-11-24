-- =====================================================
-- Index: idx_user_achievements_user_completed
-- Schema: gamification_system
-- Position: 241/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_achievements_user_completed ON gamification_system.user_achievements(user_id, is_completed, completed_at);

COMMENT ON INDEX gamification_system.idx_user_achievements_user_completed IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
