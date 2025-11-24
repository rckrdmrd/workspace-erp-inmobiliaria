-- Function: gamification_system.process_exercise_completion
-- Description: Procesa y otorga recompensas por completar ejercicios
-- Parameters: p_user_id UUID, p_exercise_id UUID, p_xp_earned INTEGER
-- Returns: TABLE (user_id, xp_awarded, coins_awarded, level_up, achievement_triggered)
-- Example:
--   SELECT * FROM gamification_system.process_exercise_completion('123e4567-e89b-12d3-a456-426614174000', 'uuid-exercise', 100);
-- Dependencies: gamification_system.user_stats
-- Created: 2025-11-02

CREATE OR REPLACE FUNCTION gamification_system.process_exercise_completion(
    p_user_id UUID,
    p_exercise_id UUID,
    p_xp_earned INTEGER DEFAULT 100
)
RETURNS TABLE (
    user_id UUID,
    xp_awarded INTEGER,
    coins_awarded INTEGER,
    level_up BOOLEAN,
    achievement_triggered VARCHAR
) AS $$
DECLARE
    v_old_level INTEGER;
    v_new_level INTEGER;
    v_coins_reward INTEGER;
BEGIN
    -- Obtener nivel actual del usuario
    SELECT level INTO v_old_level
    FROM gamification_system.user_stats
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Calcular recompensa en coins (10% del XP)
    v_coins_reward := (p_xp_earned / 10)::INTEGER;

    -- Actualizar XP y coins
    UPDATE gamification_system.user_stats
    SET
        total_xp = total_xp + p_xp_earned,
        ml_coins = ml_coins + v_coins_reward,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Calcular nuevo nivel
    SELECT total_xp INTO v_new_level
    FROM gamification_system.user_stats
    WHERE user_id = p_user_id;
    
    v_new_level := (v_new_level / 1000)::INTEGER + 1;

    RETURN QUERY SELECT
        p_user_id,
        p_xp_earned,
        v_coins_reward,
        v_new_level > v_old_level,
        'EXERCISE_COMPLETED'::VARCHAR;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamification_system.process_exercise_completion(UUID, UUID, INTEGER) IS
    'Procesa y otorga recompensas por completar ejercicios';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.process_exercise_completion(UUID, UUID, INTEGER) TO authenticated;
