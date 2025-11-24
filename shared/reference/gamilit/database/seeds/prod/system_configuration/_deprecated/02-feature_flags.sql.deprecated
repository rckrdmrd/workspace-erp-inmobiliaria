-- =====================================================
-- Seed: system_configuration.feature_flags (PROD)
-- Description: Feature flags para producción
-- Environment: PRODUCTION
-- Dependencies: None
-- Order: 02
-- Created: 2025-11-11
-- Version: 2.0 (reescrito para carga limpia)
-- =====================================================
--
-- CAMBIOS v2.0:
-- - CORREGIDO: key → feature_key
-- - CORREGIDO: name → feature_name
-- - Cambiado NOW() → gamilit.now_mexico()
-- - Estructura alineada 100% con DDL
--
-- VALIDADO CONTRA:
-- - DDL: ddl/schemas/system_configuration/tables/02-feature_flags.sql
--
-- =====================================================

SET search_path TO system_configuration, public;

-- =====================================================
-- INSERT: Feature Flags (PRODUCTION)
-- =====================================================

INSERT INTO system_configuration.feature_flags (
    feature_key,
    feature_name,
    description,
    is_enabled,
    rollout_percentage
) VALUES
-- Core Features - ENABLED
('gamification_enabled', 'Sistema de Gamificación', 'Activa logros, XP y ML Coins', true, 100),
('progress_tracking_enabled', 'Seguimiento de Progreso', 'Activa tracking de módulos y ejercicios', true, 100),
('social_features_enabled', 'Características Sociales', 'Activa aulas virtuales y equipos', true, 100),

-- Advanced Features - CONTROLLED ROLLOUT
('ai_recommendations', 'Recomendaciones IA', 'Sugerencias personalizadas con IA', false, 0),
('advanced_analytics', 'Analíticas Avanzadas', 'Dashboard de analíticas extendido', false, 0),
('multiplayer_challenges', 'Desafíos Multijugador', 'Competencias en tiempo real', false, 0)

ON CONFLICT (feature_key) DO UPDATE SET
    feature_name = EXCLUDED.feature_name,
    description = EXCLUDED.description,
    is_enabled = EXCLUDED.is_enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    flags_count INTEGER;
    enabled_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO flags_count FROM system_configuration.feature_flags;
    SELECT COUNT(*) INTO enabled_count FROM system_configuration.feature_flags WHERE is_enabled = true;
    RAISE NOTICE '✓ Feature flags insertados: % total (% habilitados)', flags_count, enabled_count;
END $$;
