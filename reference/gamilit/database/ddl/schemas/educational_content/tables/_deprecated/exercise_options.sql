-- Tabla: exercise_options
-- Schema: educational_content
-- Descripción: Opciones de respuesta para ejercicios de opción múltiple
-- CREADO: 2025-11-08

CREATE TABLE educational_content.exercise_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES educational_content.exercises(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_index INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exercise_id, option_index)
);

-- Índices
CREATE INDEX idx_exercise_options_exercise_id ON educational_content.exercise_options(exercise_id);
CREATE INDEX idx_exercise_options_is_correct ON educational_content.exercise_options(exercise_id, is_correct);

-- Comentarios
COMMENT ON TABLE educational_content.exercise_options IS 'Answer options for multiple choice exercises';
COMMENT ON COLUMN educational_content.exercise_options.option_index IS 'Display order of option (0-based)';
COMMENT ON COLUMN educational_content.exercise_options.is_correct IS 'Whether this option is a correct answer';
COMMENT ON COLUMN educational_content.exercise_options.explanation IS 'Explanation shown when this option is selected';

-- Trigger para updated_at
CREATE TRIGGER update_exercise_options_updated_at
    BEFORE UPDATE ON educational_content.exercise_options
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
