-- =====================================================================================
-- Trigger: trg_check_rank_promotion
-- Descripción: Trigger que verifica si un usuario merece promoción de rango Maya
--              después de ganar XP (por achievements o ejercicios)
-- Documentación: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-003-rangos-maya.md
-- Epic: EAI-003
-- Created: 2025-11-08
-- =====================================================================================

-- ========== Función del Trigger ==========
CREATE OR REPLACE FUNCTION gamification_system.fn_check_rank_promotion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_rank gamification_system.maya_rank;
    v_next_rank gamification_system.maya_rank;
    v_next_rank_threshold INTEGER;
    v_notification_id UUID;
BEGIN
    -- Solo ejecutar si el XP aumentó
    IF NEW.total_xp > OLD.total_xp THEN
        -- Obtener rango actual del usuario
        SELECT current_rank INTO v_current_rank
        FROM gamification_system.user_stats
        WHERE user_id = NEW.user_id;

        -- Verificar promoción según XP thresholds
        -- Ajaw (0-999) → Nacom (1000)
        IF v_current_rank = 'Ajaw' AND NEW.total_xp >= 1000 THEN
            v_next_rank := 'Nacom';
            v_next_rank_threshold := 1000;

        -- Nacom (1000-4999) → Ah K'in (5000)
        ELSIF v_current_rank = 'Nacom' AND NEW.total_xp >= 5000 THEN
            v_next_rank := 'Ah K''in';
            v_next_rank_threshold := 5000;

        -- Ah K'in (5000-19999) → Halach Uinic (20000)
        ELSIF v_current_rank = 'Ah K''in' AND NEW.total_xp >= 20000 THEN
            v_next_rank := 'Halach Uinic';
            v_next_rank_threshold := 20000;

        -- Halach Uinic (20000-99999) → K'uk'ulkan (100000)
        ELSIF v_current_rank = 'Halach Uinic' AND NEW.total_xp >= 100000 THEN
            v_next_rank := 'K''uk''ulkan';
            v_next_rank_threshold := 100000;

        END IF;

        -- Si hay promoción de rango
        IF v_next_rank IS NOT NULL THEN
            -- Actualizar rango en user_stats
            UPDATE gamification_system.user_stats
            SET current_rank = v_next_rank,
                rank_updated_at = CURRENT_TIMESTAMP
            WHERE user_id = NEW.user_id;

            -- Crear notificación de promoción
            INSERT INTO gamification_system.notifications (
                user_id,
                type,
                title,
                message,
                icon,
                related_entity_type,
                related_entity_id,
                priority,
                metadata
            ) VALUES (
                NEW.user_id,
                'rank_promotion',
                '⬆️ ¡Promoción de Rango Maya!',
                format('¡Felicidades! Has ascendido al rango %s', v_next_rank),
                '⬆️',
                'rank',
                NEW.user_id,
                'high',
                jsonb_build_object(
                    'previous_rank', v_current_rank,
                    'new_rank', v_next_rank,
                    'total_xp', NEW.total_xp,
                    'threshold', v_next_rank_threshold
                )
            )
            RETURNING id INTO v_notification_id;

            -- Otorgar bonus de ML Coins por promoción
            INSERT INTO gamification_system.ml_coins_transactions (
                user_id,
                amount,
                transaction_type,
                description,
                metadata
            ) VALUES (
                NEW.user_id,
                CASE v_next_rank
                    WHEN 'Nacom' THEN 100
                    WHEN 'Ah K''in' THEN 250
                    WHEN 'Halach Uinic' THEN 500
                    WHEN 'K''uk''ulkan' THEN 1000
                    ELSE 0
                END,
                'earned_rank',
                format('Promoción a rango %s', v_next_rank),
                jsonb_build_object(
                    'previous_rank', v_current_rank,
                    'new_rank', v_next_rank,
                    'notification_id', v_notification_id
                )
            );

            -- Log de auditoría
            RAISE NOTICE 'Rank promotion: user_id=%, % → %, xp=%',
                NEW.user_id, v_current_rank, v_next_rank, NEW.total_xp;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- ========== Crear Trigger ==========
CREATE TRIGGER trg_check_rank_promotion
    AFTER UPDATE OF total_xp ON gamification_system.user_stats
    FOR EACH ROW
    WHEN (NEW.total_xp > OLD.total_xp)
    EXECUTE FUNCTION gamification_system.fn_check_rank_promotion();

COMMENT ON TRIGGER trg_check_rank_promotion ON gamification_system.user_stats IS 'Trigger que verifica y ejecuta promociones automáticas de rango Maya cuando el usuario gana XP. Documentado en ET-GAM-003.';
COMMENT ON FUNCTION gamification_system.fn_check_rank_promotion IS 'Función trigger para verificar thresholds de XP y promocionar rango Maya automáticamente.';
