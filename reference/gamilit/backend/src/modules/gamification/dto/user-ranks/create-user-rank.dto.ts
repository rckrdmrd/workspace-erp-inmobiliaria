import {
  IsUUID,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDate,
  IsObject,
  Min,
  Max,
} from 'class-validator';

/**
 * CreateUserRankDto
 *
 * @description DTO para crear un nuevo registro de rango maya de usuario.
 *              Se crea al alcanzar un nuevo rango.
 */
export class CreateUserRankDto {
  /**
   * ID del usuario (FK → auth.users)
   */
  @IsUUID()
  user_id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  // =====================================================
  // RANK INFORMATION
  // =====================================================

  /**
   * Rango maya actual
   */
  @IsString()
  current_rank!: string;

  /**
   * Rango maya anterior
   */
  @IsOptional()
  @IsString()
  previous_rank?: string;

  // =====================================================
  // PROGRESS & METRICS
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rank_progress_percentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  modules_required_for_next?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  modules_completed_for_rank?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_required_for_next?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_earned_for_rank?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_bonus?: number;

  // =====================================================
  // CERTIFICATES & BADGES
  // =====================================================

  @IsOptional()
  @IsString()
  certificate_url?: string;

  @IsOptional()
  @IsString()
  badge_url?: string;

  // =====================================================
  // ACHIEVEMENT DATES
  // =====================================================

  @IsOptional()
  @IsDate()
  achieved_at?: Date;

  @IsOptional()
  @IsDate()
  previous_rank_achieved_at?: Date;

  // =====================================================
  // STATUS
  // =====================================================

  @IsOptional()
  @IsBoolean()
  is_current?: boolean;

  @IsOptional()
  @IsObject()
  rank_metadata?: Record<string, any>;
}
