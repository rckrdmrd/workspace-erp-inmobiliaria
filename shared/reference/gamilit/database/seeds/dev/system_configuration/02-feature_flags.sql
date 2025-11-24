-- =====================================================
-- Seed Data: Feature Flags (DEV)
-- Description: Feature flags para control de funcionalidades GLIT
-- Schema: system_configuration
-- Table: feature_flags
-- Records: 5 feature flags
-- Created: 2025-11-02
-- =====================================================

SET search_path TO system_configuration, public;

-- =====================================================
-- INSERT: Feature Flags
-- =====================================================

INSERT INTO system_configuration.feature_flags (
    feature_name,
    feature_key,
    description,
    is_enabled,
    rollout_percentage,
    target_roles,
    created_at,
    updated_at
) VALUES
-- =====================================================
-- FEATURE FLAG 1: Sistema de Misiones
-- Status: ENABLED - Rollout: 100%
-- =====================================================
(
    'Sistema de Misiones',
    'missions_system',
    'Habilitar sistema de misiones diarias y semanales para estudiantes',
    true,
    100,
    NULL,
    NOW(),
    NOW()
),

-- =====================================================
-- FEATURE FLAG 2: Leaderboards Globales
-- Status: ENABLED - Rollout: 100%
-- =====================================================
(
    'Leaderboards Globales',
    'global_leaderboards',
    'Habilitar rankings globales públicos visibles para todos los usuarios',
    true,
    100,
    NULL,
    NOW(),
    NOW()
),

-- =====================================================
-- FEATURE FLAG 3: Equipos Colaborativos
-- Status: ENABLED - Rollout: 100%
-- =====================================================
(
    'Equipos Colaborativos',
    'collaborative_teams',
    'Permitir creación y participación en equipos de estudiantes para desafíos grupales',
    true,
    100,
    NULL,
    NOW(),
    NOW()
),

-- =====================================================
-- FEATURE FLAG 4: Chat en Vivo
-- Status: DISABLED - Rollout: 0%
-- =====================================================
(
    'Chat en Vivo',
    'live_chat',
    'Chat en tiempo real entre estudiantes para colaboración y soporte peer-to-peer',
    false,
    0,
    NULL,
    NOW(),
    NOW()
),

-- =====================================================
-- FEATURE FLAG 5: Modo Competitivo
-- Status: DISABLED - Rollout: 10% (A/B Testing)
-- Target: Solo estudiantes
-- =====================================================
(
    'Modo Competitivo',
    'competitive_mode',
    'Desafíos 1v1 entre estudiantes con sistema de matchmaking y recompensas especiales',
    false,
    10,
    ARRAY['student'::public.gamilit_role],
    NOW(),
    NOW()
)

ON CONFLICT (feature_key) DO UPDATE SET
    feature_name = EXCLUDED.feature_name,
    description = EXCLUDED.description,
    is_enabled = EXCLUDED.is_enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    target_roles = EXCLUDED.target_roles,
    updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Ver feature flags activos
-- SELECT feature_key, feature_name, is_enabled, rollout_percentage, target_roles
-- FROM system_configuration.feature_flags
-- WHERE is_enabled = true;

-- Ver feature flags en testing/desarrollo
-- SELECT feature_key, feature_name, is_enabled, rollout_percentage, target_roles
-- FROM system_configuration.feature_flags
-- WHERE is_enabled = false OR rollout_percentage < 100;

-- =====================================================
-- RESUMEN DE FEATURE FLAGS
-- =====================================================
-- Total Feature Flags: 5
--
-- HABILITADOS (100% Rollout):
-- 1. missions_system        - Sistema de Misiones
-- 2. global_leaderboards    - Leaderboards Globales
-- 3. collaborative_teams    - Equipos Colaborativos
--
-- DESHABILITADOS:
-- 4. live_chat              - Chat en Vivo (0% rollout)
--
-- EN A/B TESTING:
-- 5. competitive_mode       - Modo Competitivo (10% rollout, solo students)
--
-- ESTRATEGIA DE ROLLOUT:
-- - Features core del sistema: 100% habilitadas
-- - Chat en vivo: Pendiente de activación
-- - Modo competitivo: Testing gradual con 10% de estudiantes
-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
