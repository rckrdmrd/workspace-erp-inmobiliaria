-- =====================================================
-- Function: gamification_system.update_leaderboard_coins
-- Description: Actualiza posición del usuario en el leaderboard de monedas ML
-- Parameters:
--   - p_user_id: UUID - ID del usuario
-- Returns: TABLE (rank INTEGER, total_coins INTEGER, position_change INTEGER)
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.update_leaderboard_coins(
    p_user_id UUID
)
RETURNS TABLE (
    rank INTEGER,
    total_coins INTEGER,
    position_change INTEGER
) AS $$
DECLARE
    v_user_coins INTEGER;
    v_old_rank INTEGER;
    v_new_rank INTEGER;
BEGIN
    -- Obtener monedas del usuario
    SELECT COALESCE(us.ml_coins, 0) INTO v_user_coins
    FROM gamification_system.user_stats us
    WHERE us.user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Obtener ranking anterior (simulado)
    v_old_rank := 1;

    -- Calcular nuevo ranking
    SELECT COUNT(*) + 1 INTO v_new_rank
    FROM gamification_system.user_stats us
    WHERE COALESCE(us.ml_coins, 0) > v_user_coins;

    -- Retornar información del ranking
    RETURN QUERY SELECT
        v_new_rank::INTEGER,
        v_user_coins::INTEGER,
        (v_old_rank - v_new_rank)::INTEGER;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamification_system.update_leaderboard_coins(UUID) IS
    'Actualiza posición del usuario en leaderboard de monedas ML';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.update_leaderboard_coins(UUID) TO authenticated;
