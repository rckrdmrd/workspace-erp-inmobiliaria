import { ApiProperty } from '@nestjs/swagger';

/**
 * Mission Stats DTO
 *
 * @description DTO de respuesta para estadísticas de misiones del usuario
 * @usage Retornado en endpoint GET /gamification/missions/stats/:userId
 *
 * Métricas incluidas:
 * - Misiones del día (completadas / totales)
 * - Misiones de la semana (completadas / totales)
 * - Totales históricos
 * - Rachas actuales y récords
 */
export class MissionStatsDto {
  @ApiProperty({
    description: 'Misiones completadas hoy',
    example: 2,
  })
  todayCompleted!: number;

  @ApiProperty({
    description: 'Total de misiones disponibles hoy',
    example: 3,
  })
  todayTotal!: number;

  @ApiProperty({
    description: 'Misiones completadas esta semana',
    example: 8,
  })
  weekCompleted!: number;

  @ApiProperty({
    description: 'Total de misiones disponibles esta semana',
    example: 10,
  })
  weekTotal!: number;

  @ApiProperty({
    description: 'Total de misiones completadas (histórico)',
    example: 45,
  })
  totalCompleted!: number;

  @ApiProperty({
    description: 'Total de XP ganado por misiones',
    example: 2250,
  })
  totalXPEarned!: number;

  @ApiProperty({
    description: 'Total de ML Coins ganados por misiones',
    example: 1125,
  })
  totalMLCoinsEarned!: number;

  @ApiProperty({
    description: 'Racha actual de días completando misiones',
    example: 5,
  })
  currentStreak!: number;

  @ApiProperty({
    description: 'Racha más larga registrada',
    example: 12,
  })
  longestStreak!: number;
}
