/**
 * SystemAlertsPanel Component
 *
 * Panel displaying system alerts with dismissible functionality.
 * Shows critical system events, errors, warnings, and security alerts.
 *
 * Features:
 * - Alert cards with priority sorting
 * - Alert types (error, warning, info, security)
 * - Severity indicators (high, medium, low)
 * - Timestamp display
 * - Dismiss button with animation
 * - View details modal
 * - Auto-refresh
 * - Empty state when no alerts
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  X,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { Modal } from '@shared/components/common/Modal';
import type { SystemAlert } from '../../types';

interface SystemAlertsPanelProps {
  alerts: SystemAlert[];
  loading?: boolean;
  onDismiss?: (alertId: string) => void;
  onDismissAll?: () => void;
}

export const SystemAlertsPanel: React.FC<SystemAlertsPanelProps> = ({
  alerts,
  loading = false,
  onDismiss,
  onDismissAll,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'security':
        return Shield;
      case 'info':
      default:
        return Info;
    }
  };

  const getAlertColors = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500',
          text: 'text-red-500',
          icon: 'text-red-500',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500',
          text: 'text-yellow-500',
          icon: 'text-yellow-500',
        };
      case 'low':
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500',
          text: 'text-blue-500',
          icon: 'text-blue-500',
        };
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleViewDetails = (alert: SystemAlert) => {
    setSelectedAlert(alert);
    setShowDetailsModal(true);
  };

  const handleDismiss = (alertId: string) => {
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <DetectiveCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-detective-subtitle">System Alerts</h3>
          <p className="text-detective-small text-gray-400">
            {alerts.length} active {alerts.length === 1 ? 'alert' : 'alerts'}
          </p>
        </div>

        {alerts.length > 0 && onDismissAll && (
          <button
            onClick={onDismissAll}
            className="px-4 py-2 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary transition-colors text-detective-small"
          >
            Dismiss All
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <AlertCircle className="w-8 h-8 text-gray-500" />
              </motion.div>
            </div>
          ) : alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-detective-base font-semibold mb-2">All Systems Operational</h4>
              <p className="text-detective-small text-gray-400">No active alerts or warnings</p>
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={index}
                onDismiss={handleDismiss}
                onViewDetails={handleViewDetails}
                getAlertIcon={getAlertIcon}
                getAlertColors={getAlertColors}
                formatTimestamp={formatTimestamp}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        {selectedAlert && (
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              {(() => {
                const Icon = getAlertIcon(selectedAlert.type);
                const colors = getAlertColors(selectedAlert.severity);
                return (
                  <div className={`p-3 ${colors.bg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                );
              })()}
              <div className="flex-1">
                <h3 className="text-detective-subtitle mb-1">{selectedAlert.title}</h3>
                <div className="flex items-center gap-3 text-detective-small text-gray-400">
                  <span className="capitalize">{selectedAlert.type}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedAlert.severity} severity</span>
                  <span>•</span>
                  <span>{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-detective-base font-semibold mb-2">Message</h4>
                <p className="text-detective-small text-gray-400">{selectedAlert.message}</p>
              </div>

              <div>
                <h4 className="text-detective-base font-semibold mb-2">Details</h4>
                <div className="p-4 bg-detective-bg-secondary rounded-lg">
                  <pre className="text-detective-small text-gray-400 whitespace-pre-wrap font-mono">
                    {selectedAlert.details}
                  </pre>
                </div>
              </div>

              {selectedAlert.affectedResources && selectedAlert.affectedResources.length > 0 && (
                <div>
                  <h4 className="text-detective-base font-semibold mb-2">Affected Resources</h4>
                  <ul className="space-y-1">
                    {selectedAlert.affectedResources.map((resource, i) => (
                      <li key={i} className="text-detective-small text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-detective-orange rounded-full" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-detective-base font-semibold mb-2">Source</h4>
                <p className="text-detective-small text-gray-400">{selectedAlert.source}</p>
              </div>

              {selectedAlert.actionRequired && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-detective-small text-yellow-500 font-semibold">
                    ⚠️ Action Required
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DetectiveCard>
  );
};

// ============================================================================
// ALERT CARD COMPONENT
// ============================================================================

interface AlertCardProps {
  alert: SystemAlert;
  index: number;
  onDismiss: (id: string) => void;
  onViewDetails: (alert: SystemAlert) => void;
  getAlertIcon: (type: string) => React.ElementType;
  getAlertColors: (severity: string) => any;
  formatTimestamp: (date: Date) => string;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  index,
  onDismiss,
  onViewDetails,
  getAlertIcon,
  getAlertColors,
  formatTimestamp,
}) => {
  const Icon = getAlertIcon(alert.type);
  const colors = getAlertColors(alert.severity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-4 ${colors.bg} border-l-4 ${colors.border} rounded-lg group hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-detective-base font-semibold truncate">{alert.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border} whitespace-nowrap`}>
              {alert.severity.toUpperCase()}
            </span>
          </div>

          <p className="text-detective-small text-gray-400 mb-3 line-clamp-2">{alert.message}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="capitalize">{alert.type}</span>
              <span>•</span>
              <span>{formatTimestamp(alert.timestamp)}</span>
              {alert.actionRequired && (
                <>
                  <span>•</span>
                  <span className="text-yellow-500 font-semibold">Action Required</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onViewDetails(alert)}
                className="p-1.5 hover:bg-detective-bg-secondary rounded-lg transition-colors"
                title="View details"
              >
                <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
              <button
                onClick={() => onDismiss(alert.id)}
                className="p-1.5 hover:bg-detective-bg-secondary rounded-lg transition-colors"
                title="Dismiss alert"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
