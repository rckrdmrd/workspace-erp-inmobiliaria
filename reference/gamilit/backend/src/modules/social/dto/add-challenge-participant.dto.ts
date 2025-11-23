import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * AddChallengeParticipantDto
 *
 * @description DTO para agregar un participante a un desafío.
 * Puede ser una invitación o una auto-inscripción.
 *
 * @see ChallengeParticipant entity
 */
export class AddChallengeParticipantDto {
  /**
   * ID del desafío
   */
  @ApiProperty({
    description: 'ID del desafío',
    format: 'uuid',
  })
  @IsUUID('4')
  challenge_id!: string;

  /**
   * ID del usuario participante
   */
  @ApiProperty({
    description: 'ID del usuario que participará',
    format: 'uuid',
  })
  @IsUUID('4')
  user_id!: string;

  /**
   * ID del usuario que invita (opcional)
   * Si se proporciona, el participante estará en estado 'invited'
   */
  @ApiPropertyOptional({
    description: 'ID del usuario que invita (opcional)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  invited_by?: string;
}
