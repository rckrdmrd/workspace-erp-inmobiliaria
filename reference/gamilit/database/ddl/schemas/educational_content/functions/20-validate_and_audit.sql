-- ============================================================================
-- FUNCIÓN: validate_and_audit
-- Descripción: Valida respuesta de ejercicio Y crea registro de auditoría
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_and_audit(
    p_exercise_id UUID,
    p_user_id UUID,
    p_submitted_answer JSONB,
    p_attempt_number INTEGER,
    p_client_metadata JSONB DEFAULT '{}'::jsonb,
    OUT is_correct BOOLEAN,
    OUT score INTEGER,
    OUT max_score INTEGER,
    OUT feedback TEXT,
    OUT details JSONB,
    OUT audit_id UUID
)
RETURNS RECORD
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_validation_start TIMESTAMP WITH TIME ZONE;
    v_validation_end TIMESTAMP WITH TIME ZONE;
    v_validation_duration_ms INTEGER;
    v_validation_result RECORD;
    v_exercise RECORD;
    v_config RECORD;
    v_exercise_snapshot JSONB;
    v_config_snapshot JSONB;
BEGIN
    -- Marcar inicio de validación
    v_validation_start := clock_timestamp();

    -- ========================================================================
    -- 1. RECUPERAR EJERCICIO Y CONFIGURACIÓN
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

    -- Recuperar configuración de validación
    SELECT *
    INTO v_config
    FROM educational_content.exercise_validation_config
    WHERE exercise_type = v_exercise.exercise_type;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Validation config not found for exercise_type: %', v_exercise.exercise_type;
    END IF;

    -- Crear snapshots para auditoría
    v_exercise_snapshot := jsonb_build_object(
        'exercise_type', v_exercise.exercise_type::text,
        'content', v_exercise.content,
        'solution', v_exercise.solution,
        'max_points', v_exercise.max_points
    );

    v_config_snapshot := jsonb_build_object(
        'validation_function', v_config.validation_function,
        'case_sensitive', v_config.case_sensitive,
        'allow_partial_credit', v_config.allow_partial_credit,
        'fuzzy_matching_threshold', v_config.fuzzy_matching_threshold,
        'normalize_text', v_config.normalize_text,
        'special_rules', v_config.special_rules,
        'default_max_points', v_config.default_max_points,
        'default_passing_score', v_config.default_passing_score
    );

    -- ========================================================================
    -- 2. EJECUTAR VALIDACIÓN
    -- ========================================================================
    SELECT * INTO v_validation_result
    FROM educational_content.validate_answer(
        p_exercise_id,
        p_submitted_answer
    );

    -- Marcar fin de validación y calcular duración
    v_validation_end := clock_timestamp();
    v_validation_duration_ms := EXTRACT(MILLISECONDS FROM (v_validation_end - v_validation_start))::INTEGER;

    -- ========================================================================
    -- 3. CREAR REGISTRO DE AUDITORÍA
    -- ========================================================================
    INSERT INTO educational_content.exercise_validation_audit (
        exercise_id,
        user_id,
        attempt_number,
        submitted_answer,
        submitted_at,
        exercise_snapshot,
        validation_config_snapshot,
        is_correct,
        score,
        max_score,
        feedback,
        validation_details,
        validation_function_used,
        validation_timestamp,
        validation_duration_ms,
        is_recalculated,
        client_metadata
    )
    VALUES (
        p_exercise_id,
        p_user_id,
        p_attempt_number,
        p_submitted_answer,
        gamilit.now_mexico(),
        v_exercise_snapshot,
        v_config_snapshot,
        v_validation_result.is_correct,
        v_validation_result.score,
        v_validation_result.max_score,
        v_validation_result.feedback,
        v_validation_result.details,
        v_config.validation_function,
        gamilit.now_mexico(),
        v_validation_duration_ms,
        false,  -- no es recálculo
        p_client_metadata
    )
    RETURNING id INTO audit_id;

    -- ========================================================================
    -- 4. RETORNAR RESULTADO DE VALIDACIÓN
    -- ========================================================================
    is_correct := v_validation_result.is_correct;
    score := v_validation_result.score;
    max_score := v_validation_result.max_score;
    feedback := v_validation_result.feedback;
    details := v_validation_result.details;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error pero no fallar completamente
        RAISE WARNING 'Error in validate_and_audit for exercise %: % (SQLSTATE: %)',
            p_exercise_id, SQLERRM, SQLSTATE;

        -- Intentar crear registro de auditoría de error
        BEGIN
            INSERT INTO educational_content.exercise_validation_audit (
                exercise_id,
                user_id,
                attempt_number,
                submitted_answer,
                submitted_at,
                exercise_snapshot,
                validation_config_snapshot,
                is_correct,
                score,
                max_score,
                feedback,
                validation_details,
                validation_function_used,
                validation_timestamp,
                validation_duration_ms,
                is_recalculated,
                client_metadata
            )
            VALUES (
                p_exercise_id,
                p_user_id,
                p_attempt_number,
                p_submitted_answer,
                gamilit.now_mexico(),
                COALESCE(v_exercise_snapshot, '{}'::jsonb),
                COALESCE(v_config_snapshot, '{}'::jsonb),
                false,
                0,
                COALESCE(v_exercise.max_points, 100),
                'Error al validar la respuesta. Por favor contacte al administrador.',
                jsonb_build_object(
                    'error', SQLERRM,
                    'error_detail', SQLSTATE,
                    'exercise_id', p_exercise_id
                ),
                COALESCE(v_config.validation_function, 'unknown'),
                gamilit.now_mexico(),
                0,
                false,
                p_client_metadata
            )
            RETURNING id INTO audit_id;
        EXCEPTION
            WHEN OTHERS THEN
                -- Si incluso el audit falla, solo registrar warning
                RAISE WARNING 'Failed to create audit record for failed validation: %', SQLERRM;
        END;

        -- Retornar respuesta de error
        is_correct := false;
        score := 0;
        max_score := COALESCE(v_exercise.max_points, 100);
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

