-- =============================================================================
-- FUNCTION: public.log_system_event
-- =============================================================================
-- Purpose: Logs system events for audit and monitoring purposes
-- Priority: P2 - System event logging function
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- =============================================================================

CREATE OR REPLACE FUNCTION audit_logging.log_system_event(
    p_event_type TEXT,
    p_event_source TEXT,
    p_event_data JSONB DEFAULT NULL,
    p_severity TEXT DEFAULT 'INFO'
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
    v_valid_severity BOOLEAN;
BEGIN
    -- Validate severity level
    v_valid_severity := p_severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL');

    IF NOT v_valid_severity THEN
        RAISE EXCEPTION 'Invalid severity level: %', p_severity;
    END IF;

    -- Insert system event into audit log
    INSERT INTO audit_logging.system_logs (
        event_type,
        event_source,
        event_data,
        severity,
        created_at
    ) VALUES (
        p_event_type,
        p_event_source,
        p_event_data,
        p_severity,
        NOW()
    )
    RETURNING id INTO v_event_id;

    -- Return the created event ID
    RETURN v_event_id;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error logging system event: %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, audit_logging;

-- Documentation comment
COMMENT ON FUNCTION public.log_system_event(TEXT, TEXT, JSONB, TEXT) IS
'Logs system events for audit, monitoring and debugging purposes.
Parameters:
  - p_event_type: Type of event (e.g., ''DATABASE_BACKUP_START'', ''API_ERROR'')
  - p_event_source: Source system or component generating the event
  - p_event_data: Optional JSONB data with event context (can include user IDs, request IDs, etc.)
  - p_severity: Event severity level - DEBUG, INFO, WARNING, ERROR, CRITICAL (default: INFO)
Returns:
  - UUID of the created system log entry, or NULL on error
Example:
  SELECT log_system_event(
    ''API_REQUEST_TIMEOUT''::TEXT,
    ''auth_service''::TEXT,
    jsonb_build_object(''user_id'', 123, ''endpoint'', ''/api/auth/login''),
    ''WARNING''::TEXT
  );';
