-- =====================================================
-- Seed Data: Initialize User Gamification (DEV ONLY)
-- =====================================================
-- Description: Inicializa user_stats y user_ranks para usuarios existentes
-- Environment: DEVELOPMENT ONLY (NO production/staging)
-- Date: 2025-11-02
-- Migrated by: SA-SEEDS-GAM-01
-- =====================================================

SET search_path TO gamification_system, auth_management, auth, public;

BEGIN;

-- =====================================================
-- INICIALIZAR USER_STATS
-- =====================================================

INSERT INTO gamification_system.user_stats (
    user_id,
    tenant_id,
    level,
    total_xp,
    xp_to_next_level,
    ml_coins,
    ml_coins_earned_total,
    ml_coins_spent_total,
    current_streak,
    max_streak,
    days_active_total,
    exercises_completed,
    modules_completed,
    total_score,
    average_score,
    achievements_earned,
    certificates_earned,
    sessions_count,
    weekly_xp,
    monthly_xp,
    weekly_exercises,
    created_at,
    updated_at
)
SELECT
    u.id,
    p.tenant_id,
    1,
    0,
    100,
    100,
    100,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0.0,
    0,
    0,
    0,
    0,
    0,
    0,
    NOW(),
    NOW()
FROM auth.users u
LEFT JOIN auth_management.profiles p ON u.id = p.user_id
WHERE u.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM gamification_system.user_stats us
    WHERE us.user_id = u.id
  );

-- =====================================================
-- INICIALIZAR USER_RANKS
-- =====================================================

INSERT INTO gamification_system.user_ranks (
    user_id,
    tenant_id,
    current_rank,
    previous_rank,
    rank_progress_percentage,
    modules_required_for_next,
    modules_completed_for_rank,
    xp_required_for_next,
    xp_earned_for_rank,
    ml_coins_bonus,
    is_current,
    achieved_at,
    created_at,
    updated_at
)
SELECT
    u.id,
    p.tenant_id,
    'Ajaw',  -- Rango inicial Maya (nivel 1)
    NULL,
    0,
    2,
    0,
    500,
    0,
    0,
    true,
    NOW(),
    NOW(),
    NOW()
FROM auth.users u
LEFT JOIN auth_management.profiles p ON u.id = p.user_id
WHERE u.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM gamification_system.user_ranks ur
    WHERE ur.user_id = u.id AND ur.is_current = true
  );

COMMIT;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

DO $$
DECLARE
    stats_count INT;
    ranks_count INT;
    users_count INT;
BEGIN
    SELECT COUNT(*) INTO users_count FROM auth.users WHERE deleted_at IS NULL;
    SELECT COUNT(*) INTO stats_count FROM gamification_system.user_stats;
    SELECT COUNT(*) INTO ranks_count FROM gamification_system.user_ranks WHERE is_current = true;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '  Inicialización de Gamificación (DEV)';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Usuarios totales:    %', users_count;
    RAISE NOTICE 'User stats creados:  %', stats_count;
    RAISE NOTICE 'User ranks creados:  %', ranks_count;
    RAISE NOTICE '';

    IF stats_count >= users_count AND ranks_count >= users_count THEN
        RAISE NOTICE '✅ Todos los usuarios tienen stats y ranks inicializados';
    ELSE
        RAISE WARNING '⚠️ Algunos usuarios no tienen stats o ranks completos';
    END IF;
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- ENVIRONMENT: DEV ONLY
-- CORRECCIONES APLICADAS:
-- 1. Cambiado 'MERCENARIO' a 'mercenario' (lowercase para compatibilidad ENUM)
-- 2. Cambiado gamilit.now_mexico() a NOW() (función puede no existir aún)
-- 3. Agregado SET search_path para seguridad
-- 4. Envuelto en BEGIN/COMMIT para atomicidad
-- 5. Este script NO debe ejecutarse en production/staging
-- =====================================================
