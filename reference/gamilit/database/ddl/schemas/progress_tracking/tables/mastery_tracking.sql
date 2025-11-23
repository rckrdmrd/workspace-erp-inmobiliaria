-- Tabla: mastery_tracking
-- Schema: progress_tracking
-- Descripción: Seguimiento de dominio de temas/conceptos por usuario
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.mastery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES educational_content.modules(id) ON DELETE CASCADE,
    topic VARCHAR(200) NOT NULL,
    mastery_level NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
    attempts_count INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    mastered_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'learning' CHECK (status IN ('not_started', 'learning', 'practicing', 'mastered', 'needs_review')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id, topic)
);

-- Índices
CREATE INDEX idx_mastery_tracking_user_id ON progress_tracking.mastery_tracking(user_id);
CREATE INDEX idx_mastery_tracking_module_id ON progress_tracking.mastery_tracking(module_id);
CREATE INDEX idx_mastery_tracking_status ON progress_tracking.mastery_tracking(status);
CREATE INDEX idx_mastery_tracking_mastery_level ON progress_tracking.mastery_tracking(mastery_level);
CREATE INDEX idx_mastery_tracking_user_module ON progress_tracking.mastery_tracking(user_id, module_id);
CREATE INDEX idx_mastery_tracking_needs_review ON progress_tracking.mastery_tracking(user_id) WHERE status = 'needs_review';

-- Comentarios
COMMENT ON TABLE progress_tracking.mastery_tracking IS 'Tracking of topic/concept mastery by user';
COMMENT ON COLUMN progress_tracking.mastery_tracking.topic IS 'Specific topic or concept being tracked';
COMMENT ON COLUMN progress_tracking.mastery_tracking.mastery_level IS 'Mastery percentage (0-100) based on performance';
COMMENT ON COLUMN progress_tracking.mastery_tracking.attempts_count IS 'Total attempts on exercises for this topic';
COMMENT ON COLUMN progress_tracking.mastery_tracking.correct_attempts IS 'Number of correct attempts';
COMMENT ON COLUMN progress_tracking.mastery_tracking.status IS 'Status: not_started, learning, practicing, mastered, needs_review';

-- Trigger para updated_at
CREATE TRIGGER update_mastery_tracking_updated_at
    BEFORE UPDATE ON progress_tracking.mastery_tracking
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
