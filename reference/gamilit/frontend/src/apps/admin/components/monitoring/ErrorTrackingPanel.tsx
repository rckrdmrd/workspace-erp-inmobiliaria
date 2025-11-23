import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useErrorTracking } from '../../hooks/useAdminData';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const severityColors = {
  low: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
};

export const ErrorTrackingPanel: React.FC = () => {
  const [filters, setFilters] = useState<{ severity?: string; resolved?: boolean }>({});
  const { errors, loading, markAsResolved, refresh } = useErrorTracking(filters);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const errorsBySeverity = errors.reduce(
    (acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const errorsByType = errors.reduce(
    (acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">Error Tracking & Alerting</h2>
            <p className="text-detective-small text-gray-400">Last 24 hours</p>
          </div>
        </div>
        <DetectiveButton variant="blue" onClick={refresh}>
          Refresh
        </DetectiveButton>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['critical', 'high', 'medium', 'low'] as const).map((severity) => {
          const colors = severityColors[severity];
          const count = errorsBySeverity[severity] || 0;

          return (
            <DetectiveCard
              key={severity}
              className={`${colors.bg} border ${colors.border}`}
              onClick={() => setFilters({ severity })}
              hoverable
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-detective-small text-gray-400 uppercase">{severity}</p>
                  <p className={`text-3xl font-bold ${colors.text}`}>{count}</p>
                </div>
                <AlertTriangle className={`w-8 h-8 ${colors.text}`} />
              </div>
            </DetectiveCard>
          );
        })}
      </div>

      {/* Filters */}
      <DetectiveCard>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-detective-small text-gray-400 mb-2">Severity</label>
            <select
              className="input-detective"
              value={filters.severity || ''}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value || undefined })}
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-detective-small text-gray-400 mb-2">Status</label>
            <select
              className="input-detective"
              value={filters.resolved === undefined ? '' : filters.resolved ? 'true' : 'false'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  resolved: e.target.value === '' ? undefined : e.target.value === 'true',
                })
              }
            >
              <option value="">All Status</option>
              <option value="false">Unresolved</option>
              <option value="true">Resolved</option>
            </select>
          </div>
        </div>
      </DetectiveCard>

      {/* Error Type Distribution */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Errors by Type</h3>
        <div className="space-y-2">
          {Object.entries(errorsByType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => {
              const total = errors.length;
              const percentage = ((count / total) * 100).toFixed(1);

              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{type}</span>
                    <span className="text-detective-orange font-bold">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-detective-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-detective-orange to-red-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </DetectiveCard>

      {/* Error List */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">Recent Errors</h3>
        <div className="space-y-3">
          {errors.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No errors found with current filters</p>
            </div>
          ) : (
            errors.map((error) => {
              const colors = severityColors[error.severity];
              const isExpanded = expandedError === error.id;

              return (
                <div
                  key={error.id}
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg} ${
                    error.resolved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${colors.text} border border-current`}>
                          {error.severity.toUpperCase()}
                        </span>
                        <span className="text-detective-small text-gray-400">{error.type}</span>
                        {error.resolved && (
                          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500 border border-green-500/30">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <p className="text-detective-base font-semibold">{error.message}</p>
                      <p className="text-detective-small text-gray-400 mt-1">{error.endpoint}</p>
                    </div>
                    <button
                      onClick={() => setExpandedError(isExpanded ? null : error.id)}
                      className="p-2 hover:bg-white/5 rounded transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-detective-small text-gray-400">
                    <span>Frequency: {error.frequency}x</span>
                    <span>Affected Users: {error.affectedUsers}</span>
                    <span>{new Date(error.timestamp).toLocaleString('es-ES')}</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {error.stackTrace && (
                        <div className="p-3 bg-black/30 rounded-lg">
                          <p className="text-detective-small text-gray-400 mb-2">Stack Trace:</p>
                          <pre className="text-xs text-gray-300 overflow-x-auto font-mono">
                            {error.stackTrace}
                          </pre>
                        </div>
                      )}
                      {!error.resolved && (
                        <DetectiveButton
                          variant="green"

                          icon={<CheckCircle className="w-4 h-4" />}
                          onClick={() => markAsResolved(error.id)}
                        >
                          Mark as Resolved
                        </DetectiveButton>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DetectiveCard>
    </div>
  );
};
