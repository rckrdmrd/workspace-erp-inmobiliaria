-- =====================================================
-- Index: idx_user_stats_streak
-- Schema: gamification_system
-- Position: 262/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_stats_streak ON gamification_system.user_stats(current_streak DESC);

COMMENT ON INDEX gamification_system.idx_user_stats_streak IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
