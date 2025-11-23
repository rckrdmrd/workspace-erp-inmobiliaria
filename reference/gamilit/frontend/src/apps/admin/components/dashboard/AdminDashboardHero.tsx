/**
 * AdminDashboardHero Component
 *
 * System health banner with real-time metrics and status indicators.
 * Displays CPU, memory, uptime, active users, requests/min, and error rate.
 *
 * Features:
 * - Color-coded health status (green/yellow/red)
 * - Auto-refresh every 10 seconds
 * - Pulse animation for critical status
 * - Real-time metric updates
 * - Manual refresh button
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Cpu,
  HardDrive,
  Clock,
  Zap,
} from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { SystemHealth } from '../../types';

interface AdminDashboardHeroProps {
  health: SystemHealth | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export const AdminDashboardHero: React.FC<AdminDashboardHeroProps> = ({
  health,
  loading = false,
  onRefresh,
}) => {
  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Get status color classes
   */
  const getStatusColor = (status: 'healthy' | 'degraded' | 'critical') => {
    switch (status) {
      case 'healthy':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-500',
          dot: 'bg-green-500',
        };
      case 'degraded':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-500',
          dot: 'bg-yellow-500',
        };
      case 'critical':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-500',
          dot: 'bg-red-500',
        };
    }
  };

  /**
   * Get metric color based on value and thresholds
   */
  const getMetricColor = (value: number, warningThreshold: number, criticalThreshold: number) => {
    if (value >= criticalThreshold) return 'text-red-500';
    if (value >= warningThreshold) return 'text-yellow-500';
    return 'text-green-500';
  };

  /**
   * Format uptime
   */
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  /**
   * Format large numbers
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!health) {
    return (
      <DetectiveCard className="border-2 border-dashed border-gray-700">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-pulse" />
            <p className="text-detective-base text-gray-400">Loading system health...</p>
          </div>
        </div>
      </DetectiveCard>
    );
  }

  const statusColors = getStatusColor(health.status);
  const cpuColor = getMetricColor(health.cpu, 70, 90);
  const memoryColor = getMetricColor(health.memory, 70, 85);
  const errorRateColor = getMetricColor(health.errorRate, 5, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DetectiveCard className={`border-2 ${statusColors.border} relative overflow-hidden`}>
        {/* Background gradient */}
        <div className={`absolute inset-0 ${statusColors.bg} opacity-5`} />

        {/* Critical status pulse animation */}
        {health.status === 'critical' && (
          <motion.div
            className="absolute inset-0 bg-red-500 opacity-10"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`p-3 ${statusColors.bg} rounded-xl`}>
                  <Activity className={`w-8 h-8 ${statusColors.text}`} />
                </div>
                {/* Status indicator dot */}
                <motion.div
                  className={`absolute -top-1 -right-1 w-4 h-4 ${statusColors.dot} rounded-full border-2 border-detective-bg`}
                  animate={health.status === 'critical' ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              <div>
                <h2 className="text-detective-subtitle">System Health Monitor</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-detective-base font-semibold ${statusColors.text}`}>
                    {health.status.toUpperCase()}
                  </span>
                  <span className="text-detective-small text-gray-500">•</span>
                  <span className="text-detective-small text-gray-400">
                    Last updated: {new Date(health.lastCheck).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Refresh button */}
            {onRefresh && (
              <motion.button
                onClick={onRefresh}
                disabled={loading}
                className={`p-3 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
              >
                <RefreshCw
                  className={`w-5 h-5 text-detective-orange ${loading ? 'animate-spin' : ''}`}
                />
              </motion.button>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* CPU Usage */}
            <motion.div
              className="p-4 bg-detective-bg-secondary rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Cpu className={`w-4 h-4 ${cpuColor}`} />
                <span className="text-detective-small text-gray-400">CPU</span>
              </div>
              <p className={`text-2xl font-bold ${cpuColor}`}>{health.cpu.toFixed(1)}%</p>
              <div className="mt-2 h-1.5 bg-detective-bg rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${cpuColor.replace('text', 'bg')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${health.cpu}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Memory Usage */}
            <motion.div
              className="p-4 bg-detective-bg-secondary rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className={`w-4 h-4 ${memoryColor}`} />
                <span className="text-detective-small text-gray-400">Memory</span>
              </div>
              <p className={`text-2xl font-bold ${memoryColor}`}>{health.memory.toFixed(1)}%</p>
              <div className="mt-2 h-1.5 bg-detective-bg rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${memoryColor.replace('text', 'bg')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${health.memory}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Uptime */}
            <motion.div
              className="p-4 bg-detective-bg-secondary rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-detective-small text-gray-400">Uptime</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{formatUptime(health.uptime)}</p>
              <p className="text-detective-small text-gray-500 mt-1">
                {health.apiUptime.toFixed(2)}% API
              </p>
            </motion.div>

            {/* Active Users */}
            <motion.div
              className="p-4 bg-detective-bg-secondary rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-detective-small text-gray-400">Active Users</span>
              </div>
              <p className="text-2xl font-bold text-purple-500">
                {formatNumber(health.activeUsers)}
              </p>
              <p className="text-detective-small text-gray-500 mt-1">online now</p>
            </motion.div>

            {/* Requests Per Minute */}
            <motion.div
              className="p-4 bg-detective-bg-secondary rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-detective-small text-gray-400">Req/Min</span>
              </div>
              <p className="text-2xl font-bold text-amber-500">
                {formatNumber(health.requestsPerMin)}
              </p>
              <p className="text-detective-small text-gray-500 mt-1">requests</p>
            </motion.div>

            {/* Error Rate */}
            <motion.div
              className="p-4 bg-detective-bg-secondary rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {health.errorRate > 5 ? (
                  <AlertTriangle className={`w-4 h-4 ${errorRateColor}`} />
                ) : (
                  <TrendingUp className={`w-4 h-4 ${errorRateColor}`} />
                )}
                <span className="text-detective-small text-gray-400">Error Rate</span>
              </div>
              <p className={`text-2xl font-bold ${errorRateColor}`}>{health.errorRate.toFixed(2)}%</p>
              <p className="text-detective-small text-gray-500 mt-1">of requests</p>
            </motion.div>
          </div>

          {/* Status message for critical/degraded states */}
          {health.status !== 'healthy' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-4 p-4 ${statusColors.bg} ${statusColors.border} border rounded-lg`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 ${statusColors.text} mt-0.5`} />
                <div>
                  <p className={`text-detective-base font-semibold ${statusColors.text}`}>
                    {health.status === 'critical'
                      ? 'Critical System Issues Detected'
                      : 'System Performance Degraded'}
                  </p>
                  <p className="text-detective-small text-gray-400 mt-1">
                    {health.status === 'critical'
                      ? 'Immediate action required. Check system logs for details.'
                      : 'Performance is below optimal levels. Monitor closely.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DetectiveCard>
    </motion.div>
  );
};
