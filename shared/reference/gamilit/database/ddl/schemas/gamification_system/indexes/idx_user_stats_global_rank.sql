-- =====================================================
-- Index: idx_user_stats_global_rank
-- Schema: gamification_system
-- Position: 259/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_stats_global_rank ON gamification_system.user_stats(global_rank_position) WHERE global_rank_position IS NOT NULL;

COMMENT ON INDEX gamification_system.idx_user_stats_global_rank IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
