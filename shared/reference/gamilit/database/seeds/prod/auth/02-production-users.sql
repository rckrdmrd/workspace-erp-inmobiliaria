-- =====================================================
-- Seed: auth.users - Production Registered Users
-- Description: Usuarios reales registrados en producción
-- Environment: PRODUCTION
-- Dependencies: 01-demo-users.sql
-- Order: 02
-- Created: 2025-11-19
-- Version: 1.0 (Migrados desde servidor producción)
-- =====================================================
--
-- USUARIOS REALES REGISTRADOS (13):
-- Usuarios que se registraron en el servidor de producción
-- durante 2025-11-18
--
-- TOTAL: 13 usuarios estudiantes
--
-- POLÍTICA DE CARGA LIMPIA:
-- ✅ UUIDs originales del servidor preservados
-- ✅ Passwords hasheados originales preservados
-- ✅ instance_id corregido a UUID válido
-- ✅ Metadata mínima agregada para compatibilidad
--
-- IMPORTANTE: Estos son usuarios reales de producción.
-- No modificar sus UUIDs ni passwords hasheados.
-- =====================================================

SET search_path TO auth, public;

-- =====================================================
-- INSERT: Production Registered Users (13 usuarios)
-- =====================================================

INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    confirmed_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at,
    gamilit_role,
    status
) VALUES

-- =====================================================
-- USUARIO 1: Jose Aguirre
-- =====================================================
(
    'b017b792-b327-40dd-aefb-a80312776952'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'joseal.guirre34@gmail.com',
    '$2b$10$kb9yCB4Y2WBr2.Gth.wC9e8q8bnkZJ6O2X6kFSn.O4VK8d76Cr/xO',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Jose',
        'last_name', 'Aguirre'
    ),
    false,
    '2025-11-18 07:29:05.226874+00'::timestamptz,
    '2025-11-18 07:29:05.226874+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 2: Sergio Jimenez
-- =====================================================
(
    '06a24962-e83d-4e94-aad7-ff69f20a9119'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'sergiojimenezesteban63@gmail.com',
    '$2b$10$8oPdKN15ndCqCOIt12SEO.2yx4D29kQEQGPCC5rtUYWu8Qp5L7/zW',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Sergio',
        'last_name', 'Jimenez'
    ),
    false,
    '2025-11-18 08:17:40.925857+00'::timestamptz,
    '2025-11-18 08:17:40.925857+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 3: Hugo Gomez
-- =====================================================
(
    '24e8c563-8854-43d1-b3c9-2f83e91f5a1e'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'Gomezfornite92@gmail.com',
    '$2b$10$FuEfoSA0jxvBI2f6odMJqux9Gpgvt7Zjk.plRhRatvK0ykkIXxbI.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Hugo',
        'last_name', 'Gomez'
    ),
    false,
    '2025-11-18 08:18:04.240276+00'::timestamptz,
    '2025-11-18 08:18:04.240276+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 4: Hugo Aragón
-- =====================================================
(
    'bf0d3e34-e077-43d1-9626-292f7fae2bd6'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'Aragon494gt54@icloud.com',
    '$2b$10$lE8M8qWUIsgYLwcHyRGvTOjxdykLVchRVifsMVqCRCZq3bEeXR.xG',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Hugo',
        'last_name', 'Aragón'
    ),
    false,
    '2025-11-18 08:20:17.228812+00'::timestamptz,
    '2025-11-18 08:20:17.228812+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 5: Azul Valentina
-- =====================================================
(
    '2f5a9846-3393-40b2-9e87-0f29238c383f'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'blu3wt7@gmail.com',
    '$2b$10$gKRXQ.rmOePqsNKWdxABQuyIZike2oSsYpdfWpQdi5HHDWDUk.3u2',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Azul',
        'last_name', 'Valentina'
    ),
    false,
    '2025-11-18 08:32:17.314233+00'::timestamptz,
    '2025-11-18 08:32:17.314233+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 6: Ricardo Lugo
-- =====================================================
(
    '5e738038-1743-4aa9-b222-30171300ea9d'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'ricardolugo786@icloud.com',
    '$2b$10$YV1StKIdCPPED/Ft84zR2ONxj/VzzV7zOxjgwMSbDpd2hzvYOGtby',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Ricardo',
        'last_name', 'Lugo'
    ),
    false,
    '2025-11-18 10:15:06.479774+00'::timestamptz,
    '2025-11-18 10:15:06.479774+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 7: Carlos Marban
-- =====================================================
(
    '00c742d9-e5f7-4666-9597-5a8ca54d5478'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'marbancarlos916@gmail.com',
    '$2b$10$PfsKOsEEXpGA6YB6eXNBPePo6OV6Am1glUN6Mkunl64bK/ji6uttW',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Carlos',
        'last_name', 'Marban'
    ),
    false,
    '2025-11-18 10:29:05.23842+00'::timestamptz,
    '2025-11-18 10:29:05.23842+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 8: Diego Colores
