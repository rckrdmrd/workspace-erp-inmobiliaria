-- Tabla: progress_snapshots
-- Schema: progress_tracking
-- Descripción: Snapshots históricos de progreso de usuarios
-- CREADO: 2025-11-08

CREATE TABLE progress_tracking.progress_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    snapshot_data JSONB NOT NULL,
    total_modules_completed INTEGER DEFAULT 0,
    total_exercises_completed INTEGER DEFAULT 0,
    total_time_spent_seconds INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_rank VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, snapshot_date)
);

-- Índices
CREATE INDEX idx_progress_snapshots_user_id ON progress_tracking.progress_snapshots(user_id);
CREATE INDEX idx_progress_snapshots_date ON progress_tracking.progress_snapshots(snapshot_date);
CREATE INDEX idx_progress_snapshots_user_date ON progress_tracking.progress_snapshots(user_id, snapshot_date DESC);
CREATE INDEX idx_progress_snapshots_data_gin ON progress_tracking.progress_snapshots USING GIN(snapshot_data);

-- Comentarios
COMMENT ON TABLE progress_tracking.progress_snapshots IS 'Historical snapshots of user progress (daily/weekly/monthly)';
COMMENT ON COLUMN progress_tracking.progress_snapshots.snapshot_date IS 'Date of this snapshot';
COMMENT ON COLUMN progress_tracking.progress_snapshots.snapshot_data IS 'JSONB with detailed progress data at this point in time';
COMMENT ON COLUMN progress_tracking.progress_snapshots.total_modules_completed IS 'Total modules completed as of this snapshot';
COMMENT ON COLUMN progress_tracking.progress_snapshots.total_exercises_completed IS 'Total exercises completed as of this snapshot';
