-- =====================================================
-- Index: idx_user_stats_level
-- Schema: gamification_system
-- Position: 260/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_stats_level ON gamification_system.user_stats(level);

COMMENT ON INDEX gamification_system.idx_user_stats_level IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
