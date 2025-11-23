-- =====================================================
-- Función: get_user_preferences
-- Schema: notifications
-- Descripción: Obtiene las preferencias de notificaciones de un usuario
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION notifications.get_user_preferences(
    p_user_id UUID
) RETURNS TABLE (
    notification_type VARCHAR,
    in_app_enabled BOOLEAN,
    email_enabled BOOLEAN,
    push_enabled BOOLEAN,
    email_frequency VARCHAR,
    quiet_hours_start TIME,
    quiet_hours_end TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        np.notification_type,
        np.in_app_enabled,
        np.email_enabled,
        np.push_enabled,
        np.email_frequency,
        np.quiet_hours_start,
        np.quiet_hours_end
    FROM notifications.notification_preferences np
    WHERE np.user_id = p_user_id
    ORDER BY np.notification_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON FUNCTION notifications.get_user_preferences(UUID) IS
'Obtiene todas las preferencias de notificaciones configuradas por un usuario';
