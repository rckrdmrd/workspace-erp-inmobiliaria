-- =====================================================================================
-- Tabla: challenge_participants
-- Descripción: Participantes de peer challenges y su progreso individual
-- Documentación: docs/03-fase-extensiones/EXT-009-peer-challenges/
-- Epic: EXT-009
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS social_features.challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relaciones
    challenge_id UUID NOT NULL REFERENCES social_features.peer_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,

    -- Estado del participante
    participation_status TEXT DEFAULT 'invited' CHECK (participation_status IN (
        'invited',      -- Invitado pero no aceptado
        'accepted',     -- Aceptó el desafío
        'in_progress',  -- Completando el desafío
        'completed',    -- Terminó el desafío
        'forfeit',      -- Se rindió
        'disqualified'  -- Descalificado
    )),

    -- Progreso
    score NUMERIC(10,2) DEFAULT 0,          -- Puntuación obtenida
    accuracy_percentage NUMERIC(5,2),       -- % de precisión
    completion_percentage NUMERIC(5,2) DEFAULT 0, -- % completado
    exercises_completed INTEGER DEFAULT 0,

    -- Timing
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER,            -- Tiempo total invertido

    -- Posición/Ranking
    rank INTEGER,                           -- Posición final (1 = ganador)
    is_winner BOOLEAN DEFAULT false,

    -- Recompensas
    xp_earned INTEGER DEFAULT 0,
    ml_coins_earned INTEGER DEFAULT 0,
    rewards_claimed BOOLEAN DEFAULT false,

    -- Intento tracking
    attempt_id UUID,                        -- Link a exercise_attempts si aplica

    -- Auditoría
    invited_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Constraints
    CONSTRAINT unique_challenge_participant UNIQUE(challenge_id, user_id)
);

-- Índices
CREATE INDEX idx_challenge_participants_challenge ON social_features.challenge_participants(challenge_id);
CREATE INDEX idx_challenge_participants_user ON social_features.challenge_participants(user_id);
CREATE INDEX idx_challenge_participants_status ON social_features.challenge_participants(participation_status);
CREATE INDEX idx_challenge_participants_score ON social_features.challenge_participants(challenge_id, score DESC);
CREATE INDEX idx_challenge_participants_rank ON social_features.challenge_participants(challenge_id, rank);
CREATE INDEX idx_challenge_participants_winner ON social_features.challenge_participants(challenge_id, is_winner)
    WHERE is_winner = true;
CREATE INDEX idx_challenge_participants_user_challenges ON social_features.challenge_participants(user_id, created_at DESC);

-- Índice GIN para metadata
CREATE INDEX idx_challenge_participants_metadata ON social_features.challenge_participants USING GIN(metadata);

-- Trigger para updated_at
CREATE TRIGGER trg_challenge_participants_updated_at
    BEFORE UPDATE ON social_features.challenge_participants
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE social_features.challenge_participants IS 'Participantes de peer challenges con progreso individual y rankings. Epic EXT-009.';
COMMENT ON COLUMN social_features.challenge_participants.participation_status IS 'Estado del participante (invited, accepted, in_progress, completed, forfeit)';
COMMENT ON COLUMN social_features.challenge_participants.score IS 'Puntuación total obtenida en el desafío';
COMMENT ON COLUMN social_features.challenge_participants.rank IS 'Posición final en el ranking (1 = ganador)';
COMMENT ON COLUMN social_features.challenge_participants.time_spent_seconds IS 'Tiempo total invertido en segundos';
