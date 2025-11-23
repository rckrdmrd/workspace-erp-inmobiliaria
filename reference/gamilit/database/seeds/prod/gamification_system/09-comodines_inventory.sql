-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Seed: Comodines Inventory (Production Demo Data)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Description: Inventarios de comodines (power-ups) para usuarios demo
-- Environment: production
-- Dependencies:
--   - auth.users (01-demo-users.sql)
--   - auth_management.profiles (03-profiles.sql)
--   - gamification_system.user_stats (05-user_stats.sql)
-- Execution Order: 9
-- Created: 2025-01-11
-- Version: 1.0.0
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
--
-- Tipos de Comodines:
-- 1. Pistas Contextuales (15 ML Coins): Ayudas para resolver ejercicios
-- 2. Visi�n Lectora (25 ML Coins): Resalta informaci�n clave en textos
-- 3. Segunda Oportunidad (40 ML Coins): Permite reintentar ejercicios
--
-- F�rmula: available = purchased_total - used_total
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

SET search_path TO gamification_system, public;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 1: Ana Garc�a (usuario activo - uso moderado de comodines)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000001-0000-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    2, 1, 0,  -- available (2 pistas, 1 visi�n, 0 segunda)
    7, 4, 2,  -- purchased_total
    5, 3, 2,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '2 days',
        'favorite_comodin', 'pistas'
    ),
    gamilit.now_mexico() - INTERVAL '12 days',
    gamilit.now_mexico() - INTERVAL '2 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 2: Carlos Ram�rez (principiante - poco uso de comodines)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000002-0000-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    1, 0, 0,  -- available (1 pista)
    3, 1, 0,  -- purchased_total
    2, 1, 0,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '3 days',
        'needs_support', true
    ),
    gamilit.now_mexico() - INTERVAL '8 days',
    gamilit.now_mexico() - INTERVAL '3 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 3: Mar�a Fernanda (avanzada - uso estrat�gico de comodines)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000003-0000-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    3, 2, 1,  -- available (3 pistas, 2 visi�n, 1 segunda)
    8, 5, 2,  -- purchased_total
    5, 3, 1,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '2 days',
        'favorite_comodin', 'vision_lectora',
        'strategic_user', true
    ),
    gamilit.now_mexico() - INTERVAL '15 days',
    gamilit.now_mexico() - INTERVAL '2 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 4: Luis Miguel (intermedio - uso regular de comodines)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000004-0000-0000-0000-000000000004'::uuid,
    '24f9baf3-a88f-47c1-80d3-5729f6e1cc93'::uuid,
    2, 1, 1,  -- available (2 pistas, 1 visi�n, 1 segunda)
    6, 4, 3,  -- purchased_total
    4, 3, 2,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '1 day',
        'favorite_comodin', 'segunda_oportunidad'
    ),
    gamilit.now_mexico() - INTERVAL '14 days',
    gamilit.now_mexico() - INTERVAL '1 day'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 5: Sof�a Mart�nez (experta - uso eficiente de comodines)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000005-0000-0000-0000-000000000005'::uuid,
    'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid,
    4, 3, 2,  -- available (4 pistas, 3 visi�n, 2 segunda)
    10, 8, 4,  -- purchased_total
    6, 5, 2,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '3 days',
        'favorite_comodin', 'vision_lectora',
        'efficient_user', true,
        'usage_pattern', 'strategic'
    ),
    gamilit.now_mexico() - INTERVAL '20 days',
    gamilit.now_mexico() - INTERVAL '3 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PROFESOR 1: Juan P�rez (profesor - uso m�nimo para demostraci�n)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000006-0000-0000-0000-000000000006'::uuid,
    '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid,
    5, 5, 5,  -- available (abundancia para demostraci�n)
    7, 6, 6,  -- purchased_total
    2, 1, 1,  -- used_total (uso m�nimo)
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '5 days',
        'role', 'teacher',
        'demo_testing', true
    ),
    gamilit.now_mexico() - INTERVAL '30 days',
    gamilit.now_mexico() - INTERVAL '5 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PROFESOR 2: Laura Mart�nez (profesora - uso m�nimo para demostraci�n)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000007-0000-0000-0000-000000000007'::uuid,
    '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid,
    5, 5, 5,  -- available (abundancia para demostraci�n)
    6, 6, 5,  -- purchased_total
    1, 1, 0,  -- used_total (uso m�nimo)
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '4 days',
        'role', 'teacher',
        'demo_testing', true
    ),
    gamilit.now_mexico() - INTERVAL '28 days',
    gamilit.now_mexico() - INTERVAL '4 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ADMIN: Sistema Admin (administrador - acceso completo)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000008-0000-0000-0000-000000000008'::uuid,
    'e0359587-c4e6-4ffe-8359-ebd91a9a5621'::uuid,
    10, 10, 10,  -- available (abundancia administrativa)
    15, 12, 12,  -- purchased_total
    5, 2, 2,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '10 days',
        'role', 'admin',
        'unlimited_access', true
    ),
    gamilit.now_mexico() - INTERVAL '60 days',
    gamilit.now_mexico() - INTERVAL '10 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- DIRECTOR: Roberto Director (director - acceso amplio)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000009-0000-0000-0000-000000000009'::uuid,
    '7cae4d62-d2ee-478b-968f-55fb002aca23'::uuid,
    8, 8, 8,  -- available (acceso amplio)
    10, 10, 10,  -- purchased_total
    2, 2, 2,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'last_purchase', gamilit.now_mexico() - INTERVAL '8 days',
        'role', 'director',
        'management_access', true
    ),
    gamilit.now_mexico() - INTERVAL '45 days',
    gamilit.now_mexico() - INTERVAL '8 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PADRE: Carmen Madre (padre - acceso m�nimo - solo observador)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.comodines_inventory (
    id, user_id,
    pistas_available, vision_lectora_available, segunda_oportunidad_available,
    pistas_purchased_total, vision_lectora_purchased_total, segunda_oportunidad_purchased_total,
    pistas_used_total, vision_lectora_used_total, segunda_oportunidad_used_total,
    pistas_cost, vision_lectora_cost, segunda_oportunidad_cost,
    metadata, created_at, updated_at
) VALUES (
    'f0000010-0000-0000-0000-000000000010'::uuid,
    'e87d67f3-f886-4ec0-a942-59ddc802cc53'::uuid,
    0, 0, 0,  -- available (sin comodines - solo observador)
    0, 0, 0,  -- purchased_total
    0, 0, 0,  -- used_total
    15, 25, 40,  -- costs
    jsonb_build_object(
        'demo_inventory', true,
        'role', 'parent',
        'observer_only', true
    ),
    gamilit.now_mexico() - INTERVAL '5 days',
    gamilit.now_mexico() - INTERVAL '5 days'
) ON CONFLICT (user_id) DO UPDATE SET
    pistas_available = EXCLUDED.pistas_available,
    vision_lectora_available = EXCLUDED.vision_lectora_available,
    segunda_oportunidad_available = EXCLUDED.segunda_oportunidad_available,
    updated_at = EXCLUDED.updated_at;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- VERIFICACI�N DE COMODINES INVENTORY
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_inventory_count INTEGER;
    v_total_pistas_available INTEGER;
    v_total_vision_available INTEGER;
    v_total_segunda_available INTEGER;
