-- Tabla: assignments
-- Schema: educational_content
-- Descripción: Tareas/asignaciones creadas por profesores
-- MOVIDO desde public.assignments (2025-11-08)

CREATE TABLE educational_content.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignment_type VARCHAR(50) NOT NULL CHECK (assignment_type IN ('practice', 'quiz', 'exam', 'homework')),
    due_date TIMESTAMP WITH TIME ZONE,
    total_points INTEGER NOT NULL DEFAULT 100,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_assignments_teacher_id ON educational_content.assignments(teacher_id);
CREATE INDEX idx_assignments_is_published ON educational_content.assignments(is_published);
CREATE INDEX idx_assignments_due_date ON educational_content.assignments(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_assignments_type ON educational_content.assignments(assignment_type);

-- Comentarios
COMMENT ON TABLE educational_content.assignments IS 'Teacher-created assignments';
COMMENT ON COLUMN educational_content.assignments.assignment_type IS 'Type of assignment: practice, quiz, exam, or homework';
COMMENT ON COLUMN educational_content.assignments.total_points IS 'Maximum points/score for this assignment';
COMMENT ON COLUMN educational_content.assignments.is_published IS 'Whether assignment is visible to students';

-- Trigger para updated_at
CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON educational_content.assignments
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
