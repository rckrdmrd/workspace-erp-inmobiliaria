-- Tabla: tenant_configurations
-- Schema: system_configuration
-- Descripción: Configuraciones específicas por tenant (multi-tenancy)
-- CREADO: 2025-11-08
-- Epic: EXT-008

CREATE TABLE system_configuration.tenant_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES auth_management.tenants(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(50) NOT NULL CHECK (config_type IN ('branding', 'features', 'limits', 'permissions', 'integrations', 'other')),
    is_overridable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, config_key)
);

-- Índices
CREATE INDEX idx_tenant_configurations_tenant_id ON system_configuration.tenant_configurations(tenant_id);
CREATE INDEX idx_tenant_configurations_key ON system_configuration.tenant_configurations(config_key);
CREATE INDEX idx_tenant_configurations_type ON system_configuration.tenant_configurations(config_type);
CREATE INDEX idx_tenant_configurations_value_gin ON system_configuration.tenant_configurations USING GIN(config_value);

-- Comentarios
COMMENT ON TABLE system_configuration.tenant_configurations IS 'Tenant-specific configurations for multi-tenancy (EXT-008)';
COMMENT ON COLUMN system_configuration.tenant_configurations.config_key IS 'Configuration key (e.g., "primary_color", "max_users", "allowed_modules")';
COMMENT ON COLUMN system_configuration.tenant_configurations.config_value IS 'Configuration value as JSONB';
COMMENT ON COLUMN system_configuration.tenant_configurations.config_type IS 'Type: branding, features, limits, permissions, integrations, other';
COMMENT ON COLUMN system_configuration.tenant_configurations.is_overridable IS 'Whether tenant can override this configuration';

-- Trigger para updated_at
CREATE TRIGGER update_tenant_configurations_updated_at
    BEFORE UPDATE ON system_configuration.tenant_configurations
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
