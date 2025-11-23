-- =====================================================
-- Seed: social_features.schools (PROD)
-- Description: Escuelas demo para testing y demostraciones
-- Environment: PRODUCTION
-- Dependencies: auth_management.tenants
-- Order: 01
-- Created: 2025-01-11
-- Version: 2.0 (Actualizado para alineación con DDL)
-- =====================================================
--
-- ESCUELAS DEMO INCLUIDAS:
-- - Escuela Primaria Marie Curie (CDMX)
-- - Instituto de Educación Integral (Guadalajara)
--
-- TOTAL: 2 escuelas demo
--
-- IMPORTANTE: Estas escuelas son para testing y demos.
--
-- CAMBIOS v2.0:
-- - Agregado tenant_id (requerido)
-- - Removido type (columna legacy)
-- - Cambiado state → region (nuevo nombre de columna)
-- - Removido principal_name, contact_name, contact_email (legacy)
-- - Removido status (columna legacy)
-- - Agregado short_name, description
-- - Actualizados queries de verificación
-- =====================================================

SET search_path TO social_features, auth_management, public;

-- =====================================================
-- Obtener tenant_id para las escuelas
-- =====================================================

DO $$
DECLARE
    v_tenant_id UUID;
BEGIN
    -- Obtener el tenant principal de GAMILIT Platform
    SELECT id INTO v_tenant_id
    FROM auth_management.tenants
    WHERE name = 'GAMILIT Platform'
    LIMIT 1;

    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Tenant "GAMILIT Platform" no encontrado. Ejecutar primero seed de tenants.';
    END IF;

    RAISE NOTICE 'Usando tenant_id: %', v_tenant_id;

-- =====================================================
-- INSERT: Escuelas Demo
-- =====================================================

