import { Expose, Type } from 'class-transformer';

/**
 * ExerciseAttemptResponseDto - DTO para respuestas de intento de ejercicio
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos del intento con respuestas y resultados.
 *
 * @see ExerciseAttempt entity para la estructura de base de datos
 */
export class ExerciseAttemptResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del usuario
   */
  @Expose()
  user_id!: string;

  /**
   * ID del ejercicio
   */
  @Expose()
  exercise_id!: string;

  /**
   * Número de intento
   */
  @Expose()
  attempt_number!: number;

  /**
   * Respuestas enviadas
   */
  @Expose()
  submitted_answers!: Record<string, any>;

  /**
   * Indica si fue correcta
   */
  @Expose()
  is_correct!: boolean | null;

  /**
   * Puntaje obtenido
   */
  @Expose()
  score!: number | null;

  /**
   * Tiempo invertido en segundos
   */
  @Expose()
  time_spent_seconds!: number | null;

  /**
   * Hints utilizados
   */
  @Expose()
  hints_used!: number;

  /**
   * Comodines utilizados
   */
  @Expose()
  comodines_used!: string[];

  /**
   * XP ganada
   */
  @Expose()
  xp_earned!: number;

  /**
   * ML Coins ganadas
   */
  @Expose()
  ml_coins_earned!: number;

  /**
   * Fecha de envío
   */
  @Expose()
  @Type(() => Date)
  submitted_at!: Date;

  /**
   * Metadatos
   */
  @Expose()
  metadata!: Record<string, any>;
}
