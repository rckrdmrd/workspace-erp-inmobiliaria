import { Expose, Type } from 'class-transformer';

/**
 * ScheduledMissionResponseDto - DTO para respuestas de misión programada
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la misión programada con fechas y bonificaciones.
 *
 * @see ScheduledMission entity para la estructura de base de datos
 */
export class ScheduledMissionResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID de la misión
   */
  @Expose()
  mission_id!: string;

  /**
   * ID del aula
   */
  @Expose()
  classroom_id!: string;

  /**
   * ID del usuario que programó
   */
  @Expose()
  scheduled_by!: string;

  /**
   * Fecha y hora de inicio
   */
  @Expose()
  @Type(() => Date)
  starts_at!: Date;

  /**
   * Fecha y hora de fin
   */
  @Expose()
  @Type(() => Date)
  ends_at!: Date;

  /**
   * Indica si está activa
   */
  @Expose()
  is_active!: boolean;

  /**
   * XP bonus
   */
  @Expose()
  bonus_xp!: number;

  /**
   * ML Coins bonus
   */
  @Expose()
  bonus_coins!: number;

  /**
   * Fecha de creación
   */
  @Expose()
  @Type(() => Date)
  created_at!: Date;
}
