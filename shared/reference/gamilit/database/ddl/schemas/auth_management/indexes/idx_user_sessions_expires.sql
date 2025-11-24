-- =====================================================
-- Index: idx_user_sessions_expires
-- Schema: auth_management
-- Position: 254/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_sessions_expires ON auth_management.user_sessions(expires_at);

COMMENT ON INDEX auth_management.idx_user_sessions_expires IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
