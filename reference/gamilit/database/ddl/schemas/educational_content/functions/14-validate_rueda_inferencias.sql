-- ============================================================================
-- FUNCIÓN AUXILIAR: _validate_single_fragment (INTERNA)
-- Descripción: Valida un fragmento individual con keywords
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content._validate_single_fragment(
    p_keywords JSONB,
    p_min_keywords INTEGER,
    p_min_length INTEGER,
    p_max_length INTEGER,
    p_user_text TEXT,
    p_points INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_keyword TEXT;
    v_normalized_user_text TEXT;
    v_normalized_keyword TEXT;
    v_matched_keywords TEXT[] := ARRAY[]::TEXT[];
    v_keyword_count INTEGER := 0;
    v_text_length INTEGER;
    v_is_valid BOOLEAN := false;
    v_feedback TEXT[];
BEGIN
    -- 1. Validar longitud del texto
    v_text_length := LENGTH(TRIM(p_user_text));

    IF v_text_length < p_min_length THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'matched_keywords', '[]'::jsonb,
            'keyword_count', 0,
            'points', 0,
            'feedback', format('El texto es demasiado corto. Mínimo %s caracteres, tienes %s.',
                p_min_length, v_text_length)
        );
    END IF;

    IF v_text_length > p_max_length THEN
        RETURN jsonb_build_object(
            'is_valid', false,
            'matched_keywords', '[]'::jsonb,
            'keyword_count', 0,
            'points', 0,
            'feedback', format('El texto es demasiado largo. Máximo %s caracteres, tienes %s.',
                p_max_length, v_text_length)
        );
    END IF;

    -- 2. Normalizar texto del usuario (lowercase + quitar acentos)
    v_normalized_user_text := LOWER(gamilit.normalize_text(TRIM(p_user_text)));

    -- 3. Contar keywords que aparecen en el texto
    FOR v_keyword IN SELECT jsonb_array_elements_text(p_keywords)
    LOOP
        v_normalized_keyword := LOWER(gamilit.normalize_text(v_keyword));

        IF v_normalized_user_text LIKE '%' || v_normalized_keyword || '%' THEN
            v_matched_keywords := array_append(v_matched_keywords, v_keyword);
            v_keyword_count := v_keyword_count + 1;
        END IF;
    END LOOP;

    -- 4. Validar cantidad mínima de keywords
    v_is_valid := (v_keyword_count >= p_min_keywords);

    -- 5. Generar feedback
    v_feedback := ARRAY[]::TEXT[];

    IF v_is_valid THEN
        v_feedback := array_append(v_feedback,
            format('¡Excelente! Has incluido %s conceptos clave del fragmento.', v_keyword_count));
    ELSE
        v_feedback := array_append(v_feedback,
            format('Tu inferencia necesita más relación con el texto. Has incluido %s conceptos clave, pero necesitas al menos %s.',
                v_keyword_count, p_min_keywords));
    END IF;

    -- 6. Construir resultado
    RETURN jsonb_build_object(
        'is_valid', v_is_valid,
        'matched_keywords', to_jsonb(v_matched_keywords),
        'keyword_count', v_keyword_count,
        'min_keywords_required', p_min_keywords,
        'points', CASE WHEN v_is_valid THEN p_points ELSE 0 END,
        'max_points', p_points,
        'text_length', v_text_length,
        'min_length', p_min_length,
        'max_length', p_max_length,
        'feedback', array_to_string(v_feedback, ' ')
    );
END;
$$;

COMMENT ON FUNCTION educational_content._validate_single_fragment IS
'Función auxiliar interna para validar un fragmento individual con keywords. Usada por validate_rueda_inferencias_text() y validate_rueda_inferencias().';

