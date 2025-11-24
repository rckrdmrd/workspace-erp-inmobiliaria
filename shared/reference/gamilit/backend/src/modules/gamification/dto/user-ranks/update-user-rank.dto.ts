import {
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsDate,
  IsString,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { MayaRank } from '@shared/constants/enums.constants';

/**
 * UpdateUserRankDto
 *
 * @description DTO para actualizar un registro de rango maya existente.
 *              Uso administrativo para correcciones manuales.
 */
export class UpdateUserRankDto {
  /**
   * Rango maya actual
   */
  @IsOptional()
  @IsEnum(MayaRank)
  current_rank?: MayaRank;

  /**
   * Rango maya anterior
   */
  @IsOptional()
  @IsEnum(MayaRank)
  previous_rank?: MayaRank;

  /**
   * Porcentaje de progreso hacia el siguiente rango (0-100)
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rank_progress_percentage?: number;

  /**
   * Módulos requeridos para alcanzar el siguiente rango
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  modules_required_for_next?: number;

  /**
   * Módulos completados para el rango actual
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  modules_completed_for_rank?: number;

  /**
   * XP requerida para alcanzar el siguiente rango
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  xp_required_for_next?: number;

  /**
   * XP ganada para el rango actual
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  xp_earned_for_rank?: number;

  /**
   * Bonus de ML Coins otorgado al alcanzar el rango
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_bonus?: number;

  /**
   * URL del certificado obtenido al alcanzar el rango
   */
  @IsOptional()
  @IsString()
  certificate_url?: string;

  /**
   * URL del badge/insignia del rango
   */
  @IsOptional()
  @IsString()
  badge_url?: string;

  /**
   * Fecha y hora en que se alcanzó el rango actual
   */
  @IsOptional()
  @IsDate()
  achieved_at?: Date;

  /**
   * Fecha y hora en que se alcanzó el rango anterior
   */
  @IsOptional()
  @IsDate()
  previous_rank_achieved_at?: Date;

  /**
   * Indica si este es el rango actual del usuario
   */
  @IsOptional()
  @IsBoolean()
  is_current?: boolean;

  /**
   * Metadatos adicionales del rango en formato JSON
   */
  @IsOptional()
  @IsObject()
  rank_metadata?: Record<string, any>;
}
