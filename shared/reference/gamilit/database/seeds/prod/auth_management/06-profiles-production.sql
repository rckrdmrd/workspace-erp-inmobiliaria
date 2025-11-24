-- =====================================================
-- Seed: auth_management.profiles - Production Users (CORREGIDO)
-- Description: Perfiles CORREGIDOS para usuarios reales registrados en producción
-- Environment: PRODUCTION
-- Dependencies: auth/02-production-users.sql, auth_management/01-tenants.sql
-- Order: 06
-- Created: 2025-11-19
-- Version: 2.0 (CORRECCIÓN: profiles.id = auth.users.id)
-- =====================================================
--
-- CORRECCIONES APLICADAS:
-- ❌ ANTES: profiles.id generado con gen_random_uuid() (diferente de auth.users.id)
-- ✅ AHORA: profiles.id = auth.users.id (consistente con seeds de testing)
--
-- ❌ ANTES: tenant_id apuntaba a tenants personales
-- ✅ AHORA: tenant_id apunta al tenant principal (GAMILIT Platform)
--
-- JUSTIFICACIÓN:
-- 1. Todos los usuarios de testing tienen profiles.id = auth.users.id
-- 2. Backend busca user_stats con profiles.id, pero user_stats usa auth.users.id
-- 3. Resultado: Error 404 al enviar respuestas de ejercicios
-- 4. Solución: Unificar IDs (1 usuario = 1 ID único)
--
-- IMPACTO:
-- - ✅ Usuarios de producción funcionan igual que usuarios de testing
-- - ✅ No más errores 404 al enviar respuestas
-- - ✅ Gamificación funciona correctamente
-- - ✅ Trigger initialize_user_stats() usa el ID correcto
--
-- TOTAL: 13 perfiles de estudiantes (CORREGIDOS)
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Production User Profiles (13 perfiles CORREGIDOS)
-- =====================================================

INSERT INTO auth_management.profiles (
    id,                   -- ✅ AHORA: auth.users.id (NO gen_random_uuid())
    tenant_id,            -- ✅ AHORA: Tenant principal (NO personal)
    user_id,              -- ✅ auth.users.id (sin cambios)
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
-- PROFILE 1: Jose Aguirre (CORREGIDO)
-- =====================================================
(
    'b017b792-b327-40dd-aefb-a80312776952'::uuid,  -- ✅ id = user_id (auth.users.id)
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,  -- ✅ Tenant principal
    'b017b792-b327-40dd-aefb-a80312776952'::uuid,  -- user_id
    'joseal.guirre34@gmail.com',
    'Jose Aguirre',
    'Jose Aguirre',
    'Jose',
    'Aguirre',
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
    '2025-11-18 07:29:05.229254+00'::timestamptz,
    '2025-11-18 07:29:05.229254+00'::timestamptz
),

-- =====================================================
-- PROFILE 2: Sergio Jimenez (CORREGIDO)
-- =====================================================
(
    '06a24962-e83d-4e94-aad7-ff69f20a9119'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 3: Hugo Gomez (CORREGIDO)
-- =====================================================
(
    '24e8c563-8854-43d1-b3c9-2f83e91f5a1e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 4: Hugo Aragón (CORREGIDO)
-- =====================================================
(
    'bf0d3e34-e077-43d1-9626-292f7fae2bd6'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 5: Azul Valentina (CORREGIDO)
-- =====================================================
(
    '2f5a9846-3393-40b2-9e87-0f29238c383f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 6: Ricardo Lugo (CORREGIDO)
-- =====================================================
(
    '5e738038-1743-4aa9-b222-30171300ea9d'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 7: Carlos Marban (CORREGIDO)
-- =====================================================
(
    '00c742d9-e5f7-4666-9597-5a8ca54d5478'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 8: Diego Colores (CORREGIDO)
-- =====================================================
(
    '33306a65-a3b1-41d5-a49d-47989957b822'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 9: Benjamin Hernandez (CORREGIDO)
-- =====================================================
(
    '7a6a973e-83f7-4374-a9fc-54258138115f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 10: Josue Reyes (CORREGIDO)
-- =====================================================
(
    'ccd7135c-0fea-4488-9094-9da52df1c98c'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 11: Fernando Barragan (CORREGIDO)
-- =====================================================
(
    '9951ad75-e9cb-47b3-b478-6bb860ee2530'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 12: Marco Antonio Roman (CORREGIDO)
-- =====================================================
(
    '735235f5-260a-4c9b-913c-14a1efd083ea'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
-- PROFILE 13: Rodrigo Guerrero (CORREGIDO)
-- =====================================================
(
    'ebe48628-5e44-4562-97b7-b4950b216247'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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
    tenant_id = EXCLUDED.tenant_id,      -- ✅ Actualizar tenant al principal
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
    corrected_ids_count INTEGER;
    corrected_tenants_count INTEGER;
BEGIN
    -- Contar perfiles de producción
    SELECT COUNT(*) INTO production_profile_count
    FROM auth_management.profiles
    WHERE email NOT LIKE '%@gamilit.com';

    -- Contar perfiles con IDs corregidos (id = user_id)
    SELECT COUNT(*) INTO corrected_ids_count
    FROM auth_management.profiles
    WHERE email NOT LIKE '%@gamilit.com'
      AND id = user_id;

    -- Contar perfiles con tenant principal
    SELECT COUNT(*) INTO corrected_tenants_count
    FROM auth_management.profiles
    WHERE email NOT LIKE '%@gamilit.com'
      AND tenant_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'PERFILES DE PRODUCCIÓN (CORREGIDOS)';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total perfiles de producción: %', production_profile_count;
    RAISE NOTICE 'Perfiles con profiles.id = auth.users.id: %', corrected_ids_count;
    RAISE NOTICE 'Perfiles con tenant principal: %', corrected_tenants_count;
    RAISE NOTICE '========================================';

    IF production_profile_count = 13 AND corrected_ids_count = 13 AND corrected_tenants_count = 13 THEN
        RAISE NOTICE '✅ Los 13 perfiles de producción fueron CORREGIDOS correctamente';
        RAISE NOTICE '✅ profiles.id = auth.users.id para TODOS los usuarios';
        RAISE NOTICE '✅ tenant_id = GAMILIT Platform para TODOS los usuarios';
    ELSE
        RAISE WARNING '⚠ Corrección incompleta:';
        RAISE WARNING '  - Esperados: 13 perfiles';
        RAISE WARNING '  - IDs corregidos: %', corrected_ids_count;
        RAISE WARNING '  - Tenants corregidos: %', corrected_tenants_count;
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v2.0 (2025-11-19): Corrección de IDs y tenants
--   - ✅ profiles.id = auth.users.id (era diferente)
--   - ✅ tenant_id = Tenant principal (era personal)
--   - ✅ Consistente con usuarios de testing
--   - ✅ Elimina error 404 al enviar respuestas
--
-- v1.0 (2025-11-19): Primera versión (DEPRECADA)
--   - ❌ profiles.id generado con gen_random_uuid()
--   - ❌ tenant_id apuntaba a tenants personales
-- =====================================================
