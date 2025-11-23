-- =====================================================
-- Seed: auth_management.profiles - Production Registered Users
-- Description: Perfiles para usuarios reales registrados en producción
-- Environment: PRODUCTION
-- Dependencies: auth/02-production-users.sql, auth_management/01-tenants.sql
-- Order: 06
-- Created: 2025-11-19
-- Version: 1.0 (Migrados desde servidor producción)
-- =====================================================
--
-- PERFILES DE USUARIOS REALES REGISTRADOS (13):
-- Perfiles de estudiantes que se registraron en el servidor de producción
-- durante 2025-11-18
--
-- TOTAL: 13 perfiles de estudiantes
--
-- POLÍTICA DE CARGA LIMPIA:
-- ✅ Profile IDs originales del servidor preservados
-- ✅ Tenant IDs originales preservados
-- ✅ Información básica completa (first_name + last_name)
-- ✅ Preferences por defecto para estudiantes
--
-- IMPORTANTE: Estos son perfiles reales de producción.
-- La inicialización de gamificación (user_stats, user_ranks)
-- se realiza automáticamente mediante trigger:
-- - gamilit.initialize_user_stats()
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Production User Profiles (13 perfiles)
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
-- PROFILE 1: Jose Aguirre
-- =====================================================
(
    '9f5cde08-ae6a-468c-8092-c9a6fff34a5a'::uuid,  -- profile_id original
    'a2019d2c-1abe-4b92-8033-372a2a553f76'::uuid,  -- tenant_id original
    'b017b792-b327-40dd-aefb-a80312776952'::uuid,  -- user_id
    'joseal.guirre34@gmail.com',
    'Jose Aguirre',
    'Jose Aguirre',
    'Jose',
    'Aguirre',
    NULL,  -- avatar_url (se asigna cuando el usuario suba foto)
    NULL,  -- bio
    NULL,  -- phone
    NULL,  -- date_of_birth
    NULL,  -- grade_level (se completa cuando el usuario lo especifique)
    NULL,  -- student_id
    NULL,  -- school_id
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,  -- email_verified (pendiente)
    false,  -- phone_verified
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 07:29:05.229254+00'::timestamptz,
    '2025-11-18 07:29:05.229254+00'::timestamptz
),

-- =====================================================
-- PROFILE 2: Sergio Jimenez
-- =====================================================
(
    '2f12cb27-c587-4a4f-945e-3d516008f31e'::uuid,
    '6490930a-c572-4464-82f7-19d688f32877'::uuid,
    '06a24962-e83d-4e94-aad7-ff69f20a9119'::uuid,
    'sergiojimenezesteban63@gmail.com',
    'Sergio Jimenez',
    'Sergio Jimenez',
    'Sergio',
    'Jimenez',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 08:17:40.928077+00'::timestamptz,
    '2025-11-18 08:17:40.928077+00'::timestamptz
),

-- =====================================================
-- PROFILE 3: Hugo Gomez
-- =====================================================
(
    'c0c1a8f1-553f-491f-b442-130e7adeb684'::uuid,
    '4abd1886-6d7e-42c9-a2a5-f7a9e01973bd'::uuid,
    '24e8c563-8854-43d1-b3c9-2f83e91f5a1e'::uuid,
    'Gomezfornite92@gmail.com',
    'Hugo Gomez',
    'Hugo Gomez',
    'Hugo',
    'Gomez',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 08:18:04.242047+00'::timestamptz,
    '2025-11-18 08:18:04.242047+00'::timestamptz
),

-- =====================================================
-- PROFILE 4: Hugo Aragón
-- =====================================================
(
    '752f9db9-c0d6-474a-9b07-78ada1b0d3ba'::uuid,
    'c77ba4cc-be06-4ed8-8e48-4bbc72d59f16'::uuid,
    'bf0d3e34-e077-43d1-9626-292f7fae2bd6'::uuid,
    'Aragon494gt54@icloud.com',
    'Hugo Aragón',
    'Hugo Aragón',
    'Hugo',
    'Aragón',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 08:20:17.230714+00'::timestamptz,
    '2025-11-18 08:20:17.230714+00'::timestamptz
),