INSERT INTO social_features.schools (
    id,
    tenant_id,
    name,
    code,
    short_name,
    description,
    address,
    city,
    region,
    country,
    postal_code,
    phone,
    email,
    website,
    current_students_count,
    current_teachers_count,
    is_active,
    settings,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- Escuela 1: Escuela Primaria Marie Curie (CDMX)
-- =====================================================
(
    '50000000-0000-0000-0000-000000000001'::uuid,
    v_tenant_id,
    'Escuela Primaria Marie Curie',
    'EP-MC-CDMX',
    'EP Marie Curie',
    'Escuela primaria pública enfocada en ciencias y educación integral, inspirada en la vida de Marie Curie.',
    'Av. Insurgentes Sur 1234',
    'Ciudad de México',
    'CDMX',
    'México',
    '03100',
    '55-1234-5678',
    'contacto@mariecurie.edu.mx',
    'https://mariecurie.edu.mx',
    450,
    32,
    true,
    jsonb_build_object(
        'allow_public_registration', true,
        'require_email_verification', true,
        'max_students_per_classroom', 35,
        'enable_parent_portal', true,
        'academic_calendar', jsonb_build_object(
            'start_date', '2025-08-15',
            'end_date', '2026-07-15',
            'vacation_periods', jsonb_build_array(
                jsonb_build_object('name', 'Navidad', 'start', '2025-12-20', 'end', '2026-01-06'),
                jsonb_build_object('name', 'Semana Santa', 'start', '2026-04-02', 'end', '2026-04-12')
            )
        ),
        'features', jsonb_build_object(
            'gamification', true,
            'assessments', true,
            'parent_portal', true,
            'analytics', true
        )
    ),
    jsonb_build_object(
        'year_founded', 2010,
        'type', 'public',
        'cct', '09DPR0123K',
        'shift', 'matutino',
        'grades', jsonb_build_array('1', '2', '3', '4', '5', '6'),
        'recognition', 'Escuela de Calidad 2024',
        'principal_name', 'Lic. Ana María Rodríguez',
        'contact_name', 'Prof. Carlos Méndez',
        'contact_email', 'admin@mariecurie.edu.mx',
        'infrastructure', jsonb_build_object(
            'library', true,
            'computer_lab', true,
            'science_lab', true,
            'sports_facilities', true,
            'cafeteria', true
        ),
        'programs', jsonb_build_array(
            'Programa de Lectura Marie Curie',
            'Club de Ciencias',
            'Deportes vespertinos'
        ),
        'demo_school', true
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- Escuela 2: Instituto de Educación Integral (Guadalajara)
-- =====================================================
(
    '50000000-0000-0000-0000-000000000002'::uuid,
    v_tenant_id,
    'Instituto de Educación Integral',
    'IEI-GDL',
    'IEI Guadalajara',
    'Instituto privado de educación integral con enfoque STEAM y programas bilingües.',
    'Av. Chapultepec 890',
    'Guadalajara',
    'Jalisco',
    'México',
    '44100',
    '33-3456-7890',
    'contacto@iei.edu.mx',
    'https://iei.edu.mx',
    280,
    24,
    true,
    jsonb_build_object(
        'allow_public_registration', false,
        'require_email_verification', true,
        'max_students_per_classroom', 25,
        'enable_parent_portal', true,
        'tuition_required', true,
        'admission_process', jsonb_build_object(
            'requires_interview', true,
            'requires_exam', true,
            'requires_documents', jsonb_build_array(
                'birth_certificate',
                'previous_grades',
                'recommendation_letters'
            )
        ),
        'academic_calendar', jsonb_build_object(
            'start_date', '2025-08-15',
            'end_date', '2026-06-30',
            'vacation_periods', jsonb_build_array(
                jsonb_build_object('name', 'Navidad', 'start', '2025-12-18', 'end', '2026-01-08'),
                jsonb_build_object('name', 'Semana Santa', 'start', '2026-04-01', 'end', '2026-04-13')
            )
        ),
        'features', jsonb_build_object(
            'gamification', true,
            'assessments', true,
            'parent_portal', true,
            'analytics', true,
            'bilingual_program', true
        )
    ),
    jsonb_build_object(
        'year_founded', 1995,
        'type', 'private',
        'accreditation', 'SEP',
        'bilingual', true,
        'steam_focused', true,
        'international_programs', jsonb_build_array('Cambridge Primary'),
        'partnerships', jsonb_build_array('Universidad de Guadalajara'),
        'principal_name', 'Dra. Patricia Hernández',
        'contact_name', 'Lic. Miguel Ángel Torres',
        'contact_email', 'admisiones@iei.edu.mx',
        'infrastructure', jsonb_build_object(
            'library', true,
            'computer_lab', true,
            'science_lab', true,
            'robotics_lab', true,
            'innovation_hub', true,
            'sports_complex', true,
            'auditorium', true,
            'art_studio', true
        ),
        'extracurricular', jsonb_build_array(
            'Robótica',
            'Ajedrez',
            'Música',
            'Artes Plásticas',
            'Deportes'
        ),
        'certifications', jsonb_build_array('SEP', 'Cambridge'),
        'demo_school', true
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    description = EXCLUDED.description,
    email = EXCLUDED.email,
    current_students_count = EXCLUDED.current_students_count,
    current_teachers_count = EXCLUDED.current_teachers_count,
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
    school_count INTEGER;
    public_schools INTEGER;
    private_schools INTEGER;
BEGIN
    SELECT COUNT(*) INTO school_count
    FROM social_features.schools
    WHERE metadata->>'demo_school' = 'true';

    SELECT COUNT(*) INTO public_schools
    FROM social_features.schools
    WHERE metadata->>'type' = 'public' AND metadata->>'demo_school' = 'true';

    SELECT COUNT(*) INTO private_schools
    FROM social_features.schools
    WHERE metadata->>'type' = 'private' AND metadata->>'demo_school' = 'true';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'ESCUELAS DEMO CREADAS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total escuelas: %', school_count;
    RAISE NOTICE '  - Públicas: %', public_schools;
    RAISE NOTICE '  - Privadas: %', private_schools;
    RAISE NOTICE '========================================';

    IF school_count = 2 THEN
        RAISE NOTICE '✓ Todas las escuelas demo fueron creadas correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 2 escuelas, se crearon %', school_count;
    END IF;
END $$;

-- =====================================================
-- Listado de escuelas
-- =====================================================

DO $$
DECLARE
    school_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Listado de escuelas demo:';
    RAISE NOTICE '========================================';

    FOR school_record IN
        SELECT name, code, city, region, current_students_count
        FROM social_features.schools
        WHERE metadata->>'demo_school' = 'true'
        ORDER BY name
    LOOP
        RAISE NOTICE '  - % (%) - %, %',
            school_record.name,
            school_record.code,
            school_record.city,
            school_record.region;
        RAISE NOTICE '    Estudiantes: %', school_record.current_students_count;
    END LOOP;

    RAISE NOTICE '========================================';
END $$;
