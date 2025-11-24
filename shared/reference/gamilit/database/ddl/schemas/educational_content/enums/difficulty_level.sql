-- =====================================================
-- ENUM: educational_content.difficulty_level
-- Descripción: 8 niveles de dificultad para contenido educativo
-- Documentación: docs/02-especificaciones-tecnicas/tipos-compartidos/TYPES-EDUCATIONAL.md
-- Epic: EAI-002
-- Created: 2025-11-08
-- =====================================================

-- =====================================================
-- VERSIÓN: 2.0 (GAP-3: Migración a estándar CEFR)
-- Fecha migración: 2025-11-11
-- =====================================================

CREATE TYPE educational_content.difficulty_level AS ENUM (
    'beginner',            -- A1: Nivel básico de supervivencia (0-200 palabras)
    'elementary',          -- A2: Nivel elemental (200-500 palabras)
    'pre_intermediate',    -- B1: Pre-intermedio (500-1000 palabras)
    'intermediate',        -- B2: Intermedio (1000-2000 palabras)
    'upper_intermediate',  -- C1: Intermedio avanzado (2000-4000 palabras)
    'advanced',            -- C2: Avanzado (4000-8000 palabras)
    'proficient',          -- C2+: Competente (8000-15000 palabras)
    'native'               -- Nativo: Dominio total (15000+ palabras)
);

COMMENT ON TYPE educational_content.difficulty_level IS
'8 niveles CEFR (Marco Común Europeo de Referencia para las lenguas).
Orden ascendente: beginner (A1) → elementary (A2) → pre_intermediate (B1) → intermediate (B2) → upper_intermediate (C1) → advanced (C2) → proficient (C2+) → native.
Criterios definidos en: difficulty_criteria table.
Usado en: modules, exercises, user_current_level, user_difficulty_progress.';
