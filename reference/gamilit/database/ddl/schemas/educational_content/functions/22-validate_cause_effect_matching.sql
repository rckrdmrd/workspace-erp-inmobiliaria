-- ============================================================================
-- FUNCIÓN: validate_cause_effect_matching
-- Descripción: Validador para ejercicios de matching causa-efecto (drag & drop)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-117 (Corrección de discrepancias)
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_cause_effect_matching(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
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
    v_correct_causes JSONB;
    v_submitted_causes JSONB;
    v_total_causes INTEGER := 0;
    v_correct_matches INTEGER := 0;
    v_total_matches INTEGER := 0;
    v_cause_id TEXT;
    v_correct_consequences JSONB;
    v_submitted_consequences JSONB;
    v_consequence_id TEXT;
    v_is_match BOOLEAN;
    v_results JSONB := '[]'::jsonb;
    v_cause_correct_count INTEGER;
    v_cause_total_count INTEGER;
BEGIN
    -- Extraer causas y consecuencias correctas y enviadas
    -- Formato esperado: {"causes": {"c1": ["cons1", "cons2"], "c2": ["cons3"]}}
    v_correct_causes := p_solution->'causes';
    v_submitted_causes := p_submitted_answer->'causes';

    IF v_correct_causes IS NULL OR v_submitted_causes IS NULL THEN
        RAISE EXCEPTION 'Invalid cause-effect matching format: expected {"causes": {...}}';
    END IF;

    -- Iterar sobre cada causa correcta
    FOR v_cause_id, v_correct_consequences IN
        SELECT key, value
        FROM jsonb_each(v_correct_causes)
    LOOP
        v_total_causes := v_total_causes + 1;
        v_cause_correct_count := 0;
        v_cause_total_count := jsonb_array_length(v_correct_consequences);
        v_total_matches := v_total_matches + v_cause_total_count;

        -- Obtener consecuencias enviadas por el usuario para esta causa
        v_submitted_consequences := v_submitted_causes->v_cause_id;

        IF v_submitted_consequences IS NULL THEN
            -- Usuario no envió consecuencias para esta causa
            v_results := v_results || jsonb_build_object(
                'cause_id', v_cause_id,
                'is_correct', false,
                'correct_consequences_count', 0,
                'total_consequences', v_cause_total_count
            );
            CONTINUE;
        END IF;

        -- Comparar consecuencias
        FOR v_consequence_id IN SELECT jsonb_array_elements_text(v_correct_consequences)
        LOOP
            -- Verificar si esta consecuencia está en las enviadas por el usuario
            SELECT EXISTS (
                SELECT 1
                FROM jsonb_array_elements_text(v_submitted_consequences) AS submitted_cons
                WHERE submitted_cons = v_consequence_id
            ) INTO v_is_match;

            IF v_is_match THEN
                v_cause_correct_count := v_cause_correct_count + 1;
                v_correct_matches := v_correct_matches + 1;
            END IF;
        END LOOP;

        -- Agregar resultado de esta causa
        v_results := v_results || jsonb_build_object(
            'cause_id', v_cause_id,
            'is_correct', (v_cause_correct_count = v_cause_total_count),
            'correct_consequences_count', v_cause_correct_count,
            'total_consequences', v_cause_total_count
        );
    END LOOP;

    IF v_total_matches = 0 THEN
        RAISE EXCEPTION 'No cause-effect matches defined in solution';
    END IF;

    -- Calcular resultado
    is_correct := (v_correct_matches = v_total_matches);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_matches::NUMERIC / v_total_matches) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := '¡Excelente! Todas las relaciones causa-efecto son correctas.';
    ELSE
        feedback := format('Tienes %s/%s relaciones correctas.',
                          v_correct_matches, v_total_matches);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_causes', v_total_causes,
        'total_matches', v_total_matches,
        'correct_matches', v_correct_matches,
        'percentage', ROUND((v_correct_matches::NUMERIC / v_total_matches) * 100),
        'results_per_cause', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_cause_effect_matching IS
'Validador para ejercicios de matching causa-efecto con drag & drop.
Verifica que las consecuencias asociadas a cada causa sean correctas.
Formato: {"causes": {"c1": ["cons1", "cons2"], "c2": ["cons3"]}}';

-- Permisos
GRANT EXECUTE ON FUNCTION educational_content.validate_cause_effect_matching TO authenticated;
GRANT EXECUTE ON FUNCTION educational_content.validate_cause_effect_matching TO service_role;
