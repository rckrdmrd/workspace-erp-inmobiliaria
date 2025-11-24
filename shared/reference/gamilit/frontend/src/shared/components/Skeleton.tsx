import React from 'react';
import { cn } from '@/shared/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Base Skeleton Component
 * Generic skeleton loader for content placeholders
 *
 * @param className - Additional CSS classes
 * @param width - Width (default: w-full)
 * @param height - Height (default: h-4)
 * @param rounded - Border radius (default: md)
 *
 * @example
 * ```tsx
 * <Skeleton width="w-32" height="h-8" rounded="lg" />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
}) => {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        width,
        height,
        roundedClass,
        className
      )}
    />
  );
};

/**
 * SkeletonText Component
 * Skeleton for text content with multiple lines
 *
 * @param lines - Number of text lines (default: 3)
 * @param className - Additional CSS classes for container
 *
 * @example
 * ```tsx
 * <SkeletonText lines={4} />
 * ```
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? 'w-3/4' : 'w-full'}
          height="h-4"
        />
      ))}
    </div>
  );
};

/**
 * SkeletonAvatar Component
 * Skeleton for user avatar or profile picture
 *
 * @param size - Avatar size in pixels (default: 40)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SkeletonAvatar size={64} />
 * ```
 */
interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 40,
  className
}) => {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded-full', className)}
      style={{ width: size, height: size }}
    />
  );
};

/**
 * SkeletonCard Component
 * Skeleton for card-based content with header and body
 *
 * @param className - Additional CSS classes
 * @param showAvatar - Show avatar in header (default: false)
 * @param lines - Number of body text lines (default: 3)
 *
 * @example
 * ```tsx
 * <SkeletonCard showAvatar lines={5} />
 * ```
 */
interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className,
  showAvatar = false,
  lines = 3,
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6 space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        {showAvatar && <SkeletonAvatar size={48} />}
        <div className="flex-1 space-y-2">
          <Skeleton width="w-1/3" height="h-5" />
          <Skeleton width="w-1/2" height="h-4" />
        </div>
      </div>

      {/* Body */}
      <SkeletonText lines={lines} />
    </div>
  );
};

/**
 * SkeletonStats Component
 * Skeleton for stats card with icon and value
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SkeletonStats />
 * ```
 */
interface SkeletonStatsProps {
  className?: string;
}

export const SkeletonStats: React.FC<SkeletonStatsProps> = ({ className }) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton width="w-12" height="h-12" rounded="lg" />
        <Skeleton width="w-16" height="h-8" />
      </div>
      <Skeleton width="w-2/3" height="h-4" />
      <Skeleton width="w-1/2" height="h-3" />
    </div>
  );
};

/**
 * SkeletonAchievement Component
 * Skeleton for achievement card
 *
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SkeletonAchievement />
 * ```
 */
interface SkeletonAchievementProps {
  className?: string;
}

export const SkeletonAchievement: React.FC<SkeletonAchievementProps> = ({
  className
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow p-4 space-y-3', className)}>
      {/* Icon */}
      <div className="flex justify-center">
        <Skeleton width="w-16" height="h-16" rounded="full" />
      </div>

      {/* Title */}
      <Skeleton width="w-3/4" height="h-5" className="mx-auto" />

      {/* Description */}
      <SkeletonText lines={2} />

      {/* Progress bar */}
      <div className="space-y-1">
        <Skeleton width="w-full" height="h-2" rounded="full" />
        <div className="flex justify-between">
          <Skeleton width="w-12" height="h-3" />
          <Skeleton width="w-12" height="h-3" />
        </div>
      </div>
    </div>
  );
};

/**
 * SkeletonTable Component
 * Skeleton for table with rows and columns
 *
 * @param rows - Number of table rows (default: 5)
 * @param columns - Number of columns (default: 4)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <SkeletonTable rows={10} columns={5} />
 * ```
 */
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} width="w-full" height="h-6" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} width="w-full" height="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
};
