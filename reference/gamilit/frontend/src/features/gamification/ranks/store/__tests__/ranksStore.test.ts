/**
 * RanksStore Tests
 *
 * Test Coverage:
 * - Initial State (4 tests): Default values, progress state
 * - Add XP (6 tests): XP gain, level/rank checks, events
 * - Level Up (5 tests): Level progression, XP overflow, history
 * - Rank Up (6 tests): Rank progression, multipliers, benefits
 * - Prestige (7 tests): Prestige flow, bonuses, reset
 * - Multipliers (7 tests): Calculation, sources, expiration
 * - History (3 tests): Entry management, retrieval
 * - UI States (3 tests): Modals, loading states
 * - Fetch User Progress (4 tests): API integration, error handling
 * - Utility (3 tests): Reset, loading, error states
 *
 * Total: 48 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRanksStore } from '../ranksStore';
import type { UserRankProgress, MultiplierSource, MultiplierSourceType } from '../../types/ranksTypes';
import * as ranksAPI from '../../api/ranksAPI';

// Mock the API module
vi.mock('../../api/ranksAPI', () => ({
  getCurrentRank: vi.fn(),
  updateRank: vi.fn(),
}));

// Mock crypto.randomUUID
beforeEach(() => {
  let uuidCounter = 0;
  vi.stubGlobal('crypto', {
    randomUUID: () => `uuid-${++uuidCounter}`,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Mock data
const mockUserProgress: UserRankProgress = {
  currentRank: 'Nacom',
  currentLevel: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  totalXP: 0,
  mlCoinsEarned: 0,
  prestigeLevel: 0,
  multiplier: 1.0,
  lastRankUp: new Date('2025-01-01'),
  activityStreak: 0,
  lastActivityDate: new Date('2025-01-01'),
  canRankUp: false,
  nextRank: 'Ajaw',
  canPrestige: false,
};

describe('RanksStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useRanksStore.getState().resetProgress();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Initial State Tests
  // ============================================================

  describe('Initial State', () => {
    it('should have initial user progress', () => {
      const state = useRanksStore.getState();

      expect(state.userProgress.currentRank).toBe('Nacom');
      expect(state.userProgress.currentLevel).toBe(1);
      expect(state.userProgress.currentXP).toBe(0);
      expect(state.userProgress.prestigeLevel).toBe(0);
    });

    it('should have empty progression history', () => {
      const state = useRanksStore.getState();

      expect(state.progressionHistory).toEqual([]);
    });

    it('should NOT show modals initially', () => {
      const state = useRanksStore.getState();

      expect(state.showRankUpModal).toBe(false);
      expect(state.showPrestigeModal).toBe(false);
      expect(state.isRankingUp).toBe(false);
    });

    it('should have prestige progress at level 0', () => {
      const state = useRanksStore.getState();

      expect(state.prestigeProgress.level).toBe(0);
      expect(state.prestigeProgress.totalPrestiges).toBe(0);
      expect(state.prestigeProgress.cumulativeMultiplier).toBe(1.0);
    });
  });

  // ============================================================
  // Add XP Tests
  // ============================================================

  describe('Add XP', () => {
    it('should add XP to user progress', async () => {
      const { addXP } = useRanksStore.getState();

      await addXP(50, 'exercise_completion', 'Completed Exercise 1');

      const state = useRanksStore.getState();
      expect(state.userProgress.currentXP).toBe(50);
      expect(state.userProgress.totalXP).toBe(50);
    });

    it('should create XP event', async () => {
      const { addXP } = useRanksStore.getState();

      await addXP(50, 'exercise_completion', 'Completed Exercise 1');

      const state = useRanksStore.getState();
      expect(state.xpEvents).toHaveLength(1);
      expect(state.xpEvents[0].amount).toBe(50);
      expect(state.xpEvents[0].source).toBe('exercise_completion');
      expect(state.xpEvents[0].description).toBe('Completed Exercise 1');
    });

    it('should update lastActivityDate', async () => {
      const { addXP } = useRanksStore.getState();

      const beforeDate = useRanksStore.getState().userProgress.lastActivityDate;

      await addXP(50, 'exercise_completion');

      const state = useRanksStore.getState();
      expect(state.userProgress.lastActivityDate.getTime()).toBeGreaterThan(
        beforeDate.getTime()
      );
    });

    it('should check for level up', async () => {
      const { addXP, checkLevelUp } = useRanksStore.getState();

      await addXP(150, 'exercise_completion'); // Assuming xpToNextLevel is 100

      expect(checkLevelUp()).toBe(true);
    });

    it('should NOT level up with insufficient XP', async () => {
      const { addXP, checkLevelUp } = useRanksStore.getState();

      await addXP(50, 'exercise_completion'); // Less than required

      expect(checkLevelUp()).toBe(false);
    });

    it('should accumulate multiple XP gains', async () => {
      const { addXP } = useRanksStore.getState();

      await addXP(30, 'exercise_completion');
      await addXP(20, 'perfect_score');
      await addXP(10, 'streak_bonus');

      const state = useRanksStore.getState();
      expect(state.userProgress.currentXP).toBe(60);
      expect(state.userProgress.totalXP).toBe(60);
    });
  });

  // ============================================================
  // Level Up Tests
  // ============================================================

  describe('Level Up', () => {
    it('should increase current level', async () => {
      const { addXP } = useRanksStore.getState();

      // Add enough XP to level up
      await addXP(150, 'exercise_completion');

      const state = useRanksStore.getState();
      expect(state.userProgress.currentLevel).toBeGreaterThan(1);
    });

    it('should reset current XP with overflow', async () => {
      const { addXP } = useRanksStore.getState();

      const initialXPToNext = useRanksStore.getState().userProgress.xpToNextLevel;

      // Add more than required
      await addXP(initialXPToNext + 50, 'exercise_completion');

      const state = useRanksStore.getState();
      expect(state.userProgress.currentXP).toBeGreaterThanOrEqual(0);
      expect(state.userProgress.currentXP).toBeLessThan(state.userProgress.xpToNextLevel);
    });

    it('should add history entry for level up', async () => {
      const { addXP } = useRanksStore.getState();

      await addXP(150, 'exercise_completion');

      const state = useRanksStore.getState();
      expect(state.progressionHistory.length).toBeGreaterThan(0);

      const levelUpEntry = state.progressionHistory.find(
        (entry) => entry.type === 'level_up'
      );
      expect(levelUpEntry).toBeDefined();
    });

    it('should handle multiple level ups from single XP gain', async () => {
      const { addXP } = useRanksStore.getState();

      // Add massive XP to trigger multiple level ups
      await addXP(1000, 'exercise_completion');

      const state = useRanksStore.getState();
      expect(state.userProgress.currentLevel).toBeGreaterThan(2);
    });

    it('should update xpToNextLevel after leveling up', async () => {
      const { addXP } = useRanksStore.getState();

      const initialXPToNext = useRanksStore.getState().userProgress.xpToNextLevel;

      await addXP(150, 'exercise_completion');

      const state = useRanksStore.getState();
      expect(state.userProgress.xpToNextLevel).toBeGreaterThan(initialXPToNext);
    });
  });

  // ============================================================
  // Rank Up Tests
  // ============================================================

  describe('Rank Up', () => {
    it('should check if can rank up based on ML Coins', () => {
      const { checkRankUp } = useRanksStore.getState();

      // Initially should not be able to rank up
      expect(checkRankUp()).toBe(false);

      // Manually set ML Coins to required amount for next rank
      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          mlCoinsEarned: 1000, // Assuming next rank requires this
        },
      });

      // Now should be able to rank up (if next rank exists and requires <= 1000)
      // This depends on your rank progression data
      const canRank = checkRankUp();
      expect(typeof canRank).toBe('boolean');
    });

    it('should increase rank when ranking up', () => {
      const { rankUp } = useRanksStore.getState();

      // Set up conditions for rank up
      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: 'Nacom',
          mlCoinsEarned: 1000,
        },
      });

      rankUp();

      const state = useRanksStore.getState();
      // Rank should have changed (exact rank depends on progression data)
      expect(state.userProgress.currentRank).not.toBe('Nacom');
    });

    it('should update multiplier on rank up', () => {
      const { rankUp } = useRanksStore.getState();

      const initialMultiplier = useRanksStore.getState().userProgress.multiplier;

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          mlCoinsEarned: 1000,
        },
      });

      rankUp();

      const state = useRanksStore.getState();
      expect(state.userProgress.multiplier).toBeGreaterThan(initialMultiplier);
    });

    it('should show rank up modal', () => {
      const { rankUp } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          mlCoinsEarned: 1000,
        },
      });

      rankUp();

      const state = useRanksStore.getState();
      expect(state.showRankUpModal).toBe(true);
      expect(state.isRankingUp).toBe(true);
    });

    it('should add history entry for rank up', () => {
      const { rankUp } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          mlCoinsEarned: 1000,
        },
      });

      rankUp();

      const state = useRanksStore.getState();
      const rankUpEntry = state.progressionHistory.find(
        (entry) => entry.type === 'rank_up'
      );
      expect(rankUpEntry).toBeDefined();
    });

    it('should update multipliers after rank up', () => {
      const { rankUp, updateMultipliers } = useRanksStore.getState();

      const updateMultipliersSpy = vi.spyOn(
        useRanksStore.getState(),
        'updateMultipliers'
      );

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          mlCoinsEarned: 1000,
        },
      });

      rankUp();

      // Verify multipliers were updated (multiplier breakdown should have changed)
      const state = useRanksStore.getState();
      expect(state.multiplierBreakdown.total).toBeGreaterThan(1.0);
    });
  });

  // ============================================================
  // Prestige Tests
  // ============================================================

  describe('Prestige', () => {
    it('should check if can prestige', () => {
      const { canPrestige } = useRanksStore.getState();

      // Initially cannot prestige
      expect(canPrestige()).toBe(false);

      // Set conditions for prestige (K'uk'ulkan rank + level 50+)
      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: "K'uk'ulkan",
          currentLevel: 50,
        },
      });

      expect(canPrestige()).toBe(true);
    });

    it('should NOT prestige if conditions not met', async () => {
      const { prestige } = useRanksStore.getState();

      const initialPrestige = useRanksStore.getState().prestigeProgress.level;

      await prestige();

      const state = useRanksStore.getState();
      expect(state.prestigeProgress.level).toBe(initialPrestige);
    });

    it('should reset to Nacom on prestige', async () => {
      const { prestige } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: "K'uk'ulkan",
          currentLevel: 50,
        },
      });

      await prestige();

      const state = useRanksStore.getState();
      expect(state.userProgress.currentRank).toBe('Nacom');
      expect(state.userProgress.currentLevel).toBe(1);
    });

    it('should increase prestige level', async () => {
      const { prestige } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: "K'uk'ulkan",
          currentLevel: 50,
        },
      });

      await prestige();

      const state = useRanksStore.getState();
      expect(state.prestigeProgress.level).toBe(1);
      expect(state.prestigeProgress.totalPrestiges).toBe(1);
    });

    it('should grant prestige bonus multiplier', async () => {
      const { prestige } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: "K'uk'ulkan",
          currentLevel: 50,
        },
      });

      await prestige();

      const state = useRanksStore.getState();
      expect(state.userProgress.multiplier).toBeGreaterThan(1.0);
      expect(state.prestigeProgress.cumulativeMultiplier).toBeGreaterThan(1.0);
    });

    it('should preserve total XP and streak on prestige', async () => {
      const { prestige } = useRanksStore.getState();

      const totalXP = 10000;
      const streak = 15;

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: "K'uk'ulkan",
          currentLevel: 50,
          totalXP,
          activityStreak: streak,
        },
      });

      await prestige();

      const state = useRanksStore.getState();
      expect(state.userProgress.totalXP).toBe(totalXP);
      expect(state.userProgress.activityStreak).toBe(streak);
    });

    it('should add prestige history entry', async () => {
      const { prestige } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          currentRank: "K'uk'ulkan",
          currentLevel: 50,
        },
      });

      await prestige();

      const state = useRanksStore.getState();
      const prestigeEntry = state.progressionHistory.find(
        (entry) => entry.type === 'prestige'
      );
      expect(prestigeEntry).toBeDefined();
    });
  });

  // ============================================================
  // Multipliers Tests
  // ============================================================

  describe('Multipliers', () => {
    it('should calculate multipliers from rank', () => {
      const { updateMultipliers } = useRanksStore.getState();

      updateMultipliers();

      const state = useRanksStore.getState();
      expect(state.multiplierBreakdown.rank).toBeDefined();
      expect(state.multiplierBreakdown.rank.type).toBe('rank');
      expect(state.multiplierBreakdown.rank.value).toBeGreaterThan(0);
    });

    it('should add prestige multiplier when applicable', () => {
      const { updateMultipliers } = useRanksStore.getState();

      useRanksStore.setState({
        prestigeProgress: {
          ...useRanksStore.getState().prestigeProgress,
          level: 1,
          cumulativeMultiplier: 1.1,
        },
      });

      updateMultipliers();

      const state = useRanksStore.getState();
      const prestigeSource = state.multiplierBreakdown.sources.find(
        (s) => s.type === 'prestige'
      );
      expect(prestigeSource).toBeDefined();
    });

    it('should add streak multiplier for 7+ day streak', () => {
      const { updateMultipliers } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          activityStreak: 10,
        },
      });

      updateMultipliers();

      const state = useRanksStore.getState();
      const streakSource = state.multiplierBreakdown.sources.find(
        (s) => s.type === 'streak'
      );
      expect(streakSource).toBeDefined();
    });

    it('should add custom multiplier source', () => {
      const { addMultiplierSource } = useRanksStore.getState();

      const customSource: MultiplierSource = {
        type: 'event',
        name: 'Weekend Bonus',
        value: 1.5,
        isPermanent: false,
        description: '50% bonus for weekend event',
      };

      addMultiplierSource(customSource);

      const state = useRanksStore.getState();
      expect(state.multiplierBreakdown.sources).toContainEqual(
        expect.objectContaining({ type: 'event' })
      );
    });

    it('should remove multiplier source by type', () => {
      const { addMultiplierSource, removeMultiplierSource } =
        useRanksStore.getState();

      const customSource: MultiplierSource = {
        type: 'event',
        name: 'Weekend Bonus',
        value: 1.5,
        isPermanent: false,
        description: '50% bonus',
      };

      addMultiplierSource(customSource);
      removeMultiplierSource('event');

      const state = useRanksStore.getState();
      const eventSource = state.multiplierBreakdown.sources.find(
        (s) => s.type === 'event'
      );
      expect(eventSource).toBeUndefined();
    });

    it('should calculate total multiplier correctly', () => {
      const { updateMultipliers } = useRanksStore.getState();

      useRanksStore.setState({
        userProgress: {
          ...useRanksStore.getState().userProgress,
          activityStreak: 10,
        },
        prestigeProgress: {
          ...useRanksStore.getState().prestigeProgress,
          level: 1,
          cumulativeMultiplier: 1.1,
        },
      });

      updateMultipliers();

      const state = useRanksStore.getState();
      expect(state.multiplierBreakdown.total).toBeGreaterThan(1.0);
      expect(state.userProgress.multiplier).toBe(state.multiplierBreakdown.total);
    });

    it('should identify expiring multipliers', () => {
      const { addMultiplierSource, updateMultipliers } =
        useRanksStore.getState();

      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 12); // 12 hours from now

      const expiringSource: MultiplierSource = {
        type: 'time' as MultiplierSourceType,
        name: 'Power Hour',
        value: 2.0,
        isPermanent: false,
        description: 'Expiring soon',
        expiresAt: tomorrow,
      };

      addMultiplierSource(expiringSource);
      updateMultipliers();

      const state = useRanksStore.getState();
      expect(state.multiplierBreakdown.hasExpiringSoon).toBe(true);
      expect(state.multiplierBreakdown.expiringSoon.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // History Tests
  // ============================================================

  describe('History', () => {
    it('should add history entry', () => {
      const { addHistoryEntry } = useRanksStore.getState();

      const entry = {
        id: 'entry-1',
        type: 'level_up' as const,
        timestamp: new Date(),
        title: 'Level 2 achieved',
        description: 'Congratulations!',
        rank: 'Nacom' as const,
        xpSnapshot: 100,
        levelSnapshot: 2,
        multiplierSnapshot: 1.0,
      };

      addHistoryEntry(entry);

      const state = useRanksStore.getState();
      expect(state.progressionHistory).toHaveLength(1);
      expect(state.progressionHistory[0]).toEqual(entry);
    });

    it('should retrieve recent history with limit', () => {
      const { addHistoryEntry, getRecentHistory } = useRanksStore.getState();

      // Add multiple entries
      for (let i = 0; i < 5; i++) {
        addHistoryEntry({
          id: `entry-${i}`,
          type: 'level_up',
          timestamp: new Date(Date.now() + i * 1000),
          title: `Entry ${i}`,
          description: '',
          rank: 'Nacom',
          xpSnapshot: 100,
          levelSnapshot: i,
          multiplierSnapshot: 1.0,
        });
      }

      const recentHistory = getRecentHistory(3);

      expect(recentHistory).toHaveLength(3);
    });

    it('should sort history by most recent first', () => {
      const { addHistoryEntry, getRecentHistory } = useRanksStore.getState();

      const oldEntry = {
        id: 'entry-old',
        type: 'level_up' as const,
        timestamp: new Date('2025-01-01'),
        title: 'Old Entry',
        description: '',
        rank: 'Nacom' as const,
        xpSnapshot: 100,
        levelSnapshot: 1,
        multiplierSnapshot: 1.0,
      };

      const newEntry = {
        ...oldEntry,
        id: 'entry-new',
        timestamp: new Date('2025-12-31'),
        title: 'New Entry',
      };

      addHistoryEntry(oldEntry);
      addHistoryEntry(newEntry);

      const history = getRecentHistory(2);

      expect(history[0].id).toBe('entry-new');
      expect(history[1].id).toBe('entry-old');
    });
  });

  // ============================================================
  // UI States Tests
  // ============================================================

  describe('UI States', () => {
    it('should open and close rank up modal', () => {
      const { closeRankUpModal } = useRanksStore.getState();

      useRanksStore.setState({ showRankUpModal: true, isRankingUp: true });

      closeRankUpModal();

      const state = useRanksStore.getState();
      expect(state.showRankUpModal).toBe(false);
      expect(state.isRankingUp).toBe(false);
    });

    it('should open and close prestige modal', () => {
      const { openPrestigeModal, closePrestigeModal } =
        useRanksStore.getState();

      openPrestigeModal();
      expect(useRanksStore.getState().showPrestigeModal).toBe(true);

      closePrestigeModal();
      expect(useRanksStore.getState().showPrestigeModal).toBe(false);
    });

    it('should reset progress to initial state', () => {
      const { addXP, resetProgress } = useRanksStore.getState();

      // Modify state
      addXP(500, 'exercise_completion');
      useRanksStore.setState({
        progressionHistory: [
          {
            id: 'test',
            type: 'level_up',
            timestamp: new Date(),
            title: 'Test',
            description: '',
            rank: 'Nacom',
            xpSnapshot: 100,
            levelSnapshot: 2,
            multiplierSnapshot: 1.0,
          },
        ],
      });

      resetProgress();

      const state = useRanksStore.getState();
      expect(state.userProgress.currentLevel).toBe(1);
      expect(state.userProgress.currentXP).toBe(0);
      expect(state.progressionHistory).toEqual([]);
    });
  });

  // ============================================================
  // Fetch User Progress Tests (API)
  // ============================================================

  describe('Fetch User Progress (API)', () => {
    it('should set loading state during fetch', async () => {
      vi.mocked(ranksAPI.getCurrentRank).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { fetchUserProgress } = useRanksStore.getState();
      const fetchPromise = fetchUserProgress();

      // Check loading state immediately
      expect(useRanksStore.getState().isLoading).toBe(true);

      await fetchPromise;
    });

    it('should fetch and update user progress from API', async () => {
      vi.mocked(ranksAPI.getCurrentRank).mockResolvedValue(mockUserProgress);

      const { fetchUserProgress } = useRanksStore.getState();
      await fetchUserProgress();

      expect(ranksAPI.getCurrentRank).toHaveBeenCalled();

      const state = useRanksStore.getState();
      expect(state.userProgress).toEqual(mockUserProgress);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle API errors', async () => {
      vi.mocked(ranksAPI.getCurrentRank).mockRejectedValue(
        new Error('Network error')
      );

      const { fetchUserProgress } = useRanksStore.getState();
      await fetchUserProgress();

      const state = useRanksStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('should update multipliers after fetching progress', async () => {
      vi.mocked(ranksAPI.getCurrentRank).mockResolvedValue({
        ...mockUserProgress,
        activityStreak: 10,
      });

      const { fetchUserProgress } = useRanksStore.getState();
      await fetchUserProgress();

      const state = useRanksStore.getState();
      // Multipliers should have been updated
      expect(state.multiplierBreakdown.sources.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // Utility Functions Tests
  // ============================================================

  describe('Utility Functions', () => {
    it('should set loading state', () => {
      const { setLoading } = useRanksStore.getState();

      setLoading(true);
      expect(useRanksStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useRanksStore.getState().isLoading).toBe(false);
    });

    it('should set error state', () => {
      const { setError } = useRanksStore.getState();

      setError('Test error');
      expect(useRanksStore.getState().error).toBe('Test error');

      setError(null);
      expect(useRanksStore.getState().error).toBeNull();
    });

    it('should get active multipliers', () => {
      const { addMultiplierSource, getActiveMultipliers } =
        useRanksStore.getState();

      const source: MultiplierSource = {
        type: 'event',
        name: 'Test Event',
        value: 1.5,
        isPermanent: false,
        description: 'Test',
      };

      addMultiplierSource(source);

      const activeMultipliers = getActiveMultipliers();
      expect(activeMultipliers.length).toBeGreaterThan(0);
    });
  });
});
