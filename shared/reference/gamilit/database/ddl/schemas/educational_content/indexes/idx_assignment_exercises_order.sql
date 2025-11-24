-- Índice: idx_assignment_exercises_order
-- Tabla: assignment_exercises
-- Schema: educational_content

CREATE INDEX IF NOT EXISTS idx_assignment_exercises_order ON educational_content.assignment_exercises(assignment_id, order_index);