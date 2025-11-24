-- Tabla: api_configuration
-- Schema: system_configuration
-- Descripción: Configuración de APIs y servicios externos
-- CREADO: 2025-11-08

CREATE TABLE system_configuration.api_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL UNIQUE,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('oauth', 'payment', 'email', 'sms', 'storage', 'analytics', 'other')),
    api_endpoint TEXT NOT NULL,
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    additional_config JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    rate_limit_per_minute INTEGER,
    timeout_seconds INTEGER DEFAULT 30,
    retry_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_api_configuration_service_name ON system_configuration.api_configuration(service_name);
CREATE INDEX idx_api_configuration_service_type ON system_configuration.api_configuration(service_type);
CREATE INDEX idx_api_configuration_is_active ON system_configuration.api_configuration(is_active);
CREATE INDEX idx_api_configuration_config_gin ON system_configuration.api_configuration USING GIN(additional_config) WHERE additional_config IS NOT NULL;

-- Comentarios
COMMENT ON TABLE system_configuration.api_configuration IS 'Configuration for external APIs and services';
COMMENT ON COLUMN system_configuration.api_configuration.service_type IS 'Type: oauth, payment, email, sms, storage, analytics, other';
COMMENT ON COLUMN system_configuration.api_configuration.api_key_encrypted IS 'Encrypted API key';
COMMENT ON COLUMN system_configuration.api_configuration.api_secret_encrypted IS 'Encrypted API secret';
COMMENT ON COLUMN system_configuration.api_configuration.additional_config IS 'Additional configuration as JSONB';
COMMENT ON COLUMN system_configuration.api_configuration.rate_limit_per_minute IS 'Rate limit for this API (calls per minute)';

-- Trigger para updated_at
CREATE TRIGGER update_api_configuration_updated_at
    BEFORE UPDATE ON system_configuration.api_configuration
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
