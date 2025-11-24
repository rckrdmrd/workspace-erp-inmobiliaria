/**
 * Ranks API Integration
 *
 * API client for rank & progression endpoints including XP management,
 * rank-ups, prestige, multipliers, and progression history.
 *
 * IMPORTANT: User ID Requirements
 * ================================
 * Most functions in this API require a userId parameter. This should be obtained
 * from the useAuth() hook in your component:
 *
 * @example
 * ```typescript
 * import { useAuth } from '@/shared/hooks/useAuth';
 * import { getProgressionStats } from './ranksAPI';
 *
 * function MyComponent() {
 *   const { user } = useAuth();
 *
 *   useEffect(() => {
 *     if (user?.id) {
 *       getProgressionStats(user.id).then(stats => {
 *         // Handle stats
 *       });
 *     }
 *   }, [user]);
 * }
 * ```
 *
 * Functions that require userId:
 * - getProgressionStats(userId)
 * - rankUp(userId)
 * - getProgressionHistory(userId, limit?)
 * - getMultipliers(userId)
 * - addMultiplier(source, userId)
 *
 * Functions that DON'T require userId (use JWT):
 * - getCurrentRank() - uses current authenticated user from JWT
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';
import type {
  UserRankProgress,
  MayaRank,
  AddXPRequest,
  AddXPResponse,
  RankUpEvent,
  PrestigeRequest,
  PrestigeResponse,
  MultiplierBreakdown,
  MultiplierSource,
  ProgressionHistoryEntry,
  XPSource,
} from '../types/ranksTypes';
import { MOCK_USER_NACOM } from '../mockData/ranksMockData';

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

/**
 * Mock get current rank progress
 */
const mockGetCurrentRank = async (): Promise<UserRankProgress> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USER_NACOM;
};

/**
 * Mock add XP
 */
const mockAddXP = async (
  amount: number,
  source: XPSource,
  description?: string
): Promise<AddXPResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    newXP: MOCK_USER_NACOM.currentXP + amount,
    newLevel: MOCK_USER_NACOM.currentLevel,
    leveledUp: false,
    rankedUp: false,
  };
};

// ============================================================================
// RANKS API FUNCTIONS
// ============================================================================

/**
 * Get current rank progress
 *
 * @returns Current user rank progress data
 */
