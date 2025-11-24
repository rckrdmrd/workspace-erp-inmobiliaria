import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MissionTypeEnum, MissionStatusEnum, MissionObjective, MissionRewards } from '../../entities/mission.entity';

/**
 * Mission Response DTO
 *
 * @description DTO de respuesta para misiones
 * @usage Retornado en endpoints de consulta de misiones
 */
export class MissionResponseDto {
  @ApiProperty({
    description: 'ID de la misión',
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  @ApiProperty({
    description: 'ID de la plantilla',
    example: 'daily_exercise_streak_3',
  })
  template_id!: string;

  @ApiProperty({
    description: 'Título de la misión',
    example: 'Racha de ejercicios',
  })
  title!: string;

  @ApiPropertyOptional({
    description: 'Descripción',
    example: 'Completa ejercicios 3 días seguidos',
  })
  description!: string | null;

  @ApiProperty({
    description: 'Tipo de misión',
    enum: MissionTypeEnum,
    example: MissionTypeEnum.DAILY,
  })
  mission_type!: MissionTypeEnum;

  @ApiProperty({
    description: 'Objetivos de la misión',
    example: [
      {
        type: 'complete_exercises',
        target: 3,
        current: 1,
        description: 'Completa 3 ejercicios',
      },
    ],
  })
  objectives!: MissionObjective[];

  @ApiProperty({
    description: 'Recompensas',
    example: {
      ml_coins: 100,
      xp: 50,
    },
  })
  rewards!: MissionRewards;

  @ApiProperty({
    description: 'Estado de la misión',
    enum: MissionStatusEnum,
    example: MissionStatusEnum.IN_PROGRESS,
  })
  status!: MissionStatusEnum;

  @ApiProperty({
    description: 'Progreso (0-100)',
    example: 33.33,
  })
  progress!: number;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2025-11-02T00:00:00Z',
  })
  start_date!: Date;

  @ApiProperty({
    description: 'Fecha de expiración',
    example: '2025-11-03T23:59:59Z',
  })
  end_date!: Date;

  @ApiPropertyOptional({
    description: 'Fecha de completado',
    example: '2025-11-02T14:30:00Z',
  })
  completed_at!: Date | null;

  @ApiPropertyOptional({
    description: 'Fecha de reclamado',
    example: '2025-11-02T14:35:00Z',
  })
  claimed_at!: Date | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-02T00:00:00Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-11-02T14:30:00Z',
  })
  updated_at!: Date;
}
