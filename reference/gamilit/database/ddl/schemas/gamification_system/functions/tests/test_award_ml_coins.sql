-- =====================================================
-- Test Suite: gamification_system.award_ml_coins
-- Description: Tests for award_ml_coins function including rank multipliers, transaction logging, and edge cases
-- Created: 2025-11-08
-- Validated against: ET-GAM-002-comodines.md, ET-GAM-003-rangos-maya.md
-- =====================================================

-- Setup test environment
BEGIN;

-- =====================================================
-- Test Data Setup
-- =====================================================

-- Create test user with Ajaw rank (1.00x multiplier)
INSERT INTO auth_management.profiles (id, email, username)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'test_ajaw@test.com', 'test_ajaw'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'test_nacom@test.com', 'test_nacom'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'test_ahkin@test.com', 'test_ahkin'),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'test_halach@test.com', 'test_halach'),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'test_kukul@test.com', 'test_kukul')
ON CONFLICT DO NOTHING;

-- Initialize user_stats with 0 ML Coins
INSERT INTO gamification_system.user_stats (user_id, ml_coins, ml_coins_earned_total, ml_coins_spent_total)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 0, 0, 0),
  ('22222222-2222-2222-2222-222222222222'::uuid, 0, 0, 0),
  ('33333333-3333-3333-3333-333333333333'::uuid, 0, 0, 0),
  ('44444444-4444-4444-4444-444444444444'::uuid, 0, 0, 0),
  ('55555555-5555-5555-5555-555555555555'::uuid, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Initialize user_ranks with different ranks
INSERT INTO gamification_system.user_ranks (user_id, current_rank, is_current)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Ajaw'::maya_rank, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Nacom'::maya_rank, true),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Ah K''in'::maya_rank, true),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'Halach Uinic'::maya_rank, true),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'K''uk''ulkan'::maya_rank, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TEST 1: Basic Award - Ajaw Rank (1.00x multiplier)
-- =====================================================
DO $$
DECLARE
  v_transaction_id UUID;
  v_balance INTEGER;
  v_earned_total INTEGER;
  v_tx_amount INTEGER;
  v_multiplier DECIMAL(3,2);
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 1: Award 100 ML Coins to Ajaw rank';
  RAISE NOTICE '========================================';

  -- Award 100 coins
  SELECT gamification_system.award_ml_coins(
    '11111111-1111-1111-1111-111111111111'::uuid,
    100,
    'earned_exercise',
    'Test exercise completion',
    NULL,
    NULL
  ) INTO v_transaction_id;

  -- Verify user_stats updated correctly
  SELECT ml_coins, ml_coins_earned_total
  INTO v_balance, v_earned_total
  FROM gamification_system.user_stats
  WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid;

  -- Verify transaction logged
  SELECT amount, multiplier
  INTO v_tx_amount, v_multiplier
  FROM gamification_system.ml_coins_transactions
  WHERE id = v_transaction_id;

  -- Assertions
  ASSERT v_balance = 100, format('Balance should be 100, got %s', v_balance);
  ASSERT v_earned_total = 100, format('Total earned should be 100, got %s', v_earned_total);
  ASSERT v_tx_amount = 100, format('Transaction amount should be 100, got %s', v_tx_amount);
  ASSERT v_multiplier = 1.00, format('Multiplier should be 1.00, got %s', v_multiplier);

  RAISE NOTICE '✅ TEST 1 PASSED: Ajaw rank 100 coins → balance=100, multiplier=1.00x';
END $$;

-- =====================================================
-- TEST 2: Nacom Rank (1.25x multiplier)
-- =====================================================
DO $$
DECLARE
  v_transaction_id UUID;
  v_balance INTEGER;
  v_tx_amount INTEGER;
  v_multiplier DECIMAL(3,2);
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 2: Award 100 ML Coins to Nacom rank (1.25x)';
  RAISE NOTICE '========================================';

  SELECT gamification_system.award_ml_coins(
    '22222222-2222-2222-2222-222222222222'::uuid,
    100,
    'earned_module',
    'Module completed',
    NULL,
    NULL
  ) INTO v_transaction_id;

  SELECT ml_coins INTO v_balance
  FROM gamification_system.user_stats
  WHERE user_id = '22222222-2222-2222-2222-222222222222'::uuid;

  SELECT amount, multiplier
  INTO v_tx_amount, v_multiplier
  FROM gamification_system.ml_coins_transactions
  WHERE id = v_transaction_id;

  -- Expected: 100 * 1.25 = 125 coins
  ASSERT v_balance = 125, format('Balance should be 125 (100 * 1.25), got %s', v_balance);
  ASSERT v_tx_amount = 125, format('Transaction amount should be 125, got %s', v_tx_amount);
  ASSERT v_multiplier = 1.25, format('Multiplier should be 1.25, got %s', v_multiplier);

  RAISE NOTICE '✅ TEST 2 PASSED: Nacom rank 100 coins → 125 coins (1.25x multiplier)';
