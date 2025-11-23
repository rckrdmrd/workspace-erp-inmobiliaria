-- =============================================================================
-- FUNCTION: public.validate_date_range
-- =============================================================================
-- Purpose: Validates that date ranges are logically correct and reasonable
-- Priority: P2 - Date validation utility function
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- =============================================================================

CREATE OR REPLACE FUNCTION gamilit.validate_date_range(
    p_start_date TIMESTAMP WITHOUT TIME ZONE,
    p_end_date TIMESTAMP WITHOUT TIME ZONE,
    p_max_range_days INTEGER DEFAULT 365
)
RETURNS TABLE(
    is_valid BOOLEAN,
    validation_message TEXT,
    days_in_range INTEGER
) AS $$
DECLARE
    v_days_difference INTEGER;
    v_message TEXT;
    v_is_valid BOOLEAN := TRUE;
BEGIN
    -- Check if start date is NULL or end date is NULL
    IF p_start_date IS NULL THEN
        v_is_valid := FALSE;
        v_message := 'Start date cannot be null';
    ELSIF p_end_date IS NULL THEN
        v_is_valid := FALSE;
        v_message := 'End date cannot be null';
    -- Check if start date is after end date
    ELSIF p_start_date > p_end_date THEN
        v_is_valid := FALSE;
        v_message := FORMAT('Start date (%s) cannot be after end date (%s)', p_start_date, p_end_date);
    -- Check if range exceeds maximum allowed days
    ELSIF (p_end_date - p_start_date) > (p_max_range_days || ' days')::INTERVAL THEN
        v_is_valid := FALSE;
        v_message := FORMAT('Date range exceeds maximum allowed duration of %L days', p_max_range_days);
    -- Check if dates are in the future (warning scenario)
    ELSIF p_start_date > NOW() AND p_end_date > NOW() THEN
        v_is_valid := TRUE;
        v_message := 'Date range is in the future (valid for scheduling)';
    ELSE
        v_is_valid := TRUE;
        v_message := 'Date range is valid';
    END IF;

    -- Calculate days in range
    v_days_difference := EXTRACT(DAY FROM (p_end_date - p_start_date))::INTEGER;

    RETURN QUERY SELECT
        v_is_valid,
        v_message,
        v_days_difference;

EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT
        FALSE,
        FORMAT('Error during date validation: %s', SQLERRM),
        0;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Documentation comment
COMMENT ON FUNCTION gamilit.validate_date_range(TIMESTAMP WITHOUT TIME ZONE, TIMESTAMP WITHOUT TIME ZONE, INTEGER) IS
'Validates date ranges for logical correctness and ensures they don''t exceed maximum duration limits.
Parameters:
  - p_start_date: Start date/timestamp of the range
  - p_end_date: End date/timestamp of the range
  - p_max_range_days: Maximum allowed days in range (default: 365)
Returns:
  - is_valid: TRUE if date range is valid, FALSE otherwise
  - validation_message: Description of validation result
  - days_in_range: Number of days between start and end date
Validation Rules:
  1. Neither date can be NULL
  2. Start date must be <= end date
  3. Date range cannot exceed p_max_range_days
  4. Range can be in the future (for scheduling)
Example:
  SELECT validate_date_range(
    ''2025-01-01 00:00:00''::TIMESTAMP,
    ''2025-12-31 23:59:59''::TIMESTAMP,
    365
  );

  SELECT validate_date_range(
    NOW(),
    NOW() + INTERVAL ''30 days'',
    30
  );';
