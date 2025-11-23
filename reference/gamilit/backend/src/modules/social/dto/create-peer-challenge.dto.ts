import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  IsObject,
  IsDateString,
  IsNumber,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DifficultyLevelEnum } from '@shared/constants';

/**
 * Tipos de desafío peer-to-peer
 */
export enum ChallengeType {
  HEAD_TO_HEAD = 'head_to_head',
  MULTIPLAYER = 'multiplayer',
  TOURNAMENT = 'tournament',
  LEADERBOARD = 'leaderboard',
}

/**
 * CreatePeerChallengeDto
 *
 * @description DTO para crear un nuevo desafío peer-to-peer.
 * Valida todos los campos requeridos y opcionales según el tipo de desafío.
 *
 * @see PeerChallenge entity
 */
export class CreatePeerChallengeDto {
  /**
   * Tipo de desafío
   * @example 'head_to_head'
   */
  @ApiProperty({
    enum: ChallengeType,
    description: 'Tipo de desafío',
    example: ChallengeType.HEAD_TO_HEAD,
  })
  @IsEnum(ChallengeType)
  challenge_type!: ChallengeType;

  /**
   * ID del usuario que crea el desafío
   */
  @ApiProperty({
    description: 'ID del usuario creador',
    format: 'uuid',
  })
  @IsUUID('4')
  created_by!: string;

  /**
   * ID del ejercicio asociado (opcional)
   */
  @ApiPropertyOptional({
    description: 'ID del ejercicio asociado',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  exercise_id?: string;

  /**
   * Título del desafío
   * @example 'Desafío de Comprensión Lectora - Nivel Experto'
   */
  @ApiProperty({
    description: 'Título del desafío',
    minLength: 3,
    example: 'Desafío de Comprensión Lectora',
  })
  @IsString()
  @MinLength(3)
  title!: string;

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
    example: DifficultyLevelEnum.INTERMEDIATE,
  })
  @IsOptional()
  @IsEnum(DifficultyLevelEnum)
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Máximo de participantes
   * @default 2
   */
  @ApiPropertyOptional({
    description: 'Máximo de participantes permitidos',
    minimum: 2,
    default: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  max_participants?: number;

  /**
   * Mínimo de participantes para iniciar
   * @default 2
   */
  @ApiPropertyOptional({
    description: 'Mínimo de participantes para iniciar',
    minimum: 2,
    default: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  min_participants?: number;

  /**
   * Fecha y hora de inicio (ISO 8601)
   */
  @ApiPropertyOptional({
    description: 'Fecha y hora de inicio del desafío',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  start_time?: string;

  /**
   * Fecha y hora de fin (ISO 8601)
   */
  @ApiPropertyOptional({
    description: 'Fecha y hora de fin del desafío',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  /**
   * Límite de tiempo en minutos por participante
   */
  @ApiPropertyOptional({
    description: 'Límite de tiempo en minutos por participante',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  time_limit_minutes?: number;

  /**
   * Recompensas del desafío (JSONB)
   * @example { "xp": 100, "ml_coins": 50 }
   */
  @ApiPropertyOptional({
    description: 'Recompensas del desafío en formato JSON',
    example: { xp: 100, ml_coins: 50 },
  })
  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  /**
   * Multiplicador de bonus para el ganador
   * @default 1.5
   */
  @ApiPropertyOptional({
    description: 'Multiplicador de bonus para el ganador',
    minimum: 1,
    maximum: 5,
    default: 1.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  winner_bonus_multiplier?: number;

  /**
   * Permite espectadores
   * @default true
   */
  @ApiPropertyOptional({
    description: 'Permite espectadores',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allow_spectators?: boolean;

  /**
   * Visible en lista pública
   * @default true
   */
  @ApiPropertyOptional({
    description: 'Visible en lista pública de desafíos',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  /**
   * Requiere aprobación para unirse
   * @default false
   */
  @ApiPropertyOptional({
    description: 'Requiere aprobación del creador para unirse',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requires_approval?: boolean;

  /**
   * Reglas personalizadas (JSONB)
   */
  @ApiPropertyOptional({
    description: 'Reglas personalizadas del desafío en formato JSON',
  })
  @IsOptional()
  @IsObject()
  custom_rules?: Record<string, any>;

  /**
   * Metadatos adicionales (JSONB)
   */
  @ApiPropertyOptional({
    description: 'Metadatos adicionales en formato JSON',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
