-- Tabla: teacher_notes
-- Schema: progress_tracking
-- Descripción: Notas de profesores sobre estudiantes para seguimiento de progreso
-- MOVIDO desde public.teacher_notes (2025-11-08)

CREATE TABLE progress_tracking.teacher_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_teacher_notes_teacher_id ON progress_tracking.teacher_notes(teacher_id);
CREATE INDEX idx_teacher_notes_student_id ON progress_tracking.teacher_notes(student_id);
CREATE INDEX idx_teacher_notes_created_at ON progress_tracking.teacher_notes(created_at);
CREATE INDEX idx_teacher_notes_teacher_student ON progress_tracking.teacher_notes(teacher_id, student_id);

-- Comentarios
COMMENT ON TABLE progress_tracking.teacher_notes IS 'Teacher notes about students for tracking progress and observations';
COMMENT ON COLUMN progress_tracking.teacher_notes.is_private IS 'Whether note is private to teacher (not visible to student or parents)';
