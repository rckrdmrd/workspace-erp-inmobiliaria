-- =====================================================
-- Seed: social_features.classroom_members (PROD)
-- Description: Asociaciones estudiantes-aulas para testing y demos
-- Environment: PRODUCTION
-- Dependencies: social_features.classrooms, auth_management.profiles
-- Order: 03
-- Created: 2025-01-11
-- Version: 1.0
-- =====================================================
--
-- ASOCIACIONES INCLUIDAS:
-- - 5to A: estudiante1, estudiante2
-- - 5to B: estudiante3, estudiante4
-- - 6to A: estudiante5
--
-- TOTAL: 5 asociaciones estudiante-aula
--
-- IMPORTANTE: Estas asociaciones conectan estudiantes demo con aulas demo.
-- =====================================================

SET search_path TO social_features, auth_management, public;

-- =====================================================
-- INSERT: Asociaciones Estudiante-Aula
-- =====================================================

INSERT INTO social_features.classroom_members (
    id,
    classroom_id,
    student_id,
    joined_at,
    role,
    status,
    attendance_percentage,
    performance_notes,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- 5to A - Estudiante 1 (Ana García)
-- =====================================================
(
    '70000000-0000-0000-0000-000000000001'::uuid,
    '60000000-0000-0000-0000-000000000001'::uuid,  -- 5to A
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,  -- Ana García
    gamilit.now_mexico(),
    'student',
    'active',
    0.00,  -- Sin attendance aún
    NULL,
    jsonb_build_object(
        'enrollment_type', 'demo',
        'demo_member', true,
        'enrolled_by', 'seed_script'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- 5to A - Estudiante 2 (Carlos Ramírez)
-- =====================================================
(
    '70000000-0000-0000-0000-000000000002'::uuid,
    '60000000-0000-0000-0000-000000000001'::uuid,  -- 5to A
    '02bc5f00-182e-5387-c899-3f269d49c06f'::uuid,  -- Carlos Ramírez
    gamilit.now_mexico(),
    'student',
    'active',
    0.00,
    NULL,
    jsonb_build_object(
        'enrollment_type', 'demo',
        'demo_member', true,
        'enrolled_by', 'seed_script'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- 5to B - Estudiante 3 (María Fernanda)
-- =====================================================
(
    '70000000-0000-0000-0000-000000000003'::uuid,
    '60000000-0000-0000-0000-000000000002'::uuid,  -- 5to B
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,  -- María Fernanda
    gamilit.now_mexico(),
    'student',
    'active',
    0.00,
    NULL,
    jsonb_build_object(
        'enrollment_type', 'demo',
        'demo_member', true,
        'enrolled_by', 'seed_script'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- 5to B - Estudiante 4 (Luis Miguel)
-- =====================================================
(
    '70000000-0000-0000-0000-000000000004'::uuid,
    '60000000-0000-0000-0000-000000000002'::uuid,  -- 5to B
    '04de7000-382e-7587-e899-51469f49e081'::uuid,  -- Luis Miguel
    gamilit.now_mexico(),
    'student',
    'active',
    0.00,
    NULL,
    jsonb_build_object(
        'enrollment_type', 'demo',
        'demo_member', true,
        'enrolled_by', 'seed_script'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- 6to A - Estudiante 5 (Sofía Martínez)
-- =====================================================
(
    '70000000-0000-0000-0000-000000000005'::uuid,
    '60000000-0000-0000-0000-000000000003'::uuid,  -- 6to A
    '05ef8000-482e-8687-f899-62569049f092'::uuid,  -- Sofía Martínez
    gamilit.now_mexico(),
    'student',
    'active',
    0.00,
    NULL,
    jsonb_build_object(
        'enrollment_type', 'demo',
        'demo_member', true,
        'enrolled_by', 'seed_script'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (classroom_id, student_id) DO UPDATE SET
    status = EXCLUDED.status,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    member_count INTEGER;
    classroom_5a_count INTEGER;
    classroom_5b_count INTEGER;
    classroom_6a_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO member_count
    FROM social_features.classroom_members
    WHERE metadata->>'demo_member' = 'true';

    SELECT COUNT(*) INTO classroom_5a_count
    FROM social_features.classroom_members
    WHERE classroom_id = '60000000-0000-0000-0000-000000000001'::uuid;

    SELECT COUNT(*) INTO classroom_5b_count
    FROM social_features.classroom_members
    WHERE classroom_id = '60000000-0000-0000-0000-000000000002'::uuid;

    SELECT COUNT(*) INTO classroom_6a_count
    FROM social_features.classroom_members
    WHERE classroom_id = '60000000-0000-0000-0000-000000000003'::uuid;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'ASOCIACIONES AULA-ESTUDIANTE CREADAS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total asociaciones: %', member_count;
    RAISE NOTICE '  - 5to A: % estudiantes', classroom_5a_count;
    RAISE NOTICE '  - 5to B: % estudiantes', classroom_5b_count;
    RAISE NOTICE '  - 6to A: % estudiantes', classroom_6a_count;
    RAISE NOTICE '========================================';

    IF member_count = 5 THEN
        RAISE NOTICE '✓ Todas las asociaciones fueron creadas correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 5 asociaciones, se crearon %', member_count;
    END IF;
END $$;

-- =====================================================
-- Listado de asociaciones
-- =====================================================

DO $$
DECLARE
    member_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Listado de estudiantes por aula:';
    RAISE NOTICE '========================================';

    FOR member_record IN
        SELECT
            c.name as classroom_name,
            c.code as classroom_code,
            p.display_name as student_name,
            p.email as student_email,
            cm.status
        FROM social_features.classroom_members cm
        JOIN social_features.classrooms c ON c.id = cm.classroom_id
        JOIN auth_management.profiles p ON p.id = cm.student_id
        WHERE cm.metadata->>'demo_member' = 'true'
        ORDER BY c.name, p.display_name
    LOOP
        RAISE NOTICE '  [%] % (%)',
            member_record.classroom_code,
            member_record.classroom_name,
            member_record.status;
        RAISE NOTICE '    └─ %  <%>',
            member_record.student_name,
            member_record.student_email;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- Actualizar counts en classrooms
-- =====================================================

UPDATE social_features.classrooms
SET current_students_count = (
    SELECT COUNT(*)
    FROM social_features.classroom_members
    WHERE classroom_id = classrooms.id
      AND status = 'active'
)
WHERE id IN (
    '60000000-0000-0000-0000-000000000001'::uuid,  -- 5to A
    '60000000-0000-0000-0000-000000000002'::uuid,  -- 5to B
    '60000000-0000-0000-0000-000000000003'::uuid   -- 6to A
);

-- Verificar counts actualizados
DO $$
DECLARE
    classroom_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Verificación de counts actualizados:';
    RAISE NOTICE '========================================';

    FOR classroom_record IN
        SELECT name, code, current_students_count
        FROM social_features.classrooms
        WHERE metadata->>'demo_classroom' = 'true'
          AND current_students_count > 0
        ORDER BY name
    LOOP
        RAISE NOTICE '  % (%): % estudiantes',
            classroom_record.name,
            classroom_record.code,
            classroom_record.current_students_count;
    END LOOP;

    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ Counts actualizados correctamente';
END $$;
