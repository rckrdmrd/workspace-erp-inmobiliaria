-- ============================================================================
-- FUNCIÓN: validate_prediction_scenarios
-- Descripción: Validador para ejercicios de predicción narrativa con escenarios y opciones
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-117 (Corrección de discrepancias)
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_prediction_scenarios(
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
    v_correct_scenarios JSONB;
    v_submitted_scenarios JSONB;
    v_total_scenarios INTEGER := 0;
    v_correct_count INTEGER := 0;
    v_scenario_id TEXT;
    v_correct_prediction TEXT;
    v_submitted_prediction TEXT;
    v_results JSONB := '[]'::jsonb;
BEGIN
    -- Extraer escenarios correctos y enviados
    -- Formato esperado: {"scenarios": {"s1": "pred_a", "s2": "pred_b"}}
    v_correct_scenarios := p_solution->'scenarios';
    v_submitted_scenarios := p_submitted_answer->'scenarios';

    IF v_correct_scenarios IS NULL OR v_submitted_scenarios IS NULL THEN
        RAISE EXCEPTION 'Invalid prediction scenarios format: expected {"scenarios": {...}}';
    END IF;

    -- Iterar sobre cada escenario correcto
    FOR v_scenario_id, v_correct_prediction IN
        SELECT key, value::text
        FROM jsonb_each_text(v_correct_scenarios)
    LOOP
        v_total_scenarios := v_total_scenarios + 1;

        -- Obtener predicción enviada por el usuario para este escenario
        v_submitted_prediction := v_submitted_scenarios->>v_scenario_id;

        -- Comparar predicciones (remover comillas adicionales si las hay)
        v_correct_prediction := trim(both '"' from v_correct_prediction);
        v_submitted_prediction := trim(both '"' from v_submitted_prediction);

        IF v_submitted_prediction = v_correct_prediction THEN
            v_correct_count := v_correct_count + 1;

            v_results := v_results || jsonb_build_object(
                'scenario_id', v_scenario_id,
                'is_correct', true,
                'correct_prediction', v_correct_prediction
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'scenario_id', v_scenario_id,
                'is_correct', false,
                'correct_prediction', v_correct_prediction,
                'submitted_prediction', v_submitted_prediction
            );
        END IF;
    END LOOP;

    IF v_total_scenarios = 0 THEN
        RAISE EXCEPTION 'No scenarios defined in solution';
    END IF;

    -- Calcular resultado
    is_correct := (v_correct_count = v_total_scenarios);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_count::NUMERIC / v_total_scenarios) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := '¡Excelente! Todas tus predicciones narrativas son correctas.';
    ELSE
        feedback := format('Tienes %s/%s predicciones correctas.',
                          v_correct_count, v_total_scenarios);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_scenarios', v_total_scenarios,
        'correct_predictions', v_correct_count,
        'percentage', ROUND((v_correct_count::NUMERIC / v_total_scenarios) * 100),
        'results_per_scenario', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_prediction_scenarios IS
'Validador para ejercicios de predicción narrativa con escenarios y opciones predefinidas.
Verifica que las predicciones seleccionadas para cada escenario sean correctas.
Formato: {"scenarios": {"s1": "pred_a", "s2": "pred_b"}}';

-- Permisos
GRANT EXECUTE ON FUNCTION educational_content.validate_prediction_scenarios TO authenticated;
GRANT EXECUTE ON FUNCTION educational_content.validate_prediction_scenarios TO service_role;
