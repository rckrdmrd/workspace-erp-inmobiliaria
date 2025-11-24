/**
 * Achievement Types
 *
 * Type definitions for achievements and user achievement progress.
 * Used throughout the application for gamification features.
 */

/**
 * Achievement Categories
 * Different categories help organize achievements into meaningful groups
 *
 * Changed from enum to type union for better compatibility with string literals
 */
export type AchievementCategory =
  | 'progress'
  | 'streak'
  | 'completion'
  | 'social'
  | 'special'
  | 'mastery'
  | 'exploration'
  | 'collection'
  | 'hidden';

/**
 * Achievement Category Enum (Legacy)
 * @deprecated Use AchievementCategory string union instead for better type inference
 */
export const AchievementCategoryEnum = {
  PROGRESS: 'progress' as const,
  STREAK: 'streak' as const,
  COMPLETION: 'completion' as const,
  SOCIAL: 'social' as const,
  SPECIAL: 'special' as const,
  MASTERY: 'mastery' as const,
  EXPLORATION: 'exploration' as const,
  COLLECTION: 'collection' as const,
} as const;

/**
 * Achievement Types
 * Determines how the achievement is displayed and rewarded
 */
export enum AchievementType {
  BADGE = 'badge',
  MILESTONE = 'milestone',
  SPECIAL = 'special',
  RANK_PROMOTION = 'rank_promotion',
}

/**
 * Achievement Status
 * Current state of achievement for a user
 *
 * Changed from enum to type union for better compatibility with string literals
 */
export type AchievementStatus = 'locked' | 'in_progress' | 'earned' | 'claimed';

/**
 * Achievement Status Enum (Legacy)
 * @deprecated Use AchievementStatus string union instead for better type inference
 */
export const AchievementStatusEnum = {
  LOCKED: 'locked' as const,
  IN_PROGRESS: 'in_progress' as const,
  EARNED: 'earned' as const,
  CLAIMED: 'claimed' as const,
} as const;

/**
 * Achievement Condition
 * Defines what needs to be accomplished to unlock an achievement
 */
export interface AchievementCondition {
  type: string;
  target: number;
  current?: number;
  description: string;
}

/**
 * Achievement Rewards
 * What the user receives upon earning/claiming the achievement
 */
export interface AchievementReward {
  xp: number;
  mlCoins: number;
  items?: string[];
  rankPromotion?: string;
}

/**
 * Achievement Interface
 * Complete achievement definition with all properties
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  category: AchievementCategory;
  type: AchievementType;
  conditions: AchievementCondition[];
  rewards: AchievementReward;
  isHidden: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User Achievement Interface
 * Tracks a user's progress and status for a specific achievement
 */
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number; // 0-100 percentage
  earnedAt?: string; // ISO date string when earned
  claimedAt?: string; // ISO date string when rewards claimed
  achievement: Achievement; // Full achievement details
  status: AchievementStatus;
}

/**
 * Achievement Filter Interface
 * Used for filtering achievements in the UI
 */
export interface AchievementFilter {
  category?: AchievementCategory | 'all';
  status?: AchievementStatus | 'all';
  sortBy?: 'name' | 'progress' | 'earnedDate' | 'rarity';
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}

/**
 * Achievement Summary
 * Overview stats for user's achievement progress
 */
export interface AchievementSummary {
  total: number;
  earned: number;
  claimed: number;
  inProgress: number;
  locked: number;
  completionPercentage: number;
  recentlyEarned: UserAchievement[];
}

/**
 * Category-specific color mappings for UI
 */
export const ACHIEVEMENT_CATEGORY_COLORS: Record<AchievementCategory, string> = {
  progress: 'blue',
  streak: 'orange',
  completion: 'green',
  social: 'purple',
  special: 'pink',
  mastery: 'yellow',
  exploration: 'cyan',
  collection: 'teal',
  hidden: 'gray',
};

/**
 * Category display names (Spanish)
 */
export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  progress: 'Progreso',
  streak: 'Rachas',
  completion: 'Completado',
  social: 'Social',
  special: 'Especial',
  mastery: 'Maestría',
  exploration: 'Exploración',
  collection: 'Colección',
  hidden: 'Oculto',
};

/**
 * Rarity color mappings for UI
 */
export const ACHIEVEMENT_RARITY_COLORS = {
  common: 'gray',
  rare: 'blue',
  epic: 'purple',
  legendary: 'yellow',
} as const;