-- =====================================================
(
    '33306a65-a3b1-41d5-a49d-47989957b822'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'diego.colores09@gmail.com',
    '$2b$10$rFlH9alBbgPGVEZMYIV8p.AkeZ30yRCVd5acasFjIt7fpCZhE6RuO',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Diego',
        'last_name', 'Colores'
    ),
    false,
    '2025-11-18 10:29:20.530359+00'::timestamptz,
    '2025-11-18 10:29:20.530359+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 9: Benjamin Hernandez
-- =====================================================
(
    '7a6a973e-83f7-4374-a9fc-54258138115f'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'hernandezfonsecabenjamin7@gmail.com',
    '$2b$10$1E6gLqfMojNLYrSKIbatqOh0pHblZ3jWZwbcxTY/DCx7MGADToCVm',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Benjamin',
        'last_name', 'Hernandez'
    ),
    false,
    '2025-11-18 10:37:06.919813+00'::timestamptz,
    '2025-11-18 10:37:06.919813+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 10: Josue Reyes
-- =====================================================
(
    'ccd7135c-0fea-4488-9094-9da52df1c98c'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'jr7794315@gmail.com',
    '$2b$10$Ej/Gwx8mGCWg4TnQSjh1r.QZLw/GkUANqXmz4bEfVaNF9E527L02C',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Josue',
        'last_name', 'Reyes'
    ),
    false,
    '2025-11-18 17:53:39.67958+00'::timestamptz,
    '2025-11-18 17:53:39.67958+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 11: Fernando Barragan
-- =====================================================
(
    '9951ad75-e9cb-47b3-b478-6bb860ee2530'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'barraganfer03@gmail.com',
    '$2b$10$VJ8bS.ksyKpa7oG575r5YOWQYcq8vwmwTa8jMBkCv0dwskF04SHn2',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Fernando',
        'last_name', 'Barragan'
    ),
    false,
    '2025-11-18 20:39:27.408624+00'::timestamptz,
    '2025-11-18 20:39:27.408624+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 12: Marco Antonio Roman
-- =====================================================
(
    '735235f5-260a-4c9b-913c-14a1efd083ea'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'roman.rebollar.marcoantonio1008@gmail.com',
    '$2b$10$l4eF8UoOB7D8LKDEzTigXOUO7EABhVdYCqknJ/lD6R4p8uF1R4I.W',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Marco Antonio',
        'last_name', 'Roman'
    ),
    false,
    '2025-11-18 21:03:17.326679+00'::timestamptz,
    '2025-11-18 21:03:17.326679+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
),

-- =====================================================
-- USUARIO 13: Rodrigo Guerrero
-- =====================================================
(
    'ebe48628-5e44-4562-97b7-b4950b216247'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    NULL,
    'rodrigoguerrero0914@gmail.com',
    '$2b$10$ihoy7HbOdlqU38zAddpTOuDO7Nqa8.Cr1dEQjCgMpdb30UwCIMhGW',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    jsonb_build_object(
        'first_name', 'Rodrigo',
        'last_name', 'Guerrero'
    ),
    false,
    '2025-11-18 21:20:52.303128+00'::timestamptz,
    '2025-11-18 21:20:52.303128+00'::timestamptz,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status
)

ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = EXCLUDED.updated_at;

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    production_user_count INTEGER;
    total_user_count INTEGER;
BEGIN
    -- Contar usuarios de producción (excluyendo @gamilit.com)
    SELECT COUNT(*) INTO production_user_count
    FROM auth.users
    WHERE email NOT LIKE '%@gamilit.com';

    -- Contar todos los usuarios
    SELECT COUNT(*) INTO total_user_count
    FROM auth.users;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUARIOS DE PRODUCCIÓN REGISTRADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Usuarios de producción: %', production_user_count;
    RAISE NOTICE 'Total usuarios (incluyendo testing): %', total_user_count;
    RAISE NOTICE '========================================';

    IF production_user_count = 13 THEN
        RAISE NOTICE '✓ Los 13 usuarios de producción fueron creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 13 usuarios de producción, se crearon %', production_user_count;
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- IMPORTANTE: Profiles, Stats y Ranks
-- =====================================================
-- Los profiles, user_stats y user_ranks se crean
-- automáticamente mediante triggers cuando se crea
-- un usuario en auth.users.
--
-- Ver:
-- - auth_management.trg_after_user_insert_create_profile
-- - gamification_system.trg_after_profile_insert_create_stats
-- - gamification_system.trg_after_profile_insert_create_rank
-- =====================================================

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v1.0 (2025-11-19): Primera versión
--   - 13 usuarios reales migrados desde servidor producción
--   - Passwords hasheados originales preservados
--   - UUIDs originales preservados
--   - instance_id corregido a UUID válido
--   - Metadata mínima agregada
-- =====================================================
