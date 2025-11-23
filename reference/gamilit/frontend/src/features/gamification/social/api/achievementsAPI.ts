/**
 * Achievements API
 *
 * Dedicated API client for achievements system.
 * Provides type-safe methods for interacting with backend achievements endpoints.
 *
 * Backend Routes:
 * - GET /api/gamification/achievements - List all achievements
 * - GET /api/gamification/achievements/:userId - Get user's achievements
 * - POST /api/gamification/achievements/unlock - Unlock achievement
 * - PUT /api/gamification/achievements/user/:userId/progress/:achievementId - Update progress
 * - POST /api/gamification/achievements/user/:userId/check - Check achievements
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';
import type { Achievement } from '../types/achievementsTypes';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Backend Achievement Response
 * Maps from backend schema to frontend types
 */
export interface BackendAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  mlCoinsReward: number;
  xpReward: number;
  isRepeatable: boolean;
  conditions: {
    type: string;
    requirements: Record<string, any>;
  };
  rewards: {
    xp: number;
    ml_coins: number;
  };
}

/**
 * Backend User Achievement Response
 */
export interface BackendUserAchievement {
  achievementId: string;
  userId: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completionPercentage: number;
  completedAt?: string;
  unlockedAt?: string;
  rewardsClaimed: boolean;
}

/**
 * Combined Achievement with User Progress
 */
export interface AchievementWithProgress extends BackendAchievement {
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
  completionPercentage?: number;
}

// ============================================================================
// API METHODS
// ============================================================================

/**
 * Get all available achievements
 *
 * @returns List of all achievements
 */
