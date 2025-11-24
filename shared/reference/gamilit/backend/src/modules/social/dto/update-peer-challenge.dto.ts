import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsObject,
  IsDateString,
  IsNumber,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DifficultyLevelEnum } from '@shared/constants';

/**
 * UpdatePeerChallengeDto
 *
 * @description DTO para actualizar un desafío peer-to-peer existente.
 * Solo permite actualizar campos específicos. El creador del desafío
 * puede actualizar solo si el desafío está en estado 'open'.
 *
 * @see PeerChallenge entity
 */
export class UpdatePeerChallengeDto {
  /**
   * Título del desafío
   */
  @ApiPropertyOptional({
    description: 'Título del desafío',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  /**
   * Descripción del desafío
   */
  @ApiPropertyOptional({
    description: 'Descripción detallada del desafío',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Nivel de dificultad
   */
  @ApiPropertyOptional({
    enum: DifficultyLevelEnum,
    description: 'Nivel de dificultad',
  })
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Máximo de participantes
   */
  @ApiPropertyOptional({
    description: 'Máximo de participantes permitidos',
    minimum: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  max_participants?: number;

  /**
   * Fecha y hora de inicio
   */
  @ApiPropertyOptional({
    description: 'Fecha y hora de inicio del desafío',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  start_time?: string;

  /**
   * Fecha y hora de fin
   */
  @ApiPropertyOptional({
    description: 'Fecha y hora de fin del desafío',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  /**
   * Recompensas del desafío
   */
  @ApiPropertyOptional({
    description: 'Recompensas del desafío en formato JSON',
  })
  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  /**
   * Multiplicador de bonus para el ganador
   */
  @ApiPropertyOptional({
    description: 'Multiplicador de bonus para el ganador',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  winner_bonus_multiplier?: number;

  /**
   * Reglas personalizadas
   */
  @ApiPropertyOptional({
    description: 'Reglas personalizadas del desafío',
  })
  @IsOptional()
  @IsObject()
  custom_rules?: Record<string, any>;

  /**
   * Metadatos adicionales
   */
  @ApiPropertyOptional({
    description: 'Metadatos adicionales',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
