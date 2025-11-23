-- =====================================================
-- Function: gamilit.set_profile_defaults
-- Description: Establece valores por defecto para nuevos usuarios
-- Parameters: None
-- Returns: trigger
-- Created: 2025-10-27
-- =====================================================

CREATE OR REPLACE FUNCTION gamilit.set_profile_defaults()
RETURNS TRIGGER AS $$
BEGIN
    -- Set default authentication values if not provided
    IF NEW.is_active IS NULL THEN
        NEW.is_active := true;
    END IF;

    IF NEW.email_verified IS NULL THEN
        NEW.email_verified := true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamilit.set_profile_defaults() IS 'Establece valores por defecto para nuevos usuarios (is_active=true, email_verified=true)';
