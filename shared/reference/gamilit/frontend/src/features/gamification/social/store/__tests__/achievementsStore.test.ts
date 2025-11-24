/**
 * AchievementsStore Tests
 *
 * Test Coverage:
 * - Initial State (4 tests): Default values, stats calculation
 * - Unlock Achievement (6 tests): Unlock flow, notifications, stats update
 * - Update Progress (7 tests): Progress tracking, auto-unlock, stats
 * - Dismiss Notification (2 tests): Remove notifications
 * - Filter by Category (3 tests): Category filtering
 * - Refresh Achievements (2 tests): Stats recalculation
 * - Fetch Achievements (6 tests): API integration, error handling
 * - Stats Calculation (6 tests): Various stat calculations
 * - Edge Cases (4 tests): Duplicate unlocks, invalid IDs
 *
 * Total: 40 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAchievementsStore } from '../achievementsStore';
import type { Achievement } from '../../types/achievementsTypes';
import * as achievementsAPI from '../../api/achievementsAPI';

// Mock the API module
vi.mock('../../api/achievementsAPI', () => ({
  getUserAchievements: vi.fn(),
  mapAchievementsToFrontend: vi.fn(),
  updateAchievementProgress: vi.fn(),
  checkAchievements: vi.fn(),
}));

// Mock data
const mockAchievement: Achievement = {
  id: 'ach-1',
  name: 'First Steps',
  nameSpanish: 'Primeros Pasos',
  description: 'Complete your first exercise',
  descriptionSpanish: 'Completa tu primer ejercicio',
  icon: 'trophy',
  category: 'progress',
  rarity: 'common',
  mlCoinsReward: 10,
  xpReward: 50,
  isUnlocked: false,
  unlockedAt: undefined,
  progress: {
    current: 0,
    required: 1,
  },
};

const mockUnlockedAchievement: Achievement = {
  ...mockAchievement,
  id: 'ach-2',
  name: 'Explorer',
  isUnlocked: true,
  unlockedAt: new Date('2025-01-01'),
};

describe('AchievementsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAchievementsStore.setState({
      achievements: [mockAchievement, mockUnlockedAchievement],
      unlockedAchievements: [mockUnlockedAchievement],
      recentUnlocks: [],
      selectedCategory: null,
      isLoading: false,
      error: null,
      stats: {
        totalAchievements: 2,
        unlockedAchievements: 1,
        progressAchievements: 0,
        masteryAchievements: 0,
        socialAchievements: 0,
        hiddenAchievements: 0,
        totalMlCoinsEarned: 10,
        totalXpEarned: 50,
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Initial State Tests
  // ============================================================

  describe('Initial State', () => {
    it('should have initial state with achievements', () => {
      const state = useAchievementsStore.getState();

      expect(state.achievements).toHaveLength(2);
      expect(state.unlockedAchievements).toHaveLength(1);
      expect(state.recentUnlocks).toHaveLength(0);
      expect(state.selectedCategory).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should calculate stats correctly in initial state', () => {
      const state = useAchievementsStore.getState();

      expect(state.stats.totalAchievements).toBe(2);
      expect(state.stats.unlockedAchievements).toBe(1);
      expect(state.stats.totalMlCoinsEarned).toBe(10);
      expect(state.stats.totalXpEarned).toBe(50);
    });

    it('should have unlocked achievements filtered correctly', () => {
      const state = useAchievementsStore.getState();

      expect(state.unlockedAchievements).toHaveLength(1);
      expect(state.unlockedAchievements[0].isUnlocked).toBe(true);
      expect(state.unlockedAchievements[0].id).toBe('ach-2');
    });

    it('should have no recent unlocks initially', () => {
      const state = useAchievementsStore.getState();

      expect(state.recentUnlocks).toEqual([]);
    });
  });

  // ============================================================
  // Unlock Achievement Tests
  // ============================================================

  describe('Unlock Achievement', () => {
    it('should unlock an achievement successfully', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      unlockAchievement('ach-1');

      const state = useAchievementsStore.getState();
      const achievement = state.achievements.find((a) => a.id === 'ach-1');

      expect(achievement?.isUnlocked).toBe(true);
      expect(achievement?.unlockedAt).toBeInstanceOf(Date);
    });

    it('should add achievement to unlockedAchievements list', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      unlockAchievement('ach-1');

      const state = useAchievementsStore.getState();
      expect(state.unlockedAchievements).toHaveLength(2);
      expect(state.unlockedAchievements.some((a) => a.id === 'ach-1')).toBe(
        true
      );
    });

    it('should create notification for unlocked achievement', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      unlockAchievement('ach-1');

      const state = useAchievementsStore.getState();
      expect(state.recentUnlocks).toHaveLength(1);
      expect(state.recentUnlocks[0].achievement.id).toBe('ach-1');
      expect(state.recentUnlocks[0].timestamp).toBeInstanceOf(Date);
    });

    it('should show confetti for epic/legendary achievements', () => {
      // Add epic achievement
      useAchievementsStore.setState({
        achievements: [
          ...useAchievementsStore.getState().achievements,
          { ...mockAchievement, id: 'ach-epic', rarity: 'epic' },
        ],
      });

      const { unlockAchievement } = useAchievementsStore.getState();
      unlockAchievement('ach-epic');

      const state = useAchievementsStore.getState();
      const notification = state.recentUnlocks.find(
        (n) => n.achievement.id === 'ach-epic'
      );

      expect(notification?.showConfetti).toBe(true);
    });

    it('should NOT show confetti for common/rare achievements', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      unlockAchievement('ach-1');

      const state = useAchievementsStore.getState();
      const notification = state.recentUnlocks[0];

      expect(notification.showConfetti).toBe(false);
    });

    it('should update stats after unlocking', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      unlockAchievement('ach-1');

      const state = useAchievementsStore.getState();
      expect(state.stats.unlockedAchievements).toBe(2);
      expect(state.stats.totalMlCoinsEarned).toBe(20); // 10 + 10
      expect(state.stats.totalXpEarned).toBe(100); // 50 + 50
    });
  });

  // ============================================================
  // Update Progress Tests
  // ============================================================

  describe('Update Progress', () => {
    it('should update achievement progress', () => {
      const { updateProgress } = useAchievementsStore.getState();

      updateProgress('ach-1', 5);

      const state = useAchievementsStore.getState();
      const achievement = state.achievements.find((a) => a.id === 'ach-1');

      expect(achievement?.progress?.current).toBe(5);
    });

    it('should NOT update progress for achievements without progress tracking', () => {
      // Add achievement without progress
      useAchievementsStore.setState({
        achievements: [
          ...useAchievementsStore.getState().achievements,
          { ...mockAchievement, id: 'ach-no-progress', progress: undefined },
        ],
      });

      const { updateProgress } = useAchievementsStore.getState();
      updateProgress('ach-no-progress', 5);

      const state = useAchievementsStore.getState();
      const achievement = state.achievements.find(
        (a) => a.id === 'ach-no-progress'
      );

      expect(achievement?.progress).toBeUndefined();
    });

    it('should auto-unlock when progress reaches required', () => {
      const { updateProgress } = useAchievementsStore.getState();

      updateProgress('ach-1', 1); // required is 1

      const state = useAchievementsStore.getState();
      const achievement = state.achievements.find((a) => a.id === 'ach-1');

      expect(achievement?.isUnlocked).toBe(true);
      expect(achievement?.unlockedAt).toBeInstanceOf(Date);
    });

    it('should auto-unlock when progress exceeds required', () => {
      const { updateProgress } = useAchievementsStore.getState();

      updateProgress('ach-1', 10); // required is 1

      const state = useAchievementsStore.getState();
      const achievement = state.achievements.find((a) => a.id === 'ach-1');

      expect(achievement?.isUnlocked).toBe(true);
      expect(achievement?.progress?.current).toBe(10);
    });

    it('should NOT auto-unlock if already unlocked', () => {
      const { updateProgress } = useAchievementsStore.getState();

      const initialUnlockedCount =
        useAchievementsStore.getState().unlockedAchievements.length;

      updateProgress('ach-2', 10); // already unlocked

      const state = useAchievementsStore.getState();
      expect(state.unlockedAchievements.length).toBe(initialUnlockedCount);
    });

    it('should update stats after progress update', () => {
      const { updateProgress } = useAchievementsStore.getState();

      updateProgress('ach-1', 1); // This will auto-unlock

      const state = useAchievementsStore.getState();
      expect(state.stats.unlockedAchievements).toBe(2);
    });

    it('should update unlockedAchievements list after auto-unlock', () => {
      const { updateProgress } = useAchievementsStore.getState();

      updateProgress('ach-1', 1);

      const state = useAchievementsStore.getState();
      expect(state.unlockedAchievements).toHaveLength(2);
      expect(state.unlockedAchievements.some((a) => a.id === 'ach-1')).toBe(
        true
      );
    });
  });

  // ============================================================
  // Dismiss Notification Tests
  // ============================================================

  describe('Dismiss Notification', () => {
    it('should remove notification from recentUnlocks', () => {
      const { unlockAchievement, dismissNotification } =
        useAchievementsStore.getState();

      // First unlock to create notification
      unlockAchievement('ach-1');
      expect(useAchievementsStore.getState().recentUnlocks).toHaveLength(1);

      // Then dismiss
      dismissNotification('ach-1');

      const state = useAchievementsStore.getState();
      expect(state.recentUnlocks).toHaveLength(0);
    });

    it('should only remove specific notification', () => {
      // Add achievement and unlock both
      useAchievementsStore.setState({
        achievements: [
          ...useAchievementsStore.getState().achievements,
          { ...mockAchievement, id: 'ach-3' },
        ],
      });

      const { unlockAchievement, dismissNotification } =
        useAchievementsStore.getState();

      unlockAchievement('ach-1');
      unlockAchievement('ach-3');

      expect(useAchievementsStore.getState().recentUnlocks).toHaveLength(2);

      // Dismiss only one
      dismissNotification('ach-1');

      const state = useAchievementsStore.getState();
      expect(state.recentUnlocks).toHaveLength(1);
      expect(state.recentUnlocks[0].achievement.id).toBe('ach-3');
    });
  });

  // ============================================================
  // Filter by Category Tests
  // ============================================================

  describe('Filter by Category', () => {
    it('should set selected category', () => {
      const { filterByCategory } = useAchievementsStore.getState();

      filterByCategory('mastery');

      const state = useAchievementsStore.getState();
      expect(state.selectedCategory).toBe('mastery');
    });

    it('should clear category filter with null', () => {
      const { filterByCategory } = useAchievementsStore.getState();

      filterByCategory('mastery');
      expect(useAchievementsStore.getState().selectedCategory).toBe('mastery');

      filterByCategory(null);

      const state = useAchievementsStore.getState();
      expect(state.selectedCategory).toBeNull();
    });

    it('should allow changing category filter', () => {
      const { filterByCategory } = useAchievementsStore.getState();

      filterByCategory('progress');
      expect(useAchievementsStore.getState().selectedCategory).toBe('progress');

      filterByCategory('social');

      const state = useAchievementsStore.getState();
      expect(state.selectedCategory).toBe('social');
    });
  });

  // ============================================================
  // Refresh Achievements Tests
  // ============================================================

  describe('Refresh Achievements', () => {
    it('should recalculate stats', () => {
      const { refreshAchievements } = useAchievementsStore.getState();

      // Manually unlock an achievement
      const updatedAchievements = useAchievementsStore
        .getState()
        .achievements.map((a) =>
          a.id === 'ach-1' ? { ...a, isUnlocked: true } : a
        );

      useAchievementsStore.setState({
        achievements: updatedAchievements,
      });

      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.stats.unlockedAchievements).toBe(2);
      expect(state.stats.totalMlCoinsEarned).toBe(20);
    });

    it('should maintain existing state except stats', () => {
      const { refreshAchievements } = useAchievementsStore.getState();

      const achievementsCount = useAchievementsStore.getState().achievements
        .length;
      const notificationsCount =
        useAchievementsStore.getState().recentUnlocks.length;

      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.achievements.length).toBe(achievementsCount);
      expect(state.recentUnlocks.length).toBe(notificationsCount);
    });
  });

  // ============================================================
  // Fetch Achievements Tests (API)
  // ============================================================

  describe('Fetch Achievements (API)', () => {
    it('should set loading state during fetch', async () => {
      vi.mocked(achievementsAPI.getUserAchievements).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { fetchAchievements } = useAchievementsStore.getState();
      const fetchPromise = fetchAchievements('user-123');

      // Check loading state immediately
      expect(useAchievementsStore.getState().isLoading).toBe(true);

      await fetchPromise;
    });

    it('should fetch and update achievements from API', async () => {
      const mockAPIAchievements = [mockAchievement, mockUnlockedAchievement];

      vi.mocked(achievementsAPI.getUserAchievements).mockResolvedValue(
        mockAPIAchievements as any
      );
      vi.mocked(achievementsAPI.mapAchievementsToFrontend).mockReturnValue(
        mockAPIAchievements
      );

      const { fetchAchievements } = useAchievementsStore.getState();
      await fetchAchievements('user-123');

      expect(achievementsAPI.getUserAchievements).toHaveBeenCalledWith(
        'user-123'
      );
      expect(achievementsAPI.mapAchievementsToFrontend).toHaveBeenCalled();
    });

    it('should update state after successful fetch', async () => {
      const mockAPIAchievements = [mockUnlockedAchievement];

      vi.mocked(achievementsAPI.getUserAchievements).mockResolvedValue(
        mockAPIAchievements as any
      );
      vi.mocked(achievementsAPI.mapAchievementsToFrontend).mockReturnValue(
        mockAPIAchievements
      );

      const { fetchAchievements } = useAchievementsStore.getState();
      await fetchAchievements('user-123');

      const state = useAchievementsStore.getState();
      expect(state.achievements).toEqual(mockAPIAchievements);
      expect(state.unlockedAchievements).toHaveLength(1);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle API errors', async () => {
      vi.mocked(achievementsAPI.getUserAchievements).mockRejectedValue(
        new Error('Network error')
      );

      const { fetchAchievements } = useAchievementsStore.getState();
      await fetchAchievements('user-123');

      const state = useAchievementsStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('should set generic error message for non-Error failures', async () => {
      vi.mocked(achievementsAPI.getUserAchievements).mockRejectedValue(
        'String error'
      );

      const { fetchAchievements } = useAchievementsStore.getState();
      await fetchAchievements('user-123');

      const state = useAchievementsStore.getState();
      expect(state.error).toBe('Failed to fetch achievements');
    });

    it('should calculate stats after fetching', async () => {
      const mockAPIAchievements = [mockUnlockedAchievement];

      vi.mocked(achievementsAPI.getUserAchievements).mockResolvedValue(
        mockAPIAchievements as any
      );
      vi.mocked(achievementsAPI.mapAchievementsToFrontend).mockReturnValue(
        mockAPIAchievements
      );

      const { fetchAchievements } = useAchievementsStore.getState();
      await fetchAchievements('user-123');

      const state = useAchievementsStore.getState();
      expect(state.stats.totalAchievements).toBe(1);
      expect(state.stats.unlockedAchievements).toBe(1);
    });
  });

  // ============================================================
  // Stats Calculation Tests
  // ============================================================

  describe('Stats Calculation', () => {
    it('should calculate total achievements correctly', () => {
      const state = useAchievementsStore.getState();

      expect(state.stats.totalAchievements).toBe(2);
    });

    it('should calculate unlocked achievements by category', () => {
      // Set up achievements with different categories
      useAchievementsStore.setState({
        achievements: [
          { ...mockUnlockedAchievement, id: 'a1', category: 'progress' },
          { ...mockUnlockedAchievement, id: 'a2', category: 'mastery' },
          { ...mockUnlockedAchievement, id: 'a3', category: 'social' },
          { ...mockUnlockedAchievement, id: 'a4', category: 'hidden' },
        ],
      });

      const { refreshAchievements } = useAchievementsStore.getState();
      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.stats.progressAchievements).toBe(1);
      expect(state.stats.masteryAchievements).toBe(1);
      expect(state.stats.socialAchievements).toBe(1);
      expect(state.stats.hiddenAchievements).toBe(1);
    });

    it('should calculate total ML Coins earned', () => {
      useAchievementsStore.setState({
        achievements: [
          { ...mockUnlockedAchievement, id: 'a1', mlCoinsReward: 10 },
          { ...mockUnlockedAchievement, id: 'a2', mlCoinsReward: 20 },
          { ...mockUnlockedAchievement, id: 'a3', mlCoinsReward: 30 },
        ],
      });

      const { refreshAchievements } = useAchievementsStore.getState();
      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.stats.totalMlCoinsEarned).toBe(60);
    });

    it('should calculate total XP earned', () => {
      useAchievementsStore.setState({
        achievements: [
          { ...mockUnlockedAchievement, id: 'a1', xpReward: 50 },
          { ...mockUnlockedAchievement, id: 'a2', xpReward: 100 },
          { ...mockUnlockedAchievement, id: 'a3', xpReward: 150 },
        ],
      });

      const { refreshAchievements } = useAchievementsStore.getState();
      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.stats.totalXpEarned).toBe(300);
    });

    it('should only count unlocked achievements in stats', () => {
      useAchievementsStore.setState({
        achievements: [
          { ...mockAchievement, id: 'a1', isUnlocked: false, mlCoinsReward: 10 },
          { ...mockUnlockedAchievement, id: 'a2', mlCoinsReward: 20 },
        ],
      });

      const { refreshAchievements } = useAchievementsStore.getState();
      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.stats.unlockedAchievements).toBe(1);
      expect(state.stats.totalMlCoinsEarned).toBe(20); // Only unlocked
    });

    it('should handle empty achievements array', () => {
      useAchievementsStore.setState({
        achievements: [],
      });

      const { refreshAchievements } = useAchievementsStore.getState();
      refreshAchievements();

      const state = useAchievementsStore.getState();
      expect(state.stats.totalAchievements).toBe(0);
      expect(state.stats.unlockedAchievements).toBe(0);
      expect(state.stats.totalMlCoinsEarned).toBe(0);
      expect(state.stats.totalXpEarned).toBe(0);
    });
  });

  // ============================================================
  // Edge Cases Tests
  // ============================================================

  describe('Edge Cases', () => {
    it('should NOT unlock already unlocked achievement', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      const unlockedCount =
        useAchievementsStore.getState().unlockedAchievements.length;
      const notificationsCount =
        useAchievementsStore.getState().recentUnlocks.length;

      // Try to unlock already unlocked achievement
      unlockAchievement('ach-2');

      const state = useAchievementsStore.getState();
      expect(state.unlockedAchievements.length).toBe(unlockedCount);
      expect(state.recentUnlocks.length).toBe(notificationsCount);
    });

    it('should handle unlock with invalid achievement ID', () => {
      const { unlockAchievement } = useAchievementsStore.getState();

      const initialState = useAchievementsStore.getState();

      // Try to unlock non-existent achievement
      unlockAchievement('invalid-id');

      const state = useAchievementsStore.getState();
      expect(state.achievements).toEqual(initialState.achievements);
      expect(state.unlockedAchievements).toEqual(
        initialState.unlockedAchievements
      );
    });

    it('should handle update progress with invalid achievement ID', () => {
      const { updateProgress } = useAchievementsStore.getState();

      const initialState = useAchievementsStore.getState();

      // Try to update progress for non-existent achievement
      updateProgress('invalid-id', 10);

      const state = useAchievementsStore.getState();
      expect(state.achievements).toEqual(initialState.achievements);
    });

    it('should handle dismiss notification with invalid ID', () => {
      const { unlockAchievement, dismissNotification } =
        useAchievementsStore.getState();

      unlockAchievement('ach-1');
      const notificationsCount =
        useAchievementsStore.getState().recentUnlocks.length;

      // Try to dismiss non-existent notification
      dismissNotification('invalid-id');

      const state = useAchievementsStore.getState();
      expect(state.recentUnlocks.length).toBe(notificationsCount);
    });
  });
});
