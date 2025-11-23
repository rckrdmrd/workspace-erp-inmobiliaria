-- =====================================================
-- Function: progress_tracking.update_difficulty_progress
-- Description: Actualiza el progreso del usuario en un nivel CEFR tras completar ejercicio
-- Parameters:
--   - p_user_id: UUID - ID del usuario
--   - p_difficulty_level: educational_content.difficulty_level - Nivel del ejercicio
--   - p_is_completed: BOOLEAN - Si completó el ejercicio
--   - p_is_correct_first_attempt: BOOLEAN - Si acertó en primer intento
--   - p_time_spent_seconds: INT - Tiempo gastado en segundos
-- Returns: VOID
-- Created: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION progress_tracking.update_difficulty_progress(
    p_user_id UUID,
    p_difficulty_level educational_content.difficulty_level,
    p_is_completed BOOLEAN,
    p_is_correct_first_attempt BOOLEAN,
    p_time_spent_seconds INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_eligible BOOLEAN;
BEGIN
    -- Upsert del progreso
    INSERT INTO progress_tracking.user_difficulty_progress (
        user_id,
        difficulty_level,
        exercises_attempted,
        exercises_completed,
        exercises_correct_first_attempt,
        total_time_spent_seconds,
        first_attempt_at,
        last_attempt_at
    )
    VALUES (
        p_user_id,
        p_difficulty_level,
        1,
        CASE WHEN p_is_completed THEN 1 ELSE 0 END,
        CASE WHEN p_is_correct_first_attempt THEN 1 ELSE 0 END,
        p_time_spent_seconds,
        gamilit.now_mexico(),
        gamilit.now_mexico()
    )
    ON CONFLICT (user_id, difficulty_level)
    DO UPDATE SET
        exercises_attempted = progress_tracking.user_difficulty_progress.exercises_attempted + 1,
        exercises_completed = progress_tracking.user_difficulty_progress.exercises_completed +
            CASE WHEN p_is_completed THEN 1 ELSE 0 END,
        exercises_correct_first_attempt = progress_tracking.user_difficulty_progress.exercises_correct_first_attempt +
            CASE WHEN p_is_correct_first_attempt THEN 1 ELSE 0 END,
        total_time_spent_seconds = progress_tracking.user_difficulty_progress.total_time_spent_seconds + p_time_spent_seconds,
        last_attempt_at = gamilit.now_mexico(),
        updated_at = gamilit.now_mexico();

    -- Verificar si ahora es elegible para promoción
    v_is_eligible := progress_tracking.check_difficulty_promotion_eligibility(p_user_id, p_difficulty_level);

    -- Actualizar flag de elegibilidad
    UPDATE progress_tracking.user_difficulty_progress
    SET is_ready_for_promotion = v_is_eligible
    WHERE user_id = p_user_id
      AND difficulty_level = p_difficulty_level;

    -- TODO: Si es elegible, crear notificación (requiere tabla notifications)

    -- Log
    IF v_is_eligible THEN
        RAISE NOTICE 'Usuario % ahora es elegible para promoción desde %',
            p_user_id, p_difficulty_level;
    END IF;
END;
$$;

COMMENT ON FUNCTION progress_tracking.update_difficulty_progress(UUID, educational_content.difficulty_level, BOOLEAN, BOOLEAN, INT) IS
'Actualiza el progreso del usuario en un nivel de dificultad CEFR tras completar un ejercicio.
Verifica automáticamente elegibilidad para promoción y actualiza flag is_ready_for_promotion.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION progress_tracking.update_difficulty_progress(UUID, educational_content.difficulty_level, BOOLEAN, BOOLEAN, INT) TO authenticated;
