import { Expose } from 'class-transformer';

/**
 * UserStatsResponseDto
 *
 * @description DTO de respuesta con todas las estadísticas del usuario.
 *              Incluye todos los campos del entity.
 */
export class UserStatsResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  @Expose()
  tenant_id?: string;

  // =====================================================
  // LEVEL & XP SYSTEM
  // =====================================================

  @Expose()
  level!: number;

  @Expose()
  total_xp!: number;

  @Expose()
  xp_to_next_level!: number;

  // =====================================================
  // RANK SYSTEM
  // =====================================================

  @Expose()
  current_rank!: string;

  @Expose()
  rank_progress!: number;

  // =====================================================
  // ML COINS SYSTEM
  // =====================================================

  @Expose()
  ml_coins!: number;

  @Expose()
  ml_coins_earned_total!: number;

  @Expose()
  ml_coins_spent_total!: number;

  @Expose()
  ml_coins_earned_today!: number;

  @Expose()
  last_ml_coins_reset?: Date;

  // =====================================================
  // STREAK SYSTEM
  // =====================================================

  @Expose()
  current_streak!: number;

  @Expose()
  max_streak!: number;

  @Expose()
  streak_started_at?: Date;

  @Expose()
  days_active_total!: number;

  // =====================================================
  // PROGRESS & COMPLETION
  // =====================================================

  @Expose()
  exercises_completed!: number;

  @Expose()
  modules_completed!: number;

  @Expose()
  total_score!: number;

  @Expose()
  average_score?: number;

  @Expose()
  perfect_scores!: number;

  // =====================================================
  // ACHIEVEMENTS & REWARDS
  // =====================================================

  @Expose()
  achievements_earned!: number;

  @Expose()
  certificates_earned!: number;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  @Expose()
  total_time_spent!: string;

  @Expose()
  weekly_time_spent!: string;

  @Expose()
  sessions_count!: number;

  // =====================================================
  // PERIODIC METRICS
  // =====================================================

  @Expose()
  weekly_xp!: number;

  @Expose()
  monthly_xp!: number;

  @Expose()
  weekly_exercises!: number;

  // =====================================================
  // RANKING POSITIONS
  // =====================================================

  @Expose()
  global_rank_position?: number;

  @Expose()
  class_rank_position?: number;

  @Expose()
  school_rank_position?: number;

  // =====================================================
  // ACTIVITY TIMESTAMPS
  // =====================================================

  @Expose()
  last_activity_at?: Date;

  @Expose()
  last_login_at?: Date;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  @Expose()
  metadata!: Record<string, any>;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;
}
