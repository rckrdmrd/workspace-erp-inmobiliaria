-- =====================================================
-- Function: gamification_system.update_leaderboard_global
-- Description: Obtiene la posición del usuario en el leaderboard global
-- Parameters:
--   - p_user_id: UUID - ID del usuario
--   - p_leaderboard_type: VARCHAR(50) - Tipo de leaderboard (XP, MISSIONS) default 'XP'
--   - p_scope: VARCHAR(20) - Alcance del leaderboard (GLOBAL, CLASSROOM) default 'GLOBAL'
-- Returns: TABLE (user_position, total_participants, user_score, top_score, percentile)
-- Created: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.update_leaderboard_global(
    p_user_id UUID,
    p_leaderboard_type VARCHAR(50) DEFAULT 'XP',
    p_scope VARCHAR(20) DEFAULT 'GLOBAL'
)
RETURNS TABLE (
    user_position INTEGER,
    total_participants INTEGER,
    user_score BIGINT,
    top_score BIGINT,
    percentile NUMERIC(5,2)
) AS $$
DECLARE
    v_position INTEGER;
    v_total INTEGER;
    v_user_score BIGINT;
    v_top_score BIGINT;
BEGIN
    -- Calcular posición según tipo de leaderboard
    IF p_leaderboard_type = 'XP' THEN
        SELECT COUNT(*) + 1 INTO v_position
        FROM gamification_system.user_stats
        WHERE total_xp > (
            SELECT COALESCE(total_xp, 0) FROM gamification_system.user_stats WHERE user_id = p_user_id
        );

        SELECT COALESCE(total_xp, 0) INTO v_user_score
        FROM gamification_system.user_stats
        WHERE user_id = p_user_id;

        SELECT COALESCE(MAX(total_xp), 0) INTO v_top_score
        FROM gamification_system.user_stats;

    ELSIF p_leaderboard_type = 'MISSIONS' THEN
        SELECT COUNT(*) + 1 INTO v_position
        FROM gamification_system.user_stats
        WHERE missions_completed > (
            SELECT COALESCE(missions_completed, 0) FROM gamification_system.user_stats WHERE user_id = p_user_id
        );

        SELECT COALESCE(missions_completed, 0) INTO v_user_score
        FROM gamification_system.user_stats
        WHERE user_id = p_user_id;

        SELECT COALESCE(MAX(missions_completed), 0) INTO v_top_score
        FROM gamification_system.user_stats;
    END IF;

    SELECT COUNT(*) INTO v_total
    FROM gamification_system.user_stats;

    RETURN QUERY SELECT
        v_position,
        v_total,
        v_user_score,
        v_top_score,
        CASE WHEN v_total > 0 THEN (100.0 - (v_position::NUMERIC / v_total * 100))::NUMERIC(5,2) ELSE 0::NUMERIC(5,2) END;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamification_system.update_leaderboard_global(UUID, VARCHAR, VARCHAR) IS
    'Obtiene la posición del usuario en el leaderboard global';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.update_leaderboard_global(UUID, VARCHAR, VARCHAR) TO authenticated;
