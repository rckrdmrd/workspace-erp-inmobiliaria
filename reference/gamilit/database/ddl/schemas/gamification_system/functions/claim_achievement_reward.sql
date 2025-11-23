-- Nombre: claim_achievement_reward
-- Descripción: Reclama la recompensa de un logro ya desbloqueado
-- Schema: gamification_system
-- Tipo: FUNCTION

CREATE OR REPLACE FUNCTION gamification_system.claim_achievement_reward(
    p_user_id UUID,
    p_achievement_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    xp_granted INTEGER,
    coins_granted INTEGER,
    message VARCHAR
) AS $$
DECLARE
    v_user_achievement RECORD;
    v_achievement RECORD;
    v_already_claimed BOOLEAN;
BEGIN
    -- Verificar que el usuario tiene el logro
    SELECT * INTO v_user_achievement
    FROM gamification_system.user_achievements
    WHERE user_id = p_user_id
    AND achievement_id = p_achievement_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0, 0, 'Usuario no tiene este logro'::VARCHAR;
        RETURN;
    END IF;

    -- Verificar si ya fue reclamado
    v_already_claimed := v_user_achievement.reward_claimed_at IS NOT NULL;

    IF v_already_claimed THEN
        RETURN QUERY SELECT false, 0, 0, 'Recompensa ya fue reclamada'::VARCHAR;
        RETURN;
    END IF;

    -- Obtener datos del logro
    SELECT * INTO v_achievement
    FROM gamification_system.achievements
    WHERE id = p_achievement_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0, 0, 'Logro no encontrado'::VARCHAR;
        RETURN;
    END IF;

    -- Marcar recompensa como reclamada
    UPDATE gamification_system.user_achievements
    SET reward_claimed_at = NOW()
    WHERE user_id = p_user_id
    AND achievement_id = p_achievement_id;

    -- Otorgar recompensas
    UPDATE gamification_system.user_stats
    SET
        total_xp = total_xp + v_achievement.xp_reward,
        ml_coins = ml_coins + v_achievement.ml_coins_reward,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Registrar transacción de coins si aplica
    IF v_achievement.ml_coins_reward > 0 THEN
        INSERT INTO gamification_system.ml_coins_transactions (
            user_id,
            amount,
            transaction_type,
            description
        ) VALUES (
            p_user_id,
            v_achievement.ml_coins_reward,
            'ACHIEVEMENT_REWARD',
            'Recompensa reclamada: ' || v_achievement.name
        );
    END IF;

    RETURN QUERY SELECT
        true,
        v_achievement.xp_reward,
        v_achievement.ml_coins_reward,
        'Recompensa reclamada exitosamente'::VARCHAR;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamification_system.claim_achievement_reward(UUID, UUID) IS
    'Reclama la recompensa de un logro desbloqueado';

GRANT EXECUTE ON FUNCTION gamification_system.claim_achievement_reward(UUID, UUID) TO authenticated;
