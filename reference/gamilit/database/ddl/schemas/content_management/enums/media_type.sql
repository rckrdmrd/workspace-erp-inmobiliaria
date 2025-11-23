-- =====================================================================================
-- ENUM: content_management.media_type
-- =====================================================================================
-- Description: Tipos de recursos multimedia soportados por la plataforma
-- Schema: content_management
-- Dependencies: None
-- Used by: media_resources table
-- Created: 2025-11-11 (DB-111 - Corrección ENUMs faltantes)
-- Status: PRODUCTION
-- =====================================================================================

CREATE TYPE content_management.media_type AS ENUM (
    'image',        -- Imágenes estáticas (JPG, PNG, GIF, WebP)
    'video',        -- Videos (MP4, WebM, etc.)
    'audio',        -- Audio (MP3, WAV, OGG)
    'document',     -- Documentos (PDF, DOCX, etc.)
    'interactive',  -- Contenido interactivo (H5P, etc.)
    'animation'     -- Animaciones (SVG animado, Lottie, etc.)
);

-- =====================================================================================
-- NOTAS:
-- - Sincronizado con Backend: MediaTypeEnum en enums.constants.ts
-- - Usado por: educational_content.media_resources
-- - Valores alineados con capacidades CDN y procesamiento
-- =====================================================================================

COMMENT ON TYPE content_management.media_type IS
'Tipos de recursos multimedia soportados por la plataforma GAMILIT.
Sincronizado con Backend MediaTypeEnum.';
