import React from 'react';
import { cn } from '@/shared/utils/cn';

interface UserStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  color?: 'blue' | 'purple' | 'yellow' | 'green' | 'red' | 'indigo';
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    border: 'border-yellow-200',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-200',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    border: 'border-indigo-200',
  },
};

/**
 * UserStatsCard Component
 * Displays a single statistic with icon, value, and optional subtitle
 *
 * Features:
 * - Color-themed design
 * - Icon on left, value on right
 * - Optional subtitle/description
 * - Optional trend indicator
 * - Hover animation (scale up)
 * - Shadow and rounded corners
 * - Responsive padding
 *
 * @param title - Stat title/label
 * @param value - The main stat value (number or string)
 * @param icon - Icon component (from lucide-react)
 * @param subtitle - Optional subtitle or change indicator
 * @param color - Color theme (default: blue)
 * @param trend - Optional trend direction
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * import { Zap } from 'lucide-react';
 *
 * <UserStatsCard
 *   title="Total XP"
 *   value={1250}
 *   icon={<Zap />}
 *   subtitle="+50 today"
 *   color="yellow"
 *   trend="up"
 * />
 * ```
 */
export const UserStatsCard: React.FC<UserStatsCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  color = 'blue',
  trend,
  className,
}) => {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend === 'up') {
      return (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }

    if (trend === 'down') {
      return (
        <svg
          className="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        'p-6 transition-all duration-200',
        'hover:shadow-md hover:scale-[1.02]',
        'cursor-default',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div className={cn('p-3 rounded-lg', colors.bg, 'border', colors.border)}>
          <div className={cn('w-6 h-6', colors.icon)}>{icon}</div>
        </div>

        {/* Value */}
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>

      {/* Subtitle with trend */}
      {subtitle && (
        <div className="mt-2 flex items-center space-x-1">
          {getTrendIcon()}
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default UserStatsCard;
