-- =====================================================
-- Script: Validate Seeds Integrity
-- Description: Valida integridad referencial de todos los seeds
-- Created: 2025-11-15
-- Version: 1.0
-- =====================================================
--
-- PROPÓSITO:
-- Este script verifica que:
-- 1. No haya registros huérfanos (FK rotas)
-- 2. Conteos de registros coincidan (users = profiles = user_stats)
-- 3. Triggers funcionaron correctamente
-- 4. Seeds sociales tienen datos suficientes
--
-- EJECUCIÓN:
-- psql -U gamilit_user -d gamilit_platform -f validate-seeds-integrity.sql
-- =====================================================

\set QUIET on
\timing off

-- Configurar search path
SET search_path TO auth_management, gamification_system, social_features, educational_content, public;

-- =====================================================
-- Sección 1: Conteos Básicos
-- =====================================================

\echo ''
\echo '========================================'
\echo '1. CONTEOS BÁSICOS'
\echo '========================================'

DO $$
DECLARE
    users_count INTEGER;
    profiles_count INTEGER;
    user_stats_count INTEGER;
    user_ranks_count INTEGER;
    comodines_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_count FROM auth.users;
    SELECT COUNT(*) INTO profiles_count FROM auth_management.profiles;
    SELECT COUNT(*) INTO user_stats_count FROM gamification_system.user_stats;
    SELECT COUNT(*) INTO user_ranks_count FROM gamification_system.user_ranks;
    SELECT COUNT(*) INTO comodines_count FROM gamification_system.comodines_inventory;

    RAISE NOTICE 'auth.users: %', users_count;
    RAISE NOTICE 'auth_management.profiles: %', profiles_count;
    RAISE NOTICE 'gamification_system.user_stats: %', user_stats_count;
    RAISE NOTICE 'gamification_system.user_ranks: %', user_ranks_count;
    RAISE NOTICE 'gamification_system.comodines_inventory: %', comodines_count;
    RAISE NOTICE '';

    IF users_count = profiles_count AND profiles_count = user_stats_count AND user_stats_count = user_ranks_count THEN
        RAISE NOTICE '✓ PASS: Todos los conteos coinciden (%)', users_count;
    ELSE
        RAISE WARNING '✗ FAIL: Conteos no coinciden';
        RAISE WARNING 'Diferencias detectadas - verificar triggers y seeds';
    END IF;
END $$;

-- =====================================================
-- Sección 2: Integridad Referencial
-- =====================================================

\echo ''
\echo '========================================'
\echo '2. INTEGRIDAD REFERENCIAL'
\echo '========================================'

DO $$
DECLARE
    orphan_profiles INTEGER;
    orphan_user_stats INTEGER;
    orphan_user_ranks INTEGER;
    orphan_comodines INTEGER;
BEGIN
    -- Profiles sin user
    SELECT COUNT(*) INTO orphan_profiles
    FROM auth_management.profiles p
    LEFT JOIN auth.users u ON u.id = p.user_id
    WHERE u.id IS NULL;

    -- User_stats sin profile
    SELECT COUNT(*) INTO orphan_user_stats
    FROM gamification_system.user_stats us
    LEFT JOIN auth_management.profiles p ON p.user_id = us.user_id
    WHERE p.id IS NULL;

    -- User_ranks sin user_stats
    SELECT COUNT(*) INTO orphan_user_ranks
    FROM gamification_system.user_ranks ur
    LEFT JOIN gamification_system.user_stats us ON us.user_id = ur.user_id
    WHERE us.id IS NULL;

    -- Comodines sin user
    SELECT COUNT(*) INTO orphan_comodines
    FROM gamification_system.comodines_inventory ci
    LEFT JOIN auth_management.profiles p ON p.user_id = ci.user_id
    WHERE p.id IS NULL;

    RAISE NOTICE 'Profiles huérfanos (sin user): %', orphan_profiles;
    RAISE NOTICE 'User_stats huérfanos (sin profile): %', orphan_user_stats;
    RAISE NOTICE 'User_ranks huérfanos (sin user_stats): %', orphan_user_ranks;
    RAISE NOTICE 'Comodines huérfanos (sin user): %', orphan_comodines;
    RAISE NOTICE '';

    IF orphan_profiles = 0 AND orphan_user_stats = 0 AND orphan_user_ranks = 0 AND orphan_comodines = 0 THEN
        RAISE NOTICE '✓ PASS: No hay registros huérfanos';
    ELSE
        RAISE WARNING '✗ FAIL: Se encontraron registros huérfanos';
        RAISE WARNING 'Ejecutar limpieza de huérfanos';
    END IF;
END $$;

-- =====================================================
-- Sección 3: Datos Educativos
-- =====================================================

\echo ''
\echo '========================================'
\echo '3. CONTENIDO EDUCATIVO'
\echo '========================================'

