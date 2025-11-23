/**
 * Leaderboards Components - Barrel Export
 *
 * Centralized export for all leaderboard-related components
 */

// Main Components
export { LeaderboardPodium } from './LeaderboardPodium';
export { UserPositionCard } from './UserPositionCard';
export { EnhancedLeaderboardTabs } from './EnhancedLeaderboardTabs';
export { LeaderboardFilters } from './LeaderboardFilters';
export { AdvancedLeaderboardTable } from './AdvancedLeaderboardTable';
export { RankChangeIndicator } from './RankChangeIndicator';

// Legacy Components (kept for backward compatibility)
export { LeaderboardLayout } from './LeaderboardLayout';
export { LeaderboardEntry } from './LeaderboardEntry';
export { LeaderboardTabs } from './LeaderboardTabs';
export { SeasonSelector } from './SeasonSelector';
// TODO: Implement these leaderboard components (currently empty files)
// export { GlobalLeaderboard } from './GlobalLeaderboard';
// export { SchoolLeaderboard } from './SchoolLeaderboard';
// export { GradeLeaderboard } from './GradeLeaderboard';
// export { FriendsLeaderboard } from './FriendsLeaderboard';

// Types
export type { ExtendedLeaderboardType } from './EnhancedLeaderboardTabs';
export type { TimePeriod, Metric } from './LeaderboardFilters';
