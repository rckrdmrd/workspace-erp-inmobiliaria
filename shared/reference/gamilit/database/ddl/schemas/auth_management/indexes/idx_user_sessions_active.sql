-- =====================================================
-- Index: idx_user_sessions_active
-- Schema: auth_management
-- Position: 253/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_sessions_active ON auth_management.user_sessions(is_active) WHERE is_active = true;

COMMENT ON INDEX auth_management.idx_user_sessions_active IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
