/**
 * Gamification DTOs - Barrel Export
 *
 * @description Exporta todos los DTOs del módulo de gamificación.
 * @usage import { CreateUserStatsDto, UserStatsResponseDto } from '@/modules/gamification/dto';
 */

// UserStats DTOs
export * from './user-stats/create-user-stats.dto';
export * from './user-stats/update-user-stats.dto';
export * from './user-stats/user-stats-response.dto';

// UserRank DTOs
export * from './user-ranks/create-user-rank.dto';
export * from './user-ranks/user-rank-response.dto';

// Achievement DTOs
export * from './achievements/create-achievement.dto';
export * from './achievements/update-achievement.dto';
export * from './achievements/achievement-response.dto';

// ML Coins DTOs
export * from './ml-coins/create-transaction.dto';
export * from './ml-coins/transaction-response.dto';

// Missions DTOs
export * from './missions/create-mission.dto';
export * from './missions/update-mission.dto';
export * from './missions/mission-response.dto';
export * from './missions/mission-stats.dto';
export * from './missions/update-mission-progress.dto';

// Comodines DTOs
export * from './comodines/purchase-comodin.dto';
export * from './comodines/use-comodin.dto';
export * from './comodines/inventory-response.dto';

// User Achievements DTOs
export * from './user-achievements/grant-achievement.dto';
export * from './user-achievements/user-achievement-response.dto';

// Notifications DTOs
export * from './notifications/create-notification.dto';
export * from './notifications/notification-response.dto';
export * from './notifications/mark-read.dto';

// Leaderboard DTOs
export * from './leaderboard/leaderboard-entry.dto';
