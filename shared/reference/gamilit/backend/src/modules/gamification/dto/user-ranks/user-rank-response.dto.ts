import { Expose } from 'class-transformer';

/**
 * UserRankResponseDto
 *
 * @description DTO de respuesta con información completa del rango maya del usuario.
 */
export class UserRankResponseDto {
  @Expose()
  id!: string;

  @Expose()
  user_id!: string;

  @Expose()
  tenant_id?: string;

  // =====================================================
  // RANK INFORMATION
  // =====================================================

  @Expose()
  current_rank!: string;

  @Expose()
  previous_rank?: string;

  // =====================================================
  // PROGRESS & METRICS
  // =====================================================

  @Expose()
  rank_progress_percentage!: number;

  @Expose()
  modules_required_for_next?: number;

  @Expose()
  modules_completed_for_rank!: number;

  @Expose()
  xp_required_for_next?: number;

  @Expose()
  xp_earned_for_rank!: number;

  @Expose()
  ml_coins_bonus!: number;

  // =====================================================
  // CERTIFICATES & BADGES
  // =====================================================

  @Expose()
  certificate_url?: string;

  @Expose()
  badge_url?: string;

  // =====================================================
  // ACHIEVEMENT DATES
  // =====================================================

  @Expose()
  achieved_at?: Date;

  @Expose()
  previous_rank_achieved_at?: Date;

  // =====================================================
  // STATUS
  // =====================================================

  @Expose()
  is_current!: boolean;

  @Expose()
  rank_metadata!: Record<string, any>;

  // =====================================================
  // AUDIT
  // =====================================================

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;
}
