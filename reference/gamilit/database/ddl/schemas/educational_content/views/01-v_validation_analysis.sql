-- ============================================================================
-- VISTA: v_validation_analysis
-- Descripción: Vista para análisis de validaciones y discrepancias
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE VIEW educational_content.v_validation_analysis AS
SELECT
    -- Identificadores
    va.id AS audit_id,
    va.exercise_id,
    e.title AS exercise_title,
    e.exercise_type,
    e.module_id,
    m.title AS module_title,
    va.user_id,
    va.attempt_number,

    -- Información de validación
    va.validation_function_used,
    va.is_correct,
    va.score,
    va.max_score,
    ROUND((va.score::NUMERIC / NULLIF(va.max_score, 0)) * 100, 2) AS score_percentage,
    va.feedback,
    va.validation_timestamp,
    va.validation_duration_ms,

    -- Información de recálculo
    va.is_recalculated,
    va.recalculated_at,
    va.recalculated_by,
    va.recalculation_reason,
    va.original_audit_id,

    -- Discrepancias
    va.has_discrepancy,
    va.discrepancy_type,
    va.discrepancy_notes,

    -- Si es recálculo, incluir comparación con original
    CASE
        WHEN va.is_recalculated THEN
            (SELECT score FROM educational_content.exercise_validation_audit WHERE id = va.original_audit_id)
        ELSE NULL
    END AS original_score,

    CASE
        WHEN va.is_recalculated THEN
            va.score - (SELECT score FROM educational_content.exercise_validation_audit WHERE id = va.original_audit_id)
        ELSE NULL
    END AS score_difference,

    -- Metadata
    va.submitted_at,
    va.client_metadata,
    va.created_at,
    va.updated_at

FROM educational_content.exercise_validation_audit va
JOIN educational_content.exercises e ON e.id = va.exercise_id
LEFT JOIN educational_content.modules m ON m.id = e.module_id;

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

COMMENT ON VIEW educational_content.v_validation_analysis IS
'Vista para análisis de validaciones de ejercicios.
Incluye información de ejercicio, usuario, validación, recálculos y discrepancias.
Útil para dashboards de profesores y análisis de calidad de validaciones.';

-- ============================================================================
-- PERMISOS
-- ============================================================================

GRANT SELECT ON educational_content.v_validation_analysis TO authenticated;
GRANT SELECT ON educational_content.v_validation_analysis TO admin_teacher;

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================

/*
-- Ejemplo 1: Ver todas las discrepancias detectadas
SELECT
    exercise_title,
    user_id,
    attempt_number,
    original_score,
    score AS new_score,
    score_difference,
    discrepancy_type,
    discrepancy_notes
FROM educational_content.v_validation_analysis
WHERE has_discrepancy = true
ORDER BY validation_timestamp DESC
LIMIT 20;

-- Ejemplo 2: Estadísticas por tipo de ejercicio
SELECT
    exercise_type,
    COUNT(*) AS total_validations,
    COUNT(*) FILTER (WHERE is_correct) AS correct_count,
    ROUND(AVG(score_percentage), 2) AS avg_score_percentage,
    COUNT(*) FILTER (WHERE has_discrepancy) AS discrepancy_count,
    ROUND(AVG(validation_duration_ms), 2) AS avg_duration_ms
FROM educational_content.v_validation_analysis
WHERE is_recalculated = false  -- Solo originales
GROUP BY exercise_type
ORDER BY total_validations DESC;

-- Ejemplo 3: Rendimiento de un estudiante específico
SELECT
    module_title,
    exercise_title,
    attempt_number,
    is_correct,
    score,
    max_score,
    score_percentage,
    validation_timestamp
FROM educational_content.v_validation_analysis
WHERE user_id = 'student-uuid-here'
  AND is_recalculated = false
ORDER BY validation_timestamp DESC;

-- Ejemplo 4: Ejercicios con más discrepancias (posible problema en validador)
SELECT
    exercise_id,
    exercise_title,
    exercise_type,
    COUNT(*) FILTER (WHERE has_discrepancy) AS discrepancy_count,
    COUNT(*) AS total_attempts,
    ROUND(
        (COUNT(*) FILTER (WHERE has_discrepancy)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
        2
    ) AS discrepancy_percentage
FROM educational_content.v_validation_analysis
WHERE is_recalculated = false
GROUP BY exercise_id, exercise_title, exercise_type
HAVING COUNT(*) FILTER (WHERE has_discrepancy) > 0
ORDER BY discrepancy_percentage DESC, discrepancy_count DESC
LIMIT 10;

-- Ejemplo 5: Validaciones recientes con bajo rendimiento
SELECT
    exercise_title,
    user_id,
    score_percentage,
    feedback,
    validation_timestamp
FROM educational_content.v_validation_analysis
WHERE is_recalculated = false
  AND score_percentage < 70
  AND validation_timestamp > (CURRENT_TIMESTAMP - INTERVAL '7 days')
ORDER BY validation_timestamp DESC
LIMIT 20;
*/
