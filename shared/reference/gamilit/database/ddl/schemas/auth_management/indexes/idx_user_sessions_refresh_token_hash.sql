-- =====================================================
-- Index: idx_user_sessions_refresh_token_hash
-- Schema: auth_management
-- Position: 255/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token_hash
ON auth_management.user_sessions(refresh_token)
WHERE is_active = true AND refresh_token IS NOT NULL;

COMMENT ON INDEX auth_management.idx_user_sessions_refresh_token_hash IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