-- =====================================================
-- PROFILE 5: Azul Valentina
-- =====================================================
(
    '849e1ec3-226a-4d47-82dd-f8290cb84460'::uuid,
    'e2b08195-5a20-4822-a9b6-8d2e04c785b3'::uuid,
    '2f5a9846-3393-40b2-9e87-0f29238c383f'::uuid,
    'blu3wt7@gmail.com',
    'Azul Valentina',
    'Azul Valentina',
    'Azul',
    'Valentina',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 08:32:17.315932+00'::timestamptz,
    '2025-11-18 08:32:17.315932+00'::timestamptz
),

-- =====================================================
-- PROFILE 6: Ricardo Lugo
-- =====================================================
(
    '527c7ec6-1e3e-434e-8019-623658e5016d'::uuid,
    '5f4dd29b-0317-4d96-8540-4e9417175525'::uuid,
    '5e738038-1743-4aa9-b222-30171300ea9d'::uuid,
    'ricardolugo786@icloud.com',
    'Ricardo Lugo',
    'Ricardo Lugo',
    'Ricardo',
    'Lugo',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 10:15:06.481498+00'::timestamptz,
    '2025-11-18 10:15:06.481498+00'::timestamptz
),

-- =====================================================
-- PROFILE 7: Carlos Marban
-- =====================================================
(
    '08bb6a08-344b-47a6-b7a6-fa626363bfd4'::uuid,
    '87b8dc94-da11-451d-a53b-31c00a6973b8'::uuid,
    '00c742d9-e5f7-4666-9597-5a8ca54d5478'::uuid,
    'marbancarlos916@gmail.com',
    'Carlos Marban',
    'Carlos Marban',
    'Carlos',
    'Marban',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 10:29:05.240413+00'::timestamptz,
    '2025-11-18 10:29:05.240413+00'::timestamptz
),

-- =====================================================
-- PROFILE 8: Diego Colores
-- =====================================================
(
    '505ab2e1-fb7b-4cde-8a00-44c85f1cdcc1'::uuid,
    '331b5931-1125-482f-9535-f1e0e829edd5'::uuid,
    '33306a65-a3b1-41d5-a49d-47989957b822'::uuid,
    'diego.colores09@gmail.com',
    'Diego Colores',
    'Diego Colores',
    'Diego',
    'Colores',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 10:29:20.531883+00'::timestamptz,
    '2025-11-18 10:29:20.531883+00'::timestamptz
),

-- =====================================================
-- PROFILE 9: Benjamin Hernandez
-- =====================================================
(
    '06a77c1d-1732-4aa9-8643-ec1e35b643b3'::uuid,
    '2f1c69b9-2da7-4b72-a6fd-477aa96ba075'::uuid,
    '7a6a973e-83f7-4374-a9fc-54258138115f'::uuid,
    'hernandezfonsecabenjamin7@gmail.com',
    'Benjamin Hernandez',
    'Benjamin Hernandez',
    'Benjamin',
    'Hernandez',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 10:37:06.9215+00'::timestamptz,
    '2025-11-18 10:37:06.9215+00'::timestamptz
),

-- =====================================================
-- PROFILE 10: Josue Reyes
-- =====================================================
(
    '4bb84c20-62c9-4e22-b5f0-d0e89fb25dd9'::uuid,
    '7265b54e-a988-4c50-a62c-61cb0594f556'::uuid,
    'ccd7135c-0fea-4488-9094-9da52df1c98c'::uuid,
    'jr7794315@gmail.com',
    'Josue Reyes',
    'Josue Reyes',
    'Josue',
    'Reyes',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 17:53:39.681271+00'::timestamptz,
    '2025-11-18 17:53:39.681271+00'::timestamptz
),

