-- ============================================================================
-- FUNCIÓN: validate_rueda_inferencias
-- Descripción: Validador para rueda de inferencias (Módulo 2)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
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
    v_correct_inferences JSONB;
    v_submitted_inferences JSONB;
    v_total_inferences INTEGER;
    v_correct_count INTEGER := 0;
    v_inference_id TEXT;
    v_correct_value TEXT;
    v_submitted_value TEXT;
    v_results JSONB := '[]'::jsonb;
BEGIN
    -- Formato: {"correctInferences": {"inf1": "conclusion1", "inf2": "conclusion2"}}
    -- Submitted: {"inferences": {"inf1": "conclusion1", "inf2": "conclusion2"}}
    v_correct_inferences := p_solution->'correctInferences';
    v_submitted_inferences := p_submitted_answer->'inferences';

    IF v_correct_inferences IS NULL OR v_submitted_inferences IS NULL THEN
        RAISE EXCEPTION 'Invalid rueda inferencias format';
    END IF;

    v_total_inferences := (SELECT COUNT(*) FROM jsonb_object_keys(v_correct_inferences));

    FOR v_inference_id IN SELECT jsonb_object_keys(v_correct_inferences)
    LOOP
        v_correct_value := v_correct_inferences->>v_inference_id;
        v_submitted_value := v_submitted_inferences->>v_inference_id;

        -- Normalizar
        IF p_normalize_text THEN
            v_correct_value := UPPER(TRIM(gamilit.normalize_text(v_correct_value)));
            v_submitted_value := UPPER(TRIM(gamilit.normalize_text(COALESCE(v_submitted_value, ''))));
        ELSE
            v_correct_value := UPPER(TRIM(v_correct_value));
            v_submitted_value := UPPER(TRIM(COALESCE(v_submitted_value, '')));
        END IF;

        IF v_submitted_value = v_correct_value THEN
            v_correct_count := v_correct_count + 1;
            v_results := v_results || jsonb_build_object(
                'inference_id', v_inference_id,
                'is_correct', true
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'inference_id', v_inference_id,
                'is_correct', false
            );
        END IF;
    END LOOP;

    is_correct := (v_correct_count = v_total_inferences);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_count::NUMERIC / v_total_inferences) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    IF is_correct THEN
        feedback := format('¡Excelente! Todas las %s inferencias correctas.', v_total_inferences);
    ELSE
        feedback := format('%s/%s inferencias correctas.', v_correct_count, v_total_inferences);
    END IF;

    details := jsonb_build_object(
        'total_inferences', v_total_inferences,
        'correct_inferences', v_correct_count,
        'percentage', ROUND((v_correct_count::NUMERIC / v_total_inferences) * 100),
        'results_per_inference', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_rueda_inferencias IS
'Validador para rueda de inferencias (Módulo 2). Matching pairs de inferencias y conclusiones.';
