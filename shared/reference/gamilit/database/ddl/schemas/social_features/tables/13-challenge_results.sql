-- =====================================================================================
-- Tabla: challenge_results
-- Descripción: Resultados finales de peer challenges con rankings y distribución
--              de recompensas
-- Documentación: docs/03-fase-extensiones/EXT-009-peer-challenges/
-- Epic: EXT-009
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS social_features.challenge_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relación
    challenge_id UUID NOT NULL UNIQUE REFERENCES social_features.peer_challenges(id) ON DELETE CASCADE,

    -- Ganadores
    winner_id UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    second_place_id UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,
    third_place_id UUID REFERENCES auth_management.profiles(id) ON DELETE SET NULL,

    -- Estadísticas generales
    total_participants INTEGER NOT NULL,
    participants_completed INTEGER,
    participants_forfeit INTEGER,

    -- Scores
    winning_score NUMERIC(10,2),
    average_score NUMERIC(10,2),
    highest_accuracy NUMERIC(5,2),

    -- Timing
    average_completion_time_seconds INTEGER,
    fastest_completion_time_seconds INTEGER,

    -- Recompensas distribuidas
    total_xp_distributed INTEGER DEFAULT 0,
    total_ml_coins_distributed INTEGER DEFAULT 0,
    rewards_distributed BOOLEAN DEFAULT false,

    -- Leaderboard final (top N)
    final_leaderboard JSONB DEFAULT '[]',  -- Array de {user_id, rank, score, time}

    -- Estadísticas detalladas
    statistics JSONB DEFAULT '{}',          -- Stats adicionales (accuracy, attempts, etc.)

    -- Auditoría
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rewards_distributed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_challenge_results_challenge ON social_features.challenge_results(challenge_id);
CREATE INDEX idx_challenge_results_winner ON social_features.challenge_results(winner_id);
CREATE INDEX idx_challenge_results_calculated_at ON social_features.challenge_results(calculated_at DESC);
CREATE INDEX idx_challenge_results_rewards_pending ON social_features.challenge_results(rewards_distributed)
    WHERE rewards_distributed = false;

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_challenge_results_leaderboard ON social_features.challenge_results USING GIN(final_leaderboard);
CREATE INDEX idx_challenge_results_statistics ON social_features.challenge_results USING GIN(statistics);

-- Comentarios
COMMENT ON TABLE social_features.challenge_results IS 'Resultados finales de peer challenges con rankings y distribución de recompensas. Epic EXT-009.';
COMMENT ON COLUMN social_features.challenge_results.winner_id IS 'Usuario ganador del desafío';
COMMENT ON COLUMN social_features.challenge_results.final_leaderboard IS 'Leaderboard final en formato JSONB: [{user_id, rank, score, time}, ...]';
COMMENT ON COLUMN social_features.challenge_results.total_xp_distributed IS 'Total de XP distribuido a todos los participantes';
COMMENT ON COLUMN social_features.challenge_results.rewards_distributed IS 'Indica si las recompensas ya fueron distribuidas';
