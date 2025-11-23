import React from 'react';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import type { Module } from '@/shared/types/educational.types';
import type { ModuleProgress } from '@/shared/types/progress.types';
import {
  formatTimeSpent,
  formatProgressPercentage,
  formatRelativeTime,
  getStatusBadgeColor,
  getDifficultyBadgeColor,
} from '@/shared/utils/formatters';

interface ProgressCardProps {
  module: Module;
  progress?: ModuleProgress;
  onClick?: () => void;
}

/**
 * ProgressCard Component
 * Displays a module card with progress information
 *
 * Features:
 * - Module thumbnail/icon
 * - Module title and description (truncated)
 * - Progress bar (0-100%)
 * - Status badge (not_started, in_progress, completed, mastered)
 * - Stats: exercises completed, time spent
 * - Last accessed date
 * - Hover effect with scale
 * - Difficulty badge
 *
 * @param module - Module data
 * @param progress - Module progress data (optional)
 * @param onClick - Click handler
 */
export const ProgressCard: React.FC<ProgressCardProps> = ({ module, progress, onClick }) => {
  const progressPercentage = progress?.progress_percentage || 0;
  const status = progress?.status || 'not_started';
  const exercisesCompleted = progress?.completed_exercises || 0;
  const exercisesTotal = progress?.total_exercises || 0;
  const timeSpent = progress?.time_spent_seconds || (typeof progress?.time_spent === 'number' ? progress?.time_spent : 0) || 0;
  const lastAccessed = progress?.last_accessed_at;

  // Truncate description
  const truncatedDescription =
    module.description && module.description.length > 120
      ? module.description.substring(0, 120) + '...'
      : module.description || '';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
        transition-all duration-200 hover:shadow-md hover:scale-[1.02]
        ${onClick ? 'cursor-pointer' : ''}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${module.title} - ${status}`}
    >
      {/* Module Header with Icon/Thumbnail */}
      <div className="relative h-32 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        {module.thumbnail_url ? (
          <img
            src={module.thumbnail_url}
            alt={module.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-white opacity-80" />
        )}

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              px-2 py-1 text-xs font-semibold rounded-full
              ${getDifficultyBadgeColor(module.difficulty)}
            `}
          >
            {module.difficulty}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title and Status Badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2 line-clamp-2">
            {module.title}
          </h3>
          <span
            className={`
              px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0
              ${getStatusBadgeColor(status)}
            `}
          >
            {status.replace('_', ' ')}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{truncatedDescription}</p>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs font-semibold text-orange-600">
                {formatProgressPercentage(progressPercentage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          {/* Exercises Completed */}
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Exercises</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {exercisesCompleted}/{exercisesTotal}
              </p>
            </div>
          </div>

          {/* Time Spent */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Time Spent</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {formatTimeSpent(timeSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Accessed */}
        {lastAccessed && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Last accessed{' '}
              <span className="font-medium text-gray-700">
                {formatRelativeTime(lastAccessed)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;
