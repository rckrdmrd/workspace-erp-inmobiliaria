-- =====================================================
-- Función: send_notification
-- Schema: notifications
-- Descripción: Crea una notificación y la encola para envío
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION notifications.send_notification(
    p_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'::jsonb,
    p_priority VARCHAR DEFAULT 'normal'
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_channels VARCHAR(50)[];
    v_prefs RECORD;
BEGIN
    -- Obtener preferencias del usuario para este tipo de notificación
    SELECT
        COALESCE(np.in_app_enabled, true) as in_app_enabled,
        COALESCE(np.email_enabled, true) as email_enabled,
        COALESCE(np.push_enabled, true) as push_enabled
    INTO v_prefs
    FROM notifications.notification_preferences np
    WHERE np.user_id = p_user_id
      AND np.notification_type = p_type
    LIMIT 1;

    -- Si no hay preferencias, usar valores por defecto (todos habilitados)
    IF v_prefs IS NULL THEN
        v_prefs := ROW(true, true, true);
    END IF;

    -- Construir array de canales habilitados
    v_channels := ARRAY[]::VARCHAR(50)[];

    IF v_prefs.in_app_enabled THEN
        v_channels := v_channels || 'in_app';
    END IF;

    IF v_prefs.email_enabled THEN
        v_channels := v_channels || 'email';
    END IF;

    IF v_prefs.push_enabled THEN
        v_channels := v_channels || 'push';
    END IF;

    -- Si no hay canales habilitados, usar solo in_app por defecto
    IF array_length(v_channels, 1) IS NULL OR array_length(v_channels, 1) = 0 THEN
        v_channels := ARRAY['in_app'];
    END IF;

    -- Crear notificación
    INSERT INTO notifications.notifications (
        user_id,
        type,
        title,
        message,
        data,
        priority,
        channels,
        status
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_data,
        p_priority,
        v_channels,
        'pending'
    ) RETURNING id INTO v_notification_id;

    -- Encolar para envío en cada canal habilitado
    INSERT INTO notifications.notification_queue (
        notification_id,
        channel,
        scheduled_for,
        priority,
        status
    )
    SELECT
        v_notification_id,
        unnest(v_channels),
        gamilit.now_mexico(),
        CASE p_priority
            WHEN 'urgent' THEN 10
            WHEN 'high' THEN 5
            WHEN 'normal' THEN 0
            ELSE -5
        END,
        'queued';

    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON FUNCTION notifications.send_notification(UUID, VARCHAR, VARCHAR, TEXT, JSONB, VARCHAR) IS
'Crea una notificación respetando las preferencias del usuario y la encola para envío';
