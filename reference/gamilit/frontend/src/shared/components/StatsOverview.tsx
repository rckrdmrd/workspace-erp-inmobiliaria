import React from 'react';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { ProgressSummary } from '@/shared/types/progress.types';
import { formatTimeSpent, formatProgressPercentage } from '@/shared/utils/formatters';

interface StatsOverviewProps {
  summary: ProgressSummary;
}

/**
 * StatsOverview Component
 * Displays high-level progress statistics in a grid
 *
 * Features:
 * - 4 stat cards: Total Modules, Completed, In Progress, Not Started
 * - Additional metrics: Average score, Total time spent
 * - Icon + value + label layout
 * - Color-coded cards
 * - Responsive grid (2x2 mobile, 4x1 desktop)
 *
 * @param summary - Progress summary data
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({ summary }) => {
  const stats = [
    {
      label: 'Total Modules',
      value: summary.total_modules,
      icon: BookOpen,
      color: 'blue',
      subtitle: `${formatProgressPercentage(summary.overall_progress_percentage)} complete`,
    },
    {
      label: 'Completed',
      value: summary.modules_completed,
      icon: CheckCircle,
      color: 'green',
      subtitle: `${summary.modules_mastered} mastered`,
    },
    {
      label: 'In Progress',
      value: summary.modules_in_progress,
      icon: TrendingUp,
      color: 'yellow',
      subtitle: 'Keep going!',
    },
    {
      label: 'Not Started',
      value: summary.modules_not_started,
      icon: Clock,
      color: 'gray',
      subtitle: 'Ready to start',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        icon: 'text-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-900',
        icon: 'text-green-600',
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-900',
        icon: 'text-yellow-600',
      },
      gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        icon: 'text-gray-600',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        icon: 'text-purple-600',
      },
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const colors = getColorClasses(stat.color);
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={`
                ${colors.bg} rounded-lg p-5 border border-gray-200
                transition-all duration-200 hover:shadow-md
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm ${colors.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <p className={`text-3xl font-bold ${colors.text} mb-1`}>{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-600">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Average Score */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.average_score > 0 ? `${Math.round(summary.average_score)}%` : 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {summary.total_exercises_completed > 0
                ? `Based on ${summary.total_exercises_completed} completed exercises`
                : 'Complete exercises to see your average'}
            </p>
          </div>
        </div>

        {/* Total Time Spent */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Total Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTimeSpent(summary.total_time_spent_seconds)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {summary.total_exercises_completed > 0
                ? `${summary.total_exercises_completed} exercises completed`
                : 'Start learning to track your time'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
