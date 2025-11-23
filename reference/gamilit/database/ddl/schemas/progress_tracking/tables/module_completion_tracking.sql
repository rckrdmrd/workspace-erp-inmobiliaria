-- Tabla: module_completion_tracking
-- Schema: progress_tracking
-- Descripción: Seguimiento detallado de completitud de módulos por usuario
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.module_completion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES educational_content.modules(id) ON DELETE CASCADE,
    completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    exercises_completed INTEGER NOT NULL DEFAULT 0,
    exercises_total INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'mastered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- Índices
CREATE INDEX idx_module_completion_user_id ON progress_tracking.module_completion_tracking(user_id);
CREATE INDEX idx_module_completion_module_id ON progress_tracking.module_completion_tracking(module_id);
CREATE INDEX idx_module_completion_status ON progress_tracking.module_completion_tracking(status);
CREATE INDEX idx_module_completion_percentage ON progress_tracking.module_completion_tracking(completion_percentage);
CREATE INDEX idx_module_completion_user_status ON progress_tracking.module_completion_tracking(user_id, status);

-- Comentarios
COMMENT ON TABLE progress_tracking.module_completion_tracking IS 'Detailed tracking of module completion by user';
COMMENT ON COLUMN progress_tracking.module_completion_tracking.completion_percentage IS 'Percentage of module completed (0-100)';
COMMENT ON COLUMN progress_tracking.module_completion_tracking.exercises_completed IS 'Number of exercises completed in this module';
COMMENT ON COLUMN progress_tracking.module_completion_tracking.exercises_total IS 'Total number of exercises in this module';
COMMENT ON COLUMN progress_tracking.module_completion_tracking.time_spent_seconds IS 'Total time spent on this module in seconds';
COMMENT ON COLUMN progress_tracking.module_completion_tracking.status IS 'Status: not_started, in_progress, completed, or mastered';

-- Trigger para updated_at
CREATE TRIGGER update_module_completion_tracking_updated_at
    BEFORE UPDATE ON progress_tracking.module_completion_tracking
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
