-- =====================================================
-- Index: idx_user_ranks_current
-- Schema: gamification_system
-- Position: 247/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_ranks_current ON gamification_system.user_ranks(current_rank);

COMMENT ON INDEX gamification_system.idx_user_ranks_current IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