export const getAllAchievements = async (): Promise<BackendAchievement[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<{ achievements: BackendAchievement[]; total: number }>>(
      API_ENDPOINTS.achievements.list
    );

    return data.data.achievements;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's achievements with progress
 *
 * @param userId - User ID
 * @returns List of user's achievements with unlock status and progress
 */
export const getUserAchievements = async (userId: string): Promise<AchievementWithProgress[]> => {
  try {
    // Get all achievements
    const allAchievements = await getAllAchievements();

    // Get user's achievement progress
    const { data } = await apiClient.get<ApiResponse<{ achievements: BackendUserAchievement[]; total: number }>>(
      `/gamification/users/${userId}/achievements`
    );

    const userAchievements = data.data.achievements;

    // Merge achievements with user progress
    const achievementsWithProgress: AchievementWithProgress[] = allAchievements.map((achievement) => {
      const userProgress = userAchievements.find((ua) => ua.achievementId === achievement.id);

      return {
        ...achievement,
        isUnlocked: userProgress?.isCompleted || false,
        unlockedAt: userProgress?.completedAt ? new Date(userProgress.completedAt) : undefined,
        progress: userProgress
          ? {
              current: userProgress.progress,
              required: userProgress.maxProgress,
            }
          : undefined,
        completionPercentage: userProgress?.completionPercentage,
      };
    });

    return achievementsWithProgress;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get single achievement by ID
 *
 * @param achievementId - Achievement ID
 * @returns Achievement data
 */
export const getAchievementById = async (achievementId: string): Promise<BackendAchievement> => {
  try {
    const { data } = await apiClient.get<ApiResponse<BackendAchievement>>(
      API_ENDPOINTS.achievements.get(achievementId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get achievement progress for specific user and achievement
 *
 * @param userId - User ID
 * @param achievementId - Achievement ID
 * @returns Achievement progress data
 */
export const getAchievementProgress = async (
  userId: string,
  achievementId: string
): Promise<BackendUserAchievement> => {
  try {
    const { data } = await apiClient.get<ApiResponse<BackendUserAchievement>>(
      `/gamification/achievements/user/${userId}/progress/${achievementId}`
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Update achievement progress
 *
 * @param userId - User ID
 * @param achievementId - Achievement ID
 * @param increment - Progress increment amount
 * @returns Updated progress data
 */
export const updateAchievementProgress = async (
  userId: string,
  achievementId: string,
  increment: number
): Promise<BackendUserAchievement> => {
  try {
    const { data } = await apiClient.put<ApiResponse<BackendUserAchievement>>(
      `/gamification/achievements/user/${userId}/progress/${achievementId}`,
      { increment }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Manually unlock an achievement (admin only)
 *
 * @param userId - User ID
 * @param achievementId - Achievement ID
 * @returns Unlocked achievement
 */
export const unlockAchievement = async (
  userId: string,
  achievementId: string
): Promise<BackendAchievement> => {
  try {
    const { data } = await apiClient.post<ApiResponse<BackendAchievement>>(
      `/gamification/achievements/user/${userId}/unlock/${achievementId}`
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Check and unlock achievements based on user stats
 *
 * @param userId - User ID
 * @param conditionType - Type of condition to check (e.g., 'exercise_completed')
 * @param currentValue - Current value to check against
 * @returns List of newly unlocked achievements
 */
export const checkAchievements = async (
  userId: string,
  conditionType: string,
  currentValue: number
): Promise<BackendAchievement[]> => {
  try {
    const { data } = await apiClient.post<
      ApiResponse<{ unlockedAchievements: BackendAchievement[]; count: number }>
    >(`/gamification/achievements/user/${userId}/check`, {
      conditionType,
      currentValue,
    });

    return data.data.unlockedAchievements;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map backend category to frontend category
 *
 * @param backendCategory - Backend category name
 * @returns Frontend category type
 */
const mapCategory = (backendCategory: string): 'progress' | 'mastery' | 'social' | 'hidden' => {
  const categoryMap: Record<string, 'progress' | 'mastery' | 'social' | 'hidden'> = {
    educational: 'progress',
    progress: 'progress',
    mastery: 'mastery',
    skill: 'mastery',
    social: 'social',
    hidden: 'hidden',
    special: 'hidden',
    collection: 'mastery',
    missions: 'progress',
  };

  return categoryMap[backendCategory.toLowerCase()] || 'progress';
};

/**
 * Map backend achievement to frontend Achievement type
 *
 * @param backendAchievement - Backend achievement data
 * @param userProgress - Optional user progress data
 * @returns Frontend Achievement object
 */
export const mapToFrontendAchievement = (
  backendAchievement: BackendAchievement,
  userProgress?: BackendUserAchievement
): Achievement => {
  return {
    id: backendAchievement.id,
    title: backendAchievement.name,
    description: backendAchievement.description,
    category: mapCategory(backendAchievement.category),
    rarity: backendAchievement.rarity,
    icon: backendAchievement.icon,
    mlCoinsReward: backendAchievement.rewards.ml_coins,
    xpReward: backendAchievement.rewards.xp,
    isUnlocked: userProgress?.isCompleted || false,
    unlockedAt: userProgress?.completedAt ? new Date(userProgress.completedAt) : undefined,
    progress: userProgress
      ? {
          current: userProgress.progress,
          required: userProgress.maxProgress,
        }
      : undefined,
    requirements: backendAchievement.conditions.requirements,
    isHidden: backendAchievement.category.toLowerCase() === 'hidden' || backendAchievement.category.toLowerCase() === 'special',
  };
};

/**
 * Map array of backend achievements to frontend format
 *
 * @param backendAchievements - Array of backend achievements
 * @param userAchievements - Optional array of user progress data
 * @returns Array of frontend Achievement objects
 */
export const mapAchievementsToFrontend = (
  backendAchievements: BackendAchievement[],
  userAchievements?: BackendUserAchievement[]
): Achievement[] => {
  return backendAchievements.map((achievement) => {
    const userProgress = userAchievements?.find((ua) => ua.achievementId === achievement.id);
    return mapToFrontendAchievement(achievement, userProgress);
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getAllAchievements,
  getUserAchievements,
  getAchievementById,
  getAchievementProgress,
  updateAchievementProgress,
  unlockAchievement,
  checkAchievements,
  mapToFrontendAchievement,
  mapAchievementsToFrontend,
};
