-- Índice: idx_assignment_submissions_submitted_at
-- Tabla: assignment_submissions
-- Schema: educational_content

CREATE INDEX IF NOT EXISTS idx_assignment_submissions_submitted_at ON educational_content.assignment_submissions(submitted_at) WHERE submitted_at IS NOT NULL;