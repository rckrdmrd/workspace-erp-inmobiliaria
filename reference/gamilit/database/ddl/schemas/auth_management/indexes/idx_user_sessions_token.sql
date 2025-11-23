-- =====================================================
-- Index: idx_user_sessions_token
-- Schema: auth_management
-- Position: 257/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_sessions_token ON auth_management.user_sessions(session_token);

COMMENT ON INDEX auth_management.idx_user_sessions_token IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
