-- Tabla: content_tags
-- Schema: educational_content
-- Descripción: Sistema de etiquetado de contenido educativo
-- CREADO: 2025-11-08

CREATE TABLE educational_content.content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('module', 'exercise', 'assignment', 'resource')),
    content_id UUID NOT NULL,
    tag VARCHAR(100) NOT NULL,
    tag_category VARCHAR(50),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_id, tag)
);

-- Índices
CREATE INDEX idx_content_tags_content ON educational_content.content_tags(content_type, content_id);
CREATE INDEX idx_content_tags_tag ON educational_content.content_tags(tag);
CREATE INDEX idx_content_tags_category ON educational_content.content_tags(tag_category) WHERE tag_category IS NOT NULL;
CREATE INDEX idx_content_tags_created_by ON educational_content.content_tags(created_by) WHERE created_by IS NOT NULL;

-- Comentarios
COMMENT ON TABLE educational_content.content_tags IS 'Tags for educational content items';
COMMENT ON COLUMN educational_content.content_tags.content_type IS 'Type of content: module, exercise, assignment, or resource';
COMMENT ON COLUMN educational_content.content_tags.content_id IS 'ID of the content item in its respective table';
COMMENT ON COLUMN educational_content.content_tags.tag IS 'Tag text (e.g., "matemáticas", "lectura", "avanzado")';
COMMENT ON COLUMN educational_content.content_tags.tag_category IS 'Optional category for the tag (e.g., "subject", "difficulty", "topic")';
