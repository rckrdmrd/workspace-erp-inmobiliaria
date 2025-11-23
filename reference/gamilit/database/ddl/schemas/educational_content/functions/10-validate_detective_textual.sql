-- ============================================================================
-- FUNCIÓN: validate_detective_textual
-- Descripción: Validador para ejercicios tipo detective textual (Módulo 2)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_detective_textual(
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
    v_submitted_questions JSONB;
    v_total_questions INTEGER;
    v_correct_questions INTEGER := 0;
    v_question_id TEXT;
    v_results JSONB := '[]'::jsonb;
BEGIN
    -- Formato: {"correctAnswers": {"q1": "option_b", "q2": "option_a", ...}}
    -- Submitted: {"questions": {"q1": "option_b", "q2": "option_c", ...}}
    v_correct_answers := p_solution->'correctAnswers';
    v_submitted_questions := p_submitted_answer->'questions';

    IF v_correct_answers IS NULL OR v_submitted_questions IS NULL THEN
        RAISE EXCEPTION 'Invalid detective textual format';
    END IF;

    v_total_questions := COALESCE(
        (p_solution->>'totalQuestions')::integer,
        (SELECT COUNT(*) FROM jsonb_object_keys(v_correct_answers))
    );

    -- Validar cada pregunta
    FOR v_question_id IN SELECT jsonb_object_keys(v_correct_answers)
    LOOP
        IF (v_correct_answers->>v_question_id) = (v_submitted_questions->>v_question_id) THEN
            v_correct_questions := v_correct_questions + 1;
            v_results := v_results || jsonb_build_object(
                'question_id', v_question_id,
                'is_correct', true
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'question_id', v_question_id,
                'is_correct', false,
                'submitted', v_submitted_questions->>v_question_id,
                'expected', v_correct_answers->>v_question_id
            );
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_questions = v_total_questions);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_questions::NUMERIC / v_total_questions) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := format('¡Excelente detective! Todas las %s inferencias correctas.', v_total_questions);
    ELSE
        feedback := format('Tienes %s/%s inferencias correctas (%s%%).',
                          v_correct_questions, v_total_questions,
                          ROUND((v_correct_questions::NUMERIC / v_total_questions) * 100));
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_questions', v_total_questions,
        'correct_questions', v_correct_questions,
        'percentage', ROUND((v_correct_questions::NUMERIC / v_total_questions) * 100),
        'results_per_question', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_detective_textual IS
'Validador para ejercicios tipo detective textual (Módulo 2 - Comprensión Inferencial).
Valida respuestas de multiple choice basadas en inferencias del texto.';
