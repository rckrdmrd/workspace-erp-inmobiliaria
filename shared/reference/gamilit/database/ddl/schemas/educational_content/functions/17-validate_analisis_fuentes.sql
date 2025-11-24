-- ============================================================================
-- FUNCIÓN: validate_analisis_fuentes
-- Descripción: Validador para análisis de fuentes (Módulo 3)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_analisis_fuentes(
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
    v_critical_questions_correct INTEGER := 0;
    v_critical_questions_total INTEGER := 0;
    v_is_critical BOOLEAN;
BEGIN
    -- Formato: {\"correctAnswers\": {\"q1\": \"option_a\", \"q2\": \"option_b\", ...}}
    -- Submitted: {\"questions\": {\"q1\": \"option_a\", \"q2\": \"option_c\", ...}}
    v_correct_answers := p_solution->'correctAnswers';
    v_submitted_questions := p_submitted_answer->'questions';

    IF v_correct_answers IS NULL OR v_submitted_questions IS NULL THEN
        RAISE EXCEPTION 'Invalid analisis fuentes format';
    END IF;

    v_total_questions := COALESCE(
        (p_solution->>'totalQuestions')::integer,
        (SELECT COUNT(*) FROM jsonb_object_keys(v_correct_answers))
    );

    -- Validar cada pregunta
    FOR v_question_id IN SELECT jsonb_object_keys(v_correct_answers)
    LOOP
        -- Verificar si es pregunta crítica (identificación de sesgo, credibilidad)
        v_is_critical := COALESCE(
            (p_solution->'criticalQuestions'->v_question_id)::boolean,
            false
        );

        IF v_is_critical THEN
            v_critical_questions_total := v_critical_questions_total + 1;
        END IF;

        IF (v_correct_answers->>v_question_id) = (v_submitted_questions->>v_question_id) THEN
            v_correct_questions := v_correct_questions + 1;

            IF v_is_critical THEN
                v_critical_questions_correct := v_critical_questions_correct + 1;
            END IF;

            v_results := v_results || jsonb_build_object(
                'question_id', v_question_id,
                'is_correct', true,
                'is_critical', v_is_critical
            );
        ELSE
            v_results := v_results || jsonb_build_object(
                'question_id', v_question_id,
                'is_correct', false,
                'is_critical', v_is_critical,
                'submitted', v_submitted_questions->>v_question_id,
                'expected', v_correct_answers->>v_question_id
            );
        END IF;
    END LOOP;

    -- Calcular resultado
    is_correct := (v_correct_questions = v_total_questions);

    IF p_allow_partial_credit THEN
        score := ROUND((v_correct_questions::NUMERIC / v_total_questions) * p_max_points);

        -- Bonus por preguntas críticas correctas
        IF v_critical_questions_total > 0 AND v_critical_questions_correct = v_critical_questions_total THEN
            score := LEAST(score + 5, p_max_points);
        END IF;
    ELSE
        score := CASE WHEN is_correct THEN p_max_points ELSE 0 END;
    END IF;

    -- Feedback
    IF is_correct THEN
        feedback := format('¡Excelente análisis! Todas las %s evaluaciones de fuentes correctas.', v_total_questions);
    ELSIF v_critical_questions_total > 0 THEN
        feedback := format('Tienes %s/%s análisis correctos (%s%%). Preguntas críticas: %s/%s.',
                          v_correct_questions, v_total_questions,
                          ROUND((v_correct_questions::NUMERIC / v_total_questions) * 100),
                          v_critical_questions_correct, v_critical_questions_total);
    ELSE
        feedback := format('Tienes %s/%s análisis correctos (%s%%).',
                          v_correct_questions, v_total_questions,
                          ROUND((v_correct_questions::NUMERIC / v_total_questions) * 100));
    END IF;

    -- Details
    details := jsonb_build_object(
        'total_questions', v_total_questions,
        'correct_questions', v_correct_questions,
        'percentage', ROUND((v_correct_questions::NUMERIC / v_total_questions) * 100),
        'critical_questions_total', v_critical_questions_total,
        'critical_questions_correct', v_critical_questions_correct,
        'results_per_question', v_results
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_analisis_fuentes IS
'Validador para análisis de fuentes (Módulo 3 - Pensamiento Crítico).
Valida respuestas de multiple choice sobre credibilidad, sesgo, y confiabilidad de fuentes.
Incluye peso especial para preguntas críticas.';
