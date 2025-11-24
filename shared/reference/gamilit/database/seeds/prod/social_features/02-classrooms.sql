-- =====================================================
-- Seed: social_features.classrooms (PROD)
-- Description: Aulas demo para testing y demostraciones
-- Environment: PRODUCTION
-- Dependencies: social_features.schools, auth_management.profiles
-- Order: 02
-- Created: 2025-01-11
-- Version: 2.0 (Actualizado para alineación con DDL)
-- =====================================================
--
-- AULAS DEMO INCLUIDAS:
-- - 5to A (Escuela Marie Curie, Profesor 1)
-- - 5to B (Escuela Marie Curie, Profesor 2)
-- - 6to A (Escuela Marie Curie, Profesor 1)
-- - Aula de Pruebas (IEI, Director)
-- - Aula Demo Parent Portal (IEI, Profesor 2)
--
-- TOTAL: 5 aulas demo
--
-- IMPORTANTE: Estas aulas están asociadas a las escuelas y profesores demo.
--
-- CAMBIOS v2.0:
-- - Agregado tenant_id (requerido)
-- - Removido status (columna legacy)
-- - Actualizada estructura de bloques DO $$
-- =====================================================

SET search_path TO social_features, auth_management, public;

-- =====================================================
-- Obtener tenant_id y validar dependencias
-- =====================================================

DO $$
DECLARE
    v_tenant_id UUID;
    v_school_count INTEGER;
    v_teacher_count INTEGER;
BEGIN
    -- Obtener el tenant principal
    SELECT id INTO v_tenant_id
    FROM auth_management.tenants
    WHERE name = 'GAMILIT Platform'
    LIMIT 1;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Tenant "GAMILIT Platform" no encontrado. Ejecutar primero seed de tenants.';
    END IF;

    -- Validar que existan escuelas
    SELECT COUNT(*) INTO v_school_count
    FROM social_features.schools;

    IF v_school_count = 0 THEN
        RAISE EXCEPTION 'No hay escuelas. Ejecutar primero seed de schools.';
    END IF;

    -- Validar que existan profesores
    SELECT COUNT(*) INTO v_teacher_count
    FROM auth_management.profiles
    WHERE email IN ('teacher@gamilit.com', 'teacher2@gamilit.com', 'director@gamilit.com');

    IF v_teacher_count = 0 THEN
        RAISE WARNING 'No se encontraron profesores demo. Las aulas se crearán pero pueden tener profesores inválidos.';
    END IF;

    RAISE NOTICE 'Usando tenant_id: %', v_tenant_id;
    RAISE NOTICE 'Escuelas disponibles: %', v_school_count;
    RAISE NOTICE 'Profesores demo disponibles: %', v_teacher_count;

-- =====================================================
-- INSERT: Aulas Demo
-- =====================================================

