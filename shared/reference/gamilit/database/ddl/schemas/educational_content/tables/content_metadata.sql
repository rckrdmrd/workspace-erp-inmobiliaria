-- Tabla: content_metadata
-- Schema: educational_content
-- Descripción: Metadatos adicionales para contenido educativo
-- CREADO: 2025-11-08

CREATE TABLE educational_content.content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('module', 'exercise', 'assignment', 'resource')),
    content_id UUID NOT NULL,
    metadata_key VARCHAR(100) NOT NULL,
    metadata_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_id, metadata_key)
);

-- Índices
CREATE INDEX idx_content_metadata_content ON educational_content.content_metadata(content_type, content_id);
CREATE INDEX idx_content_metadata_key ON educational_content.content_metadata(metadata_key);
CREATE INDEX idx_content_metadata_value_gin ON educational_content.content_metadata USING GIN(metadata_value);

-- Comentarios
COMMENT ON TABLE educational_content.content_metadata IS 'Additional metadata for educational content items';
COMMENT ON COLUMN educational_content.content_metadata.content_type IS 'Type of content: module, exercise, assignment, or resource';
COMMENT ON COLUMN educational_content.content_metadata.content_id IS 'ID of the content item in its respective table';
COMMENT ON COLUMN educational_content.content_metadata.metadata_key IS 'Metadata key (e.g., "difficulty_level", "estimated_time", "standards")';
COMMENT ON COLUMN educational_content.content_metadata.metadata_value IS 'JSONB value for flexible metadata storage';

-- Trigger para updated_at
CREATE TRIGGER update_content_metadata_updated_at
    BEFORE UPDATE ON educational_content.content_metadata
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
