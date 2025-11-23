/**
 * Leaderboard Types
 * Defines all types for the leaderboard system
 */

// Legacy types
export type LeaderboardType = 'global' | 'school' | 'grade' | 'friends';
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';
export type RankChange = 'up' | 'down' | 'same' | 'new';

// Sprint 2 - New Leaderboard Types
export type NewLeaderboardType = 'xp' | 'coins' | 'streaks' | 'global-view';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  rankBadge: string;
  score: number;
  xp: number;
  mlCoins: number;
  change: number; // rank change from previous period
  changeType: RankChange;
  isCurrentUser: boolean;
  school?: string;
  grade?: number;
}

export interface LeaderboardData {
  type: LeaderboardType;
  timePeriod: TimePeriod;
  entries: LeaderboardEntry[];
  userRank?: number;
  totalParticipants: number;
  lastUpdated: Date;
  season?: string;
}

export interface LeaderboardFilter {
  type: LeaderboardType;
  timePeriod: TimePeriod;
  school?: string;
  grade?: number;
  limit?: number;
}

export interface UserLeaderboardStats {
  globalRank: number;
  schoolRank?: number;
  gradeRank?: number;
  friendsRank?: number;
  bestRank: number;
  totalScore: number;
  percentile: number;
}

// Sprint 2 - New Leaderboard Entry Types
export interface BaseLeaderboardEntry {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  rankPosition: number;
  mayaRank: string | null;
  score: number;
  lastUpdated: Date;
}

export interface XPLeaderboardEntry extends BaseLeaderboardEntry {
  totalXp: number;
  currentLevel: number;
}

export interface CoinsLeaderboardEntry extends BaseLeaderboardEntry {
  mlCoins: number;
  mlCoinsLifetime: number;
}

export interface StreakLeaderboardEntry extends BaseLeaderboardEntry {
  currentStreak: number;
  maxStreak: number;
}

export interface GlobalLeaderboardEntry extends BaseLeaderboardEntry {
  totalXp: number;
  mlCoinsLifetime: number;
  currentStreak: number;
  maxStreak: number;
  globalScore: number;
}
