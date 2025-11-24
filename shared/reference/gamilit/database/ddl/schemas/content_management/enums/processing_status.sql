-- =====================================================================================
-- ENUM: content_management.processing_status
-- =====================================================================================
-- Description: Estados del ciclo de vida de procesamiento de recursos multimedia
-- Schema: content_management
-- Dependencies: None
-- Used by: media_resources table
-- Created: 2025-11-11 (DB-111 - Corrección ENUMs faltantes)
-- Status: PRODUCTION
-- =====================================================================================

CREATE TYPE content_management.processing_status AS ENUM (
    'uploading',    -- Subida en progreso
    'processing',   -- Procesamiento/transcoding en curso
    'ready',        -- Listo para uso
    'error',        -- Error en procesamiento
    'optimizing'    -- Optimización adicional (compresión, thumbnails, etc.)
);

-- =====================================================================================
-- FLUJO TÍPICO:
-- uploading → processing → optimizing → ready
--           ↓
--         error (puede reintentar a processing)
--
-- NOTAS:
-- - Sincronizado con Backend: ProcessingStatusEnum en enums.constants.ts
-- - Usado por: educational_content.media_resources
-- - Estados permiten tracking de pipelines CDN/procesamiento
-- =====================================================================================

COMMENT ON TYPE content_management.processing_status IS
'Estados del ciclo de vida de procesamiento de recursos multimedia.
Sincronizado con Backend ProcessingStatusEnum.';
