/**
 * useRank Hook
 *
 * Custom hook for accessing current rank information and rank-related utilities.
 */

import { useMemo } from 'react';
import { useRanksStore, selectUserProgress, selectCurrentRank } from '../store/ranksStore';
import { getRankById, getNextRank, getPreviousRank } from '../mockData/ranksMockData';
import type { RankDefinition, RankComparison } from '../types/ranksTypes';

/**
 * Hook return type
 */
interface UseRankReturn {
  // Current rank data
  currentRank: RankDefinition;
  currentRankId: string;
  currentLevel: number;
  prestigeLevel: number;

  // Rank progression
  nextRank: RankDefinition | null;
  previousRank: RankDefinition | null;
  canRankUp: boolean;
  progress: number; // 0-100 percentage

  // Rank comparison
  compareToNext: () => RankComparison | null;
  compareToRank: (targetRank: string) => RankComparison | null;

  // Utilities
  isMaxRank: boolean;
  isMinRank: boolean;
  rankOrder: number;
}

/**
 * Custom hook to access rank information
 */
export function useRank(): UseRankReturn {
  const userProgress = useRanksStore(selectUserProgress);
  const currentRankId = useRanksStore(selectCurrentRank);

  const currentRank = useMemo(
    () => getRankById(currentRankId),
    [currentRankId]
  );

  const nextRank = useMemo(
    () => getNextRank(currentRankId),
    [currentRankId]
  );

  const previousRank = useMemo(
    () => getPreviousRank(currentRankId),
    [currentRankId]
  );

  const isMaxRank = useMemo(
    () => currentRankId === "K'uk'ulkan",
    [currentRankId]
  );

  const isMinRank = useMemo(
    () => currentRankId === 'Nacom',
    [currentRankId]
  );

  // Calculate progress to next rank (based on ML Coins)
  const progress = useMemo(() => {
    if (!nextRank) return 100; // Max rank
    const coinsNeeded = nextRank.mlCoinsRequired - currentRank.mlCoinsRequired;
    const coinsEarned = userProgress.mlCoinsEarned - currentRank.mlCoinsRequired;
    return Math.min(100, Math.max(0, (coinsEarned / coinsNeeded) * 100));
  }, [userProgress.mlCoinsEarned, currentRank, nextRank]);

  /**
   * Compare current rank to next rank
   */
  const compareToNext = (): RankComparison | null => {
    if (!nextRank) return null;

    const mlCoinsDifference = nextRank.mlCoinsRequired - userProgress.mlCoinsEarned;
    const multiplierIncrease = nextRank.multiplier - currentRank.multiplier;

    // Find new benefits (not in current rank)
    const newBenefits = nextRank.benefits.filter(
      benefit => !currentRank.benefits.includes(benefit)
    );

    return {
      current: currentRank,
      target: nextRank,
      xpDifference: 0, // Will be calculated by backend
      mlCoinsDifference: Math.max(0, mlCoinsDifference),
      multiplierIncrease,
      newBenefits,
    };
  };

  /**
   * Compare current rank to a specific target rank
   */
  const compareToRank = (targetRankId: string): RankComparison | null => {
    try {
      const targetRank = getRankById(targetRankId as never);
      if (!targetRank) return null;

      const mlCoinsDifference = targetRank.mlCoinsRequired - userProgress.mlCoinsEarned;
      const multiplierIncrease = targetRank.multiplier - currentRank.multiplier;

      // Find new benefits
      const newBenefits = targetRank.benefits.filter(
        benefit => !currentRank.benefits.includes(benefit)
      );

      return {
        current: currentRank,
        target: targetRank,
        xpDifference: 0,
        mlCoinsDifference: Math.max(0, mlCoinsDifference),
        multiplierIncrease,
        newBenefits,
      };
    } catch {
      return null;
    }
  };

  return {
    currentRank,
    currentRankId,
    currentLevel: userProgress.currentLevel,
    prestigeLevel: userProgress.prestigeLevel,
    nextRank,
    previousRank,
    canRankUp: userProgress.canRankUp,
    progress,
    compareToNext,
    compareToRank,
    isMaxRank,
    isMinRank,
    rankOrder: currentRank.order,
  };
}
