-- Índice: idx_assignments_is_published
-- Tabla: assignments
-- Schema: educational_content

CREATE INDEX idx_assignments_is_published ON educational_content.assignments(is_published);