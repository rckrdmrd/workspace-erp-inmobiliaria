-- =============================================================================
-- Table: system_configuration.gamification_parameters
-- Description: Global and customizable gamification parameters
-- Priority: P0 - CRITICAL for US-AE-005 (Gamification Configuration)
-- User Story: US-AE-005 (Gamification Parametrization)
-- Created: 2025-11-19
-- =============================================================================

-- Drop table if exists
DROP TABLE IF EXISTS system_configuration.gamification_parameters CASCADE;

-- Create gamification_parameters table
CREATE TABLE system_configuration.gamification_parameters (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parameter identification
    param_key VARCHAR(100) NOT NULL UNIQUE,
    param_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    -- Categories: 'points', 'levels', 'ranks', 'badges', 'rewards', 'penalties', 'multipliers'

    -- Parameter value
    param_value JSONB NOT NULL,
    default_value JSONB NOT NULL,
    value_type VARCHAR(50) NOT NULL,  -- 'number', 'string', 'boolean', 'object', 'array'

    -- Validation
    min_value NUMERIC,
    max_value NUMERIC,
    allowed_values JSONB,  -- Array of allowed values for enum-like parameters
    validation_rules JSONB DEFAULT '{}'::jsonb,

    -- Scope and applicability
    scope VARCHAR(50) NOT NULL DEFAULT 'global',
    -- 'global', 'tenant', 'classroom', 'student', 'teacher'

    is_system_managed BOOLEAN DEFAULT FALSE,  -- If true, cannot be modified via UI
    is_overridable BOOLEAN DEFAULT TRUE,      -- If false, cannot be overridden at lower scopes

    -- Tenant/Classroom overrides
    tenant_overrides JSONB DEFAULT '{}'::jsonb,
    -- Example: {"tenant-uuid-1": 100, "tenant-uuid-2": 150}

    classroom_overrides JSONB DEFAULT '{}'::jsonb,
    -- Example: {"classroom-uuid-1": {"value": 200, "reason": "Advanced class"}}

    -- Impact and relationships
    affects_systems JSONB DEFAULT '[]'::jsonb,
    -- Example: ["xp_calculation", "level_progression", "rank_advancement"]

    depends_on JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"param": "enable_gamification", "required_value": true}]

    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    last_modified_by UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    last_modified_at TIMESTAMPTZ,

    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    documentation TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    -- Example values and use cases

    -- Lifecycle
    is_active BOOLEAN DEFAULT TRUE,
    is_deprecated BOOLEAN DEFAULT FALSE,
    deprecated_at TIMESTAMPTZ,
    deprecated_reason TEXT,
    replacement_param_key VARCHAR(100),  -- Key of parameter that replaces this one

    -- Audit
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT gamification_parameters_value_type_valid
        CHECK (value_type IN ('number', 'string', 'boolean', 'object', 'array')),
    CONSTRAINT gamification_parameters_scope_valid
        CHECK (scope IN ('global', 'tenant', 'classroom', 'student', 'teacher')),
    CONSTRAINT gamification_parameters_min_max_valid
        CHECK (min_value IS NULL OR max_value IS NULL OR min_value <= max_value)
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_gamification_parameters_key
    ON system_configuration.gamification_parameters(param_key)
    WHERE is_active = TRUE;

CREATE INDEX idx_gamification_parameters_category
    ON system_configuration.gamification_parameters(category, is_active);

CREATE INDEX idx_gamification_parameters_scope
    ON system_configuration.gamification_parameters(scope, is_active);

CREATE INDEX idx_gamification_parameters_system_managed
    ON system_configuration.gamification_parameters(is_system_managed)
    WHERE is_active = TRUE;

CREATE INDEX idx_gamification_parameters_tags
    ON system_configuration.gamification_parameters USING GIN(tags);

-- =============================================================================
-- Trigger for updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.update_gamification_parameters_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_modified_at = NOW();
    NEW.usage_count = COALESCE(OLD.usage_count, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_gamification_parameters_timestamp
    BEFORE UPDATE ON system_configuration.gamification_parameters
    FOR EACH ROW
    EXECUTE FUNCTION system_configuration.update_gamification_parameters_timestamp();

-- =============================================================================
-- Helper function to get parameter value with overrides
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.get_gamification_param(
    p_param_key VARCHAR,
    p_tenant_id UUID DEFAULT NULL,
    p_classroom_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_param RECORD;
    v_value JSONB;
BEGIN
    -- Get parameter
    SELECT * INTO v_param
    FROM system_configuration.gamification_parameters
    WHERE param_key = p_param_key
      AND is_active = TRUE;

    IF NOT FOUND THEN
        RETURN NULL;  -- Parameter doesn't exist
    END IF;

    -- Check classroom override (highest priority)
    IF p_classroom_id IS NOT NULL AND v_param.is_overridable THEN
        v_value := v_param.classroom_overrides->p_classroom_id::TEXT->'value';
        IF v_value IS NOT NULL THEN
            RETURN v_value;
        END IF;
    END IF;

    -- Check tenant override
    IF p_tenant_id IS NOT NULL AND v_param.is_overridable THEN
        v_value := v_param.tenant_overrides->p_tenant_id::TEXT;
        IF v_value IS NOT NULL THEN
            RETURN v_value;
        END IF;
    END IF;

    -- Return default parameter value
    RETURN v_param.param_value;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- Helper function to set classroom-specific override
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.set_classroom_gamification_override(
    p_param_key VARCHAR,
    p_classroom_id UUID,
    p_value JSONB,
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_override JSONB;
BEGIN
    -- Build override object
    v_override := jsonb_build_object(
        'value', p_value,
        'reason', p_reason,
        'set_at', NOW()
    );

    -- Update parameter
    UPDATE system_configuration.gamification_parameters
    SET classroom_overrides = classroom_overrides || jsonb_build_object(p_classroom_id::TEXT, v_override),
        updated_at = NOW()
    WHERE param_key = p_param_key
      AND is_active = TRUE
      AND is_overridable = TRUE;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE system_configuration.gamification_parameters IS
'Configurable gamification parameters for customizing point values, multipliers,
thresholds, and other game mechanics. Supports tenant and classroom overrides.';

COMMENT ON COLUMN system_configuration.gamification_parameters.param_key IS
'Unique key for the parameter (e.g., ''points_per_exercise'', ''xp_multiplier_weekend'', ''ml_coins_per_mission'')';

COMMENT ON COLUMN system_configuration.gamification_parameters.param_value IS
'Current value of the parameter in JSON format';

COMMENT ON COLUMN system_configuration.gamification_parameters.affects_systems IS
'JSON array of system components affected by this parameter';

COMMENT ON FUNCTION system_configuration.get_gamification_param IS
'Get gamification parameter value with context-specific overrides.
Usage: SELECT system_configuration.get_gamification_param(''points_per_exercise'', tenant_id, classroom_id);';

COMMENT ON FUNCTION system_configuration.set_classroom_gamification_override IS
'Set a classroom-specific override for a gamification parameter.
Usage: SELECT system_configuration.set_classroom_gamification_override(''points_per_exercise'', classroom_uuid, ''150'', ''Advanced class bonus'');';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON system_configuration.gamification_parameters TO gamilit_user;
GRANT EXECUTE ON FUNCTION system_configuration.get_gamification_param TO gamilit_user;
GRANT EXECUTE ON FUNCTION system_configuration.set_classroom_gamification_override TO gamilit_user;
