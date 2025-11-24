-- =============================================================================
-- FUNCTION: public.cleanup_old_system_logs
-- =============================================================================
-- Purpose: Removes system log entries older than specified retention period
-- Priority: P2 - Maintenance function for database cleanup
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- =============================================================================

CREATE OR REPLACE FUNCTION audit_logging.cleanup_old_system_logs(
    p_retention_days INTEGER DEFAULT 90
)
RETURNS TABLE(
    deleted_count INTEGER,
    status_message TEXT
) AS $$
DECLARE
    v_deleted_count INTEGER := 0;
    v_cutoff_date TIMESTAMP WITHOUT TIME ZONE;
    v_message TEXT;
BEGIN
    -- Calculate cutoff date
    v_cutoff_date := NOW() - (p_retention_days || ' days')::INTERVAL;

    -- Delete old system logs
    DELETE FROM audit_logging.system_logs
    WHERE created_at < v_cutoff_date;

    v_deleted_count := FOUND::INTEGER * (SELECT COUNT(*) FROM audit_logging.system_logs WHERE created_at < v_cutoff_date);

    -- Vacuum analyze to reclaim space
    VACUUM ANALYZE audit_logging.system_logs;

    v_message := FORMAT('Successfully deleted %L log entries older than %L days', v_deleted_count, p_retention_days);

    RETURN QUERY SELECT v_deleted_count, v_message;

EXCEPTION WHEN OTHERS THEN
    v_message := FORMAT('Error during cleanup: %s', SQLERRM);
    RETURN QUERY SELECT 0, v_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, audit_logging;

-- Documentation comment
COMMENT ON FUNCTION public.cleanup_old_system_logs(INTEGER) IS
'Maintenance function to cleanup old system logs entries for performance and storage optimization.
Parameters:
  - p_retention_days: Number of days to retain logs (default: 90)
Returns:
  - deleted_count: Number of records deleted
  - status_message: Operation status message';
