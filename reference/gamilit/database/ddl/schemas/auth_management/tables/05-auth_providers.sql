-- =====================================================
-- Table: auth_management.auth_providers
-- Description: Configuración de proveedores de autenticación OAuth/Social (Google, Facebook, Apple, etc.)
-- Dependencies: None (tabla de configuración independiente)
-- Created: 2025-11-02
-- =====================================================

SET search_path TO auth_management, public;

DROP TABLE IF EXISTS auth_management.auth_providers CASCADE;

-- ENUM auth_provider is defined in apps/database/ddl/00-prerequisites.sql
-- Values: 'local', 'google', 'facebook', 'apple', 'microsoft', 'github'

CREATE TABLE auth_management.auth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_name auth_provider NOT NULL,
    display_name text NOT NULL,
    is_enabled boolean DEFAULT false,
    client_id text,
    client_secret text,
    authorization_url text,
    token_url text,
    user_info_url text,
    scope text[],
    redirect_uri text,
    icon_url text,
    button_color text,
    priority integer DEFAULT 100,
    config jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),

    -- Primary Key
    CONSTRAINT auth_providers_pkey PRIMARY KEY (id),

    -- Unique Constraints
    CONSTRAINT auth_providers_provider_name_key UNIQUE (provider_name),

    -- Check Constraints
    CONSTRAINT auth_providers_priority_check CHECK ((priority >= 0))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auth_providers_enabled ON auth_management.auth_providers(is_enabled) WHERE is_enabled = true;
CREATE INDEX IF NOT EXISTS idx_auth_providers_priority ON auth_management.auth_providers(priority) WHERE is_enabled = true;
CREATE INDEX IF NOT EXISTS idx_auth_providers_config_gin ON auth_management.auth_providers USING gin (config);

-- Triggers
CREATE TRIGGER trg_auth_providers_updated_at
    BEFORE UPDATE ON auth_management.auth_providers
    FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comments
COMMENT ON TABLE auth_management.auth_providers IS 'Configuración de proveedores de autenticación OAuth/Social (Google, Facebook, Apple, Microsoft, GitHub)';
COMMENT ON COLUMN auth_management.auth_providers.provider_name IS 'Nombre del proveedor: local, google, facebook, apple, microsoft, github';
COMMENT ON COLUMN auth_management.auth_providers.is_enabled IS 'Indica si el proveedor está activo y disponible para autenticación';
COMMENT ON COLUMN auth_management.auth_providers.client_id IS 'OAuth Client ID proporcionado por el proveedor';
COMMENT ON COLUMN auth_management.auth_providers.client_secret IS 'OAuth Client Secret (debe ser encriptado en producción)';
COMMENT ON COLUMN auth_management.auth_providers.scope IS 'Scopes OAuth solicitados al proveedor (ej: profile, email, openid)';
COMMENT ON COLUMN auth_management.auth_providers.priority IS 'Orden de visualización en UI (menor = mayor prioridad)';
COMMENT ON COLUMN auth_management.auth_providers.config IS 'Configuración adicional específica del proveedor en formato JSON';

-- Permissions
ALTER TABLE auth_management.auth_providers OWNER TO gamilit_user;
GRANT SELECT ON TABLE auth_management.auth_providers TO gamilit_user;
GRANT ALL ON TABLE auth_management.auth_providers TO gamilit_user;

-- =====================================================
-- Seed Data: Configuración inicial de proveedores
-- =====================================================

INSERT INTO auth_management.auth_providers (
    provider_name,
    display_name,
    is_enabled,
    authorization_url,
    token_url,
    user_info_url,
    scope,
    icon_url,
    button_color,
    priority,
    config
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
    '#4F46E5',
    1,
    '{"requires_email_verification": false, "password_min_length": 8}'::jsonb
),
-- Google OAuth
(
    'google',
    'Continuar con Google',
    false,
    'https://accounts.google.com/o/oauth2/v2/auth',
    'https://oauth2.googleapis.com/token',
    'https://www.googleapis.com/oauth2/v2/userinfo',
    ARRAY['openid', 'profile', 'email'],
    'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
    '#4285F4',
    10,
    '{"prompt": "select_account", "access_type": "offline"}'::jsonb
),
-- Facebook OAuth
(
    'facebook',
    'Continuar con Facebook',
    false,
    'https://www.facebook.com/v12.0/dialog/oauth',
    'https://graph.facebook.com/v12.0/oauth/access_token',
    'https://graph.facebook.com/me',
    ARRAY['email', 'public_profile'],
    'https://www.facebook.com/images/fb_icon_325x325.png',
    '#1877F2',
    20,
    '{"fields": "id,name,email,picture"}'::jsonb
),
-- Apple Sign In
(
    'apple',
    'Continuar con Apple',
    false,
    'https://appleid.apple.com/auth/authorize',
    'https://appleid.apple.com/auth/token',
    NULL,
    ARRAY['name', 'email'],
    'https://appleid.cdn-apple.com/appleid/button',
    '#000000',
    15,
    '{"response_mode": "form_post", "response_type": "code id_token"}'::jsonb
),
-- Microsoft OAuth
(
    'microsoft',
    'Continuar con Microsoft',
    false,
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    'https://graph.microsoft.com/v1.0/me',
    ARRAY['openid', 'profile', 'email', 'User.Read'],
    'https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png',
    '#00A4EF',
    30,
    '{"tenant": "common"}'::jsonb
),
-- GitHub OAuth
(
    'github',
    'Continuar con GitHub',
    false,
    'https://github.com/login/oauth/authorize',
    'https://github.com/login/oauth/access_token',
    'https://api.github.com/user',
    ARRAY['user:email', 'read:user'],
    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    '#24292e',
    40,
    '{"allow_signup": "true"}'::jsonb
)
ON CONFLICT (provider_name) DO NOTHING;
