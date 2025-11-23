-- Tabla: user_learning_paths
-- Schema: progress_tracking
-- Descripción: Rutas de aprendizaje asignadas a usuarios
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.user_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES progress_tracking.learning_paths(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    current_module_index INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'abandoned')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, learning_path_id)
);

-- Índices
CREATE INDEX idx_user_learning_paths_user_id ON progress_tracking.user_learning_paths(user_id);
CREATE INDEX idx_user_learning_paths_path_id ON progress_tracking.user_learning_paths(learning_path_id);
CREATE INDEX idx_user_learning_paths_status ON progress_tracking.user_learning_paths(status);
CREATE INDEX idx_user_learning_paths_user_status ON progress_tracking.user_learning_paths(user_id, status);
CREATE INDEX idx_user_learning_paths_enrolled_at ON progress_tracking.user_learning_paths(enrolled_at);

-- Comentarios
COMMENT ON TABLE progress_tracking.user_learning_paths IS 'Learning paths assigned to users with progress tracking';
COMMENT ON COLUMN progress_tracking.user_learning_paths.enrolled_at IS 'When user was enrolled in this learning path';
COMMENT ON COLUMN progress_tracking.user_learning_paths.completion_percentage IS 'Overall progress in this learning path (0-100)';
COMMENT ON COLUMN progress_tracking.user_learning_paths.current_module_index IS 'Index of current module in the learning path sequence';
COMMENT ON COLUMN progress_tracking.user_learning_paths.status IS 'Status: enrolled, in_progress, completed, or abandoned';

-- Trigger para updated_at
CREATE TRIGGER update_user_learning_paths_updated_at
    BEFORE UPDATE ON progress_tracking.user_learning_paths
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
