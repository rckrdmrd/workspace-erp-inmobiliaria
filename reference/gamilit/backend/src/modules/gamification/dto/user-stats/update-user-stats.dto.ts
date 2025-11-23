import {
  IsOptional,
  IsInt,
  IsNumber,
  IsString,
  IsDate,
  Min,
  Max,
  IsObject,
} from 'class-validator';

/**
 * UpdateUserStatsDto
 *
 * @description DTO para actualizar estadísticas de usuario.
 *              Todos los campos son opcionales.
 */
export class UpdateUserStatsDto {
  // =====================================================
  // LEVEL & XP SYSTEM
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  total_xp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_to_next_level?: number;

  // =====================================================
  // RANK SYSTEM
  // =====================================================

  @IsOptional()
  @IsString()
  current_rank?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rank_progress?: number;

  // =====================================================
  // ML COINS SYSTEM
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_earned_total?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_spent_total?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_earned_today?: number;

  @IsOptional()
  @IsDate()
  last_ml_coins_reset?: Date;

  // =====================================================
  // STREAK SYSTEM
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  current_streak?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  max_streak?: number;

  @IsOptional()
  @IsDate()
  streak_started_at?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  days_active_total?: number;

  // =====================================================
  // PROGRESS & COMPLETION
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  exercises_completed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  modules_completed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  total_score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  average_score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  perfect_scores?: number;

  // =====================================================
  // ACHIEVEMENTS & REWARDS
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  achievements_earned?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  certificates_earned?: number;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  @IsOptional()
  @IsString()
  total_time_spent?: string;

  @IsOptional()
  @IsString()
  weekly_time_spent?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sessions_count?: number;

  // =====================================================
  // PERIODIC METRICS
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  weekly_xp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  monthly_xp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  weekly_exercises?: number;

  // =====================================================
  // RANKING POSITIONS
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(1)
  global_rank_position?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  class_rank_position?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  school_rank_position?: number;

  // =====================================================
  // ACTIVITY TIMESTAMPS
  // =====================================================

  @IsOptional()
  @IsDate()
  last_activity_at?: Date;

  @IsOptional()
  @IsDate()
  last_login_at?: Date;

  // =====================================================
  // METADATA
  // =====================================================

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
