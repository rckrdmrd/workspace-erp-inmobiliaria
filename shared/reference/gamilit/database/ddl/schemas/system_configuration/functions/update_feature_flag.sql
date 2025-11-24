-- =============================================================================
-- FUNCTION: public.update_feature_flag
-- =============================================================================
-- Purpose: Updates feature flag status and manages rollout configurations
-- Priority: P2 - Feature flag management function
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.update_feature_flag(
    p_feature_key TEXT,
    p_enabled BOOLEAN,
    p_rollout_percentage INTEGER DEFAULT 100,
    p_description TEXT DEFAULT NULL
)
RETURNS TABLE(
    feature_id UUID,
    key TEXT,
    enabled BOOLEAN,
    rollout_percentage INTEGER,
    status_message TEXT
) AS $$
DECLARE
    v_feature_id UUID;
    v_message TEXT;
BEGIN
    -- Validate rollout percentage
    IF p_rollout_percentage < 0 OR p_rollout_percentage > 100 THEN
        RAISE EXCEPTION 'Rollout percentage must be between 0 and 100';
    END IF;

    -- Try to update existing feature flag
    UPDATE system_configuration.feature_flags
    SET
        enabled = p_enabled,
        rollout_percentage = p_rollout_percentage,
        description = COALESCE(p_description, description),
        updated_at = NOW()
    WHERE key = p_feature_key
    RETURNING id INTO v_feature_id;

    -- If feature doesn't exist, create it
    IF v_feature_id IS NULL THEN
        INSERT INTO system_configuration.feature_flags (
            key,
            enabled,
            rollout_percentage,
            description,
            is_active,
            created_at
        ) VALUES (
            p_feature_key,
            p_enabled,
            p_rollout_percentage,
            p_description,
            TRUE,
            NOW()
        )
        RETURNING id INTO v_feature_id;

        v_message := FORMAT('Feature flag ''%s'' created successfully', p_feature_key);
    ELSE
        v_message := FORMAT('Feature flag ''%s'' updated successfully', p_feature_key);
    END IF;

    -- Log the feature flag update
    PERFORM public.log_system_event(
        'FEATURE_FLAG_UPDATED',
        'feature_management',
        jsonb_build_object(
            'feature_key', p_feature_key,
            'enabled', p_enabled,
            'rollout_percentage', p_rollout_percentage
        ),
        'INFO'
    );

    RETURN QUERY SELECT
        v_feature_id,
        p_feature_key,
        p_enabled,
        p_rollout_percentage,
        v_message;

EXCEPTION WHEN OTHERS THEN
    v_message := FORMAT('Error updating feature flag: %s', SQLERRM);
    RETURN QUERY SELECT
        NULL,
        p_feature_key,
        FALSE,
        0,
        v_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, system_configuration, audit_logging;

-- Documentation comment
COMMENT ON FUNCTION public.update_feature_flag(TEXT, BOOLEAN, INTEGER, TEXT) IS
'Updates feature flag status and manages rollout configurations for gradual feature deployment.
Parameters:
  - p_feature_key: Unique identifier for the feature flag
  - p_enabled: Whether the feature is enabled globally
  - p_rollout_percentage: Percentage of users who should see the feature (0-100, default: 100)
  - p_description: Optional description of the feature flag
Returns:
  - feature_id: UUID of the feature flag
  - key: Feature key
  - enabled: Current enabled status
  - rollout_percentage: Current rollout percentage
  - status_message: Operation result message
Example:
  SELECT update_feature_flag(
    ''dark_mode''::TEXT,
    TRUE,
    50,
    ''Gradual rollout of dark mode''::TEXT
  );';
