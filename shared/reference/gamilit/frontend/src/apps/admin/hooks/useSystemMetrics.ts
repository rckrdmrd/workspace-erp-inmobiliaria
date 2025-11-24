import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/apiClient';

export interface SystemMetrics {
  apiResponseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
  databaseQueriesPerSec: number;
  activeUsersCount: number;
  requestsPerMin: number;
  errorRate: number;
  cpuUsage?: number;
  memoryUsage?: number;
  timestamp: string;
}

export interface MetricsHistory {
  timestamp: string;
  value: number;
}

export function useSystemMetrics(refreshInterval = 30000) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<Record<string, MetricsHistory[]>>({
    apiResponseTime: [],
    errorRate: [],
    activeUsers: [],
    requestsPerMin: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await apiClient.get('/admin/metrics');
      const data = response.data.success ? response.data.data : response.data;
      setMetrics(data);

      // Update history (keep last 60 entries for 60 minutes at 1min intervals)
      const timestamp = new Date().toISOString();
      setHistory((prev) => ({
        apiResponseTime: [...prev.apiResponseTime.slice(-59), { timestamp, value: data.apiResponseTime.p95 }],
        errorRate: [...prev.errorRate.slice(-59), { timestamp, value: data.errorRate }],
        activeUsers: [...prev.activeUsers.slice(-59), { timestamp, value: data.activeUsersCount }],
        requestsPerMin: [...prev.requestsPerMin.slice(-59), { timestamp, value: data.requestsPerMin }],
      }));

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { metrics, history, loading, error, refresh: fetchMetrics };
}

export function useHealthStatus() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await apiClient.get('/health/detailed');
        const data = response.data.success ? response.data.data : response.data;
        setHealth(data);
      } catch (err) {
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return { health, loading };
}
