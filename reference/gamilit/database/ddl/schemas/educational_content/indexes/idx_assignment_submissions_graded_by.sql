-- Índice: idx_assignment_submissions_graded_by
-- Tabla: assignment_submissions
-- Schema: educational_content

CREATE INDEX idx_assignment_submissions_graded_by ON educational_content.assignment_submissions(graded_by);