-- ============================================================================
-- FUNCIÓN: validate_rueda_inferencias_text (REFACTORIZADA)
-- Descripción: Validador directo para un fragmento específico (uso desde backend)
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
    v_points INTEGER;
    v_min_keywords INTEGER;
    v_min_length INTEGER;
    v_max_length INTEGER;
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

    -- 4. Extraer keywords y puntos del fragment
    v_keywords := v_fragment_solution->'keywords';
    v_points := COALESCE((v_fragment_solution->>'points')::INTEGER, 20);

    -- 5. Delegar a función auxiliar
    RETURN educational_content._validate_single_fragment(
        v_keywords,
        v_min_keywords,
        v_min_length,
        v_max_length,
        p_user_text,
        v_points
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_rueda_inferencias_text IS
'Validador directo para rueda de inferencias con texto libre. Recibe exercise_id y fragment_id para validar un fragmento específico.';

-- ============================================================================
-- FUNCIÓN: validate_rueda_inferencias (WRAPPER ESTÁNDAR)
-- Descripción: Wrapper con firma estándar para integración con el sistema
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_rueda_inferencias(
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
    v_validation JSONB;
    v_min_keywords INTEGER;
    v_min_length INTEGER;
    v_max_length INTEGER;
    v_fragments_solution JSONB;
    v_fragments_submitted JSONB;
    v_fragment_id TEXT;
    v_user_text TEXT;
    v_fragment_solution JSONB;
    v_keywords JSONB;
    v_fragment_points INTEGER;
    v_validation_result JSONB;
    v_total_fragments INTEGER := 0;
    v_valid_fragments INTEGER := 0;
    v_total_points INTEGER := 0;
    v_accumulated_score INTEGER := 0;
    v_results JSONB := '[]'::jsonb;
    v_feedback_parts TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- 1. Validar estructura de entrada
    IF p_solution IS NULL OR p_submitted_answer IS NULL THEN
        RAISE EXCEPTION 'Invalid input: solution and submitted_answer are required';
    END IF;

    v_fragments_submitted := p_submitted_answer->'fragments';

    IF v_fragments_submitted IS NULL THEN
        RAISE EXCEPTION 'Invalid submitted_answer format: missing "fragments" object';
    END IF;

    -- 2. Extraer criterios de validación globales
    v_validation := p_solution->'validation';
    v_min_keywords := COALESCE((v_validation->>'minKeywords')::INTEGER, 2);
    v_min_length := COALESCE((v_validation->>'minLength')::INTEGER, 20);
    v_max_length := COALESCE((v_validation->>'maxLength')::INTEGER, 200);

    v_fragments_solution := p_solution->'fragments';

    IF v_fragments_solution IS NULL THEN
        RAISE EXCEPTION 'Invalid solution format: missing "fragments" array';
    END IF;

    -- 3. Iterar sobre cada fragmento enviado por el usuario
    FOR v_fragment_id, v_user_text IN
        SELECT key, value::text
        FROM jsonb_each_text(v_fragments_submitted)
    LOOP
        v_total_fragments := v_total_fragments + 1;

        -- Buscar la solución para este fragmento
        SELECT fragment INTO v_fragment_solution
        FROM jsonb_array_elements(v_fragments_solution) AS fragment
        WHERE fragment->>'id' = v_fragment_id;

        IF v_fragment_solution IS NULL THEN
            -- Fragmento no encontrado en solution
            v_results := v_results || jsonb_build_object(
                'fragment_id', v_fragment_id,
                'is_valid', false,
                'error', 'Fragment not found in solution',
                'points', 0
            );
            CONTINUE;
        END IF;

        -- Extraer keywords y puntos del fragmento
        v_keywords := v_fragment_solution->'keywords';
        v_fragment_points := COALESCE((v_fragment_solution->>'points')::INTEGER, 20);
        v_total_points := v_total_points + v_fragment_points;

        -- Validar el fragmento usando la función auxiliar
        v_validation_result := educational_content._validate_single_fragment(
            v_keywords,
            v_min_keywords,
            v_min_length,
            v_max_length,
            v_user_text,
            v_fragment_points
        );

        -- Acumular resultados
        IF (v_validation_result->>'is_valid')::boolean THEN
            v_valid_fragments := v_valid_fragments + 1;
        END IF;

        v_accumulated_score := v_accumulated_score + (v_validation_result->>'points')::integer;

        -- Agregar resultado del fragmento al detalle
        v_results := v_results || jsonb_build_object(
            'fragment_id', v_fragment_id,
            'is_valid', v_validation_result->'is_valid',
            'matched_keywords', v_validation_result->'matched_keywords',
            'keyword_count', v_validation_result->'keyword_count',
            'points', v_validation_result->'points',
            'feedback', v_validation_result->'feedback'
        );
    END LOOP;

    -- 4. Calcular puntuación final
    IF p_allow_partial_credit THEN
        -- Ajustar a p_max_points (normalmente 100)
        IF v_total_points > 0 THEN
            score := ROUND((v_accumulated_score::NUMERIC / v_total_points) * p_max_points);
        ELSE
            score := 0;
        END IF;
    ELSE
        score := CASE
            WHEN v_valid_fragments = v_total_fragments THEN p_max_points
            ELSE 0
        END;
    END IF;

    -- 5. Determinar si es correcto
    is_correct := (v_valid_fragments = v_total_fragments);

    -- 6. Generar feedback
    IF is_correct THEN
        feedback := format('¡Excelente! Todas las %s inferencias son válidas. Has demostrado comprensión profunda del texto.',
            v_total_fragments);
    ELSIF v_valid_fragments > 0 THEN
        feedback := format('%s de %s inferencias válidas. Revisa los fragmentos marcados para mejorar tu respuesta.',
            v_valid_fragments, v_total_fragments);
    ELSE
        feedback := format('Ninguna inferencia válida. Asegúrate de incluir conceptos clave del texto y cumplir con la longitud requerida (%s-%s caracteres).',
            v_min_length, v_max_length);
    END IF;

    -- 7. Construir detalles
    details := jsonb_build_object(
        'total_fragments', v_total_fragments,
        'valid_fragments', v_valid_fragments,
        'total_points_possible', v_total_points,
        'points_earned', v_accumulated_score,
        'percentage', CASE
            WHEN v_total_fragments > 0
            THEN ROUND((v_valid_fragments::NUMERIC / v_total_fragments) * 100)
            ELSE 0
        END,
        'validation_criteria', jsonb_build_object(
            'min_keywords', v_min_keywords,
            'min_length', v_min_length,
            'max_length', v_max_length
        ),
        'results_per_fragment', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_rueda_inferencias IS
'Wrapper estándar para validación de rueda de inferencias. Recibe formato { fragments: { "frag-1": "texto...", ... } } y valida cada fragmento acumulando puntos.';
