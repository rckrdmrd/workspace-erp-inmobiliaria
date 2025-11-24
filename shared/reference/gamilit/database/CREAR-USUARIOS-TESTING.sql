-- =====================================================
-- SCRIPT DE EMERGENCIA: CREAR USUARIOS DE TESTING
-- =====================================================
-- Fecha: 2025-11-11
-- Propósito: Crear usuarios de testing manualmente
-- Usuarios: admin@gamilit.com, teacher@gamilit.com, student@gamilit.com
-- Password: Test1234 (para todos)
-- =====================================================

-- Habilitar extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verificar tenant por defecto
DO $$
DECLARE
    default_tenant_id uuid;
BEGIN
    -- Buscar o crear tenant por defecto
    SELECT id INTO default_tenant_id
    FROM auth_management.tenants
    WHERE name = 'GAMILIT Platform'
    LIMIT 1;

    IF default_tenant_id IS NULL THEN
        INSERT INTO auth_management.tenants (
            id, name, slug, status, settings, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000001'::uuid,
            'GAMILIT Platform',
            'gamilit-platform',
            'active',
            '{}'::jsonb,
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO NOTHING;

        default_tenant_id := '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    RAISE NOTICE 'Tenant ID: %', default_tenant_id;
END $$;

-- =====================================================
-- PASO 1: CREAR USUARIOS EN auth.users
-- =====================================================

INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    gamilit_role,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
-- ADMIN
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'admin@gamilit.com',
    crypt('Test1234', gen_salt('bf', 10)),
    NOW(),
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'name', 'Admin GAMILIT',
        'role', 'super_admin'
    ),
    'super_admin'::auth_management.gamilit_role,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- TEACHER
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'teacher@gamilit.com',
    crypt('Test1234', gen_salt('bf', 10)),
    NOW(),
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'name', 'Profesor Testing',
        'role', 'teacher'
    ),
    'teacher'::auth_management.gamilit_role,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- STUDENT
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'student@gamilit.com',
    crypt('Test1234', gen_salt('bf', 10)),
    NOW(),
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'name', 'Estudiante Testing',
        'role', 'student'
    ),
    'student'::auth_management.gamilit_role,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    updated_at = NOW();

-- =====================================================
-- PASO 2: CREAR PROFILES EN auth_management.profiles
-- =====================================================

INSERT INTO auth_management.profiles (
    id,
    user_id,
    tenant_id,
    email,
    full_name,
    first_name,
    last_name,
    role,
    status,
    email_verified,
    preferences,
    created_at,
    updated_at
) VALUES
-- ADMIN PROFILE
(
    'aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin@gamilit.com',
    'Admin GAMILIT',
    'Admin',
    'GAMILIT',
    'super_admin'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    NOW(),
    NOW()
),
-- TEACHER PROFILE
(
    'bbbbbbbb-bbbb-bbbb-cccc-bbbbbbbbbbbb'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'teacher@gamilit.com',
    'Profesor Testing',
    'Profesor',
    'Testing',
    'teacher'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    NOW(),
    NOW()
),
-- STUDENT PROFILE
(
    'cccccccc-cccc-cccc-dddd-cccccccccccc'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'student@gamilit.com',
    'Estudiante Testing',
    'Estudiante',
    'Testing',
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'grade_level', '5'
    ),
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- =====================================================
-- PASO 3: INICIALIZAR user_stats (gamification)
-- =====================================================
-- Nota: El trigger trg_initialize_user_stats debería hacer esto automáticamente
-- pero lo agregamos manualmente por si acaso

INSERT INTO gamification_system.user_stats (
    id,
    user_id,
    tenant_id,
    level,
    total_xp,
    xp_to_next_level,
    current_rank,
    ml_coins,
    ml_coins_earned_total,
    created_at,
    updated_at
) VALUES
(
    'aaaaaaaa-aaaa-stat-aaaa-aaaaaaaaaaaa'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    1,
    0,
    100,
    'Ajaw'::gamification_system.maya_rank,
    100,
    100,
    NOW(),
    NOW()
),
(
    'bbbbbbbb-bbbb-stat-bbbb-bbbbbbbbbbbb'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    1,
    0,
    100,
    'Ajaw'::gamification_system.maya_rank,
    100,
    100,
    NOW(),
    NOW()
),
(
    'cccccccc-cccc-stat-cccc-cccccccccccc'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    1,
    0,
    100,
    'Ajaw'::gamification_system.maya_rank,
    100,
    100,
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

-- =====================================================
-- PASO 4: INICIALIZAR user_ranks (gamification)
-- =====================================================

INSERT INTO gamification_system.user_ranks (
    id,
    user_id,
    tenant_id,
    current_rank,
    rank_level,
    total_rank_points,
    rank_achieved_at,
    created_at,
    updated_at
) VALUES
(
    'aaaaaaaa-aaaa-rank-aaaa-aaaaaaaaaaaa'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    1,
    0,
    NOW(),
    NOW(),
    NOW()
),
(
    'bbbbbbbb-bbbb-rank-bbbb-bbbbbbbbbbbb'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    1,
    0,
    NOW(),
    NOW(),
    NOW()
),
(
    'cccccccc-cccc-rank-cccc-cccccccccccc'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    1,
    0,
    NOW(),
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

DO $$
DECLARE
    users_count INTEGER;
    profiles_count INTEGER;
    stats_count INTEGER;
    ranks_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_count FROM auth.users
    WHERE email IN ('admin@gamilit.com', 'teacher@gamilit.com', 'student@gamilit.com');

    SELECT COUNT(*) INTO profiles_count FROM auth_management.profiles
    WHERE email IN ('admin@gamilit.com', 'teacher@gamilit.com', 'student@gamilit.com');

    SELECT COUNT(*) INTO stats_count FROM gamification_system.user_stats
    WHERE user_id IN (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
        'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid
    );

    SELECT COUNT(*) INTO ranks_count FROM gamification_system.user_ranks
    WHERE user_id IN (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
        'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid
    );

    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUARIOS DE TESTING CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'auth.users: % usuarios', users_count;
    RAISE NOTICE 'auth_management.profiles: % profiles', profiles_count;
    RAISE NOTICE 'gamification_system.user_stats: % stats', stats_count;
    RAISE NOTICE 'gamification_system.user_ranks: % ranks', ranks_count;
    RAISE NOTICE '========================================';

    IF users_count = 3 AND profiles_count = 3 AND stats_count = 3 AND ranks_count = 3 THEN
        RAISE NOTICE '✅ TODOS LOS USUARIOS CREADOS EXITOSAMENTE';
        RAISE NOTICE '';
        RAISE NOTICE 'Credenciales de testing:';
        RAISE NOTICE '  - admin@gamilit.com / Test1234';
        RAISE NOTICE '  - teacher@gamilit.com / Test1234';
        RAISE NOTICE '  - student@gamilit.com / Test1234';
    ELSE
        RAISE WARNING '⚠️ ALGUNOS USUARIOS NO SE CREARON CORRECTAMENTE';
        RAISE WARNING 'Esperado: 3 users, 3 profiles, 3 stats, 3 ranks';
        RAISE WARNING 'Creado: % users, % profiles, % stats, % ranks',
            users_count, profiles_count, stats_count, ranks_count;
    END IF;
END $$;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
