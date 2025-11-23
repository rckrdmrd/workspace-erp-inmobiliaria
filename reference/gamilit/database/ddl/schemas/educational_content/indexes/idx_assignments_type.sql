-- Índice: idx_assignments_type
-- Tabla: assignments
-- Schema: educational_content

CREATE INDEX IF NOT EXISTS idx_assignments_type ON educational_content.assignments(assignment_type);