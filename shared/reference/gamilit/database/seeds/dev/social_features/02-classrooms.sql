-- =====================================================================
-- Archivo: 02-classrooms.sql
-- Schema: social_features
-- Descripción: Seeds de aulas/grupos para las escuelas
-- Dependencias: 01-schools.sql, auth.users
-- Autor: SA-SEEDS-SOCIAL
-- Fecha: 2025-11-02
-- =====================================================================

SET search_path TO social_features, auth, public;

-- =====================================================================
-- CLASSROOMS: Aulas/grupos distribuidos por escuelas
-- =====================================================================

DO $$
DECLARE
    school_sf15 UUID;
    school_st42 UUID;
    school_einstein UUID;
    teacher_id UUID;
BEGIN
    -- =====================================================================
    -- Obtener school IDs dinámicamente
    -- =====================================================================
    SELECT school_id INTO school_sf15
    FROM social_features.schools
    WHERE school_code = 'SF-015-CDMX';

    SELECT school_id INTO school_st42
    FROM social_features.schools
    WHERE school_code = 'ST-042-NL';

    SELECT school_id INTO school_einstein
    FROM social_features.schools
    WHERE school_code = 'CP-AE-JAL';

    -- =====================================================================
    -- Obtener instructor demo
    -- =====================================================================
    SELECT user_id INTO teacher_id
    FROM auth.users
    WHERE email = 'instructor@demo.glit.edu.mx';

    -- Validar que exista el instructor
    IF teacher_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el instructor demo. Ejecutar seeds de auth primero.';
    END IF;

    -- =====================================================================
    -- AULAS PARA SECUNDARIA FEDERAL 15 (CDMX)
    -- =====================================================================

    -- Aula 1: 2° A - Comprensión Lectora
    INSERT INTO social_features.classrooms (
        school_id, teacher_id,
        name, code, grade_level, section,
        subject, description,
        capacity, current_students_count,
        start_date, end_date,
        schedule, is_active, is_active,
        settings, created_at, updated_at
    ) VALUES
    (
        school_sf15,
        teacher_id,
        '2° A - Comprensión Lectora',
        '2A-LECT-2025',
        '2',
        'A',
        'Comprensión Lectora',
        'Grupo de segundo año, sección A. Enfoque en desarrollo de competencias lectoras con metodología GLIT. Estrategias de lectura crítica y análisis textual.',
        35,
        0,
        '2025-08-15',
        '2026-07-15',
        '{
            "days": ["Lunes", "Miércoles", "Viernes"],
            "time": "08:00-09:00",
            "room": "Aula 201",
            "weekly_hours": 3
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "require_parental_consent": true,
            "grading_system": "numerical",
            "attendance_required": true,
            "homework_policy": {
                "frequency": "weekly",
                "submission_platform": "glit"
            }
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Aula 2: 3° B - Lectura Digital
    (
        school_sf15,
        teacher_id,
        '3° B - Lectura Digital',
        '3B-DIGI-2025',
        '3',
        'B',
        'Lectura Digital',
        'Grupo de tercer año, sección B. Especialización en alfabetización digital, fact-checking y análisis crítico de medios digitales.',
        35,
        0,
        '2025-08-15',
        '2026-07-15',
        '{
            "days": ["Martes", "Jueves"],
            "time": "10:00-11:30",
            "room": "Laboratorio de Cómputo",
            "weekly_hours": 3
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "require_parental_consent": true,
            "grading_system": "numerical",
            "attendance_required": true,
            "digital_literacy_focus": true,
            "tools_used": ["GLIT", "Google Classroom", "Canva"]
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Aula 3: 1° C - Lectura Básica
    (
        school_sf15,
        teacher_id,
        '1° C - Lectura Básica',
        '1C-BASIC-2025',
        '1',
        'C',
        'Lectura Básica',
        'Primer año, sección C. Fundamentos de comprensión lectora y desarrollo de habilidades básicas.',
        35,
        0,
        '2025-08-15',
        '2026-07-15',
        '{
            "days": ["Lunes", "Miércoles", "Viernes"],
            "time": "11:00-12:00",
            "room": "Aula 105",
            "weekly_hours": 3
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "require_parental_consent": true,
            "grading_system": "numerical",
            "attendance_required": true,
            "foundational_skills": true
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- =====================================================================
    -- AULAS PARA SECUNDARIA TÉCNICA 42 (MONTERREY)
    -- =====================================================================

    -- Aula 4: 1° A - Introducción a la Lectura
    (
        school_st42,
        teacher_id,
        '1° A - Introducción a la Lectura',
        '1A-INTRO-2025',
        '1',
        'A',
        'Introducción a la Lectura',
        'Primer año. Desarrollo de habilidades básicas de comprensión lectora con enfoque técnico y práctico.',
        30,
        0,
        '2025-08-15',
        '2026-07-15',
        '{
            "days": ["Lunes", "Miércoles", "Viernes"],
            "time": "14:00-15:00",
            "room": "Aula 105",
            "weekly_hours": 3,
            "shift": "vespertino"
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "require_parental_consent": true,
            "grading_system": "numerical",
            "technical_reading_focus": true
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Aula 5: 2° B - Lectura Técnica
    (
        school_st42,
        teacher_id,
        '2° B - Lectura Técnica',
        '2B-TECH-2025',
        '2',
        'B',
        'Lectura Técnica',
        'Segundo año. Comprensión de textos técnicos, manuales y documentación especializada.',
        30,
        0,
        '2025-08-15',
        '2026-07-15',
        '{
            "days": ["Martes", "Jueves"],
            "time": "15:00-16:30",
            "room": "Taller de Computación",
            "weekly_hours": 3,
            "shift": "vespertino"
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "technical_manuals": true,
            "industry_standards": ["ISO", "IEEE"]
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- =====================================================================
    -- AULAS PARA COLEGIO EINSTEIN (GUADALAJARA)
    -- =====================================================================

    -- Aula 6: 2° STEAM - Literatura Científica
    (
        school_einstein,
        teacher_id,
        '2° STEAM - Literatura Científica',
        '2ST-LITC-2025',
        '2',
        'STEAM',
        'Literatura Científica',
        'Grupo STEAM. Integración de literatura y ciencias mediante biografías de científicos, ensayos y divulgación científica.',
        25,
        0,
        '2025-08-15',
        '2026-06-30',
        '{
            "days": ["Lunes", "Miércoles", "Viernes"],
            "time": "09:00-10:30",
            "room": "Aula STEAM 3",
            "language": "Español/Inglés",
            "weekly_hours": 4
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "require_parental_consent": false,
            "bilingual": true,
            "grading_system": "cambridge",
            "steam_integration": true,
            "project_based_learning": true
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Aula 7: 3° Advanced - Critical Reading (Bilingüe)
    (
        school_einstein,
        teacher_id,
        '3° Advanced - Critical Reading',
        '3ADV-CRIT-2025',
        '3',
        'Advanced',
        'Critical Reading',
        'Tercer año avanzado. Lectura crítica en inglés y español con análisis de textos complejos y retórica.',
        25,
        0,
        '2025-08-15',
        '2026-06-30',
        '{
            "days": ["Martes", "Jueves"],
            "time": "11:00-12:30",
            "room": "Innovation Hub",
            "language": "English/Spanish",
            "weekly_hours": 3
        }'::jsonb,
        'active',
        true,
        '{
            "allow_student_self_enrollment": false,
            "enable_gamification": true,
            "bilingual": true,
            "grading_system": "cambridge",
            "advanced_placement": true,
            "college_prep": true,
            "debate_integration": true
        }'::jsonb,
        NOW(),
        NOW()
    )
    ON CONFLICT (school_id, code) DO UPDATE SET
        name = EXCLUDED.name,
        current_students_count = EXCLUDED.current_students_count,
        schedule = EXCLUDED.schedule,
        settings = EXCLUDED.settings,
        updated_at = NOW();

    -- =====================================================================
    -- Verificación de inserción
    -- =====================================================================
    RAISE NOTICE 'Aulas creadas exitosamente para 3 escuelas';
    RAISE NOTICE 'SF-015-CDMX: 3 aulas | ST-042-NL: 2 aulas | CP-AE-JAL: 2 aulas';

END $$;
