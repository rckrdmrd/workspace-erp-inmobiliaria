/**
 * SystemLogsViewer Component
 *
 * System logs viewer with filtering and real-time streaming.
 * Displays log entries with syntax highlighting for JSON data.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { apiClient } from '@/services/api/apiClient';
import type { SystemLog, LogFilter } from '../../types';

export const SystemLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<LogFilter>({ level: ['error', 'warning', 'critical'] });
  const [autoScroll, setAutoScroll] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/logs', { params: filter });
      const data = response.data.success ? response.data.data : response.data;
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-500 bg-red-500/10';
      case 'error':
        return 'text-orange-500 bg-orange-500/10';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'info':
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  const handleExport = () => {
    const logText = logs.map(log =>
      `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DetectiveCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-detective-subtitle">System Logs</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-detective-small">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            Auto-scroll
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 mb-4">
        {['info', 'warning', 'error', 'critical'].map((level) => (
          <button
            key={level}
            onClick={() => {
              const currentLevels = filter.level || [];
              const newLevels = currentLevels.includes(level as any)
                ? currentLevels.filter((l) => l !== level)
                : [...currentLevels, level as any];
              setFilter({ ...filter, level: newLevels as any });
            }}
            className={`px-3 py-1.5 rounded-md text-xs capitalize transition-colors ${
              filter.level?.includes(level as any)
                ? getLevelColor(level)
                : 'bg-detective-bg-secondary text-gray-400'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar space-y-2">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No logs in selected time range</div>
        ) : (
          logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border-l-4 ${getLevelColor(log.level)} bg-detective-bg-secondary`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-detective-small text-gray-500">{log.source}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-detective-small text-gray-300">{log.message}</p>
              {log.details && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-white">
                    View details
                  </summary>
                  <pre className="mt-2 p-2 bg-detective-bg rounded text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </details>
              )}
            </motion.div>
          ))
        )}
      </div>
    </DetectiveCard>
  );
};
