/**
 * Leaderboards Integration Tests
 *
 * Tests for leaderboards system integrating store with API calls.
 *
 * Test Coverage:
 * - Store Initialization (2 tests): Initial state, structure
 * - Set Leaderboard Type (4 tests): Change type, mock data mode, API mode, error handling
 * - Set Time Period (4 tests): Change period, loading states, API calls
 * - Refresh Leaderboard (3 tests): Refresh data, update timestamp, error handling
 * - Loading States (2 tests): Loading flag, error state
 * - User Rank (2 tests): User rank tracking, null when not found
 * - Fallback to Mock Data (1 test): Error fallback
 *
 * Total: 18 tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLeaderboardsStore } from '../store/leaderboardsStore';
import type { LeaderboardEntry, LeaderboardType, TimePeriod } from '../types/leaderboardsTypes';
import * as socialAPI from '../api/socialAPI';
import { FEATURE_FLAGS } from '@/services/api/apiConfig';

// Mock the API module
vi.mock('../api/socialAPI', () => ({
  getLeaderboard: vi.fn(),
  getUserLeaderboardRank: vi.fn(),
}));

// Mock feature flags
vi.mock('@/services/api/apiConfig', () => ({
  FEATURE_FLAGS: {
    USE_MOCK_DATA: true,
  },
}));

describe('Leaderboards Integration Tests', () => {
  // ============================================================================
  // SETUP & MOCK DATA
  // ============================================================================

  const mockLeaderboardEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user-1',
      username: 'TopPlayer',
      avatar: '/avatars/top.png',
      rankBadge: "Ah K'in",
      score: 5000,
      xp: 15000,
      mlCoins: 8000,
      change: 0,
      changeType: 'same',
      isCurrentUser: false,
    },
    {
      rank: 2,
      userId: 'user-2',
      username: 'SecondPlace',
      avatar: '/avatars/second.png',
      rankBadge: "Ix K'an",
      score: 4500,
      xp: 12000,
      mlCoins: 6500,
      change: 1,
      changeType: 'up',
      isCurrentUser: false,
    },
  ];

  beforeEach(() => {
    // Reset store to initial state
    useLeaderboardsStore.setState({
      currentLeaderboard: {
        type: 'global',
        timePeriod: 'all-time',
        entries: [],
        userRank: undefined,
        totalParticipants: 0,
        lastUpdated: new Date(),
      },
      selectedType: 'global',
      selectedPeriod: 'all-time',
      loading: false,
      error: null,
    });

    // Clear all mocks
    vi.clearAllMocks();

    // Set default mock mode
    FEATURE_FLAGS.USE_MOCK_DATA = true;
  });

  // ============================================================================
  // STORE INITIALIZATION TESTS
  // ============================================================================

  describe('Store Initialization', () => {
    it('should initialize with correct structure', () => {
      const state = useLeaderboardsStore.getState();

      expect(state).toHaveProperty('currentLeaderboard');
      expect(state).toHaveProperty('selectedType');
      expect(state).toHaveProperty('selectedPeriod');
      expect(state).toHaveProperty('loading');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('setLeaderboardType');
      expect(state).toHaveProperty('setTimePeriod');
      expect(state).toHaveProperty('refreshLeaderboard');
    });

    it('should start with global all-time leaderboard', () => {
      const state = useLeaderboardsStore.getState();

      expect(state.selectedType).toBe('global');
      expect(state.selectedPeriod).toBe('all-time');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // ============================================================================
  // SET LEADERBOARD TYPE TESTS
  // ============================================================================

  describe('Set Leaderboard Type', () => {
    it('should change leaderboard type with mock data', async () => {
      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('friends');

      const state = useLeaderboardsStore.getState();

      expect(state.selectedType).toBe('friends');
      expect(state.currentLeaderboard.type).toBe('friends');
      expect(state.loading).toBe(false);
    });

    it('should reset loading state after type change', async () => {
      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('school');

      const state = useLeaderboardsStore.getState();

      // Should not be loading after completion
      expect(state.loading).toBe(false);
      expect(state.selectedType).toBe('school');
    });

    it('should fetch from API when USE_MOCK_DATA is false', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockResolvedValue(mockLeaderboardEntries);
      vi.mocked(socialAPI.getUserLeaderboardRank).mockResolvedValue({
        rank: 15,
        userId: 'current-user',
        username: 'CurrentUser',
        avatar: '/avatars/current.png',
        rankBadge: 'Ixim',
        score: 2000,
        xp: 5000,
        mlCoins: 3000,
        change: 0,
        changeType: 'same',
        isCurrentUser: true,
      });

      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('global');

      expect(socialAPI.getLeaderboard).toHaveBeenCalledWith('global', 'all-time');
      expect(socialAPI.getUserLeaderboardRank).toHaveBeenCalledWith('global', 'all-time');

      const state = useLeaderboardsStore.getState();
      expect(state.currentLeaderboard.entries).toHaveLength(2);
      expect(state.currentLeaderboard.userRank).toBe(15);
    });

    it('should handle API errors gracefully', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockRejectedValue(new Error('Network error'));

      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('global');

      const state = useLeaderboardsStore.getState();

      expect(state.error).toBe('Network error');
      expect(state.loading).toBe(false);
      // Should fallback to mock data
      expect(state.currentLeaderboard.entries.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // SET TIME PERIOD TESTS
  // ============================================================================

  describe('Set Time Period', () => {
    it('should change time period with mock data', async () => {
      const { setTimePeriod } = useLeaderboardsStore.getState();

      await setTimePeriod('weekly');

      const state = useLeaderboardsStore.getState();

      expect(state.selectedPeriod).toBe('weekly');
      expect(state.loading).toBe(false);
    });

    it('should reset loading state after period change', async () => {
      const { setTimePeriod } = useLeaderboardsStore.getState();

      await setTimePeriod('monthly');

      const state = useLeaderboardsStore.getState();

      // Should not be loading after completion
      expect(state.loading).toBe(false);
      expect(state.selectedPeriod).toBe('monthly');
    });

    it('should fetch from API when USE_MOCK_DATA is false', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockResolvedValue(mockLeaderboardEntries);
      vi.mocked(socialAPI.getUserLeaderboardRank).mockResolvedValue({
        rank: 10,
        userId: 'current-user',
        username: 'CurrentUser',
        avatar: '/avatars/current.png',
        rankBadge: 'Ixim',
        score: 3000,
        xp: 8000,
        mlCoins: 4000,
        change: -2,
        changeType: 'down',
        isCurrentUser: true,
      });

      const { setTimePeriod } = useLeaderboardsStore.getState();

      await setTimePeriod('daily');

      expect(socialAPI.getLeaderboard).toHaveBeenCalledWith('global', 'daily');

      const state = useLeaderboardsStore.getState();
      expect(state.currentLeaderboard.entries).toHaveLength(2);
      expect(state.currentLeaderboard.userRank).toBe(10);
    });

    it('should handle API errors on period change', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockRejectedValue(new Error('Timeout'));

      const { setTimePeriod } = useLeaderboardsStore.getState();

      await setTimePeriod('weekly');

      const state = useLeaderboardsStore.getState();

      expect(state.error).toBe('Timeout');
      expect(state.loading).toBe(false);
    });
  });

  // ============================================================================
  // REFRESH LEADERBOARD TESTS
  // ============================================================================

  describe('Refresh Leaderboard', () => {
    it('should refresh leaderboard with mock data', async () => {
      const { refreshLeaderboard } = useLeaderboardsStore.getState();

      const beforeRefresh = useLeaderboardsStore.getState().currentLeaderboard.lastUpdated;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      await refreshLeaderboard();

      const afterRefresh = useLeaderboardsStore.getState().currentLeaderboard.lastUpdated;

      expect(afterRefresh.getTime()).toBeGreaterThan(beforeRefresh.getTime());
    });

    it('should update lastUpdated timestamp', async () => {
      const { refreshLeaderboard } = useLeaderboardsStore.getState();

      const oldTimestamp = useLeaderboardsStore.getState().currentLeaderboard.lastUpdated;

      await new Promise((resolve) => setTimeout(resolve, 10));

      await refreshLeaderboard();

      const newTimestamp = useLeaderboardsStore.getState().currentLeaderboard.lastUpdated;

      expect(newTimestamp).not.toEqual(oldTimestamp);
    });

    it('should handle refresh errors', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockRejectedValue(new Error('Refresh failed'));

      const { refreshLeaderboard } = useLeaderboardsStore.getState();

      await refreshLeaderboard();

      const state = useLeaderboardsStore.getState();

      expect(state.error).toBe('Refresh failed');
      // Should still update timestamp on fallback
      expect(state.currentLeaderboard.lastUpdated).toBeDefined();
    });
  });

  // ============================================================================
  // LOADING STATES TESTS
  // ============================================================================

  describe('Loading States', () => {
    it('should reset loading to false after async operations', async () => {
      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('friends');

      const state = useLeaderboardsStore.getState();

      expect(state.loading).toBe(false);
      expect(state.selectedType).toBe('friends');
    });

    it('should clear error on successful operation', async () => {
      // Set initial error
      useLeaderboardsStore.setState({ error: 'Previous error' });

      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('global');

      const state = useLeaderboardsStore.getState();

      expect(state.error).toBeNull();
    });
  });

  // ============================================================================
  // USER RANK TESTS
  // ============================================================================

  describe('User Rank', () => {
    it('should track user rank when available', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockResolvedValue(mockLeaderboardEntries);
      vi.mocked(socialAPI.getUserLeaderboardRank).mockResolvedValue({
        rank: 5,
        userId: 'current-user',
        username: 'CurrentUser',
        avatar: '/avatars/current.png',
        rankBadge: 'Ixim',
        score: 3500,
        xp: 9000,
        mlCoins: 4500,
        change: 0,
        changeType: 'same',
        isCurrentUser: true,
      });

      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('global');

      const state = useLeaderboardsStore.getState();

      expect(state.currentLeaderboard.userRank).toBe(5);
    });

    it('should set user rank to null when not found', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockResolvedValue(mockLeaderboardEntries);
      vi.mocked(socialAPI.getUserLeaderboardRank).mockRejectedValue(new Error('Not ranked'));

      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('global');

      const state = useLeaderboardsStore.getState();

      expect(state.currentLeaderboard.userRank).toBeNull();
    });
  });

  // ============================================================================
  // FALLBACK TO MOCK DATA TEST
  // ============================================================================

  describe('Fallback to Mock Data', () => {
    it('should fallback to mock data on API error', async () => {
      FEATURE_FLAGS.USE_MOCK_DATA = false;

      vi.mocked(socialAPI.getLeaderboard).mockRejectedValue(new Error('API Error'));

      const { setLeaderboardType } = useLeaderboardsStore.getState();

      await setLeaderboardType('school');

      const state = useLeaderboardsStore.getState();

      // Should have error but still show mock data
      expect(state.error).toBe('API Error');
      expect(state.currentLeaderboard.entries.length).toBeGreaterThan(0);
      expect(state.currentLeaderboard.type).toBe('school');
    });
  });
});
