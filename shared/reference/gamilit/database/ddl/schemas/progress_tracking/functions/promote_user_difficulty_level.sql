-- =====================================================
-- Function: progress_tracking.promote_user_difficulty_level
-- Description: Promociona al usuario al siguiente nivel de dificultad CEFR
-- Parameters:
--   - p_user_id: UUID - ID del usuario
--   - p_from_level: educational_content.difficulty_level - Nivel actual
--   - p_to_level: educational_content.difficulty_level - Nivel destino
-- Returns: VOID
-- Created: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION progress_tracking.promote_user_difficulty_level(
    p_user_id UUID,
    p_from_level educational_content.difficulty_level,
    p_to_level educational_content.difficulty_level
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Actualizar current_level
    UPDATE progress_tracking.user_current_level
    SET
        previous_level = p_from_level,
        current_level = p_to_level,
        max_allowed_level = CASE
            -- Permitir 1 nivel por encima (zona de desarrollo próximo)
            WHEN p_to_level = 'beginner' THEN 'elementary'
            WHEN p_to_level = 'elementary' THEN 'pre_intermediate'
            WHEN p_to_level = 'pre_intermediate' THEN 'intermediate'
            WHEN p_to_level = 'intermediate' THEN 'upper_intermediate'
            WHEN p_to_level = 'upper_intermediate' THEN 'advanced'
            WHEN p_to_level = 'advanced' THEN 'proficient'
            WHEN p_to_level = 'proficient' THEN 'native'
            WHEN p_to_level = 'native' THEN 'native'
        END,
        level_changed_at = gamilit.now_mexico(),
        updated_at = gamilit.now_mexico()
    WHERE user_id = p_user_id;

    -- Marcar el nivel anterior como promocionado
    UPDATE progress_tracking.user_difficulty_progress
    SET
        promoted_at = gamilit.now_mexico(),
        is_ready_for_promotion = FALSE,
        updated_at = gamilit.now_mexico()
    WHERE user_id = p_user_id
      AND difficulty_level = p_from_level;

    -- Crear entrada para el nuevo nivel si no existe
    INSERT INTO progress_tracking.user_difficulty_progress
    (user_id, difficulty_level, first_attempt_at)
    VALUES (p_user_id, p_to_level, gamilit.now_mexico())
    ON CONFLICT (user_id, difficulty_level) DO NOTHING;

    -- TODO: Crear notificación de promoción (requiere tabla notifications)
    -- TODO: Crear achievement si es el primer usuario en alcanzar este nivel

    -- Log de auditoría
    RAISE NOTICE 'Promoción exitosa: Usuario % promovido de % a %',
        p_user_id, p_from_level, p_to_level;
END;
$$;

COMMENT ON FUNCTION progress_tracking.promote_user_difficulty_level(UUID, educational_content.difficulty_level, educational_content.difficulty_level) IS
'Promociona al usuario al siguiente nivel de dificultad CEFR y actualiza zona de desarrollo próximo (ZDP).
SECURITY DEFINER permite actualizar tablas sin permisos directos.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION progress_tracking.promote_user_difficulty_level(UUID, educational_content.difficulty_level, educational_content.difficulty_level) TO authenticated;
