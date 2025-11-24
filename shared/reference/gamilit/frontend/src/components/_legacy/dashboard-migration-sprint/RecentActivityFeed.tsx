import React, { useCallback, useMemo } from 'react';
import { Clock, BookOpen, Award, TrendingUp, Coins, Play } from 'lucide-react';
import type { RecentActivity } from '@/lib/api/progress.api';
import { ActivityAction } from '@/lib/api/progress.api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentActivityFeedProps {
  activities: RecentActivity[];
  loading?: boolean;
  onActivityClick?: (activity: RecentActivity) => void;
}

/**
 * Activity display configuration map (constant, defined outside component)
 */
const ACTIVITY_DISPLAY_CONFIG: Record<ActivityAction, {
  icon: typeof BookOpen;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  [ActivityAction.COMPLETED_MODULE]: {
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  [ActivityAction.STARTED_MODULE]: {
    icon: Play,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  [ActivityAction.COMPLETED_EXERCISE]: {
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  [ActivityAction.EARNED_ACHIEVEMENT]: {
    icon: Award,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  [ActivityAction.LEVELED_UP]: {
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  [ActivityAction.EARNED_COINS]: {
    icon: Coins,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  [ActivityAction.STARTED_SESSION]: {
    icon: Clock,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
};

const DEFAULT_ACTIVITY_DISPLAY = {
  icon: BookOpen,
  color: 'text-gray-600',
  bgColor: 'bg-gray-50',
  borderColor: 'border-gray-200',
};

/**
 * RecentActivityFeed Component
 * Displays a feed of user's recent learning activities
 */
export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  loading = false,
  onActivityClick,
}) => {
  /**
   * Get icon and color for activity action (memoized)
   */
  const getActivityDisplay = useCallback((action: ActivityAction) => {
    return ACTIVITY_DISPLAY_CONFIG[action] || DEFAULT_ACTIVITY_DISPLAY;
  }, []);

  /**
   * Format relative time (e.g., "hace 2 horas")
   */
  const formatRelativeTime = useCallback((date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
    } catch (error) {
      return 'Fecha desconocida';
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 animate-pulse"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No hay actividades recientes</p>
        <p className="text-gray-500 text-sm mt-1">
          Comienza un módulo para ver tu actividad aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const { icon: Icon, color, bgColor, borderColor } = getActivityDisplay(activity.action);

        return (
          <div
            key={activity.id}
            onClick={() => onActivityClick?.(activity)}
            className={`
              flex items-start gap-3 p-4 bg-white rounded-lg border transition-all duration-200
              ${borderColor}
              ${onActivityClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''}
            `}
          >
            {/* Icon */}
            <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium leading-snug">
                {activity.description}
              </p>

              {/* Metadata */}
              {activity.metadata && (
                <div className="flex items-center gap-3 mt-2 text-sm">
                  {activity.metadata.xp_earned && (
                    <span className="text-purple-600 font-medium">
                      +{activity.metadata.xp_earned} XP
                    </span>
                  )}
                  {activity.metadata.ml_coins_earned && (
                    <span className="text-amber-600 font-medium">
                      +{activity.metadata.ml_coins_earned} ML
                    </span>
                  )}
                  {activity.metadata.score !== undefined && activity.metadata.max_score !== undefined && (
                    <span className="text-gray-600">
                      {activity.metadata.score}/{activity.metadata.max_score} pts
                    </span>
                  )}
                  {activity.metadata.difficulty && (
                    <span className="text-gray-500 capitalize">
                      {activity.metadata.difficulty.replace('_', ' ')}
                    </span>
                  )}
                  {activity.metadata.duration_seconds && (
                    <span className="text-gray-500">
                      {Math.ceil(activity.metadata.duration_seconds / 60)} min
                    </span>
                  )}
                </div>
              )}

              {/* Time */}
              <p className="text-gray-500 text-xs mt-2">
                {formatRelativeTime(activity.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivityFeed;
