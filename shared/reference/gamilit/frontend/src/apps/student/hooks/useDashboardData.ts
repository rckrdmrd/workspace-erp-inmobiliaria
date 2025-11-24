import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api/apiClient';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Helper function to get rank icon
function getRankIcon(rank: string): string {
  const icons: Record<string, string> = {
    'Nacom': '🔍',
    'Ajaw': '🏹',
    "Ah K'in": '🗡️',
    'Halach Uinic': '⚔️',
    "K'uk'ulkan": '👑',
  };
  return icons[rank] || '🔍';
}

// Helper function to get rank multiplier
function getRankMultiplier(rank: string): number {
  const multipliers: Record<string, number> = {
    'Ajaw': 1.0,
    'Nacom': 1.2,
    "Ah K'in": 1.5,
    'Halach Uinic': 2.0,
    "K'uk'ulkan": 3.0,
  };
  return multipliers[rank] || 1.0;
}

export interface MLCoinsData {
  balance: number;
  todayEarned: number;
  todaySpent: number;
  recentTransactions: {
    id: string;
    type: 'earned' | 'spent';
    amount: number;
    description: string;
    timestamp: string;
  }[];
}

export interface RankData {
  currentRank: string;
  currentXP: number;
  nextRankXP: number;
  multiplier: number;
  rankIcon: string;
  progress: number;
}

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  required?: number;
}

export interface ProgressData {
  totalModules: number;
  completedModules: number;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
}

interface DashboardData {
  coins: MLCoinsData | null;
  rank: RankData | null;
  achievements: AchievementData[];
  progress: ProgressData | null;
  recentAchievements: AchievementData[];
}

export function useDashboardData() {
  const { user, isAuthenticated } = useAuth();

  const [data, setData] = useState<DashboardData>({
    coins: null,
    rank: null,
    achievements: [],
    progress: null,
    recentAchievements: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    console.log('🚀 [useDashboardData] fetchDashboardData called', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      isRefresh,
    });

    // Don't fetch if no user is authenticated
    if (!isAuthenticated || !user?.id) {
      console.warn('⚠️ [useDashboardData] User not authenticated or no userId - stopping');
      setLoading(false);
      return;
    }

    const userId = user.id;
    const token = localStorage.getItem('auth-token');
    console.log('🔑 [useDashboardData] Token check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      userId,
    });

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      console.log('📡 [useDashboardData] Starting API calls...');

      // Fetch all data in parallel
      const [coinsRes, rankCurrentRes, rankProgressRes, achievementsRes, progressRes] = await Promise.all([
        apiClient.get(`/gamification/users/${userId}/ml-coins`),
        apiClient.get(`/gamification/ranks/current`),
        apiClient.get(`/gamification/ranks/users/${userId}/rank-progress`),
        apiClient.get(`/gamification/users/${userId}/achievements`),
        apiClient.get(`/progress/users/${userId}`),
      ]);

      console.log('✅ [useDashboardData] API calls completed successfully');

      // Backend responses come directly, not wrapped in { data: {...} }
      // Axios already puts the response in .data, so we access .data directly
      console.log('🔍 [useDashboardData] Raw API responses:', {
        coins: coinsRes.data,
        rankCurrent: rankCurrentRes.data,
        rankProgress: rankProgressRes.data,
        achievements: achievementsRes.data,
        progress: progressRes.data,
      });

      // Process achievements data
      const achievementsData = achievementsRes.data?.data || achievementsRes.data || [];
      const recentUnlocked = Array.isArray(achievementsData) ? achievementsData
        .filter((a: AchievementData) => a.unlocked && a.unlockedAt)
        .sort((a: AchievementData, b: AchievementData) =>
          new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
        )
        .slice(0, 5) : [];

      // Transform rank data from API format to component format
      const rankCurrent = rankCurrentRes.data;
      const rankProgress = rankProgressRes.data;

      console.log('🔍 [useDashboardData] Rank data extraction:', {
        hasRankCurrent: !!rankCurrent,
        hasRankProgress: !!rankProgress,
        rankCurrentData: rankCurrent,
        rankProgressData: rankProgress,
      });

      const currentRankName = rankCurrent?.current_rank || rankProgress?.current_rank || 'Ajaw';
      const transformedRankData: RankData | null = (rankCurrent && rankProgress) ? {
        currentRank: currentRankName,
        currentXP: rankProgress.xp_current || 0,
        nextRankXP: rankProgress.xp_required || (rankProgress.xp_current || 0) + 1000, // Fallback for max rank
        multiplier: getRankMultiplier(currentRankName),
        rankIcon: getRankIcon(currentRankName),
        progress: rankProgress.progress_percentage || 0,
      } : null;

      console.log('✨ [useDashboardData] Rank transformation result:', {
        currentRankName,
        transformedRankData,
        willBeNull: !(rankCurrent && rankProgress),
      });

      console.log('🎯 [useDashboardData] Transformed data:', {
        rank: transformedRankData,
        coinsBalance: coinsRes.data?.current_balance,
      });

      // Process coins data
      const coinsData: MLCoinsData = {
        balance: coinsRes.data?.current_balance || 0,
        todayEarned: coinsRes.data?.earned_today || 0,
        todaySpent: 0, // Not provided by API
        recentTransactions: [], // Would need separate call to /transactions
      };

      setData({
        coins: coinsData,
        rank: transformedRankData,
        achievements: achievementsData,
        progress: progressRes.data?.data || progressRes.data || null,
        recentAchievements: recentUnlocked,
      });

      // Clear error on success
      setError(null);
    } catch (err) {
      // Set proper error message without falling back to mock data
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos del dashboard';
      console.error('❌ [useDashboardData] Error fetching dashboard data:', err);
      console.error('❌ [useDashboardData] Error details:', {
        error: err,
        message: errorMessage,
        userId,
      });
      setError(errorMessage);

      // Keep existing data or set to null if first load
      if (!isRefresh) {
        setData({
          coins: null,
          rank: null,
          achievements: [],
          progress: null,
          recentAchievements: [],
        });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  return {
    ...data,
    loading,
    error,
    isRefreshing,
    refresh,
  };
}
