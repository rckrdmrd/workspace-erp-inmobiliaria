-- =====================================================================================
-- ENUM: educational_content.exercise_mechanic
-- Descripción: 31 mecánicas de ejercicios agrupadas en 7 categorías pedagógicas
-- Documentación: docs/01-fase-alcance-inicial/EAI-002-actividades/especificaciones/ET-EDU-001-mecanicas-ejercicios.md
-- Epic: EAI-002
-- Created: 2025-11-08
-- =====================================================================================

CREATE TYPE educational_content.exercise_mechanic AS ENUM (
    -- ========== VOCABULARIO (6 tipos) ==========
    'multiple_choice',        -- Selección múltiple con opciones
    'fill_in_blank',          -- Completar espacios en blanco
    'matching_pairs',         -- Emparejar términos
    'flashcard',              -- Tarjetas de memoria
    'word_search',            -- Sopa de letras
    'image_association',      -- Asociar imágenes con palabras

    -- ========== GRAMÁTICA (8 tipos) ==========
    'verb_conjugation',       -- Conjugación de verbos
    'sentence_builder',       -- Construir oraciones
    'error_detection',        -- Detectar errores gramaticales
    'sentence_transformation',-- Transformar oraciones
    'pronoun_selection',      -- Selección de pronombres
    'possessive_forms',       -- Formas posesivas
    'pluralization',          -- Pluralización
    'aspect_markers',         -- Marcadores de aspecto gramatical

    -- ========== LECTURA (4 tipos) ==========
    'reading_comprehension',  -- Comprensión lectora
    'true_or_false',          -- Verdadero o falso
    'inference',              -- Inferencias del texto
    'sequence_ordering',      -- Ordenar secuencias

    -- ========== ESCRITURA (4 tipos) ==========
    'free_writing',           -- Escritura libre
    'sentence_completion',    -- Completar oraciones
    'translation',            -- Traducción
    'dictation',              -- Dictado

    -- ========== AUDIO (3 tipos) ==========
    'listening_comprehension',-- Comprensión auditiva
    'audio_matching',         -- Emparejar audio
    'tone_recognition',       -- Reconocimiento de tonos

    -- ========== PRONUNCIACIÓN (2 tipos) ==========
    'speech_recording',       -- Grabación de voz
    'pronunciation_comparison',-- Comparación de pronunciación

    -- ========== CULTURA (4 tipos) ==========
    'cultural_context',       -- Contexto cultural
    'historical_timeline',    -- Línea de tiempo histórica
    'cultural_artifact',      -- Artefactos culturales
    'traditional_practice'    -- Prácticas tradicionales
);

COMMENT ON TYPE educational_content.exercise_mechanic IS '31 mecánicas de ejercicios agrupadas en 7 categorías pedagógicas: vocabulario (6), gramática (8), lectura (4), escritura (4), audio (3), pronunciación (2), cultura (4). Documentado en ET-EDU-001.';
