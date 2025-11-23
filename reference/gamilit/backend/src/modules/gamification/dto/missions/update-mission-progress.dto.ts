import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

/**
 * Update Mission Progress DTO
 *
 * @description DTO para actualizar el progreso de un objetivo de misión
 * @usage Usado en PATCH /gamification/missions/:id/progress
 *
 * Permite actualizar el progreso de objetivos específicos:
 * - complete_exercises: Ejercicios completados
 * - correct_streak: Racha de aciertos
 * - study_time: Tiempo de estudio (minutos)
 * - consecutive_days: Días consecutivos
 */
export class UpdateMissionProgressDto {
  @ApiProperty({
    description: 'Tipo de objetivo a actualizar',
    example: 'complete_exercises',
    enum: ['complete_exercises', 'correct_streak', 'study_time', 'consecutive_days'],
  })
  @IsString()
  objective_type!: string;

  @ApiProperty({
    description: 'Cantidad a incrementar en el objetivo',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  increment!: number;
}
