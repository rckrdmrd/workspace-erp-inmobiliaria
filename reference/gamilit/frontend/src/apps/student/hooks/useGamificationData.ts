import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api/apiClient';
import type { MLCoinsData, RankData, AchievementData } from './useDashboardData';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  score: number;
  rankBadge: string;
  change: number;
  changeType: 'up' | 'down' | 'same' | 'new';
  isCurrentUser: boolean;
}

export interface LeaderboardPosition {
  position: number;
  totalUsers: number;
  percentile: number;
  entry: LeaderboardEntry;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  required: number;
  reward: {
    coins: number;
    xp: number;
  };
  expiresAt: string;
  completed: boolean;
  claimed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: {
    date: string;
    active: boolean;
  }[];
}

export interface GamificationData {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar?: string;
  };
  rankData: RankData;
  mlCoins: MLCoinsData;
  achievements: AchievementData[];
  leaderboardPosition: LeaderboardPosition | null;
  missions: Mission[];
  streaks: StreakData;
}

export function useGamificationData(userId: string) {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamificationData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        rankRes,
        coinsRes,
        achievementsRes,
        leaderboardRes,
        missionsRes,
        streaksRes,
      ] = await Promise.all([
        apiClient.get(`/gamification/ranks/user/${userId}`),
        apiClient.get(`/gamification/coins/${userId}`),
        apiClient.get(`/gamification/users/${userId}/achievements?limit=6`),
        apiClient.get(`/gamification/leaderboard/user/${userId}/position`),
        apiClient.get(`/gamification/missions/daily`),
        apiClient.get(`/gamification/streaks/${userId}`),
      ]);

      setData({
        user: {
          id: userId,
          email: 'detective@glit.com',
          full_name: 'Marie Curie',
        },
        rankData: rankRes.data.data,
        mlCoins: coinsRes.data.data,
        achievements: achievementsRes.data.data,
        leaderboardPosition: leaderboardRes.data.data,
        missions: missionsRes.data.data,
        streaks: streaksRes.data.data,
      });
    } catch (err) {
      console.warn('API error, using mock data:', err);
      setData(getMockGamificationData(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  const refresh = useCallback(() => {
    return fetchGamificationData();
  }, [fetchGamificationData]);

  return {
    user: data?.user || null,
    rankData: data?.rankData || null,
    mlCoins: data?.mlCoins || null,
    achievements: data?.achievements || [],
    leaderboardPosition: data?.leaderboardPosition || null,
    missions: data?.missions || [],
    streaks: data?.streaks || null,
    loading,
    error,
    refresh,
  };
}

// Mock data for development
function getMockGamificationData(userId: string): GamificationData {
  return {
    user: {
      id: userId,
      email: 'detective@glit.com',
      full_name: 'Marie Curie',
      avatar: 'https://ui-avatars.com/api/?name=Marie+Curie&background=f97316&color=fff',
    },
    rankData: {
      currentRank: 'Ajaw',
      currentXP: 750,
      nextRankXP: 1000,
      multiplier: 1.5,
      rankIcon: '🏹',
      progress: 75,
    },
    mlCoins: {
      balance: 1250,
      todayEarned: 150,
      todaySpent: 50,
      recentTransactions: [
        {
          id: '1',
          type: 'earned',
          amount: 100,
          description: 'Completado: Ejercicio de Línea de Tiempo',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: '2',
          type: 'earned',
          amount: 50,
          description: 'Racha de 7 días consecutivos',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          type: 'spent',
          amount: 30,
          description: 'Comprado: Power-up Tiempo Extra',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          type: 'earned',
          amount: 75,
          description: 'Logro desbloqueado: Detective Dedicado',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: '5',
          type: 'spent',
          amount: 20,
          description: 'Comprado: Pista Premium',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
      ],
    },
    achievements: [
      {
        id: '1',
        name: 'Primer Descubrimiento',
        description: 'Completa tu primer ejercicio',
        rarity: 'common',
        icon: '🔍',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: '2',
        name: 'Detective Dedicado',
        description: 'Mantén una racha de 7 días',
        rarity: 'rare',
        icon: '📅',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        name: 'Coleccionista de Monedas',
        description: 'Acumula 1000 ML Coins',
        rarity: 'epic',
        icon: '💰',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: '4',
        name: 'Maestro del Tiempo',
        description: 'Completa 10 líneas de tiempo',
        rarity: 'epic',
        icon: '⏰',
        unlocked: false,
        progress: 7,
        required: 10,
      },
      {
        id: '5',
        name: 'Científico Brillante',
        description: 'Obtén 100% en 5 ejercicios seguidos',
        rarity: 'legendary',
        icon: '⭐',
        unlocked: false,
        progress: 3,
        required: 5,
      },
      {
        id: '6',
        name: 'Explorador de Módulos',
        description: 'Completa 3 módulos diferentes',
        rarity: 'rare',
        icon: '🗺️',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    leaderboardPosition: {
      position: 42,
      totalUsers: 500,
      percentile: 91.6,
      entry: {
        id: userId,
        rank: 42,
        username: 'Marie Curie',
        avatar: 'https://ui-avatars.com/api/?name=Marie+Curie&background=f97316&color=fff',
        score: 2850,
        rankBadge: 'Ajaw',
        change: 5,
        changeType: 'up',
        isCurrentUser: true,
      },
    },
    missions: [
      {
        id: 'm1',
        title: 'Completa 3 ejercicios',
        description: 'Resuelve 3 ejercicios de cualquier tipo hoy',
        type: 'daily',
        progress: 2,
        required: 3,
        reward: {
          coins: 50,
          xp: 100,
        },
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        completed: false,
        claimed: false,
      },
      {
        id: 'm2',
        title: 'Gana 100 ML Coins',
        description: 'Acumula 100 ML Coins durante el día',
        type: 'daily',
        progress: 150,
        required: 100,
        reward: {
          coins: 25,
          xp: 50,
        },
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        completed: true,
        claimed: false,
      },
      {
        id: 'm3',
        title: 'Mantén tu racha',
        description: 'Completa al menos 1 ejercicio para mantener tu racha activa',
        type: 'daily',
        progress: 1,
        required: 1,
        reward: {
          coins: 30,
          xp: 75,
        },
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        completed: true,
        claimed: true,
      },
    ],
    streaks: {
      currentStreak: 7,
      longestStreak: 14,
      lastActivityDate: new Date().toISOString(),
      streakHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
        active: i >= 23, // Last 7 days active
      })),
    },
  };
}
