import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Activity Action Type Enum
 */
export enum ActivityAction {
  STARTED_MODULE = 'started_module',
  COMPLETED_EXERCISE = 'completed_exercise',
  EARNED_ACHIEVEMENT = 'earned_achievement',
  LEVELED_UP = 'leveled_up',
  EARNED_COINS = 'earned_coins',
  COMPLETED_MODULE = 'completed_module',
  STARTED_SESSION = 'started_session',
}

/**
 * Query DTO for getting recent activities
 */
export class GetRecentActivitiesDto {
  @ApiPropertyOptional({
    description: 'Maximum number of activities to return',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

/**
 * Response DTO for recent activity
 */
export interface RecentActivityDto {
  id: string;
  user_id: string;
  action: ActivityAction;
  description: string;
  entity_type: 'module' | 'exercise' | 'achievement' | 'level' | 'session';
  entity_id: string;
  entity_name: string;
  metadata?: Record<string, any>;
  created_at: Date;
}
