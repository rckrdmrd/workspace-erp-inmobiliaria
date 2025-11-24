-- Tabla: social_interactions
-- Schema: social_features
-- Descripción: Registro de interacciones sociales entre usuarios
-- CREADO: 2025-11-08

CREATE TABLE social_features.social_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share', 'mention', 'badge_given', 'help_request', 'help_provided')),
    content_type VARCHAR(50),
    content_id UUID,
    interaction_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_social_interactions_user_id ON social_features.social_interactions(user_id);
CREATE INDEX idx_social_interactions_target_user_id ON social_features.social_interactions(target_user_id) WHERE target_user_id IS NOT NULL;
CREATE INDEX idx_social_interactions_type ON social_features.social_interactions(interaction_type);
CREATE INDEX idx_social_interactions_content ON social_features.social_interactions(content_type, content_id) WHERE content_id IS NOT NULL;
CREATE INDEX idx_social_interactions_created_at ON social_features.social_interactions(created_at DESC);

-- Comentarios
COMMENT ON TABLE social_features.social_interactions IS 'Social interactions between users';
COMMENT ON COLUMN social_features.social_interactions.interaction_type IS 'Type: like, comment, share, mention, badge_given, help_request, help_provided';
COMMENT ON COLUMN social_features.social_interactions.content_type IS 'Type of content being interacted with (optional)';
COMMENT ON COLUMN social_features.social_interactions.content_id IS 'ID of content being interacted with (optional)';
COMMENT ON COLUMN social_features.social_interactions.interaction_data IS 'Additional data about the interaction (JSONB)';
