/**
 * P0-001: Migración de MayaRank Legacy a Valores Correctos
 *
 * @description Migra los valores legacy incorrectos de current_rank a los valores correctos
 * basados en la jerarquía maya oficial.
 *
 * @issue DISCREPANCIA P0-3 identificada en validación 2025-11-07
 * @see /docs/02-especificaciones-tecnicas/apis/gamificacion-api/01-RANGOS-MAYA.md
 * @see /backend/src/shared/constants/enums.constants.ts (MayaRank enum)
 *
 * VALORES LEGACY (INCORRECTOS):
 * - NACOM, BATAB, HOLCATTE, GUERRERO, MERCENARIO
 *
 * VALORES CORRECTOS:
 * - Ajaw (Nivel 1: 0-999 XP)
 * - Nacom (Nivel 2: 1,000-2,999 XP)
 * - Ah K'in (Nivel 3: 3,000-5,999 XP)
 * - Halach Uinic (Nivel 4: 6,000-9,999 XP)
 * - K'uk'ulkan (Nivel 5: 10,000+ XP)
 *
 * LÓGICA DE MIGRACIÓN:
 * - Basada en total_xp actual del usuario
 * - Preserva progreso existente
 * - Actualiza rank_progress correctamente
 */

-- ============================================
-- PASO 1: Validar estado actual
-- ============================================

DO $$
DECLARE
    legacy_count INTEGER;
    correct_count INTEGER;
BEGIN
    -- Contar registros con valores legacy
    SELECT COUNT(*) INTO legacy_count
    FROM gamification_system.user_stats
    WHERE current_rank IN ('NACOM', 'BATAB', 'HOLCATTE', 'GUERRERO', 'MERCENARIO');

    -- Contar registros con valores correctos
    SELECT COUNT(*) INTO correct_count
    FROM gamification_system.user_stats
    WHERE current_rank IN ('Ajaw', 'Nacom', 'Ah K''in', 'Halach Uinic', 'K''uk''ulkan');

    RAISE NOTICE '========================================';
    RAISE NOTICE 'ESTADO PREVIO A MIGRACIÓN';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Registros con valores legacy: %', legacy_count;
    RAISE NOTICE 'Registros con valores correctos: %', correct_count;
    RAISE NOTICE '========================================';
END $$;


-- ============================================
-- PASO 2: Función helper para calcular rango
-- ============================================

