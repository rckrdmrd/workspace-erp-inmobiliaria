import {
  IsUUID,
  IsInt,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';

/**
 * CreateExerciseAttemptDto - DTO para crear intento de ejercicio
 *
 * @description DTO usado para registrar un intento individual de ejercicio.
 * Captura respuestas, resultado, tiempo y uso de ayudas.
 *
 * @see ExerciseAttempt entity para la estructura completa
 */
export class CreateExerciseAttemptDto {
  /**
   * ID del usuario
   */
  @IsUUID('4')
  user_id!: string;

  /**
   * ID del ejercicio
   */
  @IsUUID('4')
  exercise_id!: string;

  /**
   * Número de intento
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  attempt_number?: number;

  /**
   * Respuestas enviadas (estructura JSONB)
   */
  @IsObject()
  submitted_answers!: Record<string, any>;

  /**
   * Indica si la respuesta fue correcta
   */
  @IsOptional()
  @IsBoolean()
  is_correct?: boolean;

  /**
   * Puntaje obtenido
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  /**
   * Tiempo invertido en segundos
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  time_spent_seconds?: number;

  /**
   * Cantidad de hints utilizados
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  hints_used?: number;

  /**
   * Comodines utilizados
   */
  @IsOptional()
  @IsArray()
  comodines_used?: string[];

  /**
   * XP ganada
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  xp_earned?: number;

  /**
   * ML Coins ganadas
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_earned?: number;

  /**
   * Fecha de envío
   */
  @IsOptional()
  @IsDateString()
  submitted_at?: string;

  /**
   * Metadatos adicionales (browser, device, response_pattern)
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
