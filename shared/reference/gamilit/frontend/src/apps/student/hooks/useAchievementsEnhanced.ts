/**
 * useAchievementsEnhanced Hook
 * Enhanced hook with comprehensive filtering, search, and statistics
 * ~300 lines
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAchievementsStore } from '@/features/gamification/social/store/achievementsStore';
import type { Achievement, AchievementCategory, AchievementRarity } from '@/features/gamification/social/types/achievementsTypes';
import type { AchievementFiltersState, AchievementStatisticsData, FilterStatus, SortOption } from '../components/achievements/types';

const DEBOUNCE_DELAY = 300;

export interface UseAchievementsEnhancedResult {
  // Data
  achievements: Achievement[];
  filteredAchievements: Achievement[];
  statistics: AchievementStatisticsData;

  // Filters
  filters: AchievementFiltersState;
  setFilter: (key: keyof AchievementFiltersState, value: any) => void;
  clearFilters: () => void;

  // Navigation
  selectedAchievement: Achievement | null;
  selectAchievement: (achievement: Achievement | null) => void;
  nextAchievement: () => void;
  previousAchievement: () => void;
  hasNext: boolean;
  hasPrevious: boolean;

  // State
  loading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
}

const DEFAULT_FILTERS: AchievementFiltersState = {
  category: 'all',
  rarity: 'all',
  status: 'all',
  searchQuery: '',
  sortBy: 'recent',
};

export const useAchievementsEnhanced = (): UseAchievementsEnhancedResult => {
  // Store
  const {
    achievements,
    unlockedAchievements,
    stats,
    refreshAchievements,
  } = useAchievementsStore();

  // Local state
  const [filters, setFilters] = useState<AchievementFiltersState>(DEFAULT_FILTERS);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // Filter function
  const filterAchievements = useCallback((achievements: Achievement[]): Achievement[] => {
    let filtered = [...achievements];

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(a => a.category === filters.category);
    }

    // Rarity filter
    if (filters.rarity !== 'all') {
      filtered = filtered.filter(a => a.rarity === filters.rarity);
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'unlocked') {
        filtered = filtered.filter(a => a.isUnlocked);
      } else if (filters.status === 'locked') {
        filtered = filtered.filter(a => !a.isUnlocked);
      } else if (filters.status === 'in_progress') {
        filtered = filtered.filter(a => !a.isUnlocked && a.progress && a.progress.current > 0);
      }
    }

    // Search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [filters.category, filters.rarity, filters.status, debouncedSearchQuery]);

  // Sort function
  const sortAchievements = useCallback((achievements: Achievement[]): Achievement[] => {
    const sorted = [...achievements];

    switch (filters.sortBy) {
      case 'recent':
        sorted.sort((a, b) => {
          if (!a.unlockedAt && !b.unlockedAt) return 0;
          if (!a.unlockedAt) return 1;
          if (!b.unlockedAt) return -1;
          return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
        });
        break;

      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'rarity':
        const rarityOrder: Record<AchievementRarity, number> = {
          legendary: 0,
          epic: 1,
          rare: 2,
          common: 3,
        };
        sorted.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;

      case 'progress':
        sorted.sort((a, b) => {
          const getProgress = (ach: Achievement) => {
            if (ach.isUnlocked) return 100;
            if (!ach.progress) return 0;
            return (ach.progress.current / ach.progress.required) * 100;
          };

          return getProgress(b) - getProgress(a);
        });
        break;

      default:
        break;
    }

    return sorted;
  }, [filters.sortBy]);

  // Filtered and sorted achievements
  const filteredAchievements = useMemo(() => {
    const filtered = filterAchievements(achievements);
    return sortAchievements(filtered);
  }, [achievements, filterAchievements, sortAchievements]);

  // Calculate statistics
  const statistics = useMemo((): AchievementStatisticsData => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.isUnlocked).length;
    const locked = total - unlocked;
    const inProgress = achievements.filter(
      a => !a.isUnlocked && a.progress && a.progress.current > 0
    ).length;
    const completionRate = total > 0 ? (unlocked / total) * 100 : 0;

    // Calculate points and coins earned
    const pointsEarned = achievements
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.xpReward, 0);

    const mlCoinsEarned = achievements
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.mlCoinsReward, 0);

    // By rarity
    const byRarity: Record<AchievementRarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };
    achievements.filter(a => a.isUnlocked).forEach(a => {
      byRarity[a.rarity]++;
    });

    // By category
    const byCategory: Record<AchievementCategory, number> = {
      progress: 0,
      streak: 0,
      completion: 0,
      social: 0,
      special: 0,
      mastery: 0,
      exploration: 0,
      collection: 0,
      hidden: 0,
    };
    achievements.filter(a => a.isUnlocked).forEach(a => {
      byCategory[a.category]++;
    });

    // Recent unlocks (last 5)
    const recentUnlocks = achievements
      .filter(a => a.isUnlocked && a.unlockedAt)
      .sort((a, b) => {
        if (!a.unlockedAt || !b.unlockedAt) return 0;
        return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
      })
      .slice(0, 5);

    // Rarest unlocked achievements
    const rarityValues: Record<AchievementRarity, number> = {
      legendary: 4,
      epic: 3,
      rare: 2,
      common: 1,
    };
    const rarestUnlocked = achievements
      .filter(a => a.isUnlocked)
      .sort((a, b) => rarityValues[b.rarity] - rarityValues[a.rarity])
      .slice(0, 3);

    return {
      total,
      unlocked,
      locked,
      inProgress,
      completionRate,
      pointsEarned,
      mlCoinsEarned,
      byRarity,
      byCategory,
      recentUnlocks,
      rarestUnlocked,
    };
  }, [achievements]);

  // Filter management
  const setFilter = useCallback((key: keyof AchievementFiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Achievement navigation
  const selectAchievement = useCallback((achievement: Achievement | null) => {
    setSelectedAchievement(achievement);
  }, []);

  const currentIndex = useMemo(() => {
    if (!selectedAchievement) return -1;
    return filteredAchievements.findIndex(a => a.id === selectedAchievement.id);
  }, [selectedAchievement, filteredAchievements]);

  const hasNext = currentIndex >= 0 && currentIndex < filteredAchievements.length - 1;
  const hasPrevious = currentIndex > 0;

  const nextAchievement = useCallback(() => {
    if (hasNext) {
      setSelectedAchievement(filteredAchievements[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, filteredAchievements]);

  const previousAchievement = useCallback(() => {
    if (hasPrevious) {
      setSelectedAchievement(filteredAchievements[currentIndex - 1]);
    }
  }, [hasPrevious, currentIndex, filteredAchievements]);

  // Refresh achievements
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await refreshAchievements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, [refreshAchievements]);

  // Load achievements on mount
  useEffect(() => {
    if (achievements.length === 0) {
      refresh();
    }
  }, []);

  // Save filter preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('achievements_filters', JSON.stringify(filters));
    } catch (err) {
      console.error('Failed to save filters to localStorage:', err);
    }
  }, [filters]);

  // Load filter preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('achievements_filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFilters({ ...DEFAULT_FILTERS, ...parsed });
      }
    } catch (err) {
      console.error('Failed to load filters from localStorage:', err);
    }
  }, []);

  return {
    // Data
    achievements,
    filteredAchievements,
    statistics,

    // Filters
    filters,
    setFilter,
    clearFilters,

    // Navigation
    selectedAchievement,
    selectAchievement,
    nextAchievement,
    previousAchievement,
    hasNext,
    hasPrevious,

    // State
    loading,
    error,

    // Actions
    refresh,
  };
};
