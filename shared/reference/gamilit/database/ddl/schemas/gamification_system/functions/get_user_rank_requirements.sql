-- =====================================================
-- Function: gamification_system.get_user_rank_requirements
-- Description: Obtiene requisitos para el siguiente rango maya
-- Parameters: p_current_rank VARCHAR
-- Returns: record
-- Created: 2025-10-27
-- Modified: 2025-11-02
-- =====================================================

CREATE OR REPLACE FUNCTION gamification_system.get_user_rank_requirements(p_current_rank VARCHAR)
 RETURNS TABLE(next_rank VARCHAR, modules_required INTEGER, xp_required INTEGER, ml_coins_bonus INTEGER)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        CASE p_current_rank
            WHEN 'Ajaw' THEN 'Nacom'::VARCHAR
            WHEN 'Nacom' THEN 'Ah K''in'::VARCHAR
            WHEN 'Ah K''in' THEN 'Halach Uinic'::VARCHAR
            WHEN 'Halach Uinic' THEN 'K''uk''ulkan'::VARCHAR
            ELSE NULL::VARCHAR
        END,
        CASE p_current_rank
            WHEN 'Ajaw' THEN 1              -- 1 módulo para Nacom
            WHEN 'Nacom' THEN 2             -- 2 módulos para Ah K'in
            WHEN 'Ah K''in' THEN 3          -- 3 módulos para Halach Uinic
            WHEN 'Halach Uinic' THEN 5      -- 5 módulos para K'uk'ulkan
            ELSE 0
        END,
        CASE p_current_rank
            WHEN 'Ajaw' THEN 1000           -- XP requerido para Nacom
            WHEN 'Nacom' THEN 3000          -- XP requerido para Ah K'in
            WHEN 'Ah K''in' THEN 6000       -- XP requerido para Halach Uinic
            WHEN 'Halach Uinic' THEN 10000  -- XP requerido para K'uk'ulkan
            ELSE 0
        END,
        CASE p_current_rank
            WHEN 'Ajaw' THEN 100
            WHEN 'Nacom' THEN 250
            WHEN 'Ah K''in' THEN 500
            WHEN 'Halach Uinic' THEN 1000
            ELSE 0
        END;
END;
$function$;

COMMENT ON FUNCTION gamification_system.get_user_rank_requirements(p_current_rank VARCHAR) IS 'Obtiene requisitos para el siguiente rango maya';

-- Grant permissions
GRANT EXECUTE ON FUNCTION gamification_system.get_user_rank_requirements(VARCHAR) TO authenticated;
