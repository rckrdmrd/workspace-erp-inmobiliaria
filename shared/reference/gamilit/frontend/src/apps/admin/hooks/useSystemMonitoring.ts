/**
 * useSystemMonitoring Hook
 *
 * Specialized hook for real-time system monitoring.
 * Focuses on health checks, performance metrics, and alert management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/services/api/apiClient';
import type { SystemHealth, SystemAlert } from '../types';

export interface UseSystemMonitoringResult {
  // Health data
  health: SystemHealth | null;
  healthHistory: HealthSnapshot[];

  // Alerts
  activeAlerts: SystemAlert[];
  alertCount: number;
  criticalAlertCount: number;

  // State
  loading: boolean;
  error: string | null;
  isMonitoring: boolean;

  // Actions
  startMonitoring: () => void;
  stopMonitoring: () => void;
  refreshHealth: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  clearAllAlerts: () => Promise<void>;
}

interface HealthSnapshot {
  timestamp: Date;
  cpu: number;
  memory: number;
  errorRate: number;
  requestsPerMin: number;
  status: 'healthy' | 'degraded' | 'critical';
}

const HEALTH_CHECK_INTERVAL = 10000; // 10 seconds
const ALERT_CHECK_INTERVAL = 5000;   // 5 seconds
const MAX_HISTORY_LENGTH = 60;       // Keep 10 minutes of history at 10s intervals

export function useSystemMonitoring(): UseSystemMonitoringResult {
  // State
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [healthHistory, setHealthHistory] = useState<HealthSnapshot[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Refs
  const healthIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const alertIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // ============================================================================
  // API CALLS
  // ============================================================================

  /**
   * Fetch current system health
   */
  const fetchHealth = useCallback(async (): Promise<void> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: SystemHealth }>('/admin/health');
      const data = response.data.success ? response.data.data : response.data as unknown as SystemHealth;

      setHealth(data);

      // Add to history
      const snapshot: HealthSnapshot = {
        timestamp: new Date(),
        cpu: data.cpu,
        memory: data.memory,
        errorRate: data.errorRate,
        requestsPerMin: data.requestsPerMin,
        status: data.status,
      };

      setHealthHistory(prev => {
        const updated = [...prev, snapshot];
        // Keep only last MAX_HISTORY_LENGTH items
        return updated.slice(-MAX_HISTORY_LENGTH);
      });

      setError(null);
    } catch (err) {
      console.error('Failed to fetch health:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health');
    }
  }, []);

  /**
   * Fetch active alerts
   */
  const fetchAlerts = useCallback(async (): Promise<void> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: SystemAlert[] }>('/admin/alerts', {
        params: { dismissed: false, limit: 50 },
      });
      const data = response.data.success ? response.data.data : response.data as unknown as SystemAlert[];

      // Parse and sort alerts
      const alerts = data
        .map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
        }))
        .sort((a, b) => {
          // Sort by severity (high > medium > low) then by timestamp (newest first)
          const severityOrder = { high: 3, medium: 2, low: 1 };
          const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
          return severityDiff !== 0 ? severityDiff : b.timestamp.getTime() - a.timestamp.getTime();
        });

      setActiveAlerts(alerts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    }
  }, []);

  // ============================================================================
  // PUBLIC ACTIONS
  // ============================================================================

  /**
   * Start monitoring
   */
  const startMonitoring = useCallback((): void => {
    if (isMonitoring) return;

    setIsMonitoring(true);

    // Initial fetch
    fetchHealth();
    fetchAlerts();

    // Set up intervals
    healthIntervalRef.current = setInterval(fetchHealth, HEALTH_CHECK_INTERVAL);
    alertIntervalRef.current = setInterval(fetchAlerts, ALERT_CHECK_INTERVAL);
  }, [isMonitoring, fetchHealth, fetchAlerts]);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback((): void => {
    setIsMonitoring(false);

    // Clear intervals
    if (healthIntervalRef.current) {
      clearInterval(healthIntervalRef.current);
      healthIntervalRef.current = undefined;
    }
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
      alertIntervalRef.current = undefined;
    }
  }, []);

  /**
   * Manually refresh health
   */
  const refreshHealth = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await Promise.all([fetchHealth(), fetchAlerts()]);
    } finally {
      setLoading(false);
    }
  }, [fetchHealth, fetchAlerts]);

  /**
   * Acknowledge/dismiss an alert
   */
  const acknowledgeAlert = useCallback(async (alertId: string): Promise<void> => {
    try {
      // Optimistic update
      setActiveAlerts(prev => prev.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      ));

      await apiClient.post(`/admin/alerts/${alertId}/dismiss`);

      // Remove from active alerts after animation
      setTimeout(() => {
        setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }, 300);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
      // Revert optimistic update
      setActiveAlerts(prev => prev.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: false } : alert
      ));
      throw err;
    }
  }, []);

  /**
   * Clear all alerts
   */
  const clearAllAlerts = useCallback(async (): Promise<void> => {
    try {
      // Optimistic update
      const previousAlerts = activeAlerts;
      setActiveAlerts([]);

      await apiClient.post('/admin/alerts/dismiss-all');
    } catch (err) {
      console.error('Failed to clear all alerts:', err);
      // Revert on error
      fetchAlerts();
      throw err;
    }
  }, [activeAlerts, fetchAlerts]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Initial load
   */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchHealth(), fetchAlerts()]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /**
   * Auto-start monitoring
   */
  useEffect(() => {
    startMonitoring();

    return () => {
      stopMonitoring();
    };
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const alertCount = activeAlerts.length;
  const criticalAlertCount = activeAlerts.filter(a => a.severity === 'high').length;

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Health data
    health,
    healthHistory,

    // Alerts
    activeAlerts,
    alertCount,
    criticalAlertCount,

    // State
    loading,
    error,
    isMonitoring,

    // Actions
    startMonitoring,
    stopMonitoring,
    refreshHealth,
    acknowledgeAlert,
    clearAllAlerts,
  };
}