DO $$
DECLARE
    modules_count INTEGER;
    published_modules INTEGER;
    exercises_count INTEGER;
    achievements_count INTEGER;
    ranks_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO modules_count FROM educational_content.modules;
    SELECT COUNT(*) INTO published_modules FROM educational_content.modules WHERE is_published = true;
    SELECT COUNT(*) INTO exercises_count FROM educational_content.exercises;
    SELECT COUNT(*) INTO achievements_count FROM gamification_system.achievements WHERE is_active = true;
    SELECT COUNT(*) INTO ranks_count FROM gamification_system.maya_ranks WHERE is_active = true;

    RAISE NOTICE 'Módulos: % (% publicados)', modules_count, published_modules;
    RAISE NOTICE 'Ejercicios: %', exercises_count;
    RAISE NOTICE 'Achievements: %', achievements_count;
    RAISE NOTICE 'Rangos Maya: %', ranks_count;
    RAISE NOTICE '';

    IF modules_count >= 5 AND exercises_count >= 50 AND achievements_count >= 15 AND ranks_count >= 5 THEN
        RAISE NOTICE '✓ PASS: Contenido educativo completo';
    ELSE
        RAISE WARNING '✗ FAIL: Contenido educativo incompleto';
    END IF;
END $$;

-- =====================================================
-- Sección 4: Features Sociales
-- =====================================================

\echo ''
\echo '========================================'
\echo '4. FEATURES SOCIALES'
\echo '========================================'

DO $$
DECLARE
    friendships_count INTEGER;
    pending_requests INTEGER;
    schools_count INTEGER;
    classrooms_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO friendships_count FROM social_features.friendships WHERE status = 'accepted';
    SELECT COUNT(*) INTO pending_requests FROM social_features.friendships WHERE status = 'pending';
    SELECT COUNT(*) INTO schools_count FROM social_features.schools;
    SELECT COUNT(*) INTO classrooms_count FROM social_features.classrooms;

    RAISE NOTICE 'Friendships aceptados: %', friendships_count;
    RAISE NOTICE 'Friend requests pendientes: %', pending_requests;
    RAISE NOTICE 'Escuelas: %', schools_count;
    RAISE NOTICE 'Aulas: %', classrooms_count;
    RAISE NOTICE '';

    IF friendships_count >= 8 AND schools_count >= 2 THEN
        RAISE NOTICE '✓ PASS: Features sociales disponibles';
    ELSE
        RAISE WARNING '✗ FAIL: Features sociales incompletas';
    END IF;
END $$;

-- =====================================================
-- Sección 5: Resumen Final
-- =====================================================

\echo ''
\echo '========================================'
\echo 'RESUMEN FINAL'
\echo '========================================'

DO $$
DECLARE
    total_users INTEGER;
    total_profiles INTEGER;
    total_stats INTEGER;
    avg_level NUMERIC;
    total_coins INTEGER;
    total_achievements INTEGER;
    total_modules INTEGER;
    total_friendships INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_users FROM auth.users;
    SELECT COUNT(*) INTO total_profiles FROM auth_management.profiles;
    SELECT COUNT(*) INTO total_stats FROM gamification_system.user_stats;
    SELECT COUNT(*) INTO total_achievements FROM gamification_system.achievements;
    SELECT COUNT(*) INTO total_modules FROM educational_content.modules;
    SELECT COUNT(*) INTO total_friendships FROM social_features.friendships WHERE status = 'accepted';

    SELECT AVG(level)::NUMERIC(5,2) INTO avg_level FROM gamification_system.user_stats;
    SELECT SUM(ml_coins) INTO total_coins FROM gamification_system.user_stats;

    RAISE NOTICE 'Base de Datos: gamilit_platform';
    RAISE NOTICE 'Fecha validación: %', now();
    RAISE NOTICE '';
    RAISE NOTICE 'Usuarios totales: %', total_users;
    RAISE NOTICE 'Perfiles completos: %', total_profiles;
    RAISE NOTICE 'User stats: %', total_stats;
    RAISE NOTICE '';
    RAISE NOTICE 'Nivel promedio usuarios: %', avg_level;
    RAISE NOTICE 'ML Coins en circulación: %', total_coins;
    RAISE NOTICE 'Achievements disponibles: %', total_achievements;
    RAISE NOTICE 'Módulos educativos: %', total_modules;
    RAISE NOTICE 'Amistades activas: %', total_friendships;
    RAISE NOTICE '';

    IF total_users = total_profiles AND total_profiles = total_stats THEN
        RAISE NOTICE '════════════════════════════════════════';
        RAISE NOTICE '✓✓✓ VALIDACIÓN COMPLETA: SUCCESS ✓✓✓';
        RAISE NOTICE '════════════════════════════════════════';
        RAISE NOTICE 'Seeds están correctos y listos para desarrollo frontend';
    ELSE
        RAISE WARNING '════════════════════════════════════════';
        RAISE WARNING '✗✗✗ VALIDACIÓN: PROBLEMAS DETECTADOS ✗✗✗';
        RAISE WARNING '════════════════════════════════════════';
        RAISE WARNING 'Revisar secciones anteriores para detalles';
    END IF;

    RAISE NOTICE '';
END $$;

\echo ''
\echo 'Validación completada.'
\echo ''
