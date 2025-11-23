/**
 * Missions Store
 *
 * Zustand store for managing missions state.
 * Phase 4 implementation.
 */

import { create } from 'zustand';
import { missionsAPI, Mission } from '@/services/api/missionsAPI';

interface MissionsState {
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  specialMissions: Mission[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDailyMissions: () => Promise<void>;
  fetchWeeklyMissions: () => Promise<void>;
  fetchSpecialMissions: () => Promise<void>;
  claimRewards: (missionId: string) => Promise<void>;
  refreshAllMissions: () => Promise<void>;
  updateMissionProgress: (missionId: string, current: number) => void;
}

export const useMissionsStore = create<MissionsState>((set, get) => ({
  dailyMissions: [],
  weeklyMissions: [],
  specialMissions: [],
  isLoading: false,
  error: null,

  fetchDailyMissions: async () => {
    set({ isLoading: true });
    try {
      const missions = await missionsAPI.getDailyMissions();
      set({ dailyMissions: missions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWeeklyMissions: async () => {
    set({ isLoading: true });
    try {
      const missions = await missionsAPI.getWeeklyMissions();
      set({ weeklyMissions: missions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSpecialMissions: async () => {
    try {
      const missions = await missionsAPI.getSpecialMissions();
      set({ specialMissions: missions });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  claimRewards: async (missionId: string) => {
    try {
      await missionsAPI.claimRewards(missionId);

      // Update mission status to 'claimed'
      set((state) => ({
        dailyMissions: state.dailyMissions.map((m) =>
          m.id === missionId ? { ...m, status: 'claimed' as const } : m
        ),
        weeklyMissions: state.weeklyMissions.map((m) =>
          m.id === missionId ? { ...m, status: 'claimed' as const } : m
        ),
        specialMissions: state.specialMissions.map((m) =>
          m.id === missionId ? { ...m, status: 'claimed' as const } : m
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  refreshAllMissions: async () => {
    await Promise.all([
      get().fetchDailyMissions(),
      get().fetchWeeklyMissions(),
      get().fetchSpecialMissions(),
    ]);
  },

  updateMissionProgress: (missionId: string, current: number) => {
    set((state) => {
      const updateMission = (missions: Mission[]) =>
        missions.map((m) => {
          if (m.id !== missionId) return m;
          const newObjective = { ...m.objective, current };
          const isCompleted = current >= m.objective.target;
          return {
            ...m,
            objective: newObjective,
            status: isCompleted && m.status === 'active' ? ('completed' as const) : m.status,
          };
        });

      return {
        dailyMissions: updateMission(state.dailyMissions),
        weeklyMissions: updateMission(state.weeklyMissions),
        specialMissions: updateMission(state.specialMissions),
      };
    });
  },
}));
