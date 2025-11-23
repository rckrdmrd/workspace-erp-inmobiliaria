-- ============================================================================
-- FUNCIÓN: validate_detective_connections
-- Descripción: Validador para ejercicios tipo detective textual (conexiones de evidencias)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-117 (Corrección de discrepancias)
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_detective_connections(
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
    v_correct_connections JSONB;
    v_submitted_connections JSONB;
    v_total_connections INTEGER;
    v_correct_count INTEGER := 0;
    v_connection JSONB;
    v_from_id TEXT;
    v_to_id TEXT;
    v_relationship TEXT;
    v_is_match BOOLEAN;
    v_results JSONB := '[]'::jsonb;
BEGIN
    -- Extraer conexiones esperadas y enviadas
    -- Formato esperado: {"connections": [{"from": "ev1", "to": "ev2", "relationship": "causa"}]}
    v_correct_connections := p_solution->'connections';
    v_submitted_connections := p_submitted_answer->'connections';

    IF v_correct_connections IS NULL OR v_submitted_connections IS NULL THEN
        RAISE EXCEPTION 'Invalid detective connections format: expected {"connections": [...]}';
    END IF;

    v_total_connections := jsonb_array_length(v_correct_connections);

    IF v_total_connections = 0 THEN
        RAISE EXCEPTION 'No connections defined in solution';
    END IF;

    -- Validar cada conexión del usuario
    FOR v_connection IN SELECT jsonb_array_elements(v_submitted_connections)
    LOOP
        v_from_id := v_connection->>'from';
        v_to_id := v_connection->>'to';
        v_relationship := v_connection->>'relationship';

        -- Buscar si existe esta conexión en las correctas
        SELECT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(v_correct_connections) AS correct_conn
            WHERE (correct_conn->>'from' = v_from_id
                   AND correct_conn->>'to' = v_to_id
                   AND correct_conn->>'relationship' = v_relationship)
        ) INTO v_is_match;

        IF v_is_match THEN
            v_correct_count := v_correct_count + 1;
            v_results := v_results || jsonb_build_object(
                'from', v_from_id,
                'to', v_to_id,
                'relationship', v_relationship,
                'is_correct', true
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'from', v_from_id,
                'to', v_to_id,
                'relationship', v_relationship,
                'is_correct', false
            );
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_count = v_total_connections
                   AND jsonb_array_length(v_submitted_connections) = v_total_connections);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_count::NUMERIC / v_total_connections) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := '¡Excelente! Todas las conexiones de evidencias son correctas.';
    ELSE
        feedback := format('Tienes %s/%s conexiones correctas.',
                          v_correct_count, v_total_connections);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_connections', v_total_connections,
        'correct_connections', v_correct_count,
        'submitted_connections', jsonb_array_length(v_submitted_connections),
        'percentage', ROUND((v_correct_count::NUMERIC / v_total_connections) * 100),
        'results_per_connection', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_detective_connections IS
'Validador para ejercicios tipo detective textual con conexiones de evidencias.
Verifica que las conexiones entre evidencias (nodos) sean correctas.
Formato: {"connections": [{"from": "ev1", "to": "ev2", "relationship": "causa"}]}';

-- Permisos
GRANT EXECUTE ON FUNCTION educational_content.validate_detective_connections TO authenticated;
GRANT EXECUTE ON FUNCTION educational_content.validate_detective_connections TO service_role;
