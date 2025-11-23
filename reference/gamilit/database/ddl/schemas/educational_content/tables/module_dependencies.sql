-- Tabla: module_dependencies
-- Schema: educational_content
-- Descripción: Dependencias entre módulos (prerequisitos)
-- CREADO: 2025-11-08

CREATE TABLE educational_content.module_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES educational_content.modules(id) ON DELETE CASCADE,
    prerequisite_module_id UUID NOT NULL REFERENCES educational_content.modules(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'required' CHECK (dependency_type IN ('required', 'recommended', 'optional')),
    minimum_completion_percentage INTEGER DEFAULT 100 CHECK (minimum_completion_percentage >= 0 AND minimum_completion_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_id, prerequisite_module_id),
    CHECK (module_id != prerequisite_module_id)
);

-- Índices
CREATE INDEX idx_module_dependencies_module_id ON educational_content.module_dependencies(module_id);
CREATE INDEX idx_module_dependencies_prerequisite_id ON educational_content.module_dependencies(prerequisite_module_id);
CREATE INDEX idx_module_dependencies_type ON educational_content.module_dependencies(dependency_type);

-- Comentarios
COMMENT ON TABLE educational_content.module_dependencies IS 'Prerequisites and dependencies between modules';
COMMENT ON COLUMN educational_content.module_dependencies.module_id IS 'Module that has the prerequisite';
COMMENT ON COLUMN educational_content.module_dependencies.prerequisite_module_id IS 'Module that must be completed first';
COMMENT ON COLUMN educational_content.module_dependencies.dependency_type IS 'Type: required (must complete), recommended (should complete), or optional';
COMMENT ON COLUMN educational_content.module_dependencies.minimum_completion_percentage IS 'Minimum % of prerequisite module that must be completed';
