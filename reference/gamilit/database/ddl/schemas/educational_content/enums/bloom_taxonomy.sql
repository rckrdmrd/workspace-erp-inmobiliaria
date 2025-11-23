-- =====================================================================================
-- ENUM: educational_content.bloom_taxonomy
-- Descripción: Niveles de la Taxonomía de Bloom para clasificación cognitiva
-- Documentación: docs/01-fase-alcance-inicial/EAI-002-actividades/especificaciones/ET-EDU-003-taxonomia-bloom.md
-- Epic: EAI-002
-- Created: 2025-11-08
-- =====================================================================================

CREATE TYPE educational_content.bloom_taxonomy AS ENUM (
    'remember',    -- Nivel 1: Recordar - Recuperar información de la memoria
    'understand',  -- Nivel 2: Comprender - Construir significado a partir de mensajes
    'apply',       -- Nivel 3: Aplicar - Usar información en situaciones nuevas
    'analyze',     -- Nivel 4: Analizar - Descomponer en partes y encontrar relaciones
    'evaluate',    -- Nivel 5: Evaluar - Hacer juicios basados en criterios
    'create'       -- Nivel 6: Crear - Producir trabajo original o nuevo
);

COMMENT ON TYPE educational_content.bloom_taxonomy IS 'Taxonomía de Bloom: 6 niveles cognitivos desde recordar (básico) hasta crear (avanzado). Documentado en ET-EDU-003.';
