import { IsUUID, IsEnum, IsOptional, IsInt, IsDateString, Min } from 'class-validator';
import { TeamChallengeStatusEnum } from '@shared/constants/enums.constants';

/**
 * CreateTeamChallengeDto - DTO para asignar desafío a equipo
 *
 * @description DTO usado para crear un nuevo desafío de equipo.
 * Incluye campos requeridos y opcionales para asignar el desafío.
 *
 * @see TeamChallenge entity para la estructura completa
 */
export class CreateTeamChallengeDto {
  /**
   * ID del equipo
   */
  @IsUUID('4')
  team_id!: string;

  /**
   * ID del desafío/challenge
   */
  @IsUUID('4')
  challenge_id!: string;

  /**
   * Estado del desafío
   */
  @IsOptional()
  @IsEnum(TeamChallengeStatusEnum)
  status?: string;

  /**
   * Fecha de inicio del desafío
   */
  @IsOptional()
  @IsDateString()
  started_at?: string;

  /**
   * Fecha de completación del desafío
   */
  @IsOptional()
  @IsDateString()
  completed_at?: string;

  /**
   * Puntuación obtenida
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;
}
