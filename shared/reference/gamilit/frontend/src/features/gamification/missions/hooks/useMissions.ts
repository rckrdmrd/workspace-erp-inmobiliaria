/**
 * useMissions Hook
 *
 * Comprehensive hook for managing missions state and API interactions
 *
 * Features:
 * - Fetch missions by type (daily, weekly, special)
 * - Track active missions
 * - Start and claim missions
 * - Real-time progress updates
 * - Auto-refresh every 60 seconds
 * - Local storage for tracking
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/services/api/apiClient';
import { useAuthStore } from '@/features/auth/store/authStore';
import type {
  Mission,
  MissionStats,
  MissionType,
  MissionActionResult,
  MissionRewardsSummary,
  TrackedMission,
} from '../types/missionsTypes';

const API_BASE = '/gamification/missions';
const REFRESH_INTERVAL = 60000; // 60 seconds
const MAX_TRACKED_MISSIONS = 3;

interface UseMissionsResult {
  // Data
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  specialMissions: Mission[];
  allMissions: Mission[];
  activeMissions: Mission[]; // Tracked missions

  // Current tab
  currentTab: MissionType;
  setCurrentTab: (tab: MissionType) => void;

  // Actions
  startMission: (missionId: string) => Promise<MissionActionResult>;
  claimReward: (missionId: string) => Promise<MissionActionResult>;
  trackMission: (missionId: string) => void;
  untrackMission: (missionId: string) => void;
  isTracked: (missionId: string) => boolean;

  // Stats
  stats: MissionStats;
  rewardsSummary: MissionRewardsSummary;

  // State
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Main useMissions hook
 */
