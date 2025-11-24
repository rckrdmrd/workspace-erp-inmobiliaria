/**
 * Achievements Store
 * Zustand store for managing achievement state
 */

import { create } from 'zustand';
import type { Achievement, AchievementUnlockNotification, AchievementStats } from '../types/achievementsTypes';
import { allAchievements } from '../mockData/achievementsMockData';
import {
  getUserAchievements,
  mapAchievementsToFrontend,
  updateAchievementProgress as apiUpdateProgress,
  checkAchievements as apiCheckAchievements
} from '../api/achievementsAPI';

interface AchievementsStore {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  recentUnlocks: AchievementUnlockNotification[];
  stats: AchievementStats;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (achievementId: string, current: number) => void;
  dismissNotification: (achievementId: string) => void;
  filterByCategory: (category: string | null) => void;
  refreshAchievements: () => void;

  // API Sync
  fetchAchievements: (userId: string) => Promise<void>;
}

const calculateStats = (achievements: Achievement[]): AchievementStats => {
  const unlocked = achievements.filter((a) => a.isUnlocked);
  const progressAchievements = unlocked.filter((a) => a.category === 'progress');
  const masteryAchievements = unlocked.filter((a) => a.category === 'mastery');
  const socialAchievements = unlocked.filter((a) => a.category === 'social');
  const hiddenAchievements = unlocked.filter((a) => a.category === 'hidden');

  return {
    totalAchievements: achievements.length,
    unlockedAchievements: unlocked.length,
    progressAchievements: progressAchievements.length,
    masteryAchievements: masteryAchievements.length,
    socialAchievements: socialAchievements.length,
    hiddenAchievements: hiddenAchievements.length,
    totalMlCoinsEarned: unlocked.reduce((sum, a) => sum + a.mlCoinsReward, 0),
    totalXpEarned: unlocked.reduce((sum, a) => sum + a.xpReward, 0),
  };
};

export const useAchievementsStore = create<AchievementsStore>((set) => ({
  achievements: allAchievements,
  unlockedAchievements: allAchievements.filter((a) => a.isUnlocked),
  recentUnlocks: [],
  stats: calculateStats(allAchievements),
  selectedCategory: null,
  isLoading: false,
  error: null,

  unlockAchievement: (achievementId: string) => {
    set((state) => {
      const achievement = state.achievements.find((a) => a.id === achievementId);
      if (!achievement || achievement.isUnlocked) return state;

      const updatedAchievement: Achievement = {
        ...achievement,
        isUnlocked: true,
        unlockedAt: new Date(),
      };

      const updatedAchievements = state.achievements.map((a) =>
        a.id === achievementId ? updatedAchievement : a
      );

      const notification: AchievementUnlockNotification = {
        achievement: updatedAchievement,
        timestamp: new Date(),
        showConfetti: updatedAchievement.rarity === 'epic' || updatedAchievement.rarity === 'legendary',
      };

      return {
        achievements: updatedAchievements,
        unlockedAchievements: updatedAchievements.filter((a) => a.isUnlocked),
        recentUnlocks: [notification, ...state.recentUnlocks],
        stats: calculateStats(updatedAchievements),
      };
    });
  },

  updateProgress: (achievementId: string, current: number) => {
    set((state) => {
      const updatedAchievements = state.achievements.map((a) => {
        if (a.id === achievementId && a.progress) {
          const newProgress = { ...a.progress, current };

          // Auto-unlock if progress complete
          if (newProgress.current >= newProgress.required && !a.isUnlocked) {
            return {
              ...a,
              progress: newProgress,
              isUnlocked: true,
              unlockedAt: new Date(),
            };
          }

          return { ...a, progress: newProgress };
        }
        return a;
      });

      return {
        achievements: updatedAchievements,
        unlockedAchievements: updatedAchievements.filter((a) => a.isUnlocked),
        stats: calculateStats(updatedAchievements),
      };
    });
  },

  dismissNotification: (achievementId: string) => {
    set((state) => ({
      recentUnlocks: state.recentUnlocks.filter((n) => n.achievement.id !== achievementId),
    }));
  },

  filterByCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  refreshAchievements: () => {
    set((state) => ({
      stats: calculateStats(state.achievements),
    }));
  },

  /**
   * Fetch achievements from backend for specific user
   * @param userId - User ID to fetch achievements for
   */
  fetchAchievements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch user achievements with progress from backend
      const achievementsWithProgress = await getUserAchievements(userId);

      // Map to frontend Achievement type
      const achievements = mapAchievementsToFrontend(achievementsWithProgress);

      set({
        achievements,
        unlockedAchievements: achievements.filter((a) => a.isUnlocked),
        stats: calculateStats(achievements),
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch achievements';
      set({
        isLoading: false,
        error: errorMessage
      });
      console.error('Error fetching achievements:', error);

      // Fallback to mock data if API fails (development mode)
      if (import.meta.env.DEV) {
        console.warn('Using mock data as fallback');
        set({
          achievements: allAchievements,
          unlockedAchievements: allAchievements.filter((a) => a.isUnlocked),
          stats: calculateStats(allAchievements),
          isLoading: false,
        });
      }
    }
  },
}));
