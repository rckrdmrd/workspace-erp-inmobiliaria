/**
 * useProgression Hook
 *
 * Custom hook for managing XP progression, leveling, and rank ups.
 */

import { useCallback, useMemo } from 'react';
import { useRanksStore } from '../store/ranksStore';
import type { XPSource, ProgressionHistoryEntry } from '../types/ranksTypes';

/**
 * Hook return type
 */
interface UseProgressionReturn {
  // Current progression state
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  currentLevel: number;
  levelProgress: number; // 0-100 percentage

  // ML Coins
  mlCoinsEarned: number;

  // Activity
  activityStreak: number;
  lastActivityDate: Date;

  // Actions
  addXP: (amount: number, source: XPSource, description?: string) => Promise<void>;
  checkLevelUp: () => boolean;
  checkRankUp: () => boolean;

  // History
  progressionHistory: ProgressionHistoryEntry[];
  getRecentHistory: (limit: number) => ProgressionHistoryEntry[];

  // UI state
  isRankingUp: boolean;
  showRankUpModal: boolean;
  closeRankUpModal: () => void;

  // Utilities
  canLevelUp: boolean;
  canRankUp: boolean;

  // User progress data from store
  userProgress?: any; // Type depends on store definition
}

/**
 * Custom hook to manage progression
 */
export function useProgression(): UseProgressionReturn {
  const userProgress = useRanksStore(state => state.userProgress);
  const progressionHistory = useRanksStore(state => state.progressionHistory);
  const isRankingUp = useRanksStore(state => state.isRankingUp);
  const showRankUpModal = useRanksStore(state => state.showRankUpModal);

  const addXP = useRanksStore(state => state.addXP);
  const checkLevelUp = useRanksStore(state => state.checkLevelUp);
  const checkRankUp = useRanksStore(state => state.checkRankUp);
  const closeRankUpModal = useRanksStore(state => state.closeRankUpModal);
  const getRecentHistory = useRanksStore(state => state.getRecentHistory);

  // Calculate level progress percentage
  const levelProgress = useMemo(() => {
    const progress = (userProgress.currentXP / userProgress.xpToNextLevel) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [userProgress.currentXP, userProgress.xpToNextLevel]);

  // Memoized values
  const canLevelUp = useMemo(() => checkLevelUp(), [checkLevelUp]);
  const canRankUp = useMemo(() => userProgress.canRankUp, [userProgress.canRankUp]);

  return {
    // Progression state
    currentXP: userProgress.currentXP,
    xpToNextLevel: userProgress.xpToNextLevel,
    totalXP: userProgress.totalXP,
    currentLevel: userProgress.currentLevel,
    levelProgress,

    // ML Coins
    mlCoinsEarned: userProgress.mlCoinsEarned,

    // Activity
    activityStreak: userProgress.activityStreak,
    lastActivityDate: userProgress.lastActivityDate,

    // Actions
    addXP,
    checkLevelUp,
    checkRankUp,

    // History
    progressionHistory,
    getRecentHistory,

    // UI state
    isRankingUp,
    showRankUpModal,
    closeRankUpModal,

    // Utilities
    canLevelUp,
    canRankUp,
  };
}
