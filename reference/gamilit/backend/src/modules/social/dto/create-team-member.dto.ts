import { IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { TeamMemberRoleEnum } from '@shared/constants/enums.constants';

/**
 * CreateTeamMemberDto - DTO para agregar miembro a equipo
 *
 * @description DTO usado para crear una nueva membresía en equipo.
 * Incluye campos requeridos y opcionales para agregar un miembro.
 *
 * @see TeamMember entity para la estructura completa
 */
export class CreateTeamMemberDto {
  /**
   * ID del equipo
   */
  @IsUUID('4')
  team_id!: string;

  /**
   * ID del usuario miembro
   */
  @IsUUID('4')
  user_id!: string;

  /**
   * Rol del miembro en el equipo
   */
  @IsOptional()
  @IsEnum(TeamMemberRoleEnum)
  role?: string;

  /**
   * Fecha de ingreso al equipo
   */
  @IsOptional()
  @IsDateString()
  joined_at?: string;
}
