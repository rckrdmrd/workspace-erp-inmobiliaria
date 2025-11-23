import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { MetricsChart } from './MetricsChart';
import { useSystemMetrics } from '../../hooks/useSystemMetrics';
import { Activity, Database, Users, TrendingUp, AlertCircle, Cpu, MemoryStick, RefreshCw } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  status: 'healthy' | 'warning' | 'critical';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, status, subtitle }) => {
  const statusColors = {
    healthy: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500',
  };

  const statusBg = {
    healthy: 'bg-green-500/10 border-green-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    critical: 'bg-red-500/10 border-red-500/30',
  };

  return (
    <div className={`p-4 rounded-lg border ${statusBg[status]} backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-2">
        <div className={statusColors[status]}>{icon}</div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${statusColors[status]} border border-current`}>
          {status === 'healthy' && 'HEALTHY'}
          {status === 'warning' && 'WARNING'}
          {status === 'critical' && 'CRITICAL'}
        </div>
      </div>
      <div>
        <p className="text-detective-small text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-detective-text mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export const SystemPerformanceDashboard: React.FC = () => {
  const { metrics, history, loading, error, refresh } = useSystemMetrics(30000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  if (loading) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  if (error) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12 text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          Error loading metrics: {error}
        </div>
      </DetectiveCard>
    );
  }

  if (!metrics) return null;

  // Calculate status based on thresholds
  const getStatus = (value: number, warningThreshold: number, criticalThreshold: number) => {
    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'healthy';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">System Performance Dashboard</h2>
            <p className="text-detective-small text-gray-400">Real-time monitoring - Updated every 30s</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm ${
              autoRefresh ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={refresh}
            className="p-2 rounded-lg bg-detective-orange/20 text-detective-orange hover:bg-detective-orange/30 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="API Response Time (p95)"
          value={`${metrics.apiResponseTime.p95}ms`}
          icon={<TrendingUp className="w-6 h-6" />}
          status={getStatus(metrics.apiResponseTime.p95, 800, 1500)}
          subtitle={`p50: ${metrics.apiResponseTime.p50}ms | p99: ${metrics.apiResponseTime.p99}ms`}
        />
        <MetricCard
          label="Database Queries/sec"
          value={metrics.databaseQueriesPerSec}
          icon={<Database className="w-6 h-6" />}
          status={getStatus(metrics.databaseQueriesPerSec, 800, 1000)}
          subtitle="Current throughput"
        />
        <MetricCard
          label="Active Users"
          value={metrics.activeUsersCount}
          icon={<Users className="w-6 h-6" />}
          status="healthy"
          subtitle="Currently online"
        />
        <MetricCard
          label="Requests/min"
          value={metrics.requestsPerMin}
          icon={<Activity className="w-6 h-6" />}
          status={getStatus(metrics.requestsPerMin, 5000, 8000)}
          subtitle="RPM"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Error Rate"
          value={`${metrics.errorRate.toFixed(2)}%`}
          icon={<AlertCircle className="w-6 h-6" />}
          status={getStatus(metrics.errorRate, 1, 5)}
          subtitle="Last 5 minutes"
        />
        {metrics.cpuUsage !== undefined && (
          <MetricCard
            label="CPU Usage"
            value={`${metrics.cpuUsage.toFixed(1)}%`}
            icon={<Cpu className="w-6 h-6" />}
            status={getStatus(metrics.cpuUsage, 70, 90)}
            subtitle="System CPU"
          />
        )}
        {metrics.memoryUsage !== undefined && (
          <MetricCard
            label="Memory Usage"
            value={`${metrics.memoryUsage.toFixed(1)}%`}
            icon={<MemoryStick className="w-6 h-6" />}
            status={getStatus(metrics.memoryUsage, 75, 90)}
            subtitle="System RAM"
          />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">API Response Time (Last 60 min)</h3>
          <MetricsChart
            data={history.apiResponseTime}
            label="Response Time (p95)"
            color="#3b82f6"
            threshold={1000}
            unit="ms"
          />
        </DetectiveCard>

        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">Error Rate Trend (Last 60 min)</h3>
          <MetricsChart
            data={history.errorRate}
            label="Error Rate"
            color="#ef4444"
            threshold={2}
            unit="%"
          />
        </DetectiveCard>

        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">Active Users (Last 60 min)</h3>
          <MetricsChart
            data={history.activeUsers}
            label="Active Users"
            color="#10b981"
            unit=""
          />
        </DetectiveCard>

        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">Requests/min (Last 60 min)</h3>
          <MetricsChart
            data={history.requestsPerMin}
            label="RPM"
            color="#f97316"
            threshold={6000}
            unit=""
          />
        </DetectiveCard>
      </div>

      {/* Timestamp */}
      <div className="text-center text-detective-small text-gray-500">
        Last updated: {new Date(metrics.timestamp).toLocaleString('es-ES')}
      </div>
    </div>
  );
};
