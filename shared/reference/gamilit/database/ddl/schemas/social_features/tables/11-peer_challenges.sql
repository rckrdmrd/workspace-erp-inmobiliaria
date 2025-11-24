-- =====================================================================================
-- Tabla: peer_challenges
-- Descripción: Desafíos peer-to-peer entre estudiantes para competir en ejercicios
-- Documentación: docs/03-fase-extensiones/EXT-009-peer-challenges/
-- Epic: EXT-009
-- Created: 2025-11-08
-- =====================================================================================

CREATE TABLE IF NOT EXISTS social_features.peer_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tipo de desafío
    challenge_type TEXT NOT NULL CHECK (challenge_type IN (
        'head_to_head',     -- 1v1 directo
        'multiplayer',      -- Múltiples participantes
        'tournament',       -- Torneo eliminatorio
        'leaderboard'       -- Competencia por ranking
    )),

    -- Creador del desafío
    created_by UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,

    -- Contenido del desafío
    module_id UUID REFERENCES educational_content.modules(id) ON DELETE SET NULL,
    exercise_id UUID REFERENCES educational_content.exercises(id) ON DELETE SET NULL,

    -- Configuración
    title TEXT NOT NULL,
    description TEXT,
    difficulty_level educational_content.difficulty_level,

    -- Participantes
    max_participants INTEGER DEFAULT 2,    -- Máximo de participantes
    min_participants INTEGER DEFAULT 2,    -- Mínimo para iniciar
    current_participants INTEGER DEFAULT 1, -- Contador actual

    -- Timing
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    time_limit_minutes INTEGER,            -- Límite de tiempo por participante

    -- Estado
    status TEXT DEFAULT 'open' CHECK (status IN (
        'open',         -- Abierto para unirse
        'full',         -- Lleno (max participants)
        'in_progress',  -- En curso
        'completed',    -- Terminado
        'cancelled',    -- Cancelado
        'expired'       -- Expirado sin completarse
    )),

    -- Recompensas
    rewards JSONB DEFAULT '{}',             -- {xp: 100, ml_coins: 50, achievement_id: ...}
    winner_bonus_multiplier NUMERIC(3,2) DEFAULT 1.5, -- Bonus para el ganador

    -- Configuración adicional
    allow_spectators BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,         -- Visible en lista pública
    requires_approval BOOLEAN DEFAULT false, -- Requiere aprobación del creador

    -- Reglas personalizadas
    custom_rules JSONB DEFAULT '{}',

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Índices
CREATE INDEX idx_peer_challenges_creator ON social_features.peer_challenges(created_by);
CREATE INDEX idx_peer_challenges_module ON social_features.peer_challenges(module_id);
CREATE INDEX idx_peer_challenges_exercise ON social_features.peer_challenges(exercise_id);
CREATE INDEX idx_peer_challenges_status ON social_features.peer_challenges(status);
CREATE INDEX idx_peer_challenges_type ON social_features.peer_challenges(challenge_type);
CREATE INDEX idx_peer_challenges_open ON social_features.peer_challenges(status, is_public, created_at DESC)
    WHERE status IN ('open', 'in_progress');
CREATE INDEX idx_peer_challenges_timing ON social_features.peer_challenges(start_time, end_time);
CREATE INDEX idx_peer_challenges_created_at ON social_features.peer_challenges(created_at DESC);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_peer_challenges_metadata ON social_features.peer_challenges USING GIN(metadata);
CREATE INDEX idx_peer_challenges_rewards ON social_features.peer_challenges USING GIN(rewards);

-- Trigger para updated_at
CREATE TRIGGER trg_peer_challenges_updated_at
    BEFORE UPDATE ON social_features.peer_challenges
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Comentarios
COMMENT ON TABLE social_features.peer_challenges IS 'Desafíos peer-to-peer entre estudiantes para competir en ejercicios/módulos. Epic EXT-009.';
COMMENT ON COLUMN social_features.peer_challenges.challenge_type IS 'Tipo de competencia (1v1, multiplayer, tournament, leaderboard)';
COMMENT ON COLUMN social_features.peer_challenges.max_participants IS 'Número máximo de participantes permitidos';
COMMENT ON COLUMN social_features.peer_challenges.time_limit_minutes IS 'Límite de tiempo en minutos para completar el desafío';
COMMENT ON COLUMN social_features.peer_challenges.winner_bonus_multiplier IS 'Multiplicador de recompensas para el ganador (default 1.5x)';
