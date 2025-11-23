-- Tabla: assignment_students
-- Schema: educational_content
-- Descripción: Relación M2M - Asignaciones asignadas a estudiantes individuales
-- MOVIDO desde public.assignment_students (2025-11-08)

CREATE TABLE educational_content.assignment_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES educational_content.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- Índices
CREATE INDEX idx_assignment_students_assignment_id ON educational_content.assignment_students(assignment_id);
CREATE INDEX idx_assignment_students_student_id ON educational_content.assignment_students(student_id);

-- Comentarios
COMMENT ON TABLE educational_content.assignment_students IS 'Assignments assigned to individual students';