END $$;

-- =====================================================
-- TEST 3: Ah K'in Rank (1.50x multiplier)
-- =====================================================
DO $$
DECLARE
  v_balance INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 3: Award 100 ML Coins to Ah K''in rank (1.50x)';
  RAISE NOTICE '========================================';

  PERFORM gamification_system.award_ml_coins(
    '33333333-3333-3333-3333-333333333333'::uuid,
    100,
    'earned_achievement',
    'Achievement unlocked',
    NULL,
    NULL
  );

  SELECT ml_coins INTO v_balance
  FROM gamification_system.user_stats
  WHERE user_id = '33333333-3333-3333-3333-333333333333'::uuid;

  -- Expected: 100 * 1.50 = 150 coins
  ASSERT v_balance = 150, format('Balance should be 150 (100 * 1.50), got %s', v_balance);

  RAISE NOTICE '✅ TEST 3 PASSED: Ah K''in rank 100 coins → 150 coins (1.50x multiplier)';
END $$;

-- =====================================================
-- TEST 4: Halach Uinic Rank (1.75x multiplier)
-- =====================================================
DO $$
DECLARE
  v_balance INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 4: Award 100 ML Coins to Halach Uinic rank (1.75x)';
  RAISE NOTICE '========================================';

  PERFORM gamification_system.award_ml_coins(
    '44444444-4444-4444-4444-444444444444'::uuid,
    100,
    'earned_streak',
    '7 day streak bonus',
    NULL,
    NULL
  );

  SELECT ml_coins INTO v_balance
  FROM gamification_system.user_stats
  WHERE user_id = '44444444-4444-4444-4444-444444444444'::uuid;

  -- Expected: 100 * 1.75 = 175 coins
  ASSERT v_balance = 175, format('Balance should be 175 (100 * 1.75), got %s', v_balance);

  RAISE NOTICE '✅ TEST 4 PASSED: Halach Uinic rank 100 coins → 175 coins (1.75x multiplier)';
END $$;

-- =====================================================
-- TEST 5: K'uk'ulkan Rank (2.00x multiplier)
-- =====================================================
DO $$
DECLARE
  v_balance INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 5: Award 100 ML Coins to K''uk''ulkan rank (2.00x)';
  RAISE NOTICE '========================================';

  PERFORM gamification_system.award_ml_coins(
    '55555555-5555-5555-5555-555555555555'::uuid,
    100,
    'earned_rank',
    'Rank promotion bonus',
    NULL,
    NULL
  );

  SELECT ml_coins INTO v_balance
  FROM gamification_system.user_stats
  WHERE user_id = '55555555-5555-5555-5555-555555555555'::uuid;

  -- Expected: 100 * 2.00 = 200 coins
  ASSERT v_balance = 200, format('Balance should be 200 (100 * 2.00), got %s', v_balance);

  RAISE NOTICE '✅ TEST 5 PASSED: K''uk''ulkan rank 100 coins → 200 coins (2.00x multiplier)';
END $$;

-- =====================================================
-- TEST 6: Multiple Awards Accumulate
-- =====================================================
DO $$
DECLARE
  v_balance INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 6: Multiple awards accumulate correctly';
  RAISE NOTICE '========================================';

  -- Award another 50 coins to Ajaw user (already has 100)
  PERFORM gamification_system.award_ml_coins(
    '11111111-1111-1111-1111-111111111111'::uuid,
    50,
    'earned_daily',
    'Daily login bonus',
    NULL,
    NULL
  );

  SELECT ml_coins INTO v_balance
  FROM gamification_system.user_stats
  WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid;

  -- Expected: 100 + 50 = 150 coins
  ASSERT v_balance = 150, format('Balance should be 150 (100 + 50), got %s', v_balance);

  RAISE NOTICE '✅ TEST 6 PASSED: Multiple awards accumulate (100 + 50 = 150)';
END $$;

