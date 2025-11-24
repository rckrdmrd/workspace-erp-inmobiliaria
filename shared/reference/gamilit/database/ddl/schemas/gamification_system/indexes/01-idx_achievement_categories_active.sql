-- =====================================================
-- Partial Index: idx_achievement_categories_active
-- Table: gamification_system.achievement_categories
-- Column: is_active (BOOLEAN)
-- Description: Índice parcial para búsquedas eficientes de categorías activas
-- Type: Partial B-tree index (only includes rows where is_active = true)
-- Priority: HIGH - Performance optimization for active categories queries
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_achievement_categories_active
    ON gamification_system.achievement_categories(is_active)
    WHERE is_active = true;

COMMENT ON INDEX gamification_system.idx_achievement_categories_active IS
'Índice parcial B-tree para búsquedas eficientes de categorías de logros activas. Solo incluye filas donde is_active = true, reduciendo tamaño del índice y mejorando performance.';

-- =====================================================
-- Performance Improvement Examples
-- =====================================================

/*
-- Example 1: Get all active achievement categories (common query)
SELECT id, name, description, display_order, icon_url
FROM gamification_system.achievement_categories
WHERE is_active = true
ORDER BY display_order ASC;

-- Query Plan: Index Scan using idx_achievement_categories_active
-- Benefit: Partial index contains only active categories, smaller and faster


-- Example 2: Count active categories
SELECT COUNT(*) as active_count
FROM gamification_system.achievement_categories
WHERE is_active = true;

-- Query Plan: Index Only Scan using idx_achievement_categories_active
-- Benefit: Index-only scan possible, no need to access main table


-- Example 3: Get active categories with specific display order
SELECT id, name, icon_url
FROM gamification_system.achievement_categories
WHERE is_active = true
AND display_order < 100
ORDER BY display_order ASC;

-- Query Plan: Index Scan using idx_achievement_categories_active
-- Benefit: Combines partial index filter with range condition


-- Example 4: Fetch active categories for UI rendering
SELECT id, name, description, icon_url
FROM gamification_system.achievement_categories
WHERE is_active = true
ORDER BY display_order ASC
LIMIT 20;

-- Query Plan: Index Scan using idx_achievement_categories_active
-- Benefit: Fast retrieval of visible UI categories
*/

-- =====================================================
-- Partial Index Benefits
-- =====================================================

/*
Advantages of partial indexes:
1. Smaller index size - Only includes active rows
2. Faster scans - Less data to traverse
3. Lower maintenance cost - Less data to update on changes
4. More cache-friendly - Fits better in memory
5. Faster index creation and rebuilding

Use case:
- Most queries filter by is_active = true
- Few inactive categories compared to total
- Better space/performance tradeoff
*/

-- =====================================================
-- Index Statistics & Maintenance
-- =====================================================

/*
-- Monitor index usage:
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname = 'idx_achievement_categories_active'
ORDER BY idx_scan DESC;

-- Check index size:
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE indexname = 'idx_achievement_categories_active';

-- Verify partial index definition:
SELECT indexname, indexdef
FROM pg_indexes
WHERE indexname = 'idx_achievement_categories_active';

-- Reindex if needed:
REINDEX INDEX CONCURRENTLY gamification_system.idx_achievement_categories_active;

-- Update statistics after bulk operations:
ANALYZE gamification_system.achievement_categories;
*/
