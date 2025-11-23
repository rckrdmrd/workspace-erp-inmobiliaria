import { IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Activity Type Enum
 */
export enum ActivityType {
  EXERCISE = 'exercise',
  LESSON = 'lesson',
  ASSESSMENT = 'assessment',
  ASSIGNMENT = 'assignment',
}

/**
 * Activity Priority Enum
 */
export enum ActivityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Query DTO for getting pending activities
 */
export class GetPendingActivitiesDto {
  @ApiPropertyOptional({
    description: 'Filter by activity type',
    enum: ActivityType,
  })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    enum: ActivityPriority,
  })
  @IsOptional()
  @IsEnum(ActivityPriority)
  priority?: ActivityPriority;

  @ApiPropertyOptional({
    description: 'Maximum number of activities to return',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

/**
 * Response DTO for pending activity
 */
export interface PendingActivityDto {
  id: string;
  type: ActivityType;
  title: string;
  module_name: string;
  module_id: string;
  difficulty: string;
  estimated_minutes: number;
  due_date?: Date;
  priority: ActivityPriority;
  xp_reward: number;
  ml_coins_reward: number;
  progress_percentage?: number;
}
