-- =============================================================================
-- FUNCTION: public.cleanup_old_user_activity
-- =============================================================================
-- Purpose: Removes user activity records older than specified retention period
-- Priority: P2 - Maintenance function for activity log cleanup
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- =============================================================================

CREATE OR REPLACE FUNCTION audit_logging.cleanup_old_user_activity(
    p_retention_days INTEGER DEFAULT 180
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

    -- Delete old user activity records
    DELETE FROM audit_logging.user_activity_logs
    WHERE created_at < v_cutoff_date;

    v_deleted_count := (SELECT COUNT(*) FROM audit_logging.user_activity_logs WHERE created_at < v_cutoff_date);

    -- Optimize table after bulk delete
    VACUUM ANALYZE audit_logging.user_activity_logs;

    v_message := FORMAT('Successfully deleted %L user activity records older than %L days', v_deleted_count, p_retention_days);

    RETURN QUERY SELECT v_deleted_count, v_message;

EXCEPTION WHEN OTHERS THEN
    v_message := FORMAT('Error during cleanup: %s', SQLERRM);
    RETURN QUERY SELECT 0, v_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, audit_logging;

-- Documentation comment
COMMENT ON FUNCTION public.cleanup_old_user_activity(INTEGER) IS
'Maintenance function to cleanup old user activity logs for performance and storage optimization.
Parameters:
  - p_retention_days: Number of days to retain activity records (default: 180)
Returns:
  - deleted_count: Number of records deleted
  - status_message: Operation status message';
