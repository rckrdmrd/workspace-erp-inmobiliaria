-- =====================================================================================
-- Trigger: trg_achievement_unlocked
-- Descripción: Trigger ejecutado cuando se desbloquea un achievement para:
--              1. Crear notificación al usuario
--              2. Otorgar recompensas automáticamente (XP + ML Coins)
-- Documentación: docs/01-fase-alcance-inicial/EAI-003-gamificacion/especificaciones/ET-GAM-001-achievements.md
-- Epic: EAI-003
-- Created: 2025-11-08
-- =====================================================================================

-- ========== Función del Trigger ==========
CREATE OR REPLACE FUNCTION gamification_system.fn_on_achievement_unlocked()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_achievement RECORD;
    v_xp_reward INTEGER;
    v_coins_reward INTEGER;
    v_notification_id UUID;
BEGIN
    -- Solo ejecutar cuando se completa un achievement
    IF NEW.is_completed = true AND (OLD IS NULL OR OLD.is_completed = false) THEN
        -- Obtener datos del achievement
        SELECT id, name, description, rewards
        INTO v_achievement
        FROM gamification_system.achievements
        WHERE id = NEW.achievement_id;

        IF FOUND THEN
            -- Extraer recompensas del JSONB
            v_xp_reward := COALESCE((v_achievement.rewards->>'xp')::INTEGER, 0);
            v_coins_reward := COALESCE((v_achievement.rewards->>'ml_coins')::INTEGER, 0);

            -- ========== 1. Otorgar XP (si hay) ==========
            IF v_xp_reward > 0 THEN
                -- Actualizar XP del usuario en user_stats
                UPDATE gamification_system.user_stats
                SET total_xp = total_xp + v_xp_reward,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = NEW.user_id;

                -- Si no existe user_stats, crearlo
                IF NOT FOUND THEN
                    INSERT INTO gamification_system.user_stats (user_id, total_xp)
                    VALUES (NEW.user_id, v_xp_reward);
                END IF;
            END IF;

            -- ========== 2. Otorgar ML Coins (si hay) ==========
            IF v_coins_reward > 0 THEN
                -- Crear transacción de ML Coins
                INSERT INTO gamification_system.ml_coins_transactions (
                    user_id,
                    amount,
                    transaction_type,
                    description,
                    metadata
                ) VALUES (
                    NEW.user_id,
                    v_coins_reward,
                    'earned_achievement',
                    format('Achievement desbloqueado: %s', v_achievement.name),
                    jsonb_build_object(
                        'achievement_id', v_achievement.id,
                        'achievement_name', v_achievement.name,
                        'user_achievement_id', NEW.id
                    )
                );
            END IF;

            -- ========== 3. Crear Notificación ==========
            INSERT INTO gamification_system.notifications (
                user_id,
                type,
                title,
                message,
                icon,
                related_entity_type,
                related_entity_id,
                action_url,
                priority,
                metadata
            ) VALUES (
                NEW.user_id,
                'achievement_unlocked',
                '🏆 ¡Achievement Desbloqueado!',
                format('Has desbloqueado: %s', v_achievement.name),
                '🏆',
                'achievement',
                v_achievement.id,
                format('/achievements/%s', v_achievement.id),
                'high',
                jsonb_build_object(
                    'achievement_id', v_achievement.id,
                    'achievement_name', v_achievement.name,
                    'xp_reward', v_xp_reward,
                    'coins_reward', v_coins_reward
                )
            )
            RETURNING id INTO v_notification_id;

            -- Marcar notificación como enviada en user_achievements
            UPDATE gamification_system.user_achievements
            SET notified = true,
                metadata = metadata || jsonb_build_object('notification_id', v_notification_id)
            WHERE id = NEW.id;

            -- Log de auditoría
            RAISE NOTICE 'Achievement unlocked: user_id=%, achievement_id=%, xp_granted=%, coins_granted=%',
                NEW.user_id, v_achievement.id, v_xp_reward, v_coins_reward;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- ========== Crear Trigger ==========
CREATE TRIGGER trg_achievement_unlocked
    AFTER INSERT OR UPDATE ON gamification_system.user_achievements
    FOR EACH ROW
    EXECUTE FUNCTION gamification_system.fn_on_achievement_unlocked();

COMMENT ON TRIGGER trg_achievement_unlocked ON gamification_system.user_achievements IS 'Trigger que otorga recompensas y crea notificación cuando se desbloquea un achievement. Documentado en ET-GAM-001.';
COMMENT ON FUNCTION gamification_system.fn_on_achievement_unlocked IS 'Función trigger para procesar desbloqueo de achievements: otorgar XP, ML Coins, y crear notificación.';
