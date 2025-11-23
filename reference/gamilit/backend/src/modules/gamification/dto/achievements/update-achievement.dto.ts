import {
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  IsObject,
  IsArray,
  Min,
} from 'class-validator';
import {
  AchievementCategoryEnum,
  DifficultyLevelEnum,
} from '@shared/constants/enums.constants';

/**
 * UpdateAchievementDto
 *
 * @description DTO para actualizar un logro existente.
 *              Todos los campos son opcionales.
 */
export class UpdateAchievementDto {
  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  // =====================================================
  // CATEGORIZATION
  // =====================================================

  @IsOptional()
  @IsEnum(AchievementCategoryEnum)
  category?: AchievementCategoryEnum;

  @IsOptional()
  @IsString()
  rarity?: string;

  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  // =====================================================
  // CONDITIONS & REWARDS
  // =====================================================

  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_reward?: number;

  // =====================================================
  // VISIBILITY & STATUS
  // =====================================================

  @IsOptional()
  @IsBoolean()
  is_secret?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_repeatable?: boolean;

  // =====================================================
  // ORDERING & POINTS
  // =====================================================

  @IsOptional()
  @IsInt()
  @Min(0)
  order_index?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  points_value?: number;

  // =====================================================
  // MESSAGING & GUIDANCE
  // =====================================================

  @IsOptional()
  @IsString()
  unlock_message?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tips?: string[];

  // =====================================================
  // METADATA
  // =====================================================

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
