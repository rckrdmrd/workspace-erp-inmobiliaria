-- =============================================================================
-- Función: update_user_stats_on_exercise_complete
-- Descripción: Actualiza estadísticas del usuario al completar un ejercicio
-- Schema: gamilit
-- Tipo: TRIGGER FUNCTION
-- Dependencias: gamification_system.user_stats, gamilit.now_mexico()
-- Uso: Trigger AFTER INSERT ON progress_tracking.exercise_attempts
-- =============================================================================

CREATE OR REPLACE FUNCTION gamilit.update_user_stats_on_exercise_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_correct BOOLEAN;
    v_xp_earned INTEGER;
    v_coins_earned INTEGER;
BEGIN
    -- Determinar si el ejercicio fue completado correctamente
    v_is_correct := (NEW.is_correct = true OR NEW.score >= 60);

    -- Calcular XP y monedas ganadas
    IF v_is_correct THEN
        v_xp_earned := COALESCE(NEW.xp_earned, 10); -- Default 10 XP
        v_coins_earned := COALESCE(NEW.ml_coins_earned, 5); -- FIX: ml_coins_earned, no coins_earned
    ELSE
        v_xp_earned := 0;
        v_coins_earned := 0;
    END IF;

    -- Actualizar estadísticas del usuario
    UPDATE gamification_system.user_stats
    SET
        exercises_completed = exercises_completed + 1,
        total_xp = total_xp + v_xp_earned,
        ml_coins = ml_coins + v_coins_earned,                          -- FIX: ml_coins, no ml_coins_balance
        ml_coins_earned_total = ml_coins_earned_total + v_coins_earned, -- FIX: tracking total earned
        last_activity_at = gamilit.now_mexico(),
        updated_at = gamilit.now_mexico()
    WHERE user_id = NEW.user_id;

    -- Si no existe el registro de estadísticas, crearlo (UPSERT pattern)
    IF NOT FOUND THEN
        INSERT INTO gamification_system.user_stats (
            user_id,
            tenant_id,
            exercises_completed,
            total_xp,
            ml_coins,                                                   -- FIX: ml_coins, no ml_coins_balance
            ml_coins_earned_total,
            last_activity_at
        ) VALUES (
            NEW.user_id,
            '00000000-0000-0000-0000-000000000000'::UUID,
            1,
            v_xp_earned,
            100 + v_coins_earned, -- Balance inicial de 100
            v_coins_earned,
            gamilit.now_mexico()
        );
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error pero no bloquear el insert del attempt
        RAISE WARNING 'Error al actualizar estadísticas de usuario %: %', NEW.user_id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Comentario descriptivo
COMMENT ON FUNCTION gamilit.update_user_stats_on_exercise_complete() IS
    'Trigger function que actualiza las estadísticas del usuario al completar un ejercicio. '
    'Incrementa contadores de ejercicios, XP, monedas ML y mantiene last_activity_at actualizado. '
    'Usa patrón UPSERT para crear registro de stats si no existe.';

-- =============================================================================
-- NOTAS DE IMPLEMENTACIÓN
-- =============================================================================
--
-- LÓGICA DE NEGOCIO:
-- - Ejercicio correcto si: is_correct=true OR score >= 60
-- - XP ganado: viene de NEW.xp_earned (calculado por ExerciseAttemptService)
-- - Monedas ganadas: viene de NEW.ml_coins_earned (calculado por ExerciseAttemptService)
-- - Ejercicios incorrectos: incrementan contador pero no otorgan XP ni monedas
--
-- PATRÓN UPSERT:
-- 1. Intenta UPDATE en user_stats existente
-- 2. Si no existe (NOT FOUND), hace INSERT con balance inicial de 100 ML Coins
-- 3. Evita errores por falta de registro inicial
--
-- SEGURIDAD:
-- - SECURITY DEFINER permite escribir en user_stats incluso sin permisos directos
-- - Manejo de excepciones evita bloquear inserts por errores de stats
-- - Solo logs warning en caso de error, no falla la transacción
--
-- PERFORMANCE:
-- - Un solo UPDATE/INSERT por completion
-- - Usa COALESCE para defaults eficientemente
-- - Timestamp calculado una vez con now_mexico()
--
-- DEPENDENCIAS:
-- - Tabla: gamification_system.user_stats
-- - Función: gamilit.now_mexico()
-- - Columnas en NEW: user_id, is_correct, score, xp_earned, ml_coins_earned
--
-- =============================================================================
-- USO EN TRIGGERS
-- =============================================================================
--
-- CREATE TRIGGER trg_update_user_stats_on_exercise
--   AFTER INSERT ON progress_tracking.exercise_attempts
--   FOR EACH ROW
--   EXECUTE FUNCTION gamilit.update_user_stats_on_exercise_complete();
--
-- =============================================================================
-- TESTING
-- =============================================================================
--
-- Test 1: Insertar attempt correcto
-- INSERT INTO progress_tracking.exercise_attempts
--   (user_id, exercise_id, is_correct, score, xp_earned, ml_coins_earned)
-- VALUES ('user-uuid', 'exercise-uuid', true, 100, 200, 50);
-- -- Verificar: SELECT * FROM gamification_system.user_stats WHERE user_id = 'user-uuid';
--
-- Test 2: Insertar attempt incorrecto
-- INSERT INTO progress_tracking.exercise_attempts
--   (user_id, exercise_id, is_correct, score, xp_earned, ml_coins_earned)
-- VALUES ('user-uuid', 'exercise-uuid', false, 40, 0, 0);
-- -- Verificar: exercises_completed aumenta, XP y coins no
--
-- Test 3: Usuario sin stats previos
-- INSERT INTO progress_tracking.exercise_attempts
--   (user_id, exercise_id, is_correct, score, xp_earned, ml_coins_earned)
-- VALUES ('new-user-uuid', 'exercise-uuid', true, 85, 150, 40);
-- -- Verificar: Se crea registro en user_stats con balance inicial 100 + 40 = 140
--
-- =============================================================================
-- CHANGELOG
-- =============================================================================
-- 2025-11-12: CORRECCIÓN CRÍTICA (Sistema de Recompensas v2.3.0)
--             - FIX: Cambio de coins_earned a ml_coins_earned (línea 13)
--             - FIX: Cambio de ml_coins_balance a ml_coins (líneas 24, 37)
--             - FIX: Agregado ml_coins_earned_total para tracking (líneas 25, 38)
--             - FIX: Balance inicial correcto 100 + rewards (línea 45)
--             - Integración con ExerciseAttemptService completada
--             - Sistema dual-table (submissions + attempts) funcionando
--
-- 2025-11-03: Creación inicial (ISSUE-M8-002)
--             - Implementada para desbloquear 2 triggers
--             - Identificada como crítica en Microciclo M8
--             - Lógica de gamificación: XP, monedas, contadores
-- =============================================================================