COMMENT ON FUNCTION educational_content.validate_and_audit IS
'Función completa para validar respuesta de ejercicio Y crear registro de auditoría.
Esta debe ser la función principal llamada por el backend.
Retorna: is_correct, score, max_score, feedback, details, audit_id.
Crea snapshot inmutable de respuesta, ejercicio y configuración para trazabilidad.';

-- ============================================================================
-- PERMISOS
-- ============================================================================

GRANT EXECUTE ON FUNCTION educational_content.validate_and_audit TO authenticated;
GRANT EXECUTE ON FUNCTION educational_content.validate_and_audit TO admin_teacher;

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================

/*
-- Ejemplo 1: Validar y auditar crucigrama
SELECT * FROM educational_content.validate_and_audit(
    'exercise-uuid-here'::uuid,
    'user-uuid-here'::uuid,
    '{"clues": {"h1": "SORBONA", "h2": "NOBEL"}}'::jsonb,
    1,  -- primer intento
    '{"ip": "192.168.1.1", "session_id": "abc123"}'::jsonb
);

-- Resultado esperado (RECORD):
-- is_correct | score | max_score | feedback              | details | audit_id
-- -----------|-------|-----------|----------------------|---------|----------
-- true       | 100   | 100       | ¡Perfecto! 2/2 ... | {...}   | uuid-here

-- Ejemplo 2: Validar verdadero/falso (segundo intento)
SELECT * FROM educational_content.validate_and_audit(
    'exercise-uuid-here'::uuid,
    'user-uuid-here'::uuid,
    '{"statements": {"stmt1": true, "stmt2": false}}'::jsonb,
    2,  -- segundo intento
    '{}'::jsonb
);

-- Ejemplo 3: Verificar auditoría creada
SELECT
    user_id,
    attempt_number,
    is_correct,
    score,
    submitted_answer,
    validation_timestamp
FROM educational_content.exercise_validation_audit
WHERE exercise_id = 'exercise-uuid-here'
ORDER BY validation_timestamp DESC;
*/