-- =====================================================
-- TEST 7: Transaction Metadata Includes Base Amount
-- =====================================================
DO $$
DECLARE
  v_metadata JSONB;
  v_base_amount INTEGER;
  v_final_amount INTEGER;
  v_rank TEXT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 7: Transaction metadata contains correct data';
  RAISE NOTICE '========================================';

  -- Get most recent transaction for Nacom user (1.25x multiplier)
  SELECT metadata
  INTO v_metadata
  FROM gamification_system.ml_coins_transactions
  WHERE user_id = '22222222-2222-2222-2222-222222222222'::uuid
  ORDER BY created_at DESC
  LIMIT 1;

  v_base_amount := (v_metadata->>'base_amount')::INTEGER;
  v_final_amount := (v_metadata->>'final_amount')::INTEGER;
  v_rank := v_metadata->>'rank';

  ASSERT v_base_amount = 100, format('Base amount should be 100, got %s', v_base_amount);
  ASSERT v_final_amount = 125, format('Final amount should be 125, got %s', v_final_amount);
  ASSERT v_rank = 'Nacom', format('Rank should be Nacom, got %s', v_rank);

  RAISE NOTICE '✅ TEST 7 PASSED: Metadata contains base_amount=100, final_amount=125, rank=Nacom';
END $$;

-- =====================================================
-- TEST 8: Transaction Type Validation
-- =====================================================
DO $$
DECLARE
  v_tx_type transaction_type;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 8: Transaction type is properly set';
  RAISE NOTICE '========================================';

  SELECT transaction_type
  INTO v_tx_type
  FROM gamification_system.ml_coins_transactions
  WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid
    AND description = 'Test exercise completion';

  ASSERT v_tx_type = 'earned_exercise'::transaction_type,
    format('Transaction type should be earned_exercise, got %s', v_tx_type);

  RAISE NOTICE '✅ TEST 8 PASSED: Transaction type correctly set to earned_exercise';
END $$;

-- =====================================================
-- TEST 9: Balance Before/After Tracking
-- =====================================================
DO $$
DECLARE
  v_balance_before INTEGER;
  v_balance_after INTEGER;
  v_amount INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 9: Balance before/after correctly tracked';
  RAISE NOTICE '========================================';

  SELECT balance_before, balance_after, amount
  INTO v_balance_before, v_balance_after, v_amount
  FROM gamification_system.ml_coins_transactions
  WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid
    AND description = 'Daily login bonus';

  ASSERT v_balance_before = 100, format('Balance before should be 100, got %s', v_balance_before);
  ASSERT v_balance_after = 150, format('Balance after should be 150, got %s', v_balance_after);
  ASSERT v_amount = 50, format('Amount should be 50, got %s', v_amount);

  RAISE NOTICE '✅ TEST 9 PASSED: Balance tracking correct (100 → 150, +50)';
END $$;

-- =====================================================
-- TEST 10: Fractional Amounts Are Floored
-- =====================================================
DO $$
DECLARE
  v_balance INTEGER;
  v_amount INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST 10: Fractional amounts are floored correctly';
  RAISE NOTICE '========================================';

  -- Award 33 coins to Nacom (1.25x)
  -- Expected: FLOOR(33 * 1.25) = FLOOR(41.25) = 41
  PERFORM gamification_system.award_ml_coins(
    '22222222-2222-2222-2222-222222222222'::uuid,
    33,
    'earned_bonus',
    'Fractional test',
    NULL,
    NULL
  );

  -- Get the transaction amount
  SELECT amount INTO v_amount
  FROM gamification_system.ml_coins_transactions
  WHERE user_id = '22222222-2222-2222-2222-222222222222'::uuid
    AND description = 'Fractional test';

  ASSERT v_amount = 41, format('Amount should be 41 (FLOOR(33 * 1.25)), got %s', v_amount);

  RAISE NOTICE '✅ TEST 10 PASSED: Fractional amounts floored (33 * 1.25 = 41.25 → 41)';
END $$;

-- =====================================================
-- Summary
-- =====================================================
RAISE NOTICE '';
RAISE NOTICE '========================================';
RAISE NOTICE '✅ ALL 10 TESTS PASSED';
RAISE NOTICE '========================================';
RAISE NOTICE '';
RAISE NOTICE 'Validated:';
RAISE NOTICE '  - ✅ Rank multipliers (1.00x, 1.25x, 1.50x, 1.75x, 2.00x)';
RAISE NOTICE '  - ✅ Balance accumulation';
RAISE NOTICE '  - ✅ Transaction logging';
RAISE NOTICE '  - ✅ Metadata storage (base_amount, final_amount, rank)';
RAISE NOTICE '  - ✅ Transaction type validation';
RAISE NOTICE '  - ✅ Balance before/after tracking';
RAISE NOTICE '  - ✅ Fractional amount flooring';
RAISE NOTICE '';

-- Cleanup
ROLLBACK;
