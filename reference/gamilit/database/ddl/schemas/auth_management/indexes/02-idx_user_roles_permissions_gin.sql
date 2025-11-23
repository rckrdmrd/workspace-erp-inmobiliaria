-- =====================================================
-- GIN Index: idx_user_roles_permissions_gin
-- Table: auth_management.user_roles
-- Column: permissions (JSONB)
-- Description: Índice GIN para búsqueda eficiente de permisos específicos en JSONB
-- Type: GIN (Generalized Inverted Index) optimized for JSONB operations
-- Priority: HIGH - Performance optimization for permission queries
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_permissions_gin
    ON auth_management.user_roles
    USING GIN (permissions jsonb_path_ops);

COMMENT ON INDEX auth_management.idx_user_roles_permissions_gin IS
'Índice GIN para búsqueda eficiente de permisos específicos en roles de usuario. Optimiza queries JSONB como ? (has key), @> (contains), etc.';

-- =====================================================
-- Performance Improvement Examples
-- =====================================================

/*
-- Example 1: Check if user has specific permission
SELECT user_id, role, is_active
FROM auth_management.user_roles
WHERE permissions ? 'edit_users'
AND is_active = true;

-- Query Plan: Index Scan using idx_user_roles_permissions_gin
-- Benefit: GIN index enables fast JSONB key searches


-- Example 2: Check if user has multiple permissions
SELECT user_id, role, permissions
FROM auth_management.user_roles
WHERE permissions ? 'admin'
AND permissions ? 'analytics'
AND is_active = true;

-- Query Plan: Index Scan using idx_user_roles_permissions_gin
-- Benefit: Multiple key existence checks optimized


-- Example 3: Check permission value
SELECT user_id, role, permissions
FROM auth_management.user_roles
WHERE permissions @> '{"admin": true}'
AND is_active = true;

-- Query Plan: Index Scan using idx_user_roles_permissions_gin
-- Benefit: JSONB containment check optimized


-- Example 4: Check nested permission with path
SELECT user_id, tenant_id, permissions
FROM auth_management.user_roles
WHERE permissions @> '{"read": true, "write": true}'
ORDER BY created_at DESC;

-- Query Plan: Index Scan using idx_user_roles_permissions_gin
-- Benefit: Complex JSONB matching optimized
*/

-- =====================================================
-- Index Statistics & Maintenance
-- =====================================================

/*
-- Monitor index usage:
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname = 'idx_user_roles_permissions_gin'
ORDER BY idx_scan DESC;

-- Check index size:
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE indexname = 'idx_user_roles_permissions_gin';

-- Reindex if needed (for fragmentation):
REINDEX INDEX CONCURRENTLY auth_management.idx_user_roles_permissions_gin;

-- Update statistics after bulk operations:
ANALYZE auth_management.user_roles;
*/

-- =====================================================
-- JSONB Operations Supported by This Index
-- =====================================================

/*
-- ? (has key) - Check if JSONB contains specific key
WHERE permissions ? 'admin'

-- ?| (has any key) - Check if JSONB contains any of the keys
WHERE permissions ?| ARRAY['admin', 'user', 'guest']

-- ?& (has all keys) - Check if JSONB contains all of the keys
WHERE permissions ?& ARRAY['read', 'write']

-- @> (contains) - Check if JSONB contains another JSONB
WHERE permissions @> '{"admin": true}'

-- <@ (contained by) - Check if JSONB is contained in another JSONB
WHERE permissions <@ '{"admin": true, "write": false, "read": true}'
*/
