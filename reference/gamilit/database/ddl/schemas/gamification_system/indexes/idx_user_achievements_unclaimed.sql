-- =====================================================
-- Index: idx_user_achievements_unclaimed
-- Schema: gamification_system
-- Position: 240/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_achievements_unclaimed ON gamification_system.user_achievements(user_id) WHERE is_completed = true AND rewards_claimed = false;

COMMENT ON INDEX gamification_system.idx_user_achievements_unclaimed IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
