-- =====================================================
-- Seed: gamification_system.user_stats (PROD) - v2.0
-- Description: Estadísticas de gamificación para usuarios demo
-- Environment: PRODUCTION
-- Dependencies: auth_management.profiles, gamification_system.maya_ranks
-- Order: 05
-- Created: 2025-01-11
-- Updated: 2025-11-15
-- Version: 2.0 (Refactored - Trigger-based creation)
-- =====================================================
--
-- CAMBIOS v2.0:
-- ============
-- ❌ ELIMINADO: INSERTs directos a user_stats (causaban duplicados y huérfanos)
-- ✅ NUEVO: El trigger initialize_user_stats() crea automáticamente los registros
-- ✅ NUEVO: UPDATEs para agregar progreso variado a los usuarios demo
--
-- FUNCIONAMIENTO:
-- ===============
-- 1. El trigger initialize_user_stats() (en profiles) crea automáticamente:
--    - user_stats con 100 ML Coins iniciales
--    - user_ranks con rango 'Ajaw'
--    - comodines_inventory
--
-- 2. Este seed actualiza los user_stats con progreso variado para demos realistas
--
-- USUARIOS CON PROGRESO VARIADO:
-- ==============================
-- - 5 estudiantes con diferentes niveles (1-4)
-- - 2 profesores con actividad alta
-- - 2 administradores con stats máximos
-- - 1 padre con actividad mínima
--
-- TOTAL: 10 usuarios demo con progreso variado
-- =====================================================

SET search_path TO gamification_system, auth_management, public;

-- =====================================================
-- FASE 1: Verificar que el trigger creó los registros base
-- =====================================================

DO $$
DECLARE
    stats_count INTEGER;
    expected_count INTEGER;
BEGIN
    -- Contar user_stats existentes
    SELECT COUNT(*) INTO stats_count
    FROM gamification_system.user_stats;

    -- Contar perfiles (debería haber 23: 3 testing + 20 demo)
    SELECT COUNT(*) INTO expected_count
    FROM auth_management.profiles;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICACIÓN TRIGGER initialize_user_stats()';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Perfiles existentes: %', expected_count;
    RAISE NOTICE 'User stats existentes: %', stats_count;
    RAISE NOTICE '========================================';

    IF stats_count = expected_count THEN
        RAISE NOTICE '✓ El trigger funcionó correctamente';
        RAISE NOTICE '✓ Todos los perfiles tienen user_stats';
    ELSIF stats_count < expected_count THEN
        RAISE WARNING '⚠ Faltan % user_stats', expected_count - stats_count;
        RAISE WARNING '⚠ Algunos perfiles no tienen user_stats (trigger pudo haber fallado)';
    ELSE
        RAISE WARNING '⚠ Hay % user_stats extras (posibles huérfanos)', stats_count - expected_count;
    END IF;

    RAISE NOTICE '';
END $$;

-- =====================================================
-- FASE 2: Actualizar user_stats con progreso variado
-- =====================================================
-- Esto da vida a los usuarios demo con diferentes niveles de actividad

