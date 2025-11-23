-- Nombre: calculate_user_rank
-- Descripción: Calcula el rango actual del usuario basado en XP total y misiones completadas
-- Schema: gamification_system
-- Tipo: FUNCTION

CREATE OR REPLACE FUNCTION gamification_system.calculate_user_rank(p_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    current_rank VARCHAR,
    next_rank VARCHAR,
    xp_to_next_rank BIGINT,
    missions_to_next_rank INTEGER,
    rank_percentage NUMERIC(5,2)
) AS $$
DECLARE
    v_total_xp BIGINT;
    v_missions_completed INTEGER;
    v_current_rank VARCHAR;
    v_next_rank VARCHAR;
    v_next_rank_xp BIGINT;
    v_next_rank_missions INTEGER;
BEGIN
    -- Obtener estadísticas del usuario
    SELECT total_xp, missions_completed INTO v_total_xp, v_missions_completed
    FROM gamification_system.user_stats
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Determinar rango actual basado en XP
    SELECT current_rank INTO v_current_rank
    FROM gamification_system.user_ranks
    WHERE user_id = p_user_id
    AND is_current = true;

    -- Obtener siguiente rango desde maya_ranks
    SELECT name::VARCHAR, min_xp_required, missions_required
    INTO v_next_rank, v_next_rank_xp, v_next_rank_missions
    FROM gamification_system.maya_ranks
    WHERE name::VARCHAR > COALESCE(v_current_rank, 'Ajaw')
    ORDER BY min_xp_required ASC
    LIMIT 1;

    IF v_next_rank IS NULL THEN
        -- Usuario está en rango máximo
        v_next_rank := v_current_rank;
        v_next_rank_xp := v_total_xp;
        v_next_rank_missions := v_missions_completed;
    END IF;

    RETURN QUERY SELECT
        p_user_id,
        COALESCE(v_current_rank, 'Ajaw'::VARCHAR),
        v_next_rank,
        GREATEST(0, v_next_rank_xp - v_total_xp),
        GREATEST(0, COALESCE(v_next_rank_missions, 0) - v_missions_completed),
        LEAST(100.0::NUMERIC, (v_total_xp::NUMERIC / NULLIF(v_next_rank_xp, 0)) * 100);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION gamification_system.calculate_user_rank(UUID) IS
    'Calcula el rango actual del usuario basado en XP y misiones';

GRANT EXECUTE ON FUNCTION gamification_system.calculate_user_rank(UUID) TO authenticated;