export function useMissions(userId?: string): UseMissionsResult {
  // State
  const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>([]);
  const [specialMissions, setSpecialMissions] = useState<Mission[]>([]);
  const [stats, setStats] = useState<MissionStats>({
    todayCompleted: 0,
    todayTotal: 0,
    weekCompleted: 0,
    weekTotal: 0,
    totalCompleted: 0,
    totalXPEarned: 0,
    totalMLCoinsEarned: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [currentTab, setCurrentTab] = useState<MissionType>('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tracked missions (from localStorage)
  const [trackedMissionIds, setTrackedMissionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tracked_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save tracked missions to localStorage
  useEffect(() => {
    localStorage.setItem('tracked_missions', JSON.stringify(trackedMissionIds));
  }, [trackedMissionIds]);

  /**
   * Fetch missions from API
   */
  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from real API
      const [dailyRes, weeklyRes, specialRes, statsRes] = await Promise.all([
        fetchMissionsByType('daily'),
        fetchMissionsByType('weekly'),
        fetchMissionsByType('special'),
        fetchMissionStats(),
      ]);

      setDailyMissions(dailyRes);
      setWeeklyMissions(weeklyRes);
      setSpecialMissions(specialRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Error fetching missions:', err);
      setError('No se pudieron cargar las misiones. Intenta de nuevo.');

      // Set empty data on error
      setDailyMissions([]);
      setWeeklyMissions([]);
      setSpecialMissions([]);
      setStats({
        todayCompleted: 0,
        todayTotal: 0,
        weekCompleted: 0,
        weekTotal: 0,
        totalCompleted: 0,
        totalXPEarned: 0,
        totalMLCoinsEarned: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    // ✅ Verificar autenticación ANTES de llamar API
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      console.log('[useMissions] No user authenticated, skipping fetch');
      // Establecer estados vacíos
      setDailyMissions([]);
      setWeeklyMissions([]);
      setSpecialMissions([]);
      setStats({
        todayCompleted: 0,
        todayTotal: 0,
        weekCompleted: 0,
        weekTotal: 0,
        totalCompleted: 0,
        totalXPEarned: 0,
        totalMLCoinsEarned: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
      setLoading(false);
      return;
    }

    // ✅ Solo llamar API si hay usuario autenticado
    fetchMissions();
  }, [fetchMissions]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // ✅ Verificar autenticación antes de auto-refresh
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        fetchMissions();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchMissions]);

  /**
   * Helper: Update mission in state
   */
  const updateMissionInState = useCallback((updatedMission: Mission) => {
    const updateFn = (missions: Mission[]) =>
      missions.map(m => (m.id === updatedMission.id ? updatedMission : m));

    if (updatedMission.type === 'daily') {
      setDailyMissions(updateFn);
    } else if (updatedMission.type === 'weekly') {
      setWeeklyMissions(updateFn);
    } else if (updatedMission.type === 'special') {
      setSpecialMissions(updateFn);
    }
  }, []);

  /**
   * Track a mission
   */
  const trackMission = useCallback((missionId: string) => {
    setTrackedMissionIds(prev => {
      if (prev.includes(missionId)) return prev;

      // Limit to MAX_TRACKED_MISSIONS
      if (prev.length >= MAX_TRACKED_MISSIONS) {
        return [...prev.slice(1), missionId];
      }

      return [...prev, missionId];
    });
  }, []);

  /**
   * Untrack a mission
   */
  const untrackMission = useCallback((missionId: string) => {
    setTrackedMissionIds(prev => prev.filter(id => id !== missionId));
  }, []);

  /**
   * Check if mission is tracked
   */
  const isTracked = useCallback((missionId: string): boolean => {
    return trackedMissionIds.includes(missionId);
  }, [trackedMissionIds]);

  /**
   * Start a mission
   */
  const startMission = useCallback(async (missionId: string): Promise<MissionActionResult> => {
    try {
      // TODO: Call real API
      // const response = await fetch(`${API_BASE}/${missionId}/start`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();

      // Mock implementation
      const allMissions = [...dailyMissions, ...weeklyMissions, ...specialMissions];
      const mission = allMissions.find(m => m.id === missionId);

      if (!mission) {
        return {
          success: false,
          message: 'Misión no encontrada',
        };
      }

      if (mission.status !== 'not_started') {
        return {
          success: false,
          message: 'La misión ya fue iniciada',
        };
      }

      // Update mission status
      const updatedMission = {
        ...mission,
        status: 'in_progress' as const,
        startedAt: new Date(),
      };

      // Update state
      updateMissionInState(updatedMission);

      return {
        success: true,
        message: 'Misión iniciada con éxito',
        mission: updatedMission,
      };
    } catch (err) {
      console.error('Error starting mission:', err);
      return {
        success: false,
        message: 'Error al iniciar la misión',
      };
    }
  }, [dailyMissions, weeklyMissions, specialMissions, updateMissionInState]);

  /**
   * Claim mission reward
   */
  const claimReward = useCallback(async (missionId: string): Promise<MissionActionResult> => {
    try {
      // Call real API
      const response = await apiClient.post(`${API_BASE}/${missionId}/claim`);
      const data = response.data;

      if (data.success) {
        const { mission: updatedMission, rewards } = data.data;

        // Update state
        updateMissionInState(updatedMission);

        // Update stats
        setStats(prev => ({
          ...prev,
          totalXPEarned: prev.totalXPEarned + rewards.xp,
          totalMLCoinsEarned: prev.totalMLCoinsEarned + rewards.mlCoins,
        }));

        // Remove from tracked missions
        untrackMission(missionId);

        // Refresh missions
        await fetchMissions();

        return {
          success: true,
          message: 'Recompensa reclamada',
          mission: updatedMission,
          rewards,
        };
      } else {
        return {
          success: false,
          message: data.error?.message || 'Error al reclamar la recompensa',
        };
      }
    } catch (err) {
      console.error('Error claiming reward:', err);
      return {
        success: false,
        message: 'Error al reclamar la recompensa',
      };
    }
  }, [fetchMissions, untrackMission, updateMissionInState]);

  // Computed: All missions
  const allMissions = useMemo(
    () => [...dailyMissions, ...weeklyMissions, ...specialMissions],
    [dailyMissions, weeklyMissions, specialMissions]
  );

  // Computed: Active (tracked) missions
  const activeMissions = useMemo(
    () => allMissions.filter(m => trackedMissionIds.includes(m.id)),
    [allMissions, trackedMissionIds]
  );

  // Computed: Rewards summary
  const rewardsSummary = useMemo((): MissionRewardsSummary => {
    const currentMissions =
      currentTab === 'daily'
        ? dailyMissions
        : currentTab === 'weekly'
        ? weeklyMissions
        : specialMissions;

    const potential = currentMissions
      .filter(m => m.status !== 'claimed')
      .reduce(
        (acc, m) => ({
          xp: acc.xp + m.xpReward,
          mlCoins: acc.mlCoins + m.mlCoinsReward,
        }),
        { xp: 0, mlCoins: 0 }
      );

    const earned = currentMissions
      .filter(m => m.status === 'claimed')
      .reduce(
        (acc, m) => ({
          xp: acc.xp + m.xpReward,
          mlCoins: acc.mlCoins + m.mlCoinsReward,
        }),
        { xp: 0, mlCoins: 0 }
      );

    const allDailyComplete = dailyMissions.every(m => m.status === 'claimed');
    const allWeeklyComplete = weeklyMissions.every(m => m.status === 'claimed');

    const bonusXP = (allDailyComplete ? 500 : 0) + (allWeeklyComplete ? 2000 : 0);
    const bonusMLCoins = (allDailyComplete ? 100 : 0) + (allWeeklyComplete ? 500 : 0);

    return {
      potential,
      earned,
      bonus: {
        allDailyComplete,
        allWeeklyComplete,
        bonusXP,
        bonusMLCoins,
      },
    };
  }, [dailyMissions, weeklyMissions, specialMissions, currentTab]);

  return {
    // Data
    dailyMissions,
    weeklyMissions,
    specialMissions,
    allMissions,
    activeMissions,

    // Current tab
    currentTab,
    setCurrentTab,

    // Actions
    startMission,
    claimReward,
    trackMission,
    untrackMission,
    isTracked,

    // Stats
    stats,
    rewardsSummary,

    // State
    loading,
    error,
    refresh: fetchMissions,
  };
}

/**
 * Helper: Fetch missions by type (real API implementation)
 */
async function fetchMissionsByType(type: MissionType): Promise<Mission[]> {
  try {
    const response = await apiClient.get(`${API_BASE}/${type}`);
    // API returns { success: true, data: { missions: [...], count: number } }
    if (response.data.success && response.data.data?.missions) {
      return response.data.data.missions;
    }
    // Fallback if structure is different
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching ${type} missions:`, error);
    // Return empty array on error instead of mock data
    throw error;
  }
}

/**
 * Helper: Fetch mission stats (real API implementation)
 */
async function fetchMissionStats(): Promise<MissionStats> {
  try {
    // Obtener userId del authStore en lugar de localStorage
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      console.warn('No user ID found in auth store');
      throw new Error('Usuario no autenticado');
    }

    const response = await apiClient.get(`${API_BASE}/stats/${userId}`);
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error('Error fetching mission stats:', error);
    // Throw error instead of returning mock data
    throw error;
  }
}

