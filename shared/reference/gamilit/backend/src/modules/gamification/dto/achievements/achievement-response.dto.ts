import { Expose } from 'class-transformer';
import {
  AchievementCategoryEnum,
  DifficultyLevelEnum,
} from '@shared/constants/enums.constants';

/**
 * AchievementResponseDto
 *
 * @description DTO de respuesta con información completa del logro.
 */
export class AchievementResponseDto {
  @Expose()
  id!: string;

  @Expose()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  icon!: string;

  // =====================================================
  // CATEGORIZATION
  // =====================================================

  @Expose()
  category!: AchievementCategoryEnum;

  @Expose()
  rarity!: string;

  @Expose()
  difficulty_level!: DifficultyLevelEnum;

  // =====================================================
  // CONDITIONS & REWARDS
  // =====================================================

  @Expose()
  conditions!: Record<string, any>;

  @Expose()
  rewards!: Record<string, any>;

  @Expose()
  ml_coins_reward!: number;

  // =====================================================
  // VISIBILITY & STATUS
  // =====================================================

  @Expose()
  is_secret!: boolean;

  @Expose()
  is_active!: boolean;

  @Expose()
  is_repeatable!: boolean;

  // =====================================================
  // ORDERING & POINTS
  // =====================================================

  @Expose()
  order_index!: number;

  @Expose()
  points_value!: number;

  // =====================================================
  // MESSAGING & GUIDANCE
  // =====================================================

  @Expose()
  unlock_message?: string;

  @Expose()
  instructions?: string;

  @Expose()
  tips?: string[];

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  @Expose()
  metadata!: Record<string, any>;

  @Expose()
  created_by?: string;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;
}
