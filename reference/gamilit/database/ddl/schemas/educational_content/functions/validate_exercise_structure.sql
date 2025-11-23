-- =====================================================================================
-- Function: educational_content.validate_exercise_structure
-- Descripción: Valida que la estructura JSONB de content y answer_key sea correcta según la mecánica del ejercicio
-- Documentación: docs/01-fase-alcance-inicial/EAI-002-actividades/especificaciones/ET-EDU-001-mecanicas-ejercicios.md
-- Epic: EAI-002
-- Created: 2025-11-08
-- =====================================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_exercise_structure(
    p_mechanic educational_content.exercise_mechanic,
    p_content JSONB,
    p_answer_key JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- ========== Validación Básica ==========
    -- content y answer_key no pueden ser null o vacíos
    IF p_content IS NULL OR p_content = '{}'::JSONB THEN
        RETURN false;
    END IF;

    IF p_answer_key IS NULL OR p_answer_key = '{}'::JSONB THEN
        RETURN false;
    END IF;

    -- ========== Validaciones Específicas por Mecánica ==========
    CASE p_mechanic
        -- VOCABULARIO
        WHEN 'multiple_choice' THEN
            -- Debe tener: question, options (array >= 2), correct_answer en answer_key
            IF NOT (
                p_content ? 'question'
                AND p_content ? 'options'
                AND jsonb_array_length(p_content->'options') >= 2
                AND p_answer_key ? 'correct_answer'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'fill_in_blank' THEN
            -- Debe tener: sentence/text, blank_position o blanks (array)
            IF NOT (
                (p_content ? 'sentence' OR p_content ? 'text')
                AND (p_content ? 'blank_position' OR p_content ? 'blanks')
                AND p_answer_key ? 'correct_answer'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'matching_pairs' THEN
            -- Debe tener: pairs (array >= 2)
            IF NOT (
                p_content ? 'pairs'
                AND jsonb_array_length(p_content->'pairs') >= 2
                AND p_answer_key ? 'correct_pairs'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'flashcard' THEN
            -- Debe tener: front (pregunta) y back (respuesta) en answer_key
            IF NOT (
                p_content ? 'front'
                AND p_answer_key ? 'back'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'word_search' THEN
            -- Debe tener: grid (matriz), words_to_find (array)
            IF NOT (
                p_content ? 'grid'
                AND p_content ? 'words_to_find'
                AND jsonb_array_length(p_content->'words_to_find') >= 1
                AND p_answer_key ? 'word_positions'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'image_association' THEN
            -- Debe tener: image_url, options o labels
            IF NOT (
                p_content ? 'image_url'
                AND (p_content ? 'options' OR p_content ? 'labels')
                AND p_answer_key ? 'correct_associations'
            ) THEN
                RETURN false;
            END IF;

        -- GRAMÁTICA
        WHEN 'verb_conjugation' THEN
            -- Debe tener: verb_infinitive, tense, subject
            IF NOT (
                p_content ? 'verb_infinitive'
                AND p_content ? 'tense'
                AND p_content ? 'subject'
                AND p_answer_key ? 'correct_conjugation'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'sentence_builder' THEN
            -- Debe tener: words (array para ordenar) o fragments
            IF NOT (
                (p_content ? 'words' OR p_content ? 'fragments')
                AND p_answer_key ? 'correct_order'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'error_detection' THEN
            -- Debe tener: sentence con errores, errors en answer_key
            IF NOT (
                p_content ? 'sentence'
                AND p_answer_key ? 'errors'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'sentence_transformation' THEN
            -- Debe tener: original_sentence, transformation_type
            IF NOT (
                p_content ? 'original_sentence'
                AND p_content ? 'transformation_type'
                AND p_answer_key ? 'transformed_sentence'
            ) THEN
                RETURN false;
            END IF;

        -- LECTURA
        WHEN 'reading_comprehension' THEN
            -- Debe tener: text/passage, questions (array)
            IF NOT (
                (p_content ? 'text' OR p_content ? 'passage')
                AND p_content ? 'questions'
                AND jsonb_array_length(p_content->'questions') >= 1
                AND p_answer_key ? 'answers'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'true_or_false' THEN
            -- Debe tener: statement, correct_answer (boolean)
            IF NOT (
                p_content ? 'statement'
                AND p_answer_key ? 'correct_answer'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'inference' THEN
            -- Debe tener: text, question, possible_inferences
            IF NOT (
                p_content ? 'text'
                AND p_content ? 'question'
                AND p_answer_key ? 'correct_inference'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'sequence_ordering' THEN
            -- Debe tener: items (array para ordenar)
            IF NOT (
                p_content ? 'items'
                AND jsonb_array_length(p_content->'items') >= 2
                AND p_answer_key ? 'correct_order'
            ) THEN
                RETURN false;
            END IF;

        -- ESCRITURA
        WHEN 'free_writing' THEN
            -- Debe tener: prompt, criteria de evaluación
            IF NOT (
                p_content ? 'prompt'
                AND (p_answer_key ? 'evaluation_criteria' OR p_answer_key ? 'rubric')
            ) THEN
                RETURN false;
            END IF;

        WHEN 'sentence_completion' THEN
            -- Debe tener: incomplete_sentence, completion
            IF NOT (
                p_content ? 'incomplete_sentence'
                AND p_answer_key ? 'correct_completion'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'translation' THEN
            -- Debe tener: source_text, source_language, target_language
            IF NOT (
                p_content ? 'source_text'
                AND p_content ? 'source_language'
                AND p_content ? 'target_language'
                AND p_answer_key ? 'correct_translation'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'dictation' THEN
            -- Debe tener: audio_url, expected_text en answer_key
            IF NOT (
                p_content ? 'audio_url'
                AND p_answer_key ? 'expected_text'
            ) THEN
                RETURN false;
            END IF;

        -- AUDIO
        WHEN 'listening_comprehension' THEN
            -- Debe tener: audio_url, questions
            IF NOT (
                p_content ? 'audio_url'
                AND p_content ? 'questions'
                AND jsonb_array_length(p_content->'questions') >= 1
                AND p_answer_key ? 'answers'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'audio_matching' THEN
            -- Debe tener: audio_files (array), labels o options
            IF NOT (
                p_content ? 'audio_files'
                AND (p_content ? 'labels' OR p_content ? 'options')
                AND p_answer_key ? 'correct_matches'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'tone_recognition' THEN
            -- Debe tener: audio_url, tone_options
            IF NOT (
                p_content ? 'audio_url'
                AND p_answer_key ? 'correct_tone'
            ) THEN
                RETURN false;
            END IF;

        -- PRONUNCIACIÓN
        WHEN 'speech_recording' THEN
            -- Debe tener: text_to_read, pronunciation_reference (audio)
            IF NOT (
                p_content ? 'text_to_read'
                AND p_answer_key ? 'pronunciation_reference'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'pronunciation_comparison' THEN
            -- Debe tener: reference_audio, text
            IF NOT (
                p_content ? 'reference_audio'
                AND p_content ? 'text'
            ) THEN
                RETURN false;
            END IF;

        -- CULTURA
        WHEN 'cultural_context' THEN
            -- Debe tener: scenario o situation, questions
            IF NOT (
                (p_content ? 'scenario' OR p_content ? 'situation')
                AND p_answer_key ? 'cultural_explanation'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'historical_timeline' THEN
            -- Debe tener: events (array), period
            IF NOT (
                p_content ? 'events'
                AND jsonb_array_length(p_content->'events') >= 2
                AND p_answer_key ? 'chronological_order'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'cultural_artifact' THEN
            -- Debe tener: artifact_image/description, questions
            IF NOT (
                (p_content ? 'artifact_image' OR p_content ? 'artifact_description')
                AND p_answer_key ? 'cultural_significance'
            ) THEN
                RETURN false;
            END IF;

        WHEN 'traditional_practice' THEN
            -- Debe tener: practice_description, cultural_context
            IF NOT (
                p_content ? 'practice_description'
                AND p_answer_key ? 'correct_understanding'
            ) THEN
                RETURN false;
            END IF;

        -- Si no hay validación específica, aceptar si tiene content y answer_key
        ELSE
            RETURN true;
    END CASE;

    -- Si pasó todas las validaciones
    RETURN true;
END;
$$;

COMMENT ON FUNCTION educational_content.validate_exercise_structure IS 'Valida estructura JSONB de ejercicios según su mecánica. Retorna false si la estructura es inválida. Documentado en ET-EDU-001.';
