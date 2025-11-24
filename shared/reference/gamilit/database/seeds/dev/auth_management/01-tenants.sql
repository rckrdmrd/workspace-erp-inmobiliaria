-- =====================================================
-- Seed: auth_management.tenants (DEV)
-- Description: Tenants de desarrollo para testing y demos
-- Environment: DEVELOPMENT
-- Dependencies: None
-- Order: 01
-- Validated: 2025-11-02
-- Score: 100/100
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Default Test Tenant
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
-- Tenant 1: Gamilit Test Organization
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Gamilit Test Organization',
    'gamilit-test',
    'test.gamilit.com',
    NULL,
    'enterprise',
    1000,
    100,
    true,
    NULL,
    '{
        "theme": "detective",
        "language": "es",
        "timezone": "America/Mexico_City",
        "features": {
            "analytics_enabled": true,
            "gamification_enabled": true,
            "social_features_enabled": true
        }
    }'::jsonb,
    '{
        "description": "Default tenant for test users",
        "environment": "development",
        "created_by": "seed_script"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Tenant 2: Demo School
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Demo School - Escuela Primaria',
    'demo-school-primary',
    'demo-primary.gamilit.com',
    NULL,
    'professional',
    500,
    50,
    true,
    (gamilit.now_mexico() + INTERVAL '90 days'),
    '{
        "theme": "detective",
        "language": "es",
        "timezone": "America/Mexico_City",
        "features": {
            "analytics_enabled": true,
            "gamification_enabled": true,
            "social_features_enabled": true
        }
    }'::jsonb,
    '{
        "description": "Demo tenant for primary school",
        "environment": "development",
        "school_level": "primary"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
-- Tenant 3: Demo School Secondary
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Demo School - Escuela Secundaria',
    'demo-school-secondary',
    'demo-secondary.gamilit.com',
    NULL,
    'basic',
    200,
    20,
    true,
    (gamilit.now_mexico() + INTERVAL '30 days'),
    '{
        "theme": "detective",
        "language": "es",
        "timezone": "America/Mexico_City",
        "features": {
            "analytics_enabled": true,
            "gamification_enabled": false,
            "social_features_enabled": true
        }
    }'::jsonb,
    '{
        "description": "Demo tenant for secondary school",
        "environment": "development",
        "school_level": "secondary"
    }'::jsonb,
    gamilit.now_mexico(),
    gamilit.now_mexico()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    domain = EXCLUDED.domain,
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
BEGIN
    SELECT COUNT(*) INTO tenant_count FROM auth_management.tenants;
    RAISE NOTICE '✓ Tenants insertados correctamente: % registros', tenant_count;
END $$;
