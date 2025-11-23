-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Seed: ML Coins Transactions (Production Demo Data)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Description: Transacciones de ML Coins para demostraci�n del sistema de econom�a
-- Environment: production
-- Dependencies:
--   - auth.users (01-demo-users.sql)
--   - auth_management.profiles (03-profiles.sql)
--   - gamification_system.user_stats (05-user_stats.sql)
-- Execution Order: 7
-- Created: 2025-01-11
-- Version: 1.0.0
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

SET search_path TO gamification_system, public;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 1: Ana Garc�a (275 ML Coins actuales, 450 ganados, 175 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

-- Welcome bonus (100 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0001-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'welcome_bonus'::gamification_system.transaction_type, 100,
    0, 100, 'Bono de bienvenida al registrarte en GAMILIT',
    'profile', '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    jsonb_build_object('demo_transaction', true, 'category', 'welcome'),
    gamilit.now_mexico() - INTERVAL '12 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Ejercicio 1 completado (15 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0002-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_exercise'::gamification_system.transaction_type, 15,
    100, 115, 'ML Coins ganados por completar ejercicio de comprensi�n literal',
    'exercise', 'ex-001'::uuid,
    jsonb_build_object('demo_transaction', true, 'exercise_score', 85, 'module', 'M�DULO 1'),
    gamilit.now_mexico() - INTERVAL '11 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Achievement: Primeros Pasos (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0003-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_achievement'::gamification_system.transaction_type, 50,
    115, 165, 'ML Coins ganados por logro: Primeros Pasos',
    'achievement', '90000001-0001-0000-0000-000000000001'::uuid,
    jsonb_build_object('demo_transaction', true, 'achievement_name', 'Primeros Pasos'),
    gamilit.now_mexico() - INTERVAL '10 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Varios ejercicios completados (185 ML Coins en total)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0004-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_exercise'::gamification_system.transaction_type, 185,
    165, 350, 'ML Coins acumulados por completar 14 ejercicios adicionales',
    'exercise', NULL,
    jsonb_build_object('demo_transaction', true, 'exercises_count', 14, 'module', 'M�DULO 1'),
    gamilit.now_mexico() - INTERVAL '8 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Lupa (30 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0005-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -30,
    350, 320, 'Compra de comod�n: Lupa',
    'powerup', 'comodin-lupa'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Lupa'),
    gamilit.now_mexico() - INTERVAL '7 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Achievement: Racha de 3 d�as (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0006-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_achievement'::gamification_system.transaction_type, 50,
    320, 370, 'ML Coins ganados por logro: Racha de 3 D�as',
    'achievement', '90000001-0006-0000-0000-000000000001'::uuid,
    jsonb_build_object('demo_transaction', true, 'achievement_name', 'Racha de 3 D�as'),
    gamilit.now_mexico() - INTERVAL '5 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0007-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    370, 360, 'Compra de pista para ejercicio',
    'exercise', 'ex-015'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 1),
    gamilit.now_mexico() - INTERVAL '4 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Bono diario de streak (25 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0008-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_streak'::gamification_system.transaction_type, 25,
    360, 385, 'Bono por mantener racha diaria activa',
    NULL, NULL,
    jsonb_build_object('demo_transaction', true, 'streak_days', 3),
    gamilit.now_mexico() - INTERVAL '3 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Br�jula (25 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0009-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -25,
    385, 360, 'Compra de comod�n: Br�jula',
    'powerup', 'comodin-brujula'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Br�jula'),
    gamilit.now_mexico() - INTERVAL '2 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Achievement: Lector Principiante (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0010-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_achievement'::gamification_system.transaction_type, 50,
    360, 410, 'ML Coins ganados por logro: Lector Principiante',
    'achievement', '90000001-0002-0000-0000-000000000001'::uuid,
    jsonb_build_object('demo_transaction', true, 'achievement_name', 'Lector Principiante'),
    gamilit.now_mexico() - INTERVAL '1 day'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de retry de ejercicio (15 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0011-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_retry'::gamification_system.transaction_type, -15,
    410, 395, 'Compra de reintento para ejercicio',
    'exercise', 'ex-020'::uuid,
    jsonb_build_object('demo_transaction', true, 'retry_number', 1),
    gamilit.now_mexico() - INTERVAL '12 hours'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Bono diario (20 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0012-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_daily'::gamification_system.transaction_type, 20,
    395, 415, 'Bono diario por iniciar sesi�n',
    NULL, NULL,
    jsonb_build_object('demo_transaction', true, 'consecutive_days', 3),
    gamilit.now_mexico() - INTERVAL '6 hours'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de retry adicional (15 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0013-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_retry'::gamification_system.transaction_type, -15,
    415, 400, 'Compra de segundo reintento para ejercicio',
    'exercise', 'ex-022'::uuid,
    jsonb_build_object('demo_transaction', true, 'retry_number', 1),
    gamilit.now_mexico() - INTERVAL '4 hours'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Diccionario (25 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0014-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -25,
    400, 375, 'Compra de comod�n: Diccionario Contextual',
    'powerup', 'comodin-diccionario'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Diccionario Contextual'),
    gamilit.now_mexico() - INTERVAL '2 hours'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint adicional (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0015-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    375, 365, 'Compra de pista adicional para ejercicio',
    'exercise', 'ex-023'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 2),
    gamilit.now_mexico() - INTERVAL '1 hour'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Ajuste de balance para cuadrar (90 ML Coins adicionales de ejercicios)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0016-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_bonus'::gamification_system.transaction_type, 90,
    365, 455, 'Bonos acumulados por racha y ejercicios perfectos',
    NULL, NULL,
    jsonb_build_object('demo_transaction', true, 'bonus_type', 'perfect_scores'),
    gamilit.now_mexico() - INTERVAL '30 minutes'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint adicional (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0017-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    455, 445, 'Compra de pista para ejercicio complejo',
    'exercise', 'ex-024'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 1),
    gamilit.now_mexico() - INTERVAL '15 minutes'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Resaltador (20 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0018-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -20,
    445, 425, 'Compra de comod�n: Resaltador',
    'powerup', 'comodin-resaltador'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Resaltador'),
    gamilit.now_mexico() - INTERVAL '10 minutes'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Bono adicional de racha (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0019-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_streak'::gamification_system.transaction_type, 50,
    425, 475, 'Bono especial por racha consecutiva de 3 d�as',
    NULL, NULL,
    jsonb_build_object('demo_transaction', true, 'streak_days', 3, 'bonus_type', 'milestone'),
    gamilit.now_mexico() - INTERVAL '5 minutes'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Organizador (50 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0020-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -50,
    475, 425, 'Compra de comod�n: Organizador de Ideas',
    'powerup', 'comodin-organizador'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Organizador de Ideas'),
    gamilit.now_mexico() - INTERVAL '2 minutes'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Mapa Mental (50 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0021-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -50,
    425, 375, 'Compra de comod�n: Mapa Mental',
    'powerup', 'comodin-mapa-mental'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Mapa Mental'),
    gamilit.now_mexico() - INTERVAL '1 minute'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Ajuste final (balance -100 para llegar a 275)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000001-0022-0000-0000-000000000001'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'admin_adjustment'::gamification_system.transaction_type, -100,
    375, 275, 'Ajuste administrativo de balance (correcci�n de sistema)',
    NULL, NULL,
    jsonb_build_object('demo_transaction', true, 'reason', 'balance_correction'),
    gamilit.now_mexico()
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 2: Carlos Ram�rez (150 ML Coins actuales, 200 ganados, 50 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

-- Welcome bonus (100 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000002-0001-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'welcome_bonus'::gamification_system.transaction_type, 100,
    0, 100, 'Bono de bienvenida al registrarte en GAMILIT',
    'profile', '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    jsonb_build_object('demo_transaction', true, 'category', 'welcome'),
    gamilit.now_mexico() - INTERVAL '8 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Achievement: Primera Visita (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000002-0002-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_achievement'::gamification_system.transaction_type, 50,
    100, 150, 'ML Coins ganados por logro: Primera Visita',
    'achievement', '90000001-0020-0000-0000-000000000001'::uuid,
    jsonb_build_object('demo_transaction', true, 'achievement_name', 'Primera Visita'),
    gamilit.now_mexico() - INTERVAL '8 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Ejercicios completados (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000002-0003-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_exercise'::gamification_system.transaction_type, 50,
    150, 200, 'ML Coins ganados por completar 5 ejercicios',
    'exercise', NULL,
    jsonb_build_object('demo_transaction', true, 'exercises_count', 5, 'module', 'M�DULO 1'),
    gamilit.now_mexico() - INTERVAL '5 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000002-0004-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    200, 190, 'Compra de pista para ejercicio',
    'exercise', 'ex-005'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 1),
    gamilit.now_mexico() - INTERVAL '4 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Lupa (30 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000002-0005-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -30,
    190, 160, 'Compra de comod�n: Lupa',
    'powerup', 'comodin-lupa'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Lupa'),
    gamilit.now_mexico() - INTERVAL '3 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint adicional (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000002-0006-0000-0000-000000000002'::uuid,
    '02bc5f00-192e-5397-c909-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    160, 150, 'Compra de pista adicional para ejercicio',
    'exercise', 'ex-006'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 2),
    gamilit.now_mexico() - INTERVAL '1 day'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 3: Mar�a Fernanda (425 ML Coins, 500 ganados, 75 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

-- Welcome bonus (100 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0001-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'welcome_bonus'::gamification_system.transaction_type, 100,
    0, 100, 'Bono de bienvenida al registrarte en GAMILIT',
    'profile', '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    jsonb_build_object('demo_transaction', true, 'category', 'welcome'),
    gamilit.now_mexico() - INTERVAL '15 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Ejercicios M�dulo 1 (250 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0002-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_exercise'::gamification_system.transaction_type, 250,
    100, 350, 'ML Coins ganados por completar 25 ejercicios del M�dulo 1',
    'exercise', NULL,
    jsonb_build_object('demo_transaction', true, 'exercises_count', 25, 'module', 'M�DULO 1'),
    gamilit.now_mexico() - INTERVAL '12 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Lupa (30 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0003-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -30,
    350, 320, 'Compra de comod�n: Lupa',
    'powerup', 'comodin-lupa'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Lupa'),
    gamilit.now_mexico() - INTERVAL '11 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Achievement: M�dulo 1 Completado (100 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0004-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_module'::gamification_system.transaction_type, 100,
    320, 420, 'ML Coins ganados por completar M�dulo 1',
    'module', 'modulo-01-comprension-literal'::uuid,
    jsonb_build_object('demo_transaction', true, 'module_name', 'M�DULO 1'),
    gamilit.now_mexico() - INTERVAL '10 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Achievement: Racha de 7 d�as (50 ML Coins)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0005-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'earned_achievement'::gamification_system.transaction_type, 50,
    420, 470, 'ML Coins ganados por logro: Racha de 7 D�as',
    'achievement', '90000001-0007-0000-0000-000000000001'::uuid,
    jsonb_build_object('demo_transaction', true, 'achievement_name', 'Racha de 7 D�as'),
    gamilit.now_mexico() - INTERVAL '7 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de comod�n: Diccionario (25 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0006-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_powerup'::gamification_system.transaction_type, -25,
    470, 445, 'Compra de comod�n: Diccionario Contextual',
    'powerup', 'comodin-diccionario'::uuid,
    jsonb_build_object('demo_transaction', true, 'powerup_name', 'Diccionario Contextual'),
    gamilit.now_mexico() - INTERVAL '6 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0007-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    445, 435, 'Compra de pista para ejercicio del M�dulo 2',
    'exercise', 'ex-026'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 1),
    gamilit.now_mexico() - INTERVAL '5 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- Compra de hint adicional (10 ML Coins gastados)
INSERT INTO gamification_system.ml_coins_transactions (
    id, user_id, tenant_id, transaction_type, amount,
    balance_before, balance_after, description,
    related_entity_type, related_entity_id,
    metadata, created_at
) VALUES (
    'd0000003-0008-0000-0000-000000000003'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'spent_hint'::gamification_system.transaction_type, -10,
    435, 425, 'Compra de pista adicional para ejercicio del M�dulo 2',
    'exercise', 'ex-027'::uuid,
    jsonb_build_object('demo_transaction', true, 'hint_level', 2),
    gamilit.now_mexico() - INTERVAL '2 days'
) ON CONFLICT (id) DO UPDATE SET
    amount = EXCLUDED.amount,
    balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- Continuaci�n con transacciones m�s compactas para el resto de usuarios...
-- ESTUDIANTE 4: Luis Miguel (300 ML Coins, 450 ganados, 150 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000004-0001-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida al registrarte en GAMILIT', 'profile', '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '14 days'),
('d0000004-0002-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_exercise'::gamification_system.transaction_type, 200, 100, 300, 'ML Coins por completar 20 ejercicios', 'exercise', NULL, jsonb_build_object('demo_transaction', true, 'exercises_count', 20), gamilit.now_mexico() - INTERVAL '10 days'),
('d0000004-0003-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_achievement'::gamification_system.transaction_type, 100, 300, 400, 'ML Coins por achievements (Primeros Pasos, Lector Principiante)', 'achievement', NULL, jsonb_build_object('demo_transaction', true, 'achievements_count', 2), gamilit.now_mexico() - INTERVAL '8 days'),
('d0000004-0004-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_streak'::gamification_system.transaction_type, 50, 400, 450, 'Bonos por racha de 4 d�as', NULL, NULL, jsonb_build_object('demo_transaction', true, 'streak_days', 4), gamilit.now_mexico() - INTERVAL '4 days'),
('d0000004-0005-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_powerup'::gamification_system.transaction_type, -80, 450, 370, 'Compra de comodines (Lupa, Br�jula, Diccionario)', 'powerup', NULL, jsonb_build_object('demo_transaction', true, 'powerups_count', 3), gamilit.now_mexico() - INTERVAL '3 days'),
('d0000004-0006-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_hint'::gamification_system.transaction_type, -40, 370, 330, 'Compra de 4 hints', 'exercise', NULL, jsonb_build_object('demo_transaction', true, 'hints_count', 4), gamilit.now_mexico() - INTERVAL '2 days'),
('d0000004-0007-0000-0000-000000000004'::uuid, '04de7f00-382e-7497-e919-5h479f49e38h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_retry'::gamification_system.transaction_type, -30, 330, 300, 'Compra de 2 reintentos', 'exercise', NULL, jsonb_build_object('demo_transaction', true, 'retries_count', 2), gamilit.now_mexico() - INTERVAL '1 day')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ESTUDIANTE 5: Sof�a Mart�nez (650 ML Coins, 800 ganados, 150 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000005-0001-0000-0000-000000000005'::uuid, '05ef8f00-482e-8587-f929-6i589g49f49i'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida al registrarte en GAMILIT', 'profile', '05ef8f00-482e-8587-f929-6i589g49f49i'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '20 days'),
('d0000005-0002-0000-0000-000000000005'::uuid, '05ef8f00-482e-8587-f929-6i589g49f49i'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_exercise'::gamification_system.transaction_type, 500, 100, 600, 'ML Coins por completar 50 ejercicios (M�dulos 1 y 2)', 'exercise', NULL, jsonb_build_object('demo_transaction', true, 'exercises_count', 50), gamilit.now_mexico() - INTERVAL '15 days'),
('d0000005-0003-0000-0000-000000000005'::uuid, '05ef8f00-482e-8587-f929-6i589g49f49i'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_module'::gamification_system.transaction_type, 200, 600, 800, 'ML Coins por completar 2 m�dulos (M�dulo 1 y 2)', 'module', NULL, jsonb_build_object('demo_transaction', true, 'modules_count', 2), gamilit.now_mexico() - INTERVAL '12 days'),
('d0000005-0004-0000-0000-000000000005'::uuid, '05ef8f00-482e-8587-f929-6i589g49f49i'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_powerup'::gamification_system.transaction_type, -120, 800, 680, 'Compra de comodines avanzados', 'powerup', NULL, jsonb_build_object('demo_transaction', true, 'powerups_count', 4), gamilit.now_mexico() - INTERVAL '8 days'),
('d0000005-0005-0000-0000-000000000005'::uuid, '05ef8f00-482e-8587-f929-6i589g49f49i'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_hint'::gamification_system.transaction_type, -30, 680, 650, 'Compra de 3 hints para M�dulo 3', 'exercise', NULL, jsonb_build_object('demo_transaction', true, 'hints_count', 3), gamilit.now_mexico() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PROFESOR 1: Juan P�rez (1000 ML Coins, 1200 ganados, 200 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000006-0001-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida - Profesor', 'profile', '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '30 days'),
('d0000006-0002-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_bonus'::gamification_system.transaction_type, 600, 100, 700, 'Bonos por actividades de profesor (creaci�n de contenido, evaluaciones)', NULL, NULL, jsonb_build_object('demo_transaction', true, 'bonus_type', 'teacher_activities'), gamilit.now_mexico() - INTERVAL '20 days'),
('d0000006-0003-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_achievement'::gamification_system.transaction_type, 500, 700, 1200, 'ML Coins por achievements de profesor', 'achievement', NULL, jsonb_build_object('demo_transaction', true, 'achievements_count', 5), gamilit.now_mexico() - INTERVAL '15 days'),
('d0000006-0004-0000-0000-000000000006'::uuid, '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_powerup'::gamification_system.transaction_type, -200, 1200, 1000, 'Compra de herramientas premium para ense�anza', 'powerup', NULL, jsonb_build_object('demo_transaction', true, 'tools_purchased', 4), gamilit.now_mexico() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PROFESOR 2: Laura Mart�nez (950 ML Coins, 1150 ganados, 200 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000007-0001-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida - Profesora', 'profile', '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '28 days'),
('d0000007-0002-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_bonus'::gamification_system.transaction_type, 550, 100, 650, 'Bonos por actividades de profesora', NULL, NULL, jsonb_build_object('demo_transaction', true, 'bonus_type', 'teacher_activities'), gamilit.now_mexico() - INTERVAL '18 days'),
('d0000007-0003-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_achievement'::gamification_system.transaction_type, 500, 650, 1150, 'ML Coins por achievements de profesora', 'achievement', NULL, jsonb_build_object('demo_transaction', true, 'achievements_count', 5), gamilit.now_mexico() - INTERVAL '12 days'),
('d0000007-0004-0000-0000-000000000007'::uuid, '11bc5f00-1a2e-5397-c919-3f289d49c26f'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_powerup'::gamification_system.transaction_type, -200, 1150, 950, 'Compra de herramientas premium para ense�anza', 'powerup', NULL, jsonb_build_object('demo_transaction', true, 'tools_purchased', 4), gamilit.now_mexico() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- ADMIN: Sistema Admin (5000 ML Coins, 5500 ganados, 500 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000008-0001-0000-0000-000000000008'::uuid, '20ac4f00-0a2e-6397-d929-4g399e49d37g'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida - Admin', 'profile', '20ac4f00-0a2e-6397-d929-4g399e49d37g'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '60 days'),
('d0000008-0002-0000-0000-000000000008'::uuid, '20ac4f00-0a2e-6397-d929-4g399e49d37g'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_bonus'::gamification_system.transaction_type, 5400, 100, 5500, 'Bonos acumulados por administraci�n del sistema', NULL, NULL, jsonb_build_object('demo_transaction', true, 'bonus_type', 'admin_activities'), gamilit.now_mexico() - INTERVAL '30 days'),
('d0000008-0003-0000-0000-000000000008'::uuid, '20ac4f00-0a2e-6397-d929-4g399e49d37g'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_powerup'::gamification_system.transaction_type, -500, 5500, 5000, 'Compra de herramientas de administraci�n premium', 'powerup', NULL, jsonb_build_object('demo_transaction', true, 'admin_tools', true), gamilit.now_mexico() - INTERVAL '10 days')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- DIRECTOR: Roberto Director (2500 ML Coins, 2800 ganados, 300 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000009-0001-0000-0000-000000000009'::uuid, '21bc5f00-1b2e-7497-e939-5h4a9f49e48h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida - Director', 'profile', '21bc5f00-1b2e-7497-e939-5h4a9f49e48h'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '45 days'),
('d0000009-0002-0000-0000-000000000009'::uuid, '21bc5f00-1b2e-7497-e939-5h4a9f49e48h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'earned_bonus'::gamification_system.transaction_type, 2700, 100, 2800, 'Bonos acumulados por gesti�n directiva', NULL, NULL, jsonb_build_object('demo_transaction', true, 'bonus_type', 'management_activities'), gamilit.now_mexico() - INTERVAL '25 days'),
('d0000009-0003-0000-0000-000000000009'::uuid, '21bc5f00-1b2e-7497-e939-5h4a9f49e48h'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'spent_powerup'::gamification_system.transaction_type, -300, 2800, 2500, 'Compra de herramientas de gesti�n', 'powerup', NULL, jsonb_build_object('demo_transaction', true, 'management_tools', true), gamilit.now_mexico() - INTERVAL '8 days')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- PADRE: Carmen Madre (100 ML Coins, 100 ganados, 0 gastados)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

INSERT INTO gamification_system.ml_coins_transactions
(id, user_id, tenant_id, transaction_type, amount, balance_before, balance_after, description, related_entity_type, related_entity_id, metadata, created_at)
VALUES
('d0000010-0001-0000-0000-000000000010'::uuid, '30cd6f00-2c2e-8587-f949-6i5b9g49f59i'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'welcome_bonus'::gamification_system.transaction_type, 100, 0, 100, 'Bono de bienvenida - Padre/Madre', 'profile', '30cd6f00-2c2e-8587-f949-6i5b9g49f59i'::uuid, jsonb_build_object('demo_transaction', true), gamilit.now_mexico() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, balance_after = EXCLUDED.balance_after;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- VERIFICACI�N DE TRANSACCIONES
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_transaction_count INTEGER;
    v_total_earned INTEGER;
    v_total_spent INTEGER;
    v_net_balance INTEGER;
BEGIN
    -- Contar transacciones insertadas
    SELECT COUNT(*) INTO v_transaction_count
    FROM gamification_system.ml_coins_transactions
    WHERE metadata->>'demo_transaction' = 'true';

    -- Calcular totales ganados
    SELECT COALESCE(SUM(amount), 0) INTO v_total_earned
    FROM gamification_system.ml_coins_transactions
    WHERE metadata->>'demo_transaction' = 'true'
    AND amount > 0;

    -- Calcular totales gastados
    SELECT COALESCE(SUM(ABS(amount)), 0) INTO v_total_spent
    FROM gamification_system.ml_coins_transactions
    WHERE metadata->>'demo_transaction' = 'true'
    AND amount < 0;

    -- Balance neto
    v_net_balance := v_total_earned - v_total_spent;

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
    RAISE NOTICE 'ML Coins Transactions - Verificaci�n de Seeds';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
    RAISE NOTICE 'Total de transacciones insertadas: %', v_transaction_count;
    RAISE NOTICE 'Total ML Coins ganados: % ML Coins', v_total_earned;
    RAISE NOTICE 'Total ML Coins gastados: % ML Coins', v_total_spent;
    RAISE NOTICE 'Balance neto: % ML Coins', v_net_balance;
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    -- Verificar que tenemos transacciones
    IF v_transaction_count = 0 THEN
        RAISE WARNING 'No se insertaron transacciones demo';
    ELSIF v_transaction_count < 40 THEN
        RAISE WARNING 'Se esperaban al menos 40 transacciones, se insertaron %', v_transaction_count;
    ELSE
        RAISE NOTICE ' Seeds de transacciones ML Coins insertados correctamente';
    END IF;
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- LISTADO DE TRANSACCIONES INSERTADAS (para debugging)
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

DO $$
DECLARE
    v_user_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'Resumen de transacciones por usuario:';
    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';

    FOR v_user_record IN (
        SELECT
            u.email,
            p.display_name,
            COUNT(t.id) as transaction_count,
            COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) as total_earned,
            COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) as total_spent,
            MAX(t.balance_after) as current_balance
        FROM auth.users u
        JOIN auth_management.profiles p ON p.user_id = u.id
        LEFT JOIN gamification_system.ml_coins_transactions t ON t.user_id = u.id
        WHERE t.metadata->>'demo_transaction' = 'true'
        GROUP BY u.email, p.display_name
        ORDER BY u.email
    ) LOOP
        RAISE NOTICE '% (%): % transacciones | Ganados: % | Gastados: % | Balance: %',
            v_user_record.display_name,
            v_user_record.email,
            v_user_record.transaction_count,
            v_user_record.total_earned,
            v_user_record.total_spent,
            v_user_record.current_balance;
    END LOOP;

    RAISE NOTICE 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP';
END $$;

-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
-- FIN DEL SEED
-- PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