-- Estudiante 1: Ana García - Nivel 2, Progreso Medio
UPDATE gamification_system.user_stats
SET
    level = 2,
    total_xp = 1250,
    xp_to_next_level = 250,
    current_rank = 'Ajaw'::gamification_system.maya_rank,
    rank_progress = 45.50,
    ml_coins = 275,
    ml_coins_earned_total = 450,
    ml_coins_spent_total = 175,
    ml_coins_earned_today = 25,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '3 hours',
    current_streak = 3,
    max_streak = 5,
    streak_started_at = gamilit.now_mexico() - INTERVAL '3 days',
    days_active_total = 12,
    exercises_completed = 15,
    modules_completed = 0,
    total_score = 1200,
    average_score = 80.00,
    perfect_scores = 2,
    achievements_earned = 3,
    certificates_earned = 0,
    total_time_spent = '03:25:00'::interval,
    weekly_time_spent = '01:15:00'::interval,
    sessions_count = 12,
    weekly_xp = 450,
    monthly_xp = 1250,
    weekly_exercises = 8,
    class_rank_position = 1,
    last_activity_at = gamilit.now_mexico() - INTERVAL '2 hours',
    last_login_at = gamilit.now_mexico() - INTERVAL '2 hours',
    metadata = jsonb_build_object(
        'demo_user', true,
        'preferred_theme', 'ocean',
        'favorite_module', 'modulo-01-comprension-literal',
        'learning_pace', 'steady'
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid;

-- Estudiante 2: Carlos Ramírez - Nivel 1, Principiante
UPDATE gamification_system.user_stats
SET
    level = 1,
    total_xp = 250,
    xp_to_next_level = 750,
    current_rank = 'Ajaw'::gamification_system.maya_rank,
    rank_progress = 12.50,
    ml_coins = 150,
    ml_coins_earned_total = 200,
    ml_coins_spent_total = 50,
    ml_coins_earned_today = 10,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '5 hours',
    current_streak = 1,
    max_streak = 2,
    streak_started_at = gamilit.now_mexico() - INTERVAL '1 day',
    days_active_total = 5,
    exercises_completed = 5,
    modules_completed = 0,
    total_score = 350,
    average_score = 70.00,
    perfect_scores = 0,
    achievements_earned = 1,
    certificates_earned = 0,
    total_time_spent = '01:10:00'::interval,
    weekly_time_spent = '00:45:00'::interval,
    sessions_count = 5,
    weekly_xp = 150,
    monthly_xp = 250,
    weekly_exercises = 3,
    class_rank_position = 2,
    last_activity_at = gamilit.now_mexico() - INTERVAL '4 hours',
    last_login_at = gamilit.now_mexico() - INTERVAL '4 hours',
    metadata = jsonb_build_object(
        'demo_user', true,
        'preferred_theme', 'space',
        'learning_pace', 'slow'
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '02bc5f00-182e-5387-c899-3f269d49c06f'::uuid;

-- Estudiante 3: María Fernanda - Nivel 3, Avanzada
UPDATE gamification_system.user_stats
SET
    level = 3,
    total_xp = 3200,
    xp_to_next_level = 800,
    current_rank = 'Nacom'::gamification_system.maya_rank,
    rank_progress = 60.00,
    ml_coins = 425,
    ml_coins_earned_total = 800,
    ml_coins_spent_total = 375,
    ml_coins_earned_today = 50,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '2 hours',
    current_streak = 7,
    max_streak = 7,
    streak_started_at = gamilit.now_mexico() - INTERVAL '7 days',
    days_active_total = 20,
    exercises_completed = 35,
    modules_completed = 1,
    total_score = 2800,
    average_score = 85.00,
    perfect_scores = 5,
    achievements_earned = 6,
    certificates_earned = 1,
    total_time_spent = '06:30:00'::interval,
    weekly_time_spent = '02:00:00'::interval,
    sessions_count = 20,
    weekly_xp = 900,
    monthly_xp = 3200,
    weekly_exercises = 15,
    class_rank_position = 1,
    last_activity_at = gamilit.now_mexico() - INTERVAL '1 hour',
    last_login_at = gamilit.now_mexico() - INTERVAL '1 hour',
    metadata = jsonb_build_object(
        'demo_user', true,
        'preferred_theme', 'forest',
        'favorite_module', 'modulo-02-comprension-inferencial',
        'learning_pace', 'fast',
        'achievement_hunter', true
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '03cd6000-282e-6487-d899-40369e49d070'::uuid;

-- Estudiante 4: Luis Miguel - Nivel 2, Progreso Constante
UPDATE gamification_system.user_stats
SET
    level = 2,
    total_xp = 1400,
    xp_to_next_level = 100,
    current_rank = 'Ajaw'::gamification_system.maya_rank,
    rank_progress = 52.00,
    ml_coins = 300,
    ml_coins_earned_total = 500,
    ml_coins_spent_total = 200,
    ml_coins_earned_today = 30,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '4 hours',
    current_streak = 4,
    max_streak = 6,
    streak_started_at = gamilit.now_mexico() - INTERVAL '4 days',
    days_active_total = 15,
    exercises_completed = 20,
    modules_completed = 0,
    total_score = 1500,
    average_score = 75.00,
    perfect_scores = 1,
    achievements_earned = 4,
    certificates_earned = 0,
    total_time_spent = '04:00:00'::interval,
    weekly_time_spent = '01:30:00'::interval,
    sessions_count = 15,
    weekly_xp = 550,
    monthly_xp = 1400,
    weekly_exercises = 10,
    class_rank_position = 2,
    last_activity_at = gamilit.now_mexico() - INTERVAL '3 hours',
    last_login_at = gamilit.now_mexico() - INTERVAL '3 hours',
    metadata = jsonb_build_object(
        'demo_user', true,
        'preferred_theme', 'detective',
        'learning_pace', 'steady'
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '04de7000-382e-7587-e899-51469f49e081'::uuid;

-- Estudiante 5: Sofía Martínez - Nivel 4, Muy Avanzada
UPDATE gamification_system.user_stats
SET
    level = 4,
    total_xp = 6500,
    xp_to_next_level = 500,
    current_rank = 'Nacom'::gamification_system.maya_rank,
    rank_progress = 82.50,
    ml_coins = 650,
    ml_coins_earned_total = 1200,
    ml_coins_spent_total = 550,
    ml_coins_earned_today = 75,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '1 hour',
    current_streak = 10,
    max_streak = 12,
    streak_started_at = gamilit.now_mexico() - INTERVAL '10 days',
    days_active_total = 30,
    exercises_completed = 55,
    modules_completed = 2,
    total_score = 4800,
    average_score = 90.00,
    perfect_scores = 10,
    achievements_earned = 8,
    certificates_earned = 2,
    total_time_spent = '10:15:00'::interval,
    weekly_time_spent = '03:00:00'::interval,
    sessions_count = 30,
    weekly_xp = 1500,
    monthly_xp = 6500,
    weekly_exercises = 25,
    class_rank_position = 1,
    last_activity_at = gamilit.now_mexico() - INTERVAL '30 minutes',
    last_login_at = gamilit.now_mexico() - INTERVAL '30 minutes',
    metadata = jsonb_build_object(
        'demo_user', true,
        'preferred_theme', 'galaxy',
        'favorite_module', 'modulo-03-comprension-critica',
        'learning_pace', 'very_fast',
        'achievement_hunter', true,
        'top_performer', true
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '05ef8000-482e-8687-f899-62569049f092'::uuid;

-- Profesor 1: Roberto Méndez - Nivel 5, Profesor Activo
UPDATE gamification_system.user_stats
SET
    level = 5,
    total_xp = 10000,
    xp_to_next_level = 2000,
    current_rank = 'Ah K''in'::gamification_system.maya_rank,
    rank_progress = 33.33,
    ml_coins = 1000,
    ml_coins_earned_total = 2000,
    ml_coins_spent_total = 1000,
    ml_coins_earned_today = 0,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '8 hours',
    current_streak = 15,
    max_streak = 20,
    streak_started_at = gamilit.now_mexico() - INTERVAL '15 days',
    days_active_total = 60,
    exercises_completed = 100,
    modules_completed = 5,
    total_score = 9000,
    average_score = 92.00,
    perfect_scores = 25,
    achievements_earned = 12,
    certificates_earned = 5,
    total_time_spent = '25:00:00'::interval,
    weekly_time_spent = '05:00:00'::interval,
    sessions_count = 60,
    weekly_xp = 2500,
    monthly_xp = 10000,
    weekly_exercises = 30,
    last_activity_at = gamilit.now_mexico() - INTERVAL '1 hour',
    last_login_at = gamilit.now_mexico() - INTERVAL '1 hour',
    metadata = jsonb_build_object(
        'demo_user', true,
        'role', 'teacher',
        'teacher_stats', jsonb_build_object(
            'students_count', 10,
            'classrooms_count', 2,
            'avg_student_score', 85.00
        )
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid;

-- Profesor 2: Laura González - Nivel 5, Profesora Activa
UPDATE gamification_system.user_stats
SET
    level = 5,
    total_xp = 9500,
    xp_to_next_level = 2500,
    current_rank = 'Ah K''in'::gamification_system.maya_rank,
    rank_progress = 25.00,
    ml_coins = 950,
    ml_coins_earned_total = 1900,
    ml_coins_spent_total = 950,
    ml_coins_earned_today = 0,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '10 hours',
    current_streak = 12,
    max_streak = 18,
    streak_started_at = gamilit.now_mexico() - INTERVAL '12 days',
    days_active_total = 55,
    exercises_completed = 90,
    modules_completed = 5,
    total_score = 8500,
    average_score = 90.00,
    perfect_scores = 20,
    achievements_earned = 11,
    certificates_earned = 5,
    total_time_spent = '22:30:00'::interval,
    weekly_time_spent = '04:30:00'::interval,
    sessions_count = 55,
    weekly_xp = 2300,
    monthly_xp = 9500,
    weekly_exercises = 28,
    last_activity_at = gamilit.now_mexico() - INTERVAL '2 hours',
    last_login_at = gamilit.now_mexico() - INTERVAL '2 hours',
    metadata = jsonb_build_object(
        'demo_user', true,
        'role', 'teacher',
        'teacher_stats', jsonb_build_object(
            'students_count', 8,
            'classrooms_count', 2,
            'avg_student_score', 82.50
        )
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '11bc5f00-192e-5397-c919-3f279d49c26f'::uuid;

-- Admin 1: Admin Sistema - Nivel 10, Super Admin
UPDATE gamification_system.user_stats
SET
    level = 10,
    total_xp = 50000,
    xp_to_next_level = 0,
    current_rank = 'K''uk''ulkan'::gamification_system.maya_rank,
    rank_progress = 100.00,
    ml_coins = 5000,
    ml_coins_earned_total = 10000,
    ml_coins_spent_total = 5000,
    ml_coins_earned_today = 0,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '12 hours',
    current_streak = 30,
    max_streak = 30,
    streak_started_at = gamilit.now_mexico() - INTERVAL '30 days',
    days_active_total = 100,
    exercises_completed = 250,
    modules_completed = 5,
    total_score = 24000,
    average_score = 96.00,
    perfect_scores = 50,
    achievements_earned = 20,
    certificates_earned = 5,
    total_time_spent = '50:00:00'::interval,
    weekly_time_spent = '08:00:00'::interval,
    sessions_count = 100,
    weekly_xp = 5000,
    monthly_xp = 50000,
    weekly_exercises = 50,
    last_activity_at = gamilit.now_mexico() - INTERVAL '30 minutes',
    last_login_at = gamilit.now_mexico() - INTERVAL '30 minutes',
    metadata = jsonb_build_object(
        'demo_user', true,
        'role', 'super_admin',
        'admin_access', 'full'
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '20ac4f00-002e-4207-b809-2e189c49b25e'::uuid;

-- Admin 2: Directora - Nivel 8, Director
UPDATE gamification_system.user_stats
SET
    level = 8,
    total_xp = 25000,
    xp_to_next_level = 3000,
    current_rank = 'Halach Uinic'::gamification_system.maya_rank,
    rank_progress = 75.00,
    ml_coins = 2500,
    ml_coins_earned_total = 5000,
    ml_coins_spent_total = 2500,
    ml_coins_earned_today = 0,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '14 hours',
    current_streak = 20,
    max_streak = 25,
    streak_started_at = gamilit.now_mexico() - INTERVAL '20 days',
    days_active_total = 80,
    exercises_completed = 150,
    modules_completed = 5,
    total_score = 14000,
    average_score = 94.00,
    perfect_scores = 35,
    achievements_earned = 15,
    certificates_earned = 5,
    total_time_spent = '35:00:00'::interval,
    weekly_time_spent = '06:00:00'::interval,
    sessions_count = 80,
    weekly_xp = 3500,
    monthly_xp = 25000,
    weekly_exercises = 40,
    last_activity_at = gamilit.now_mexico() - INTERVAL '1 hour',
    last_login_at = gamilit.now_mexico() - INTERVAL '1 hour',
    metadata = jsonb_build_object(
        'demo_user', true,
        'role', 'director',
        'school_id', '50000000-0000-0000-0000-000000000001'
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '21bc5f00-102e-5307-c829-3f289d49c36f'::uuid;

-- Padre 1: Jorge García - Nivel 1, Observador
UPDATE gamification_system.user_stats
SET
    level = 1,
    total_xp = 100,
    xp_to_next_level = 900,
    current_rank = 'Ajaw'::gamification_system.maya_rank,
    rank_progress = 5.00,
    ml_coins = 100,
    ml_coins_earned_total = 100,
    ml_coins_spent_total = 0,
    ml_coins_earned_today = 0,
    last_ml_coins_reset = gamilit.now_mexico() - INTERVAL '24 hours',
    current_streak = 0,
    max_streak = 1,
    streak_started_at = NULL,
    days_active_total = 3,
    exercises_completed = 0,
    modules_completed = 0,
    total_score = 0,
    average_score = NULL,
    perfect_scores = 0,
    achievements_earned = 1,
    certificates_earned = 0,
    total_time_spent = '00:30:00'::interval,
    weekly_time_spent = '00:10:00'::interval,
    sessions_count = 3,
    weekly_xp = 50,
    monthly_xp = 100,
    weekly_exercises = 0,
    last_activity_at = gamilit.now_mexico() - INTERVAL '1 day',
    last_login_at = gamilit.now_mexico() - INTERVAL '1 day',
    metadata = jsonb_build_object(
        'demo_user', true,
        'role', 'parent',
        'children_ids', jsonb_build_array('01ac4f00-082e-4287-b899-2e169c49b05e')
    ),
    updated_at = gamilit.now_mexico()
WHERE user_id = '30ac4f00-012e-4217-b819-2e199c49b35e'::uuid;

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    stats_count INTEGER;
    updated_count INTEGER;
    students_count INTEGER;
    teachers_count INTEGER;
    admins_count INTEGER;
    avg_level NUMERIC;
    total_ml_coins INTEGER;
BEGIN
    SELECT COUNT(*) INTO stats_count
    FROM gamification_system.user_stats;

    SELECT COUNT(*) INTO updated_count
    FROM gamification_system.user_stats
    WHERE metadata->>'demo_user' = 'true' AND level > 1;

    SELECT COUNT(*) INTO students_count
    FROM gamification_system.user_stats us
    JOIN auth_management.profiles p ON p.user_id = us.user_id
    WHERE us.metadata->>'demo_user' = 'true' AND p.role = 'student';

    SELECT COUNT(*) INTO teachers_count
    FROM gamification_system.user_stats us
    JOIN auth_management.profiles p ON p.user_id = us.user_id
    WHERE us.metadata->>'demo_user' = 'true' AND p.role = 'admin_teacher';

    SELECT COUNT(*) INTO admins_count
    FROM gamification_system.user_stats us
    JOIN auth_management.profiles p ON p.user_id = us.user_id
    WHERE us.metadata->>'demo_user' = 'true' AND p.role = 'super_admin';

    SELECT AVG(level)::NUMERIC(5,2) INTO avg_level
    FROM gamification_system.user_stats
    WHERE metadata->>'demo_user' = 'true';

    SELECT SUM(ml_coins) INTO total_ml_coins
    FROM gamification_system.user_stats
    WHERE metadata->>'demo_user' = 'true';

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'USER STATS ACTUALIZADOS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total user stats: %', stats_count;
    RAISE NOTICE 'User stats demo actualizados: %', updated_count;
    RAISE NOTICE '  - Estudiantes: %', students_count;
    RAISE NOTICE '  - Profesores: %', teachers_count;
    RAISE NOTICE '  - Administradores: %', admins_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Estadísticas Agregadas:';
    RAISE NOTICE '  - Nivel promedio: %', avg_level;
    RAISE NOTICE '  - ML Coins totales: %', total_ml_coins;
    RAISE NOTICE '========================================';

    IF updated_count >= 10 THEN
        RAISE NOTICE '✓ User stats demo fueron actualizados correctamente con progreso variado';
    ELSE
        RAISE WARNING '⚠ Se esperaban al menos 10 updates, se aplicaron %', updated_count;
    END IF;

    RAISE NOTICE '';
END $$;

-- =====================================================
-- Testing Info
-- =====================================================
-- Los user_stats ahora tienen progreso variado realista.
--
-- Para verificar:
-- SELECT display_name, level, total_xp, ml_coins, exercises_completed
-- FROM auth_management.profiles p
-- JOIN gamification_system.user_stats us ON us.user_id = p.user_id
-- WHERE us.metadata->>'demo_user' = 'true'
-- ORDER BY level DESC, total_xp DESC;
-- =====================================================
