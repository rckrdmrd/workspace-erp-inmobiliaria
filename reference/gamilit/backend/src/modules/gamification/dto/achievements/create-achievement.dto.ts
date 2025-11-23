import {
  IsUUID,
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
 * CreateAchievementDto
 *
 * @description DTO para crear un nuevo logro (achievement) en el catálogo.
 */
export class CreateAchievementDto {
  /**
   * ID del tenant (opcional)
   */
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre del logro (REQUERIDO)
   */
  @IsString()
  name!: string;

  /**
   * Descripción del logro
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Icono del logro
   */
  @IsOptional()
  @IsString()
  icon?: string;

  // =====================================================
  // CATEGORIZATION
  // =====================================================

  /**
   * Categoría del logro (REQUERIDO)
   */
  @IsEnum(AchievementCategoryEnum)
  category!: AchievementCategoryEnum;

  /**
   * Rareza: common, rare, epic, legendary
   */
  @IsOptional()
  @IsString()
  rarity?: string;

  /**
   * Nivel de dificultad
   */
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  // =====================================================
  // CONDITIONS & REWARDS
  // =====================================================

  /**
   * Condiciones JSON para desbloquear (REQUERIDO)
   */
  @IsObject()
  conditions!: Record<string, any>;

  /**
   * Recompensas JSON otorgadas
   */
  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  /**
   * Recompensa de ML Coins
   */
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

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
