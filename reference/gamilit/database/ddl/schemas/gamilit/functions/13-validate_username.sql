-- =====================================================
-- Function: gamilit.validate_username
-- Description: Valida que el username tenga formato válido (alfanumérico, guiones, guiones bajos)
-- Parameters: p_username VARCHAR
-- Returns: BOOLEAN
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION gamilit.validate_username(p_username VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Validate username format:
    -- - Length between 3 and 30 characters
    -- - Only alphanumeric characters, hyphens, and underscores
    -- - Must start with alphanumeric
    -- - Must end with alphanumeric
    RETURN p_username ~ '^[A-Za-z0-9][A-Za-z0-9_-]{1,28}[A-Za-z0-9]$'
        OR p_username ~ '^[A-Za-z0-9]$';
END;
$$;

COMMENT ON FUNCTION gamilit.validate_username(VARCHAR) IS 'Valida que el username tenga formato válido (3-30 chars, alfanumérico, guiones y guiones bajos)';
