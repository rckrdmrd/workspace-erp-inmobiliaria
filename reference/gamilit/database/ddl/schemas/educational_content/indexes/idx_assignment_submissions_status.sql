-- Índice: idx_assignment_submissions_status
-- Tabla: assignment_submissions
-- Schema: educational_content

CREATE INDEX idx_assignment_submissions_status ON educational_content.assignment_submissions(status);