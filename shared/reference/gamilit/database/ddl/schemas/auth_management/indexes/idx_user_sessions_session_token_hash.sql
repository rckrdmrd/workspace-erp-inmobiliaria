-- =====================================================
-- Index: idx_user_sessions_session_token_hash
-- Schema: auth_management
-- Position: 256/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token_hash
ON auth_management.user_sessions(session_token)
WHERE is_active = true;

COMMENT ON INDEX auth_management.idx_user_sessions_session_token_hash IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
