import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  UserStats,
  UserRank,
  Achievement,
  UserAchievement,
  AchievementCategory,
  MLCoinsTransaction,
  Mission,
  ComodinesInventory,
  LeaderboardMetadata,
  ActiveBoost,
  InventoryTransaction,
} from './entities';

// External entities
import { Profile } from '@/modules/auth/entities';
import { Notification } from '@/modules/notifications/entities/notification.entity';

// Services
import {
  UserStatsService,
  AchievementsService,
  MLCoinsService,
  RanksService,
  LeaderboardService,
  MissionsService,
  ComodinesService,
} from './services';

// Controllers
import {
  UserStatsController,
  AchievementsController,
  MLCoinsController,
  RanksController,
  LeaderboardController,
  MissionsController,
  ComodinesController,
} from './controllers';

// Constants
import { DB_SCHEMAS } from '@/shared/constants';

/**
 * GamificationModule
 *
 * @description Módulo de gamificación completo con sistema de rangos Maya,
 * ML Coins, achievements, misiones y power-ups.
 *
 * @features
 * - Sistema de rangos Maya (5 niveles)
 * - Economía virtual (ML Coins)
 * - 30+ Achievements
 * - Misiones diarias/semanales
 * - Power-ups (3 tipos)
 * - Leaderboards (global, school, classroom)
 * - Notificaciones en tiempo real
 *
 * @exports
 * - UserStatsService
 * - AchievementsService
 * - MLCoinsService
 */
@Module({
  imports: [
    // Connection 'gamification' handles schema 'gamification_system'
    TypeOrmModule.forFeature(
      [
        UserStats,
        UserRank,
        Achievement,
        UserAchievement,
        AchievementCategory,
        MLCoinsTransaction,
        Mission,
        ComodinesInventory,
        Notification,
        LeaderboardMetadata,
        ActiveBoost,
        InventoryTransaction,
      ],
      'gamification',
    ),
    // Connection 'auth' for Profile entity (needed by LeaderboardService)
    TypeOrmModule.forFeature([Profile], 'auth'),
  ],
  providers: [
    UserStatsService,
    AchievementsService,
    MLCoinsService,
    RanksService,
    LeaderboardService,
    MissionsService,
    ComodinesService,
  ],
  controllers: [
    UserStatsController,
    AchievementsController,
    MLCoinsController,
    RanksController,
    LeaderboardController,
    MissionsController,
    ComodinesController,
  ],
  exports: [
    UserStatsService,
    AchievementsService,
    MLCoinsService,
    RanksService,
    LeaderboardService,
    MissionsService,
    ComodinesService,
  ],
})
export class GamificationModule {}
