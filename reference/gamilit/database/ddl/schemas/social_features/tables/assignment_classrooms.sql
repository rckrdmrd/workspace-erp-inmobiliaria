-- Tabla: assignment_classrooms
-- Schema: social_features
-- Descripción: Relación M2M - Asignaciones asignadas a aulas completas
-- MOVIDO desde public.assignment_classrooms (2025-11-08)

CREATE TABLE social_features.assignment_classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES educational_content.assignments(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES social_features.classrooms(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, classroom_id)
);

-- Índices
CREATE INDEX idx_assignment_classrooms_assignment_id ON social_features.assignment_classrooms(assignment_id);
CREATE INDEX idx_assignment_classrooms_classroom_id ON social_features.assignment_classrooms(classroom_id);

-- Comentarios
COMMENT ON TABLE social_features.assignment_classrooms IS 'Assignments assigned to entire classrooms';
