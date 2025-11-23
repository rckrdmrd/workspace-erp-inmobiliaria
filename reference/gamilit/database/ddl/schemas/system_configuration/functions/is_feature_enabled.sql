-- =============================================================================
-- FUNCTION: public.is_feature_enabled
-- =============================================================================
-- Purpose: Checks if a feature flag is enabled globally or for specific users/roles
-- Priority: P2 - Feature flag management function
-- Responsibility: SA-DB-031
-- Created: 2025-11-02
-- Modified: 2025-11-07 - Refactored to use global feature_flags table only (D4-A)
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.is_feature_enabled(
    p_feature_key TEXT,
    p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_feature RECORD;
    v_user_role auth_management.gamilit_role;
    v_user_hash INTEGER;
BEGIN
    -- Get feature flag configuration
    SELECT
        is_enabled,
        target_users,
        target_roles,
        rollout_percentage,
        starts_at,
        ends_at
    INTO v_feature
    FROM system_configuration.feature_flags
    WHERE feature_key = p_feature_key
    LIMIT 1;

    -- If feature not found or not enabled globally
    IF v_feature.is_enabled IS NULL OR NOT v_feature.is_enabled THEN
        RETURN FALSE;
    END IF;

    -- Check time window (if specified)
    IF v_feature.starts_at IS NOT NULL AND NOW() < v_feature.starts_at THEN
        RETURN FALSE;
    END IF;
    IF v_feature.ends_at IS NOT NULL AND NOW() > v_feature.ends_at THEN
        RETURN FALSE;
    END IF;

    -- If no specific user check, return global status
    IF p_user_id IS NULL THEN
        RETURN TRUE;
    END IF;

    -- Check if user is in target_users whitelist
    IF v_feature.target_users IS NOT NULL AND p_user_id = ANY(v_feature.target_users) THEN
        RETURN TRUE;
    END IF;

    -- Check if user's role is in target_roles
    IF v_feature.target_roles IS NOT NULL AND array_length(v_feature.target_roles, 1) > 0 THEN
        -- Get user's role
        SELECT role INTO v_user_role
        FROM auth_management.user_roles
        WHERE user_id = p_user_id
        LIMIT 1;

        -- Check if user's role is in target_roles
        IF v_user_role IS NOT NULL AND v_user_role = ANY(v_feature.target_roles) THEN
            RETURN TRUE;
        END IF;

        -- If target_roles is specified but user doesn't match, return FALSE
        RETURN FALSE;
    END IF;

    -- Apply rollout percentage (gradual rollout / A-B testing)
    IF v_feature.rollout_percentage IS NOT NULL AND v_feature.rollout_percentage < 100 THEN
        -- Use deterministic hash of user_id to ensure consistent experience
        v_user_hash := abs(hashtext(p_user_id::TEXT)) % 100;
        RETURN v_user_hash < v_feature.rollout_percentage;
    END IF;

    -- If no targeting rules, return TRUE (globally enabled)
    RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    -- Log error and fail safe to FALSE
    RAISE NOTICE 'Error checking feature flag %: %', p_feature_key, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, system_configuration, auth_management;

-- Documentation comment
COMMENT ON FUNCTION public.is_feature_enabled(TEXT, UUID) IS
'Checks if a feature flag is enabled globally or for specific users/roles.

Uses global feature_flags table with support for:
- Global enable/disable (is_enabled)
- User whitelisting (target_users array)
- Role-based access (target_roles array)
- Gradual rollout (rollout_percentage 0-100)
- Time windows (starts_at, ends_at)

Parameters:
  - p_feature_key: The unique key identifying the feature (e.g., ''new_dashboard'')
  - p_user_id: Optional user ID for user-specific targeting

Returns:
  - TRUE if feature is enabled for the user/globally, FALSE otherwise

Examples:
  -- Check global feature status
  SELECT is_feature_enabled(''new_dashboard''::TEXT);

  -- Check if enabled for specific user
  SELECT is_feature_enabled(''beta_feature''::TEXT, user_id);

Decision Reference: D4-A (DECISIONES-ARQUITECTURALES-REQUERIDAS.md)';
