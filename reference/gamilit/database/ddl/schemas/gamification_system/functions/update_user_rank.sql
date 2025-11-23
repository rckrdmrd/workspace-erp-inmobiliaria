-- =====================================================
-- Function: gamification_system.update_user_rank
-- Description: Actualiza el rango del usuario basado en XP total y otorga recompensas
-- Parameters:
--   - p_user_id: UUID - ID del usuario
-- Returns: TABLE (old_rank, new_rank, rank_up, reward_coins)
-- Created: 2025-11-02
-- Updated: 2025-11-11 - Refactorizado para usar maya_rank ENUM y leer de maya_ranks table
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.update_user_rank(
    p_user_id UUID
)
RETURNS TABLE (
    old_rank gamification_system.maya_rank,
    new_rank gamification_system.maya_rank,
    rank_up BOOLEAN,
    reward_coins INTEGER
) AS $$
DECLARE
    v_current_xp BIGINT;
    v_old_rank gamification_system.maya_rank;
    v_new_rank gamification_system.maya_rank;
    v_coins_reward INTEGER := 0;
BEGIN
    -- Obtener XP y rango actual
    SELECT COALESCE(us.total_xp, 0), COALESCE(ur.current_rank, 'Ajaw'::gamification_system.maya_rank)
    INTO v_current_xp, v_old_rank
    FROM gamification_system.user_stats us
    LEFT JOIN gamification_system.user_ranks ur ON ur.user_id = us.user_id
    WHERE us.user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Calcular nuevo rango dinámicamente desde maya_ranks table
    SELECT mr.rank_name, mr.ml_coins_bonus
    INTO v_new_rank, v_coins_reward
    FROM gamification_system.maya_ranks mr
    WHERE mr.is_active = true
      AND v_current_xp >= mr.min_xp_required
      AND (mr.max_xp_threshold IS NULL OR v_current_xp <= mr.max_xp_threshold)
    ORDER BY mr.rank_order DESC
    LIMIT 1;

    -- Si no se encontró un rango válido, usar Ajaw por defecto
    IF v_new_rank IS NULL THEN
        v_new_rank := 'Ajaw'::gamification_system.maya_rank;
        v_coins_reward := 0;
    END IF;

    -- Si hubo cambio de rango
    IF v_new_rank != v_old_rank THEN
        -- Actualizar coins en user_stats
        UPDATE gamification_system.user_stats
        SET
            ml_coins = COALESCE(ml_coins, 0) + v_coins_reward,
            updated_at = NOW()
        WHERE user_id = p_user_id;

        -- Actualizar rango en tabla de user_ranks
        INSERT INTO gamification_system.user_ranks (user_id, current_rank, updated_at)
        VALUES (p_user_id, v_new_rank, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET current_rank = v_new_rank, updated_at = NOW();

        -- Registrar transacción de coins
        INSERT INTO gamification_system.ml_coins_transactions (
            user_id, amount, transaction_type, description
        ) VALUES (
            p_user_id,
            v_coins_reward,
            'RANK_UP',
            'Ascendiste al rango ' || v_new_rank
        );
    END IF;

    RETURN QUERY SELECT
        v_old_rank,
        v_new_rank,
        (v_new_rank != v_old_rank)::BOOLEAN,
        v_coins_reward;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamification_system.update_user_rank(UUID) IS
    'Actualiza el rango del usuario basado en XP total y otorga recompensas. Lee configuración dinámica desde maya_ranks table.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.update_user_rank(UUID) TO authenticated;
