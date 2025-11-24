-- =====================================================
-- Index: idx_user_ranks_is_current
-- Schema: gamification_system
-- Position: 248/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_ranks_is_current ON gamification_system.user_ranks(user_id, is_current) WHERE is_current = true;

COMMENT ON INDEX gamification_system.idx_user_ranks_is_current IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
