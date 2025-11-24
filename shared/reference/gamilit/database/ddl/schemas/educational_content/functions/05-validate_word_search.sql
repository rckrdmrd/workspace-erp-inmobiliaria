-- ============================================================================
-- FUNCIÓN: validate_word_search
-- Descripción: Validador para ejercicios tipo sopa de letras
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_word_search(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
    p_allow_partial_credit BOOLEAN DEFAULT true,
    p_normalize_text BOOLEAN DEFAULT true,
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
    v_all_words JSONB;
    v_found_words JSONB;
    v_total_words INTEGER;
    v_correct_found INTEGER := 0;
    v_word TEXT;
    v_normalized_found TEXT[];
    v_normalized_word TEXT;
BEGIN
    -- Extraer palabras esperadas y encontradas
    v_all_words := p_solution->'allWords';
    v_found_words := p_submitted_answer->'words';

    IF v_all_words IS NULL OR v_found_words IS NULL THEN
        RAISE EXCEPTION 'Invalid word search format';
    END IF;

    v_total_words := jsonb_array_length(v_all_words);

    -- Normalizar palabras encontradas
    IF p_normalize_text THEN
        SELECT array_agg(UPPER(gamilit.normalize_text(value::text)))
        INTO v_normalized_found
        FROM jsonb_array_elements_text(v_found_words);
    ELSE
        SELECT array_agg(UPPER(value::text))
        INTO v_normalized_found
        FROM jsonb_array_elements_text(v_found_words);
    END IF;

    -- Contar palabras correctas encontradas
    FOR v_word IN SELECT jsonb_array_elements_text(v_all_words)
    LOOP
        IF p_normalize_text THEN
            v_normalized_word := UPPER(gamilit.normalize_text(v_word));
        ELSE
            v_normalized_word := UPPER(v_word);
        END IF;

        IF v_normalized_word = ANY(v_normalized_found) THEN
            v_correct_found := v_correct_found + 1;
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_found = v_total_words);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_found::NUMERIC / v_total_words) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := format('¡Excelente! Encontraste todas las %s palabras.', v_total_words);
    ELSE
        feedback := format('Encontraste %s/%s palabras correctas.',
                          v_correct_found, v_total_words);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_words', v_total_words,
        'words_found', v_correct_found,
        'percentage', ROUND((v_correct_found::NUMERIC / v_total_words) * 100)
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_word_search IS
'Validador para ejercicios tipo sopa de letras.
Verifica cuántas palabras esperadas fueron encontradas.';
