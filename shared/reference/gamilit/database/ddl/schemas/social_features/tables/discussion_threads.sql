-- Tabla: discussion_threads
-- Schema: social_features
-- Descripción: Hilos de discusión en aulas/grupos
-- CREADO: 2025-11-08

CREATE TABLE social_features.discussion_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES social_features.classrooms(id) ON DELETE CASCADE,
    team_id UUID REFERENCES social_features.teams(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    replies_count INTEGER NOT NULL DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (classroom_id IS NOT NULL OR team_id IS NOT NULL)
);

-- Índices
CREATE INDEX idx_discussion_threads_classroom_id ON social_features.discussion_threads(classroom_id) WHERE classroom_id IS NOT NULL;
CREATE INDEX idx_discussion_threads_team_id ON social_features.discussion_threads(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_discussion_threads_created_by ON social_features.discussion_threads(created_by);
CREATE INDEX idx_discussion_threads_is_pinned ON social_features.discussion_threads(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_discussion_threads_last_reply ON social_features.discussion_threads(last_reply_at DESC NULLS LAST);
CREATE INDEX idx_discussion_threads_created_at ON social_features.discussion_threads(created_at DESC);

-- Comentarios
COMMENT ON TABLE social_features.discussion_threads IS 'Discussion threads in classrooms or teams';
COMMENT ON COLUMN social_features.discussion_threads.is_pinned IS 'Whether thread is pinned to top of list';
COMMENT ON COLUMN social_features.discussion_threads.is_locked IS 'Whether thread is locked (no new replies)';
COMMENT ON COLUMN social_features.discussion_threads.replies_count IS 'Number of replies in this thread';

-- Trigger para updated_at
CREATE TRIGGER update_discussion_threads_updated_at
    BEFORE UPDATE ON social_features.discussion_threads
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
