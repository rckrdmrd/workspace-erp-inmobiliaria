-- =====================================================================================
-- Tabla: lti_consumers
-- Descripción: Configuración de LMS externos (plataformas) que integran con Gamilit
--              vía LTI 1.3 (Learning Tools Interoperability)
-- Documentación: docs/03-fase-extensiones/EXT-007-lti-integration/
-- Epic: EXT-007
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS lti_integration.lti_consumers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificación LTI 1.3
    platform_id TEXT NOT NULL,              -- Issuer identifier (e.g., https://canvas.instructure.com)
    client_id TEXT NOT NULL,                -- OAuth2 client_id
    deployment_id TEXT,                     -- LTI deployment ID (opcional)

    -- Configuración OAuth 2.0 / OIDC
    public_keyset_url TEXT NOT NULL,        -- JWKS URL para validar tokens
    access_token_url TEXT NOT NULL,         -- Token endpoint
    authorization_url TEXT NOT NULL,        -- Authorization endpoint

    -- Metadata
    platform_name TEXT NOT NULL,            -- Nombre del LMS (e.g., "Canvas UAM")
    platform_version TEXT,                  -- Versión del LMS
    platform_contact_email TEXT,

    -- Configuración de tenant (multi-tenancy)
    tenant_id UUID REFERENCES auth_management.tenants(id) ON DELETE CASCADE,

    -- Configuración LTI Advantage
    supports_deep_linking BOOLEAN DEFAULT false,
    supports_nrps BOOLEAN DEFAULT false,    -- Names and Role Provisioning Services
    supports_ags BOOLEAN DEFAULT false,     -- Assignment and Grade Services

    -- Credenciales
    consumer_key TEXT,                      -- Para LTI 1.1 legacy (opcional)
    consumer_secret TEXT,                   -- Para LTI 1.1 legacy (opcional)

    -- Configuración adicional
    custom_parameters JSONB DEFAULT '{}',   -- Parámetros personalizados

    -- Estado
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,      -- Si está verificado por admin

    -- Auditoría
    created_by UUID REFERENCES auth_management.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT unique_platform_client UNIQUE(platform_id, client_id, deployment_id)
);

-- Índices
CREATE INDEX idx_lti_consumers_platform_id ON lti_integration.lti_consumers(platform_id);
CREATE INDEX idx_lti_consumers_client_id ON lti_integration.lti_consumers(client_id);
CREATE INDEX idx_lti_consumers_tenant_id ON lti_integration.lti_consumers(tenant_id);
CREATE INDEX idx_lti_consumers_active ON lti_integration.lti_consumers(is_active) WHERE is_active = true;

-- Trigger para updated_at
CREATE TRIGGER trg_lti_consumers_updated_at
    BEFORE UPDATE ON lti_integration.lti_consumers
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE lti_integration.lti_consumers IS 'Configuración de LMS externos (Canvas, Moodle, Blackboard) que integran con Gamilit vía LTI 1.3. Epic EXT-007.';
COMMENT ON COLUMN lti_integration.lti_consumers.platform_id IS 'Issuer identifier del LMS (e.g., https://canvas.instructure.com)';
COMMENT ON COLUMN lti_integration.lti_consumers.client_id IS 'OAuth2 client_id asignado por el LMS';
COMMENT ON COLUMN lti_integration.lti_consumers.deployment_id IS 'LTI deployment ID para multi-deployment';
COMMENT ON COLUMN lti_integration.lti_consumers.supports_ags IS 'Assignment and Grade Services (envío de calificaciones)';
