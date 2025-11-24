/**
 * useExerciseRewards Hook Tests
 *
 * Tests for exercise rewards hook managing XP, ML Coins, and hints.
 *
 * Test Coverage:
 * - Hook Initialization (2 tests): Initial state, with options
 * - Hint Affordability (3 tests): Check affordability, insufficient funds
 * - Unlock Hints (4 tests): Unlock, prevent double unlock, deduct coins
 * - XP Calculations (3 tests): Base XP, with hints penalty, incorrect answer
 * - ML Coins Calculations (3 tests): Base coins, with hints penalty, incorrect answer
 * - Add ML Coins (2 tests): Add reward coins, callback triggered
 * - Reset Functionality (1 test): Reset spent and hints
 *
 * Total: 18 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExerciseRewards } from '../useExerciseRewards';
import type { ExerciseHint } from '../../types/exercise.types';

describe('useExerciseRewards', () => {
  // ============================================================================
  // MOCK DATA
  // ============================================================================

  const mockHint1: ExerciseHint = {
    id: 'hint-1',
    text: 'Look at the first paragraph',
    ml_coins_cost: 10,
    order: 1,
  };

  const mockHint2: ExerciseHint = {
    id: 'hint-2',
    text: 'The answer is related to context',
    ml_coins_cost: 15,
    order: 2,
  };

  const mockExpensiveHint: ExerciseHint = {
    id: 'hint-expensive',
    text: 'Reveals the complete answer',
    ml_coins_cost: 50,
    order: 3,
  };

  // ============================================================================
  // HOOK INITIALIZATION TESTS
  // ============================================================================

  describe('Hook Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      expect(result.current.mlCoinsBalance).toBe(100);
      expect(result.current.mlCoinsSpent).toBe(0);
      expect(result.current.unlockedHints).toEqual([]);
      expect(typeof result.current.unlockHint).toBe('function');
      expect(typeof result.current.canAffordHint).toBe('function');
    });

    it('should accept onMLCoinsChange callback', () => {
      const onMLCoinsChange = vi.fn();

      const { result } = renderHook(() =>
        useExerciseRewards({
          initialMLCoins: 50,
          onMLCoinsChange,
        })
      );

      expect(result.current.mlCoinsBalance).toBe(50);
    });
  });

  // ============================================================================
  // HINT AFFORDABILITY TESTS
  // ============================================================================

  describe('Hint Affordability', () => {
    it('should return true when user can afford hint', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      expect(result.current.canAffordHint(mockHint1)).toBe(true);
      expect(result.current.canAffordHint(mockHint2)).toBe(true);
    });

    it('should return false when user cannot afford hint', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 5 })
      );

      expect(result.current.canAffordHint(mockHint1)).toBe(false);
      expect(result.current.canAffordHint(mockExpensiveHint)).toBe(false);
    });

    it('should return true when balance exactly matches hint cost', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 10 })
      );

      expect(result.current.canAffordHint(mockHint1)).toBe(true);
    });
  });

  // ============================================================================
  // UNLOCK HINTS TESTS
  // ============================================================================

  describe('Unlock Hints', () => {
    it('should unlock hint and deduct ML Coins', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      act(() => {
        const success = result.current.unlockHint(mockHint1);
        expect(success).toBe(true);
      });

      expect(result.current.mlCoinsBalance).toBe(90); // 100 - 10
      expect(result.current.mlCoinsSpent).toBe(10);
      expect(result.current.unlockedHints).toContain('hint-1');
    });

    it('should not unlock hint if insufficient funds', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 5 })
      );

      act(() => {
        const success = result.current.unlockHint(mockHint1);
        expect(success).toBe(false);
      });

      expect(result.current.mlCoinsBalance).toBe(5); // Unchanged
      expect(result.current.mlCoinsSpent).toBe(0);
      expect(result.current.unlockedHints).not.toContain('hint-1');
    });

    it('should not charge for already unlocked hint', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      // First unlock
      act(() => {
        result.current.unlockHint(mockHint1);
      });

      expect(result.current.mlCoinsBalance).toBe(90);

      // Try to unlock again
      act(() => {
        const success = result.current.unlockHint(mockHint1);
        expect(success).toBe(true); // Returns true but doesn't charge
      });

      expect(result.current.mlCoinsBalance).toBe(90); // Still 90
      expect(result.current.mlCoinsSpent).toBe(10); // Still 10
    });

    it('should unlock multiple hints and track spent coins', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      // Split into separate act() calls to allow state updates
      act(() => {
        result.current.unlockHint(mockHint1); // -10
      });

      act(() => {
        result.current.unlockHint(mockHint2); // -15
      });

      expect(result.current.mlCoinsBalance).toBe(75); // 100 - 10 - 15
      expect(result.current.mlCoinsSpent).toBe(25);
      expect(result.current.unlockedHints).toHaveLength(2);
      expect(result.current.isHintUnlocked('hint-1')).toBe(true);
      expect(result.current.isHintUnlocked('hint-2')).toBe(true);
    });
  });

  // ============================================================================
  // XP CALCULATIONS TESTS
  // ============================================================================

  describe('XP Calculations', () => {
    it('should calculate full XP for correct answer without hints', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      const xp = result.current.calculateXPEarned(100, true, 0);

      expect(xp).toBe(100);
    });

    it('should apply penalty for hints used', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      // 1 hint = 10% penalty
      const xpWith1Hint = result.current.calculateXPEarned(100, true, 1);
      expect(xpWith1Hint).toBe(90); // 100 * 0.9

      // 2 hints = 20% penalty
      const xpWith2Hints = result.current.calculateXPEarned(100, true, 2);
      expect(xpWith2Hints).toBe(80); // 100 * 0.8

      // 5 hints = 50% penalty (max)
      const xpWith5Hints = result.current.calculateXPEarned(100, true, 5);
      expect(xpWith5Hints).toBe(50); // 100 * 0.5 (max penalty)
    });

    it('should return 0 XP for incorrect answer', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      const xp = result.current.calculateXPEarned(100, false, 0);

      expect(xp).toBe(0);
    });
  });

  // ============================================================================
  // ML COINS CALCULATIONS TESTS
  // ============================================================================

  describe('ML Coins Calculations', () => {
    it('should calculate full ML Coins for correct answer without hints', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      const coins = result.current.calculateMLCoinsEarned(50, true, 0);

      expect(coins).toBe(50);
    });

    it('should apply penalty for hints used', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      // 1 hint = 5% penalty
      const coinsWith1Hint = result.current.calculateMLCoinsEarned(100, true, 1);
      expect(coinsWith1Hint).toBe(95); // 100 * 0.95

      // 2 hints = 10% penalty
      const coinsWith2Hints = result.current.calculateMLCoinsEarned(100, true, 2);
      expect(coinsWith2Hints).toBe(90); // 100 * 0.9

      // 6 hints = 30% penalty (max)
      const coinsWith6Hints = result.current.calculateMLCoinsEarned(100, true, 6);
      expect(coinsWith6Hints).toBe(70); // 100 * 0.7 (max penalty)
    });

    it('should return 0 ML Coins for incorrect answer', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      const coins = result.current.calculateMLCoinsEarned(50, false, 0);

      expect(coins).toBe(0);
    });
  });

  // ============================================================================
  // ADD ML COINS TESTS
  // ============================================================================

  describe('Add ML Coins', () => {
    it('should add ML Coins to balance', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      act(() => {
        result.current.addMLCoins(50);
      });

      expect(result.current.mlCoinsBalance).toBe(150);
    });

    it('should trigger onMLCoinsChange callback when adding coins', () => {
      const onMLCoinsChange = vi.fn();

      const { result } = renderHook(() =>
        useExerciseRewards({
          initialMLCoins: 100,
          onMLCoinsChange,
        })
      );

      act(() => {
        result.current.addMLCoins(30);
      });

      expect(onMLCoinsChange).toHaveBeenCalledWith(130);
      expect(onMLCoinsChange).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================================
  // RESET FUNCTIONALITY TESTS
  // ============================================================================

  describe('Reset Functionality', () => {
    it('should reset spent coins and unlocked hints', () => {
      const { result } = renderHook(() =>
        useExerciseRewards({ initialMLCoins: 100 })
      );

      // Unlock some hints (separate act() calls for state batching)
      act(() => {
        result.current.unlockHint(mockHint1);
      });

      act(() => {
        result.current.unlockHint(mockHint2);
      });

      expect(result.current.mlCoinsSpent).toBe(25);
      expect(result.current.unlockedHints).toHaveLength(2);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.mlCoinsSpent).toBe(0);
      expect(result.current.unlockedHints).toHaveLength(0);
      // Balance should not reset (only spent and hints)
      expect(result.current.mlCoinsBalance).toBe(75); // Remains at 75
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete exercise flow with hints', () => {
      const onMLCoinsChange = vi.fn();

      const { result } = renderHook(() =>
        useExerciseRewards({
          initialMLCoins: 100,
          onMLCoinsChange,
        })
      );

      // Start: 100 ML Coins
      expect(result.current.mlCoinsBalance).toBe(100);

      // Unlock 2 hints (separate act() calls for state batching)
      act(() => {
        result.current.unlockHint(mockHint1); // -10
      });

      act(() => {
        result.current.unlockHint(mockHint2); // -15
      });

      expect(result.current.mlCoinsBalance).toBe(75);
      expect(result.current.mlCoinsSpent).toBe(25);

      // Calculate rewards (correct answer with 2 hints)
      const xpEarned = result.current.calculateXPEarned(100, true, 2);
      const coinsEarned = result.current.calculateMLCoinsEarned(50, true, 2);

      expect(xpEarned).toBe(80); // 20% penalty
      expect(coinsEarned).toBe(45); // 10% penalty

      // Add earned coins
      act(() => {
        result.current.addMLCoins(coinsEarned);
      });

      expect(result.current.mlCoinsBalance).toBe(120); // 75 + 45

      // Verify callbacks
      expect(onMLCoinsChange).toHaveBeenCalledTimes(3); // 2 unlocks + 1 add
    });
  });
});
