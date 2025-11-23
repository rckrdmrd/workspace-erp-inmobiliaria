/**
 * useRecentActivities Hook
 *
 * Custom hook for fetching user's recent activities
 * from the educational API.
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserActivities, type UserActivity } from '@/services/api/educationalAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface ActivityData {
  id: string;
  type: 'exercise_completed' | 'achievement_unlocked' | 'streak_milestone' | 'level_up' | 'module_completed';
  title: string;
  description: string;
  timestamp: Date;
  metadata: {
    xp?: number;
    ml?: number;
    exerciseName?: string;
    moduleName?: string;
    achievementName?: string;
    streakDays?: number;
    score?: number;
  };
  category: string;
}

interface UseRecentActivitiesReturn {
  activities: ActivityData[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
}

/**
 * Hook to fetch recent activities for the current user
 *
 * @param limit - Maximum number of activities to fetch (default: 10)
 */
export function useRecentActivities(limit: number = 10): UseRecentActivitiesReturn {
  const { user, isAuthenticated } = useAuth();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActivities = useCallback(async (isRefresh = false) => {
    // Don't fetch if no user is authenticated
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await getUserActivities(user.id, limit);

      // Transform the data to match the expected ActivityData interface
      const transformedData: ActivityData[] = data.map((activity: UserActivity) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        timestamp: activity.timestamp,
        metadata: activity.metadata,
        category: activity.category,
      }));

      setActivities(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
      console.error('Error fetching activities:', err);
      // Set empty array on error
      setActivities([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user, isAuthenticated, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const refresh = useCallback(() => {
    return fetchActivities(true);
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refresh,
    isRefreshing,
  };
}
