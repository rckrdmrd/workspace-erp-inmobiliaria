-- =============================================================================
-- VIEW: gamilit.number_series (Number series generator for SQL operations)
-- =============================================================================
-- Purpose: Utility view to support iterative queries and batch operations
-- Priority: P2 - Database utility view
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- Updated: 2025-11-09 - Renamed from 'for' (reserved SQL keyword)
-- Updated: 2025-11-11 - Migrado de public a gamilit (shared utilities)
-- =============================================================================

-- NOTE: This view generates a series of numbers useful for:
-- - JOIN operations requiring iteration patterns
-- - Cross-joins for batch processing
-- - Testing and data generation

CREATE OR REPLACE VIEW gamilit.number_series AS
SELECT
    generate_series(1, 1000, 1) AS iteration_number,
    NOW() AS generated_at,
    CURRENT_USER AS query_user;

-- Documentation comment
COMMENT ON VIEW gamilit.number_series IS
'Utility view for supporting iterative queries and loop-like operations in SQL.
This view generates a series of numbers that can be used in JOIN operations for
iteration patterns, cross-joins, or batch processing.

IMPORTANT: This view name and functionality are non-standard. Review the actual
intended use case and consider:
1. Whether this should be a function returning SETOF RECORD instead
2. If this represents batch processing, consider window functions
3. If this is for administrative tooling, it may need specific permissions

Current Columns:
  - iteration_number: Sequential number from 1 to 1000
  - generated_at: Timestamp when the view was queried
  - query_user: Database user executing the query

Usage Examples:
  SELECT * FROM number_series LIMIT 10;
  SELECT t.*, ns.iteration_number FROM some_table t JOIN number_series ns ON t.id = ns.iteration_number;
  SELECT * FROM number_series WHERE iteration_number <= 100;

NOTE: Renamed from "for" to avoid SQL reserved keyword conflicts.

See also: assign_sequence_numbers() function for proper iteration handling.';
