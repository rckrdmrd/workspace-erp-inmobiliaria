import { Expose, Type } from 'class-transformer';

/**
 * TeamChallengeResponseDto - DTO para respuestas de desafíos de equipos
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see TeamChallenge entity para la estructura de base de datos
 */
export class TeamChallengeResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del equipo
   */
  @Expose()
  team_id!: string;

  /**
   * ID del desafío/challenge
   */
  @Expose()
  challenge_id!: string;

  /**
   * Estado del desafío
   */
  @Expose()
  status!: string;

  /**
   * Fecha de inicio del desafío
   */
  @Expose()
  @Type(() => Date)
  started_at!: Date;

  /**
   * Fecha de completación del desafío
   */
  @Expose()
  @Type(() => Date)
  completed_at!: Date | null;

  /**
   * Puntuación obtenida
   */
  @Expose()
  score!: number;
}
