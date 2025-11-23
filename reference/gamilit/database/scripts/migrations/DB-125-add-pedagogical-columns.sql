-- =====================================================
-- Migration: Add Pedagogical Content Columns to Exercises
-- Task: DB-125
-- Date: 2025-11-19
-- Description: Agrega 4 columnas TEXT para contenido pedagógico expandido
-- Scope: 15 ejercicios en módulos 1-3 (módulos 4-5 pendientes en DB-126)
-- Author: Database Agent
-- =====================================================

SET search_path TO educational_content, public;

-- Verificar que estamos en el schema correcto
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'educational_content'
          AND table_name = 'exercises'
    ) THEN
        RAISE EXCEPTION 'Tabla educational_content.exercises no encontrada';
    END IF;
END $$;

-- Agregar columnas (idempotente con IF NOT EXISTS)
ALTER TABLE educational_content.exercises
ADD COLUMN IF NOT EXISTS objective TEXT,
ADD COLUMN IF NOT EXISTS how_to_solve TEXT,
ADD COLUMN IF NOT EXISTS recommended_strategy TEXT,
ADD COLUMN IF NOT EXISTS pedagogical_notes TEXT;

-- Agregar comentarios (siempre se ejecutan)
COMMENT ON COLUMN educational_content.exercises.objective IS
'Objetivo pedagógico expandido del ejercicio (200-500 palabras). Describe qué aprenderá el estudiante y por qué es importante según el modelo de comprensión lectora de Daniel Cassany.';

COMMENT ON COLUMN educational_content.exercises.how_to_solve IS
'Guía detallada de cómo resolver el ejercicio (300-800 palabras). Pasos pedagógicos, estrategias de pensamiento, y consejos para completar exitosamente el ejercicio.';

COMMENT ON COLUMN educational_content.exercises.recommended_strategy IS
'Estrategias recomendadas para resolver eficientemente (100-300 palabras). Tips, trucos, y mejores prácticas para estudiantes.';

COMMENT ON COLUMN educational_content.exercises.pedagogical_notes IS
'Notas metodológicas para educadores (100-400 palabras). Contexto pedagógico, relación con competencias, y alineación con modelo Cassany.';

-- Validación post-migration
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO col_count
    FROM information_schema.columns
    WHERE table_schema = 'educational_content'
      AND table_name = 'exercises'
      AND column_name IN ('objective', 'how_to_solve', 'recommended_strategy', 'pedagogical_notes');

    IF col_count = 4 THEN
        RAISE NOTICE '✓ Migration DB-125 successful: 4 pedagogical columns added to exercises table';
    ELSE
        RAISE EXCEPTION '✗ Migration DB-125 failed: Expected 4 columns, found %', col_count;
    END IF;
END $$;
