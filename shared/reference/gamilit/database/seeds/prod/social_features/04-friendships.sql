-- =====================================================
-- Seed: social_features.friendships (PROD) - v1.1
-- Description: Relaciones de amistad entre estudiantes demo
-- Environment: PRODUCTION
-- Dependencies: auth_management.profiles
-- Order: 04
-- Created: 2025-11-15
-- Updated: 2025-11-15 (v1.1 - Corregido para schema actual)
-- Version: 1.1
-- =====================================================
--
-- CAMBIOS v1.1:
-- - Eliminada columna accepted_at (no existe en DDL actual)
-- - Ajustado para usar solo columnas disponibles
--
-- FRIENDSHIPS INCLUIDOS:
-- - 10 relaciones bidireccionales entre estudiantes
-- - 3 friend_requests pendientes
--
-- TOTAL: 10 friendships + 3 pending requests
--
-- IMPORTANTE: Este seed habilita testing completo de:
-- - /friends page (FriendsPage.tsx)
-- - FriendsLeaderboard component
-- - Friend requests feature
-- =====================================================

SET search_path TO social_features, auth_management, public;

-- =====================================================
-- INSERT: Friendships (accepted)
-- =====================================================

INSERT INTO social_features.friendships (
    user_id,
    friend_id,
    status,
    created_at,
    updated_at
) VALUES
    -- Ana García ↔ María Fernanda (mejores amigas)
    ('01ac4f00-082e-4287-b899-2e169c49b05e'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '15 days', gamilit.now_mexico() - INTERVAL '15 days'),
    ('03cd6000-282e-6487-d899-40369e49d070'::uuid, '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '15 days', gamilit.now_mexico() - INTERVAL '15 days'),

    -- Carlos Ramírez ↔ Luis Miguel
    ('02bc5f00-182e-5387-c899-3f269d49c06f'::uuid, '04de7000-382e-7587-e899-51469f49e081'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '10 days', gamilit.now_mexico() - INTERVAL '10 days'),
    ('04de7000-382e-7587-e899-51469f49e081'::uuid, '02bc5f00-182e-5387-c899-3f269d49c06f'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '10 days', gamilit.now_mexico() - INTERVAL '10 days'),

    -- Sofía Martínez ↔ María Fernanda (compañeras avanzadas)
    ('05ef8000-482e-8687-f899-62569049f092'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '8 days', gamilit.now_mexico() - INTERVAL '8 days'),
    ('03cd6000-282e-6487-d899-40369e49d070'::uuid, '05ef8000-482e-8687-f899-62569049f092'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '8 days', gamilit.now_mexico() - INTERVAL '8 days'),

    -- Ana García ↔ Diego Rodríguez
    ('01ac4f00-082e-4287-b899-2e169c49b05e'::uuid, '06f09000-582e-9787-0899-73679149010d'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '5 days', gamilit.now_mexico() - INTERVAL '5 days'),
    ('06f09000-582e-9787-0899-73679149010d'::uuid, '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '5 days', gamilit.now_mexico() - INTERVAL '5 days'),

    -- Valentina Cruz ↔ Isabella Romero
    ('07010000-682e-0887-1999-847802491e14'::uuid, '09232000-882e-2087-3119-0a90244931a3'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '12 days', gamilit.now_mexico() - INTERVAL '12 days'),
    ('09232000-882e-2087-3119-0a90244931a3'::uuid, '07010000-682e-0887-1999-847802491e14'::uuid, 'accepted', gamilit.now_mexico() - INTERVAL '12 days', gamilit.now_mexico() - INTERVAL '12 days')
ON CONFLICT (user_id, friend_id) DO NOTHING;

-- =====================================================
-- INSERT: Friend Requests (pending)
-- =====================================================

INSERT INTO social_features.friendships (
    user_id,
    friend_id,
    status,
    created_at,
    updated_at
) VALUES
    -- Mateo Flores → Sofía Martínez (pending)
    ('08121000-782e-1987-2009-9f891349212f'::uuid, '05ef8000-482e-8687-f899-62569049f092'::uuid, 'pending', gamilit.now_mexico() - INTERVAL '2 days', gamilit.now_mexico() - INTERVAL '2 days'),

    -- Sebastián Vargas → Ana García (pending)
    ('10343000-982e-3187-4229-1b01354941b4'::uuid, '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid, 'pending', gamilit.now_mexico() - INTERVAL '1 day', gamilit.now_mexico() - INTERVAL '1 day'),

    -- Camila Ortiz → María Fernanda (pending)
    ('11454000-092e-4287-5339-2c12464951c5'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, 'pending', gamilit.now_mexico() - INTERVAL '3 hours', gamilit.now_mexico() - INTERVAL '3 hours')
ON CONFLICT (user_id, friend_id) DO NOTHING;

-- =====================================================
-- Verification
-- =====================================================

DO $$
DECLARE
    accepted_count INTEGER;
    pending_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO accepted_count
    FROM social_features.friendships
    WHERE status = 'accepted';

    SELECT COUNT(*) INTO pending_count
    FROM social_features.friendships
    WHERE status = 'pending';

    total_count := accepted_count + pending_count;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'FRIENDSHIPS CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Friendships aceptados: %', accepted_count;
    RAISE NOTICE 'Friend requests pendientes: %', pending_count;
    RAISE NOTICE 'Total: %', total_count;
    RAISE NOTICE '========================================';

    IF accepted_count >= 10 AND pending_count >= 3 THEN
        RAISE NOTICE '✓ Friendships creados correctamente';
        RAISE NOTICE '';
        RAISE NOTICE 'Features habilitadas:';
        RAISE NOTICE '  - /friends page (FriendsPage.tsx)';
        RAISE NOTICE '  - FriendsLeaderboard component';
        RAISE NOTICE '  - Friend requests system';
    ELSE
        RAISE WARNING '⚠ Se esperaban al menos 10 accepted y 3 pending';
        RAISE WARNING 'Actual: % accepted, % pending', accepted_count, pending_count;
    END IF;

    RAISE NOTICE '';
END $$;
