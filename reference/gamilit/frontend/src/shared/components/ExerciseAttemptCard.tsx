import React from 'react';
import {
  PlayCircle,
  CheckCircle,
  Code,
  FileText,
  ListChecks,
  HelpCircle,
  Play,
} from 'lucide-react';
import type { Exercise, ExerciseType } from '@/shared/types/educational.types';
import type { ExerciseAttempt } from '@/shared/types/progress.types';
import { formatScore, formatAttemptCount } from '@/shared/utils/formatters';

interface ExerciseAttemptCardProps {
  exercise: Exercise;
  attempts?: ExerciseAttempt[];
  onStart: () => void;
}

/**
 * ExerciseAttemptCard Component
 * Displays an exercise card with attempt history
 *
 * Features:
 * - Exercise icon based on type
 * - Exercise title and description
 * - Status badge (not_attempted, in_progress, completed)
 * - Best score display
 * - Attempts count
 * - "Start" or "Continue" button
 * - Hover effect
 *
 * @param exercise - Exercise data
 * @param attempts - Exercise attempts (optional)
 * @param onStart - Start/continue handler
 */
export const ExerciseAttemptCard: React.FC<ExerciseAttemptCardProps> = ({
  exercise,
  attempts = [],
  onStart,
}) => {
  // Calculate status and best score
  const hasAttempts = attempts.length > 0;
  const completedAttempts = attempts.filter((a) => a.status === 'completed');
  const hasCompleted = completedAttempts.length > 0;
  const inProgressAttempt = attempts.find((a) => a.status === 'in_progress');
  const bestScore = hasCompleted
    ? Math.max(...completedAttempts.map((a) => a.score))
    : inProgressAttempt?.score || 0;

  // Determine status
  const status = hasCompleted ? 'completed' : hasAttempts ? 'in_progress' : 'not_attempted';
  const statusText = hasCompleted ? 'Completed' : hasAttempts ? 'In Progress' : 'Not Started';

  // Get icon for exercise type
  const getExerciseIcon = (type: ExerciseType) => {
    const iconMap: Record<ExerciseType, React.ComponentType<{ className?: string }>> = {
      multiple_choice: ListChecks,
      code_completion: Code,
      true_false: HelpCircle,
      fill_in_blank: FileText,
      coding_challenge: Code,
      matching: ListChecks,
    };
    return iconMap[type] || FileText;
  };

  const Icon = getExerciseIcon(exercise.type);

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_attempted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Button text
  const buttonText = hasCompleted ? 'Review' : hasAttempts ? 'Continue' : 'Start';

  return (
    <div
      className="
        bg-white rounded-lg shadow-sm border border-gray-200 p-4
        transition-all duration-200 hover:shadow-md hover:border-orange-300
      "
    >
      <div className="flex items-start space-x-4">
        {/* Exercise Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        {/* Exercise Info */}
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-base font-semibold text-gray-900 line-clamp-1 mr-2">
              {exercise.title}
            </h4>
            <span
              className={`
                px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0
                ${getStatusColor()}
              `}
            >
              {statusText}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>

          {/* Stats Row */}
          <div className="flex items-center space-x-4 mb-3">
            {/* Exercise Type */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Type:</span>
              <span className="text-xs font-medium text-gray-700 capitalize">
                {exercise.type.replace('_', ' ')}
              </span>
            </div>

            {/* Attempts Count */}
            {hasAttempts && (
              <div className="flex items-center space-x-1">
                <PlayCircle className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
                  {formatAttemptCount(attempts.length)}
                </span>
              </div>
            )}

            {/* Best Score */}
            {hasCompleted && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-gray-700">
                  Best: {formatScore(bestScore, exercise.max_score)}
                </span>
              </div>
            )}

            {/* Estimated Time */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">~{exercise.estimated_time_minutes} min</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onStart}
            className="
              w-full sm:w-auto inline-flex items-center justify-center space-x-2
              px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg
              hover:bg-orange-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
            "
          >
            <Play className="w-4 h-4" />
            <span>{buttonText}</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator for In Progress */}
      {inProgressAttempt && status === 'in_progress' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Current Progress</span>
            <span className="text-xs font-semibold text-orange-600">
              {formatScore(inProgressAttempt.score, exercise.max_score)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${(inProgressAttempt.score / exercise.max_score) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseAttemptCard;
