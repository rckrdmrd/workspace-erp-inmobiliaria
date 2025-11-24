-- Tabla: skill_assessments
-- Schema: progress_tracking
-- Descripción: Evaluaciones de habilidades específicas de usuarios
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    skill_category VARCHAR(50),
    assessment_score NUMERIC(5,2) NOT NULL CHECK (assessment_score >= 0 AND assessment_score <= 100),
    proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('novice', 'beginner', 'intermediate', 'advanced', 'expert')),
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assessed_by_module_id UUID REFERENCES educational_content.modules(id),
    evidence JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_skill_assessments_user_id ON progress_tracking.skill_assessments(user_id);
CREATE INDEX idx_skill_assessments_skill ON progress_tracking.skill_assessments(skill_name);
CREATE INDEX idx_skill_assessments_category ON progress_tracking.skill_assessments(skill_category) WHERE skill_category IS NOT NULL;
CREATE INDEX idx_skill_assessments_level ON progress_tracking.skill_assessments(proficiency_level);
CREATE INDEX idx_skill_assessments_user_skill ON progress_tracking.skill_assessments(user_id, skill_name, assessed_at DESC);

-- Comentarios
COMMENT ON TABLE progress_tracking.skill_assessments IS 'Assessments of specific skills for users';
COMMENT ON COLUMN progress_tracking.skill_assessments.skill_name IS 'Name of skill being assessed (e.g., "lectura literal", "inferencia")';
COMMENT ON COLUMN progress_tracking.skill_assessments.skill_category IS 'Category of skill (e.g., "comprension_lectora", "matematicas")';
COMMENT ON COLUMN progress_tracking.skill_assessments.assessment_score IS 'Numeric score for this skill (0-100)';
COMMENT ON COLUMN progress_tracking.skill_assessments.proficiency_level IS 'Level: novice, beginner, intermediate, advanced, expert';
COMMENT ON COLUMN progress_tracking.skill_assessments.evidence IS 'JSONB with evidence supporting this assessment';

-- Trigger para updated_at
CREATE TRIGGER update_skill_assessments_updated_at
    BEFORE UPDATE ON progress_tracking.skill_assessments
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
