-- =====================================================
-- Trigger: trg_check_rank_promotion_on_xp_gain
-- Description: Verifica automáticamente promoción de rango cuando cambia total_xp
-- Table: gamification_system.user_stats
-- Event: AFTER UPDATE OF total_xp
-- Created: 2025-11-11
-- =====================================================

-- Función trigger
CREATE OR REPLACE FUNCTION gamification_system.trg_check_rank_promotion_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Solo verificar si total_xp aumentó
    IF NEW.total_xp > OLD.total_xp THEN
        -- Llamar a función de verificación de promoción
        PERFORM gamification_system.check_rank_promotion(NEW.user_id);
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION gamification_system.trg_check_rank_promotion_fn() IS
'Función trigger que verifica automáticamente si un usuario califica para promoción de rango
cuando su total_xp aumenta. Solo se ejecuta si total_xp > valor anterior.';

-- Crear trigger
DROP TRIGGER IF EXISTS trg_check_rank_promotion_on_xp_gain
    ON gamification_system.user_stats;

CREATE TRIGGER trg_check_rank_promotion_on_xp_gain
    AFTER UPDATE OF total_xp
    ON gamification_system.user_stats
    FOR EACH ROW
    WHEN (NEW.total_xp > OLD.total_xp)
    EXECUTE FUNCTION gamification_system.trg_check_rank_promotion_fn();

COMMENT ON TRIGGER trg_check_rank_promotion_on_xp_gain
    ON gamification_system.user_stats IS
'Trigger automático que verifica promoción de rango cuando total_xp aumenta.
Se ejecuta AFTER UPDATE para evitar mutating table errors.
Condición: Solo cuando total_xp aumenta (no cuando disminuye).';
