-- ============================================================================
-- FUNCIÓN: validate_true_false
-- Descripción: Validador para ejercicios tipo verdadero/falso
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_true_false(
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
    v_correct_answers JSONB;
    v_submitted_statements JSONB;
    v_total_statements INTEGER;
    v_correct_statements INTEGER := 0;
    v_stmt_id TEXT;
    v_results JSONB := '[]'::jsonb;
BEGIN
    -- Extraer respuestas correctas y respuestas enviadas
    -- Formato: {"correctAnswers": {"stmt1": false, "stmt2": true, ...}}
    -- Submitted: {"statements": {"stmt1": false, "stmt2": true, ...}}
    v_correct_answers := p_solution->'correctAnswers';
    v_submitted_statements := p_submitted_answer->'statements';

    IF v_correct_answers IS NULL OR v_submitted_statements IS NULL THEN
        RAISE EXCEPTION 'Invalid true/false format';
    END IF;

    v_total_statements := (SELECT COUNT(*) FROM jsonb_object_keys(v_correct_answers));

    -- Validar cada statement
    FOR v_stmt_id IN SELECT jsonb_object_keys(v_correct_answers)
    LOOP
        IF (v_correct_answers->>v_stmt_id)::boolean = (v_submitted_statements->>v_stmt_id)::boolean THEN
            v_correct_statements := v_correct_statements + 1;
            v_results := v_results || jsonb_build_object(
                'statement_id', v_stmt_id,
                'is_correct', true
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'statement_id', v_stmt_id,
                'is_correct', false,
                'submitted', v_submitted_statements->>v_stmt_id,
                'expected', v_correct_answers->>v_stmt_id
            );
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_statements = v_total_statements);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_statements::NUMERIC / v_total_statements) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := format('¡Perfecto! Todas las %s afirmaciones correctas.', v_total_statements);
    ELSE
        feedback := format('Tienes %s/%s afirmaciones correctas.',
                          v_correct_statements, v_total_statements);
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_statements', v_total_statements,
        'correct_statements', v_correct_statements,
        'percentage', ROUND((v_correct_statements::NUMERIC / v_total_statements) * 100),
        'results_per_statement', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_true_false IS
'Validador para ejercicios tipo verdadero/falso.
Compara respuestas booleanas contra solución esperada.';
