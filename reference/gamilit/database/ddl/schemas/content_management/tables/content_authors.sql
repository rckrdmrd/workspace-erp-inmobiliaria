-- Tabla: content_authors
-- Schema: content_management
-- Descripción: Autores de contenido educativo
-- CREADO: 2025-11-08

CREATE TABLE content_management.content_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    bio TEXT,
    expertise_areas TEXT[],
    total_content_created INTEGER DEFAULT 0,
    total_content_published INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Índices
CREATE INDEX idx_content_authors_user_id ON content_management.content_authors(user_id);
CREATE INDEX idx_content_authors_is_featured ON content_management.content_authors(is_featured) WHERE is_featured = true;
CREATE INDEX idx_content_authors_is_verified ON content_management.content_authors(is_verified) WHERE is_verified = true;
CREATE INDEX idx_content_authors_average_rating ON content_management.content_authors(average_rating DESC NULLS LAST);
CREATE INDEX idx_content_authors_expertise_gin ON content_management.content_authors USING GIN(expertise_areas);

-- Comentarios
COMMENT ON TABLE content_management.content_authors IS 'Content authors (teachers, content creators)';
COMMENT ON COLUMN content_management.content_authors.display_name IS 'Public display name for the author';
COMMENT ON COLUMN content_management.content_authors.expertise_areas IS 'Array of expertise areas (e.g., ["matemáticas", "ciencias"])';
COMMENT ON COLUMN content_management.content_authors.is_featured IS 'Whether author is featured on platform';
COMMENT ON COLUMN content_management.content_authors.is_verified IS 'Whether author is verified by platform';

-- Trigger para updated_at
CREATE TRIGGER update_content_authors_updated_at
    BEFORE UPDATE ON content_management.content_authors
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
