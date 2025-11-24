/**
 * Mission Types for GLIT Platform
 *
 * Comprehensive type definitions for the missions system
 */

export type MissionType = 'daily' | 'weekly' | 'special';

export type MissionCategory =
  | 'exercises'    // Complete exercises
  | 'xp'           // Earn XP
  | 'time'         // Time spent learning
  | 'social'       // Social interactions
  | 'achievement'  // Unlock achievements
  | 'streak';      // Maintain streaks

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export type MissionStatus =
  | 'not_started'  // Mission available but not started
  | 'in_progress'  // Mission started, in progress
  | 'completed'    // Mission completed, ready to claim
  | 'claimed';     // Reward claimed

/**
 * Core Mission Interface
 */
export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  category: MissionCategory;

  // Progress tracking
  targetValue: number;
  currentValue: number;
  progress: number; // percentage (0-100)

  // Rewards
  xpReward: number;
  mlCoinsReward: number;

  // Metadata
  icon: string;
  difficulty: MissionDifficulty;
  status: MissionStatus;

  // Timestamps
  expiresAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  claimedAt?: Date;

  // Optional bonus
  bonusMultiplier?: number; // 1.5x for special events
}

/**
 * Mission Statistics
 */
export interface MissionStats {
  // Daily stats
  todayCompleted: number;
  todayTotal: number;

  // Weekly stats
  weekCompleted: number;
  weekTotal: number;

  // All-time stats
  totalCompleted: number;
  totalXPEarned: number;
  totalMLCoinsEarned: number;

  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
}

/**
 * Mission Reward Details
 */
export interface MissionReward {
  xp: number;
  mlCoins: number;
  bonus?: {
    type: 'multiplier' | 'extra_reward';
    value: number;
    description: string;
  };
}

/**
 * Tracked Mission (for sidebar)
 */
export interface TrackedMission {
  missionId: string;
  trackedAt: Date;
  priority: number; // 1-3
}

/**
 * Mission Filter Options
 */
export interface MissionFilters {
  tab: MissionType | 'all';
  status: MissionStatus | 'all';
  category: MissionCategory | 'all';
  difficulty: MissionDifficulty | 'all';
}

/**
 * Mission Rewards Summary (for preview)
 */
export interface MissionRewardsSummary {
  potential: {
    xp: number;
    mlCoins: number;
  };
  earned: {
    xp: number;
    mlCoins: number;
  };
  bonus: {
    allDailyComplete: boolean;
    allWeeklyComplete: boolean;
    bonusXP: number;
    bonusMLCoins: number;
  };
}

/**
 * Mission API Response
 */
export interface MissionsApiResponse {
  missions: Mission[];
  stats: MissionStats;
  nextResetTime: {
    daily: Date;
    weekly: Date;
  };
}

/**
 * Mission Action Result
 */
export interface MissionActionResult {
  success: boolean;
  message: string;
  mission?: Mission;
  rewards?: MissionReward;
}

/**
 * Mission Progress Event (for real-time updates)
 */
export interface MissionProgressEvent {
  missionId: string;
  currentValue: number;
  progress: number;
  completed: boolean;
  timestamp: Date;
}
