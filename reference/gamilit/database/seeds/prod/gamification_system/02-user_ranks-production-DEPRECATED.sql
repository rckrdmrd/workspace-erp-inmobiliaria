-- =====================================================
-- Seed: gamification_system.user_ranks - Production Users
-- Description: User ranks para usuarios reales registrados en producción
-- Environment: PRODUCTION
-- Dependencies: auth/02-production-users.sql, auth_management/06-profiles-production.sql
-- Order: 02
-- Created: 2025-11-19
-- Version: 1.0 (Inicialización para usuarios migrados)
-- =====================================================
--
-- RANGOS DE USUARIOS REALES REGISTRADOS (13):
-- Inicialización de user_ranks para los 13 usuarios migrados
-- que NO fueron inicializados automáticamente por el trigger
--
-- PROBLEMA IDENTIFICADO:
-- El trigger initialize_user_stats() NO se disparó automáticamente
-- para los usuarios migrados, por lo que se crean manualmente aquí.
--
-- POLÍTICA DE CARGA LIMPIA:
-- ✅ Inicialización manual de user_ranks para usuarios de producción
-- ✅ Rank inicial: Ajaw (rango más bajo del sistema Maya)
-- ✅ Progress: 0% (sin progreso hacia siguiente rango)
--
-- IMPORTANTE: Este seed debe cargarse DESPUÉS de:
-- - seeds/prod/auth/02-production-users.sql
-- - seeds/prod/auth_management/06-profiles-production.sql
-- - seeds/prod/gamification_system/01-user_stats-production.sql
-- =====================================================

SET search_path TO gamification_system, auth_management, auth, public;

-- =====================================================
-- INSERT: Production User Ranks (13 usuarios)
-- =====================================================

INSERT INTO gamification_system.user_ranks (
    user_id,              -- FK a auth.users.id (NO profiles.id)
    tenant_id,
    current_rank,
    rank_progress_percentage,
    last_rank_change,
    created_at,
    updated_at
)
SELECT
    u.id as user_id,                      -- auth.users.id
    p.tenant_id,
    'Ajaw'::gamification_system.maya_rank as current_rank,
    0 as rank_progress_percentage,
    u.created_at as last_rank_change,    -- Fecha de creación del usuario
    u.created_at,
    u.created_at
FROM auth.users u
JOIN auth_management.profiles p ON p.user_id = u.id
WHERE u.email IN (
    'joseal.guirre34@gmail.com',
    'sergiojimenezesteban63@gmail.com',
    'Gomezfornite92@gmail.com',
    'Aragon494gt54@icloud.com',
    'blu3wt7@gmail.com',
    'ricardolugo786@icloud.com',
    'marbancarlos916@gmail.com',
    'diego.colores09@gmail.com',
    'hernandezfonsecabenjamin7@gmail.com',
    'jr7794315@gmail.com',
    'barraganfer03@gmail.com',
    'roman.rebollar.marcoantonio1008@gmail.com',
    'rodrigoguerrero0914@gmail.com'
)
ON CONFLICT (user_id) DO NOTHING;  -- No sobreescribir si ya existe

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    production_ranks_count INTEGER;
    ajaw_count INTEGER;
BEGIN
    -- Contar user_ranks de usuarios de producción
    SELECT COUNT(*) INTO production_ranks_count
    FROM gamification_system.user_ranks ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE u.email NOT LIKE '%@gamilit.com';

    -- Contar cuántos tienen rango Ajaw
    SELECT COUNT(*) INTO ajaw_count
    FROM gamification_system.user_ranks ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE u.email NOT LIKE '%@gamilit.com'
      AND ur.current_rank = 'Ajaw';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'USER RANKS DE PRODUCCIÓN CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'User ranks de producción: %', production_ranks_count;
    RAISE NOTICE 'Con rango Ajaw: %', ajaw_count;
    RAISE NOTICE '========================================';

    IF production_ranks_count >= 13 THEN
        RAISE NOTICE '✓ Los user ranks de producción fueron creados correctamente';
    ELSE
        RAISE WARNING '⚠ Se esperaban al menos 13 user ranks de producción, se crearon %', production_ranks_count;
    END IF;

    IF ajaw_count = production_ranks_count THEN
        RAISE NOTICE '✓ Todos los usuarios tienen el rango inicial Ajaw';
    ELSE
        RAISE WARNING '⚠ Algunos usuarios no tienen el rango Ajaw';
    END IF;

    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- CHANGELOG
-- =====================================================
-- v1.0 (2025-11-19): Primera versión
--   - Inicialización manual de user_ranks para 13 usuarios migrados
--   - Rango inicial: Ajaw
--   - Progreso: 0%
--   - Workaround para trigger que no se disparó automáticamente
-- =====================================================
