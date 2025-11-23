/**
 * Social API Integration
 *
 * Comprehensive API client for all social/gamification features including:
 * - Achievements
 * - Power-ups
 * - Leaderboards
 * - Guilds
 * - Friends
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse, PaginatedResponse, TimePeriod } from '@/services/api/apiTypes';

// Import types from feature modules
import type { Achievement, AchievementStats } from '../types/achievementsTypes';
import type { PowerUp, PowerUpInventory, ActivePowerUp } from '../types/powerUpsTypes';
import type { LeaderboardEntry, LeaderboardType } from '../types/leaderboardsTypes';
import type { Guild, GuildMember, GuildChallenge, GuildRole } from '../types/guildsTypes';
import type { Friend, FriendRequest, FriendActivity, FriendRecommendation } from '../types/friendsTypes';

// ============================================================================
// ACHIEVEMENTS API
// ============================================================================

/**
 * Get all achievements
 *
 * @param category - Optional category filter
 * @returns List of all achievements
 */
export const getAchievements = async (category?: string): Promise<Achievement[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<Achievement[]>>(
      API_ENDPOINTS.achievements.list,
      { params: { category } }
    );

    return data.data;
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
export const getAchievement = async (achievementId: string): Promise<Achievement> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id: achievementId,
        title: 'First Steps',
        description: 'Complete your first exercise',
        category: 'progress',
        rarity: 'common',
        mlCoinsReward: 25,
        xpReward: 50,
        icon: 'Star',
        isUnlocked: false,
      };
    }

    const { data } = await apiClient.get<ApiResponse<Achievement>>(
      API_ENDPOINTS.achievements.get(achievementId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Unlock achievement
 *
 * @param achievementId - Achievement ID to unlock
 * @returns Updated achievement
 */
export const unlockAchievement = async (achievementId: string): Promise<Achievement> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        id: achievementId,
        title: 'First Steps',
        description: 'Complete your first exercise',
        category: 'progress',
        rarity: 'common',
        mlCoinsReward: 25,
        xpReward: 50,
        icon: 'Star',
        isUnlocked: true,
        unlockedAt: new Date(),
      };
    }

    const { data } = await apiClient.post<ApiResponse<Achievement>>(
      API_ENDPOINTS.achievements.unlockSpecific(achievementId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Update achievement progress
 *
 * @param achievementId - Achievement ID
 * @param current - Current progress value
 * @returns Updated achievement
 */
export const updateAchievementProgress = async (
  achievementId: string,
  current: number
): Promise<Achievement> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: achievementId,
        title: 'Getting Started',
        description: 'Complete 5 exercises',
        category: 'progress',
        rarity: 'common',
        mlCoinsReward: 50,
        xpReward: 100,
        icon: 'Star',
        isUnlocked: false,
        progress: { current, required: 5 },
      };
    }

    const { data } = await apiClient.patch<ApiResponse<Achievement>>(
      API_ENDPOINTS.achievements.updateProgress(achievementId),
      { current }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get achievement statistics
 *
 * @returns Achievement stats
 */
export const getAchievementStats = async (): Promise<AchievementStats> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        totalAchievements: 40,
        unlockedAchievements: 8,
        progressAchievements: 3,
        masteryAchievements: 2,
        socialAchievements: 2,
        hiddenAchievements: 1,
        totalMlCoinsEarned: 325,
        totalXpEarned: 650,
      };
    }

    const { data } = await apiClient.get<ApiResponse<AchievementStats>>(
      API_ENDPOINTS.achievements.stats
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// POWER-UPS API
// ============================================================================

/**
 * Get all available power-ups
 *
 * @returns List of power-ups
 */
export const getPowerUps = async (): Promise<PowerUp[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<PowerUp[]>>(
      API_ENDPOINTS.powerups.list
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Purchase power-up
 *
 * @param powerUpId - Power-up ID to purchase
 * @param quantity - Quantity to purchase
 * @returns Purchase result
 */
export const purchasePowerUp = async (
  powerUpId: string,
  quantity: number = 1
): Promise<PowerUpInventory> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        owned: [],
        active: [],
        totalSpent: 0,
        totalUsages: 0,
      };
    }

    const { data } = await apiClient.post<ApiResponse<PowerUpInventory>>(
      API_ENDPOINTS.powerups.purchaseSpecific(powerUpId),
      { quantity }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Use power-up
 *
 * @param powerUpId - Power-up ID to use
 * @returns Active power-up data
 */
export const usePowerUp = async (powerUpId: string): Promise<ActivePowerUp> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        powerUpId,
        name: 'Power-Up',
        icon: 'Icon',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        remainingTime: 30 * 60,
        effect: {
          type: 'boost',
          value: 1,
          description: 'Boost effect',
        },
      };
    }

    const { data } = await apiClient.post<ApiResponse<ActivePowerUp>>(
      API_ENDPOINTS.powerups.useSpecific(powerUpId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get power-up inventory
 *
 * @returns User's power-up inventory
 */
export const getPowerUpInventory = async (): Promise<PowerUpInventory> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        owned: [],
        active: [],
        totalSpent: 0,
        totalUsages: 0,
      };
    }

    const { data } = await apiClient.get<ApiResponse<PowerUpInventory>>(
      API_ENDPOINTS.powerups.inventory
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get active power-ups
 *
 * @returns Currently active power-ups
 */
export const getActivePowerUps = async (): Promise<ActivePowerUp[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<ActivePowerUp[]>>(
      API_ENDPOINTS.powerups.active
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
 * Get leaderboard by type
 *
 * @param type - Leaderboard type
 * @param period - Time period
 * @param limit - Number of entries
 * @returns Leaderboard entries
 */
export const getLeaderboard = async (
  type: LeaderboardType,
  period: TimePeriod = 'all-time',
  limit: number = 100
): Promise<LeaderboardEntry[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(
      API_ENDPOINTS.leaderboards.byTypeAndPeriod(type, period),
      { params: { limit } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's rank in leaderboard
 *
 * @param type - Leaderboard type
 * @param period - Time period
 * @returns User's leaderboard entry
 */
export const getUserLeaderboardRank = async (
  type: LeaderboardType,
  period: TimePeriod = 'all-time'
): Promise<LeaderboardEntry> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        rank: 42,
        userId: '1',
        username: 'Detective GAMILIT',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=detective',
        rankBadge: 'Ajaw',
        score: 1250,
        xp: 0,
        mlCoins: 0,
        change: 2,
        changeType: 'up',
        isCurrentUser: true,
      };
    }

    const { data } = await apiClient.get<ApiResponse<LeaderboardEntry>>(
      API_ENDPOINTS.leaderboards.userRank,
      { params: { type, period } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// SPRINT 2 - NEW LEADERBOARDS API (Materialized Views)
// ============================================================================

/**
 * Get XP Leaderboard (from materialized view)
 *
 * @param limit - Number of entries (default 100)
 * @param offset - Offset for pagination (default 0)
 * @returns XP leaderboard entries
 */
export const getXPLeaderboard = async (limit: number = 100, offset: number = 0): Promise<any[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<any[]>>(
      API_ENDPOINTS.leaderboards.xp,
      { params: { limit, offset } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get Coins Leaderboard (from materialized view)
 *
 * @param limit - Number of entries (default 100)
 * @param offset - Offset for pagination (default 0)
 * @returns Coins leaderboard entries
 */
export const getCoinsLeaderboard = async (limit: number = 100, offset: number = 0): Promise<any[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<any[]>>(
      API_ENDPOINTS.leaderboards.coins,
      { params: { limit, offset } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get Streaks Leaderboard (from materialized view)
 *
 * @param limit - Number of entries (default 100)
 * @param offset - Offset for pagination (default 0)
 * @returns Streaks leaderboard entries
 */
export const getStreaksLeaderboard = async (limit: number = 100, offset: number = 0): Promise<any[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<any[]>>(
      API_ENDPOINTS.leaderboards.streaks,
      { params: { limit, offset } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get Global Leaderboard (from materialized view)
 *
 * @param limit - Number of entries (default 100)
 * @param offset - Offset for pagination (default 0)
 * @returns Global leaderboard entries
 */
export const getGlobalLeaderboard = async (limit: number = 100, offset: number = 0): Promise<any[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<any[]>>(
      API_ENDPOINTS.leaderboards.globalView,
      { params: { limit, offset } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's rank in a specific leaderboard type
 *
 * @param type - Leaderboard type ('xp', 'coins', 'streaks', 'global')
 * @returns User's rank data
 */
export const getMyLeaderboardRank = async (type: 'xp' | 'coins' | 'streaks' | 'global'): Promise<{ rank: number }> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { rank: 42 };
    }

    const { data } = await apiClient.get<ApiResponse<{ rank: number }>>(
      API_ENDPOINTS.leaderboards.myRank(type)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// GUILDS API
// ============================================================================

/**
 * Get all guilds
 *
 * @param filters - Search and filter parameters
 * @returns List of guilds
 */
export const getGuilds = async (filters?: {
  search?: string;
  minLevel?: number;
  isPublic?: boolean;
}): Promise<Guild[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<Guild[]>>(
      API_ENDPOINTS.guilds.list,
      { params: filters }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get guild by ID
 *
 * @param guildId - Guild ID
 * @returns Guild data
 */
export const getGuild = async (guildId: string): Promise<Guild> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: guildId,
        name: 'Detective Academy',
        description: 'Master detectives learning together',
        emblem: '🔍',
        level: 5,
        xp: 2500,
        memberCount: 15,
        maxMembers: 50,
        createdAt: new Date(),
        isPublic: true,
        leaderId: '1',
        requirements: { minLevel: 5 },
        status: 'active',
        stats: {
          totalExercisesCompleted: 0,
          totalMlCoinsEarned: 0,
          totalAchievements: 0,
          averageScore: 0,
        },
      };
    }

    const { data } = await apiClient.get<ApiResponse<Guild>>(
      API_ENDPOINTS.guilds.get(guildId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Create new guild
 *
 * @param guildData - Guild creation data
 * @returns Created guild
 */
export const createGuild = async (guildData: {
  name: string;
  description: string;
  emblem: string;
  isPublic: boolean;
  requirements?: { minRank?: string; minLevel?: number };
}): Promise<Guild> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: crypto.randomUUID(),
        ...guildData,
        level: 1,
        xp: 0,
        memberCount: 1,
        maxMembers: 50,
        createdAt: new Date(),
        leaderId: '1',
        status: 'active',
        stats: {
          totalExercisesCompleted: 0,
          totalMlCoinsEarned: 0,
          totalAchievements: 0,
          averageScore: 0,
        },
      };
    }

    const { data } = await apiClient.post<ApiResponse<Guild>>(
      API_ENDPOINTS.guilds.create,
      guildData
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Join guild
 *
 * @param guildId - Guild ID to join
 * @returns Updated guild
 */
export const joinGuild = async (guildId: string): Promise<Guild> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return await getGuild(guildId);
    }

    const { data } = await apiClient.post<ApiResponse<Guild>>(
      API_ENDPOINTS.guilds.join(guildId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Leave guild
 *
 * @param guildId - Guild ID to leave
 * @returns Success status
 */
export const leaveGuild = async (guildId: string): Promise<void> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return;
    }

    await apiClient.post(API_ENDPOINTS.guilds.leave(guildId));
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get guild members
 *
 * @param guildId - Guild ID
 * @returns List of guild members
 */
export const getGuildMembers = async (guildId: string): Promise<GuildMember[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<GuildMember[]>>(
      API_ENDPOINTS.guilds.members(guildId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Update guild member role
 *
 * @param guildId - Guild ID
 * @param memberId - Member ID
 * @param role - New role
 * @returns Updated member
 */
export const updateMemberRole = async (
  guildId: string,
  memberId: string,
  role: GuildRole
): Promise<GuildMember> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        userId: memberId,
        username: 'Member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member',
        role,
        joinedAt: new Date(),
        contributionScore: 0,
        lastActive: new Date(),
        rank: 'batab',
        level: 1,
      };
    }

    const { data } = await apiClient.patch<ApiResponse<GuildMember>>(
      API_ENDPOINTS.guilds.updateMemberRole(guildId, memberId),
      { role }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get guild challenges
 *
 * @param guildId - Guild ID
 * @returns List of guild challenges
 */
export const getGuildChallenges = async (guildId: string): Promise<GuildChallenge[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<GuildChallenge[]>>(
      API_ENDPOINTS.guilds.challenges(guildId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// FRIENDS API
// ============================================================================

/**
 * Get friends list
 *
 * @returns List of friends
 */
export const getFriends = async (): Promise<Friend[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<Friend[]>>(
      API_ENDPOINTS.friends.list
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Send friend request
 *
 * @param userId - User ID to send request to
 * @returns Friend request
 */
export const sendFriendRequest = async (userId: string): Promise<FriendRequest> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: crypto.randomUUID(),
        senderId: '1',
        senderName: 'You',
        senderAvatar: '',
        senderRank: 'batab',
        senderLevel: 1,
        receiverId: userId,
        status: 'pending',
        sentAt: new Date(),
      };
    }

    const { data } = await apiClient.post<ApiResponse<FriendRequest>>(
      API_ENDPOINTS.friends.request,
      { userId }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get friend requests
 *
 * @returns List of pending friend requests
 */
export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<FriendRequest[]>>(
      API_ENDPOINTS.friends.requests
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Accept friend request
 *
 * @param requestId - Request ID
 * @returns Updated friend
 */
export const acceptFriendRequest = async (requestId: string): Promise<Friend> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        userId: requestId,
        username: 'New Friend',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=friend',
        rank: 'batab',
        level: 1,
        xp: 0,
        mlCoins: 0,
        lastActive: new Date(),
        isOnline: false,
        friendsSince: new Date(),
        commonInterests: [],
        mutualFriends: 0,
      };
    }

    const { data } = await apiClient.post<ApiResponse<Friend>>(
      API_ENDPOINTS.friends.accept(requestId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Decline friend request
 *
 * @param requestId - Request ID
 * @returns Success status
 */
export const declineFriendRequest = async (requestId: string): Promise<void> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await apiClient.post(API_ENDPOINTS.friends.decline(requestId));
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Remove friend
 *
 * @param userId - User ID to remove
 * @returns Success status
 */
export const removeFriend = async (userId: string): Promise<void> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await apiClient.delete(API_ENDPOINTS.friends.remove(userId));
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get friend recommendations
 *
 * @returns List of friend recommendations
 */
export const getFriendRecommendations = async (): Promise<FriendRecommendation[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<FriendRecommendation[]>>(
      API_ENDPOINTS.friends.recommendations
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get friend activities
 *
 * @param limit - Number of activities to return
 * @returns List of friend activities
 */
export const getFriendActivities = async (limit?: number): Promise<FriendActivity[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<FriendActivity[]>>(
      API_ENDPOINTS.friends.activities,
      { params: { limit } }
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
  // Achievements
  getAchievements,
  getAchievement,
  unlockAchievement,
  updateAchievementProgress,
  getAchievementStats,

  // Power-ups
  getPowerUps,
  purchasePowerUp,
  usePowerUp,
  getPowerUpInventory,
  getActivePowerUps,

  // Leaderboards (Legacy)
  getLeaderboard,
  getUserLeaderboardRank,

  // Leaderboards (Sprint 2 - New Materialized Views)
  getXPLeaderboard,
  getCoinsLeaderboard,
  getStreaksLeaderboard,
  getGlobalLeaderboard,
  getMyLeaderboardRank,

  // Guilds
  getGuilds,
  getGuild,
  createGuild,
  joinGuild,
  leaveGuild,
  getGuildMembers,
  updateMemberRole,
  getGuildChallenges,

  // Friends
  getFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendRecommendations,
  getFriendActivities,
};