-- =====================================================
-- PROFILE 11: Fernando Barragan
-- =====================================================
(
    '9a7c1df4-3769-4c56-aca4-0c69c15697cb'::uuid,
    'dcc49202-4d26-4b09-9bdb-8f71d039f328'::uuid,
    '9951ad75-e9cb-47b3-b478-6bb860ee2530'::uuid,
    'barraganfer03@gmail.com',
    'Fernando Barragan',
    'Fernando Barragan',
    'Fernando',
    'Barragan',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 20:39:27.410436+00'::timestamptz,
    '2025-11-18 20:39:27.410436+00'::timestamptz
),

-- =====================================================
-- PROFILE 12: Marco Antonio Roman
-- =====================================================
(
    'd6e7b828-f1ca-4b37-a0ad-c0ec4969534d'::uuid,
    'bfc0fac3-8905-4514-af32-7375e242e0f5'::uuid,
    '735235f5-260a-4c9b-913c-14a1efd083ea'::uuid,
    'roman.rebollar.marcoantonio1008@gmail.com',
    'Marco Antonio Roman',
    'Marco Antonio Roman',
    'Marco Antonio',
    'Roman',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 21:03:17.328254+00'::timestamptz,
    '2025-11-18 21:03:17.328254+00'::timestamptz
),

-- =====================================================
-- PROFILE 13: Rodrigo Guerrero
-- =====================================================
(
    '3aa7febc-b6f9-4005-9f55-07eb11120e87'::uuid,
    'c4856507-807f-4fc5-9689-ffeb0feb4825'::uuid,
    'ebe48628-5e44-4562-97b7-b4950b216247'::uuid,
    'rodrigoguerrero0914@gmail.com',
    'Rodrigo Guerrero',
    'Rodrigo Guerrero',
    'Rodrigo',
    'Guerrero',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    false,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true
    ),
    '{}'::jsonb,
    '2025-11-18 21:20:52.304488+00'::timestamptz,
    '2025-11-18 21:20:52.304488+00'::timestamptz
)

ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    full_name = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = EXCLUDED.updated_at;

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    production_profile_count INTEGER;
    total_profile_count INTEGER;
BEGIN
    -- Contar perfiles de producción (excluyendo @gamilit.com)
    SELECT COUNT(*) INTO production_profile_count
    FROM auth_management.profiles
    WHERE email NOT LIKE '%@gamilit.com';

    -- Contar todos los perfiles
    SELECT COUNT(*) INTO total_profile_count
    FROM auth_management.profiles;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'PERFILES DE PRODUCCIÓN CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Perfiles de producción: %', production_profile_count;
    RAISE NOTICE 'Total perfiles (incluyendo testing): %', total_profile_count;
    RAISE NOTICE '========================================';

    IF production_profile_count = 13 THEN
        RAISE NOTICE '✓ Los 13 perfiles de producción fueron creados correctamente';
        RAISE NOTICE '✓ Trigger initialize_user_stats() creará automáticamente:';
        RAISE NOTICE '  - gamification_system.user_stats (13 registros)';
        RAISE NOTICE '  - gamification_system.user_ranks (13 registros)';
    ELSE
        RAISE WARNING '⚠ Se esperaban 13 perfiles de producción, se crearon %', production_profile_count;
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- IMPORTANTE: Inicialización Automática de Gamificación
-- =====================================================
-- El trigger gamilit.initialize_user_stats() se ejecuta
-- automáticamente DESPUÉS de insertar cada profile y crea:
--
-- 1. gamification_system.user_stats
--    - level: 1
--    - ml_coins: 100 (inicial)
--    - current_rank: 'Ajaw'
--
-- 2. gamification_system.user_ranks
--    - current_rank: 'Ajaw'
--    - rank_progress_percentage: 0
--
-- NO es necesario crear seeds adicionales para user_stats
-- ni user_ranks, se crean automáticamente.
-- =====================================================

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v1.0 (2025-11-19): Primera versión
--   - 13 perfiles reales migrados desde servidor producción
--   - Profile IDs y Tenant IDs originales preservados
--   - Información básica completa (nombres)
--   - Preferences por defecto para estudiantes
--   - Inicialización automática de gamificación vía trigger
-- =====================================================
