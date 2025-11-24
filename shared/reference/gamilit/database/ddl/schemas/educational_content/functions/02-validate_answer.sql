-- ============================================================================
-- FUNCIÓN: validate_answer
-- Descripción: Función maestra para validar respuestas de ejercicios
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116 (Handoff FE-059)
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_answer(
    p_exercise_id UUID,
    p_submitted_answer JSONB,
    OUT is_correct BOOLEAN,
    OUT score INTEGER,
    OUT max_score INTEGER,
    OUT feedback TEXT,
    OUT details JSONB
)
RETURNS RECORD
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_exercise RECORD;
    v_config RECORD;
    v_result RECORD;
BEGIN
    -- ========================================================================
    -- 1. RECUPERAR EJERCICIO
    -- ========================================================================
    SELECT
        id,
        exercise_type,
        content,
        solution,
        max_points,
        auto_gradable
    INTO v_exercise
    FROM educational_content.exercises
    WHERE id = p_exercise_id
        AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Exercise not found or inactive: %', p_exercise_id;
    END IF;

    IF NOT v_exercise.auto_gradable THEN
        RAISE EXCEPTION 'Exercise % is not auto-gradable', p_exercise_id;
    END IF;

    -- ========================================================================
    -- 2. RECUPERAR CONFIGURACIÓN DE VALIDACIÓN
    -- ========================================================================
    SELECT *
    INTO v_config
    FROM educational_content.exercise_validation_config
    WHERE exercise_type = v_exercise.exercise_type;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Validation config not found for exercise_type: %', v_exercise.exercise_type;
    END IF;

    max_score := COALESCE(v_exercise.max_points, v_config.default_max_points, 100);

    -- ========================================================================
    -- 3. EJECUTAR VALIDADOR ESPECÍFICO SEGÚN TIPO
    -- ========================================================================
    CASE v_config.validation_function

        -- ====================================================================
        -- MÓDULO 1: COMPRENSIÓN LITERAL (5 validadores)
        -- ====================================================================

        WHEN 'validate_crucigrama' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_crucigrama(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.case_sensitive,
                v_config.normalize_text
            );

        WHEN 'validate_timeline' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_timeline(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        WHEN 'validate_word_search' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_word_search(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit,
                v_config.normalize_text
            );

        WHEN 'validate_fill_in_blank' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_fill_in_blank(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.case_sensitive,
                v_config.normalize_text,
                v_config.fuzzy_matching_threshold,
                v_config.allow_partial_credit
            );

        WHEN 'validate_true_false' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_true_false(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        -- ====================================================================
        -- MÓDULO 2: COMPRENSIÓN INFERENCIAL (5 validadores)
        -- ====================================================================

        WHEN 'validate_detective_textual' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_detective_textual(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        WHEN 'validate_construccion_hipotesis' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_construccion_hipotesis(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.fuzzy_matching_threshold,
                v_config.normalize_text,
                v_config.special_rules
            );

        WHEN 'validate_prediccion_narrativa' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_prediccion_narrativa(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.fuzzy_matching_threshold,
                v_config.normalize_text,
                v_config.special_rules
            );

        WHEN 'validate_puzzle_contexto' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_puzzle_contexto(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        WHEN 'validate_rueda_inferencias' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_rueda_inferencias(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit,
                v_config.normalize_text
            );

        -- ====================================================================
        -- MÓDULO 3: COMPRENSIÓN CRÍTICA (5 validadores)
        -- ====================================================================

        WHEN 'validate_tribunal_opiniones' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_tribunal_opiniones(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.fuzzy_matching_threshold,
                v_config.normalize_text,
                v_config.special_rules
            );

        WHEN 'validate_debate_digital' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_debate_digital(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.fuzzy_matching_threshold,
                v_config.normalize_text,
                v_config.special_rules
            );

        WHEN 'validate_analisis_fuentes' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_analisis_fuentes(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        WHEN 'validate_podcast_argumentativo' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_podcast_argumentativo(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.special_rules
            );

        WHEN 'validate_matriz_perspectivas' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_matriz_perspectivas(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.fuzzy_matching_threshold,
                v_config.allow_partial_credit,
                v_config.special_rules
            );

        -- ====================================================================
        -- VALIDADORES ADICIONALES (Corrección de discrepancias FE-059)
        -- ====================================================================

        WHEN 'validate_detective_connections' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_detective_connections(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        WHEN 'validate_prediction_scenarios' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_prediction_scenarios(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        WHEN 'validate_cause_effect_matching' THEN
            SELECT * INTO v_result
            FROM educational_content.validate_cause_effect_matching(
                v_exercise.solution,
                p_submitted_answer,
                max_score,
                v_config.allow_partial_credit
            );

        -- ====================================================================
        -- VALIDADOR NO IMPLEMENTADO
        -- ====================================================================

        ELSE
            RAISE EXCEPTION 'Validation function not implemented: %', v_config.validation_function;

    END CASE;

    -- ========================================================================
    -- 4. RETORNAR RESULTADO
    -- ========================================================================
    is_correct := v_result.is_correct;
    score := v_result.score;
    feedback := v_result.feedback;
    details := v_result.details;

EXCEPTION
    WHEN OTHERS THEN
        -- Manejo de errores: retornar respuesta segura
        RAISE WARNING 'Error validating exercise %: % (SQLSTATE: %)',
            p_exercise_id, SQLERRM, SQLSTATE;

        is_correct := false;
        score := 0;
        max_score := COALESCE(max_score, 100);
        feedback := 'Error al validar la respuesta. Por favor contacte al administrador.';
        details := jsonb_build_object(
            'error', SQLERRM,
            'error_detail', SQLSTATE,
            'exercise_id', p_exercise_id
        );
END;
$$;

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON FUNCTION educational_content.validate_answer IS
'Función maestra para validar respuestas de ejercicios.
Retorna: is_correct (boolean), score (integer), max_score (integer), feedback (text), details (jsonb).
Llama a validadores específicos según exercise_type.
Soporta 15 tipos de ejercicios (Módulos 1, 2, 3).';

-- ============================================================================
-- PERMISOS
-- ============================================================================

GRANT EXECUTE ON FUNCTION educational_content.validate_answer TO authenticated;
GRANT EXECUTE ON FUNCTION educational_content.validate_answer TO admin_teacher;

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================

/*
-- Ejemplo 1: Validar crucigrama
SELECT * FROM educational_content.validate_answer(
    'exercise-uuid-here'::uuid,
    '{"clues": {"h1": "SORBONA", "h2": "NOBEL"}}'::jsonb
);

-- Ejemplo 2: Validar verdadero/falso
SELECT * FROM educational_content.validate_answer(
    'exercise-uuid-here'::uuid,
    '{"statements": {"stmt1": true, "stmt2": false}}'::jsonb
);

-- Ejemplo 3: Validar completar espacios
SELECT * FROM educational_content.validate_answer(
    'exercise-uuid-here'::uuid,
    '{"blanks": {"blank1": "científica", "blank2": "Nobel"}}'::jsonb
);

-- Resultado esperado (RECORD):
-- is_correct | score | max_score | feedback                    | details
-- -----------|-------|-----------|-----------------------------|---------
-- true       | 100   | 100       | ¡Perfecto! 2/2 correctas    | {...}
*/
