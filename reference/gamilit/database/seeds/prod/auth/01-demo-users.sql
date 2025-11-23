-- =====================================================
-- Seed: auth.users - Test Users (PRODUCTION CLEAN)
-- Description: Solo usuarios de testing con dominio @gamilit.com
-- Environment: PRODUCTION
-- Dependencies: None (auth schema managed by Supabase)
-- Order: 01
-- Created: 2025-11-17
-- Version: 2.0 (CLEAN - Solo 3 usuarios @gamilit.com)
-- =====================================================
--
-- USUARIOS DE TESTING (3):
-- - admin@gamilit.com / Test1234 (super_admin)
-- - teacher@gamilit.com / Test1234 (admin_teacher)
-- - student@gamilit.com / Test1234 (student)
--
-- TOTAL: 3 usuarios
--
-- POLÍTICA DE CARGA LIMPIA:
-- ✅ Solo usuarios @gamilit.com
-- ✅ Sin usuarios @demo.glit.edu.mx
-- ✅ UUIDs predecibles para testing
-- ✅ Passwords idénticos para facilitar testing
--
-- IMPORTANTE: Estos usuarios son para testing.
-- En producción real, usar proceso de registro normal.
-- =====================================================

SET search_path TO auth, public;

-- =====================================================
-- PASSWORDS ENCRYPTED WITH BCRYPT
-- =====================================================
-- Password: "Test1234" (todos los usuarios)
-- Se genera dinámicamente con: crypt('Test1234', gen_salt('bf', 10))
-- =====================================================

-- =====================================================
-- INSERT: Test Users (3 usuarios @gamilit.com)
-- =====================================================

INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    status,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    gamilit_role
) VALUES
-- =====================================================
-- USUARIO 1: ADMIN
-- =====================================================
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'admin@gamilit.com',
    crypt('Test1234', gen_salt('bf', 10)),
    gamilit.now_mexico(),
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'name', 'Admin GAMILIT',
        'role', 'super_admin',
        'description', 'Usuario administrador de testing'
    ),
    'active',
    gamilit.now_mexico(),
    gamilit.now_mexico(),
    '',
    '',
    '',
    '',
    'super_admin'::auth_management.gamilit_role
),

-- =====================================================
-- USUARIO 2: TEACHER
-- =====================================================
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'teacher@gamilit.com',
    crypt('Test1234', gen_salt('bf', 10)),
    gamilit.now_mexico(),
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'name', 'Profesor Testing',
        'role', 'admin_teacher',
        'description', 'Usuario profesor de testing'
    ),
    'active',
    gamilit.now_mexico(),
    gamilit.now_mexico(),
    '',
    '',
    '',
    '',
    'admin_teacher'::auth_management.gamilit_role
),

-- =====================================================
-- USUARIO 3: STUDENT
-- =====================================================
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'student@gamilit.com',
    crypt('Test1234', gen_salt('bf', 10)),
    gamilit.now_mexico(),
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'name', 'Estudiante Testing',
        'role', 'student',
        'description', 'Usuario estudiante de testing'
    ),
    'active',
    gamilit.now_mexico(),
    gamilit.now_mexico(),
    '',
    '',
    '',
    '',
    'student'::auth_management.gamilit_role
)

ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    user_count INTEGER;
    admin_count INTEGER;
    teacher_count INTEGER;
    student_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count
    FROM auth.users
    WHERE email LIKE '%@gamilit.com';

    SELECT COUNT(*) INTO admin_count
    FROM auth.users
    WHERE email = 'admin@gamilit.com';

    SELECT COUNT(*) INTO teacher_count
    FROM auth.users
    WHERE email = 'teacher@gamilit.com';

    SELECT COUNT(*) INTO student_count
    FROM auth.users
    WHERE email = 'student@gamilit.com';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUARIOS DE TESTING CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total usuarios @gamilit.com: %', user_count;
    RAISE NOTICE '  - Admin:   % (admin@gamilit.com)', admin_count;
    RAISE NOTICE '  - Teacher: % (teacher@gamilit.com)', teacher_count;
    RAISE NOTICE '  - Student: % (student@gamilit.com)', student_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Credenciales de Testing:';
    RAISE NOTICE '  admin@gamilit.com    | Test1234 | super_admin';
    RAISE NOTICE '  teacher@gamilit.com  | Test1234 | admin_teacher';
    RAISE NOTICE '  student@gamilit.com  | Test1234 | student';
    RAISE NOTICE '========================================';

    IF user_count = 3 THEN
        RAISE NOTICE '✓ Los 3 usuarios de testing fueron creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 3 usuarios, se crearon %', user_count;
    END IF;
END $$;

-- =====================================================
-- Testing Info
-- =====================================================
-- Para probar login:
--
-- curl -X POST http://localhost:3006/api/auth/login \
--   -H "Content-Type: application/json" \
--   -d '{"email":"admin@gamilit.com","password":"Test1234"}'
--
-- =====================================================

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v2.0 (2025-11-17): LIMPIEZA COMPLETA
--   - Eliminados 20 usuarios @demo.glit.edu.mx
--   - Mantenidos solo 3 usuarios @gamilit.com
--   - Política de carga limpia aplicada
--   - UUIDs predecibles (aaaa..., bbbb..., cccc...)
--
-- v1.0 (2025-01-11): Versión original
--   - 23 usuarios (3 @gamilit.com + 20 @demo.glit.edu.mx)
-- =====================================================
