-- Tabla: learning_paths
-- Schema: progress_tracking
-- Descripción: Rutas de aprendizaje (secuencias de módulos)
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_recommended BOOLEAN NOT NULL DEFAULT false,
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('facil', 'intermedio', 'dificil', 'experto')),
    estimated_hours INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_learning_paths_is_active ON progress_tracking.learning_paths(is_active);
CREATE INDEX idx_learning_paths_is_recommended ON progress_tracking.learning_paths(is_recommended);
CREATE INDEX idx_learning_paths_difficulty ON progress_tracking.learning_paths(difficulty_level);
CREATE INDEX idx_learning_paths_created_by ON progress_tracking.learning_paths(created_by) WHERE created_by IS NOT NULL;

-- Comentarios
COMMENT ON TABLE progress_tracking.learning_paths IS 'Predefined learning paths (sequences of modules)';
COMMENT ON COLUMN progress_tracking.learning_paths.is_recommended IS 'Whether this path is recommended for new users';
COMMENT ON COLUMN progress_tracking.learning_paths.difficulty_level IS 'Overall difficulty: facil, intermedio, dificil, experto';
COMMENT ON COLUMN progress_tracking.learning_paths.estimated_hours IS 'Estimated completion time in hours';
COMMENT ON COLUMN progress_tracking.learning_paths.is_active IS 'Whether this learning path is currently active/available';

-- Trigger para updated_at
CREATE TRIGGER update_learning_paths_updated_at
    BEFORE UPDATE ON progress_tracking.learning_paths
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
