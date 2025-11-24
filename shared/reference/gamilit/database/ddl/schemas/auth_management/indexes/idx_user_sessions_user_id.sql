-- =====================================================
-- Index: idx_user_sessions_user_id
-- Schema: auth_management
-- Position: 258/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_sessions_user_id ON auth_management.user_sessions(user_id);

COMMENT ON INDEX auth_management.idx_user_sessions_user_id IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
