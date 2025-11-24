-- ============================================================================
-- GAMILIT Platform - Production Seeds
-- Archivo: seeds/prod/system_configuration/03-notification_settings_global.sql
-- Propósito: Configuración GLOBAL de notificaciones del sistema
-- Creado: 2025-11-08
-- Actualizado: 2025-11-11 (Migrado a notification_settings_global)
-- ============================================================================
--
-- IMPORTANTE: Esta tabla configura notificaciones a nivel SISTEMA (sin user_id).
-- Para preferencias por usuario, ver auth_management.notification_settings
--
-- ============================================================================

-- Configuración de tipos de notificaciones
INSERT INTO system_configuration.notification_settings_global (
    notification_type,
    channel,
    is_enabled,
    priority,
    template_id,
    throttle_minutes,
    batch_enabled,
    batch_window_minutes,
    settings
)
VALUES
    -- Notificaciones de Achievements
    (
        'achievement_unlocked',
        'in_app',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'sound_enabled', true,
            'show_badge', true,
            'auto_dismiss_seconds', 10
        )
    ),
    (
        'achievement_unlocked',
        'email',
        false,
        'low',
        NULL,
        60,
        true,
        1440,
        jsonb_build_object(
            'batch_size', 5,
            'batch_window_hours', 24
        )
    ),

    -- Notificaciones de Rank Promotion
    (
        'rank_promotion',
        'in_app',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'sound_enabled', true,
            'show_animation', true,
            'celebration_effects', true
        )
    ),
    (
        'rank_promotion',
        'email',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        '{}'::jsonb
    ),

    -- Notificaciones de Module Progress
    (
        'module_completed',
        'in_app',
        true,
        'normal',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'show_progress_bar', true,
            'show_next_module', true
        )
    ),

    -- Notificaciones de Assignment
    (
        'assignment_due',
        'in_app',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'advance_notice_hours', 24,
            'reminder_hours', jsonb_build_array(24, 6, 1)
        )
    ),
    (
        'assignment_due',
        'email',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        '{}'::jsonb
    ),
    (
        'assignment_submitted',
        'in_app',
        true,
        'normal',
        NULL,
        0,
        false,
        NULL,
        '{}'::jsonb
    ),

    -- Notificaciones de Classroom
    (
        'classroom_invitation',
        'in_app',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        '{}'::jsonb
    ),
    (
        'classroom_invitation',
        'email',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        '{}'::jsonb
    ),

    -- Notificaciones de Peer Challenges
    (
        'challenge_received',
        'in_app',
        true,
        'normal',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'auto_accept_timeout_hours', 24
        )
    ),
    (
        'challenge_completed',
        'in_app',
        true,
        'normal',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'show_leaderboard', true,
            'show_rewards', true
        )
    ),

    -- Notificaciones para Padres (Parent Portal)
    (
        'daily_summary',
        'email',
        false,
        'low',
        NULL,
        1440,
        true,
        1440,
        jsonb_build_object(
            'send_time', '18:00',
            'timezone', 'America/Mexico_City',
            'include_screenshots', false
        )
    ),
    (
        'weekly_report',
        'email',
        false,
        'low',
        NULL,
        10080,
        false,
        NULL,
        jsonb_build_object(
            'send_day', 'sunday',
            'send_time', '18:00',
            'include_charts', true
        )
    ),
    (
        'monthly_report',
        'email',
        false,
        'low',
        NULL,
        43200,
        false,
        NULL,
        jsonb_build_object(
            'send_day_of_month', 1,
            'include_detailed_analytics', true
        )
    ),
    (
        'low_performance',
        'email',
        false,
        'high',
        NULL,
        1440,
        false,
        NULL,
        jsonb_build_object(
            'threshold_percentage', 60,
            'consecutive_failures', 3
        )
    ),
    (
        'inactivity_alert',
        'email',
        false,
        'normal',
        NULL,
        2880,
        false,
        NULL,
        jsonb_build_object(
            'inactivity_days', 7
        )
    ),

    -- Notificaciones de Sistema
    (
        'system_announcement',
        'in_app',
        true,
        'high',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'persistent', true,
            'dismissable', true
        )
    ),
    (
        'maintenance_scheduled',
        'email',
        true,
        'urgent',
        NULL,
        0,
        false,
        NULL,
        jsonb_build_object(
            'advance_notice_hours', 48
        )
    )

ON CONFLICT (notification_type, channel) DO UPDATE SET
    is_enabled = EXCLUDED.is_enabled,
    priority = EXCLUDED.priority,
    template_id = EXCLUDED.template_id,
    throttle_minutes = EXCLUDED.throttle_minutes,
    batch_enabled = EXCLUDED.batch_enabled,
    batch_window_minutes = EXCLUDED.batch_window_minutes,
    settings = EXCLUDED.settings,
    updated_at = gamilit.now_mexico();

-- Verificación
SELECT
    notification_type,
    channel,
    is_enabled,
    priority,
    CASE
        WHEN is_enabled THEN '✅'
        ELSE '❌'
    END as status,
    throttle_minutes,
    batch_enabled,
    batch_window_minutes
FROM system_configuration.notification_settings_global
ORDER BY
    CASE priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'normal' THEN 3
        WHEN 'low' THEN 4
    END,
    notification_type,
    channel;
