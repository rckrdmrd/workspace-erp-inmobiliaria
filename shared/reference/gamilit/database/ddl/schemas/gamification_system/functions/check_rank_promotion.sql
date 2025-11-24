-- =====================================================
-- Function: gamification_system.check_rank_promotion
-- Description: Verifica si un usuario califica para promoción de rango
-- Parameters:
--   - p_user_id: UUID - ID del usuario
-- Returns: BOOLEAN - true si fue promovido, false en caso contrario
-- Created: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.check_rank_promotion(
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con permisos del owner
AS $$
DECLARE
    v_current_rank gamification_system.maya_rank;
    v_total_xp BIGINT;
    v_next_rank gamification_system.maya_rank;
    v_next_rank_min_xp BIGINT;
    v_promoted BOOLEAN := false;
BEGIN
    -- Obtener datos actuales del usuario
    SELECT current_rank, total_xp
    INTO v_current_rank, v_total_xp
    FROM gamification_system.user_stats
    WHERE user_id = p_user_id
    FOR UPDATE; -- Lock para evitar race conditions

    -- Si no existe usuario, salir
    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- Verificar si hay un siguiente rango disponible
    SELECT mr.next_rank, next_mr.min_xp_required
    INTO v_next_rank, v_next_rank_min_xp
    FROM gamification_system.maya_ranks mr
    LEFT JOIN gamification_system.maya_ranks next_mr
        ON next_mr.rank_name = mr.next_rank
    WHERE mr.rank_name = v_current_rank
      AND mr.is_active = true;

    -- Si no hay siguiente rango (ya está en máximo), no promocionar
    IF v_next_rank IS NULL THEN
        RETURN false;
    END IF;

    -- Verificar si el usuario tiene suficiente XP para el siguiente rango
    IF v_total_xp >= v_next_rank_min_xp THEN
        -- Promover al siguiente rango
        PERFORM gamification_system.promote_to_next_rank(p_user_id, v_next_rank);
        v_promoted := true;
    END IF;

    RETURN v_promoted;
END;
$$;

COMMENT ON FUNCTION gamification_system.check_rank_promotion(UUID) IS
'Verifica si un usuario califica para promoción de rango según su total_xp actual.
Lee configuración dinámica desde maya_ranks table (next_rank y min_xp_required).
Retorna true si el usuario fue promovido, false en caso contrario.
Se ejecuta automáticamente mediante trigger después de actualizar total_xp.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.check_rank_promotion(UUID) TO authenticated;
