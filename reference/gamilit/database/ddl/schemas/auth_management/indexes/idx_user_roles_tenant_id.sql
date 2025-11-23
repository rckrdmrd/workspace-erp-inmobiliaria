-- =====================================================
-- Index: idx_user_roles_tenant_id
-- Schema: auth_management
-- Position: 251/268
-- Description: Index for optimized query performance
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX idx_user_roles_tenant_id ON auth_management.user_roles(tenant_id);

COMMENT ON INDEX auth_management.idx_user_roles_tenant_id IS 'Index for optimized query performance on auth_management schema';

-- =====================================================
