-- =====================================================
-- Function: auth_management.update_user_preferences
-- Description: Actualiza las preferencias de usuario (tema, idioma, notificaciones)
-- Priority: HIGH - User experience
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION auth_management.update_user_preferences(
    p_user_id UUID,
    p_theme VARCHAR DEFAULT NULL,
    p_language VARCHAR DEFAULT NULL,
    p_notifications_enabled BOOLEAN DEFAULT NULL,
    p_email_notifications BOOLEAN DEFAULT NULL,
    p_sound_enabled BOOLEAN DEFAULT NULL,
    p_tutorial_completed BOOLEAN DEFAULT NULL,
    p_preferences JSONB DEFAULT NULL
)
RETURNS TABLE (
    user_id UUID,
    theme VARCHAR,
    language VARCHAR,
    notifications_enabled BOOLEAN,
    email_notifications BOOLEAN,
    sound_enabled BOOLEAN,
    tutorial_completed BOOLEAN,
    preferences JSONB,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify user exists
    IF NOT EXISTS (SELECT 1 FROM auth_management.profiles WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
    END IF;

    -- Update preferences, creating if not exists
    INSERT INTO auth_management.user_preferences (
        user_id, theme, language, notifications_enabled,
        email_notifications, sound_enabled, tutorial_completed, preferences
    ) VALUES (
        p_user_id,
        COALESCE(p_theme, 'light'),
        COALESCE(p_language, 'es'),
        COALESCE(p_notifications_enabled, true),
        COALESCE(p_email_notifications, true),
        COALESCE(p_sound_enabled, true),
        COALESCE(p_tutorial_completed, false),
        COALESCE(p_preferences, '{}')
    )
    ON CONFLICT (user_id) DO UPDATE SET
        theme = COALESCE(p_theme, user_preferences.theme),
        language = COALESCE(p_language, user_preferences.language),
        notifications_enabled = COALESCE(p_notifications_enabled, user_preferences.notifications_enabled),
        email_notifications = COALESCE(p_email_notifications, user_preferences.email_notifications),
        sound_enabled = COALESCE(p_sound_enabled, user_preferences.sound_enabled),
        tutorial_completed = COALESCE(p_tutorial_completed, user_preferences.tutorial_completed),
        preferences = CASE
            WHEN p_preferences IS NOT NULL THEN p_preferences
            ELSE user_preferences.preferences
        END,
        updated_at = NOW()
    RETURNING
        user_preferences.user_id,
        user_preferences.theme,
        user_preferences.language,
        user_preferences.notifications_enabled,
        user_preferences.email_notifications,
        user_preferences.sound_enabled,
        user_preferences.tutorial_completed,
        user_preferences.preferences,
        user_preferences.updated_at;
END;
$$;

COMMENT ON FUNCTION auth_management.update_user_preferences IS 'Actualiza las preferencias de usuario (tema, idioma, notificaciones, sonido, tutorial)';

-- Grant permissions
GRANT EXECUTE ON FUNCTION auth_management.update_user_preferences TO gamilit_user;
