import { Expose, Type } from 'class-transformer';

/**
 * UserAchievementResponseDto
 *
 * @description DTO de respuesta para user achievements.
 * Define qué campos se exponen al cliente.
 *
 * @see UserAchievement entity
 */
export class UserAchievementResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  @Expose()
  achievement_id!: string;

  @Expose()
  progress!: number;

  @Expose()
  max_progress!: number;

  @Expose()
  is_completed!: boolean;

  @Expose()
  completion_percentage!: number;

  @Expose()
  @Type(() => Date)
  completed_at!: Date | null;

  @Expose()
  notified!: boolean;

  @Expose()
  viewed!: boolean;

  @Expose()
  rewards_claimed!: boolean;

  @Expose()
  rewards_received!: Record<string, any>;

  @Expose()
  progress_data!: Record<string, any>;

  @Expose()
  milestones_reached!: string[] | null;

  @Expose()
  metadata!: Record<string, any>;

  @Expose()
  @Type(() => Date)
  started_at!: Date;

  @Expose()
  @Type(() => Date)
  created_at!: Date;
}
