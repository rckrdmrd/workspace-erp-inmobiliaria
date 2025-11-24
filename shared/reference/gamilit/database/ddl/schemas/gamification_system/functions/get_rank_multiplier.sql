-- =====================================================
-- Function: gamification_system.get_rank_multiplier
-- Description: Obtiene el multiplicador de XP para un rango Maya
-- Parameters:
--   - p_rank: gamification_system.maya_rank - Rango a consultar
-- Returns: NUMERIC(3,2) - Multiplicador (1.00 = 100%, 1.50 = 150%)
-- Created: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.get_rank_multiplier(
    p_rank gamification_system.maya_rank
)
RETURNS NUMERIC(3,2)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_multiplier NUMERIC(3,2);
BEGIN
    -- Obtener multiplicador desde maya_ranks table
    SELECT xp_multiplier
    INTO v_multiplier
    FROM gamification_system.maya_ranks
    WHERE rank_name = p_rank
      AND is_active = true;

    -- Si no se encuentra, retornar 1.00 (sin bonus)
    IF NOT FOUND OR v_multiplier IS NULL THEN
        RETURN 1.00;
    END IF;

    RETURN v_multiplier;
END;
$$;

COMMENT ON FUNCTION gamification_system.get_rank_multiplier(gamification_system.maya_rank) IS
'Obtiene el multiplicador de XP para un rango Maya. Lee dinámicamente desde maya_ranks table.
Retorna 1.00 si el rango no existe o no está activo.';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.get_rank_multiplier(gamification_system.maya_rank) TO authenticated;
