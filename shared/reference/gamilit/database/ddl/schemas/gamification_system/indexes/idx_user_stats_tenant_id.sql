-- =====================================================
-- Index: idx_user_stats_tenant_id
-- Schema: gamification_system
-- Position: 263/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_stats_tenant_id ON gamification_system.user_stats(tenant_id);

COMMENT ON INDEX gamification_system.idx_user_stats_tenant_id IS 'Index for optimized query performance on gamification_system schema';

-- =====================================================
