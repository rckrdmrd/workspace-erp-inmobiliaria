-- =====================================================
-- Seed: gamification_system.missions (PROD)
-- Description: Inicialización de misiones para usuarios de testing
-- Environment: PRODUCTION
-- Dependencies: auth.users, auth_management.profiles
-- Order: 10
-- Created: 2025-11-11
-- Updated: 2025-11-12
-- Version: 2.1 (extendido para incluir admin y teacher)
-- =====================================================
--
-- CAMBIOS v2.1:
-- - Extendido para incluir admin@gamilit.com y teacher@gamilit.com
-- - Cada usuario recibe las mismas 8 misiones
--
-- CAMBIOS v2.0:
-- - Reemplaza llamada a función inexistente con INSERTs directos
-- - Usa auth_management.profiles.id (no auth.users.id)
-- - Crea 3 misiones diarias + 5 misiones semanales
--
-- MISIONES INCLUIDAS:
-- - 3 misiones diarias: Completar ejercicios, Ganar XP, Usar comodín
-- - 5 misiones semanales: Completar módulo, Racha diaria, Perfección, Explorador, Maestro
--
-- TOTAL: 24 misiones (8 misiones × 3 usuarios)
-- =====================================================

SET search_path TO gamification_system, auth_management, public;

-- =====================================================
-- Insert missions for testing users
-- =====================================================

DO $$
DECLARE
    v_student_profile_id UUID;
    v_admin_profile_id UUID;
    v_teacher_profile_id UUID;
    v_today_start TIMESTAMP;
    v_today_end TIMESTAMP;
    v_week_end TIMESTAMP;
    v_user_id UUID;
    v_user_email TEXT;
