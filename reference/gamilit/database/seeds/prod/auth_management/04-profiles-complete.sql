-- =====================================================
-- Seed: auth_management.profiles (PROD) - COMPLETO
-- Description: Perfiles para todos los usuarios de testing y demo
-- Environment: PRODUCTION
-- Dependencies: auth.users, auth_management.tenants
-- Order: 04
-- Created: 2025-11-11
-- Version: 2.0
-- =====================================================
--
-- PERFILES INCLUIDOS:
-- - 3 perfiles de testing (admin, teacher, student @gamilit.com)
-- - 16 perfiles de estudiantes demo
-- - 3 perfiles de profesores demo
-- - 3 perfiles de administradores demo
-- ⚠️ NO incluye perfiles de padres (Portal Padres = Extension EXT-010, fuera de alcance)
--
-- TOTAL: 22 perfiles (teacher, student, admin SOLO - alcance v2.3.x)
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Perfiles Completos
-- =====================================================

INSERT INTO auth_management.profiles (
    id,
    tenant_id,
    user_id,
    email,
    display_name,
    full_name,
    first_name,
    last_name,
    avatar_url,
    bio,
    phone,
    date_of_birth,
    grade_level,
    student_id,
    school_id,
    role,
    status,
    email_verified,
    phone_verified,
    preferences,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- PERFILES DE TESTING (3)
-- =====================================================
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,  -- Tenant principal
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,  -- user_id admin
    'admin@gamilit.com',
    'Admin GAMILIT',
    'Administrador GAMILIT',
    'Administrador',
    'GAMILIT',
    '/avatars/admin-testing.png',
    'Usuario administrador para testing y desarrollo.',
    '55-0000-0001',
    '1985-01-01'::date,
    NULL,  -- grade_level (no aplica para admin)
    NULL,  -- student_id
    NULL,  -- school_id
    'super_admin'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object(
        'theme', 'professional',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    jsonb_build_object(
        'testing_user', true,
        'description', 'Usuario de testing principal'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,  -- user_id teacher
    'teacher@gamilit.com',
    'Profesor Testing',
    'Profesor de Testing GAMILIT',
    'Profesor',
    'Testing',
    '/avatars/teacher-testing.png',
    'Usuario profesor para testing y desarrollo.',
    '55-0000-0002',
    '1980-05-15'::date,
    NULL,
    NULL,
    NULL,
    'admin_teacher'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object(
        'theme', 'teacher',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    jsonb_build_object(
        'testing_user', true,
        'subjects', ARRAY['Lengua Española', 'Comprensión Lectora']
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,  -- user_id student
    'student@gamilit.com',
    'Estudiante Testing',
    'Estudiante de Testing GAMILIT',
    'Estudiante',
    'Testing',
    '/avatars/student-testing.png',
    'Usuario estudiante para testing y desarrollo.',
    '55-0000-0003',
    '2013-09-01'::date,
    '5',  -- grade_level
    'EST-TEST-001',
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'gamification', jsonb_build_object(
            'show_leaderboard', true,
            'show_achievements', true,
            'show_rank', true
        )
    ),
    jsonb_build_object(
        'testing_user', true,
        'interests', ARRAY['lectura', 'ciencia'],
        'learning_style', 'visual'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (user_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio,
    preferences = EXCLUDED.preferences,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    profile_count INTEGER;
    testing_profiles INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM auth_management.profiles;

    SELECT COUNT(*) INTO testing_profiles
    FROM auth_management.profiles
    WHERE email IN ('admin@gamilit.com', 'teacher@gamilit.com', 'student@gamilit.com');

    RAISE NOTICE '========================================';
    RAISE NOTICE 'PERFILES DE TESTING CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total perfiles: %', profile_count;
    RAISE NOTICE 'Perfiles de testing: %', testing_profiles;
    RAISE NOTICE '========================================';

    IF testing_profiles = 3 THEN
        RAISE NOTICE '✓ Perfiles de testing creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 3 perfiles de testing, se crearon %', testing_profiles;
    END IF;
END $$;

-- =====================================================
-- Testing Info
-- =====================================================
-- Los perfiles de testing están listos para usar con:
-- - admin@gamilit.com / Test1234
-- - teacher@gamilit.com / Test1234
-- - student@gamilit.com / Test1234
-- =====================================================
