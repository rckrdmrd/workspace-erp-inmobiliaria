-- ============================================================================
-- FUNCIÓN: validate_matriz_perspectivas
-- Descripción: Validador para matriz de perspectivas (Módulo 3)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_matriz_perspectivas(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
    p_allow_partial_credit BOOLEAN DEFAULT true,
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
    v_required_perspectives JSONB;
    v_submitted_perspectives JSONB;
    v_total_perspectives INTEGER;
    v_completed_perspectives INTEGER := 0;
    v_perspective_id TEXT;
    v_perspective_text TEXT;
    v_min_chars_per_cell INTEGER;
    v_perspective_keywords JSONB;
    v_keywords_found INTEGER;
    v_keyword TEXT;
    v_normalized_text TEXT;
    v_char_count INTEGER;
    v_results JSONB := '[]'::jsonb;
    v_cell_valid BOOLEAN;
    v_has_keywords BOOLEAN;
BEGIN
    -- Formato: {\"requiredPerspectives\": [\"perspective1\", \"perspective2\", ...]}
    -- Submitted: {\"perspectives\": {\"perspective1\": \"text\", \"perspective2\": \"text\", ...}}
    v_required_perspectives := p_solution->'requiredPerspectives';
    v_submitted_perspectives := p_submitted_answer->'perspectives';

    IF v_required_perspectives IS NULL OR v_submitted_perspectives IS NULL THEN
        RAISE EXCEPTION 'Invalid matriz perspectivas format';
    END IF;

    v_total_perspectives := jsonb_array_length(v_required_perspectives);
    v_min_chars_per_cell := COALESCE(
        (p_solution->>'min_chars_per_cell')::integer,
        (p_special_rules->>'min_chars_per_cell')::integer,
        50  -- 50 caracteres por defecto
    );

    -- Validar cada perspectiva requerida
    FOR v_perspective_id IN SELECT jsonb_array_elements_text(v_required_perspectives)
    LOOP
        v_perspective_text := v_submitted_perspectives->>v_perspective_id;
        v_cell_valid := false;
        v_has_keywords := false;

        -- Verificar si la celda está vacía
        IF v_perspective_text IS NULL OR TRIM(v_perspective_text) = '' THEN
            v_results := v_results || jsonb_build_object(
                'perspective_id', v_perspective_id,
                'is_complete', false,
                'char_count', 0,
                'min_chars_required', v_min_chars_per_cell,
                'has_keywords', false
            );
            CONTINUE;
        END IF;

        -- Contar caracteres
        v_char_count := LENGTH(TRIM(v_perspective_text));

        -- Normalizar para búsqueda de keywords
        IF p_normalize_text THEN
            v_normalized_text := LOWER(gamilit.normalize_text(v_perspective_text));
        ELSE
            v_normalized_text := LOWER(v_perspective_text);
        END IF;

        -- Buscar keywords específicas de esta perspectiva (si existen)
        v_perspective_keywords := p_solution->'perspectiveKeywords'->v_perspective_id;
        v_keywords_found := 0;

        IF v_perspective_keywords IS NOT NULL THEN
            FOR v_keyword IN SELECT jsonb_array_elements_text(v_perspective_keywords)
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

            v_has_keywords := (v_keywords_found > 0);
        ELSE
            v_has_keywords := true;  -- No hay keywords requeridas
        END IF;

        -- Validar celda
        IF v_char_count >= v_min_chars_per_cell AND v_has_keywords THEN
            v_cell_valid := true;
            v_completed_perspectives := v_completed_perspectives + 1;
        END IF;

        -- Agregar resultado
        v_results := v_results || jsonb_build_object(
            'perspective_id', v_perspective_id,
            'is_complete', v_cell_valid,
            'char_count', v_char_count,
            'min_chars_required', v_min_chars_per_cell,
            'has_keywords', v_has_keywords,
            'keywords_found', v_keywords_found
        );
    END LOOP;

    -- Calcular resultado
    is_correct := (v_completed_perspectives = v_total_perspectives);

    IF p_allow_partial_credit THEN
        score := ROUND((v_completed_perspectives::NUMERIC / v_total_perspectives) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := format('¡Excelente! Matriz completa con las %s perspectivas.', v_total_perspectives);
    ELSE
        feedback := format('Matriz incompleta. Completaste %s/%s perspectivas (%s%%).',
                          v_completed_perspectives, v_total_perspectives,
                          ROUND((v_completed_perspectives::NUMERIC / v_total_perspectives) * 100));
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_perspectives', v_total_perspectives,
        'completed_perspectives', v_completed_perspectives,
        'percentage', ROUND((v_completed_perspectives::NUMERIC / v_total_perspectives) * 100),
        'min_chars_per_cell', v_min_chars_per_cell,
        'results_per_perspective', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_matriz_perspectivas IS
'Validador para matriz de perspectivas (Módulo 3 - Pensamiento Crítico).
Valida que todas las celdas de la matriz estén completas con texto mínimo.
Opcionalmente verifica presencia de keywords específicas por perspectiva.';
