-- =====================================================
-- Function: gamilit.update_user_last_login
-- Description: Actualiza la fecha y hora del último login de un usuario
-- Parameters: p_user_id UUID
-- Returns: void
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION gamilit.update_user_last_login(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE auth_management.profiles
    SET
        last_activity_at = gamilit.now_mexico(),
        updated_at = gamilit.now_mexico()
    WHERE id = p_user_id;
END;
$$;

COMMENT ON FUNCTION gamilit.update_user_last_login(UUID) IS 'Actualiza la fecha y hora del último login de un usuario';
