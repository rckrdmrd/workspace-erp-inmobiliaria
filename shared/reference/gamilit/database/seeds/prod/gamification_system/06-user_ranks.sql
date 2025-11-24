-- =====================================================
-- Seed: gamification_system.user_ranks (PROD)
-- Description: Rangos maya actuales para usuarios demo
-- Environment: PRODUCTION
-- Dependencies: auth_management.profiles, gamification_system.user_stats
-- Order: 06
-- Created: 2025-01-11
-- Version: 1.0
-- =====================================================
--
-- RANGOS INCLUIDOS:
-- - Ajaw: 4 usuarios (nivel 1-2)
-- - Nacom: 2 usuarios (nivel 3-4)
-- - Ah K'in: 2 usuarios (nivel 5)
-- - Halach Uinic: 1 usuario (nivel 8)
-- - K'uk'ulkan: 1 usuario (nivel 10, max rank)
--
-- TOTAL: 10 user ranks
--
-- IMPORTANTE: Solo se crea el rango actual (is_current = true).
-- El historial de rangos anteriores se creará cuando el usuario suba de rango.
-- =====================================================

SET search_path TO gamification_system, auth_management, public;

-- =====================================================
-- INSERT: User Ranks Demo
-- =====================================================

INSERT INTO gamification_system.user_ranks (
    id,
    user_id,
    tenant_id,
    current_rank,
    previous_rank,
    rank_progress_percentage,
    modules_required_for_next,
    modules_completed_for_rank,
    xp_required_for_next,
    xp_earned_for_rank,
    ml_coins_bonus,
    certificate_url,
    badge_url,
    achieved_at,
    previous_rank_achieved_at,
    is_current,
    rank_metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- Estudiante 1: Ana García - Rango Ajaw
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,  -- Ana García
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    NULL,               -- No hay rango previo (primer rango)
    46,                 -- rank_progress_percentage (46% hacia Nacom)
    1,                  -- modules_required_for_next
    0,                  -- modules_completed_for_rank
    1000,               -- xp_required_for_next (1000 XP para Nacom)
    1250,               // xp_earned_for_rank (tiene 1250 XP)
    0,                  -- ml_coins_bonus (Ajaw es gratis)
    NULL,               -- certificate_url
    '/badges/ranks/ajaw.png',
    gamilit.now_mexico() - INTERVAL '12 days',  -- achieved_at (cuando se registró)
    NULL,
    true,               -- is_current
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 1,
        'rank_name_es', 'Ajaw'
    ),
    gamilit.now_mexico() - INTERVAL '12 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Estudiante 2: Carlos Ramírez - Rango Ajaw
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000002'::uuid,
    '02bc5f00-182e-5387-c899-3f269d49c06f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    NULL,
    13,                 -- rank_progress_percentage (13% hacia Nacom)
    1,
    0,
    1000,
    250,
    0,
    NULL,
    '/badges/ranks/ajaw.png',
    gamilit.now_mexico() - INTERVAL '5 days',
    NULL,
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 1,
        'rank_name_es', 'Ajaw'
    ),
    gamilit.now_mexico() - INTERVAL '5 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Estudiante 3: María Fernanda - Rango Nacom
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Nacom'::gamification_system.maya_rank,
    'Ajaw'::gamification_system.maya_rank,  -- Subió de Ajaw a Nacom
    60,                 -- rank_progress_percentage (60% hacia Ah K'in)
    2,                  -- modules_required_for_next
    1,                  -- modules_completed_for_rank (completó Módulo 1)
    3000,               -- xp_required_for_next (3000 XP para Ah K'in)
    3200,               -- xp_earned_for_rank
    50,                 -- ml_coins_bonus (bonus por alcanzar Nacom)
    '/certificates/ranks/nacom.pdf',
    '/badges/ranks/nacom.png',
    gamilit.now_mexico() - INTERVAL '10 days',  -- achieved_at (hace 10 días)
    gamilit.now_mexico() - INTERVAL '20 days',  // previous_rank_achieved_at (Ajaw hace 20 días)
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 2,
        'rank_name_es', 'Nacom',
        'promotion_date', (gamilit.now_mexico() - INTERVAL '10 days')::text
    ),
    gamilit.now_mexico() - INTERVAL '10 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Estudiante 4: Luis Miguel - Rango Ajaw
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000004'::uuid,
    '04de7000-382e-7587-e899-51469f49e081'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    NULL,
    52,                 -- rank_progress_percentage (52% hacia Nacom)
    1,
    0,
    1000,
    1400,
    0,
    NULL,
    '/badges/ranks/ajaw.png',
    gamilit.now_mexico() - INTERVAL '15 days',
    NULL,
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 1,
        'rank_name_es', 'Ajaw'
    ),
    gamilit.now_mexico() - INTERVAL '15 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Estudiante 5: Sofía Martínez - Rango Nacom
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000005'::uuid,
    '05ef8000-482e-8687-f899-62569049f092'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Nacom'::gamification_system.maya_rank,
    'Ajaw'::gamification_system.maya_rank,
    83,                 -- rank_progress_percentage (83% hacia Ah K'in, casi lo alcanza!)
    2,
    2,                  -- modules_completed_for_rank (completó Módulos 1 y 2)
    3000,
    6500,
    50,
    '/certificates/ranks/nacom.pdf',
    '/badges/ranks/nacom.png',
    gamilit.now_mexico() - INTERVAL '15 days',
    gamilit.now_mexico() - INTERVAL '30 days',
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 2,
        'rank_name_es', 'Nacom',
        'promotion_date', (gamilit.now_mexico() - INTERVAL '15 days')::text,
        'near_promotion', true,
        'next_rank', 'Ah K''in'
    ),
    gamilit.now_mexico() - INTERVAL '15 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Profesor 1: Juan Pérez - Rango Ah K'in
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000006'::uuid,
    '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Ah K''in'::gamification_system.maya_rank,
    'Nacom'::gamification_system.maya_rank,
    33,                 // rank_progress_percentage (33% hacia Halach Uinic)
    3,
    5,                  -- modules_completed_for_rank (todos los módulos)
    6000,               -- xp_required_for_next
    10000,
    100,                -- ml_coins_bonus
    '/certificates/ranks/ah_kin.pdf',
    '/badges/ranks/ah_kin.png',
    gamilit.now_mexico() - INTERVAL '30 days',
    gamilit.now_mexico() - INTERVAL '60 days',
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 3,
        'rank_name_es', 'Ah K''in',
        'role', 'teacher',
        'promotion_date', (gamilit.now_mexico() - INTERVAL '30 days')::text
    ),
    gamilit.now_mexico() - INTERVAL '30 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Profesor 2: Laura Martínez - Rango Ah K'in
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000007'::uuid,
    '11bc5f00-192e-5397-c919-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Ah K''in'::gamification_system.maya_rank,
    'Nacom'::gamification_system.maya_rank,
    25,                 -- rank_progress_percentage (25% hacia Halach Uinic)
    3,
    5,
    6000,
    9500,
    100,
    '/certificates/ranks/ah_kin.pdf',
    '/badges/ranks/ah_kin.png',
    gamilit.now_mexico() - INTERVAL '28 days',
    gamilit.now_mexico() - INTERVAL '55 days',
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 3,
        'rank_name_es', 'Ah K''in',
        'role', 'teacher',
        'promotion_date', (gamilit.now_mexico() - INTERVAL '28 days')::text
    ),
    gamilit.now_mexico() - INTERVAL '28 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Admin: Admin Sistema - Rango K'uk'ulkan (MAX)
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000008'::uuid,
    '20ac4f00-102e-5307-c829-3f289d49c36f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'K''uk''ulkan'::gamification_system.maya_rank,
    'Halach Uinic'::gamification_system.maya_rank,
    100,                -- rank_progress_percentage (100%, max rank)
    0,                  -- No hay siguiente rango
    5,
    0,                  -- No hay siguiente XP requerido
    50000,
    500,                -- ml_coins_bonus (bonus máximo)
    '/certificates/ranks/kukul kan.pdf',
    '/badges/ranks/kukulkan.png',
    gamilit.now_mexico() - INTERVAL '50 days',
    gamilit.now_mexico() - INTERVAL '100 days',
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 5,
        'rank_name_es', 'K''uk''ulkan',
        'role', 'super_admin',
        'max_rank', true,
        'promotion_date', (gamilit.now_mexico() - INTERVAL '50 days')::text
    ),
    gamilit.now_mexico() - INTERVAL '50 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Director: Roberto Silva - Rango Halach Uinic
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000009'::uuid,
    '21bc5f00-102e-5307-c829-3f289d49c36f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Halach Uinic'::gamification_system.maya_rank,
    'Ah K''in'::gamification_system.maya_rank,
    75,                 -- rank_progress_percentage (75% hacia K'uk'ulkan)
    4,
    5,
    10000,
    25000,
    250,
    '/certificates/ranks/halach_uinic.pdf',
    '/badges/ranks/halach_uinic.png',
    gamilit.now_mexico() - INTERVAL '40 days',
    gamilit.now_mexico() - INTERVAL '80 days',
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 4,
        'rank_name_es', 'Halach Uinic',
        'role', 'director',
        'promotion_date', (gamilit.now_mexico() - INTERVAL '40 days')::text
    ),
    gamilit.now_mexico() - INTERVAL '40 days',
    gamilit.now_mexico()
),

