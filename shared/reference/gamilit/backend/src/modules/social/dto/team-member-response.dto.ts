import { Expose, Type } from 'class-transformer';

/**
 * TeamMemberResponseDto - DTO para respuestas de membresía en equipos
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see TeamMember entity para la estructura de base de datos
 */
export class TeamMemberResponseDto {
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
   * ID del usuario miembro
   */
  @Expose()
  user_id!: string;

  /**
   * Rol del miembro en el equipo
   */
  @Expose()
  role!: string;

  /**
   * Fecha de ingreso al equipo
   */
  @Expose()
  @Type(() => Date)
  joined_at!: Date;

  /**
   * Fecha de salida del equipo
   */
  @Expose()
  @Type(() => Date)
  left_at!: Date | null;
}
