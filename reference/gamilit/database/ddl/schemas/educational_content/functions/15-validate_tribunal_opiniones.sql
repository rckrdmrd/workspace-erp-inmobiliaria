-- ============================================================================
-- FUNCIÓN: validate_tribunal_opiniones
-- Descripción: Validador heurístico para tribunal de opiniones (Módulo 3)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_tribunal_opiniones(
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
    v_opinion TEXT;
    v_keywords JSONB;
    v_min_words INTEGER;
    v_word_count INTEGER;
    v_keywords_found INTEGER := 0;
    v_total_keywords INTEGER;
    v_keyword TEXT;
    v_normalized_opinion TEXT;
    v_keyword_threshold NUMERIC;
    v_argumentation_structure_bonus INTEGER := 0;
BEGIN
    -- Extraer opinión enviada
    v_opinion := p_submitted_answer->>'opinion';

    IF v_opinion IS NULL OR TRIM(v_opinion) = '' THEN
        is_correct := false;
        score := 0;
        feedback := 'No se proporcionó ninguna opinión argumentada.';
        details := jsonb_build_object('error', 'empty_opinion');
        RETURN;
    END IF;

    -- Extraer configuración (mínimo 100 palabras para opiniones)
    v_keywords := p_solution->'keywords';
    v_min_words := COALESCE((p_solution->>'min_words')::integer, (p_special_rules->>'min_word_count')::integer, 100);
    v_keyword_threshold := COALESCE((p_special_rules->>'keywords_threshold')::numeric, 0.60);

    -- Contar palabras
    v_word_count := array_length(string_to_array(TRIM(v_opinion), ' '), 1);

    -- Normalizar texto
    IF p_normalize_text THEN
        v_normalized_opinion := LOWER(gamilit.normalize_text(v_opinion));
    ELSE
        v_normalized_opinion := LOWER(v_opinion);
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

            IF v_normalized_opinion LIKE '%' || v_keyword || '%' THEN
                v_keywords_found := v_keywords_found + 1;
            END IF;
        END LOOP;
    ELSE
        v_total_keywords := 0;
    END IF;

    -- Bonus por estructura argumentativa (si contiene palabras clave estructurales)
    IF v_normalized_opinion LIKE '%en mi opinion%'
       OR v_normalized_opinion LIKE '%considero que%'
       OR v_normalized_opinion LIKE '%porque%'
       OR v_normalized_opinion LIKE '%por lo tanto%'
       OR v_normalized_opinion LIKE '%en conclusion%' THEN
        v_argumentation_structure_bonus := 5;
    END IF;

    -- Calcular score heurístico
    -- 45% por longitud mínima + 45% por keywords + 10% bonus estructura
    IF v_word_count >= v_min_words THEN
        score := ROUND(p_max_points * 0.45);
    ELSE
        score := ROUND((v_word_count::NUMERIC / v_min_words) * (p_max_points * 0.45));
    END IF;

    IF v_total_keywords > 0 THEN
        IF (v_keywords_found::NUMERIC / v_total_keywords) >= v_keyword_threshold THEN
            score := score + ROUND(p_max_points * 0.45);
        ELSE
            score := score + ROUND((v_keywords_found::NUMERIC / v_total_keywords) * (p_max_points * 0.45));
        END IF;
    END IF;

    -- Agregar bonus por estructura
    score := LEAST(score + v_argumentation_structure_bonus, p_max_points);

    is_correct := (score >= (p_max_points * 0.70));

    -- Feedback
    IF is_correct THEN
        feedback := format('Excelente opinión argumentada. Longitud: %s palabras. Keywords: %s/%s.',
                          v_word_count, v_keywords_found, v_total_keywords);
    ELSE
        feedback := format('Opinión incompleta. Necesitas al menos %s palabras (tienes %s) y más argumentos clave.',
                          v_min_words, v_word_count);
    END IF;

    -- Details
    details := jsonb_build_object(
        'word_count', v_word_count,
        'min_words_required', v_min_words,
        'keywords_found', v_keywords_found,
        'total_keywords', v_total_keywords,
        'structure_bonus', v_argumentation_structure_bonus,
        'validation_type', 'heuristic'
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_tribunal_opiniones IS
'Validador heurístico para tribunal de opiniones (Módulo 3 - Pensamiento Crítico).
Verifica longitud mínima (100+ palabras), presencia de keywords argumentativos, y estructura.
NO valida calidad real del argumento - solo criterios básicos.';
