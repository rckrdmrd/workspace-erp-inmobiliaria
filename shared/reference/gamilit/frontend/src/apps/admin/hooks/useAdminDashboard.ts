/**
 * useAdminDashboard Hook
 *
 * Comprehensive hook for managing admin dashboard data with real-time updates.
 * Handles system health, metrics, recent actions, alerts, and user activity.
 *
 * Features:
 * - Real-time data fetching with configurable intervals
 * - Auto-refresh control (pause/resume)
 * - Alert management (dismiss, view details)
 * - Error handling and loading states
 * - Optimistic updates for better UX
 *
 * Updated: 2025-11-19 - Integrated with adminAPI.ts (FE-059)
 * - Now uses adminAPI.getSystemHealth() and adminAPI.getSystemMetrics()
 * - Alerts, actions, and activity endpoints not yet implemented in backend
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/services/api/apiClient';
import * as adminAPI from '@/services/api/adminAPI';
import type {
  SystemHealth,
  SystemMetrics,
  AdminAction,
  SystemAlert,
  UserActivityData,
} from '../types';

export interface UseAdminDashboardResult {
  // Data
  systemHealth: SystemHealth | null;
  metrics: SystemMetrics | null;
  recentActions: AdminAction[];
  alerts: SystemAlert[];
  userActivity: UserActivityData[];

  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  refreshMetrics: () => Promise<void>;
  refreshHealth: () => Promise<void>;
  refreshActions: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshActivity: () => Promise<void>;
  refreshAll: () => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;

  // Auto-refresh control
  pauseRefresh: () => void;
  resumeRefresh: () => void;
  isPaused: boolean;
}

interface RefreshIntervals {
  health: number;
  metrics: number;
  actions: number;
  alerts: number;
  activity: number;
}

const DEFAULT_INTERVALS: RefreshIntervals = {
  health: 10000,      // 10 seconds
  metrics: 30000,     // 30 seconds
  actions: 60000,     // 60 seconds
  alerts: 5000,       // 5 seconds (real-time-ish)
  activity: 300000,   // 5 minutes
};

export function useAdminDashboard(customIntervals?: Partial<RefreshIntervals>): UseAdminDashboardResult {
  // Merge custom intervals with defaults
  const intervals = { ...DEFAULT_INTERVALS, ...customIntervals };

  // State management
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentActions, setRecentActions] = useState<AdminAction[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivityData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for interval management
  const intervalsRef = useRef<{
    health?: NodeJS.Timeout;
    metrics?: NodeJS.Timeout;
    actions?: NodeJS.Timeout;
    alerts?: NodeJS.Timeout;
    activity?: NodeJS.Timeout;
  }>({});

  // ============================================================================
  // API CALLS
  // ============================================================================

  /**
   * Fetch system health status
   * Updated: Now uses adminAPI.getSystemHealth()
   */
  const fetchSystemHealth = useCallback(async (): Promise<void> => {
    try {
      const data = await adminAPI.getSystemHealth();
      setSystemHealth(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch system health:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch system health');

      // Set fallback health data on error
      setSystemHealth({
        status: 'critical',
        cpu: 0,
        memory: 0,
        uptime: 0,
        activeUsers: 0,
        requestsPerMin: 0,
        errorRate: 100,
        database: 'down',
        apiUptime: 0,
        lastCheck: new Date().toISOString(),
      });
    }
  }, []);

  /**
   * Fetch system metrics
   * Updated: Now uses adminAPI.getSystemMetrics()
   */
  const fetchMetrics = useCallback(async (): Promise<void> => {
    try {
      const data = await adminAPI.getSystemMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  }, []);

  /**
   * Fetch recent admin actions
   * Note: Backend endpoint /admin/actions/recent NOT yet implemented
   * TODO: Implement in backend or use alternative data source
   */
  const fetchRecentActions = useCallback(async (): Promise<void> => {
    try {
      // Endpoint not implemented - return empty for now
      setRecentActions([]);
      setError(null);

      // TODO: When backend implements, uncomment:
      // const response = await apiClient.get<{ success: boolean; data: AdminAction[] }>('/admin/actions/recent', {
      //   params: { limit: 10 },
      // });
      // const data = response.data.success ? response.data.data : response.data as unknown as AdminAction[];
      // const actions = data.map(action => ({
      //   ...action,
      //   timestamp: new Date(action.timestamp),
      // }));
      // setRecentActions(actions);
    } catch (err) {
      console.error('Failed to fetch recent actions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recent actions');
    }
  }, []);

  /**
   * Fetch system alerts
   * Note: Backend endpoint /admin/alerts NOT yet implemented
   * TODO: Implement in backend or use alternative data source
   */
  const fetchAlerts = useCallback(async (): Promise<void> => {
    try {
      // Endpoint not implemented - return empty for now
      setAlerts([]);
      setError(null);

      // TODO: When backend implements, uncomment:
      // const response = await apiClient.get<{ success: boolean; data: SystemAlert[] }>('/admin/alerts', {
      //   params: { dismissed: false },
      // });
      // const data = response.data.success ? response.data.data : response.data as unknown as SystemAlert[];
      // const parsedAlerts = data.map(alert => ({
      //   ...alert,
      //   timestamp: new Date(alert.timestamp),
      //   dismissedAt: alert.dismissedAt ? new Date(alert.dismissedAt) : undefined,
      // })).sort((a, b) => {
      //   const severityOrder = { high: 3, medium: 2, low: 1 };
      //   const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      //   if (severityDiff !== 0) return severityDiff;
      //   return b.timestamp.getTime() - a.timestamp.getTime();
      // });
      // setAlerts(parsedAlerts);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    }
  }, []);

  /**
   * Fetch user activity data
   * Note: Backend endpoint /admin/analytics/user-activity NOT yet implemented
   * TODO: Implement in backend or use alternative data source
   */
  const fetchUserActivity = useCallback(async (): Promise<void> => {
    try {
      // Endpoint not implemented - return empty for now
      setUserActivity([]);
      setError(null);

      // TODO: When backend implements, uncomment:
      // const response = await apiClient.get<{ success: boolean; data: UserActivityData[] }>('/admin/analytics/user-activity', {
      //   params: { days: 7 },
      // });
      // const data = response.data.success ? response.data.data : response.data as unknown as UserActivityData[];
      // setUserActivity(data);
    } catch (err) {
      console.error('Failed to fetch user activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user activity');
    }
  }, []);

  // ============================================================================
  // PUBLIC ACTIONS
  // ============================================================================

  /**
   * Refresh system health
   */
  const refreshHealth = useCallback(async (): Promise<void> => {
    await fetchSystemHealth();
    setLastUpdated(new Date());
  }, [fetchSystemHealth]);

  /**
   * Refresh metrics
   */
  const refreshMetrics = useCallback(async (): Promise<void> => {
    await fetchMetrics();
    setLastUpdated(new Date());
  }, [fetchMetrics]);

  /**
   * Refresh recent actions
   */
  const refreshActions = useCallback(async (): Promise<void> => {
    await fetchRecentActions();
    setLastUpdated(new Date());
  }, [fetchRecentActions]);

  /**
   * Refresh alerts
   */
  const refreshAlerts = useCallback(async (): Promise<void> => {
    await fetchAlerts();
    setLastUpdated(new Date());
  }, [fetchAlerts]);

  /**
   * Refresh user activity
   */
  const refreshActivity = useCallback(async (): Promise<void> => {
    await fetchUserActivity();
    setLastUpdated(new Date());
  }, [fetchUserActivity]);

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSystemHealth(),
        fetchMetrics(),
        fetchRecentActions(),
        fetchAlerts(),
        fetchUserActivity(),
      ]);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to refresh all data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [fetchSystemHealth, fetchMetrics, fetchRecentActions, fetchAlerts, fetchUserActivity]);

  /**
   * Dismiss an alert
   */
  const dismissAlert = useCallback(async (alertId: string): Promise<void> => {
    try {
      // Optimistic update
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, dismissed: true, dismissedAt: new Date() }
          : alert
      ));

      await apiClient.post(`/admin/alerts/${alertId}/dismiss`);

      // Remove dismissed alert after animation
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }, 300);
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
      // Revert optimistic update on error
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, dismissed: false, dismissedAt: undefined }
          : alert
      ));
      throw err;
    }
  }, []);

  // ============================================================================
  // AUTO-REFRESH MANAGEMENT
  // ============================================================================

  /**
   * Pause auto-refresh
   */
  const pauseRefresh = useCallback((): void => {
    setIsPaused(true);

    // Clear all intervals
    Object.values(intervalsRef.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });
    intervalsRef.current = {};
  }, []);

  /**
   * Resume auto-refresh
   */
  const resumeRefresh = useCallback((): void => {
    setIsPaused(false);
    // Intervals will be set up in useEffect
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Initial data fetch
   */
  useEffect(() => {
    refreshAll();
  }, []);

  /**
   * Set up auto-refresh intervals
   */
  useEffect(() => {
    if (isPaused) return;

    // Clear existing intervals
    Object.values(intervalsRef.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });

    // Set up new intervals
    intervalsRef.current.health = setInterval(fetchSystemHealth, intervals.health);
    intervalsRef.current.metrics = setInterval(fetchMetrics, intervals.metrics);
    intervalsRef.current.actions = setInterval(fetchRecentActions, intervals.actions);
    intervalsRef.current.alerts = setInterval(fetchAlerts, intervals.alerts);
    intervalsRef.current.activity = setInterval(fetchUserActivity, intervals.activity);

    // Cleanup on unmount
    return () => {
      Object.values(intervalsRef.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [isPaused, intervals, fetchSystemHealth, fetchMetrics, fetchRecentActions, fetchAlerts, fetchUserActivity]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    systemHealth,
    metrics,
    recentActions,
    alerts,
    userActivity,

    // State
    loading,
    error,
    lastUpdated,

    // Actions
    refreshMetrics,
    refreshHealth,
    refreshActions,
    refreshAlerts,
    refreshActivity,
    refreshAll,
    dismissAlert,

    // Auto-refresh control
    pauseRefresh,
    resumeRefresh,
    isPaused,
  };
}
