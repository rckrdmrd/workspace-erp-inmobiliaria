import React from 'react';
import { Trophy, Award, Medal, Star, Lock } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { SkeletonAchievement } from './Skeleton';
import type { UserAchievement } from '@/shared/types/achievement.types';
import { AchievementStatusEnum } from '@/shared/types/achievement.types';

interface AchievementsGridProps {
  achievements: UserAchievement[];
  isLoading?: boolean;
  maxDisplay?: number;
  onAchievementClick?: (achievement: UserAchievement) => void;
}

// Icon mapping based on achievement type/name
const getAchievementIcon = (userAchievement: UserAchievement) => {
  const iconName = userAchievement.achievement.icon?.toLowerCase() || '';

  if (iconName.includes('trophy')) {
    return <Trophy className="w-8 h-8" />;
  }
  if (iconName.includes('medal')) {
    return <Medal className="w-8 h-8" />;
  }
  if (iconName.includes('star')) {
    return <Star className="w-8 h-8" />;
  }
  // Default
  return <Award className="w-8 h-8" />;
};

/**
 * AchievementCard Component
 * Individual achievement card with progress and status
 */
const AchievementCard: React.FC<{
  userAchievement: UserAchievement;
  onClick?: (userAchievement: UserAchievement) => void;
}> = ({ userAchievement, onClick }) => {
  const isLocked = userAchievement.status === AchievementStatusEnum.LOCKED;
  const isCompleted = userAchievement.status === AchievementStatusEnum.EARNED || userAchievement.status === AchievementStatusEnum.CLAIMED;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      onClick={() => onClick?.(userAchievement)}
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-5',
        'transition-all duration-200',
        'hover:shadow-md hover:border-orange-300',
        onClick && 'cursor-pointer',
        isLocked && 'opacity-60'
      )}
    >
      {/* Icon/Badge */}
      <div className="flex justify-center mb-4">
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            'transition-all duration-200',
            isCompleted
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
              : isLocked
                ? 'bg-gray-200 text-gray-400'
                : 'bg-blue-100 text-blue-600'
          )}
        >
          {isLocked ? <Lock className="w-8 h-8" /> : getAchievementIcon(userAchievement)}
        </div>
      </div>

      {/* Title */}
      <h3
        className={cn(
          'text-center font-semibold mb-2 line-clamp-1',
          isLocked ? 'text-gray-500' : 'text-gray-900'
        )}
      >
        {userAchievement.achievement.name}
      </h3>

      {/* Description */}
      <p
        className={cn(
          'text-sm text-center mb-4 line-clamp-2',
          isLocked ? 'text-gray-400' : 'text-gray-600'
        )}
      >
        {userAchievement.achievement.description}
      </p>

      {/* Status */}
      {isCompleted && userAchievement.earnedAt && (
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Unlocked {formatDate(userAchievement.earnedAt)}
          </span>
        </div>
      )}

      {isLocked && (
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Locked
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * AchievementsGrid Component
 * Grid display of user achievements with loading and empty states
 *
 * Features:
 * - Responsive grid layout (4 columns desktop, 2 tablet, 1 mobile)
 * - Achievement cards with icon, title, description
 * - Progress indicators
 * - Locked/unlocked states with visual feedback
 * - Loading skeletons
 * - Empty state message
 * - Click handlers for achievement details
 *
 * @param achievements - Array of achievements from API
 * @param isLoading - Loading state
 * @param maxDisplay - Maximum number of achievements to display
 * @param onAchievementClick - Optional click handler
 *
 * @example
 * ```tsx
 * <AchievementsGrid
 *   achievements={userAchievements}
 *   isLoading={loading}
 *   maxDisplay={8}
 *   onAchievementClick={(achievement) => console.log(achievement)}
 * />
 * ```
 */
export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
  isLoading = false,
  maxDisplay,
  onAchievementClick,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonAchievement key={index} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!achievements || achievements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start learning to unlock achievements! Complete missions, earn XP, and showcase your
          progress.
        </p>
      </div>
    );
  }

  // Display achievements (with optional limit)
  const displayedAchievements = maxDisplay
    ? achievements.slice(0, maxDisplay)
    : achievements;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedAchievements.map((userAchievement) => (
          <AchievementCard
            key={userAchievement.id}
            userAchievement={userAchievement}
            onClick={onAchievementClick}
          />
        ))}
      </div>

      {/* Show more indicator */}
      {maxDisplay && achievements.length > maxDisplay && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {maxDisplay} of {achievements.length} achievements
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsGrid;
