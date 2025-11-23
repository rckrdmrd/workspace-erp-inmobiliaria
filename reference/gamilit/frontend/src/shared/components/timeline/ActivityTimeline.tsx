/**
 * Activity Timeline Component
 *
 * Displays a timeline of user activities with success/error states
 *
 * TODO: This is a stub component created to unblock TypeScript compilation
 * Full implementation needed in Phase 2
 */

import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface ActivityLog {
  id: string;
  action: string;
  resource: string;
  success: boolean;
  timestamp: string;
  details?: string;
  error?: string;
}

export interface ActivityTimelineProps {
  activities: ActivityLog[];
  loading?: boolean;
  emptyMessage?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  loading = false,
  emptyMessage = 'No hay actividad registrada',
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Timeline connector */}
          {index < activities.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
          )}

          {/* Activity item */}
          <div className="flex items-start space-x-3">
            {/* Status icon */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                activity.success
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {activity.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>

            {/* Activity details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(activity.timestamp)}
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {activity.resource}
              </p>

              {activity.details && (
                <p className="text-xs text-gray-500 mt-1">
                  {activity.details}
                </p>
              )}

              {activity.error && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                  <p className="text-xs text-red-700">
                    <span className="font-medium">Error:</span> {activity.error}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