-- =====================================================
-- Padre: Carmen López - Rango Ajaw
-- =====================================================
(
    'b0000001-0000-0000-0000-000000000010'::uuid,
    '30ac4f00-202e-6307-d839-4f389e49d47g'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Ajaw'::gamification_system.maya_rank,
    NULL,
    5,                  -- rank_progress_percentage (5% hacia Nacom)
    1,
    0,
    1000,
    100,
    0,
    NULL,
    '/badges/ranks/ajaw.png',
    gamilit.now_mexico() - INTERVAL '3 days',
    NULL,
    true,
    jsonb_build_object(
        'demo_rank', true,
        'rank_tier', 1,
        'rank_name_es', 'Ajaw',
        'role', 'parent'
    ),
    gamilit.now_mexico() - INTERVAL '3 days',
    gamilit.now_mexico()
)

ON CONFLICT (id) DO UPDATE SET
    current_rank = EXCLUDED.current_rank,
    rank_progress_percentage = EXCLUDED.rank_progress_percentage,
    modules_completed_for_rank = EXCLUDED.modules_completed_for_rank,
    xp_earned_for_rank = EXCLUDED.xp_earned_for_rank,
    is_current = EXCLUDED.is_current,
    rank_metadata = EXCLUDED.rank_metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    ranks_count INTEGER;
    ajaw_count INTEGER;
    nacom_count INTEGER;
    ahkin_count INTEGER;
    halach_count INTEGER;
    kukulkan_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO ranks_count
    FROM gamification_system.user_ranks
    WHERE rank_metadata->>'demo_rank' = 'true'
      AND is_current = true;

    SELECT COUNT(*) INTO ajaw_count
    FROM gamification_system.user_ranks
    WHERE current_rank = 'Ajaw' AND is_current = true;

    SELECT COUNT(*) INTO nacom_count
    FROM gamification_system.user_ranks
    WHERE current_rank = 'Nacom' AND is_current = true;

    SELECT COUNT(*) INTO ahkin_count
    FROM gamification_system.user_ranks
    WHERE current_rank = 'Ah K''in' AND is_current = true;

    SELECT COUNT(*) INTO halach_count
    FROM gamification_system.user_ranks
    WHERE current_rank = 'Halach Uinic' AND is_current = true;

    SELECT COUNT(*) INTO kukulkan_count
    FROM gamification_system.user_ranks
    WHERE current_rank = 'K''uk''ulkan' AND is_current = true;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'USER RANKS DEMO CREADOS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total user ranks: %', ranks_count;
    RAISE NOTICE '  - Ajaw: %', ajaw_count;
    RAISE NOTICE '  - Nacom: %', nacom_count;
    RAISE NOTICE '  - Ah K''in: %', ahkin_count;
    RAISE NOTICE '  - Halach Uinic: %', halach_count;
    RAISE NOTICE '  - K''uk''ulkan: %', kukulkan_count;
    RAISE NOTICE '========================================';

    IF ranks_count = 10 THEN
        RAISE NOTICE ' Todos los user ranks demo fueron creados correctamente';
    ELSE
        RAISE WARNING '  Se esperaban 10 user ranks, se crearon %', ranks_count;
    END IF;