CREATE OR REPLACE FUNCTION gamification_system.calculate_maya_rank_from_xp(xp INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF xp < 1000 THEN
        RETURN 'Ajaw';
    ELSIF xp < 3000 THEN
        RETURN 'Nacom';
    ELSIF xp < 6000 THEN
        RETURN 'Ah K''in';
    ELSIF xp < 10000 THEN
        RETURN 'Halach Uinic';
    ELSE
        RETURN 'K''uk''ulkan';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ============================================
-- PASO 3: Función helper para calcular progreso
-- ============================================

CREATE OR REPLACE FUNCTION gamification_system.calculate_rank_progress(xp INTEGER, rank TEXT)
RETURNS NUMERIC(5,2) AS $$
DECLARE
    xp_in_rank INTEGER;
    rank_size INTEGER;
BEGIN
    -- Calcular XP dentro del rango actual
    CASE rank
        WHEN 'Ajaw' THEN
            xp_in_rank := xp;
            rank_size := 1000;
        WHEN 'Nacom' THEN
            xp_in_rank := xp - 1000;
            rank_size := 2000;
        WHEN 'Ah K''in' THEN
            xp_in_rank := xp - 3000;
            rank_size := 3000;
        WHEN 'Halach Uinic' THEN
            xp_in_rank := xp - 6000;
            rank_size := 4000;
        WHEN 'K''uk''ulkan' THEN
            xp_in_rank := xp - 10000;
            rank_size := 1; -- Evita división por cero
            RETURN 100.00; -- Nivel máximo siempre 100%
        ELSE
            RETURN 0.00;
    END CASE;

    -- Calcular porcentaje (0-100)
    IF rank_size > 0 THEN
        RETURN LEAST(100.00, (xp_in_rank::NUMERIC / rank_size::NUMERIC) * 100);
    ELSE
        RETURN 0.00;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ============================================
-- PASO 4: Actualizar registros legacy
-- ============================================

DO $$
DECLARE
    updated_count INTEGER := 0;
    user_record RECORD;
    new_rank TEXT;
    new_progress NUMERIC(5,2);
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'INICIANDO MIGRACIÓN';
    RAISE NOTICE '========================================';

    -- Iterar sobre todos los usuarios con valores legacy
    FOR user_record IN
        SELECT user_id, total_xp, current_rank as old_rank
        FROM gamification_system.user_stats
        WHERE current_rank IN ('NACOM', 'BATAB', 'HOLCATTE', 'GUERRERO', 'MERCENARIO')
    LOOP
        -- Calcular nuevo rango basado en XP
        new_rank := gamification_system.calculate_maya_rank_from_xp(user_record.total_xp);

        -- Calcular nuevo progreso
        new_progress := gamification_system.calculate_rank_progress(user_record.total_xp, new_rank);

        -- Actualizar registro
        UPDATE gamification_system.user_stats
        SET
            current_rank = new_rank,
            rank_progress = new_progress,
            updated_at = NOW()
        WHERE user_id = user_record.user_id;

        updated_count := updated_count + 1;

        -- Log cada 100 registros
        IF updated_count % 100 = 0 THEN
            RAISE NOTICE 'Migrados % usuarios...', updated_count;
        END IF;
    END LOOP;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRACIÓN COMPLETADA';
    RAISE NOTICE 'Total de registros migrados: %', updated_count;
    RAISE NOTICE '========================================';
END $$;


-- ============================================
-- PASO 5: Validar migración
-- ============================================

DO $$
DECLARE
    legacy_remaining INTEGER;
    correct_total INTEGER;
    rank_distribution TEXT;
BEGIN
    -- Contar registros legacy restantes
    SELECT COUNT(*) INTO legacy_remaining
    FROM gamification_system.user_stats
    WHERE current_rank IN ('NACOM', 'BATAB', 'HOLCATTE', 'GUERRERO', 'MERCENARIO');

    -- Contar total con valores correctos
    SELECT COUNT(*) INTO correct_total
    FROM gamification_system.user_stats
    WHERE current_rank IN ('Ajaw', 'Nacom', 'Ah K''in', 'Halach Uinic', 'K''uk''ulkan');

    -- Distribución por rango
    SELECT string_agg(rank_info, E'\n  ') INTO rank_distribution
    FROM (
        SELECT
            current_rank || ': ' || COUNT(*) || ' usuarios' as rank_info
        FROM gamification_system.user_stats
        WHERE current_rank IN ('Ajaw', 'Nacom', 'Ah K''in', 'Halach Uinic', 'K''uk''ulkan')
        GROUP BY current_rank
        ORDER BY
            CASE current_rank
                WHEN 'Ajaw' THEN 1
                WHEN 'Nacom' THEN 2
                WHEN 'Ah K''in' THEN 3
                WHEN 'Halach Uinic' THEN 4
                WHEN 'K''uk''ulkan' THEN 5
            END
    ) sub;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'VALIDACIÓN POST-MIGRACIÓN';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Registros legacy restantes: %', legacy_remaining;
    RAISE NOTICE 'Registros con valores correctos: %', correct_total;
    RAISE NOTICE '';
    RAISE NOTICE 'DISTRIBUCIÓN POR RANGO:';
    RAISE NOTICE '  %', rank_distribution;
    RAISE NOTICE '========================================';

    -- Verificar que no quedan legacy
    IF legacy_remaining > 0 THEN
        RAISE WARNING 'ATENCIÓN: Aún quedan % registros con valores legacy!', legacy_remaining;
    ELSE
        RAISE NOTICE '✓ MIGRACIÓN EXITOSA: Todos los registros fueron actualizados';
    END IF;
END $$;


-- ============================================
-- PASO 6: Cleanup funciones temporales
-- ============================================

-- Mantener estas funciones para uso futuro
-- DROP FUNCTION IF EXISTS gamification_system.calculate_maya_rank_from_xp(INTEGER);
-- DROP FUNCTION IF EXISTS gamification_system.calculate_rank_progress(INTEGER, TEXT);

COMMENT ON FUNCTION gamification_system.calculate_maya_rank_from_xp(INTEGER) IS
'Calcula el rango maya correcto basado en total_xp. Usado en migración P0-001.';

COMMENT ON FUNCTION gamification_system.calculate_rank_progress(INTEGER, TEXT) IS
'Calcula el progreso (0-100%) dentro de un rango maya. Usado en migración P0-001.';


-- ============================================
-- NOTAS FINALES
-- ============================================

/**
 * VERIFICACIONES POST-MIGRACIÓN:
 *
 * 1. Verificar distribución de rangos:
 *    SELECT current_rank, COUNT(*)
 *    FROM gamification_system.user_stats
 *    GROUP BY current_rank
 *    ORDER BY current_rank;
 *
 * 2. Verificar que rank_progress está en rango correcto:
 *    SELECT user_id, current_rank, rank_progress, total_xp
 *    FROM gamification_system.user_stats
 *    WHERE rank_progress < 0 OR rank_progress > 100
 *    ORDER BY total_xp;
 *
 * 3. Verificar usuarios con más XP tienen rangos más altos:
 *    SELECT user_id, current_rank, total_xp
 *    FROM gamification_system.user_stats
 *    ORDER BY total_xp DESC
 *    LIMIT 20;
 *
 * 4. Actualizar el ENUM en DDL (si existe):
 *    DROP TYPE IF EXISTS maya_rank CASCADE;
 *    CREATE TYPE maya_rank AS ENUM ('Ajaw', 'Nacom', 'Ah K''in', 'Halach Uinic', 'K''uk''ulkan');
 *
 * ROLLBACK (si es necesario):
 * - No hay rollback automático ya que la migración es basada en XP
 * - Para revertir, ejecutar una nueva migración con lógica inversa
 * - Backup de user_stats debe haber sido creado antes de ejecutar
 */
