-- ============================================================================
-- FUNCIÓN: validate_debate_digital
-- Descripción: Validador heurístico para debate digital (Módulo 3)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_debate_digital(
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
    v_argument TEXT;
    v_counterargument TEXT;
    v_keywords JSONB;
    v_min_words INTEGER;
    v_total_word_count INTEGER;
    v_argument_word_count INTEGER;
    v_counterargument_word_count INTEGER;
    v_keywords_found INTEGER := 0;
    v_total_keywords INTEGER;
    v_keyword TEXT;
    v_normalized_text TEXT;
    v_keyword_threshold NUMERIC;
    v_structure_bonus INTEGER := 0;
    v_has_both_parts BOOLEAN := false;
BEGIN
    -- Extraer argumento y contraargumento enviados
    v_argument := p_submitted_answer->>'argument';
    v_counterargument := p_submitted_answer->>'counterargument';

    IF (v_argument IS NULL OR TRIM(v_argument) = '')
       AND (v_counterargument IS NULL OR TRIM(v_counterargument) = '') THEN
        is_correct := false;
        score := 0;
        feedback := 'No se proporcionó ningún argumento para el debate.';
        details := jsonb_build_object('error', 'empty_debate');
        RETURN;
    END IF;

    -- Extraer configuración (mínimo 150 palabras para debates)
    v_keywords := p_solution->'keywords';
    v_min_words := COALESCE((p_solution->>'min_words')::integer, (p_special_rules->>'min_word_count')::integer, 150);
    v_keyword_threshold := COALESCE((p_special_rules->>'keywords_threshold')::numeric, 0.60);

    -- Contar palabras en argumento
    v_argument_word_count := CASE
        WHEN v_argument IS NOT NULL AND TRIM(v_argument) != ''
        THEN array_length(string_to_array(TRIM(v_argument), ' '), 1)
        ELSE 0
    END;

    -- Contar palabras en contraargumento
    v_counterargument_word_count := CASE
        WHEN v_counterargument IS NOT NULL AND TRIM(v_counterargument) != ''
        THEN array_length(string_to_array(TRIM(v_counterargument), ' '), 1)
        ELSE 0
    END;

    v_total_word_count := v_argument_word_count + v_counterargument_word_count;
    v_has_both_parts := (v_argument_word_count > 0 AND v_counterargument_word_count > 0);

    -- Normalizar texto para búsqueda de keywords
    IF p_normalize_text THEN
        v_normalized_text := LOWER(gamilit.normalize_text(COALESCE(v_argument, '') || ' ' || COALESCE(v_counterargument, '')));
    ELSE
        v_normalized_text := LOWER(COALESCE(v_argument, '') || ' ' || COALESCE(v_counterargument, ''));
    END IF;

    -- Contar keywords encontradas
    IF v_keywords IS NOT NULL THEN
        v_total_keywords := jsonb_array_length(v_keywords);

        FOR v_keyword IN SELECT jsonb_array_elements_text(v_keywords)
        LOOP
            IF p_normalize_text THEN
                v_keyword := LOWER(gamilit.normalize_text(v_keyword));
            ELSE
                v_keyword := LOWER(v_keyword);
            END IF;

            IF v_normalized_text LIKE '%' || v_keyword || '%' THEN
                v_keywords_found := v_keywords_found + 1;
            END IF;
        END LOOP;
    ELSE
        v_total_keywords := 0;
    END IF;

    -- Bonus por estructura de debate (si tiene ambas partes)
    IF v_has_both_parts THEN
        v_structure_bonus := 10;
    END IF;

    -- Bonus adicional por palabras de refutación
    IF v_normalized_text LIKE '%sin embargo%'
       OR v_normalized_text LIKE '%por el contrario%'
       OR v_normalized_text LIKE '%aunque%'
       OR v_normalized_text LIKE '%no obstante%'
       OR v_normalized_text LIKE '%en cambio%' THEN
        v_structure_bonus := v_structure_bonus + 5;
    END IF;

    -- Calcular score heurístico
    -- 40% por longitud mínima + 40% por keywords + hasta 20% bonus estructura
    IF v_total_word_count >= v_min_words THEN
        score := ROUND(p_max_points * 0.40);
    ELSE
        score := ROUND((v_total_word_count::NUMERIC / v_min_words) * (p_max_points * 0.40));
    END IF;

    IF v_total_keywords > 0 THEN
        IF (v_keywords_found::NUMERIC / v_total_keywords) >= v_keyword_threshold THEN
            score := score + ROUND(p_max_points * 0.40);
        ELSE
            score := score + ROUND((v_keywords_found::NUMERIC / v_total_keywords) * (p_max_points * 0.40));
        END IF;
    END IF;

    -- Agregar bonus por estructura
    score := LEAST(score + v_structure_bonus, p_max_points);

    is_correct := (score >= (p_max_points * 0.70));

    -- Feedback
    IF is_correct THEN
        feedback := format('Excelente debate. Total: %s palabras. Keywords: %s/%s. Estructura completa: %s.',
                          v_total_word_count, v_keywords_found, v_total_keywords,
                          CASE WHEN v_has_both_parts THEN 'Sí' ELSE 'No' END);
    ELSE
        feedback := format('Debate incompleto. Necesitas al menos %s palabras (tienes %s)%s.',
                          v_min_words, v_total_word_count,
                          CASE WHEN NOT v_has_both_parts THEN ' y ambas partes (argumento y contraargumento)' ELSE '' END);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_word_count', v_total_word_count,
        'argument_word_count', v_argument_word_count,
        'counterargument_word_count', v_counterargument_word_count,
        'min_words_required', v_min_words,
        'keywords_found', v_keywords_found,
        'total_keywords', v_total_keywords,
        'has_both_parts', v_has_both_parts,
        'structure_bonus', v_structure_bonus,
        'validation_type', 'heuristic'
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_debate_digital IS
'Validador heurístico para debate digital (Módulo 3 - Pensamiento Crítico).
Verifica longitud mínima (150+ palabras), presencia de argumento y contraargumento, keywords.
NO valida calidad real de los argumentos - solo criterios básicos.';
