-- =====================================================
-- Función: queue_batch_notifications
-- Schema: notifications
-- Descripción: Encola notificaciones masivas a múltiples usuarios
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION notifications.queue_batch_notifications(
    p_user_ids UUID[],
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'::jsonb,
    p_priority VARCHAR DEFAULT 'normal'
) RETURNS INTEGER AS $$
DECLARE
    v_user_id UUID;
    v_count INTEGER := 0;
    v_notification_id UUID;
BEGIN
    -- Validar que hay usuarios
    IF array_length(p_user_ids, 1) IS NULL OR array_length(p_user_ids, 1) = 0 THEN
        RAISE EXCEPTION 'No users provided for batch notification';
    END IF;

    -- Iterar sobre cada usuario y crear notificación
    FOREACH v_user_id IN ARRAY p_user_ids
    LOOP
        -- Usar la función send_notification para crear y encolar
        BEGIN
            v_notification_id := notifications.send_notification(
                v_user_id,
                p_type,
                p_title,
                p_message,
                p_data,
                p_priority
            );

            IF v_notification_id IS NOT NULL THEN
                v_count := v_count + 1;
            END IF;

        EXCEPTION
            WHEN OTHERS THEN
                -- Log del error pero continuar con los demás usuarios
                RAISE WARNING 'Error creating notification for user %: %', v_user_id, SQLERRM;
        END;
    END LOOP;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios
COMMENT ON FUNCTION notifications.queue_batch_notifications(UUID[], VARCHAR, VARCHAR, TEXT, JSONB, VARCHAR) IS
'Encola notificaciones masivas a múltiples usuarios de forma eficiente';
