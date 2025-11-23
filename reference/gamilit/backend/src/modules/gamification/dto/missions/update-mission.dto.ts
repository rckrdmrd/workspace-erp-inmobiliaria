import { IsEnum, IsOptional, IsObject, IsNumber, IsDate, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MissionStatusEnum } from '../../entities/mission.entity';
import { MissionObjectiveDto, MissionRewardsDto } from './create-mission.dto';

/**
 * Update Mission DTO
 *
 * @description DTO para actualizar una misión existente
 * @usage Usado para actualizar progreso, estado o datos de la misión
 *
 * Validaciones:
 * - progress entre 0 y 100
 * - status debe ser válido según enum
 */
export class UpdateMissionDto {
  @ApiPropertyOptional({
    description: 'Objetivos actualizados',
    type: [MissionObjectiveDto],
  })
  @IsOptional()
  @IsObject()
  objectives?: MissionObjectiveDto[];

  @ApiPropertyOptional({
    description: 'Recompensas actualizadas',
    type: MissionRewardsDto,
  })
  @IsOptional()
  @IsObject()
  rewards?: MissionRewardsDto;

  @ApiPropertyOptional({
    description: 'Estado de la misión',
    enum: MissionStatusEnum,
    example: MissionStatusEnum.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(MissionStatusEnum)
  status?: MissionStatusEnum;

  @ApiPropertyOptional({
    description: 'Progreso (0-100)',
    example: 33.33,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Fecha de finalización',
    example: '2025-11-02T15:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de completado',
    example: '2025-11-02T14:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completed_at?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de reclamado de recompensas',
    example: '2025-11-02T14:35:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  claimed_at?: Date;
}
