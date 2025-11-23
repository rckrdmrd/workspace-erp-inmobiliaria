-- =====================================================
-- Seed: auth_management.auth_providers (DEV)
-- Description: Configuración de proveedores de autenticación
-- Environment: DEVELOPMENT
-- Dependencies: None
-- Order: 02
-- Validated: 2025-11-02
-- Score: 100/100
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Auth Providers Configuration
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
-- Local Auth (email/password)
(
    'local',
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
    '{
        "requires_email_verification": false,
        "password_min_length": 8,
        "password_requires_uppercase": true,
        "password_requires_number": true,
        "password_requires_special": true
    }'::jsonb,
    '{
        "description": "Local authentication using email and password",
        "environment": "development"
    }'::jsonb
),
-- Google OAuth (ENABLED for dev)
(
    'google',
    'Continuar con Google',
    true,
    'dev-google-client-id.apps.googleusercontent.com',
    'dev-google-client-secret',
    'https://accounts.google.com/o/oauth2/v2/auth',
    'https://oauth2.googleapis.com/token',
    'https://www.googleapis.com/oauth2/v2/userinfo',
    ARRAY['openid', 'profile', 'email'],
    'http://localhost:3000/auth/callback/google',
    'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
    '#4285F4',
    10,
    '{
        "prompt": "select_account",
        "access_type": "offline"
    }'::jsonb,
    '{
        "description": "Google OAuth authentication for development",
        "environment": "development"
    }'::jsonb
),
-- Facebook OAuth (DISABLED for dev)
(
    'facebook',
    'Continuar con Facebook',
    false,
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
    '{
        "fields": "id,name,email,picture"
    }'::jsonb,
    '{
        "description": "Facebook OAuth authentication (disabled in development)",
        "environment": "development"
    }'::jsonb
),
-- Apple Sign In (DISABLED for dev)
(
    'apple',
    'Continuar con Apple',
    false,
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
    '{
        "response_mode": "form_post",
        "response_type": "code id_token"
    }'::jsonb,
    '{
        "description": "Apple Sign In (disabled in development)",
        "environment": "development"
    }'::jsonb
),
-- Microsoft OAuth (DISABLED for dev)
(
    'microsoft',
    'Continuar con Microsoft',
    false,
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
    '{
        "tenant": "common"
    }'::jsonb,
    '{
        "description": "Microsoft OAuth authentication (disabled in development)",
        "environment": "development"
    }'::jsonb
),
-- GitHub OAuth (ENABLED for dev)
(
    'github',
    'Continuar con GitHub',
    true,
    'dev-github-client-id',
    'dev-github-client-secret',
    'https://github.com/login/oauth/authorize',
    'https://github.com/login/oauth/access_token',
    'https://api.github.com/user',
    ARRAY['user:email', 'read:user'],
    'http://localhost:3000/auth/callback/github',
    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    '#24292e',
    40,
    '{
        "allow_signup": "true"
    }'::jsonb,
    '{
        "description": "GitHub OAuth authentication for development",
        "environment": "development"
    }'::jsonb
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
BEGIN
    SELECT COUNT(*) INTO provider_count FROM auth_management.auth_providers;
    SELECT COUNT(*) INTO enabled_count FROM auth_management.auth_providers WHERE is_enabled = true;
    RAISE NOTICE '✓ Auth providers insertados: % total (% habilitados)', provider_count, enabled_count;
END $$;
