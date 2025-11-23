import { Expose, Type } from 'class-transformer';

/**
 * ExerciseSubmissionResponseDto - DTO para respuestas de envío de ejercicio
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos del envío final del ejercicio.
 *
 * @see ExerciseSubmission entity para la estructura de base de datos
 */
export class ExerciseSubmissionResponseDto {
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
   * Respuesta del estudiante
   */
  @Expose()
  answer_data!: Record<string, any>;

  /**
   * Indica si fue correcta
   */
  @Expose()
  is_correct!: boolean | null;

  /**
   * Puntaje obtenido
   */
  @Expose()
  score!: number;

  /**
   * Puntaje máximo
   */
  @Expose()
  max_score!: number;

  /**
   * Retroalimentación
   */
  @Expose()
  feedback!: string | null;

  /**
   * Hint usado
   */
  @Expose()
  hint_used!: boolean;

  /**
   * Cantidad de hints
   */
  @Expose()
  hints_count!: number;

  /**
   * Comodines usados
   */
  @Expose()
  comodines_used!: string[] | null;

  /**
   * ML Coins gastadas
   */
  @Expose()
  ml_coins_spent!: number;

  /**
   * Tiempo invertido en segundos
   */
  @Expose()
  time_spent_seconds!: number | null;

  /**
   * Número de intento
   */
  @Expose()
  attempt_number!: number;

  /**
   * Estado de la sumisión
   */
  @Expose()
  status!: string;

  /**
   * Fecha de inicio
   */
  @Expose()
  @Type(() => Date)
  started_at!: Date | null;

  /**
   * Fecha de envío
   */
  @Expose()
  @Type(() => Date)
  submitted_at!: Date;

  /**
   * Fecha de calificación
   */
  @Expose()
  @Type(() => Date)
  graded_at!: Date | null;

  /**
   * Fecha de creación
   */
  @Expose()
  @Type(() => Date)
  created_at!: Date;

  /**
   * Fecha de actualización
   */
  @Expose()
  @Type(() => Date)
  updated_at!: Date;
}