export const getCurrentRank = async (): Promise<UserRankProgress> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetCurrentRank();
    }

    const { data } = await apiClient.get<ApiResponse<UserRankProgress>>(
      API_ENDPOINTS.ranks.current
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get progression statistics
 *
 * @param userId - User ID (REQUIRED - get from useAuth hook)
 * @returns User progression stats
 * @throws Error if userId is not provided
 *
 * @example
 * const { user } = useAuth();
 * const stats = await getProgressionStats(user.id);
 */
export const getProgressionStats = async (userId: string): Promise<UserRankProgress> => {
  try {
    if (!userId) {
      throw new Error('userId is required. Get it from useAuth() hook.');
    }

    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetCurrentRank();
    }

    const { data } = await apiClient.get<ApiResponse<UserRankProgress>>(
      API_ENDPOINTS.ranks.rankProgress(userId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Add XP to user
 *
 * ⚠️ NOT IMPLEMENTED - Backend endpoint does not exist in ranks controller
 * XP is managed through user_stats module, not ranks module
 *
 * @param amount - XP amount to add
 * @param source - Source of XP (exercise, achievement, etc.)
 * @param description - Optional description
 * @param metadata - Optional metadata
 * @returns Add XP response with level/rank up info
 */
/*
export const addXP = async (
  amount: number,
  source: XPSource,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<AddXPResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockAddXP(amount, source, description);
    }

    // TODO: Backend needs to implement this endpoint or use user_stats module
    const { data } = await apiClient.post<ApiResponse<AddXPResponse>>(
      '/gamification/user-stats/xp/add', // Placeholder - needs backend implementation
      {
        amount,
        source,
        description,
        metadata,
      }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};
*/

/**
 * Trigger level up
 *
 * ⚠️ NOT IMPLEMENTED - Backend endpoint does not exist
 * Level ups are automatic when XP is added through user_stats module
 *
 * @returns Updated rank progress
 */
/*
export const levelUp = async (): Promise<UserRankProgress> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        ...MOCK_USER_NACOM,
        currentLevel: MOCK_USER_NACOM.currentLevel + 1,
      };
    }

    // TODO: Backend handles level ups automatically - no manual trigger needed
    const { data } = await apiClient.post<ApiResponse<UserRankProgress>>(
      '/gamification/user-stats/level-up', // Placeholder - backend auto-handles this
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};
*/

/**
 * Trigger rank up (promote user to next rank)
 *
 * @param userId - User ID (REQUIRED - get from useAuth hook)
 * @returns Rank up event data
 * @throws Error if userId is not provided
 *
 * @example
 * const { user } = useAuth();
 * const result = await rankUp(user.id);
 */
export const rankUp = async (userId: string): Promise<RankUpEvent> => {
  try {
    if (!userId) {
      throw new Error('userId is required. Get it from useAuth() hook.');
    }

    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        fromRank: 'Nacom',
        toRank: 'Ajaw',
        timestamp: new Date(),
        newBenefits: ['Intermediate exercises', 'Level 2 hints', '1.25x multiplier'],
        newMultiplier: 1.25,
        isPrestige: false,
      };
    }

    const { data } = await apiClient.post<ApiResponse<RankUpEvent>>(
      API_ENDPOINTS.ranks.promote(userId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Prestige user (reset with bonuses)
 *
 * ⚠️ NOT IMPLEMENTED - Backend endpoint does not exist
 * Prestige system not yet implemented in backend
 *
 * @param confirmed - Confirmation flag
 * @returns Prestige response
 */
/*
export const prestige = async (confirmed: boolean): Promise<PrestigeResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        prestigeLevel: 1,
        newRank: 'Nacom',
        bonuses: {
          level: 1,
          bonusMultiplier: 0.1,
          unlockedFeatures: ['Prestige badge', 'Exclusive cosmetics'],
          cosmetics: ['Bronze star', 'Prestige border'],
          abilities: ['Streak protection'],
          badge: 'bronze-prestige',
          color: 'from-amber-500 to-orange-600',
        },
        newMultiplier: 1.1,
      };
    }

    // TODO: Backend needs to implement prestige system
    const { data } = await apiClient.post<ApiResponse<PrestigeResponse>>(
      '/gamification/ranks/prestige', // Placeholder - needs backend implementation
      { confirmed }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};
*/

/**
 * Get progression history
 *
 * @param userId - User ID (REQUIRED - get from useAuth hook)
 * @param limit - Number of entries to return (optional)
 * @returns Progression history entries
 * @throws Error if userId is not provided
 *
 * @example
 * const { user } = useAuth();
 * const history = await getProgressionHistory(user.id, 10);
 */
export const getProgressionHistory = async (
  userId: string,
  limit?: number
): Promise<ProgressionHistoryEntry[]> => {
  try {
    if (!userId) {
      throw new Error('userId is required. Get it from useAuth() hook.');
    }

    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          type: 'level_up',
          timestamp: new Date(),
          title: 'Nivel 5 alcanzado',
          description: 'Has subido al nivel 5. ¡Sigue así!',
          rank: 'Nacom',
          xpSnapshot: 500,
          levelSnapshot: 5,
          multiplierSnapshot: 1.0,
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<ProgressionHistoryEntry[]>>(
      API_ENDPOINTS.ranks.history(userId),
      { params: { limit } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get multiplier breakdown
 *
 * @param userId - User ID (REQUIRED - get from useAuth hook)
 * @returns Current multiplier breakdown
 * @throws Error if userId is not provided
 *
 * @example
 * const { user } = useAuth();
 * const multipliers = await getMultipliers(user.id);
 */
export const getMultipliers = async (userId: string): Promise<MultiplierBreakdown> => {
  try {
    if (!userId) {
      throw new Error('userId is required. Get it from useAuth() hook.');
    }

    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        base: 1.0,
        rank: {
          type: 'rank',
          name: 'Nacom',
          value: 1.0,
          isPermanent: true,
          description: 'Multiplicador base del rango',
        },
        sources: [],
        total: 1.0,
        hasExpiringSoon: false,
        expiringSoon: [],
      };
    }

    // Note: Backend returns multiplier info in rank-progress endpoint
    const { data } = await apiClient.get<ApiResponse<MultiplierBreakdown>>(
      API_ENDPOINTS.ranks.multipliers(userId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Add multiplier source
 *
 * ⚠️ PARTIAL IMPLEMENTATION - Backend may not have dedicated endpoint for adding multipliers
 * Multipliers are typically managed through rank progression and achievements
 *
 * @param source - Multiplier source to add
 * @param userId - User ID (REQUIRED - get from useAuth hook)
 * @returns Updated multiplier breakdown
 * @throws Error if userId is not provided
 *
 * @example
 * const { user } = useAuth();
 * const multiplierSource = { type: 'achievement', value: 1.1, ... };
 * const result = await addMultiplier(multiplierSource, user.id);
 */
export const addMultiplier = async (
  source: MultiplierSource,
  userId: string
): Promise<MultiplierBreakdown> => {
  try {
    if (!userId) {
      throw new Error('userId is required. Get it from useAuth() hook.');
    }

    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        base: 1.0,
        rank: {
          type: 'rank',
          name: 'Nacom',
          value: 1.0,
          isPermanent: true,
          description: 'Multiplicador base del rango',
        },
        sources: [source],
        total: 1.0 * source.value,
        hasExpiringSoon: false,
        expiringSoon: [],
      };
    }

    // TODO: Verify if backend has dedicated endpoint for adding multipliers
    // Currently using multipliers endpoint (may need adjustment)
    const { data } = await apiClient.post<ApiResponse<MultiplierBreakdown>>(
      API_ENDPOINTS.ranks.multipliers(userId),
      source
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Remove multiplier source
 *
 * ⚠️ NOT IMPLEMENTED - Backend endpoint does not exist
 * Multiplier removal is typically handled automatically through expiration
 *
 * @param type - Multiplier type to remove
 * @returns Updated multiplier breakdown
 */
/*
export const removeMultiplier = async (type: string): Promise<MultiplierBreakdown> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        base: 1.0,
        rank: {
          type: 'rank',
          name: 'Nacom',
          value: 1.0,
          isPermanent: true,
          description: 'Multiplicador base del rango',
        },
        sources: [],
        total: 1.0,
        hasExpiringSoon: false,
        expiringSoon: [],
      };
    }

    // TODO: Backend needs to implement multiplier removal endpoint
    const { data } = await apiClient.delete<ApiResponse<MultiplierBreakdown>>(
      `/gamification/ranks/multipliers/${type}`, // Placeholder - needs backend implementation
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};
*/

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getCurrentRank,
  getProgressionStats,
  // addXP, // Commented out - No backend endpoint (XP managed by user_stats)
  // levelUp, // Commented out - No backend endpoint (automatic)
  rankUp,
  // prestige, // Commented out - No backend endpoint (not implemented yet)
  getProgressionHistory,
  getMultipliers,
  addMultiplier,
  // removeMultiplier, // Commented out - No backend endpoint
};
