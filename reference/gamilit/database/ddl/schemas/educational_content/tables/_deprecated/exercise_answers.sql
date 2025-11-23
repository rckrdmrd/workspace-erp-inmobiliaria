-- Tabla: exercise_answers
-- Schema: educational_content
-- Descripción: Respuestas correctas para ejercicios (texto libre, fill-blank, etc.)
-- CREADO: 2025-11-08

CREATE TABLE educational_content.exercise_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES educational_content.exercises(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_case_sensitive BOOLEAN NOT NULL DEFAULT false,
    is_exact_match BOOLEAN NOT NULL DEFAULT true,
    alternate_answers TEXT[],
    points_value INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_exercise_answers_exercise_id ON educational_content.exercise_answers(exercise_id);

-- Comentarios
COMMENT ON TABLE educational_content.exercise_answers IS 'Correct answers for text-based exercises (fill-in-blank, short answer, etc.)';
COMMENT ON COLUMN educational_content.exercise_answers.is_case_sensitive IS 'Whether answer matching should be case sensitive';
COMMENT ON COLUMN educational_content.exercise_answers.is_exact_match IS 'Whether answer must match exactly or can be fuzzy matched';
COMMENT ON COLUMN educational_content.exercise_answers.alternate_answers IS 'Array of acceptable alternate answers';
COMMENT ON COLUMN educational_content.exercise_answers.points_value IS 'Points awarded for this answer';

-- Trigger para updated_at
CREATE TRIGGER update_exercise_answers_updated_at
    BEFORE UPDATE ON educational_content.exercise_answers
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