INSERT INTO social_features.classrooms (
    id,
    school_id,
    tenant_id,
    teacher_id,
    name,
    code,
    grade_level,
    section,
    subject,
    description,
    capacity,
    current_students_count,
    start_date,
    end_date,
    schedule,
    is_active,
    settings,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- Aula 1: 5to A - Escuela Marie Curie (Profesor 1)
-- =====================================================
(
    '60000000-0000-0000-0000-000000000001'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,  -- Escuela Marie Curie
    v_tenant_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,  -- Profesor 1 (teacher@gamilit.com)
    '5to A - Comprensión Lectora',
    '5A-COMP-2025',
    '5',
    'A',
    'Comprensión Lectora',
    'Grupo de 5to grado, sección A. Enfoque en comprensión literal e inferencial.',
    35,
    2,  -- 2 estudiantes inicialmente
    '2025-08-15'::date,
    '2026-07-15'::date,
    jsonb_build_object(
        'days', jsonb_build_array('Lunes', 'Miércoles', 'Viernes'),
        'time', '08:00-09:30',
        'room', 'Aula 501',
        'weekly_hours', 4.5
    ),
    true,
    jsonb_build_object(
        'allow_student_self_enrollment', false,
        'enable_gamification', true,
        'require_parental_consent', true,
        'grading_system', 'numerical',
        'attendance_required', true,
        'homework_policy', jsonb_build_object(
            'frequency', 'weekly',
            'submission_platform', 'gamilit',
            'late_penalty', 10
        )
    ),
    jsonb_build_object(
        'academic_year', '2025-2026',
        'demo_classroom', true
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- Aula 2: 5to B - Escuela Marie Curie (Profesor 2)
-- =====================================================
(
    '60000000-0000-0000-0000-000000000002'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,  -- Escuela Marie Curie
    v_tenant_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,  -- Profesor 2 (teacher2@gamilit.com)
    '5to B - Lectura Digital',
    '5B-DIGI-2025',
    '5',
    'B',
    'Lectura Digital',
    'Grupo de 5to grado, sección B. Enfoque en competencias digitales y multimedia.',
    35,
    1,
    '2025-08-15'::date,
    '2026-07-15'::date,
    jsonb_build_object(
        'days', jsonb_build_array('Martes', 'Jueves'),
        'time', '10:00-11:30',
        'room', 'Lab Cómputo 1',
        'weekly_hours', 3
    ),
    true,
    jsonb_build_object(
        'allow_student_self_enrollment', false,
        'enable_gamification', true,
        'require_parental_consent', true,
        'grading_system', 'numerical',
        'attendance_required', true,
        'technology_requirements', jsonb_build_object(
            'devices', 'tablets',
            'software', jsonb_build_array('GAMILIT Platform', 'Browser')
        )
    ),
    jsonb_build_object(
        'academic_year', '2025-2026',
        'demo_classroom', true
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- Aula 3: 6to A - Escuela Marie Curie (Profesor 1)
-- =====================================================
(
    '60000000-0000-0000-0000-000000000003'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,  -- Escuela Marie Curie
    v_tenant_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,  -- Profesor 1
    '6to A - Producción de Textos',
    '6A-PROD-2025',
    '6',
    'A',
    'Producción de Textos',
    'Grupo de 6to grado, sección A. Enfoque en escritura creativa y argumentativa.',
    35,
    1,
    '2025-08-15'::date,
    '2026-07-15'::date,
    jsonb_build_object(
        'days', jsonb_build_array('Lunes', 'Miércoles', 'Viernes'),
        'time', '09:45-11:15',
        'room', 'Aula 601',
        'weekly_hours', 4.5
    ),
    true,
    jsonb_build_object(
        'allow_student_self_enrollment', false,
        'enable_gamification', true,
        'require_parental_consent', true,
        'grading_system', 'numerical',
        'attendance_required', true,
        'writing_portfolio', true
    ),
    jsonb_build_object(
        'academic_year', '2025-2026',
        'demo_classroom', true
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- Aula 4: Aula de Pruebas - IEI (Director)
-- =====================================================
(
    '60000000-0000-0000-0000-000000000004'::uuid,
    '50000000-0000-0000-0000-000000000002'::uuid,  -- Instituto IEI
    v_tenant_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,  -- Director (director@gamilit.com)
    'Aula de Pruebas - Todos los Niveles',
    'TEST-ALL-2025',
    'variable',
    'TEST',
    'Testing y Demos',
    'Aula para pruebas técnicas y demostraciones del sistema GAMILIT.',
    50,
    0,
    '2025-01-01'::date,
    '2025-12-31'::date,
    jsonb_build_object(
        'days', jsonb_build_array('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'),
        'time', 'flexible',
        'room', 'Virtual',
        'weekly_hours', 10
    ),
    true,
    jsonb_build_object(
        'allow_student_self_enrollment', true,
        'enable_gamification', true,
        'require_parental_consent', false,
        'grading_system', 'pass_fail',
        'attendance_required', false,
        'testing_environment', true
    ),
    jsonb_build_object(
        'academic_year', '2025',
        'demo_classroom', true,
        'environment', 'testing'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- Aula 5: Parent Portal Demo - IEI (Profesor 2)
-- =====================================================
(
    '60000000-0000-0000-0000-000000000005'::uuid,
    '50000000-0000-0000-0000-000000000002'::uuid,  -- Instituto IEI
    v_tenant_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,  -- Profesor 2
    'Demo Parent Portal - 4to A',
    '4A-PARENT-2025',
    '4',
    'A',
    'Comprensión General',
    'Aula demo para mostrar funcionalidad de Parent Portal con comunicación padre-maestro.',
    30,
    0,
    '2025-08-15'::date,
    '2026-06-30'::date,
    jsonb_build_object(
        'days', jsonb_build_array('Lunes', 'Miércoles', 'Viernes'),
        'time', '08:00-09:30',
        'room', 'Aula 401',
        'weekly_hours', 4.5
    ),
    true,
    jsonb_build_object(
        'allow_student_self_enrollment', false,
        'enable_gamification', true,
        'require_parental_consent', true,
        'grading_system', 'numerical',
        'attendance_required', true,
        'parent_portal_features', jsonb_build_object(
            'notifications', true,
            'progress_reports', true,
            'messaging', true,
            'calendar', true
        )
    ),
    jsonb_build_object(
        'academic_year', '2025-2026',
        'demo_classroom', true,
        'parent_portal_demo', true
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    capacity = EXCLUDED.capacity,
    current_students_count = EXCLUDED.current_students_count,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    schedule = EXCLUDED.schedule,
    is_active = EXCLUDED.is_active,
    settings = EXCLUDED.settings,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

END $$;

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    classroom_count INTEGER;
    marie_curie_count INTEGER;
    iei_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO classroom_count
    FROM social_features.classrooms
    WHERE metadata->>'demo_classroom' = 'true';

    SELECT COUNT(*) INTO marie_curie_count
    FROM social_features.classrooms c
    JOIN social_features.schools s ON c.school_id = s.id
    WHERE s.code = 'EP-MC-CDMX' AND c.metadata->>'demo_classroom' = 'true';

    SELECT COUNT(*) INTO iei_count
    FROM social_features.classrooms c
    JOIN social_features.schools s ON c.school_id = s.id
    WHERE s.code = 'IEI-GDL' AND c.metadata->>'demo_classroom' = 'true';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'AULAS DEMO CREADAS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total aulas: %', classroom_count;
    RAISE NOTICE '  - Marie Curie: %', marie_curie_count;
    RAISE NOTICE '  - IEI: %', iei_count;
    RAISE NOTICE '========================================';

    IF classroom_count = 5 THEN
        RAISE NOTICE '✓ Todas las aulas demo fueron creadas correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 5 aulas, se crearon %', classroom_count;
    END IF;
END $$;

-- =====================================================
-- Listado de aulas
-- =====================================================

DO $$
DECLARE
    classroom_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Listado de aulas demo:';
    RAISE NOTICE '========================================';

    FOR classroom_record IN
        SELECT c.name, c.code, s.name as school_name, c.grade_level, c.section
        FROM social_features.classrooms c
        JOIN social_features.schools s ON c.school_id = s.id
        WHERE c.metadata->>'demo_classroom' = 'true'
        ORDER BY s.name, c.grade_level, c.section
    LOOP
        RAISE NOTICE '  - % (%) - % %° %',
            classroom_record.name,
            classroom_record.code,
            classroom_record.school_name,
            classroom_record.grade_level,
            classroom_record.section;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;
