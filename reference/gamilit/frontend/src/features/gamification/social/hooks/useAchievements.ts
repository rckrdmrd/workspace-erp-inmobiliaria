/**
 * useAchievements Hook
 * Custom hook for achievement operations
 *
 * Usage:
 * - Call useAchievements(userId) to fetch achievements for a specific user
 * - Returns achievement data and helper functions
 */

import { useEffect } from 'react';
import { useAchievementsStore } from '../store/achievementsStore';
import type { Achievement } from '../types/achievementsTypes';

interface UseAchievementsOptions {
  userId?: string;
  autoFetch?: boolean;
}

export const useAchievements = (options?: UseAchievementsOptions) => {
  const { userId, autoFetch = false } = options || {};
  const {
    achievements,
    unlockedAchievements,
    recentUnlocks,
    stats,
    selectedCategory,
    isLoading,
    error,
    unlockAchievement,
    updateProgress,
    dismissNotification,
    filterByCategory,
    refreshAchievements,
    fetchAchievements,
  } = useAchievementsStore();

  // Auto-fetch achievements when userId is provided and autoFetch is true
  useEffect(() => {
    if (userId && autoFetch) {
      fetchAchievements(userId);
    }
  }, [userId, autoFetch, fetchAchievements]);

  const getAchievementsByCategory = (category: string): Achievement[] => {
    return achievements.filter((a) => a.category === category);
  };

  const getFilteredAchievements = (): Achievement[] => {
    if (!selectedCategory) return achievements;
    return achievements.filter((a) => a.category === selectedCategory);
  };

  const getAchievementsByRarity = (rarity: string): Achievement[] => {
    return achievements.filter((a) => a.rarity === rarity);
  };

  const getLockedAchievements = (): Achievement[] => {
    return achievements.filter((a) => !a.isUnlocked);
  };

  const getProgressPercentage = (): number => {
    if (stats.totalAchievements === 0) return 0;
    return Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100);
  };

  return {
    // State
    achievements,
    unlockedAchievements,
    recentUnlocks,
    stats,
    selectedCategory,
    isLoading,
    error,

    // Actions
    unlockAchievement,
    updateProgress,
    dismissNotification,
    filterByCategory,
    refreshAchievements,
    fetchAchievements,

    // Helpers
    getAchievementsByCategory,
    getFilteredAchievements,
    getAchievementsByRarity,
    getLockedAchievements,
    getProgressPercentage,
  };
};
