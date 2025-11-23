-- Tabla: assignment_exercises
-- Schema: educational_content
-- Descripción: Relación M2M - Ejercicios incluidos en asignaciones
-- MOVIDO desde public.assignment_exercises (2025-11-08)

CREATE TABLE educational_content.assignment_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES educational_content.assignments(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES educational_content.exercises(id) ON DELETE CASCADE,
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, exercise_id)
);

-- Índices
CREATE INDEX idx_assignment_exercises_assignment_id ON educational_content.assignment_exercises(assignment_id);
CREATE INDEX idx_assignment_exercises_exercise_id ON educational_content.assignment_exercises(exercise_id);
CREATE INDEX idx_assignment_exercises_order ON educational_content.assignment_exercises(assignment_id, order_index);

-- Comentarios
COMMENT ON TABLE educational_content.assignment_exercises IS 'Exercises included in assignments (many-to-many)';
COMMENT ON COLUMN educational_content.assignment_exercises.order_index IS 'Display order of exercises in assignment';
