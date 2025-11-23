/**
 * New Leaderboards Store (Sprint 2)
 *
 * Connects to new materialized view leaderboards:
 * - XP Leaderboard
 * - ML Coins Leaderboard
 * - Streaks Leaderboard
 * - Global Leaderboard (combined score)
 */

import { create } from 'zustand';
import {
  getXPLeaderboard,
  getCoinsLeaderboard,
  getStreaksLeaderboard,
  getGlobalLeaderboard,
  getMyLeaderboardRank
} from '../api/socialAPI';
import type {
  XPLeaderboardEntry,
  CoinsLeaderboardEntry,
  StreakLeaderboardEntry,
  GlobalLeaderboardEntry
} from '../types/leaderboardsTypes';

interface NewLeaderboardsState {
  // Leaderboard Data
  xpLeaderboard: XPLeaderboardEntry[];
  coinsLeaderboard: CoinsLeaderboardEntry[];
  streaksLeaderboard: StreakLeaderboardEntry[];
  globalLeaderboard: GlobalLeaderboardEntry[];

  // User Ranks
  myXpRank: number | null;
  myCoinsRank: number | null;
  myStreaksRank: number | null;
  myGlobalRank: number | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Active Tab
  activeTab: 'xp' | 'coins' | 'streaks' | 'global';
  setActiveTab: (tab: 'xp' | 'coins' | 'streaks' | 'global') => void;

  // Actions
  fetchXPLeaderboard: (limit?: number, offset?: number) => Promise<void>;
  fetchCoinsLeaderboard: (limit?: number, offset?: number) => Promise<void>;
  fetchStreaksLeaderboard: (limit?: number, offset?: number) => Promise<void>;
  fetchGlobalLeaderboard: (limit?: number, offset?: number) => Promise<void>;
  fetchMyRank: (type: 'xp' | 'coins' | 'streaks' | 'global') => Promise<void>;
  fetchAllLeaderboards: () => Promise<void>;
  refreshCurrentLeaderboard: () => Promise<void>;
  reset: () => void;
}

export const useNewLeaderboardsStore = create<NewLeaderboardsState>((set, get) => ({
  // Initial State
  xpLeaderboard: [],
  coinsLeaderboard: [],
  streaksLeaderboard: [],
  globalLeaderboard: [],

  myXpRank: null,
  myCoinsRank: null,
  myStreaksRank: null,
  myGlobalRank: null,

  isLoading: false,
  error: null,
  lastUpdated: null,

  activeTab: 'global',

  // Set Active Tab
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  // Fetch XP Leaderboard
  fetchXPLeaderboard: async (limit = 100, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getXPLeaderboard(limit, offset);
      set({
        xpLeaderboard: data as XPLeaderboardEntry[],
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch XP leaderboard';
      set({ error: message, isLoading: false });
      console.error('Error fetching XP leaderboard:', error);
    }
  },

  // Fetch Coins Leaderboard
  fetchCoinsLeaderboard: async (limit = 100, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCoinsLeaderboard(limit, offset);
      set({
        coinsLeaderboard: data as CoinsLeaderboardEntry[],
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch Coins leaderboard';
      set({ error: message, isLoading: false });
      console.error('Error fetching Coins leaderboard:', error);
    }
  },

  // Fetch Streaks Leaderboard
  fetchStreaksLeaderboard: async (limit = 100, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getStreaksLeaderboard(limit, offset);
      set({
        streaksLeaderboard: data as StreakLeaderboardEntry[],
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch Streaks leaderboard';
      set({ error: message, isLoading: false });
      console.error('Error fetching Streaks leaderboard:', error);
    }
  },

  // Fetch Global Leaderboard
  fetchGlobalLeaderboard: async (limit = 100, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getGlobalLeaderboard(limit, offset);
      set({
        globalLeaderboard: data as GlobalLeaderboardEntry[],
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch Global leaderboard';
      set({ error: message, isLoading: false });
      console.error('Error fetching Global leaderboard:', error);
    }
  },

  // Fetch My Rank
  fetchMyRank: async (type: 'xp' | 'coins' | 'streaks' | 'global') => {
    try {
      const data = await getMyLeaderboardRank(type);
      const rank = data.rank;

      switch (type) {
        case 'xp':
          set({ myXpRank: rank });
          break;
        case 'coins':
          set({ myCoinsRank: rank });
          break;
        case 'streaks':
          set({ myStreaksRank: rank });
          break;
        case 'global':
          set({ myGlobalRank: rank });
          break;
      }
    } catch (error) {
      console.error(`Error fetching my ${type} rank:`, error);
    }
  },

  // Fetch All Leaderboards
  fetchAllLeaderboards: async () => {
    set({ isLoading: true, error: null });

    try {
      // Fetch all leaderboards in parallel
      await Promise.all([
        get().fetchXPLeaderboard(),
        get().fetchCoinsLeaderboard(),
        get().fetchStreaksLeaderboard(),
        get().fetchGlobalLeaderboard()
      ]);

      // Fetch all user ranks in parallel
      await Promise.all([
        get().fetchMyRank('xp'),
        get().fetchMyRank('coins'),
        get().fetchMyRank('streaks'),
        get().fetchMyRank('global')
      ]);

      set({ isLoading: false, lastUpdated: new Date() });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch leaderboards';
      set({ error: message, isLoading: false });
      console.error('Error fetching all leaderboards:', error);
    }
  },

  // Refresh Current Leaderboard
  refreshCurrentLeaderboard: async () => {
    const { activeTab } = get();

    switch (activeTab) {
      case 'xp':
        await get().fetchXPLeaderboard();
        await get().fetchMyRank('xp');
        break;
      case 'coins':
        await get().fetchCoinsLeaderboard();
        await get().fetchMyRank('coins');
        break;
      case 'streaks':
        await get().fetchStreaksLeaderboard();
        await get().fetchMyRank('streaks');
        break;
      case 'global':
        await get().fetchGlobalLeaderboard();
        await get().fetchMyRank('global');
        break;
    }
  },

  // Reset Store
  reset: () => {
    set({
      xpLeaderboard: [],
      coinsLeaderboard: [],
      streaksLeaderboard: [],
      globalLeaderboard: [],
      myXpRank: null,
      myCoinsRank: null,
      myStreaksRank: null,
      myGlobalRank: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      activeTab: 'global'
    });
  }
}));
