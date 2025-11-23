-- =====================================================
-- Seed: system_configuration.system_settings (PROD)
-- Description: Configuración global de la plataforma para producción
-- Environment: PRODUCTION
-- Dependencies: None
-- Order: 01
-- Created: 2025-11-11
-- Version: 2.0 (reescrito para carga limpia)
-- =====================================================
--
-- CAMBIOS v2.0:
-- - CORREGIDO: key → setting_key
-- - CORREGIDO: value → setting_value  
-- - CORREGIDO: type → value_type
-- - CORREGIDO: category → setting_category
-- - Cambiado NOW() → gamilit.now_mexico()
-- - Estructura alineada 100% con DDL
--
-- VALIDADO CONTRA:
-- - DDL: ddl/schemas/system_configuration/tables/01-system_settings.sql
--
-- =====================================================

SET search_path TO system_configuration, public;

-- =====================================================
-- INSERT: System Settings (PRODUCTION)
-- =====================================================

INSERT INTO system_configuration.system_settings (
    setting_key,
    setting_category,
    setting_value,
    value_type,
    display_name,
    description,
    is_public
) VALUES
-- General Settings
('platform_name', 'general', 'GAMILIT', 'string', 'Nombre de la Plataforma', 'Nombre público de la plataforma', true),
('platform_version', 'general', '2.3.0', 'string', 'Versión', 'Versión actual de la plataforma', true),
('max_upload_size_mb', 'storage', '50', 'number', 'Tamaño Máximo de Archivo', 'Tamaño máximo de archivo en MB', false),

-- Gamification Settings
('daily_ml_coins_limit', 'gamification', '500', 'number', 'Límite Diario ML Coins', 'Máximo de ML Coins que un usuario puede ganar por día', true),
('xp_multiplier', 'gamification', '1.0', 'number', 'Multiplicador XP', 'Multiplicador global de experiencia', false),

-- Security Settings
('session_timeout_minutes', 'security', '120', 'number', 'Timeout de Sesión', 'Minutos antes de cerrar sesión automáticamente', false),
('max_login_attempts', 'security', '5', 'number', 'Intentos Máximos de Login', 'Intentos antes de bloquear cuenta', false)

ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    settings_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO settings_count FROM system_configuration.system_settings;
    RAISE NOTICE '✓ System settings insertados: % configuraciones', settings_count;
END $$;
