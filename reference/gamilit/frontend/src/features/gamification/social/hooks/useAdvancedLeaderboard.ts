/**
 * useAdvancedLeaderboard Hook
 *
 * Enhanced hook for leaderboard management with advanced features
 * Features:
 * - Multiple leaderboard types (global, school, grade, friends, guild)
 * - Time period filtering
 * - Metric selection
 * - API integration with caching
 * - Auto-refresh
 * - Export functionality
 * - Search functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LeaderboardEntry } from '../types/leaderboardsTypes';
import type { ExtendedLeaderboardType } from '../components/Leaderboards/EnhancedLeaderboardTabs';
import type { TimePeriod, Metric } from '../components/Leaderboards/LeaderboardFilters';
import { exportLeaderboard } from '../utils/leaderboardExport';

interface LeaderboardCache {
  data: LeaderboardEntry[];
  timestamp: number;
}

interface UseLeaderboardResult {
  // Data
  leaderboard: LeaderboardEntry[];
  filteredLeaderboard: LeaderboardEntry[];
  userPosition: LeaderboardEntry | null;
  topThree: LeaderboardEntry[];
  totalParticipants: number;

  // Filters
  currentTab: ExtendedLeaderboardType;
  setTab: (tab: ExtendedLeaderboardType) => void;
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
  metric: Metric;
  setMetric: (metric: Metric) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // States
  loading: boolean;
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
  exportData: (format: 'csv' | 'pdf') => Promise<void>;

  // Counts for tabs
  tabCounts: Partial<Record<ExtendedLeaderboardType, number>>;
}

const CACHE_DURATION = 60000; // 60 seconds
const AUTO_REFRESH_INTERVAL = 60000; // 60 seconds

// Mock data generator - Replace with actual API calls
const generateMockData = (
  type: ExtendedLeaderboardType,
  count: number = 100,
  currentUserId: string = 'user-123'
): LeaderboardEntry[] => {
  const mockUsers = Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    userId: i === 50 ? currentUserId : `user-${i}`,
    username: i === 50 ? 'Tú' : `Usuario ${i + 1}`,
    avatar: `https://ui-avatars.com/api/?name=User${i + 1}&background=f97316&color=fff`,
    rankBadge: ['Principiante', 'Intermedio', 'Avanzado', 'Experto', 'Maestro'][Math.floor(i / 20) % 5],
    score: 10000 - i * 100 + Math.random() * 50,
    xp: 10000 - i * 100 + Math.random() * 50,
    mlCoins: Math.floor(Math.random() * 1000) + 100,
    change: Math.floor(Math.random() * 10) - 5,
    changeType: (Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same') as any,
    isCurrentUser: i === 50,
  }));

  return mockUsers;
};

export const useAdvancedLeaderboard = (
  initialTab: ExtendedLeaderboardType = 'global',
  currentUserId?: string
): UseLeaderboardResult => {
  // State
  const [currentTab, setCurrentTab] = useState<ExtendedLeaderboardType>(initialTab);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all_time');
  const [metric, setMetric] = useState<Metric>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, LeaderboardCache>>(new Map());
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  // Generate cache key
  const getCacheKey = useCallback((
    tab: ExtendedLeaderboardType,
    period: TimePeriod,
    metricType: Metric
  ) => {
    return `${tab}-${period}-${metricType}`;
  }, []);

  // Check if cache is valid
  const isCacheValid = useCallback((cacheEntry: LeaderboardCache | undefined): boolean => {
    if (!cacheEntry) return false;
    return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
  }, []);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (
    tab: ExtendedLeaderboardType,
    period: TimePeriod,
    metricType: Metric,
    forceRefresh = false
  ) => {
    const cacheKey = getCacheKey(tab, period, metricType);
    const cachedData = cache.get(cacheKey);

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid(cachedData)) {
      setLeaderboardData(cachedData!.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API calls
      // const response = await fetch(`/api/gamification/leaderboard/${tab}?period=${period}&metric=${metricType}`);
      // const data = await response.json();

      // Mock data for now
      const data = generateMockData(tab, 100, currentUserId);

      // Update cache
      const newCache = new Map(cache);
      newCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      setCache(newCache);
      setLeaderboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [cache, getCacheKey, isCacheValid, currentUserId]);

  // Initial fetch and tab/filter changes
  useEffect(() => {
    fetchLeaderboard(currentTab, timePeriod, metric);
  }, [currentTab, timePeriod, metric]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard(currentTab, timePeriod, metric, false);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [currentTab, timePeriod, metric, fetchLeaderboard]);

  // Filter leaderboard based on search query
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboardData;

    const query = searchQuery.toLowerCase();
    return leaderboardData.filter(entry =>
      entry.username.toLowerCase().includes(query) ||
      entry.rankBadge.toLowerCase().includes(query)
    );
  }, [leaderboardData, searchQuery]);

  // Get user position
  const userPosition = useMemo(() => {
    if (!currentUserId) return null;
    return filteredLeaderboard.find(e => e.userId === currentUserId) || null;
  }, [filteredLeaderboard, currentUserId]);

  // Get top three
  const topThree = useMemo(() => {
    return filteredLeaderboard.slice(0, 3);
  }, [filteredLeaderboard]);

  // Tab counts (mock data - replace with actual API)
  const tabCounts = useMemo<Partial<Record<ExtendedLeaderboardType, number>>>(() => ({
    global: 10000,
    school: 500,
    grade: 100,
    friends: 25,
    guild: 50,
  }), []);

  // Refresh function
  const refresh = useCallback(async () => {
    await fetchLeaderboard(currentTab, timePeriod, metric, true);
  }, [currentTab, timePeriod, metric, fetchLeaderboard]);

  // Export function
  const exportData = useCallback(async (format: 'csv' | 'pdf') => {
    try {
      exportLeaderboard(format, {
        entries: filteredLeaderboard,
        leaderboardType: currentTab,
        timePeriod,
        metric
      });
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Error al exportar los datos');
    }
  }, [filteredLeaderboard, currentTab, timePeriod, metric]);

  // Set tab handler
  const setTab = useCallback((tab: ExtendedLeaderboardType) => {
    setCurrentTab(tab);
    setSearchQuery(''); // Clear search when changing tabs
  }, []);

  return {
    leaderboard: leaderboardData,
    filteredLeaderboard,
    userPosition,
    topThree,
    totalParticipants: leaderboardData.length,

    currentTab,
    setTab,
    timePeriod,
    setTimePeriod,
    metric,
    setMetric,
    searchQuery,
    setSearchQuery,

    loading,
    error,

    refresh,
    exportData,

    tabCounts,
  };
};
