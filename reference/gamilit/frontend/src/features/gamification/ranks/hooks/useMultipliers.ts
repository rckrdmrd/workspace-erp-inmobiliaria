/**
 * useMultipliers Hook
 *
 * Custom hook for accessing and managing XP/ML Coins multipliers.
 */

import { useMemo } from 'react';
import { useRanksStore, selectMultiplierBreakdown } from '../store/ranksStore';
import type { MultiplierSource, MultiplierSourceType } from '../types/ranksTypes';

/**
 * Hook return type
 */
interface UseMultipliersReturn {
  // Current multiplier state
  totalMultiplier: number;
  baseMultiplier: number;
  rankMultiplier: MultiplierSource;
  allSources: MultiplierSource[];

  // Breakdown by type
  permanentMultipliers: MultiplierSource[];
  temporaryMultipliers: MultiplierSource[];

  // Expiration warnings
  hasExpiringSoon: boolean;
  expiringSoon: MultiplierSource[];

  // Actions
  addMultiplierSource: (source: MultiplierSource) => void;
  removeMultiplierSource: (type: string) => void;
  updateMultipliers: () => void;

  // Utilities
  getSourceByType: (type: MultiplierSourceType) => MultiplierSource | undefined;
  calculateBonusXP: (baseXP: number) => number;
  calculateBonusMLCoins: (baseCoins: number) => number;
  getMultiplierPercentage: () => string;
}

/**
 * Custom hook to manage multipliers
 */
export function useMultipliers(): UseMultipliersReturn {
  const multiplierBreakdown = useRanksStore(selectMultiplierBreakdown);
  const addMultiplierSource = useRanksStore(state => state.addMultiplierSource);
  const removeMultiplierSource = useRanksStore(state => state.removeMultiplierSource);
  const updateMultipliers = useRanksStore(state => state.updateMultipliers);

  // Separate permanent and temporary multipliers
  const permanentMultipliers = useMemo(
    () => multiplierBreakdown.sources.filter(s => s.isPermanent),
    [multiplierBreakdown.sources]
  );

  const temporaryMultipliers = useMemo(
    () => multiplierBreakdown.sources.filter(s => !s.isPermanent),
    [multiplierBreakdown.sources]
  );

  /**
   * Get multiplier source by type
   */
  const getSourceByType = (type: MultiplierSourceType): MultiplierSource | undefined => {
    return multiplierBreakdown.sources.find(s => s.type === type);
  };

  /**
   * Calculate bonus XP with multiplier applied
   */
  const calculateBonusXP = (baseXP: number): number => {
    return Math.floor(baseXP * multiplierBreakdown.total);
  };

  /**
   * Calculate bonus ML Coins with multiplier applied
   */
  const calculateBonusMLCoins = (baseCoins: number): number => {
    return Math.floor(baseCoins * multiplierBreakdown.total);
  };

  /**
   * Get multiplier as percentage string (e.g., "+125%")
   */
  const getMultiplierPercentage = (): string => {
    const percentage = ((multiplierBreakdown.total - 1) * 100).toFixed(0);
    return `+${percentage}%`;
  };

  return {
    // Current state
    totalMultiplier: multiplierBreakdown.total,
    baseMultiplier: multiplierBreakdown.base,
    rankMultiplier: multiplierBreakdown.rank,
    allSources: multiplierBreakdown.sources,

    // Breakdown
    permanentMultipliers,
    temporaryMultipliers,

    // Expiration warnings
    hasExpiringSoon: multiplierBreakdown.hasExpiringSoon,
    expiringSoon: multiplierBreakdown.expiringSoon,

    // Actions
    addMultiplierSource,
    removeMultiplierSource,
    updateMultipliers,

    // Utilities
    getSourceByType,
    calculateBonusXP,
    calculateBonusMLCoins,
    getMultiplierPercentage,
  };
}
