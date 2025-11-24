-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Seed: User Achievements (Production Demo Data)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Description: Asociaciones de achievements desbloqueados por usuarios demo
-- Environment: production
-- Dependencies:
--   - auth.users (01-demo-users.sql)
--   - auth_management.profiles (03-profiles.sql)
--   - gamification_system.achievements (04-achievements.sql)
--   - gamification_system.user_stats (05-user_stats.sql)
-- Execution Order: 8
-- Created: 2025-01-11
-- Version: 1.0.0
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

SET search_path TO gamification_system, public;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 1: Ana Garc�a (3 achievements)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

-- Primera Visita (completado)
INSERT INTO gamification_system.user_achievements (
    id, user_id, achievement_id, progress, max_progress,
    is_completed, completion_percentage, completed_at,
    notified, viewed, rewards_claimed, rewards_received,
    progress_data, milestones_reached, metadata,
    started_at, created_at
) VALUES (
    'e0000001-0001-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    '90000001-0020-0000-0000-000000000001'::uuid,
    1, 1, true, 100.00,
    gamilit.now_mexico() - INTERVAL '12 days',
    true, true, true,
    jsonb_build_object(
        'xp', 50,
        'ml_coins', 25,
        'badge_url', '/badges/achievements/primera-visita.png'
    ),
    jsonb_build_object('first_login', true),
    ARRAY['first_login'],
    jsonb_build_object('demo_achievement', true, 'category', 'special'),
    gamilit.now_mexico() - INTERVAL '12 days',
    gamilit.now_mexico() - INTERVAL '12 days'
) ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- Primeros Pasos (completado)
INSERT INTO gamification_system.user_achievements (
    id, user_id, achievement_id, progress, max_progress,
    is_completed, completion_percentage, completed_at,
    notified, viewed, rewards_claimed, rewards_received,
    progress_data, milestones_reached, metadata,
    started_at, created_at
) VALUES (
    'e0000001-0002-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    '90000001-0001-0000-0000-000000000001'::uuid,
    1, 1, true, 100.00,
    gamilit.now_mexico() - INTERVAL '10 days',
    true, true, true,
    jsonb_build_object(
        'xp', 100,
        'ml_coins', 50,
        'badge_url', '/badges/achievements/primeros-pasos.png'
    ),
    jsonb_build_object('exercises_completed', 1),
    ARRAY['first_exercise'],
    jsonb_build_object('demo_achievement', true, 'category', 'progress'),
    gamilit.now_mexico() - INTERVAL '11 days',
    gamilit.now_mexico() - INTERVAL '10 days'
) ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- Racha de 3 D�as (completado)
INSERT INTO gamification_system.user_achievements (
    id, user_id, achievement_id, progress, max_progress,
    is_completed, completion_percentage, completed_at,
    notified, viewed, rewards_claimed, rewards_received,
    progress_data, milestones_reached, metadata,
    started_at, created_at
) VALUES (
    'e0000001-0003-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    '90000001-0006-0000-0000-000000000001'::uuid,
    3, 3, true, 100.00,
    gamilit.now_mexico() - INTERVAL '5 days',
    true, true, true,
    jsonb_build_object(
        'xp', 150,
        'ml_coins', 50,
        'badge_url', '/badges/achievements/racha-3-dias.png'
    ),
    jsonb_build_object('streak_days', 3),
    ARRAY['day_1', 'day_2', 'day_3'],
    jsonb_build_object('demo_achievement', true, 'category', 'streak'),
    gamilit.now_mexico() - INTERVAL '7 days',
    gamilit.now_mexico() - INTERVAL '5 days'
) ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- Lector Principiante (en progreso 60%)
INSERT INTO gamification_system.user_achievements (
    id, user_id, achievement_id, progress, max_progress,
    is_completed, completion_percentage, completed_at,
    notified, viewed, rewards_claimed, rewards_received,
    progress_data, milestones_reached, metadata,
    started_at, created_at
) VALUES (
    'e0000001-0004-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    '90000001-0002-0000-0000-000000000001'::uuid,
    15, 25, false, 60.00, NULL,
    false, false, false, '{}'::jsonb,
    jsonb_build_object('exercises_completed', 15, 'target', 25),
    ARRAY['milestone_10'],
    jsonb_build_object('demo_achievement', true, 'category', 'progress', 'status', 'in_progress'),
    gamilit.now_mexico() - INTERVAL '10 days',
    gamilit.now_mexico() - INTERVAL '10 days'
) ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 2: Carlos Ram�rez (1 achievement)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

