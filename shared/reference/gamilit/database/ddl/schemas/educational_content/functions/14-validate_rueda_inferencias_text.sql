-- ============================================================================
-- FUNCIÓN: validate_rueda_inferencias_text
-- Descripción: Validador para rueda de inferencias con texto libre (Módulo 2)
-- Autor: Database Agent
-- Fecha: 2025-11-20
-- Tarea: DB-071
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_rueda_inferencias_text(
    p_exercise_id UUID,
    p_fragment_id TEXT,
    p_user_text TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_solution JSONB;
    v_validation JSONB;
    v_fragment_solution JSONB;
    v_keywords JSONB;
    v_keyword TEXT;
    v_normalized_user_text TEXT;
    v_normalized_keyword TEXT;
    v_matched_keywords TEXT[] := ARRAY[]::TEXT[];
    v_keyword_count INTEGER := 0;
    v_min_keywords INTEGER;
    v_min_length INTEGER;
    v_max_length INTEGER;
    v_text_length INTEGER;
    v_points INTEGER;
    v_is_valid BOOLEAN := false;
    v_feedback TEXT[];
    v_result JSONB;
BEGIN
    -- 1. Obtener solution del ejercicio
    SELECT solution INTO v_solution
    FROM educational_content.exercises
    WHERE id = p_exercise_id;

    IF v_solution IS NULL THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'error', 'Exercise not found',
            'points', 0
        );
    END IF;

    -- 2. Extraer criterios de validación
    v_validation := v_solution->'validation';
    v_min_keywords := COALESCE((v_validation->>'minKeywords')::INTEGER, 2);
    v_min_length := COALESCE((v_validation->>'minLength')::INTEGER, 20);
    v_max_length := COALESCE((v_validation->>'maxLength')::INTEGER, 200);

    -- 3. Buscar fragment específico en solution
    SELECT fragment INTO v_fragment_solution
    FROM jsonb_array_elements(v_solution->'fragments') AS fragment
    WHERE fragment->>'id' = p_fragment_id;

    IF v_fragment_solution IS NULL THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'error', 'Fragment not found',
            'points', 0
        );
    END IF;

    -- 4. Extraer keywords del fragment
    v_keywords := v_fragment_solution->'keywords';
    v_points := COALESCE((v_fragment_solution->>'points')::INTEGER, 20);

    -- 5. Validar longitud del texto
    v_text_length := LENGTH(TRIM(p_user_text));

    IF v_text_length < v_min_length THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'matched_keywords', '[]'::jsonb,
            'keyword_count', 0,
            'points', 0,
            'feedback', format('El texto es demasiado corto. Mínimo %s caracteres, tienes %s.',
                v_min_length, v_text_length)
        );
    END IF;

    IF v_text_length > v_max_length THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'matched_keywords', '[]'::jsonb,
            'keyword_count', 0,
            'points', 0,
            'feedback', format('El texto es demasiado largo. Máximo %s caracteres, tienes %s.',
                v_max_length, v_text_length)
        );
    END IF;

    -- 6. Normalizar texto del usuario (lowercase + quitar acentos)
    v_normalized_user_text := LOWER(gamilit.normalize_text(TRIM(p_user_text)));

    -- 7. Contar keywords que aparecen en el texto
    FOR v_keyword IN SELECT jsonb_array_elements_text(v_keywords)
    LOOP
        v_normalized_keyword := LOWER(gamilit.normalize_text(v_keyword));

        IF v_normalized_user_text LIKE '%' || v_normalized_keyword || '%' THEN
            v_matched_keywords := array_append(v_matched_keywords, v_keyword);
            v_keyword_count := v_keyword_count + 1;
        END IF;
    END LOOP;

    -- 8. Validar cantidad mínima de keywords
    v_is_valid := (v_keyword_count >= v_min_keywords);

    -- 9. Calcular puntos basados en keywords encontrados
    IF v_is_valid THEN
        -- Puntuación completa si cumple mínimo
        v_points := v_points;
    ELSE
        -- Sin puntos si no cumple mínimo
        v_points := 0;
    END IF;

    -- 10. Generar feedback
    v_feedback := ARRAY[]::TEXT[];

    IF v_is_valid THEN
        v_feedback := array_append(v_feedback,
            format('¡Excelente! Has incluido %s conceptos clave del fragmento.', v_keyword_count));
    ELSE
        v_feedback := array_append(v_feedback,
            format('Tu inferencia necesita más relación con el texto. Has incluido %s conceptos clave, pero necesitas al menos %s.',
                v_keyword_count, v_min_keywords));
    END IF;

    -- 11. Construir resultado
    v_result := jsonb_build_object(
        'is_valid', v_is_valid,
        'matched_keywords', to_jsonb(v_matched_keywords),
        'keyword_count', v_keyword_count,
        'min_keywords_required', v_min_keywords,
        'points', v_points,
        'max_points', (v_fragment_solution->>'points')::INTEGER,
        'text_length', v_text_length,
        'min_length', v_min_length,
        'max_length', v_max_length,
        'feedback', array_to_string(v_feedback, ' ')
    );

    RETURN v_result;
END;
$$;

COMMENT ON FUNCTION educational_content.validate_rueda_inferencias_text IS
'Validador para rueda de inferencias con texto libre (Módulo 2). Valida keywords, longitud, y asigna puntos.';
