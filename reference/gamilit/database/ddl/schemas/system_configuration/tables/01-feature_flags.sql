-- =============================================================================
-- Table: system_configuration.feature_flags
-- Description: Manages system-wide and tenant-specific feature flags
-- Priority: P0 - CRITICAL for Admin Portal configuration
-- User Story: US-AE-003 (System Configuration), US-ADM-006 (Classroom Config)
-- Created: 2025-11-19
-- =============================================================================

-- Drop table if exists
DROP TABLE IF EXISTS system_configuration.feature_flags CASCADE;

-- Create feature_flags table
CREATE TABLE system_configuration.feature_flags (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Feature identification
    flag_key VARCHAR(100) NOT NULL UNIQUE,
    flag_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),  -- e.g., 'gamification', 'educational', 'admin', 'social', 'integration'

    -- Feature status
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    is_system_wide BOOLEAN NOT NULL DEFAULT TRUE,  -- If false, can be overridden per tenant/classroom

    -- Rollout configuration
    rollout_percentage INTEGER DEFAULT 100,  -- For gradual rollout (0-100)
    rollout_strategy VARCHAR(50) DEFAULT 'all',  -- 'all', 'percentage', 'whitelist', 'beta_users'

    -- Dependencies
    depends_on_flags JSONB DEFAULT '[]'::jsonb,  -- Array of flag_keys that must be enabled
    conflicts_with JSONB DEFAULT '[]'::jsonb,    -- Array of flag_keys that cannot be enabled together

    -- Configuration
    default_value JSONB DEFAULT 'true'::jsonb,   -- Default value when flag is enabled
    config_schema JSONB,                         -- JSON schema for validation
    config_options JSONB DEFAULT '{}'::jsonb,    -- Additional configuration options

    -- Tenant/Scope overrides
    tenant_overrides JSONB DEFAULT '{}'::jsonb,
    -- Example: {"tenant-uuid-1": true, "tenant-uuid-2": false}

    classroom_overrides JSONB DEFAULT '{}'::jsonb,
    -- Example: {"classroom-uuid-1": {"enabled": true, "config": {...}}}

    -- Access control
    required_role VARCHAR(50),  -- Minimum role required to toggle this flag
    is_user_configurable BOOLEAN DEFAULT FALSE,  -- Can users change this flag?

    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,              -- Tags for organization
    documentation_url TEXT,                       -- Link to feature documentation
    changelog TEXT,                               -- Change history

    -- Lifecycle
    created_by UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    enabled_at TIMESTAMPTZ,                      -- When the flag was last enabled
    disabled_at TIMESTAMPTZ,                     -- When the flag was last disabled
    deprecated_at TIMESTAMPTZ,                   -- When the flag was marked as deprecated
    will_be_removed_at TIMESTAMPTZ,              -- Planned removal date

    -- Constraints
    CONSTRAINT feature_flags_rollout_percentage_valid
        CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    CONSTRAINT feature_flags_rollout_strategy_valid
        CHECK (rollout_strategy IN ('all', 'percentage', 'whitelist', 'beta_users', 'gradual'))
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- Primary lookup index
CREATE INDEX idx_feature_flags_key ON system_configuration.feature_flags(flag_key);

-- Index for enabled flags lookup
CREATE INDEX idx_feature_flags_enabled
    ON system_configuration.feature_flags(flag_key)
    WHERE is_enabled = TRUE;

-- Index for category-based queries
CREATE INDEX idx_feature_flags_category
    ON system_configuration.feature_flags(category, is_enabled);

-- Index for system-wide flags
CREATE INDEX idx_feature_flags_system_wide
    ON system_configuration.feature_flags(is_system_wide, is_enabled);

-- GIN index for searching tags
CREATE INDEX idx_feature_flags_tags
    ON system_configuration.feature_flags USING GIN(tags);

-- =============================================================================
-- Trigger for updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.update_feature_flags_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();

    -- Track when flag was enabled/disabled
    IF NEW.is_enabled = TRUE AND OLD.is_enabled = FALSE THEN
        NEW.enabled_at = NOW();
    ELSIF NEW.is_enabled = FALSE AND OLD.is_enabled = TRUE THEN
        NEW.disabled_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_feature_flags_timestamp
    BEFORE UPDATE ON system_configuration.feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION system_configuration.update_feature_flags_timestamp();

-- =============================================================================
-- Helper function to check if feature is enabled for a context
-- =============================================================================

CREATE OR REPLACE FUNCTION system_configuration.is_feature_enabled(
    p_flag_key VARCHAR,
    p_tenant_id UUID DEFAULT NULL,
    p_classroom_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_flag RECORD;
    v_is_enabled BOOLEAN;
BEGIN
    -- Get flag
    SELECT * INTO v_flag
    FROM system_configuration.feature_flags
    WHERE flag_key = p_flag_key;

    IF NOT FOUND THEN
        RETURN FALSE;  -- Flag doesn't exist
    END IF;

    -- Check system-wide status
    IF NOT v_flag.is_enabled THEN
        RETURN FALSE;  -- Flag is disabled system-wide
    END IF;

    -- If system-wide only, return enabled status
    IF v_flag.is_system_wide THEN
        RETURN TRUE;
    END IF;

    -- Check classroom override (highest priority)
    IF p_classroom_id IS NOT NULL THEN
        v_is_enabled := (v_flag.classroom_overrides->p_classroom_id::TEXT->>'enabled')::BOOLEAN;
        IF v_is_enabled IS NOT NULL THEN
            RETURN v_is_enabled;
        END IF;
    END IF;

    -- Check tenant override
    IF p_tenant_id IS NOT NULL THEN
        v_is_enabled := (v_flag.tenant_overrides->p_tenant_id::TEXT)::BOOLEAN;
        IF v_is_enabled IS NOT NULL THEN
            RETURN v_is_enabled;
        END IF;
    END IF;

    -- Default to flag's enabled status
    RETURN v_flag.is_enabled;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE system_configuration.feature_flags IS
'System-wide feature flags for enabling/disabling functionality across the platform.
Supports tenant and classroom-level overrides for granular control.';

COMMENT ON COLUMN system_configuration.feature_flags.flag_key IS
'Unique identifier for the feature flag (e.g., ''enable_gamification'', ''allow_ai_hints'')';

COMMENT ON COLUMN system_configuration.feature_flags.rollout_percentage IS
'Percentage of users/tenants that should have this feature enabled (0-100)';

COMMENT ON FUNCTION system_configuration.is_feature_enabled IS
'Check if a feature is enabled for a specific context (tenant and/or classroom).
Usage: SELECT system_configuration.is_feature_enabled(''my_feature'', tenant_uuid, classroom_uuid);';

-- =============================================================================
-- Grant permissions
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON system_configuration.feature_flags TO gamilit_user;
GRANT EXECUTE ON FUNCTION system_configuration.is_feature_enabled TO gamilit_user;
