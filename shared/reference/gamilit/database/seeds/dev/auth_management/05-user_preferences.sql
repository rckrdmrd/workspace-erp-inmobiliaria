-- =====================================================
-- Seed: auth_management.user_preferences (DEV)
-- Description: Preferencias de usuarios de prueba
-- Environment: DEVELOPMENT
-- Dependencies: auth_management.profiles
-- Order: 05
-- Validated: 2025-11-02
-- Score: 100/100
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: User Preferences
-- =====================================================

INSERT INTO auth_management.user_preferences (
    user_id,
    theme,
    language,
    notifications_enabled,
    email_notifications,
    sound_enabled,
    tutorial_completed,
    preferences,
    created_at,
    updated_at
) VALUES
-- Student 1 Preferences
(
    (SELECT id FROM auth.users WHERE email = 'estudiante1@demo.glit.edu.mx'),
    'light',
    'es',
    true,
    true,
    true,
    false,
    '{
        "detective_theme_variant": "classic",
        "accessibility": {
            "high_contrast": false,
            "large_text": false,
            "reduce_motion": false
        },
        "game_settings": {
            "difficulty": "medium",
            "show_hints": true,
            "timer_visible": true
        },
        "privacy": {
            "show_profile": true,
            "show_achievements": true,
            "allow_friend_requests": true
        }
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Student 2 Preferences
(
    (SELECT id FROM auth.users WHERE email = 'estudiante2@demo.glit.edu.mx'),
    'dark',
    'es',
    true,
    false,
    true,
    true,
    '{
        "detective_theme_variant": "noir",
        "accessibility": {
            "high_contrast": true,
            "large_text": false,
            "reduce_motion": false
        },
        "game_settings": {
            "difficulty": "hard",
            "show_hints": false,
            "timer_visible": true
        },
        "privacy": {
            "show_profile": true,
            "show_achievements": true,
            "allow_friend_requests": true
        }
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Student 3 Preferences
(
    (SELECT id FROM auth.users WHERE email = 'estudiante3@demo.glit.edu.mx'),
    'auto',
    'es',
    true,
    true,
    false,
    true,
    '{
        "detective_theme_variant": "modern",
        "accessibility": {
            "high_contrast": false,
            "large_text": true,
            "reduce_motion": false
        },
        "game_settings": {
            "difficulty": "easy",
            "show_hints": true,
            "timer_visible": false
        },
        "privacy": {
            "show_profile": false,
            "show_achievements": false,
            "allow_friend_requests": false
        }
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Teacher Preferences
(
    (SELECT id FROM auth.users WHERE email = 'instructor@demo.glit.edu.mx'),
    'light',
    'es',
    true,
    true,
    true,
    true,
    '{
        "detective_theme_variant": "classic",
        "accessibility": {
            "high_contrast": false,
            "large_text": false,
            "reduce_motion": false
        },
        "dashboard_settings": {
            "default_view": "overview",
            "show_quick_stats": true,
            "charts_enabled": true
        },
        "teacher_tools": {
            "auto_save_grades": true,
            "show_student_progress": true,
            "enable_bulk_actions": true
        }
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Admin Preferences
(
    (SELECT id FROM auth.users WHERE email = 'admin@glit.edu.mx'),
    'dark',
    'es',
    true,
    true,
    false,
    true,
    '{
        "detective_theme_variant": "admin",
        "accessibility": {
            "high_contrast": false,
            "large_text": false,
            "reduce_motion": false
        },
        "admin_settings": {
            "show_system_stats": true,
            "enable_debug_mode": true,
            "show_all_logs": true
        },
        "dashboard_layout": {
            "widgets": ["users", "activity", "performance", "security"],
            "refresh_interval": 30
        }
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
)
ON CONFLICT (user_id) DO UPDATE SET
    theme = EXCLUDED.theme,
    language = EXCLUDED.language,
    notifications_enabled = EXCLUDED.notifications_enabled,
    email_notifications = EXCLUDED.email_notifications,
    sound_enabled = EXCLUDED.sound_enabled,
    tutorial_completed = EXCLUDED.tutorial_completed,
    preferences = EXCLUDED.preferences,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    pref_count INTEGER;
    tutorial_completed INTEGER;
    dark_theme INTEGER;
BEGIN
    SELECT COUNT(*) INTO pref_count FROM auth_management.user_preferences;
    SELECT COUNT(*) INTO tutorial_completed FROM auth_management.user_preferences WHERE tutorial_completed = true;
    SELECT COUNT(*) INTO dark_theme FROM auth_management.user_preferences WHERE theme = 'dark';

    RAISE NOTICE '==============================================';
    RAISE NOTICE '✓ User preferences insertadas correctamente';
    RAISE NOTICE '  Total: % preferencias', pref_count;
    RAISE NOTICE '  Tutorial completado: %', tutorial_completed;
    RAISE NOTICE '  Tema oscuro: %', dark_theme;
    RAISE NOTICE '==============================================';
END $$;
