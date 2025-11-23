-- ============================================================================
-- FUNCIÓN: validate_timeline
-- Descripción: Validador para ejercicios tipo línea de tiempo
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_timeline(
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
    v_correct_order JSONB;
    v_submitted_order JSONB;
    v_total_events INTEGER;
    v_correct_positions INTEGER := 0;
    v_i INTEGER;
BEGIN
    -- Extraer orden correcto y orden enviado
    v_correct_order := p_solution->'correctOrder';
    v_submitted_order := p_submitted_answer->'events';

    IF v_correct_order IS NULL OR v_submitted_order IS NULL THEN
        RAISE EXCEPTION 'Invalid timeline format';
    END IF;

    v_total_events := jsonb_array_length(v_correct_order);

    -- Comparar posición por posición
    FOR v_i IN 0..(v_total_events - 1)
    LOOP
        IF (v_correct_order->v_i)::text = (v_submitted_order->v_i)::text THEN
            v_correct_positions := v_correct_positions + 1;
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_positions = v_total_events);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_positions::NUMERIC / v_total_events) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := '¡Perfecto! Todos los eventos en orden correcto.';
    ELSE
        feedback := format('Tienes %s/%s eventos en la posición correcta.',
                          v_correct_positions, v_total_events);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_events', v_total_events,
        'correct_positions', v_correct_positions,
        'percentage', ROUND((v_correct_positions::NUMERIC / v_total_events) * 100)
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_timeline IS
'Validador para ejercicios tipo línea de tiempo.
Compara el orden de eventos contra el orden correcto.';
