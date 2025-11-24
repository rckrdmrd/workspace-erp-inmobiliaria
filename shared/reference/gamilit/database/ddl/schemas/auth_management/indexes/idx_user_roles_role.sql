-- =====================================================
-- Index: idx_user_roles_role
-- Schema: auth_management
-- Position: 250/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_roles_role ON auth_management.user_roles(role);

COMMENT ON INDEX auth_management.idx_user_roles_role IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
