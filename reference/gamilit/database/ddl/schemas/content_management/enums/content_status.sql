-- =====================================================
-- ENUM: content_management.content_status
-- Descripción: Estados del ciclo de vida del contenido
-- Epic: Corrección alineación backend-BD
-- Created: 2025-11-09
-- =====================================================

CREATE TYPE content_management.content_status AS ENUM (
    'draft',
    'published',
    'archived',
    'under_review'
);

COMMENT ON TYPE content_management.content_status IS
'Estados del ciclo de vida del contenido educativo.
Usado en: marie_curie_content, flagged_content.
Sincronizado con backend ContentStatusEnum (apps/backend/src/shared/constants/enums.constants.ts:378).';