END $$;

-- =====================================================
-- Listado de ranks
-- =====================================================

DO $$
DECLARE
    rank_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Listado de user ranks demo:';
    RAISE NOTICE '========================================';

    FOR rank_record IN
        SELECT
            p.display_name,
            p.role,
            ur.current_rank,
            ur.previous_rank,
            ur.rank_progress_percentage,
            ur.xp_earned_for_rank,
            ur.modules_completed_for_rank
        FROM gamification_system.user_ranks ur
        JOIN auth_management.profiles p ON p.id = ur.user_id
        WHERE ur.rank_metadata->>'demo_rank' = 'true'
          AND ur.is_current = true
        ORDER BY
            CASE ur.current_rank
                WHEN 'K''uk''ulkan' THEN 5
                WHEN 'Halach Uinic' THEN 4
                WHEN 'Ah K''in' THEN 3
                WHEN 'Nacom' THEN 2
                WHEN 'Ajaw' THEN 1
            END DESC,
            ur.rank_progress_percentage DESC
    LOOP
        RAISE NOTICE '  - % [%]', rank_record.display_name, rank_record.role;
        RAISE NOTICE '    Rango Actual: % | Anterior: %',
            rank_record.current_rank,
            COALESCE(rank_record.previous_rank::text, 'N/A');
        RAISE NOTICE '    Progreso: %%% | XP: % | Módulos: %',
            rank_record.rank_progress_percentage,
            rank_record.xp_earned_for_rank,
            rank_record.modules_completed_for_rank;
        RAISE NOTICE '';
    END LOOP;

    RAISE NOTICE '========================================';
END $$;
