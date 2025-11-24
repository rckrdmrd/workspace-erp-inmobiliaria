-- =====================================================
-- Tabla: bulk_operations
-- Schema: admin_dashboard
-- Descripción: Registra operaciones bulk (masivas) realizadas
--              por administradores sobre múltiples usuarios/recursos
-- Relacionado: EXT-002 (Admin Extendido)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE admin_dashboard.bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tipo de operación: 'suspend_users', 'activate_users', 'update_role', 'delete_users', etc.
    operation_type VARCHAR(50) NOT NULL,

    -- Entidad objetivo: 'users', 'content', 'classrooms', etc.
    target_entity VARCHAR(50) NOT NULL,

    -- IDs de los recursos a procesar
    target_ids UUID[] NOT NULL,

    -- Contadores
    target_count INTEGER NOT NULL,
    completed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,

    -- Estado: 'pending', 'running', 'completed', 'failed', 'cancelled'
    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    -- Detalles de errores individuales
    error_details JSONB DEFAULT '[]'::jsonb,

    -- Auditoría
    started_by UUID NOT NULL REFERENCES auth.users(id),
    started_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    completed_at TIMESTAMP,

    -- Resultado consolidado
    result JSONB,

    -- Constraints
    CONSTRAINT chk_bulk_ops_status CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    CONSTRAINT chk_bulk_ops_counts CHECK (completed_count >= 0 AND failed_count >= 0),
    CONSTRAINT chk_bulk_ops_target_count CHECK (target_count > 0)
);

-- Índices para búsquedas comunes
CREATE INDEX idx_bulk_ops_status ON admin_dashboard.bulk_operations(status);
CREATE INDEX idx_bulk_ops_started_by ON admin_dashboard.bulk_operations(started_by);
CREATE INDEX idx_bulk_ops_type ON admin_dashboard.bulk_operations(operation_type);
CREATE INDEX idx_bulk_ops_started_at ON admin_dashboard.bulk_operations(started_at DESC);

-- Comentarios
COMMENT ON TABLE admin_dashboard.bulk_operations IS 'Registra operaciones bulk (masivas) realizadas por administradores';
COMMENT ON COLUMN admin_dashboard.bulk_operations.operation_type IS 'Tipo de operación bulk ejecutada';
COMMENT ON COLUMN admin_dashboard.bulk_operations.target_entity IS 'Tipo de entidad sobre la que se aplica la operación';
COMMENT ON COLUMN admin_dashboard.bulk_operations.target_ids IS 'Array de UUIDs de recursos a procesar';
COMMENT ON COLUMN admin_dashboard.bulk_operations.status IS 'Estado actual de la operación bulk';
COMMENT ON COLUMN admin_dashboard.bulk_operations.error_details IS 'Array JSON de errores individuales durante el procesamiento';
COMMENT ON COLUMN admin_dashboard.bulk_operations.result IS 'Resultado consolidado de la operación (opcional)';
