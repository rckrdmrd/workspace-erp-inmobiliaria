-- =====================================================================
-- Archivo: 03-classroom-members.sql
-- Schema: social_features
-- Descripción: Seeds de membresías de estudiantes a aulas
-- Dependencias: 02-classrooms.sql, auth.users (estudiantes)
-- Autor: SA-SEEDS-SOCIAL
-- Fecha: 2025-11-02
-- =====================================================================

SET search_path TO social_features, auth, public;

-- =====================================================================
-- CLASSROOM MEMBERS: Asignar estudiantes demo a aulas
-- =====================================================================

DO $$
DECLARE
    classroom_2a UUID;
    classroom_3b UUID;
    classroom_1c UUID;
    classroom_1a UUID;
    classroom_2b UUID;
    classroom_2st UUID;
    classroom_3adv UUID;
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    enrolled_count INTEGER;
BEGIN
    -- =====================================================================
    -- Obtener classroom IDs dinámicamente
    -- =====================================================================
    SELECT classroom_id INTO classroom_2a
    FROM social_features.classrooms
    WHERE classroom_code = '2A-LECT-2025';

    SELECT classroom_id INTO classroom_3b
    FROM social_features.classrooms
    WHERE classroom_code = '3B-DIGI-2025';

    SELECT classroom_id INTO classroom_1c
    FROM social_features.classrooms
    WHERE classroom_code = '1C-BASIC-2025';

    SELECT classroom_id INTO classroom_1a
    FROM social_features.classrooms
    WHERE classroom_code = '1A-INTRO-2025';

    SELECT classroom_id INTO classroom_2b
    FROM social_features.classrooms
    WHERE classroom_code = '2B-TECH-2025';

    SELECT classroom_id INTO classroom_2st
    FROM social_features.classrooms
    WHERE classroom_code = '2ST-LITC-2025';

    SELECT classroom_id INTO classroom_3adv
    FROM social_features.classrooms
    WHERE classroom_code = '3ADV-CRIT-2025';

    -- =====================================================================
    -- Obtener student IDs
    -- =====================================================================
    SELECT user_id INTO student1_id
    FROM auth.users
    WHERE email = 'estudiante1@demo.glit.edu.mx';

    SELECT user_id INTO student2_id
    FROM auth.users
    WHERE email = 'estudiante2@demo.glit.edu.mx';

    SELECT user_id INTO student3_id
    FROM auth.users
    WHERE email = 'estudiante3@demo.glit.edu.mx';

    -- Validar que existan los estudiantes
    IF student1_id IS NULL OR student2_id IS NULL OR student3_id IS NULL THEN
        RAISE EXCEPTION 'No se encontraron todos los estudiantes demo. Ejecutar seeds de auth primero.';
    END IF;

    -- =====================================================================
    -- MEMBRESÍAS PARA ESTUDIANTE 1
    -- Perfil: Estudiante activo, inscrito en múltiples aulas
    -- =====================================================================

    -- Estudiante 1 → Aula 2° A (Secundaria Federal 15)
    INSERT INTO social_features.classroom_members (
        classroom_id, user_id, role,
        joined_at, is_active, is_active,
        settings, metadata, created_at, updated_at
    ) VALUES
    (
        classroom_2a,
        student1_id,
        'student',
        '2025-08-15',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "preferred_communication": "email"
        }'::jsonb,
        '{
            "enrollment_type": "regular",
            "previous_performance": "excellent",
            "special_needs": false
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Estudiante 1 → Aula 3° B (Multi-enrollment)
    (
        classroom_3b,
        student1_id,
        'student',
        '2025-08-20',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "preferred_communication": "email"
        }'::jsonb,
        '{
            "enrollment_type": "advanced_placement",
            "reason": "Alto desempeño en lectura digital"
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- =====================================================================
    -- MEMBRESÍAS PARA ESTUDIANTE 2
    -- Perfil: Estudiante de secundaria técnica
    -- =====================================================================

    -- Estudiante 2 → Aula 3° B (Secundaria Federal 15)
    (
        classroom_3b,
        student2_id,
        'student',
        '2025-08-15',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "preferred_communication": "sms"
        }'::jsonb,
        '{
            "enrollment_type": "regular",
            "previous_performance": "good",
            "special_needs": false
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Estudiante 2 → Aula 2° B Técnica (Secundaria Técnica 42)
    (
        classroom_2b,
        student2_id,
        'student',
        '2025-08-15',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "workshop_access": true
        }'::jsonb,
        '{
            "enrollment_type": "technical_specialty",
            "specialty": "Computación",
            "workshop_schedule": "Lunes y Miércoles 16:00-18:00"
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- =====================================================================
    -- MEMBRESÍAS PARA ESTUDIANTE 3
    -- Perfil: Estudiante de primer año
    -- =====================================================================

    -- Estudiante 3 → Aula 1° A (Secundaria Técnica 42)
    (
        classroom_1a,
        student3_id,
        'student',
        '2025-08-15',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "parental_monitoring": true
        }'::jsonb,
        '{
            "enrollment_type": "regular",
            "is_first_year": true,
            "orientation_completed": true,
            "parent_contact": "padre3@demo.glit.edu.mx"
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Estudiante 3 → Aula 1° C Básica (Secundaria Federal 15)
    (
        classroom_1c,
        student3_id,
        'student',
        '2025-08-18',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "parental_monitoring": true
        }'::jsonb,
        '{
            "enrollment_type": "regular",
            "is_first_year": true,
            "foundational_support": true
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- =====================================================================
    -- MEMBRESÍAS ADICIONALES PARA VARIEDAD
    -- =====================================================================

    -- Estudiante 1 → Aula STEAM (Colegio Einstein)
    (
        classroom_2st,
        student1_id,
        'student',
        '2025-08-15',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "bilingual_mode": true
        }'::jsonb,
        '{
            "enrollment_type": "steam_program",
            "scholarship": true,
            "stem_projects_enrolled": ["Biografías Científicas", "Science Fair"]
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Estudiante 2 → Aula Advanced (Colegio Einstein)
    (
        classroom_3adv,
        student2_id,
        'student',
        '2025-08-15',
        'active',
        true,
        '{
            "attendance_tracking": true,
            "grade_visibility": true,
            "notifications_enabled": true,
            "bilingual_mode": true,
            "advanced_resources": true
        }'::jsonb,
        '{
            "enrollment_type": "advanced_placement",
            "cambridge_candidate": true,
            "debate_team": true
        }'::jsonb,
        NOW(),
        NOW()
    )
    ON CONFLICT (classroom_id, user_id) DO UPDATE SET
        status = EXCLUDED.is_active,
        settings = EXCLUDED.settings,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();

    -- =====================================================================
    -- Actualizar enrollment counts en classrooms
    -- =====================================================================
    UPDATE social_features.classrooms
    SET current_enrollment = (
        SELECT COUNT(*)
        FROM social_features.classroom_members
        WHERE classroom_members.classroom_id = classrooms.classroom_id
          AND status = 'active'
    )
    WHERE classroom_id IN (
        classroom_2a, classroom_3b, classroom_1c,
        classroom_1a, classroom_2b,
        classroom_2st, classroom_3adv
    );

    -- =====================================================================
    -- Verificación de inserción
    -- =====================================================================
    SELECT COUNT(*) INTO enrolled_count
    FROM social_features.classroom_members
    WHERE status = 'active';

    RAISE NOTICE 'Total de membresías activas creadas: %', enrolled_count;
    RAISE NOTICE 'Estudiante 1: % aulas', (
        SELECT COUNT(*)
        FROM social_features.classroom_members
        WHERE user_id = student1_id AND status = 'active'
    );
    RAISE NOTICE 'Estudiante 2: % aulas', (
        SELECT COUNT(*)
        FROM social_features.classroom_members
        WHERE user_id = student2_id AND status = 'active'
    );
    RAISE NOTICE 'Estudiante 3: % aulas', (
        SELECT COUNT(*)
        FROM social_features.classroom_members
        WHERE user_id = student3_id AND status = 'active'
    );

END $$;
