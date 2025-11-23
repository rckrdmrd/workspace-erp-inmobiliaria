-- Tabla: engagement_metrics
-- Schema: progress_tracking
-- Descripción: Métricas de engagement y actividad de usuarios
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.engagement_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    daily_active BOOLEAN NOT NULL DEFAULT false,
    sessions_count INTEGER NOT NULL DEFAULT 0,
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    exercises_attempted INTEGER NOT NULL DEFAULT 0,
    exercises_completed INTEGER NOT NULL DEFAULT 0,
    modules_started INTEGER NOT NULL DEFAULT 0,
    modules_completed INTEGER NOT NULL DEFAULT 0,
    achievements_unlocked INTEGER NOT NULL DEFAULT 0,
    social_interactions INTEGER NOT NULL DEFAULT 0,
    engagement_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, metric_date)
);

-- Índices
CREATE INDEX idx_engagement_metrics_user_id ON progress_tracking.engagement_metrics(user_id);
CREATE INDEX idx_engagement_metrics_date ON progress_tracking.engagement_metrics(metric_date);
CREATE INDEX idx_engagement_metrics_user_date ON progress_tracking.engagement_metrics(user_id, metric_date DESC);
CREATE INDEX idx_engagement_metrics_daily_active ON progress_tracking.engagement_metrics(metric_date) WHERE daily_active = true;
CREATE INDEX idx_engagement_metrics_score ON progress_tracking.engagement_metrics(engagement_score DESC);

-- Comentarios
COMMENT ON TABLE progress_tracking.engagement_metrics IS 'Daily engagement metrics for users';
COMMENT ON COLUMN progress_tracking.engagement_metrics.metric_date IS 'Date of these metrics';
COMMENT ON COLUMN progress_tracking.engagement_metrics.daily_active IS 'Whether user was active on this date';
COMMENT ON COLUMN progress_tracking.engagement_metrics.sessions_count IS 'Number of learning sessions on this date';
COMMENT ON COLUMN progress_tracking.engagement_metrics.total_time_seconds IS 'Total time spent on platform (seconds)';
COMMENT ON COLUMN progress_tracking.engagement_metrics.engagement_score IS 'Calculated engagement score (0-100) based on activity';

-- Trigger para updated_at
CREATE TRIGGER update_engagement_metrics_updated_at
    BEFORE UPDATE ON progress_tracking.engagement_metrics
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
