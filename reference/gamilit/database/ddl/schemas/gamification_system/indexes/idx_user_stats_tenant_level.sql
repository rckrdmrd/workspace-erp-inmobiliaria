-- =====================================================
-- Index: idx_user_stats_tenant_level
-- Schema: gamification_system
-- Position: 264/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_stats_tenant_level ON gamification_system.user_stats(tenant_id, level DESC);

COMMENT ON INDEX gamification_system.idx_user_stats_tenant_level IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
