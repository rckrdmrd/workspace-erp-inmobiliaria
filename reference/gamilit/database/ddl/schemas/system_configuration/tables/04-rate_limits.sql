-- =====================================================
-- Table: system_configuration.rate_limits
-- Description: Configuración de límites de tasa para endpoints y operaciones
-- Version: 1.0
-- Created: 2025-11-11
-- Author: Database Team
-- =====================================================
--
-- PROPÓSITO:
-- Define límites de tasa (rate limiting) para proteger la API de uso excesivo
-- y garantizar disponibilidad del servicio.
--
-- ALCANCE:
-- - Límites por endpoint específico
-- - Límites por operación (login, register, etc.)
-- - Configuración por scope (IP, usuario, consumer, global)
-- - Capacidad de burst para picos temporales
--
-- CASOS DE USO:
-- 1. Protección contra ataques de fuerza bruta (login attempts)
-- 2. Límites de API para consumidores LTI
-- 3. Throttling de operaciones costosas
-- 4. Fair usage entre usuarios
--
-- DEPENDENCIAS:
-- - Ninguna (tabla standalone de configuración)
--
-- SEGURIDAD:
-- - RLS habilitado para solo admins
-- - Auditoría de cambios en updated_at
--
-- REFERENCIAS:
-- - Docs: docs/02-especificaciones-tecnicas/system-configuration/
-- - Seed: seeds/prod/system_configuration/04-rate_limits.sql
--
-- =====================================================

-- Validar schema existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'system_configuration') THEN
        RAISE EXCEPTION 'Schema system_configuration no existe. Ejecutar 00-prerequisites.sql primero.';
    END IF;
END $$;

-- Crear tabla
CREATE TABLE IF NOT EXISTS system_configuration.rate_limits (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Configuración de recurso
    resource_type TEXT NOT NULL CHECK (resource_type IN ('endpoint', 'operation')),
    resource_identifier TEXT NOT NULL,

    -- Límites
    max_requests INTEGER NOT NULL CHECK (max_requests > 0),
    window_seconds INTEGER NOT NULL CHECK (window_seconds > 0),

    -- Scope
    scope TEXT NOT NULL CHECK (scope IN ('ip', 'user', 'consumer', 'global')),

    -- Control
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    burst_size INTEGER CHECK (burst_size IS NULL OR burst_size > 0),

    -- Metadatos
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT gamilit.now_mexico(),

    -- Constraints
    CONSTRAINT rate_limits_unique_resource
        UNIQUE(resource_type, resource_identifier, scope)
);

-- Comentarios de tabla
COMMENT ON TABLE system_configuration.rate_limits IS
'Configuración de límites de tasa (rate limiting) para endpoints y operaciones de la API.
Permite proteger contra uso excesivo y garantizar fair usage entre usuarios.

Versión: 1.0
Creado: 2025-11-11
Propósito: Protección y throttling de API';

-- Comentarios de columnas
COMMENT ON COLUMN system_configuration.rate_limits.id IS
'Identificador único de la configuración';

COMMENT ON COLUMN system_configuration.rate_limits.resource_type IS
'Tipo de recurso a limitar: endpoint (URL) u operation (acción lógica)';

COMMENT ON COLUMN system_configuration.rate_limits.resource_identifier IS
'Identificador del recurso. Ejemplos:
- endpoint: /api/auth/login, /api/exercises/:id
- operation: login_attempt, register_user, submit_exercise';

COMMENT ON COLUMN system_configuration.rate_limits.max_requests IS
'Número máximo de requests permitidos en la ventana de tiempo';

COMMENT ON COLUMN system_configuration.rate_limits.window_seconds IS
'Ventana de tiempo en segundos. Ejemplos:
- 60 = 1 minuto
- 3600 = 1 hora
- 86400 = 1 día';

COMMENT ON COLUMN system_configuration.rate_limits.scope IS
'Ámbito del límite:
- ip: Por dirección IP
- user: Por usuario autenticado
- consumer: Por consumidor LTI
- global: Global para todos';

COMMENT ON COLUMN system_configuration.rate_limits.is_enabled IS
'Si el límite está activo. Permite desactivar temporalmente sin eliminar configuración.';

COMMENT ON COLUMN system_configuration.rate_limits.burst_size IS
'Tamaño del burst permitido. Permite picos temporales por encima del límite base.
NULL = sin burst allowance';

COMMENT ON COLUMN system_configuration.rate_limits.description IS
'Descripción del propósito de este límite';

COMMENT ON COLUMN system_configuration.rate_limits.metadata IS
'Metadatos adicionales en formato JSON. Puede incluir:
- error_message: Mensaje personalizado al exceder límite
- retry_after_strategy: Estrategia para Retry-After header
- exemptions: Lista de IPs o usuarios exentos';

-- Validación de datos
DO $$
BEGIN
    -- Validar que gamilit.now_mexico() existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'gamilit' AND p.proname = 'now_mexico'
    ) THEN
        RAISE WARNING 'Función gamilit.now_mexico() no existe. Los timestamps usarán UTC.';
    END IF;

    RAISE NOTICE '✓ Tabla system_configuration.rate_limits creada exitosamente';
END $$;
