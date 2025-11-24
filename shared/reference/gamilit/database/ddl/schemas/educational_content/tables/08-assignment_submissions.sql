-- Tabla: assignment_submissions
-- Schema: educational_content
-- Descripción: Entregas de estudiantes para asignaciones
-- MOVIDO desde public.assignment_submissions (2025-11-08)

CREATE TABLE educational_content.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES educational_content.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
    score NUMERIC(5,2),
    feedback TEXT,
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- Índices
CREATE INDEX idx_assignment_submissions_assignment_id ON educational_content.assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student_id ON educational_content.assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_status ON educational_content.assignment_submissions(status);
CREATE INDEX idx_assignment_submissions_graded_by ON educational_content.assignment_submissions(graded_by) WHERE graded_by IS NOT NULL;
CREATE INDEX idx_assignment_submissions_submitted_at ON educational_content.assignment_submissions(submitted_at) WHERE submitted_at IS NOT NULL;

-- Comentarios
COMMENT ON TABLE educational_content.assignment_submissions IS 'Student submissions for assignments';
COMMENT ON COLUMN educational_content.assignment_submissions.status IS 'Submission status: not_started, in_progress, submitted, or graded';
COMMENT ON COLUMN educational_content.assignment_submissions.score IS 'Numeric score given by teacher (0-100 scale)';
COMMENT ON COLUMN educational_content.assignment_submissions.graded_by IS 'Teacher who graded this submission';

-- Trigger para updated_at
CREATE TRIGGER update_assignment_submissions_updated_at
    BEFORE UPDATE ON educational_content.assignment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
