-- =====================================================
-- Function: gamification_system.get_rank_benefits
-- Description: Obtiene los beneficios (perks) de un rango Maya
-- Parameters:
--   - p_rank: gamification_system.maya_rank - Rango a consultar
-- Returns: JSONB - Array de beneficios ["xp_boost_10", "daily_bonus", ...]
-- Created: 2025-11-11
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.get_rank_benefits(
    p_rank gamification_system.maya_rank
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_perks JSONB;
BEGIN
    -- Obtener perks desde maya_ranks table
    SELECT perks
    INTO v_perks
    FROM gamification_system.maya_ranks
    WHERE rank_name = p_rank
      AND is_active = true;

    -- Si no se encuentra, retornar array vacío
    IF NOT FOUND OR v_perks IS NULL THEN
        RETURN '[]'::jsonb;
    END IF;

    RETURN v_perks;
END;
$$;

COMMENT ON FUNCTION gamification_system.get_rank_benefits(gamification_system.maya_rank) IS
'Obtiene los beneficios (perks) de un rango Maya. Lee dinámicamente desde maya_ranks table.
Retorna [] si el rango no existe o no está activo.
Ejemplo de retorno: ["xp_boost_10", "daily_bonus", "forum_access"]';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.get_rank_benefits(gamification_system.maya_rank) TO authenticated;
