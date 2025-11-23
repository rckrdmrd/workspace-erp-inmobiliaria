-- =====================================================
-- Seed Data: System Settings (DEV)
-- Description: Configuraciones globales del sistema GLIT
-- Schema: system_configuration
-- Table: system_settings
-- Records: 21 configuraciones
-- Created: 2025-11-02
-- =====================================================

SET search_path TO system_configuration, public;

-- =====================================================
-- INSERT: System Settings
-- =====================================================

INSERT INTO system_configuration.system_settings (
    setting_key,
    setting_category,
    setting_value,
    value_type,
    display_name,
    description,
    is_public,
    created_at,
    updated_at
) VALUES
-- =====================================================
-- CATEGORÍA: general (4 settings)
-- =====================================================
(
    'platform_name',
    'general',
    'GLIT - Gamified Learning Interactive Toolkit',
    'string',
    'Nombre de la Plataforma',
    'Nombre oficial de la plataforma educativa GLIT',
    true,
    NOW(),
    NOW()
),
(
    'default_timezone',
    'general',
    'America/Mexico_City',
    'string',
    'Zona Horaria por Defecto',
    'Zona horaria predeterminada del sistema',
    true,
    NOW(),
    NOW()
),
(
    'default_language',
    'general',
    'es',
    'string',
    'Idioma por Defecto',
    'Idioma predeterminado de la plataforma',
    true,
    NOW(),
    NOW()
),
(
    'platform_version',
    'general',
    '1.0.0',
    'string',
    'Versión de la Plataforma',
    'Versión actual del sistema GLIT',
    true,
    NOW(),
    NOW()
),

-- =====================================================
-- CATEGORÍA: gamification (8 settings)
-- =====================================================
(
    'ml_coins_welcome_bonus',
    'gamification',
    '100',
    'number',
    'Bono de Bienvenida ML Coins',
    'ML Coins otorgados al registrarse en la plataforma',
    false,
    NOW(),
    NOW()
),
(
    'comodin_pistas_cost',
    'gamification',
    '15',
    'number',
    'Costo Comodín: Pistas',
    'ML Coins necesarios para activar el comodín de pistas',
    false,
    NOW(),
    NOW()
),
(
    'comodin_vision_lectora_cost',
    'gamification',
    '25',
    'number',
    'Costo Comodín: Visión Lectora',
    'ML Coins necesarios para activar el comodín de visión lectora',
    false,
    NOW(),
    NOW()
),
(
    'comodin_segunda_oportunidad_cost',
    'gamification',
    '40',
    'number',
    'Costo Comodín: Segunda Oportunidad',
    'ML Coins necesarios para activar el comodín de segunda oportunidad',
    false,
    NOW(),
    NOW()
),
(
    'daily_streak_bonus',
    'gamification',
    '25',
    'number',
    'Bono por Racha Diaria',
    'ML Coins bonus por mantener racha diaria activa',
    false,
    NOW(),
    NOW()
),
(
    'exercise_completion_bonus_min',
    'gamification',
    '10',
    'number',
    'Bono Mínimo por Ejercicio',
    'ML Coins mínimos ganados al completar un ejercicio',
    false,
    NOW(),
    NOW()
),
(
    'exercise_completion_bonus_max',
    'gamification',
    '50',
    'number',
    'Bono Máximo por Ejercicio',
    'ML Coins máximos ganados al completar un ejercicio con puntuación perfecta',
    false,
    NOW(),
    NOW()
),
(
    'perfect_score_bonus',
    'gamification',
    '25',
    'number',
    'Bono por Puntuación Perfecta',
    'ML Coins adicionales por obtener 100% en un ejercicio',
    false,
    NOW(),
    NOW()
),

-- =====================================================
-- CATEGORÍA: security (6 settings)
-- =====================================================
(
    'max_login_attempts',
    'security',
    '5',
    'number',
    'Intentos Máximos de Login',
    'Número máximo de intentos de login fallidos antes de bloquear cuenta',
    false,
    NOW(),
    NOW()
),
(
    'session_timeout_minutes',
    'security',
    '480',
    'number',
    'Timeout de Sesión (minutos)',
    'Tiempo de inactividad en minutos antes de cerrar sesión automáticamente',
    false,
    NOW(),
    NOW()
),
(
    'password_min_length',
    'security',
    '8',
    'number',
    'Longitud Mínima de Contraseña',
    'Número mínimo de caracteres requeridos para contraseña',
    true,
    NOW(),
    NOW()
),
(
    'password_require_uppercase',
    'security',
    'true',
    'boolean',
    'Contraseña Requiere Mayúsculas',
    'Indica si la contraseña debe contener al menos una letra mayúscula',
    true,
    NOW(),
    NOW()
),
(
    'password_require_lowercase',
    'security',
    'true',
    'boolean',
    'Contraseña Requiere Minúsculas',
    'Indica si la contraseña debe contener al menos una letra minúscula',
    true,
    NOW(),
    NOW()
),
(
    'password_require_number',
    'security',
    'true',
    'boolean',
    'Contraseña Requiere Números',
    'Indica si la contraseña debe contener al menos un número',
    true,
    NOW(),
    NOW()
),
(
    'password_require_special',
    'security',
    'false',
    'boolean',
    'Contraseña Requiere Caracteres Especiales',
    'Indica si la contraseña debe contener al menos un carácter especial',
    true,
    NOW(),
    NOW()
),

-- =====================================================
-- CATEGORÍA: email (3 settings)
-- =====================================================
(
    'smtp_host',
    'email',
    'smtp.example.com',
    'string',
    'Servidor SMTP',
    'Dirección del servidor SMTP para envío de correos',
    false,
    NOW(),
    NOW()
),
(
    'from_email',
    'email',
    'noreply@glit.edu.mx',
    'string',
    'Email Remitente',
    'Dirección de correo utilizada como remitente en emails del sistema',
    false,
    NOW(),
    NOW()
),
(
    'support_email',
    'email',
    'soporte@glit.edu.mx',
    'string',
    'Email de Soporte',
    'Dirección de correo para contacto de soporte técnico',
    true,
    NOW(),
    NOW()
)

ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    setting_category = EXCLUDED.setting_category,
    value_type = EXCLUDED.value_type,
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public,
    updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- SELECT setting_category, COUNT(*) as total
-- FROM system_configuration.system_settings
-- GROUP BY setting_category
-- ORDER BY setting_category;

-- =====================================================
-- RESUMEN DE SEEDS
-- =====================================================
-- Total Settings:  21
-- - general:       4 settings
-- - gamification:  8 settings
-- - security:      7 settings
-- - email:         3 settings
--
-- ML Coins Comodines:
-- - Pistas:               15 ML
-- - Visión Lectora:       25 ML
-- - Segunda Oportunidad:  40 ML
--
-- Bonos ML Coins:
-- - Bienvenida:           100 ML
-- - Racha Diaria:         25 ML
-- - Ejercicio Min:        10 ML
-- - Ejercicio Max:        50 ML
-- - Puntuación Perfecta:  25 ML
-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
