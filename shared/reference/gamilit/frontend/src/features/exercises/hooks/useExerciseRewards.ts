/**
 * useExerciseRewards Hook
 *
 * ISSUE: #4 (P0) - Exercise Interfaces
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 *
 * Hook for managing exercise rewards (XP, ML Coins, hints)
 */

import { useState, useCallback } from 'react';
import type { ExerciseHint } from '../types/exercise.types';

interface UseExerciseRewardsOptions {
  initialMLCoins: number;
  onMLCoinsChange?: (newBalance: number) => void;
}

export const useExerciseRewards = (options: UseExerciseRewardsOptions) => {
  const [mlCoinsBalance, setMLCoinsBalance] = useState(options.initialMLCoins);
  const [mlCoinsSpent, setMLCoinsSpent] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState<Set<string>>(new Set());

  /**
   * Check if user can afford a hint
   */
  const canAffordHint = useCallback(
    (hint: ExerciseHint): boolean => {
      return mlCoinsBalance >= hint.ml_coins_cost;
    },
    [mlCoinsBalance]
  );

  /**
   * Unlock a hint by spending ML Coins
   */
  const unlockHint = useCallback(
    (hint: ExerciseHint): boolean => {
      if (!canAffordHint(hint)) {
        return false;
      }

      if (unlockedHints.has(hint.id)) {
        return true; // Already unlocked
      }

      const newBalance = mlCoinsBalance - hint.ml_coins_cost;
      setMLCoinsBalance(newBalance);
      setMLCoinsSpent((prev) => prev + hint.ml_coins_cost);
      setUnlockedHints((prev) => new Set([...prev, hint.id]));
      options.onMLCoinsChange?.(newBalance);

      return true;
    },
    [mlCoinsBalance, unlockedHints, canAffordHint, options]
  );

  /**
   * Check if a hint is unlocked
   */
  const isHintUnlocked = useCallback(
    (hintId: string): boolean => {
      return unlockedHints.has(hintId);
    },
    [unlockedHints]
  );

  /**
   * Calculate XP earned with multipliers
   */
  const calculateXPEarned = useCallback(
    (baseXP: number, isCorrect: boolean, hintsUsedCount: number): number => {
      if (!isCorrect) {
        return 0;
      }

      let xp = baseXP;

      // Penalty for using hints (10% per hint)
      const hintPenalty = hintsUsedCount * 0.1;
      xp = Math.floor(xp * (1 - Math.min(hintPenalty, 0.5))); // Max 50% penalty

      return Math.max(0, xp);
    },
    []
  );

  /**
   * Calculate ML Coins earned
   */
  const calculateMLCoinsEarned = useCallback(
    (baseMLCoins: number, isCorrect: boolean, hintsUsedCount: number): number => {
      if (!isCorrect) {
        return 0;
      }

      let coins = baseMLCoins;

      // Penalty for using hints (5% per hint)
      const hintPenalty = hintsUsedCount * 0.05;
      coins = Math.floor(coins * (1 - Math.min(hintPenalty, 0.3))); // Max 30% penalty

      return Math.max(0, coins);
    },
    []
  );

  /**
   * Add ML Coins (from rewards)
   */
  const addMLCoins = useCallback(
    (amount: number) => {
      const newBalance = mlCoinsBalance + amount;
      setMLCoinsBalance(newBalance);
      options.onMLCoinsChange?.(newBalance);
    },
    [mlCoinsBalance, options]
  );

  /**
   * Reset rewards state
   */
  const reset = useCallback(() => {
    setMLCoinsSpent(0);
    setUnlockedHints(new Set());
  }, []);

  return {
    mlCoinsBalance,
    mlCoinsSpent,
    unlockedHints: Array.from(unlockedHints),
    canAffordHint,
    unlockHint,
    isHintUnlocked,
    calculateXPEarned,
    calculateMLCoinsEarned,
    addMLCoins,
    reset,
  };
};
