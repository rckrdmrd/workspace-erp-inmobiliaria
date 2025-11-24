/**
 * Gamification API
 *
 * Comprehensive API client for all gamification endpoints.
 * Consolidates user stats, ranks, missions, achievements, powerups, coins, and leaderboards.
 *
 * This file serves as the main API integration layer for the gamification system,
 * connecting the frontend with backend endpoints defined in:
 * - /modules/gamification/gamification.routes.ts (legacy stats, achievements)
 * - /modules/gamification/ranks.controller.ts (Maya ranks system)
 * - /modules/gamification/coins.controller.ts (ML coins economy)
 * - /modules/gamification/powerups.controller.ts (power-ups system)
 * - /modules/gamification/missions/missions.routes.ts (missions system)
 * - /modules/gamification/leaderboard.controller.ts (leaderboards)
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse, PaginatedResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User gamification statistics
 */
export interface UserStats {
  userId: string;
  totalXP: number;
  currentLevel: number;
  mlCoins: number;
  mlCoinsLifetime: number;
  currentStreak: number;
  maxStreak: number;
  exercisesCompleted: number;
  achievementsUnlocked: number;
  currentRank: string;
  rankMultiplier: number;
  lastActive: Date;
}

/**
 * User rank information (Maya ranks system)
 */
export interface UserRank {
  userId: string;
  currentRank: string;
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  multiplier: number;
  rankProgress: number;
  nextRank: string | null;
  canPromote: boolean;
  benefits: string[];
}

/**
 * Rank history entry
 */
export interface RankHistoryEntry {
  id: string;
  userId: string;
  previousRank: string;
  newRank: string;
  promotedAt: Date;
  xpAtPromotion: number;
  levelAtPromotion: number;
}

/**
 * User mission
 */
export interface UserMission {
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'special';
  category: 'exercises' | 'modules' | 'score' | 'streak' | 'achievements' | 'social' | 'coins' | 'xp';
  title: string;
  description: string;
  objective: {
    type: string;
    target: number;
    current: number;
  };
  rewards: {
    mlCoins: number;
    xp: number;
    items?: string[];
  };
  status: 'active' | 'completed' | 'claimed' | 'expired';
  progress: number;
  expiresAt: Date;
  createdAt: Date;
  completedAt?: Date;
  claimedAt?: Date;
}

/**
 * Mission statistics
 */
export interface MissionStats {
  userId: string;
  totalCompleted: number;
  dailyCompleted: number;
  weeklyCompleted: number;
  specialCompleted: number;
  totalRewardsClaimed: {
    mlCoins: number;
    xp: number;
  };
  currentStreak: number;
  bestStreak: number;
}

/**
 * Achievement
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'progress' | 'mastery' | 'social' | 'hidden';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  mlCoinsReward: number;
  xpReward: number;
  requirements?: Record<string, any>;
  // Optional rewards object (may vary by context)
  rewards?: {
    mlCoins?: number;
    xp?: number;
    items?: string[];
  };
}

/**
 * User achievement
 */
export interface UserAchievement extends Achievement {
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

/**
 * Unlock achievement request
 */
export interface UnlockAchievementRequest {
  userId: string;
  achievementId: string;
  progress?: number;
}

/**
 * Coin transaction
 */
export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  transactionType: string;
  reason: string;
  referenceId?: string;
  referenceType?: string;
  balanceAfter: number;
  multiplier?: number;
  createdAt: Date;
}

/**
 * Coin balance
 */
export interface CoinBalance {
  userId: string;
  currentBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  pendingBalance: number;
}

/**
 * Earning statistics
 */
export interface EarningStats {
  userId: string;
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  topSources: Array<{
    source: string;
    amount: number;
    count: number;
  }>;
  earningsByPeriod: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  fullName: string;
  avatar: string | null;
  mayaRank: string | null;
  score: number;
  mlCoins?: number;
  totalXP?: number;
  currentStreak?: number;
  change?: number;
  isCurrentUser?: boolean;
}

/**
 * Leaderboard response
 */
export interface LeaderboardResponse {
  type: string;
  entries: LeaderboardEntry[];
  userPosition?: number;
  totalParticipants: number;
  lastUpdated: Date;
}

/**
 * User position in leaderboards
 */
export interface UserLeaderboardPosition {
  userId: string;
  globalRank: number | null;
  schoolRank: number | null;
  classroomRank: number | null;
  weeklyRank: number | null;
  coinsRank: number | null;
  totalParticipants: {
    global: number;
    school?: number;
    classroom?: number;
    weekly: number;
    coins: number;
  };
}

/**
 * Leaderboard filters
 */
