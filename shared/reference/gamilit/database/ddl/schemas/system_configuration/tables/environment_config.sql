-- Tabla: environment_config
-- Schema: system_configuration
-- Descripción: Configuración por entorno (dev, staging, prod)
-- CREADO: 2025-11-08

CREATE TABLE system_configuration.environment_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment VARCHAR(50) NOT NULL CHECK (environment IN ('development', 'staging', 'production', 'test')),
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,
    is_encrypted BOOLEAN NOT NULL DEFAULT false,
    is_sensitive BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(environment, config_key)
);

-- Índices
CREATE INDEX idx_environment_config_environment ON system_configuration.environment_config(environment);
CREATE INDEX idx_environment_config_key ON system_configuration.environment_config(config_key);
CREATE INDEX idx_environment_config_env_key ON system_configuration.environment_config(environment, config_key);
CREATE INDEX idx_environment_config_sensitive ON system_configuration.environment_config(is_sensitive) WHERE is_sensitive = true;

-- Comentarios
COMMENT ON TABLE system_configuration.environment_config IS 'Configuration settings by environment';
COMMENT ON COLUMN system_configuration.environment_config.environment IS 'Environment: development, staging, production, test';
COMMENT ON COLUMN system_configuration.environment_config.config_key IS 'Configuration key (e.g., "max_upload_size", "api_rate_limit")';
COMMENT ON COLUMN system_configuration.environment_config.is_encrypted IS 'Whether value is encrypted';
COMMENT ON COLUMN system_configuration.environment_config.is_sensitive IS 'Whether value contains sensitive data (passwords, keys)';

-- Trigger para updated_at
CREATE TRIGGER update_environment_config_updated_at
    BEFORE UPDATE ON system_configuration.environment_config
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
