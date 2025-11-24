-- ============================================================================
-- FUNCIÓN: recalculate_exercise
-- Descripción: Recalcula la validación de un ejercicio basado en su audit_id
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.recalculate_exercise(
    p_original_audit_id UUID,
    p_recalculated_by UUID,
    p_recalculation_reason TEXT,
    OUT new_audit_id UUID,
    OUT original_score INTEGER,
    OUT new_score INTEGER,
    OUT has_discrepancy BOOLEAN,
    OUT discrepancy_details JSONB
)
RETURNS RECORD
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_original_audit RECORD;
    v_validation_result RECORD;
    v_exercise_id UUID;
    v_user_id UUID;
    v_submitted_answer JSONB;
    v_exercise_snapshot JSONB;
    v_config_snapshot JSONB;
    v_validation_duration_ms INTEGER;
    v_validation_start TIMESTAMP WITH TIME ZONE;
    v_validation_end TIMESTAMP WITH TIME ZONE;
    v_discrepancy_type TEXT;
BEGIN
    -- ========================================================================
    -- 1. RECUPERAR REGISTRO DE AUDITORÍA ORIGINAL
    -- ========================================================================
    SELECT *
    INTO v_original_audit
    FROM educational_content.exercise_validation_audit
    WHERE id = p_original_audit_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audit record not found: %', p_original_audit_id;
    END IF;

    IF v_original_audit.is_recalculated = true THEN
        RAISE EXCEPTION 'Audit record % is already a recalculation. Use the original_audit_id instead.',
            p_original_audit_id;
    END IF;

    -- Extraer datos necesarios
    v_exercise_id := v_original_audit.exercise_id;
    v_user_id := v_original_audit.user_id;
    v_submitted_answer := v_original_audit.submitted_answer;
    v_exercise_snapshot := v_original_audit.exercise_snapshot;
    v_config_snapshot := v_original_audit.validation_config_snapshot;
    original_score := v_original_audit.score;

    -- ========================================================================
    -- 2. RE-EJECUTAR VALIDACIÓN CON LA RESPUESTA ORIGINAL
    -- ========================================================================
    v_validation_start := clock_timestamp();

    -- NOTA: Usamos validate_answer() con el ejercicio ACTUAL, no el snapshot
    -- Si se requiere validar con el snapshot exacto, necesitaríamos una función diferente
    SELECT * INTO v_validation_result
    FROM educational_content.validate_answer(
        v_exercise_id,
        v_submitted_answer
    );

    v_validation_end := clock_timestamp();
    v_validation_duration_ms := EXTRACT(MILLISECONDS FROM (v_validation_end - v_validation_start))::INTEGER;

    new_score := v_validation_result.score;

    -- ========================================================================
    -- 3. DETECTAR DISCREPANCIAS
    -- ========================================================================
    has_discrepancy := false;
    v_discrepancy_type := NULL;

    IF v_original_audit.is_correct != v_validation_result.is_correct THEN
        has_discrepancy := true;
        v_discrepancy_type := 'correctness_changed';
    ELSIF v_original_audit.score != v_validation_result.score THEN
        has_discrepancy := true;
        v_discrepancy_type := 'score_changed';
    END IF;

    discrepancy_details := jsonb_build_object(
        'original_is_correct', v_original_audit.is_correct,
        'new_is_correct', v_validation_result.is_correct,
        'original_score', v_original_audit.score,
        'new_score', v_validation_result.score,
        'score_difference', v_validation_result.score - v_original_audit.score,
        'original_feedback', v_original_audit.feedback,
        'new_feedback', v_validation_result.feedback
    );

    -- ========================================================================
    -- 4. CREAR NUEVO REGISTRO DE AUDITORÍA (RECÁLCULO)
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
        recalculated_at,
        recalculated_by,
        recalculation_reason,
        original_audit_id,
        has_discrepancy,
        discrepancy_type,
        discrepancy_notes,
        client_metadata
    )
    VALUES (
        v_exercise_id,
        v_user_id,
        v_original_audit.attempt_number,
        v_submitted_answer,
        v_original_audit.submitted_at,  -- Mantener timestamp original
        v_exercise_snapshot,
        v_config_snapshot,
        v_validation_result.is_correct,
        v_validation_result.score,
        v_validation_result.max_score,
        v_validation_result.feedback,
        v_validation_result.details,
        v_original_audit.validation_function_used,
        gamilit.now_mexico(),  -- Timestamp del recálculo
        v_validation_duration_ms,
        true,  -- es recálculo
        gamilit.now_mexico(),
        p_recalculated_by,
        p_recalculation_reason,
        p_original_audit_id,
        has_discrepancy,
        v_discrepancy_type,
        CASE
            WHEN has_discrepancy THEN
                format('Recálculo encontró diferencias: %s cambió de %s a %s',
                       v_discrepancy_type,
                       v_original_audit.score,
                       v_validation_result.score)
            ELSE 'Recálculo confirmó resultado original'
        END,
        '{"source": "recalculation"}'::jsonb
    )
    RETURNING id INTO new_audit_id;

    -- ========================================================================
    -- 5. SI HAY DISCREPANCIA, MARCAR EL REGISTRO ORIGINAL
    -- ========================================================================
    IF has_discrepancy THEN
        UPDATE educational_content.exercise_validation_audit
        SET
            has_discrepancy = true,
            discrepancy_type = v_discrepancy_type,
            discrepancy_notes = format('Discrepancia detectada en recálculo %s: score cambió de %s a %s',
                                      new_audit_id,
                                      original_score,
                                      new_score),
            updated_at = gamilit.now_mexico()
        WHERE id = p_original_audit_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error recalculating exercise: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON FUNCTION educational_content.recalculate_exercise IS
