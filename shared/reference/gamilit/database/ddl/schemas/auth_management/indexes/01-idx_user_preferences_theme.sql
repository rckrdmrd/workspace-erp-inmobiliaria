-- =====================================================
-- Index: idx_user_preferences_theme
-- Table: auth_management.user_preferences
-- Column: theme (VARCHAR)
-- Description: Índice para búsquedas eficientes por preferencia de tema de usuario
-- Type: Simple B-tree index on single column
-- Priority: MEDIUM - Optimization for UI theme filtering
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_preferences_theme
    ON auth_management.user_preferences(theme);

COMMENT ON INDEX auth_management.idx_user_preferences_theme IS
'Índice B-tree simple para búsquedas eficientes por tema de usuario (light, dark, auto). Optimiza queries que filtran por preferencia de tema.';

-- =====================================================
-- Performance Improvement Example
-- =====================================================

/*
-- Find all users with dark theme preference (now uses B-tree index)
SELECT user_id, language, notifications_enabled
FROM auth_management.user_preferences
WHERE theme = 'dark'
ORDER BY created_at DESC;

-- Query Plan: Index Scan using idx_user_preferences_theme
-- Benefit: Avoids full table scan, efficient equality search
*/

-- =====================================================
-- Index Statistics
-- =====================================================

/*
-- Monitor index usage:
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname = 'idx_user_preferences_theme'
ORDER BY idx_scan DESC;

-- Check index size:
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE indexname = 'idx_user_preferences_theme';
*/
