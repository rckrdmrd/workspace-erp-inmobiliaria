-- =====================================================
-- Index: idx_user_stats_ml_coins
-- Schema: gamification_system
-- Position: 261/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_stats_ml_coins ON gamification_system.user_stats(ml_coins);

COMMENT ON INDEX gamification_system.idx_user_stats_ml_coins IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