BEGIN
    -- Get profile IDs for all demo users
    SELECT id INTO v_student_profile_id
    FROM auth_management.profiles
    WHERE email = 'student@gamilit.com'
    LIMIT 1;

    SELECT id INTO v_admin_profile_id
    FROM auth_management.profiles
    WHERE email = 'admin@gamilit.com'
    LIMIT 1;

    SELECT id INTO v_teacher_profile_id
    FROM auth_management.profiles
    WHERE email = 'teacher@gamilit.com'
    LIMIT 1;

    -- Validate at least one user exists
    IF v_student_profile_id IS NULL AND v_admin_profile_id IS NULL AND v_teacher_profile_id IS NULL THEN
        RAISE WARNING 'Ningún perfil demo encontrado. Ejecutar primero seeds de auth.';
        RETURN;
    END IF;

    -- Calculate mission date ranges
    v_today_start := gamilit.now_mexico()::date;
    v_today_end := v_today_start + INTERVAL '23 hours 59 minutes';
    v_week_end := v_today_start + INTERVAL '7 days';

    -- Process each user
    FOR v_user_id, v_user_email IN
        SELECT id, email FROM (
            VALUES
                (v_student_profile_id, 'student@gamilit.com'),
                (v_admin_profile_id, 'admin@gamilit.com'),
                (v_teacher_profile_id, 'teacher@gamilit.com')
        ) AS users(id, email)
        WHERE id IS NOT NULL
    LOOP

    -- =====================================================
    -- DAILY MISSIONS (3)
    -- =====================================================

    -- Daily Mission 1: Complete exercises
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'daily_complete_exercises',
        'Completar 3 ejercicios',
        'Completa 3 ejercicios hoy para ganar recompensas',
        'daily',
        jsonb_build_object(
            'type', 'complete_exercises',
            'target', 3,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 50,
            'ml_coins', 25
        ),
        'active',
        0,
        v_today_start,
        v_today_end
    )
    ON CONFLICT DO NOTHING;

    -- Daily Mission 2: Earn XP
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'daily_earn_xp',
        'Ganar 100 XP',
        'Acumula 100 puntos de experiencia hoy',
        'daily',
        jsonb_build_object(
            'type', 'earn_xp',
            'target', 100,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 30,
            'ml_coins', 15
        ),
        'active',
        0,
        v_today_start,
        v_today_end
    )
    ON CONFLICT DO NOTHING;

    -- Daily Mission 3: Use comodín
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'daily_use_comodin',
        'Usar un comodín',
        'Usa al menos un comodín en un ejercicio',
        'daily',
        jsonb_build_object(
            'type', 'use_comodines',
            'target', 1,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 20,
            'ml_coins', 10
        ),
        'active',
        0,
        v_today_start,
        v_today_end
    )
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- WEEKLY MISSIONS (5)
    -- =====================================================

    -- Weekly Mission 1: Complete a module
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'weekly_complete_module',
        'Completar un módulo',
        'Completa un módulo completo esta semana',
        'weekly',
        jsonb_build_object(
            'type', 'complete_modules',
            'target', 1,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 200,
            'ml_coins', 100
        ),
        'active',
        0,
        v_today_start,
        v_week_end
    )
    ON CONFLICT DO NOTHING;

    -- Weekly Mission 2: Daily streak
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'weekly_daily_streak',
        'Racha de 5 días',
        'Completa al menos un ejercicio durante 5 días seguidos',
        'weekly',
        jsonb_build_object(
            'type', 'daily_streak',
            'target', 5,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 150,
            'ml_coins', 75
        ),
        'active',
        0,
        v_today_start,
        v_week_end
    )
    ON CONFLICT DO NOTHING;

    -- Weekly Mission 3: Perfect scores
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'weekly_perfect_scores',
        'Perfección absoluta',
        'Obtén 3 puntajes perfectos (100%) en ejercicios',
        'weekly',
        jsonb_build_object(
            'type', 'perfect_scores',
            'target', 3,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 180,
            'ml_coins', 90
        ),
        'active',
        0,
        v_today_start,
        v_week_end
    )
    ON CONFLICT DO NOTHING;

    -- Weekly Mission 4: Explorer
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'weekly_explorer',
        'Explorador curioso',
        'Completa ejercicios de 3 módulos diferentes',
        'weekly',
        jsonb_build_object(
            'type', 'explore_modules',
            'target', 3,
            'current', 0,
            'modules_visited', '[]'::jsonb
        ),
        jsonb_build_object(
            'xp', 120,
            'ml_coins', 60
        ),
        'active',
        0,
        v_today_start,
        v_week_end
    )
    ON CONFLICT DO NOTHING;

    -- Weekly Mission 5: Master learner
    INSERT INTO gamification_system.missions (
        user_id,
        template_id,
        title,
        description,
        mission_type,
        objectives,
        rewards,
        status,
        progress,
        start_date,
        end_date
    ) VALUES (
        v_user_id,
        'weekly_master_learner',
        'Maestro del aprendizaje',
        'Completa 15 ejercicios esta semana',
        'weekly',
        jsonb_build_object(
            'type', 'complete_exercises',
            'target', 15,
            'current', 0
        ),
        jsonb_build_object(
            'xp', 250,
            'ml_coins', 125
        ),
        'active',
        0,
        v_today_start,
        v_week_end
    )
    ON CONFLICT DO NOTHING;

        RAISE NOTICE '✅ Misiones inicializadas para %', v_user_email;
        RAISE NOTICE '   - 3 misiones diarias creadas';
        RAISE NOTICE '   - 5 misiones semanales creadas';

    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE '✅ Proceso de inicialización completado para todos los usuarios';

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error inicializando misiones: %', SQLERRM;
        RAISE WARNING 'DETAIL: %', SQLSTATE;
END $$;

-- =====================================================
-- Verification
-- =====================================================

DO $$
DECLARE
    daily_count INTEGER;
    weekly_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO daily_count
    FROM gamification_system.missions
    WHERE mission_type = 'daily';

    SELECT COUNT(*) INTO weekly_count
    FROM gamification_system.missions
    WHERE mission_type = 'weekly';

    SELECT COUNT(*) INTO total_count
    FROM gamification_system.missions;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MISIONES CREADAS:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Daily missions:  %', daily_count;
    RAISE NOTICE 'Weekly missions: %', weekly_count;
    RAISE NOTICE 'Total missions:  %', total_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE '';

    IF total_count = 0 THEN
        RAISE WARNING '⚠️  No se crearon misiones. Verificar que:';
        RAISE WARNING '   1. Los perfiles demo existen en auth_management.profiles';
        RAISE WARNING '   2. La tabla gamification_system.missions existe';
    ELSIF total_count < 8 THEN
        RAISE WARNING '⚠️  Se esperaban al menos 8 misiones, se crearon %', total_count;
    ELSIF total_count = 24 THEN
        RAISE NOTICE '✅ Todas las misiones se crearon correctamente (3 usuarios × 8 misiones)';
    ELSE
        RAISE NOTICE '✅ Misiones creadas: % (esperadas: 24 para 3 usuarios)', total_count;
    END IF;
END $$;
