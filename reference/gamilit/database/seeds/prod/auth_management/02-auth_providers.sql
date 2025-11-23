-- =====================================================
-- Seed: auth_management.auth_providers (PROD)
-- Description: Configuración de proveedores de autenticación para producción
-- Environment: PRODUCTION
-- Dependencies: None
-- Order: 02
-- Created: 2025-11-11
-- Version: 2.0 (reescrito para carga limpia)
-- =====================================================
--
-- CAMBIOS v2.0:
-- - Convertido de STRING a ENUM auth_provider
-- - Estructura alineada 100% con DDL
-- - Cambiado NOW() → gamilit.now_mexico()
-- - Configuración de producción (credentials pendientes)
--
-- VALIDADO CONTRA:
-- - DDL: ddl/schemas/auth_management/tables/05-auth_providers.sql
-- - Template: seeds/dev/auth_management/02-auth_providers.sql
--
-- IMPORTANTE:
-- - Los client_id y client_secret deben ser configurados con valores reales
-- - Los valores actuales son PLACEHOLDERS que deben ser reemplazados
-- - En producción, considerar usar variables de entorno o secretos encriptados
--
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Auth Providers Configuration (PRODUCTION)
-- =====================================================

INSERT INTO auth_management.auth_providers (
    provider_name,
    display_name,
    is_enabled,
    client_id,
    client_secret,
    authorization_url,
    token_url,
    user_info_url,
    scope,
    redirect_uri,
    icon_url,
    button_color,
    priority,
    config,
    metadata
) VALUES
-- Local Auth (email/password) - ENABLED
(
    'local'::auth_management.auth_provider,
    'Email y Contraseña',
    true,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '#4F46E5',
    1,
    jsonb_build_object(
        'requires_email_verification', true,  -- PROD: email verification required
        'password_min_length', 12,            -- PROD: stronger password (12 vs 8)
        'password_requires_uppercase', true,
        'password_requires_number', true,
        'password_requires_special', true,
        'password_max_age_days', 90,          -- PROD: password expiration
        'failed_login_attempts_max', 5,       -- PROD: rate limiting
        'account_lockout_duration_minutes', 30
    ),
    jsonb_build_object(
        'description', 'Local authentication using email and password',
        'environment', 'production',
        'security_level', 'high'
    )
),
-- Google OAuth - ENABLED
(
    'google'::auth_management.auth_provider,
    'Continuar con Google',
    true,
    'GOOGLE_CLIENT_ID_PLACEHOLDER',  -- ⚠️ REEMPLAZAR con valor real
    'GOOGLE_CLIENT_SECRET_PLACEHOLDER',  -- ⚠️ REEMPLAZAR con valor real
    'https://accounts.google.com/o/oauth2/v2/auth',
    'https://oauth2.googleapis.com/token',
    'https://www.googleapis.com/oauth2/v2/userinfo',
    ARRAY['openid', 'profile', 'email'],
    'https://gamilit.com/auth/callback/google',
    'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
    '#4285F4',
    10,
    jsonb_build_object(
        'prompt', 'select_account',
        'access_type', 'offline',
        'include_granted_scopes', true
    ),
    jsonb_build_object(
        'description', 'Google OAuth authentication for production',
        'environment', 'production',
        'status', 'credentials_pending'
    )
),
-- Facebook OAuth - DISABLED (pending configuration)
(
    'facebook'::auth_management.auth_provider,
    'Continuar con Facebook',
    false,  -- DISABLED hasta configurar credentials
    NULL,
    NULL,
    'https://www.facebook.com/v12.0/dialog/oauth',
    'https://graph.facebook.com/v12.0/oauth/access_token',
    'https://graph.facebook.com/me',
    ARRAY['email', 'public_profile'],
    NULL,
    'https://www.facebook.com/images/fb_icon_325x325.png',
    '#1877F2',
    20,
    jsonb_build_object(
        'fields', 'id,name,email,picture'
    ),
    jsonb_build_object(
        'description', 'Facebook OAuth authentication (disabled - pending configuration)',
        'environment', 'production',
        'status', 'pending_configuration'
    )
),
-- Apple Sign In - DISABLED (pending configuration)
(
    'apple'::auth_management.auth_provider,
    'Continuar con Apple',
    false,  -- DISABLED hasta configurar credentials
    NULL,
    NULL,
    'https://appleid.apple.com/auth/authorize',
    'https://appleid.apple.com/auth/token',
    NULL,
    ARRAY['name', 'email'],
    NULL,
    'https://appleid.cdn-apple.com/appleid/button',
    '#000000',
    15,
    jsonb_build_object(
        'response_mode', 'form_post',
        'response_type', 'code id_token'
    ),
    jsonb_build_object(
        'description', 'Apple Sign In (disabled - pending configuration)',
        'environment', 'production',
        'status', 'pending_configuration'
    )
),
-- Microsoft OAuth - DISABLED (pending configuration)
(
    'microsoft'::auth_management.auth_provider,
    'Continuar con Microsoft',
    false,  -- DISABLED hasta configurar credentials
    NULL,
    NULL,
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    'https://graph.microsoft.com/v1.0/me',
    ARRAY['openid', 'profile', 'email', 'User.Read'],
    NULL,
    'https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png',
    '#00A4EF',
    30,
    jsonb_build_object(
        'tenant', 'common'
    ),
    jsonb_build_object(
        'description', 'Microsoft OAuth authentication (disabled - pending configuration)',
        'environment', 'production',
        'status', 'pending_configuration'
    )
),
-- GitHub OAuth - DISABLED (not needed in production)
(
    'github'::auth_management.auth_provider,
    'Continuar con GitHub',
    false,  -- DISABLED in production (developer-focused)
    NULL,
    NULL,
    'https://github.com/login/oauth/authorize',
    'https://github.com/login/oauth/access_token',
    'https://api.github.com/user',
    ARRAY['user:email', 'read:user'],
    NULL,
    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    '#24292e',
    40,
    jsonb_build_object(
        'allow_signup', 'true'
    ),
    jsonb_build_object(
        'description', 'GitHub OAuth authentication (disabled in production - developer use only)',
        'environment', 'production',
        'status', 'not_needed'
    )
)
ON CONFLICT (provider_name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    is_enabled = EXCLUDED.is_enabled,
    client_id = EXCLUDED.client_id,
    client_secret = EXCLUDED.client_secret,
    authorization_url = EXCLUDED.authorization_url,
    token_url = EXCLUDED.token_url,
    user_info_url = EXCLUDED.user_info_url,
    scope = EXCLUDED.scope,
    redirect_uri = EXCLUDED.redirect_uri,
    icon_url = EXCLUDED.icon_url,
    button_color = EXCLUDED.button_color,
    priority = EXCLUDED.priority,
    config = EXCLUDED.config,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    provider_count INTEGER;
    enabled_count INTEGER;
    pending_credentials_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO provider_count FROM auth_management.auth_providers;
    SELECT COUNT(*) INTO enabled_count FROM auth_management.auth_providers WHERE is_enabled = true;
    SELECT COUNT(*) INTO pending_credentials_count
    FROM auth_management.auth_providers
    WHERE metadata->>'status' = 'credentials_pending';

    RAISE NOTICE '✓ Auth providers insertados: % total', provider_count;
    RAISE NOTICE '  - Habilitados: %', enabled_count;
    RAISE NOTICE '  - Pendientes de credenciales: %', pending_credentials_count;

    IF pending_credentials_count > 0 THEN
        RAISE WARNING '⚠ IMPORTANTE: % proveedores tienen credenciales PLACEHOLDER que deben ser configuradas', pending_credentials_count;
        RAISE WARNING '  Actualizar client_id y client_secret para Google OAuth antes de habilitar en producción';
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
            'id', 'provider_name', 'display_name', 'is_enabled',
            'client_id', 'client_secret', 'authorization_url', 'token_url',
            'user_info_url', 'scope', 'redirect_uri', 'icon_url',
            'button_color', 'priority', 'config', 'metadata',
            'created_at', 'updated_at'
        ]) AS column_name
    ) expected
    WHERE column_name NOT IN (
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'auth_management'
          AND table_name = 'auth_providers'
    );

    IF missing_columns IS NOT NULL THEN
        RAISE WARNING '⚠ Columnas faltantes en tabla auth_providers: %', missing_columns;
    ELSE
        RAISE NOTICE '✓ Todas las columnas del seed están presentes en la tabla';
    END IF;
END $$;
