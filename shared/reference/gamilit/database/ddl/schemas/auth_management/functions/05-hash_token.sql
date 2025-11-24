-- =====================================================
-- Function: auth_management.hash_token
-- Description: Genera un hash SHA-256 de un token para almacenamiento seguro
-- Priority: CRITICAL - Security functions dependency
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION auth_management.hash_token(p_token TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
AS $$
BEGIN
    IF p_token IS NULL OR p_token = '' THEN
        RAISE EXCEPTION 'Token cannot be NULL or empty';
    END IF;

    -- Hash the token using SHA-256
    RETURN encode(digest(p_token, 'sha256'), 'hex');
END;
$$;

COMMENT ON FUNCTION auth_management.hash_token IS 'Genera un hash SHA-256 de un token para almacenamiento seguro en base de datos';

-- Grant permissions
GRANT EXECUTE ON FUNCTION auth_management.hash_token TO gamilit_user;
