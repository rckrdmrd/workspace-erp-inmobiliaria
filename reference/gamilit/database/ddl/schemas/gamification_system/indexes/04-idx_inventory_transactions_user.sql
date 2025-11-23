-- =====================================================
-- Index: idx_inventory_transactions_user
-- Table: gamification_system.inventory_transactions
-- Column: user_id (UUID)
-- Description: Índice para búsquedas eficientes del historial de transacciones por usuario
-- Type: Simple B-tree index on single column
-- Priority: HIGH - Performance optimization for user transaction queries
-- Created: 2025-11-02
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_user
    ON gamification_system.inventory_transactions(user_id);

COMMENT ON INDEX gamification_system.idx_inventory_transactions_user IS
'Índice B-tree simple para búsquedas eficientes del historial de transacciones por usuario_id. Optimiza queries que necesitan recuperar todas las transacciones de un usuario específico.';

-- =====================================================
-- Performance Improvement Examples
-- =====================================================

/*
-- Example 1: Get all transactions for a specific user
SELECT id, item_id, transaction_type, quantity, created_at
FROM gamification_system.inventory_transactions
WHERE user_id = 'user-uuid-12345'
ORDER BY created_at DESC;

-- Query Plan: Index Scan using idx_inventory_transactions_user
-- Benefit: Avoids full table scan, efficient lookup by user


-- Example 2: Get recent transactions for user
SELECT id, item_id, transaction_type, quantity, metadata
FROM gamification_system.inventory_transactions
WHERE user_id = 'user-uuid-12345'
AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 50;

-- Query Plan: Index Scan using idx_inventory_transactions_user + additional filters
-- Benefit: Fast user lookup, then filter by date range


-- Example 3: Count user transactions by type
SELECT transaction_type, COUNT(*) as count
FROM gamification_system.inventory_transactions
WHERE user_id = 'user-uuid-12345'
GROUP BY transaction_type;

-- Query Plan: Index Scan using idx_inventory_transactions_user
-- Benefit: Efficient grouping after user filter


-- Example 4: Get user's purchase history
SELECT id, item_id, quantity, metadata, created_at
FROM gamification_system.inventory_transactions
WHERE user_id = 'user-uuid-12345'
AND transaction_type = 'PURCHASE'
ORDER BY created_at DESC;

-- Query Plan: Index Scan using idx_inventory_transactions_user with filter
-- Benefit: Fast user lookup, filtered by transaction type


-- Example 5: Get gifts received by user
SELECT id, item_id, quantity, metadata, created_at
FROM gamification_system.inventory_transactions
WHERE user_id = 'user-uuid-12345'
AND transaction_type = 'GIFT_RECEIVED'
ORDER BY created_at DESC;

-- Query Plan: Index Scan using idx_inventory_transactions_user with filter
-- Benefit: Fast retrieval of received gifts
*/

-- =====================================================
-- Common Query Patterns
-- =====================================================

/*
Use cases optimized by this index:
1. User transaction history/audit trail
2. User purchase history
3. Items used by user
4. Gifts sent/received by user
5. User inventory balance calculation
6. Transaction type statistics per user
7. User activity timeline
*/

-- =====================================================
-- Index Statistics & Maintenance
-- =====================================================

/*
-- Monitor index usage:
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname = 'idx_inventory_transactions_user'
ORDER BY idx_scan DESC;

-- Check index size:
SELECT indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE indexname = 'idx_inventory_transactions_user';

-- Analyze index efficiency:
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    ROUND((idx_tup_fetch::float / NULLIF(idx_tup_read, 0)), 2) as efficiency
FROM pg_stat_user_indexes
WHERE indexname = 'idx_inventory_transactions_user';

-- Reindex if needed (for fragmentation):
REINDEX INDEX CONCURRENTLY gamification_system.idx_inventory_transactions_user;

-- Update statistics after bulk operations:
ANALYZE gamification_system.inventory_transactions;

-- VACUUM to reclaim space if many deletions:
VACUUM ANALYZE gamification_system.inventory_transactions;
*/

-- =====================================================
-- Composite Index Note
-- =====================================================

/*
Additional composite indexes exist for multi-column queries:
- idx_inventory_transactions_user_item: (user_id, item_id)
  Used for user + item specific queries

- idx_inventory_transactions_type: (transaction_type)
  Used for filtering by transaction type

- idx_inventory_transactions_created: (created_at DESC)
  Used for time-based ordering

This simple index (user_id only) provides:
- Fast lookup of all user transactions
- Good selectivity for user_id (many unique values)
- Supports partial scans with additional filters
*/
