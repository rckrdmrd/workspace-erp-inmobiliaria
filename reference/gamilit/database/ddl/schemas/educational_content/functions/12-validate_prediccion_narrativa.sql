-- ============================================================================
-- FUNCIÓN: validate_prediccion_narrativa
-- Descripción: Validador heurístico para predicción narrativa (Módulo 2)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_prediccion_narrativa(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
    p_fuzzy_threshold NUMERIC DEFAULT 0.70,
    p_normalize_text BOOLEAN DEFAULT true,
    p_special_rules JSONB DEFAULT '{}'::jsonb,
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
    v_prediction TEXT;
    v_keywords JSONB;
    v_min_words INTEGER;
    v_word_count INTEGER;
    v_keywords_found INTEGER := 0;
    v_total_keywords INTEGER;
    v_keyword TEXT;
    v_normalized_prediction TEXT;
BEGIN
    -- Extraer predicción enviada
    v_prediction := p_submitted_answer->>'prediction';

    IF v_prediction IS NULL OR TRIM(v_prediction) = '' THEN
        is_correct := false;
        score := 0;
        feedback := 'No se proporcionó ninguna predicción.';
        details := jsonb_build_object('error', 'empty_prediction');
        RETURN;
    END IF;

    -- Extraer configuración
    v_keywords := p_solution->'keywords';
    v_min_words := COALESCE((p_solution->>'min_words')::integer, (p_special_rules->>'min_word_count')::integer, 30);

    -- Contar palabras
    v_word_count := array_length(string_to_array(TRIM(v_prediction), ' '), 1);

    -- Normalizar
    IF p_normalize_text THEN
        v_normalized_prediction := LOWER(gamilit.normalize_text(v_prediction));
    ELSE
        v_normalized_prediction := LOWER(v_prediction);
    END IF;

    -- Contar keywords
    IF v_keywords IS NOT NULL THEN
        v_total_keywords := jsonb_array_length(v_keywords);

        FOR v_keyword IN SELECT jsonb_array_elements_text(v_keywords)
        LOOP
            IF p_normalize_text THEN
                v_keyword := LOWER(gamilit.normalize_text(v_keyword));
            ELSE
                v_keyword := LOWER(v_keyword);
            END IF;

            IF v_normalized_prediction LIKE '%' || v_keyword || '%' THEN
                v_keywords_found := v_keywords_found + 1;
            END IF;
        END LOOP;
    ELSE
        v_total_keywords := 0;
    END IF;

    -- Calcular score (similar a construccion_hipotesis)
    IF v_word_count >= v_min_words THEN
        score := p_max_points / 2;
    ELSE
        score := ROUND((v_word_count::NUMERIC / v_min_words) * (p_max_points / 2));
    END IF;

    IF v_total_keywords > 0 THEN
        score := score + ROUND((v_keywords_found::NUMERIC / v_total_keywords) * (p_max_points / 2));
    END IF;

    is_correct := (score >= (p_max_points * 0.70));

    -- Feedback
    IF is_correct THEN
        feedback := format('Buena predicción narrativa. %s palabras, %s/%s keywords.',
                          v_word_count, v_keywords_found, v_total_keywords);
    ELSE
        feedback := format('Predicción incompleta. Necesitas al menos %s palabras (tienes %s).',
                          v_min_words, v_word_count);
    END IF;

    -- Details
    details := jsonb_build_object(
        'word_count', v_word_count,
        'min_words_required', v_min_words,
        'keywords_found', v_keywords_found,
        'total_keywords', v_total_keywords,
        'validation_type', 'heuristic'
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_prediccion_narrativa IS
'Validador heurístico para predicción narrativa (Módulo 2).
Similar a construccion_hipotesis pero con umbral de palabras más alto (30).';
