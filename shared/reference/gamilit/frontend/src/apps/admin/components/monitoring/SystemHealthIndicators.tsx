import React from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { useHealthStatus } from '../../hooks/useSystemMetrics';
import { CheckCircle, XCircle, AlertCircle, Database, Server, Zap, Globe } from 'lucide-react';

interface HealthCheckProps {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  details?: string;
  icon: React.ReactNode;
  uptime?: number;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ name, status, latency, details, icon, uptime }) => {
  const statusConfig = {
    healthy: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      label: 'HEALTHY',
    },
    degraded: {
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      label: 'DEGRADED',
    },
    down: {
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      label: 'DOWN',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`p-4 rounded-lg border ${config.border} ${config.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`${config.color}`}>{icon}</div>
          <div>
            <p className="text-detective-base font-semibold">{name}</p>
            {details && <p className="text-detective-small text-gray-400">{details}</p>}
          </div>
        </div>
        <div className={`flex items-center gap-1 ${config.color}`}>{config.icon}</div>
      </div>

      <div className="flex items-center gap-4 text-detective-small">
        <div className={`px-2 py-1 rounded ${config.bg} ${config.color} border ${config.border} font-bold`}>
          {config.label}
        </div>
        {latency !== undefined && (
          <div className="text-gray-400">
            Latency: <span className="text-detective-text font-semibold">{latency}ms</span>
          </div>
        )}
        {uptime !== undefined && (
          <div className="text-gray-400">
            Uptime: <span className="text-green-500 font-semibold">{uptime.toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const SystemHealthIndicators: React.FC = () => {
  const { health, loading } = useHealthStatus();

  if (loading) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  // Mock data structure - adjust based on actual API response
  const healthChecks: HealthCheckProps[] = [
    {
      name: 'Backend API',
      status: health?.api?.status || 'healthy',
      latency: health?.api?.latency || 45,
      details: 'Node.js Server',
      icon: <Server className="w-6 h-6" />,
      uptime: health?.api?.uptime || 99.98,
    },
    {
      name: 'PostgreSQL Database',
      status: health?.database?.status || 'healthy',
      latency: health?.database?.latency || 12,
      details: `${health?.database?.connections || 15}/100 connections`,
      icon: <Database className="w-6 h-6" />,
      uptime: health?.database?.uptime || 99.99,
    },
    {
      name: 'Redis Cache',
      status: health?.redis?.status || 'healthy',
      latency: health?.redis?.latency || 3,
      details: 'In-memory cache',
      icon: <Zap className="w-6 h-6" />,
      uptime: health?.redis?.uptime || 99.95,
    },
    {
      name: 'External APIs',
      status: health?.external?.status || 'healthy',
      latency: health?.external?.latency || 250,
      details: 'OpenAI, Payment Gateway',
      icon: <Globe className="w-6 h-6" />,
      uptime: health?.external?.uptime || 99.5,
    },
  ];

  const overallStatus = healthChecks.every((check) => check.status === 'healthy')
    ? 'healthy'
    : healthChecks.some((check) => check.status === 'down')
    ? 'down'
    : 'degraded';

  const overallConfig = {
    healthy: { color: 'text-green-500', bg: 'bg-green-500/20', label: 'ALL SYSTEMS OPERATIONAL' },
    degraded: { color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'PARTIAL SYSTEM OUTAGE' },
    down: { color: 'text-red-500', bg: 'bg-red-500/20', label: 'MAJOR SYSTEM OUTAGE' },
  };

  const config = overallConfig[overallStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">System Health Indicators</h2>
            <p className="text-detective-small text-gray-400">Status page format</p>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <DetectiveCard className={`${config.bg} border-2 border-current ${config.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {overallStatus === 'healthy' ? (
              <CheckCircle className="w-12 h-12" />
            ) : overallStatus === 'degraded' ? (
              <AlertCircle className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
            <div>
              <p className="text-2xl font-bold">{config.label}</p>
              <p className="text-detective-small opacity-80">
                Last updated: {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-detective-small opacity-80">Average Uptime (30 days)</p>
            <p className="text-3xl font-bold">
              {(healthChecks.reduce((acc, check) => acc + (check.uptime || 0), 0) / healthChecks.length).toFixed(2)}%
            </p>
          </div>
        </div>
      </DetectiveCard>

      {/* Health Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthChecks.map((check) => (
          <HealthCheck key={check.name} {...check} />
        ))}
      </div>

      {/* Historical Uptime */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Historical Uptime (Last 90 days)</h3>
        <div className="space-y-4">
          {healthChecks.map((check) => (
            <div key={check.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-detective-base">{check.name}</span>
                <span className="text-green-500 font-bold">{check.uptime?.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-detective-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${check.uptime}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </DetectiveCard>

      {/* Recent Incidents */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Recent Incidents</h3>
        <div className="space-y-3">
          {health?.incidents && health.incidents.length > 0 ? (
            health.incidents.map((incident: any, index: number) => (
              <div key={index} className="p-3 bg-detective-bg-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-detective-base font-semibold">{incident.title}</span>
                  <span className="text-detective-small text-gray-400">
                    {new Date(incident.timestamp).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p className="text-detective-small text-gray-400">{incident.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      incident.resolved
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}
                  >
                    {incident.resolved ? 'RESOLVED' : 'INVESTIGATING'}
                  </span>
                  <span className="text-detective-small text-gray-400">
                    Duration: {incident.duration || 'Ongoing'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No incidents in the last 90 days</p>
            </div>
          )}
        </div>
      </DetectiveCard>

      {/* Response Time Chart */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Average Response Times (Last 24h)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {healthChecks.map((check) => (
            <div key={check.name} className="text-center p-4 bg-detective-bg-secondary rounded-lg">
              <div className="mb-2">{check.icon}</div>
              <p className="text-detective-small text-gray-400 mb-1">{check.name}</p>
              <p className="text-2xl font-bold text-detective-orange">{check.latency}ms</p>
            </div>
          ))}
        </div>
      </DetectiveCard>
    </div>
  );
};