-- Primera Visita (completado)
INSERT INTO gamification_system.user_achievements (
    id, user_id, achievement_id, progress, max_progress,
    is_completed, completion_percentage, completed_at,
    notified, viewed, rewards_claimed, rewards_received,
    progress_data, milestones_reached, metadata,
    started_at, created_at
) VALUES (
    'e0000002-0001-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    '90000001-0020-0000-0000-000000000001'::uuid,
    1, 1, true, 100.00,
    gamilit.now_mexico() - INTERVAL '8 days',
    true, true, true,
    jsonb_build_object(
        'xp', 50,
        'ml_coins', 25,
        'badge_url', '/badges/achievements/primera-visita.png'
    ),
    jsonb_build_object('first_login', true),
    ARRAY['first_login'],
    jsonb_build_object('demo_achievement', true, 'category', 'special'),
    gamilit.now_mexico() - INTERVAL '8 days',
    gamilit.now_mexico() - INTERVAL '8 days'
) ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- Primeros Pasos (en progreso 20%)
INSERT INTO gamification_system.user_achievements (
    id, user_id, achievement_id, progress, max_progress,
    is_completed, completion_percentage, completed_at,
    notified, viewed, rewards_claimed, rewards_received,
    progress_data, milestones_reached, metadata,
    started_at, created_at
) VALUES (
    'e0000002-0002-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    '90000001-0001-0000-0000-000000000001'::uuid,
    5, 25, false, 20.00, NULL,
    false, false, false, '{}'::jsonb,
    jsonb_build_object('exercises_completed', 5, 'target', 25),
    ARRAY[],
    jsonb_build_object('demo_achievement', true, 'category', 'progress', 'status', 'in_progress'),
    gamilit.now_mexico() - INTERVAL '8 days',
    gamilit.now_mexico() - INTERVAL '8 days'
) ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 3: Mar�a Fernanda (5+ achievements - m�dulo 1 completado)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000003-0001-0000-0000-000000000003'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '15 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '15 days', gamilit.now_mexico() - INTERVAL '15 days'),
-- Primeros Pasos
('e0000003-0002-0000-0000-000000000003'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, '90000001-0001-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '14 days', true, true, true, jsonb_build_object('xp', 100, 'ml_coins', 50), jsonb_build_object('exercises_completed', 1), ARRAY['first_exercise'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '14 days', gamilit.now_mexico() - INTERVAL '14 days'),
-- Lector Principiante
('e0000003-0003-0000-0000-000000000003'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, '90000001-0002-0000-0000-000000000001'::uuid, 25, 25, true, 100.00, gamilit.now_mexico() - INTERVAL '12 days', true, true, true, jsonb_build_object('xp', 200, 'ml_coins', 75), jsonb_build_object('exercises_completed', 25), ARRAY['milestone_10', 'milestone_20', 'milestone_25'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '13 days', gamilit.now_mexico() - INTERVAL '12 days'),
-- Racha de 7 D�as
('e0000003-0004-0000-0000-000000000003'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, '90000001-0007-0000-0000-000000000001'::uuid, 7, 7, true, 100.00, gamilit.now_mexico() - INTERVAL '7 days', true, true, true, jsonb_build_object('xp', 300, 'ml_coins', 100), jsonb_build_object('streak_days', 7), ARRAY['day_3', 'day_5', 'day_7'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '10 days', gamilit.now_mexico() - INTERVAL '7 days'),
-- M�dulo 1 Completado
('e0000003-0005-0000-0000-000000000003'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, '90000001-0009-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '10 days', true, true, true, jsonb_build_object('xp', 500, 'ml_coins', 150, 'certificate_url', '/certificates/modules/modulo-1.pdf'), jsonb_build_object('module_completed', 'modulo-01', 'score', 88), ARRAY['module_1_completed'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '12 days', gamilit.now_mexico() - INTERVAL '10 days'),
-- Lector Experimentado (en progreso 40% por M�dulo 2)
('e0000003-0006-0000-0000-000000000003'::uuid, '03cd6000-282e-6487-d899-40369e49d070'::uuid, '90000001-0003-0000-0000-000000000001'::uuid, 35, 100, false, 35.00, NULL, false, false, false, '{}'::jsonb, jsonb_build_object('exercises_completed', 35, 'target', 100), ARRAY['milestone_25'], jsonb_build_object('demo_achievement', true, 'status', 'in_progress'), gamilit.now_mexico() - INTERVAL '12 days', gamilit.now_mexico() - INTERVAL '10 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 4: Luis Miguel (2 achievements)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000004-0001-0000-0000-000000000004'::uuid, '24f9baf3-a88f-47c1-80d3-5729f6e1cc93'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '14 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '14 days', gamilit.now_mexico() - INTERVAL '14 days'),
-- Primeros Pasos
('e0000004-0002-0000-0000-000000000004'::uuid, '24f9baf3-a88f-47c1-80d3-5729f6e1cc93'::uuid, '90000001-0001-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '13 days', true, true, true, jsonb_build_object('xp', 100, 'ml_coins', 50), jsonb_build_object('exercises_completed', 1), ARRAY['first_exercise'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '13 days', gamilit.now_mexico() - INTERVAL '13 days'),
-- Lector Principiante (en progreso 80%)
('e0000004-0003-0000-0000-000000000004'::uuid, '24f9baf3-a88f-47c1-80d3-5729f6e1cc93'::uuid, '90000001-0002-0000-0000-000000000001'::uuid, 20, 25, false, 80.00, NULL, false, false, false, '{}'::jsonb, jsonb_build_object('exercises_completed', 20, 'target', 25), ARRAY['milestone_10', 'milestone_20'], jsonb_build_object('demo_achievement', true, 'status', 'in_progress'), gamilit.now_mexico() - INTERVAL '12 days', gamilit.now_mexico() - INTERVAL '12 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 5: Sof�a Mart�nez (8+ achievements - 2 m�dulos completados, mastery)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000005-0001-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '20 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '20 days', gamilit.now_mexico() - INTERVAL '20 days'),
-- Primeros Pasos
('e0000005-0002-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0001-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '19 days', true, true, true, jsonb_build_object('xp', 100, 'ml_coins', 50), jsonb_build_object('exercises_completed', 1), ARRAY['first_exercise'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '19 days', gamilit.now_mexico() - INTERVAL '19 days'),
-- Lector Principiante
('e0000005-0003-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0002-0000-0000-000000000001'::uuid, 25, 25, true, 100.00, gamilit.now_mexico() - INTERVAL '18 days', true, true, true, jsonb_build_object('xp', 200, 'ml_coins', 75), jsonb_build_object('exercises_completed', 25), ARRAY['milestone_10', 'milestone_20', 'milestone_25'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '19 days', gamilit.now_mexico() - INTERVAL '18 days'),
-- Lector Experimentado
('e0000005-0004-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0003-0000-0000-000000000001'::uuid, 50, 100, true, 100.00, gamilit.now_mexico() - INTERVAL '15 days', true, true, true, jsonb_build_object('xp', 400, 'ml_coins', 125), jsonb_build_object('exercises_completed', 50), ARRAY['milestone_25', 'milestone_50', 'milestone_75', 'milestone_100'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '18 days', gamilit.now_mexico() - INTERVAL '15 days'),
-- Racha de 7 D�as
('e0000005-0005-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0007-0000-0000-000000000001'::uuid, 7, 7, true, 100.00, gamilit.now_mexico() - INTERVAL '14 days', true, true, true, jsonb_build_object('xp', 300, 'ml_coins', 100), jsonb_build_object('streak_days', 7), ARRAY['day_3', 'day_5', 'day_7'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '16 days', gamilit.now_mexico() - INTERVAL '14 days'),
-- M�dulo 1 Completado
('e0000005-0006-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0009-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '16 days', true, true, true, jsonb_build_object('xp', 500, 'ml_coins', 150, 'certificate_url', '/certificates/modules/modulo-1.pdf'), jsonb_build_object('module_completed', 'modulo-01', 'score', 96), ARRAY['module_1_completed'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '18 days', gamilit.now_mexico() - INTERVAL '16 days'),
-- M�dulo 2 Completado
('e0000005-0007-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0010-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '12 days', true, true, true, jsonb_build_object('xp', 500, 'ml_coins', 150, 'certificate_url', '/certificates/modules/modulo-2.pdf'), jsonb_build_object('module_completed', 'modulo-02', 'score', 90), ARRAY['module_2_completed'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '14 days', gamilit.now_mexico() - INTERVAL '12 days'),
-- Perfeccionista
('e0000005-0008-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0013-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '16 days', true, true, true, jsonb_build_object('xp', 750, 'ml_coins', 250), jsonb_build_object('perfect_score_module', 'modulo-01'), ARRAY['perfect_module'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '16 days', gamilit.now_mexico() - INTERVAL '16 days'),
-- Explorador Curioso (completado)
('e0000005-0009-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0016-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '18 days', true, true, true, jsonb_build_object('xp', 100, 'ml_coins', 50), jsonb_build_object('modules_explored', 3), ARRAY['explore_module_1', 'explore_module_2', 'explore_module_3'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '18 days', gamilit.now_mexico() - INTERVAL '18 days'),
-- Lector Experto (en progreso 55%)
('e0000005-0010-0000-0000-000000000005'::uuid, 'fe0180a1-8a6d-4901-84aa-a4470f7908f2'::uuid, '90000001-0004-0000-0000-000000000001'::uuid, 55, 100, false, 55.00, NULL, false, false, false, '{}'::jsonb, jsonb_build_object('exercises_completed', 55, 'target', 200), ARRAY['milestone_25', 'milestone_50'], jsonb_build_object('demo_achievement', true, 'status', 'in_progress'), gamilit.now_mexico() - INTERVAL '15 days', gamilit.now_mexico() - INTERVAL '12 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PROFESOR 1: Juan P�rez (5 achievements de profesor)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000006-0001-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '30 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '30 days', gamilit.now_mexico() - INTERVAL '30 days'),
-- Racha de 7 D�as
('e0000006-0002-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, '90000001-0007-0000-0000-000000000001'::uuid, 7, 7, true, 100.00, gamilit.now_mexico() - INTERVAL '22 days', true, true, true, jsonb_build_object('xp', 300, 'ml_coins', 100), jsonb_build_object('streak_days', 7), ARRAY['day_3', 'day_5', 'day_7'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '25 days', gamilit.now_mexico() - INTERVAL '22 days'),
-- Racha de 30 D�as (en progreso 50%)
('e0000006-0003-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, '90000001-0008-0000-0000-000000000001'::uuid, 15, 30, false, 50.00, NULL, false, false, false, '{}'::jsonb, jsonb_build_object('streak_days', 15, 'target', 30), ARRAY['day_7', 'day_14'], jsonb_build_object('demo_achievement', true, 'status', 'in_progress'), gamilit.now_mexico() - INTERVAL '30 days', gamilit.now_mexico() - INTERVAL '15 days'),
-- Compa�ero de Aula
('e0000006-0004-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, '90000001-0018-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '28 days', true, true, true, jsonb_build_object('xp', 200, 'ml_coins', 75), jsonb_build_object('classroom_joined', true), ARRAY['join_classroom'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '28 days', gamilit.now_mexico() - INTERVAL '28 days'),
-- Estudiante Colaborativo
('e0000006-0005-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, '90000001-0019-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '25 days', true, true, true, jsonb_build_object('xp', 300, 'ml_coins', 100), jsonb_build_object('collaborations', 10), ARRAY['collab_5', 'collab_10'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '26 days', gamilit.now_mexico() - INTERVAL '25 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PROFESOR 2: Laura Mart�nez (5 achievements de profesora)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000007-0001-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '28 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '28 days', gamilit.now_mexico() - INTERVAL '28 days'),
-- Racha de 7 D�as
('e0000007-0002-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, '90000001-0007-0000-0000-000000000001'::uuid, 7, 7, true, 100.00, gamilit.now_mexico() - INTERVAL '20 days', true, true, true, jsonb_build_object('xp', 300, 'ml_coins', 100), jsonb_build_object('streak_days', 7), ARRAY['day_3', 'day_5', 'day_7'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '23 days', gamilit.now_mexico() - INTERVAL '20 days'),
-- Racha de 30 D�as (en progreso 40%)
('e0000007-0003-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, '90000001-0008-0000-0000-000000000001'::uuid, 12, 30, false, 40.00, NULL, false, false, false, '{}'::jsonb, jsonb_build_object('streak_days', 12, 'target', 30), ARRAY['day_7'], jsonb_build_object('demo_achievement', true, 'status', 'in_progress'), gamilit.now_mexico() - INTERVAL '28 days', gamilit.now_mexico() - INTERVAL '16 days'),
-- Compa�ero de Aula
('e0000007-0004-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, '90000001-0018-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '26 days', true, true, true, jsonb_build_object('xp', 200, 'ml_coins', 75), jsonb_build_object('classroom_joined', true), ARRAY['join_classroom'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '26 days', gamilit.now_mexico() - INTERVAL '26 days'),
-- Estudiante Colaborativo
('e0000007-0005-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, '90000001-0019-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '23 days', true, true, true, jsonb_build_object('xp', 300, 'ml_coins', 100), jsonb_build_object('collaborations', 10), ARRAY['collab_5', 'collab_10'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '24 days', gamilit.now_mexico() - INTERVAL '23 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ADMIN: Sistema Admin (10+ achievements - usuario avanzado)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000008-0001-0000-0000-000000000008'::uuid, 'e0359587-c4e6-4ffe-8359-ebd91a9a5621'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '60 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '60 days', gamilit.now_mexico() - INTERVAL '60 days'),
-- Racha de 30 D�as
('e0000008-0002-0000-0000-000000000008'::uuid, 'e0359587-c4e6-4ffe-8359-ebd91a9a5621'::uuid, '90000001-0008-0000-0000-000000000001'::uuid, 30, 30, true, 100.00, gamilit.now_mexico() - INTERVAL '30 days', true, true, true, jsonb_build_object('xp', 1000, 'ml_coins', 300), jsonb_build_object('streak_days', 30), ARRAY['day_7', 'day_14', 'day_21', 'day_30'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '60 days', gamilit.now_mexico() - INTERVAL '30 days'),
-- Maestro de la Lectura
('e0000008-0003-0000-0000-000000000008'::uuid, 'e0359587-c4e6-4ffe-8359-ebd91a9a5621'::uuid, '90000001-0005-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '35 days', true, true, true, jsonb_build_object('xp', 1500, 'ml_coins', 500, 'badge_url', '/badges/achievements/maestro-lectura.png'), jsonb_build_object('exercises_completed', 500), ARRAY['master_level'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '40 days', gamilit.now_mexico() - INTERVAL '35 days'),
-- Completista Total
('e0000008-0004-0000-0000-000000000008'::uuid, 'e0359587-c4e6-4ffe-8359-ebd91a9a5621'::uuid, '90000001-0012-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '32 days', true, true, true, jsonb_build_object('xp', 2000, 'ml_coins', 750, 'certificate_url', '/certificates/all-modules-completed.pdf'), jsonb_build_object('all_modules_completed', true), ARRAY['all_modules'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '35 days', gamilit.now_mexico() - INTERVAL '32 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- DIRECTOR: Roberto Director (6 achievements)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000009-0001-0000-0000-000000000009'::uuid, '7cae4d62-d2ee-478b-968f-55fb002aca23'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '45 days', true, true, true, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '45 days', gamilit.now_mexico() - INTERVAL '45 days'),
-- Racha de 30 D�as (en progreso 67%)
('e0000009-0002-0000-0000-000000000009'::uuid, '7cae4d62-d2ee-478b-968f-55fb002aca23'::uuid, '90000001-0008-0000-0000-000000000001'::uuid, 20, 30, false, 66.67, NULL, false, false, false, '{}'::jsonb, jsonb_build_object('streak_days', 20, 'target', 30), ARRAY['day_7', 'day_14'], jsonb_build_object('demo_achievement', true, 'status', 'in_progress'), gamilit.now_mexico() - INTERVAL '45 days', gamilit.now_mexico() - INTERVAL '25 days'),
-- Compa�ero de Aula
('e0000009-0003-0000-0000-000000000009'::uuid, '7cae4d62-d2ee-478b-968f-55fb002aca23'::uuid, '90000001-0018-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '40 days', true, true, true, jsonb_build_object('xp', 200, 'ml_coins', 75), jsonb_build_object('classroom_joined', true), ARRAY['join_classroom'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '40 days', gamilit.now_mexico() - INTERVAL '40 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = EXCLUDED.progress,
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PADRE: Carmen Madre (1 achievement)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.user_achievements
(id, user_id, achievement_id, progress, max_progress, is_completed, completion_percentage, completed_at, notified, viewed, rewards_claimed, rewards_received, progress_data, milestones_reached, metadata, started_at, created_at)
VALUES
-- Primera Visita
('e0000010-0001-0000-0000-000000000010'::uuid, 'e87d67f3-f886-4ec0-a942-59ddc802cc53'::uuid, '90000001-0020-0000-0000-000000000001'::uuid, 1, 1, true, 100.00, gamilit.now_mexico() - INTERVAL '5 days', true, false, false, jsonb_build_object('xp', 50, 'ml_coins', 25), jsonb_build_object('first_login', true), ARRAY['first_login'], jsonb_build_object('demo_achievement', true), gamilit.now_mexico() - INTERVAL '5 days', gamilit.now_mexico() - INTERVAL '5 days')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    is_completed = EXCLUDED.is_completed,
    completion_percentage = EXCLUDED.completion_percentage;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- VERIFICACI�N DE USER ACHIEVEMENTS
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_achievement_count INTEGER;
    v_completed_count INTEGER;
    v_in_progress_count INTEGER;
BEGIN
    -- Contar user achievements insertados
    SELECT COUNT(*) INTO v_achievement_count
    FROM gamification_system.user_achievements
    WHERE metadata->>'demo_achievement' = 'true';

    -- Contar completados
    SELECT COUNT(*) INTO v_completed_count
    FROM gamification_system.user_achievements
    WHERE metadata->>'demo_achievement' = 'true'
    AND is_completed = true;

    -- Contar en progreso
    SELECT COUNT(*) INTO v_in_progress_count
    FROM gamification_system.user_achievements
    WHERE metadata->>'demo_achievement' = 'true'
    AND is_completed = false;

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
    RAISE NOTICE 'User Achievements - Verificaci�n de Seeds';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
    RAISE NOTICE 'Total de user achievements insertados: %', v_achievement_count;
    RAISE NOTICE 'Achievements completados: %', v_completed_count;
    RAISE NOTICE 'Achievements en progreso: %', v_in_progress_count;
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    -- Verificar que tenemos achievements
    IF v_achievement_count = 0 THEN
        RAISE WARNING 'No se insertaron user achievements demo';
    ELSIF v_achievement_count < 35 THEN
        RAISE WARNING 'Se esperaban al menos 35 user achievements, se insertaron %', v_achievement_count;
    ELSE
        RAISE NOTICE ' Seeds de user achievements insertados correctamente';
    END IF;
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- LISTADO DE USER ACHIEVEMENTS INSERTADOS (para debugging)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_user_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen de achievements por usuario:';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    FOR v_user_record IN (
        SELECT
            u.email,
            p.display_name,
            COUNT(ua.id) as total_achievements,
            COUNT(CASE WHEN ua.is_completed THEN 1 END) as completed,
            COUNT(CASE WHEN NOT ua.is_completed THEN 1 END) as in_progress
        FROM auth.users u
        JOIN auth_management.profiles p ON p.user_id = u.id
        LEFT JOIN gamification_system.user_achievements ua ON ua.user_id = p.id
        WHERE ua.metadata->>'demo_achievement' = 'true'
        GROUP BY u.email, p.display_name
        ORDER BY u.email
    ) LOOP
        RAISE NOTICE '% (%): % total | % completados | % en progreso',
            v_user_record.display_name,
            v_user_record.email,
            v_user_record.total_achievements,
            v_user_record.completed,
            v_user_record.in_progress;
    END LOOP;

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- FIN DEL SEED
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
