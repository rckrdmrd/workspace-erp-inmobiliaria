import {
  IsUUID,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

/**
 * CreateScheduledMissionDto - DTO para crear misión programada
 *
 * @description DTO usado para programar una misión en un aula.
 * Solo profesores pueden crear scheduled missions para sus aulas.
 *
 * @see ScheduledMission entity para la estructura completa
 */
export class CreateScheduledMissionDto {
  /**
   * ID de la misión
   */
  @IsUUID('4')
  mission_id!: string;

  /**
   * ID del aula
   */
  @IsUUID('4')
  classroom_id!: string;

  /**
   * ID del usuario que programa (profesor)
   */
  @IsUUID('4')
  scheduled_by!: string;

  /**
   * Fecha y hora de inicio
   */
  @IsDateString()
  starts_at!: string;

  /**
   * Fecha y hora de fin
   */
  @IsDateString()
  ends_at!: string;

  /**
   * Indica si está activa
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * XP bonus adicional
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  bonus_xp?: number;

  /**
   * ML Coins bonus adicionales
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  bonus_coins?: number;
}
