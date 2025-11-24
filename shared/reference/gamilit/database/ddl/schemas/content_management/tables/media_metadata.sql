-- Tabla: media_metadata
-- Schema: content_management
-- Descripción: Metadatos extendidos para archivos multimedia
-- CREADO: 2025-11-08

CREATE TABLE content_management.media_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID NOT NULL REFERENCES content_management.media_files(id) ON DELETE CASCADE,
    duration_seconds INTEGER,
    width INTEGER,
    height INTEGER,
    resolution VARCHAR(20),
    bitrate INTEGER,
    codec VARCHAR(50),
    thumbnail_url TEXT,
    alt_text TEXT,
    caption TEXT,
    copyright_info TEXT,
    exif_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(media_file_id)
);

-- Índices
CREATE INDEX idx_media_metadata_media_file_id ON content_management.media_metadata(media_file_id);
CREATE INDEX idx_media_metadata_resolution ON content_management.media_metadata(resolution) WHERE resolution IS NOT NULL;
CREATE INDEX idx_media_metadata_exif_gin ON content_management.media_metadata USING GIN(exif_data) WHERE exif_data IS NOT NULL;

-- Comentarios
COMMENT ON TABLE content_management.media_metadata IS 'Extended metadata for media files (video, audio, images)';
COMMENT ON COLUMN content_management.media_metadata.duration_seconds IS 'Duration for video/audio files (seconds)';
COMMENT ON COLUMN content_management.media_metadata.width IS 'Width in pixels for images/videos';
COMMENT ON COLUMN content_management.media_metadata.height IS 'Height in pixels for images/videos';
COMMENT ON COLUMN content_management.media_metadata.exif_data IS 'EXIF data from images (JSONB)';

-- Trigger para updated_at
CREATE TRIGGER update_media_metadata_updated_at
    BEFORE UPDATE ON content_management.media_metadata
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
