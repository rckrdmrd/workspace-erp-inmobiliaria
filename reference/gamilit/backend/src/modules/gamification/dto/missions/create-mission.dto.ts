import { IsEnum, IsString, IsOptional, IsObject, IsUUID, IsDate, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MissionTypeEnum } from '../../entities/mission.entity';

/**
 * Mission Objective DTO
 */
export class MissionObjectiveDto {
  @ApiProperty({
    description: 'Tipo de objetivo',
    example: 'complete_exercises',
  })
  @IsString()
  type!: string;

  @ApiProperty({
    description: 'Valor objetivo a alcanzar',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  target!: number;

  @ApiProperty({
    description: 'Progreso actual',
    example: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  current!: number;

  @ApiPropertyOptional({
    description: 'Descripción del objetivo',
    example: 'Completa 10 ejercicios de comprensión literal',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * Mission Rewards DTO
 */
export class MissionRewardsDto {
  @ApiPropertyOptional({
    description: 'ML Coins otorgados',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ml_coins?: number;

  @ApiPropertyOptional({
    description: 'Puntos de experiencia otorgados',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  xp?: number;

  @ApiPropertyOptional({
    description: 'Items adicionales',
    example: [{ type: 'pistas', quantity: 2 }],
  })
  @IsOptional()
  @IsObject()
  items?: Array<{
    type: string;
    quantity: number;
  }>;
}

/**
 * Create Mission DTO
 *
 * @description DTO para crear una nueva misión
 * @usage Usado por servicios internos o admins para generar misiones
 *
 * Validaciones críticas:
 * - end_date debe ser posterior a start_date
 * - required_value (target en objectives) > 0
 * - mission_type debe ser válido
 */
export class CreateMissionDto {
  @ApiProperty({
    description: 'ID del usuario asignado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  user_id!: string;

  @ApiProperty({
    description: 'ID de la plantilla de misión',
    example: 'daily_exercise_streak_3',
  })
  @IsString()
  template_id!: string;

  @ApiProperty({
    description: 'Título de la misión',
    example: 'Racha de ejercicios',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Descripción de la misión',
    example: 'Completa ejercicios 3 días seguidos',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tipo de misión',
    enum: MissionTypeEnum,
    example: MissionTypeEnum.DAILY,
  })
  @IsEnum(MissionTypeEnum)
  mission_type!: MissionTypeEnum;

  @ApiProperty({
    description: 'Objetivos de la misión',
    type: [MissionObjectiveDto],
    example: [
      {
        type: 'complete_exercises',
        target: 3,
        current: 0,
        description: 'Completa 3 ejercicios',
      },
    ],
  })
  @IsObject()
  objectives!: MissionObjectiveDto[];

  @ApiProperty({
    description: 'Recompensas de la misión',
    type: MissionRewardsDto,
    example: {
      ml_coins: 100,
      xp: 50,
    },
  })
  @IsObject()
  rewards!: MissionRewardsDto;

  @ApiPropertyOptional({
    description: 'Progreso inicial (0-100)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Fecha de inicio',
    example: '2025-11-02T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @ApiProperty({
    description: 'Fecha de expiración',
    example: '2025-11-03T23:59:59Z',
  })
  @IsDate()
  @Type(() => Date)
  end_date!: Date;
}
