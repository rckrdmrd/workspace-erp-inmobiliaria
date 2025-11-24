-- =====================================================
-- Seed: auth_management.user_roles (DEV)
-- Description: Asignación de roles a usuarios de prueba
-- Environment: DEVELOPMENT
-- Dependencies: auth_management.profiles, auth_management.tenants
-- Order: 04
-- Validated: 2025-11-02
-- Score: 100/100
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: User Role Assignments
-- =====================================================

INSERT INTO auth_management.user_roles (
    id,
    user_id,
    tenant_id,
    role,
    permissions,
    assigned_by,
    assigned_at,
    expires_at,
    revoked_by,
    revoked_at,
    is_active,
    metadata,
    created_at,
    updated_at
) VALUES
-- Student 1 Role
(
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'estudiante1@demo.glit.edu.mx'),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'student'::public.gamilit_role,
    '{
        "read": true,
        "write": false,
        "admin": false,
        "analytics": false,
        "can_view_own_progress": true,
        "can_submit_assignments": true,
        "can_participate_challenges": true
    }'::jsonb,
    (SELECT id FROM auth.users WHERE email = 'admin@glit.edu.mx'),
    gamilit.now_mexico(),
    NULL,
    NULL,
    NULL,
    true,
    '{
        "test_role": true,
        "environment": "development",
        "assigned_by_name": "Admin Gamilit"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Student 2 Role
(
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'estudiante2@demo.glit.edu.mx'),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'student'::public.gamilit_role,
    '{
        "read": true,
        "write": false,
        "admin": false,
        "analytics": false,
        "can_view_own_progress": true,
        "can_submit_assignments": true,
        "can_participate_challenges": true
    }'::jsonb,
    (SELECT id FROM auth.users WHERE email = 'admin@glit.edu.mx'),
    gamilit.now_mexico(),
    NULL,
    NULL,
    NULL,
    true,
    '{
        "test_role": true,
        "environment": "development"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Student 3 Role
(
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'estudiante3@demo.glit.edu.mx'),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'student'::public.gamilit_role,
    '{
        "read": true,
        "write": false,
        "admin": false,
        "analytics": false,
        "can_view_own_progress": true,
        "can_submit_assignments": true,
        "can_participate_challenges": true
    }'::jsonb,
    (SELECT id FROM auth.users WHERE email = 'admin@glit.edu.mx'),
    gamilit.now_mexico(),
    NULL,
    NULL,
    NULL,
    true,
    '{
        "test_role": true,
        "environment": "development"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Teacher Role
(
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'instructor@demo.glit.edu.mx'),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin_teacher'::public.gamilit_role,
    '{
        "read": true,
        "write": true,
        "admin": false,
        "analytics": true,
        "can_manage_students": true,
        "can_create_assignments": true,
        "can_grade_submissions": true,
        "can_view_class_analytics": true,
        "can_manage_content": true
    }'::jsonb,
    (SELECT id FROM auth.users WHERE email = 'admin@glit.edu.mx'),
    gamilit.now_mexico(),
    NULL,
    NULL,
    NULL,
    true,
    '{
        "test_role": true,
        "environment": "development",
        "assigned_by_name": "Admin Gamilit"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Admin Role
(
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'admin@glit.edu.mx'),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'super_admin'::public.gamilit_role,
    '{
        "read": true,
        "write": true,
        "admin": true,
        "analytics": true,
        "can_manage_all": true,
        "can_manage_users": true,
        "can_manage_tenants": true,
        "can_manage_system_settings": true,
        "can_view_all_analytics": true,
        "can_manage_roles": true
    }'::jsonb,
    NULL,
    gamilit.now_mexico(),
    NULL,
    NULL,
    NULL,
    true,
    '{
        "test_role": true,
        "environment": "development",
        "note": "Self-assigned admin role"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
)
ON CONFLICT (user_id, tenant_id, role) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    assigned_by = EXCLUDED.assigned_by,
    is_active = EXCLUDED.is_active,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    role_count INTEGER;
    active_count INTEGER;
    student_roles INTEGER;
    teacher_roles INTEGER;
    admin_roles INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count FROM auth_management.user_roles;
    SELECT COUNT(*) INTO active_count FROM auth_management.user_roles WHERE is_active = true;
    SELECT COUNT(*) INTO student_roles FROM auth_management.user_roles WHERE role = 'student';
    SELECT COUNT(*) INTO teacher_roles FROM auth_management.user_roles WHERE role = 'admin_teacher';
    SELECT COUNT(*) INTO admin_roles FROM auth_management.user_roles WHERE role = 'super_admin';

    RAISE NOTICE '==============================================';
    RAISE NOTICE '✓ User roles asignados correctamente';
    RAISE NOTICE '  Total: % roles', role_count;
    RAISE NOTICE '  Activos: %', active_count;
    RAISE NOTICE '  Estudiantes: %', student_roles;
    RAISE NOTICE '  Profesores: %', teacher_roles;
    RAISE NOTICE '  Admins: %', admin_roles;
    RAISE NOTICE '==============================================';
END $$;
