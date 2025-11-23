import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateParticipantScoreDto
 *
 * @description DTO para actualizar el score de un participante.
 *
 * @see ChallengeParticipant entity
 */
export class UpdateParticipantScoreDto {
  /**
   * Puntuación obtenida
   * @minimum 0
   */
  @ApiProperty({
    description: 'Puntuación obtenida en el desafío',
    minimum: 0,
    example: 95.50,
  })
  @IsNumber()
  @Min(0)
  score!: number;
}
