-- =====================================================
-- Seed: gamification_system.user_stats - Production Users
-- Description: User stats para usuarios reales registrados en producción
-- Environment: PRODUCTION
-- Dependencies: auth/02-production-users.sql, auth_management/06-profiles-production.sql
-- Order: 01
-- Created: 2025-11-19
-- Version: 1.0 (Inicialización para usuarios migrados)
-- =====================================================
--
-- ESTADÍSTICAS DE USUARIOS REALES REGISTRADOS (13):
-- Inicialización de user_stats para los 13 usuarios migrados
-- que NO fueron inicializados automáticamente por el trigger
--
-- PROBLEMA IDENTIFICADO:
-- El trigger initialize_user_stats() NO se disparó automáticamente
-- para los usuarios migrados, por lo que se crean manualmente aquí.
--
-- POLÍTICA DE CARGA LIMPIA:
-- ✅ Inicialización manual de user_stats para usuarios de producción
-- ✅ 100 ML Coins de bienvenida por defecto
-- ✅ Level 1, Rank Ajaw (rango inicial)
--
-- IMPORTANTE: Este seed debe cargarse DESPUÉS de:
-- - seeds/prod/auth/02-production-users.sql
-- - seeds/prod/auth_management/06-profiles-production.sql
-- =====================================================

SET search_path TO gamification_system, auth_management, auth, public;

-- =====================================================
-- INSERT: Production User Stats (13 usuarios)
-- =====================================================

INSERT INTO gamification_system.user_stats (
    user_id,              -- FK a auth.users.id (NO profiles.id)
    tenant_id,
    ml_coins,
    ml_coins_earned_total,
    level,
    total_xp,
    current_rank,
    exercises_completed,
    created_at,
    updated_at
)
SELECT
    u.id as user_id,                      -- auth.users.id
    p.tenant_id,
    100 as ml_coins,                      -- Bonus de bienvenida
    100 as ml_coins_earned_total,
    1 as level,
    0 as total_xp,
    'Ajaw'::gamification_system.maya_rank as current_rank,
    0 as exercises_completed,
    u.created_at,                         -- Usar fecha de creación del usuario
    u.created_at
FROM auth.users u
JOIN auth_management.profiles p ON p.user_id = u.id
WHERE u.email IN (
    'joseal.guirre34@gmail.com',
    'sergiojimenezesteban63@gmail.com',
    'Gomezfornite92@gmail.com',
    'Aragon494gt54@icloud.com',
    'blu3wt7@gmail.com',
    'ricardolugo786@icloud.com',
    'marbancarlos916@gmail.com',
    'diego.colores09@gmail.com',
    'hernandezfonsecabenjamin7@gmail.com',
    'jr7794315@gmail.com',
    'barraganfer03@gmail.com',
    'roman.rebollar.marcoantonio1008@gmail.com',
    'rodrigoguerrero0914@gmail.com'
)
ON CONFLICT (user_id) DO NOTHING;  -- No sobreescribir si ya existe

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    production_stats_count INTEGER;
BEGIN
    -- Contar user_stats de usuarios de producción
    SELECT COUNT(*) INTO production_stats_count
    FROM gamification_system.user_stats us
    JOIN auth.users u ON u.id = us.user_id
    WHERE u.email NOT LIKE '%@gamilit.com';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'USER STATS DE PRODUCCIÓN CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'User stats de producción: %', production_stats_count;
    RAISE NOTICE '========================================';

    IF production_stats_count >= 13 THEN
        RAISE NOTICE '✓ Los user stats de producción fueron creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban al menos 13 user stats de producción, se crearon %', production_stats_count;
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v1.0 (2025-11-19): Primera versión
--   - Inicialización manual de user_stats para 13 usuarios migrados
--   - 100 ML Coins de bienvenida
--   - Level 1, Rank Ajaw
--   - Workaround para trigger que no se disparó automáticamente
-- =====================================================
