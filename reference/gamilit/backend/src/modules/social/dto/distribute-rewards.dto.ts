import { IsInt, Min, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DistributeRewardsDto
 *
 * @description DTO para distribuir recompensas a todos los participantes.
 *
 * @see ChallengeParticipantsService.distributeRewardsToAll()
 */
export class DistributeRewardsDto {
  /**
   * XP base para todos los participantes
   */
  @ApiProperty({
    description: 'XP base para todos los participantes',
    minimum: 0,
    example: 100,
  })
  @IsInt()
  @Min(0)
  base_xp!: number;

  /**
   * ML Coins base para todos los participantes
   */
  @ApiProperty({
    description: 'ML Coins base para todos los participantes',
    minimum: 0,
    example: 50,
  })
  @IsInt()
  @Min(0)
  base_coins!: number;

  /**
   * Multiplicador de bonus para el ganador
   * @default 1.5
   */
  @ApiPropertyOptional({
    description: 'Multiplicador de bonus para el ganador',
    minimum: 1,
    default: 1.5,
    example: 1.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  winner_multiplier?: number;
}
