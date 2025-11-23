-- =====================================================
-- Seed: auth_management.tenants - Production User Tenants
-- Description: Tenants para usuarios reales registrados en producción
-- Environment: PRODUCTION
-- Dependencies: auth_management/01-tenants.sql
-- Order: 02
-- Created: 2025-11-19
-- Version: 1.0 (Migrados desde servidor producción)
-- =====================================================
--
-- TENANTS DE USUARIOS REALES REGISTRADOS (13):
-- Cada usuario de producción tiene su propio tenant personal
-- creado automáticamente durante el registro
--
-- TOTAL: 13 tenants personales
--
-- POLÍTICA DE CARGA LIMPIA:
-- ✅ Tenant IDs originales del servidor preservados
-- ✅ Configuración base para usuarios estudiantes
-- ✅ Subscription tier 'free' por defecto
--
-- IMPORTANTE: Estos son tenants personales de estudiantes.
-- Son diferentes al tenant principal de la plataforma.
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Production User Tenants (13 tenants)
-- =====================================================

INSERT INTO auth_management.tenants (
    id,
    name,
    slug,
    domain,
    logo_url,
    subscription_tier,
    max_users,
    max_storage_gb,
    is_active,
    trial_ends_at,
    settings,
    metadata,
    created_at,
    updated_at
) VALUES

-- Tenant 1: Jose Aguirre
(
    'a2019d2c-1abe-4b92-8033-372a2a553f76'::uuid,
    'Jose Aguirre',
    'jose-aguirre',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'joseal.guirre34@gmail.com'),
    '2025-11-18 07:29:05.229254+00'::timestamptz,
    '2025-11-18 07:29:05.229254+00'::timestamptz
),

-- Tenant 2: Sergio Jimenez
(
    '6490930a-c572-4464-82f7-19d688f32877'::uuid,
    'Sergio Jimenez',
    'sergio-jimenez',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'sergiojimenezesteban63@gmail.com'),
    '2025-11-18 08:17:40.928077+00'::timestamptz,
    '2025-11-18 08:17:40.928077+00'::timestamptz
),

-- Tenant 3: Hugo Gomez
(
    '4abd1886-6d7e-42c9-a2a5-f7a9e01973bd'::uuid,
    'Hugo Gomez',
    'hugo-gomez',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'Gomezfornite92@gmail.com'),
    '2025-11-18 08:18:04.242047+00'::timestamptz,
    '2025-11-18 08:18:04.242047+00'::timestamptz
),

-- Tenant 4: Hugo Aragón
(
    'c77ba4cc-be06-4ed8-8e48-4bbc72d59f16'::uuid,
    'Hugo Aragón',
    'hugo-aragon',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'Aragon494gt54@icloud.com'),
    '2025-11-18 08:20:17.230714+00'::timestamptz,
    '2025-11-18 08:20:17.230714+00'::timestamptz
),

-- Tenant 5: Azul Valentina
(
    'e2b08195-5a20-4822-a9b6-8d2e04c785b3'::uuid,
    'Azul Valentina',
    'azul-valentina',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'blu3wt7@gmail.com'),
    '2025-11-18 08:32:17.315932+00'::timestamptz,
    '2025-11-18 08:32:17.315932+00'::timestamptz
),

-- Tenant 6: Ricardo Lugo
(
    '5f4dd29b-0317-4d96-8540-4e9417175525'::uuid,
    'Ricardo Lugo',
    'ricardo-lugo',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'ricardolugo786@icloud.com'),
    '2025-11-18 10:15:06.481498+00'::timestamptz,
    '2025-11-18 10:15:06.481498+00'::timestamptz
),

-- Tenant 7: Carlos Marban
(
    '87b8dc94-da11-451d-a53b-31c00a6973b8'::uuid,
    'Carlos Marban',
    'carlos-marban',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'marbancarlos916@gmail.com'),
    '2025-11-18 10:29:05.240413+00'::timestamptz,
    '2025-11-18 10:29:05.240413+00'::timestamptz
),

-- Tenant 8: Diego Colores
(
    '331b5931-1125-482f-9535-f1e0e829edd5'::uuid,
    'Diego Colores',
    'diego-colores',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'diego.colores09@gmail.com'),
    '2025-11-18 10:29:20.531883+00'::timestamptz,
    '2025-11-18 10:29:20.531883+00'::timestamptz
),

-- Tenant 9: Benjamin Hernandez
(
    '2f1c69b9-2da7-4b72-a6fd-477aa96ba075'::uuid,
    'Benjamin Hernandez',
    'benjamin-hernandez',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'hernandezfonsecabenjamin7@gmail.com'),
    '2025-11-18 10:37:06.9215+00'::timestamptz,
    '2025-11-18 10:37:06.9215+00'::timestamptz
),

-- Tenant 10: Josue Reyes
(
    '7265b54e-a988-4c50-a62c-61cb0594f556'::uuid,
    'Josue Reyes',
    'josue-reyes',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'jr7794315@gmail.com'),
    '2025-11-18 17:53:39.681271+00'::timestamptz,
    '2025-11-18 17:53:39.681271+00'::timestamptz
),

-- Tenant 11: Fernando Barragan
(
    'dcc49202-4d26-4b09-9bdb-8f71d039f328'::uuid,
    'Fernando Barragan',
    'fernando-barragan',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'barraganfer03@gmail.com'),
    '2025-11-18 20:39:27.410436+00'::timestamptz,
    '2025-11-18 20:39:27.410436+00'::timestamptz
),

-- Tenant 12: Marco Antonio Roman
(
    'bfc0fac3-8905-4514-af32-7375e242e0f5'::uuid,
    'Marco Antonio Roman',
    'marco-roman',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'roman.rebollar.marcoantonio1008@gmail.com'),
    '2025-11-18 21:03:17.328254+00'::timestamptz,
    '2025-11-18 21:03:17.328254+00'::timestamptz
),

-- Tenant 13: Rodrigo Guerrero
(
    'c4856507-807f-4fc5-9689-ffeb0feb4825'::uuid,
    'Rodrigo Guerrero',
    'rodrigo-guerrero',
    NULL,
    NULL,
    'free',
    1,
    1,
    true,
    NULL,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City'
    ),
    jsonb_build_object('personal_tenant', true, 'user_email', 'rodrigoguerrero0914@gmail.com'),
    '2025-11-18 21:20:52.304488+00'::timestamptz,
    '2025-11-18 21:20:52.304488+00'::timestamptz
)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = EXCLUDED.updated_at;

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    production_tenant_count INTEGER;
    total_tenant_count INTEGER;
BEGIN
    -- Contar tenants personales de producción
    SELECT COUNT(*) INTO production_tenant_count
    FROM auth_management.tenants
    WHERE metadata->>'personal_tenant' = 'true';

    -- Contar todos los tenants
    SELECT COUNT(*) INTO total_tenant_count
    FROM auth_management.tenants;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'TENANTS DE PRODUCCIÓN CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tenants personales: %', production_tenant_count;
    RAISE NOTICE 'Total tenants (incluyendo principal): %', total_tenant_count;
    RAISE NOTICE '========================================';

    IF production_tenant_count = 13 THEN
        RAISE NOTICE '✓ Los 13 tenants personales fueron creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban 13 tenants personales, se crearon %', production_tenant_count;
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v1.0 (2025-11-19): Primera versión
--   - 13 tenants personales migrados desde servidor producción
--   - Tenant IDs originales preservados
--   - Configuración base para estudiantes
--   - Subscription tier 'free' por defecto
-- =====================================================
