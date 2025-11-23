-- =====================================================
-- Index: idx_user_achievements_user_id
-- Schema: gamification_system
-- Position: 242/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_achievements_user_id ON gamification_system.user_achievements(user_id);

COMMENT ON INDEX gamification_system.idx_user_achievements_user_id IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
