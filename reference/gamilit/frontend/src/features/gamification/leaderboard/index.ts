/**
 * Leaderboard Module Exports
 *
 * Central export point for all leaderboard-related components and utilities
 */

export { LiveLeaderboard } from './LiveLeaderboard';
export type {
  LiveLeaderboardProps,
  LeaderboardTypeVariant,
  LeaderboardEntry
} from './LiveLeaderboard';

// Re-export related components from social feature
export { LeaderboardEntry as LeaderboardEntryCard } from '../social/components/Leaderboards/LeaderboardEntry';
export { UserPositionCard } from '../social/components/Leaderboards/UserPositionCard';
export { LeaderboardPodium } from '../social/components/Leaderboards/LeaderboardPodium';
export { AdvancedLeaderboardTable } from '../social/components/Leaderboards/AdvancedLeaderboardTable';
export { EnhancedLeaderboardTabs } from '../social/components/Leaderboards/EnhancedLeaderboardTabs';

// Re-export hooks
export { useLeaderboards } from '../social/hooks/useLeaderboards';

// Re-export types
export type {
  LeaderboardType,
  TimePeriod,
  LeaderboardData,
  LeaderboardFilter,
  UserLeaderboardStats,
  RankChange
} from '../social/types/leaderboardsTypes';
