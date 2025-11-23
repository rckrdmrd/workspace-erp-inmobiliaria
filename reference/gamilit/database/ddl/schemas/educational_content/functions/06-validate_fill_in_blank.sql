-- ============================================================================
-- FUNCIÓN: validate_fill_in_blank
-- Descripción: Validador para ejercicios tipo completar espacios
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_fill_in_blank(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
    p_case_sensitive BOOLEAN DEFAULT false,
    p_normalize_text BOOLEAN DEFAULT true,
    p_fuzzy_threshold NUMERIC DEFAULT NULL,
    p_allow_partial_credit BOOLEAN DEFAULT true,
    OUT is_correct BOOLEAN,
    OUT score INTEGER,
    OUT feedback TEXT,
    OUT details JSONB
)
RETURNS RECORD
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_correct_answers JSONB;
    v_submitted_blanks JSONB;
    v_total_blanks INTEGER;
    v_correct_blanks INTEGER := 0;
    v_blank_id TEXT;
    v_correct_answer TEXT;
    v_submitted_answer TEXT;
    v_similarity NUMERIC;
    v_results JSONB := '[]'::jsonb;
BEGIN
    -- Extraer respuestas correctas y respuestas enviadas
    v_correct_answers := p_solution->'correctAnswers';
    v_submitted_blanks := p_submitted_answer->'blanks';

    IF v_correct_answers IS NULL OR v_submitted_blanks IS NULL THEN
        RAISE EXCEPTION 'Invalid fill-in-blank format';
    END IF;

    v_total_blanks := (SELECT COUNT(*) FROM jsonb_object_keys(v_correct_answers));

    -- Validar cada blank
    FOR v_blank_id IN SELECT jsonb_object_keys(v_correct_answers)
    LOOP
        v_correct_answer := v_correct_answers->>v_blank_id;
        v_submitted_answer := v_submitted_blanks->>v_blank_id;

        -- Normalizar
        IF p_normalize_text THEN
            v_correct_answer := gamilit.normalize_text(v_correct_answer);
            v_submitted_answer := gamilit.normalize_text(COALESCE(v_submitted_answer, ''));
        END IF;

        -- Case-sensitive?
        IF NOT p_case_sensitive THEN
            v_correct_answer := UPPER(TRIM(v_correct_answer));
            v_submitted_answer := UPPER(TRIM(v_submitted_answer));
        ELSE
            v_correct_answer := TRIM(v_correct_answer);
            v_submitted_answer := TRIM(v_submitted_answer);
        END IF;

        -- Fuzzy matching?
        IF p_fuzzy_threshold IS NOT NULL THEN
            v_similarity := similarity(v_correct_answer, v_submitted_answer);

            IF v_similarity >= p_fuzzy_threshold THEN
                v_correct_blanks := v_correct_blanks + 1;
                v_results := v_results || jsonb_build_object(
                    'blank_id', v_blank_id,
                    'is_correct', true,
                    'similarity', v_similarity
                );
            ELSE
                v_results := v_results || jsonb_build_object(
                    'blank_id', v_blank_id,
                    'is_correct', false,
                    'similarity', v_similarity
                );
            END IF;
        ELSE
            -- Exact match
            IF v_submitted_answer = v_correct_answer THEN
                v_correct_blanks := v_correct_blanks + 1;
                v_results := v_results || jsonb_build_object(
                    'blank_id', v_blank_id,
                    'is_correct', true
                );
            ELSE
                v_results := v_results || jsonb_build_object(
                    'blank_id', v_blank_id,
                    'is_correct', false
                );
            END IF;
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_blanks = v_total_blanks);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_blanks::NUMERIC / v_total_blanks) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := format('¡Excelente! Todos los %s espacios correctos.', v_total_blanks);
    ELSE
        feedback := format('Tienes %s/%s espacios correctos.',
                          v_correct_blanks, v_total_blanks);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_blanks', v_total_blanks,
        'correct_blanks', v_correct_blanks,
        'percentage', ROUND((v_correct_blanks::NUMERIC / v_total_blanks) * 100),
        'fuzzy_matching_used', (p_fuzzy_threshold IS NOT NULL),
        'results_per_blank', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_fill_in_blank IS
'Validador para ejercicios tipo completar espacios.
Soporta fuzzy matching con threshold configurable.';
