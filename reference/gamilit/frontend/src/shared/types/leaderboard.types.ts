/**
 * Leaderboard Types
 *
 * Type definitions for leaderboard functionality.
 * Supports global, school, and classroom leaderboards.
 */

/**
 * Leaderboard Type
 * Different types of leaderboards users can view
 *
 * Changed from enum to type union for better compatibility with string literals
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
 */
export type LeaderboardType = 'global' | 'school' | 'classroom';

/**
 * Leaderboard Type Enum (Legacy)
 * @deprecated Use LeaderboardType string union instead for better type inference
 *
 * Kept for backward compatibility with code using enum syntax
 */
export const LeaderboardTypeEnum = {
  GLOBAL: 'global' as const,
  SCHOOL: 'school' as const,
  CLASSROOM: 'classroom' as const,
} as const;

/**
 * Maya Rank - DEPRECATED
 * @deprecated Use MayaRank from '@/shared/constants/ranks.constants' instead
 * This enum has been removed as it conflicted with the official Maya Rank system.
 *
 * Official values: Ajaw, Nacom, Ah K'in, Halach Uinic, K'uk'ulkan
 * See: ET-GAM-003-rangos-maya.md
 */
// REMOVED: Duplicate enum - use official MayaRank from ranks.constants.ts
import { MayaRank } from '@/shared/constants/ranks.constants';

/**
 * Time Period for Leaderboard
 * Filter leaderboards by time period (future feature)
 */
export enum LeaderboardTimePeriod {
  ALL_TIME = 'all_time',
  THIS_MONTH = 'this_month',
  THIS_WEEK = 'this_week',
  TODAY = 'today',
}

/**
 * Leaderboard Entry Interface
 * Represents a single user in the leaderboard
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  totalXP: number;
  level: number;
  currentRank: MayaRank;
  streak: number; // Days
  achievementCount: number;
  tasksCompleted?: number;
  isCurrentUser?: boolean; // True if this is the logged-in user
}

/**
 * Leaderboard Response
 * Full leaderboard data with metadata
 */
export interface LeaderboardResponse {
  type: LeaderboardType;
  entries: LeaderboardEntry[];
  totalEntries: number;
  currentUserEntry?: LeaderboardEntry; // Always include current user's position
  lastUpdated: string;
  timePeriod?: LeaderboardTimePeriod;
  schoolId?: string;
  classroomId?: string;
}

/**
 * Leaderboard Filter Options
 */
export interface LeaderboardFilterOptions {
  type: LeaderboardType;
  limit?: number;
  offset?: number;
  timePeriod?: LeaderboardTimePeriod;
  schoolId?: string;
  classroomId?: string;
}

/**
 * Current User Position
 * Shows where the current user ranks
 */
export interface CurrentUserPosition {
  rank: number;
  totalXP: number;
  level: number;
  currentRank: MayaRank;
  percentile?: number; // Top X%
  xpToNextRank?: number;
}

/**
 * Rank Icons Mapping - UPDATED to use official Maya Ranks
 * @see ET-GAM-003-rangos-maya.md for official rank definitions
 */
export const RANK_ICONS: Record<MayaRank, string> = {
  [MayaRank.AJAW]: '🌱',
  [MayaRank.NACOM]: '⚔️',
  [MayaRank.AH_KIN]: '☀️',
  [MayaRank.HALACH_UINIC]: '👑',
  [MayaRank.KUKUKULKAN]: '🐉',
};

/**
 * Rank Colors - UPDATED to use official Maya Ranks
 */
export const RANK_COLORS: Record<MayaRank, string> = {
  [MayaRank.AJAW]: '#8B4513',
  [MayaRank.NACOM]: '#CD7F32',
  [MayaRank.AH_KIN]: '#C0C0C0',
  [MayaRank.HALACH_UINIC]: '#FFD700',
  [MayaRank.KUKUKULKAN]: '#9B59B6',
};

/**
 * Rank Display Names (Spanish) - UPDATED to use official Maya Ranks
 */
export const RANK_LABELS: Record<MayaRank, string> = {
  [MayaRank.AJAW]: 'Ajaw',
  [MayaRank.NACOM]: 'Nacom',
  [MayaRank.AH_KIN]: "Ah K'in",
  [MayaRank.HALACH_UINIC]: 'Halach Uinic',
  [MayaRank.KUKUKULKAN]: "K'uk'ulkan",
};

/**
 * Leaderboard Type Labels (Spanish)
 */
export const LEADERBOARD_TYPE_LABELS: Record<LeaderboardType, string> = {
  global: 'Global',
  school: 'Escuela',
  classroom: 'Clase',
};

/**
 * Time Period Labels (Spanish)
 */
export const TIME_PERIOD_LABELS: Record<LeaderboardTimePeriod, string> = {
  [LeaderboardTimePeriod.ALL_TIME]: 'Todo el tiempo',
  [LeaderboardTimePeriod.THIS_MONTH]: 'Este mes',
  [LeaderboardTimePeriod.THIS_WEEK]: 'Esta semana',
  [LeaderboardTimePeriod.TODAY]: 'Hoy',
};
