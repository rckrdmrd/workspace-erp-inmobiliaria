-- Índice: idx_assignments_teacher_id
-- Tabla: assignments
-- Schema: educational_content

CREATE INDEX idx_assignments_teacher_id ON educational_content.assignments(teacher_id);