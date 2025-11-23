-- Tabla: user_follows
-- Schema: social_features
-- Descripción: Sistema de seguimiento entre usuarios
-- CREADO: 2025-11-08

CREATE TABLE social_features.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Índices
CREATE INDEX idx_user_follows_follower_id ON social_features.user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON social_features.user_follows(following_id);
CREATE INDEX idx_user_follows_followed_at ON social_features.user_follows(followed_at DESC);

-- Comentarios
COMMENT ON TABLE social_features.user_follows IS 'Users following other users';
COMMENT ON COLUMN social_features.user_follows.follower_id IS 'User who is following';
COMMENT ON COLUMN social_features.user_follows.following_id IS 'User being followed';
