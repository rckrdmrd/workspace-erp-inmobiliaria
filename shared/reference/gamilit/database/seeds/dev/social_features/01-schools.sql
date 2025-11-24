-- =====================================================================
-- Archivo: 01-schools.sql
-- Schema: social_features
-- Descripción: Seeds de escuelas demo para testing
-- Dependencias: auth.users (instructores)
-- Autor: SA-SEEDS-SOCIAL
-- Fecha: 2025-11-02
-- =====================================================================

SET search_path TO social_features, public;

-- =====================================================================
-- SCHOOLS: Escuelas de diferentes tipos y ubicaciones
-- =====================================================================

INSERT INTO social_features.schools (
    name, code, type,
    address, city, state, country, postal_code,
    phone, email, website,
    principal_name, contact_name, email,
    current_students_count, current_teachers_count,
    is_active,
    settings, metadata,
    created_at, updated_at
) VALUES
-- =====================================================================
-- Escuela 1: Secundaria Federal No. 15 "Marie Curie" (Ciudad de México)
-- Tipo: Pública | Turno: Matutino | Capacidad: 450 estudiantes
-- =====================================================================
(
    'Secundaria Federal No. 15 "Marie Curie"',
    'SF-015-CDMX',
    'public',
    'Av. Insurgentes Sur 1234',
    'Ciudad de México',
    'CDMX',
    'México',
    '03100',
    '55-1234-5678',
    'secundaria15@sep.gob.mx',
    'https://sf15mariecurie.edu.mx',
    'Lic. Ana García Rodríguez',
    'Prof. Carlos Méndez',
    'contacto@sf15mariecurie.edu.mx',
    450,
    32,
    'active',
    true,
    '{
        "allow_public_registration": true,
        "require_email_verification": true,
        "max_students_per_classroom": 35,
        "enable_parent_portal": true,
        "academic_calendar": {
            "start_date": "2025-08-15",
            "end_date": "2026-07-15",
            "vacation_periods": [
                {"name": "Navidad", "start": "2025-12-20", "end": "2026-01-06"},
                {"name": "Semana Santa", "start": "2026-04-02", "end": "2026-04-12"}
            ]
        }
    }'::jsonb,
    '{
        "year_founded": 1975,
        "cct": "09DES0015K",
        "shift": "matutino",
        "grades": ["1", "2", "3"],
        "recognition": "Escuela de Calidad 2024",
        "infrastructure": {
            "library": true,
            "computer_lab": true,
            "science_lab": true,
            "sports_facilities": true
        }
    }'::jsonb,
    NOW(),
    NOW()
),

-- =====================================================================
-- Escuela 2: Secundaria Técnica No. 42 (Monterrey)
-- Tipo: Pública Técnica | Turno: Vespertino | Especialidades técnicas
-- =====================================================================
(
    'Secundaria Técnica No. 42',
    'ST-042-NL',
    'public',
    'Av. Tecnológico 567',
    'Monterrey',
    'Nuevo León',
    'México',
    '64700',
    '81-8765-4321',
    'secundariatecnica42@sep.gob.mx',
    'https://st42.edu.mx',
    'Ing. Roberto Sánchez',
    'Prof. Laura Martínez',
    'contacto@st42.edu.mx',
    380,
    28,
    'active',
    true,
    '{
        "allow_public_registration": true,
        "require_email_verification": true,
        "max_students_per_classroom": 30,
        "enable_parent_portal": true,
        "technical_workshops": true,
        "academic_calendar": {
            "start_date": "2025-08-15",
            "end_date": "2026-07-15"
        }
    }'::jsonb,
    '{
        "year_founded": 1982,
        "cct": "19DST0042L",
        "shift": "vespertino",
        "grades": ["1", "2", "3"],
        "specialties": ["Computación", "Electrónica", "Diseño Gráfico"],
        "certifications": ["SEP", "CONOCER"],
        "infrastructure": {
            "library": true,
            "computer_lab": true,
            "electronics_workshop": true,
            "design_studio": true
        }
    }'::jsonb,
    NOW(),
    NOW()
),

-- =====================================================================
-- Escuela 3: Colegio Científico "Albert Einstein" (Guadalajara)
-- Tipo: Privado | Enfoque: STEAM | Bilingüe
-- =====================================================================
(
    'Colegio Científico "Albert Einstein"',
    'CP-AE-JAL',
    'private',
    'Av. Chapultepec 890',
    'Guadalajara',
    'Jalisco',
    'México',
    '44100',
    '33-3456-7890',
    'info@colegioeinstein.edu.mx',
    'https://colegioeinstein.edu.mx',
    'Dra. Patricia Hernández',
    'Lic. Miguel Ángel Torres',
    'admisiones@colegioeinstein.edu.mx',
    280,
    24,
    'active',
    true,
    '{
        "allow_public_registration": false,
        "require_email_verification": true,
        "max_students_per_classroom": 25,
        "enable_parent_portal": true,
        "tuition_required": true,
        "admission_process": {
            "requires_interview": true,
            "requires_exam": true,
            "requires_documents": ["birth_certificate", "previous_grades", "recommendation_letters"]
        },
        "academic_calendar": {
            "start_date": "2025-08-15",
            "end_date": "2026-06-30"
        }
    }'::jsonb,
    '{
        "year_founded": 1995,
        "accreditation": "SACS",
        "bilingual": true,
        "steam_focused": true,
        "international_programs": ["Cambridge IGCSE"],
        "partnerships": ["MIT", "Stanford Pre-Collegiate"],
        "infrastructure": {
            "library": true,
            "computer_lab": true,
            "science_lab": true,
            "robotics_lab": true,
            "innovation_hub": true,
            "sports_complex": true,
            "auditorium": true
        },
        "extracurricular": ["Robotics Club", "Science Olympiad", "Model UN", "Debate Team"]
    }'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    current_students_count = EXCLUDED.current_students_count,
    current_teachers_count = EXCLUDED.current_teachers_count,
    settings = EXCLUDED.settings,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

-- =====================================================================
-- Verificación de inserción
-- =====================================================================
DO $$
DECLARE
    inserted_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO inserted_count FROM social_features.schools;
    RAISE NOTICE 'Total de escuelas en la base de datos: %', inserted_count;
END $$;
