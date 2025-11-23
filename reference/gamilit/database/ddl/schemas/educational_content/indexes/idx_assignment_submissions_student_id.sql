-- Índice: idx_assignment_submissions_student_id
-- Tabla: assignment_submissions
-- Schema: educational_content

CREATE INDEX idx_assignment_submissions_student_id ON educational_content.assignment_submissions(student_id);