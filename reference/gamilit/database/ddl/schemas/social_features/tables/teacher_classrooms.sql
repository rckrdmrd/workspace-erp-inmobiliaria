-- Tabla: teacher_classrooms
-- Schema: social_features
-- Descripción: Relación entre profesores y aulas (un aula puede tener múltiples profesores)
-- CREADO: 2025-11-08
-- Epic: EXT-001

CREATE TABLE social_features.teacher_classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES social_features.classrooms(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'teacher' CHECK (role IN ('owner', 'teacher', 'assistant')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, classroom_id)
);

-- Índices
CREATE INDEX idx_teacher_classrooms_teacher_id ON social_features.teacher_classrooms(teacher_id);
CREATE INDEX idx_teacher_classrooms_classroom_id ON social_features.teacher_classrooms(classroom_id);
CREATE INDEX idx_teacher_classrooms_role ON social_features.teacher_classrooms(role);

-- Comentarios
COMMENT ON TABLE social_features.teacher_classrooms IS 'Teachers assigned to classrooms (EXT-001)';
COMMENT ON COLUMN social_features.teacher_classrooms.role IS 'Role: owner (created classroom), teacher (full access), assistant (limited access)';
