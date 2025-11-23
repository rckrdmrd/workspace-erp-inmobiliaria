-- =====================================================
-- Function: gamilit.validate_email_format
-- Description: Valida que el formato del email sea correcto
-- Parameters: p_email VARCHAR
-- Returns: BOOLEAN
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION gamilit.validate_email_format(p_email VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Validate email format using regex pattern
    -- Basic pattern: local-part@domain.extension
    RETURN p_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

COMMENT ON FUNCTION gamilit.validate_email_format(VARCHAR) IS 'Valida que el formato del email sea correcto usando patrón regex';