BEGIN
    -- Contar inventarios insertados
    SELECT COUNT(*) INTO v_inventory_count
    FROM gamification_system.comodines_inventory
    WHERE metadata->>'demo_inventory' = 'true';

    -- Calcular totales disponibles
    SELECT
        COALESCE(SUM(pistas_available), 0),
        COALESCE(SUM(vision_lectora_available), 0),
        COALESCE(SUM(segunda_oportunidad_available), 0)
    INTO v_total_pistas_available, v_total_vision_available, v_total_segunda_available
    FROM gamification_system.comodines_inventory
    WHERE metadata->>'demo_inventory' = 'true';

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
    RAISE NOTICE 'Comodines Inventory - Verificaci�n de Seeds';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
    RAISE NOTICE 'Total de inventarios insertados: %', v_inventory_count;
    RAISE NOTICE 'Total Pistas Contextuales disponibles: %', v_total_pistas_available;
    RAISE NOTICE 'Total Visi�n Lectora disponibles: %', v_total_vision_available;
    RAISE NOTICE 'Total Segunda Oportunidad disponibles: %', v_total_segunda_available;
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    -- Verificar que tenemos inventarios
    IF v_inventory_count = 0 THEN
        RAISE WARNING 'No se insertaron inventarios demo';
    ELSIF v_inventory_count < 10 THEN
        RAISE WARNING 'Se esperaban 10 inventarios, se insertaron %', v_inventory_count;
    ELSE
        RAISE NOTICE ' Seeds de comodines inventory insertados correctamente';
    END IF;
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- LISTADO DE INVENTARIOS INSERTADOS (para debugging)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_user_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen de inventarios por usuario:';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    FOR v_user_record IN (
        SELECT
            u.email,
            p.display_name,
            ci.pistas_available,
            ci.vision_lectora_available,
            ci.segunda_oportunidad_available,
            ci.pistas_purchased_total,
            ci.vision_lectora_purchased_total,
            ci.segunda_oportunidad_purchased_total,
            ci.pistas_used_total,
            ci.vision_lectora_used_total,
            ci.segunda_oportunidad_used_total
        FROM auth.users u
        JOIN auth_management.profiles p ON p.user_id = u.id
        JOIN gamification_system.comodines_inventory ci ON ci.user_id = p.id
        WHERE ci.metadata->>'demo_inventory' = 'true'
        ORDER BY u.email
    ) LOOP
        RAISE NOTICE '';
        RAISE NOTICE '% (%)', v_user_record.display_name, v_user_record.email;
        RAISE NOTICE '  Pistas: % disponibles (% compradas, % usadas)',
            v_user_record.pistas_available,
            v_user_record.pistas_purchased_total,
            v_user_record.pistas_used_total;
        RAISE NOTICE '  Visi�n Lectora: % disponibles (% compradas, % usadas)',
            v_user_record.vision_lectora_available,
            v_user_record.vision_lectora_purchased_total,
            v_user_record.vision_lectora_used_total;
        RAISE NOTICE '  Segunda Oportunidad: % disponibles (% compradas, % usadas)',
            v_user_record.segunda_oportunidad_available,
            v_user_record.segunda_oportunidad_purchased_total,
            v_user_record.segunda_oportunidad_used_total;
    END LOOP;

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- VERIFICACI�N DE CONSISTENCIA: available = purchased - used
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_inconsistency_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Verificaci�n de consistencia (available = purchased - used):';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    SELECT COUNT(*) INTO v_inconsistency_count
    FROM gamification_system.comodines_inventory
    WHERE metadata->>'demo_inventory' = 'true'
    AND (
        pistas_available != (pistas_purchased_total - pistas_used_total) OR
        vision_lectora_available != (vision_lectora_purchased_total - vision_lectora_used_total) OR
        segunda_oportunidad_available != (segunda_oportunidad_purchased_total - segunda_oportunidad_used_total)
    );

    IF v_inconsistency_count > 0 THEN
        RAISE WARNING 'Se encontraron % inventarios con inconsistencias en el balance', v_inconsistency_count;
    ELSE
        RAISE NOTICE ' Todos los inventarios tienen balances consistentes';
    END IF;

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- FIN DEL SEED
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
