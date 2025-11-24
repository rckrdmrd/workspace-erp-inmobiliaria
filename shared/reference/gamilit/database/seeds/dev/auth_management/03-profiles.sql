-- =====================================================
-- Seed: auth_management.profiles (DEV)
-- Description: Perfiles de usuarios de prueba para desarrollo
-- Environment: DEVELOPMENT
-- Dependencies: auth.users (01-demo-users.sql), auth_management.tenants (01-tenants.sql)
-- Order: 03
-- Updated: 2025-11-02
-- Agent: ATLAS-DATABASE
-- Note: Este seed SOLO crea profiles. Los usuarios deben existir previamente.
-- =====================================================

SET search_path TO auth_management, auth, public;

-- =====================================================
-- Crear profiles para usuarios existentes
-- =====================================================
-- Este seed lee los usuarios de auth.users y crea sus profiles
-- Si el usuario ya tiene profile, se actualiza
-- =====================================================

INSERT INTO auth_management.profiles (
    user_id,
    tenant_id,
    email,
    first_name,
    last_name,
    display_name,
    full_name,
    role
)
SELECT
    u.id as user_id,
    (SELECT id FROM auth_management.tenants
     WHERE name LIKE '%Test%' OR name LIKE '%Gamilit%'
     ORDER BY created_at ASC
     LIMIT 1) as tenant_id,
    u.email,
    -- Extraer first_name del email o raw_user_meta_data
    CASE
        WHEN u.email LIKE '%admin%' THEN 'Admin'
        WHEN u.email LIKE '%instructor%' OR u.email LIKE '%teacher%' THEN 'Instructor'
        WHEN u.email LIKE '%estudiante1%' OR u.email LIKE '%student1%' THEN 'Ana'
        WHEN u.email LIKE '%estudiante2%' OR u.email LIKE '%student2%' THEN 'María'
        WHEN u.email LIKE '%estudiante3%' OR u.email LIKE '%student3%' THEN 'Carlos'
        ELSE COALESCE(
            u.raw_user_meta_data->>'firstName',
            SPLIT_PART(u.email, '@', 1)
        )
    END as first_name,
    -- Extraer last_name
    CASE
        WHEN u.email LIKE '%admin%' THEN 'Sistema'
        WHEN u.email LIKE '%instructor%' OR u.email LIKE '%teacher%' THEN 'Demo'
        WHEN u.email LIKE '%estudiante1%' OR u.email LIKE '%student1%' THEN 'García'
        WHEN u.email LIKE '%estudiante2%' OR u.email LIKE '%student2%' THEN 'Curie'
        WHEN u.email LIKE '%estudiante3%' OR u.email LIKE '%student3%' THEN 'Einstein'
        ELSE COALESCE(
            u.raw_user_meta_data->>'lastName',
            'Demo'
        )
    END as last_name,
    -- Display name (identificador corto para UI)
    COALESCE(
        u.raw_user_meta_data->>'displayName',
        SPLIT_PART(u.email, '@', 1)
    ) as display_name,
    -- Full name (nombre completo)
    CASE
        WHEN u.email LIKE '%admin%' THEN 'Admin Sistema'
        WHEN u.email LIKE '%instructor%' OR u.email LIKE '%teacher%' THEN 'Instructor Demo'
        WHEN u.email LIKE '%estudiante1%' OR u.email LIKE '%student1%' THEN 'Ana García'
        WHEN u.email LIKE '%estudiante2%' OR u.email LIKE '%student2%' THEN 'María Curie'
        WHEN u.email LIKE '%estudiante3%' OR u.email LIKE '%student3%' THEN 'Carlos Einstein'
        ELSE COALESCE(
            u.raw_user_meta_data->>'fullName',
            CONCAT(
                COALESCE(u.raw_user_meta_data->>'firstName', SPLIT_PART(u.email, '@', 1)),
                ' ',
                COALESCE(u.raw_user_meta_data->>'lastName', 'Demo')
            )
        )
    END as full_name,
    -- Rol (copiado de auth.users)
    u.role
FROM auth.users u
WHERE u.deleted_at IS NULL
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    display_name = EXCLUDED.display_name,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- =====================================================
-- Validación y Mensaje de Confirmación
-- =====================================================

DO $$
DECLARE
    profile_count INTEGER;
    student_count INTEGER;
    teacher_count INTEGER;
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM auth_management.profiles;
    SELECT COUNT(*) INTO student_count FROM auth_management.profiles WHERE role = 'student';
    SELECT COUNT(*) INTO teacher_count FROM auth_management.profiles WHERE role IN ('admin_teacher', 'teacher');
    SELECT COUNT(*) INTO admin_count FROM auth_management.profiles WHERE role = 'super_admin';

    RAISE NOTICE '==============================================';
    RAISE NOTICE '✓ Profiles insertados correctamente';
    RAISE NOTICE '   Total: % perfiles', profile_count;
    RAISE NOTICE '   Estudiantes: %', student_count;
    RAISE NOTICE '   Profesores: %', teacher_count;
    RAISE NOTICE '   Admins: %', admin_count;
    RAISE NOTICE '==============================================';
END $$;
