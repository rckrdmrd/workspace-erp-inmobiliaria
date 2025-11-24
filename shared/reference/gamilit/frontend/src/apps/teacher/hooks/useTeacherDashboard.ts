/**
 * useTeacherDashboard Hook
 *
 * Custom React hook to fetch and manage teacher dashboard data including
 * statistics, recent activities, alerts, top performers, and module progress.
 *
 * Features:
 * - Automatic data fetching on mount
 * - Loading and error states
 * - Refresh mechanism for individual sections
 * - Global refresh for all data
 * - Error handling with console logging
 *
 * @module apps/teacher/hooks/useTeacherDashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { teacherApi } from '@services/api/teacher';
import type { Activity } from '@services/api/teacher';
import type {
  TeacherDashboardStats,
  InterventionAlert,
  StudentPerformance,
  ModuleProgress,
} from '../types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Return type for useTeacherDashboard hook
 */
export interface UseTeacherDashboardReturn {
  // Data
  stats: TeacherDashboardStats | null;
  activities: Activity[];
  alerts: InterventionAlert[];
  topPerformers: StudentPerformance[];
  moduleProgress: ModuleProgress[];

  // State
  loading: boolean;
  error: Error | null;

  // Actions
  refresh: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to manage teacher dashboard data
 *
 * Fetches all dashboard data on component mount and provides methods
 * to refresh individual sections or all data at once.
 *
 * @returns {UseTeacherDashboardReturn} Dashboard data, loading state, error, and refresh methods
 *
 * @example
 * ```tsx
 * function TeacherDashboard() {
 *   const {
 *     stats,
 *     activities,
 *     alerts,
 *     topPerformers,
 *     moduleProgress,
 *     loading,
 *     error,
 *     refresh,
 *     refreshStats,
 *   } = useTeacherDashboard();
 *
 *   if (loading && !stats) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   if (error) {
 *     return <ErrorMessage error={error} onRetry={refresh} />;
 *   }
 *
 *   return (
 *     <div>
 *       <DashboardStats stats={stats!} onRefresh={refreshStats} />
 *       <RecentActivities activities={activities} />
 *       <AlertsPanel alerts={alerts} />
 *       <TopPerformers students={topPerformers} />
 *       <ModuleProgress modules={moduleProgress} />
 *       <RefreshButton onClick={refresh} loading={loading} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTeacherDashboard(): UseTeacherDashboardReturn {
  // ============================================================================
  // STATE
  // ============================================================================

  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<InterventionAlert[]>([]);
  const [topPerformers, setTopPerformers] = useState<StudentPerformance[]>([]);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================================================
  // FETCH FUNCTIONS
  // ============================================================================

  /**
   * Fetch all dashboard data
   * Calls all dashboard endpoints in parallel for optimal performance
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [statsData, activitiesData, alertsData, performersData, progressData] =
        await Promise.all([
          teacherApi.getDashboardStats(),
          teacherApi.getRecentActivities(10),
          teacherApi.getStudentAlerts(),
          teacherApi.getTopPerformers(5),
          teacherApi.getModuleProgressSummary(),
        ]);

      // Update all states
      setStats(statsData);
      setActivities(activitiesData);
      setAlerts(alertsData);
      setTopPerformers(performersData);
      setModuleProgress(progressData);
    } catch (err) {
      console.error('[useTeacherDashboard] Error fetching dashboard data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh only dashboard statistics
   * Useful for updating stats without refetching everything
   */
  const refreshStats = useCallback(async () => {
    try {
      const data = await teacherApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('[useTeacherDashboard] Error refreshing stats:', err);
      // Don't update error state for individual refreshes
    }
  }, []);

  /**
   * Refresh only recent activities
   */
  const refreshActivities = useCallback(async () => {
    try {
      const data = await teacherApi.getRecentActivities(10);
      setActivities(data);
    } catch (err) {
      console.error('[useTeacherDashboard] Error refreshing activities:', err);
    }
  }, []);

  /**
   * Refresh only student alerts
   */
  const refreshAlerts = useCallback(async () => {
    try {
      const data = await teacherApi.getStudentAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('[useTeacherDashboard] Error refreshing alerts:', err);
    }
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Fetch data on component mount
   */
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    stats,
    activities,
    alerts,
    topPerformers,
    moduleProgress,

    // State
    loading,
    error,

    // Actions
    refresh: fetchDashboardData,
    refreshStats,
    refreshActivities,
    refreshAlerts,
  };
}