'Recalcula la validación de un ejercicio basado en su audit_id original.
Usa la misma respuesta enviada por el usuario (snapshot inmutable).
Crea nuevo registro de auditoría marcado como recálculo.
Si hay discrepancia (score o correctness cambió), marca ambos registros.
Útil para verificar si hubo errores en la validación original.';

-- ============================================================================
-- PERMISOS
-- ============================================================================

-- Solo profesores pueden recalcular
GRANT EXECUTE ON FUNCTION educational_content.recalculate_exercise TO admin_teacher;

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================

/*
-- Ejemplo 1: Recalcular una validación específica
SELECT * FROM educational_content.recalculate_exercise(
    'original-audit-id-uuid'::uuid,
    'teacher-user-id-uuid'::uuid,
    'Estudiante reportó error en la calificación'
);

-- Resultado esperado:
-- new_audit_id | original_score | new_score | has_discrepancy | discrepancy_details
-- -------------|----------------|-----------|-----------------|--------------------
-- uuid-new     | 80             | 100       | true            | {...}

-- Ejemplo 2: Ver todas las discrepancias detectadas
SELECT
    va_orig.exercise_id,
    va_orig.user_id,
    va_orig.score AS original_score,
    va_recalc.score AS recalculated_score,
    va_orig.discrepancy_type,
    va_orig.discrepancy_notes
FROM educational_content.exercise_validation_audit va_orig
JOIN educational_content.exercise_validation_audit va_recalc
    ON va_recalc.original_audit_id = va_orig.id
WHERE va_orig.has_discrepancy = true
ORDER BY va_orig.validation_timestamp DESC;

-- Ejemplo 3: Recalcular todos los intentos de un ejercicio específico
-- (usar con cuidado - puede ser costoso)
WITH original_audits AS (
    SELECT id
    FROM educational_content.exercise_validation_audit
    WHERE exercise_id = 'exercise-uuid-here'
      AND is_recalculated = false
    LIMIT 10
)
SELECT
    oa.id AS original_audit_id,
    (SELECT * FROM educational_content.recalculate_exercise(
        oa.id,
        'teacher-uuid-here'::uuid,
        'Revisión masiva del ejercicio'
    )).*
FROM original_audits oa;
*/
