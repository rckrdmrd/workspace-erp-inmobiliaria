/**
 * Leaderboards Store
 *
 * Now connects to real API instead of mock data
 */

import { create } from 'zustand';
import type { LeaderboardData, LeaderboardType, TimePeriod, LeaderboardEntry } from '../types/leaderboardsTypes';
import { getLeaderboardByType as getMockLeaderboardByType } from '../mockData/leaderboardsMockData';
import { getLeaderboard, getUserLeaderboardRank } from '../api/socialAPI';
import { FEATURE_FLAGS } from '@/services/api/apiConfig';

interface LeaderboardsStore {
  currentLeaderboard: LeaderboardData;
  selectedType: LeaderboardType;
  selectedPeriod: TimePeriod;
  loading: boolean;
  error: string | null;

  setLeaderboardType: (type: LeaderboardType) => Promise<void>;
  setTimePeriod: (period: TimePeriod) => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
}

export const useLeaderboardsStore = create<LeaderboardsStore>((set, get) => ({
  currentLeaderboard: getMockLeaderboardByType('global'),
  selectedType: 'global',
  selectedPeriod: 'all-time',
  loading: false,
  error: null,

  setLeaderboardType: async (type: LeaderboardType) => {
    set({ loading: true, error: null, selectedType: type });

    try {
      if (FEATURE_FLAGS.USE_MOCK_DATA) {
        const leaderboard = getMockLeaderboardByType(type);
        set({ currentLeaderboard: leaderboard, loading: false });
        return;
      }

      const { selectedPeriod } = get();

      // Fetch leaderboard data from API
      const entries = await getLeaderboard(type, selectedPeriod);

      // Try to get user's rank
      let userRank: number | undefined = undefined;
      try {
        const userEntry = await getUserLeaderboardRank(type, selectedPeriod);
        userRank = userEntry.rank;
      } catch (err) {
        console.warn('Could not fetch user rank:', err);
      }

      const leaderboard: LeaderboardData = {
        type,
        timePeriod: selectedPeriod,
        entries,
        userRank,
        totalParticipants: entries.length,
        lastUpdated: new Date(),
      };

      set({ currentLeaderboard: leaderboard, loading: false });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load leaderboard',
        loading: false,
      });

      // Fallback to mock data on error
      const mockLeaderboard = getMockLeaderboardByType(type);
      set({ currentLeaderboard: mockLeaderboard });
    }
  },

  setTimePeriod: async (period: TimePeriod) => {
    set({ loading: true, error: null, selectedPeriod: period });

    try {
      if (FEATURE_FLAGS.USE_MOCK_DATA) {
        set({ loading: false });
        return;
      }

      const { selectedType } = get();

      // Fetch new data based on period
      const entries = await getLeaderboard(selectedType, period);

      // Try to get user's rank
      let userRank: number | undefined = undefined;
      try {
        const userEntry = await getUserLeaderboardRank(selectedType, period);
        userRank = userEntry.rank;
      } catch (err) {
        console.warn('Could not fetch user rank:', err);
      }

      const leaderboard: LeaderboardData = {
        type: selectedType,
        timePeriod: period,
        entries,
        userRank,
        totalParticipants: entries.length,
        lastUpdated: new Date(),
      };

      set({ currentLeaderboard: leaderboard, loading: false });
    } catch (error) {
      console.error('Error changing time period:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load leaderboard',
        loading: false,
      });
    }
  },

  refreshLeaderboard: async () => {
    const { selectedType, selectedPeriod } = get();
    set({ loading: true, error: null });

    try {
      if (FEATURE_FLAGS.USE_MOCK_DATA) {
        const leaderboard = getMockLeaderboardByType(selectedType);
        set({ currentLeaderboard: { ...leaderboard, lastUpdated: new Date() }, loading: false });
        return;
      }

      // Fetch fresh data from API
      const entries = await getLeaderboard(selectedType, selectedPeriod);

      // Try to get user's rank
      let userRank: number | undefined = undefined;
      try {
        const userEntry = await getUserLeaderboardRank(selectedType, selectedPeriod);
        userRank = userEntry.rank;
      } catch (err) {
        console.warn('Could not fetch user rank:', err);
      }

      const leaderboard: LeaderboardData = {
        type: selectedType,
        timePeriod: selectedPeriod,
        entries,
        userRank,
        totalParticipants: entries.length,
        lastUpdated: new Date(),
      };

      set({ currentLeaderboard: leaderboard, loading: false });
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh leaderboard',
        loading: false,
      });

      // Fallback to mock data on error
      const mockLeaderboard = getMockLeaderboardByType(selectedType);
      set({ currentLeaderboard: { ...mockLeaderboard, lastUpdated: new Date() } });
    }
  },
}));
