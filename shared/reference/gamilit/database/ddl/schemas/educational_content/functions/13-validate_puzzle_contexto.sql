-- ============================================================================
-- FUNCIÓN: validate_puzzle_contexto
-- Descripción: Validador para puzzle de contexto (Módulo 2)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_puzzle_contexto(
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
    -- Similar a detective_textual pero con enfoque en contexto
    v_correct_answers := p_solution->'correctAnswers';
    v_submitted_questions := p_submitted_answer->'questions';

    IF v_correct_answers IS NULL OR v_submitted_questions IS NULL THEN
        RAISE EXCEPTION 'Invalid puzzle contexto format';
    END IF;

    v_total_questions := (SELECT COUNT(*) FROM jsonb_object_keys(v_correct_answers));

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
                'is_correct', false
            );
        END IF;
    END LOOP;

    is_correct := (v_correct_questions = v_total_questions);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_questions::NUMERIC / v_total_questions) * p_max_points);
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    IF is_correct THEN
        feedback := format('¡Puzzle resuelto! Todas las %s piezas en su lugar.', v_total_questions);
    ELSE
        feedback := format('%s/%s piezas correctas.', v_correct_questions, v_total_questions);
    END IF;

    details := jsonb_build_object(
        'total_questions', v_total_questions,
        'correct_questions', v_correct_questions,
        'percentage', ROUND((v_correct_questions::NUMERIC / v_total_questions) * 100),
        'results_per_question', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_puzzle_contexto IS
'Validador para puzzle de contexto (Módulo 2). Multiple choice con inferencias contextuales.';
