-- =====================================================
-- Function: progress_tracking.check_difficulty_promotion_eligibility
-- Description: Verifica si un usuario cumple criterios para promoción de nivel CEFR
-- Parameters:
--   - p_user_id: UUID - ID del usuario
--   - p_difficulty_level: educational_content.difficulty_level - Nivel a evaluar
-- Returns: BOOLEAN - true si es elegible, false en caso contrario
-- Created: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION progress_tracking.check_difficulty_promotion_eligibility(
    p_user_id UUID,
    p_difficulty_level educational_content.difficulty_level
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_progress RECORD;
    v_criteria RECORD;
    v_time_ratio NUMERIC;
    v_avg_time_for_level NUMERIC;
BEGIN
    -- Obtener progreso del usuario
    SELECT *
    INTO v_user_progress
    FROM progress_tracking.user_difficulty_progress
    WHERE user_id = p_user_id
      AND difficulty_level = p_difficulty_level;

    -- Si no tiene intentos, no es elegible
    IF NOT FOUND OR v_user_progress.exercises_attempted < 1 THEN
        RETURN FALSE;
    END IF;

    -- Obtener criterios del nivel
    SELECT *
    INTO v_criteria
    FROM educational_content.difficulty_criteria
    WHERE level = p_difficulty_level;

    -- Verificar cantidad mínima de ejercicios
    IF v_user_progress.exercises_completed < v_criteria.promotion_min_exercises THEN
        RETURN FALSE;
    END IF;

    -- Verificar tasa de éxito
    IF v_user_progress.success_rate < v_criteria.promotion_success_rate THEN
        RETURN FALSE;
    END IF;

    -- Verificar tiempo promedio
    -- Calcular el tiempo promedio esperado para este nivel
    SELECT AVG(udp.avg_time_per_exercise)
    INTO v_avg_time_for_level
    FROM progress_tracking.user_difficulty_progress udp
    WHERE udp.difficulty_level = p_difficulty_level
      AND udp.exercises_completed >= 10;

    -- Si hay datos suficientes, verificar que el usuario no toma excesivo tiempo
    IF v_avg_time_for_level IS NOT NULL AND v_avg_time_for_level > 0 THEN
        v_time_ratio := v_user_progress.avg_time_per_exercise / v_avg_time_for_level;

        IF v_time_ratio > v_criteria.promotion_time_threshold THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- Si pasa todos los criterios, es elegible
    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION progress_tracking.check_difficulty_promotion_eligibility(UUID, educational_content.difficulty_level) IS
'Verifica si un usuario cumple los criterios para promoción al siguiente nivel de dificultad CEFR.
Criterios evaluados: mínimo de ejercicios, tasa de éxito, y tiempo promedio vs otros usuarios.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION progress_tracking.check_difficulty_promotion_eligibility(UUID, educational_content.difficulty_level) TO authenticated;
