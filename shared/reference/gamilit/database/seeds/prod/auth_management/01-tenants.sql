-- =====================================================
-- Seed: auth_management.tenants (PROD)
-- Description: Tenant principal de producción
-- Environment: PRODUCTION
-- Dependencies: None
-- Order: 01
-- Created: 2025-11-11
-- Version: 2.0 (reescrito para carga limpia)
-- =====================================================
--
-- CAMBIOS v2.0:
-- - Convertido de STRING a UUID
-- - Agregada columna 'slug' (requerida NOT NULL)
-- - Agregadas 7 columnas faltantes del schema
-- - Cambiado NOW() → gamilit.now_mexico()
-- - Estructura alineada 100% con DDL
--
-- VALIDADO CONTRA:
-- - DDL: ddl/schemas/auth_management/tables/01-tenants.sql
-- - Template: seeds/dev/auth_management/01-tenants.sql
--
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Tenant Principal de Producción
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
) VALUES (
    -- UUID real en lugar de STRING
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'GAMILIT Platform',
    'gamilit-prod',  -- NUEVO: slug requerido NOT NULL
    'gamilit.com',
    '/assets/logo-gamilit.png',  -- NUEVO: logo_url
    'enterprise',  -- NUEVO: subscription_tier
    10000,  -- NUEVO: max_users
    100,  -- NUEVO: max_storage_gb
    true,  -- NUEVO: is_active
    NULL,  -- NUEVO: trial_ends_at (sin trial en producción)
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'features', jsonb_build_object(
            'analytics_enabled', true,
            'gamification_enabled', true,
            'social_features_enabled', true,
            'assessments', true,
            'progress_tracking', true
        ),
        'limits', jsonb_build_object(
            'daily_api_calls', 100000,
            'storage_gb', 100,
            'max_file_size_mb', 50
        ),
        'contact', jsonb_build_object(
            'support_email', 'soporte@gamilit.com',
            'admin_email', 'admin@gamilit.com'
        ),
        'branding', jsonb_build_object(
            'logo_url', '/assets/logo-gamilit.png',
            'primary_color', '#4F46E5',
            'secondary_color', '#10B981'
        )
    ),
    jsonb_build_object(  -- NUEVO: metadata
        'description', 'Tenant principal de producción',
        'environment', 'production',
        'created_by', 'seed_script_v2',
        'version', '2.0'
    ),
    gamilit.now_mexico(),  -- CORREGIDO: gamilit.now_mexico() en lugar de NOW()
    gamilit.now_mexico()   -- CORREGIDO: gamilit.now_mexico() en lugar de NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    domain = EXCLUDED.domain,
    logo_url = EXCLUDED.logo_url,
    subscription_tier = EXCLUDED.subscription_tier,
    max_users = EXCLUDED.max_users,
    max_storage_gb = EXCLUDED.max_storage_gb,
    is_active = EXCLUDED.is_active,
    trial_ends_at = EXCLUDED.trial_ends_at,
    settings = EXCLUDED.settings,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    tenant_count INTEGER;
    tenant_name TEXT;
    tenant_slug TEXT;
BEGIN
    SELECT COUNT(*), MAX(name), MAX(slug)
    INTO tenant_count, tenant_name, tenant_slug
    FROM auth_management.tenants
    WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;

    IF tenant_count = 1 THEN
        RAISE NOTICE '✓ Tenant de producción creado correctamente';
        RAISE NOTICE '  ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        RAISE NOTICE '  Name: %', tenant_name;
        RAISE NOTICE '  Slug: %', tenant_slug;
    ELSE
        RAISE WARNING '⚠ Tenant de producción NO fue creado';
    END IF;
END $$;

-- =====================================================
-- Validación de Estructura
-- =====================================================

-- Verificar que todas las columnas existan
DO $$
DECLARE
    missing_columns TEXT[];
BEGIN
    SELECT ARRAY_AGG(column_name) INTO missing_columns
    FROM (
        SELECT unnest(ARRAY[
            'id', 'name', 'slug', 'domain', 'logo_url',
            'subscription_tier', 'max_users', 'max_storage_gb',
            'is_active', 'trial_ends_at', 'settings', 'metadata',
            'created_at', 'updated_at'
        ]) AS column_name
    ) expected
    WHERE column_name NOT IN (
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'auth_management'
          AND table_name = 'tenants'
    );

    IF missing_columns IS NOT NULL THEN
        RAISE WARNING '⚠ Columnas faltantes en tabla tenants: %', missing_columns;
    ELSE
        RAISE NOTICE '✓ Todas las columnas del seed están presentes en la tabla';
    END IF;
END $$;