export interface LeaderboardFilters {
  limit?: number;
  offset?: number;
  schoolId?: string;
  classroomId?: string;
  timeRange?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

// ============================================================================
// USER STATS API
// ============================================================================

/**
 * Get user gamification statistics
 *
 * @param userId - User ID
 * @returns User statistics
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const { data } = await apiClient.get<ApiResponse<UserStats>>(
      `/gamification/stats/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// RANKS API
// ============================================================================

/**
 * Get user's current rank and progress
 *
 * @param userId - User ID
 * @returns User rank information
 */
export const getUserRank = async (userId: string): Promise<UserRank> => {
  try {
    const { data } = await apiClient.get<ApiResponse<UserRank>>(
      `/gamification/ranks/user/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get all available Maya ranks with requirements
 *
 * @returns List of all ranks
 */
export const getAllRanks = async (): Promise<any[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<any[]>>(
      '/gamification/ranks'
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's rank progression history
 *
 * @param userId - User ID
 * @returns Rank history entries
 */
export const getRankHistory = async (userId: string): Promise<RankHistoryEntry[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<RankHistoryEntry[]>>(
      `/gamification/ranks/history/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's current coin multiplier
 *
 * @param userId - User ID
 * @returns Multiplier value
 */
export const getUserMultiplier = async (userId: string): Promise<{ multiplier: number }> => {
  try {
    const { data } = await apiClient.get<ApiResponse<{ multiplier: number }>>(
      `/gamification/ranks/multiplier/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Check if user can be promoted to next rank
 *
 * @param userId - User ID
 * @returns Promotion eligibility
 */
export const checkPromotion = async (userId: string): Promise<{ canPromote: boolean; reason?: string }> => {
  try {
    const { data } = await apiClient.post<ApiResponse<{ canPromote: boolean; reason?: string }>>(
      `/gamification/ranks/check-promotion/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Promote user to next rank
 *
 * @param userId - User ID
 * @returns Updated rank information
 */
export const promoteUser = async (userId: string): Promise<UserRank> => {
  try {
    const { data } = await apiClient.post<ApiResponse<UserRank>>(
      `/gamification/ranks/promote/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// MISSIONS API
// ============================================================================

/**
 * Get user's daily missions (3 missions, auto-generates if needed)
 *
 * @returns Daily missions
 */
export const getDailyMissions = async (): Promise<UserMission[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<{ missions: UserMission[] }>>(
      '/gamification/missions/daily'
    );
    return data.data.missions;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's weekly missions (5 missions, auto-generates if needed)
 *
 * @returns Weekly missions
 */
export const getWeeklyMissions = async (): Promise<UserMission[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<{ missions: UserMission[] }>>(
      '/gamification/missions/weekly'
    );
    return data.data.missions;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's active special missions (events)
 *
 * @returns Special missions
 */
export const getSpecialMissions = async (): Promise<UserMission[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<{ missions: UserMission[] }>>(
      '/gamification/missions/special'
    );
    return data.data.missions;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get all missions for a user
 *
 * @param userId - User ID
 * @param filters - Optional filters (type, status)
 * @returns User missions
 */
export const getUserMissions = async (
  userId: string,
  filters?: { type?: string; status?: string }
): Promise<UserMission[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<UserMission[]>>(
      `/gamification/missions/user/${userId}`,
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get mission progress details
 *
 * @param missionId - Mission ID
 * @returns Mission progress
 */
export const getMissionProgress = async (missionId: string): Promise<UserMission> => {
  try {
    const { data } = await apiClient.get<ApiResponse<UserMission>>(
      `/gamification/missions/${missionId}/progress`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Claim rewards from completed mission
 *
 * @param missionId - Mission ID
 * @returns Updated mission with claimed status
 */
export const claimMissionRewards = async (missionId: string): Promise<UserMission> => {
  try {
    const { data } = await apiClient.post<ApiResponse<UserMission>>(
      `/gamification/missions/${missionId}/claim`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user mission statistics
 *
 * @param userId - User ID
 * @returns Mission statistics
 */
export const getUserMissionStats = async (userId: string): Promise<MissionStats> => {
  try {
    const { data } = await apiClient.get<ApiResponse<MissionStats>>(
      `/gamification/missions/stats/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// ACHIEVEMENTS API
// ============================================================================

/**
 * Get all available achievements
 *
 * @returns List of achievements
 */
export const getAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<Achievement[]>>(
      '/gamification/achievements'
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's unlocked achievements
 *
 * @param userId - User ID
 * @returns User achievements
 */
export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<UserAchievement[]>>(
      `/gamification/users/${userId}/achievements`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Unlock achievement for user
 *
 * @param request - Unlock achievement request
 * @returns Updated achievement
 */
export const unlockAchievement = async (request: UnlockAchievementRequest): Promise<UserAchievement> => {
  try {
    const { data } = await apiClient.post<ApiResponse<UserAchievement>>(
      '/gamification/achievements/unlock',
      request
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// COINS API
// ============================================================================

/**
 * Get user's coin balance
 *
 * @param userId - User ID
 * @returns Coin balance
 */
export const getCoinBalance = async (userId: string): Promise<CoinBalance> => {
  try {
    const { data } = await apiClient.get<ApiResponse<CoinBalance>>(
      `/gamification/coins/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's coin transactions
 *
 * @param userId - User ID
 * @param filters - Optional filters (limit, offset, type)
 * @returns Coin transactions
 */
export const getCoinTransactions = async (
  userId: string,
  filters?: { limit?: number; offset?: number; type?: 'earn' | 'spend' }
): Promise<CoinTransaction[]> => {
  try {
    const { data } = await apiClient.get<ApiResponse<CoinTransaction[]>>(
      `/gamification/coins/transactions/${userId}`,
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's earning statistics
 *
 * @param userId - User ID
 * @returns Earning statistics
 */
export const getEarningStats = async (userId: string): Promise<EarningStats> => {
  try {
    const { data } = await apiClient.get<ApiResponse<EarningStats>>(
      `/gamification/coins/stats/${userId}`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Award coins to user
 *
 * @param userId - User ID
 * @param amount - Amount of coins
 * @param reason - Reason for earning
 * @param transactionType - Transaction type
 * @param referenceId - Optional reference ID
 * @param referenceType - Optional reference type
 * @returns Transaction record
 */
export const earnCoins = async (
  userId: string,
  amount: number,
  reason: string,
  transactionType: string,
  referenceId?: string,
  referenceType?: string
): Promise<CoinTransaction> => {
  try {
    const { data } = await apiClient.post<ApiResponse<CoinTransaction>>(
      '/gamification/coins/earn',
      {
        userId,
        amount,
        reason,
        transactionType,
        referenceId,
        referenceType
      }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Deduct coins from user
 *
 * @param userId - User ID
 * @param amount - Amount of coins
 * @param item - Item/service name
 * @param transactionType - Transaction type
 * @param referenceId - Optional reference ID
 * @param referenceType - Optional reference type
 * @returns Transaction record
 */
export const spendCoins = async (
  userId: string,
  amount: number,
  item: string,
  transactionType: string,
  referenceId?: string,
  referenceType?: string
): Promise<CoinTransaction> => {
  try {
    const { data } = await apiClient.post<ApiResponse<CoinTransaction>>(
      '/gamification/coins/spend',
      {
        userId,
        amount,
        item,
        transactionType,
        referenceId,
        referenceType
      }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// LEADERBOARDS API
// ============================================================================

/**
 * Get global leaderboard (top 100 users)
 *
 * @param filters - Optional filters
 * @returns Leaderboard entries
 */
export const getGlobalLeaderboard = async (filters?: LeaderboardFilters): Promise<LeaderboardResponse> => {
  try {
    const { data } = await apiClient.get<ApiResponse<LeaderboardResponse>>(
      '/gamification/leaderboard/global',
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get school leaderboard
 *
 * @param schoolId - School ID
 * @param filters - Optional filters
 * @returns Leaderboard entries
 */
export const getSchoolLeaderboard = async (
  schoolId: string,
  filters?: LeaderboardFilters
): Promise<LeaderboardResponse> => {
  try {
    const { data } = await apiClient.get<ApiResponse<LeaderboardResponse>>(
      `/gamification/leaderboard/school/${schoolId}`,
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get classroom leaderboard
 *
 * @param classroomId - Classroom ID
 * @param filters - Optional filters
 * @returns Leaderboard entries
 */
export const getClassroomLeaderboard = async (
  classroomId: string,
  filters?: LeaderboardFilters
): Promise<LeaderboardResponse> => {
  try {
    const { data } = await apiClient.get<ApiResponse<LeaderboardResponse>>(
      `/gamification/leaderboard/classroom/${classroomId}`,
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get weekly top performers
 *
 * @param filters - Optional filters
 * @returns Leaderboard entries
 */
export const getWeeklyLeaderboard = async (filters?: LeaderboardFilters): Promise<LeaderboardResponse> => {
  try {
    const { data } = await apiClient.get<ApiResponse<LeaderboardResponse>>(
      '/gamification/leaderboard/weekly',
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get ML Coins leaderboard
 *
 * @param filters - Optional filters
 * @returns Leaderboard entries
 */
export const getCoinsLeaderboard = async (filters?: LeaderboardFilters): Promise<LeaderboardResponse> => {
  try {
    const { data } = await apiClient.get<ApiResponse<LeaderboardResponse>>(
      '/gamification/coins/leaderboard',
      { params: filters }
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's position in all leaderboards
 *
 * @param userId - User ID
 * @returns User positions
 */
export const getUserLeaderboardPosition = async (userId: string): Promise<UserLeaderboardPosition> => {
  try {
    const { data } = await apiClient.get<ApiResponse<UserLeaderboardPosition>>(
      `/gamification/leaderboard/user/${userId}/position`
    );
    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // User Stats
  getUserStats,

  // Ranks
  getUserRank,
  getAllRanks,
  getRankHistory,
  getUserMultiplier,
  checkPromotion,
  promoteUser,

  // Missions
  getDailyMissions,
  getWeeklyMissions,
  getSpecialMissions,
  getUserMissions,
  getMissionProgress,
  claimMissionRewards,
  getUserMissionStats,

  // Achievements
  getAllAchievements,
  getUserAchievements,
  unlockAchievement,

  // Coins
  getCoinBalance,
  getCoinTransactions,
  getEarningStats,
  earnCoins,
  spendCoins,

  // Leaderboards
  getGlobalLeaderboard,
  getSchoolLeaderboard,
  getClassroomLeaderboard,
  getWeeklyLeaderboard,
  getCoinsLeaderboard,
  getUserLeaderboardPosition,
};
