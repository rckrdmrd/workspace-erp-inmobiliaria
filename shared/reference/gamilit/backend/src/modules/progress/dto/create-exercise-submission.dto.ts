import {
  IsUUID,
  IsInt,
  IsBoolean,
  IsOptional,
  IsString,
  IsObject,
  IsArray,
  IsDateString,
  IsIn,
  Min,
  Max,
} from 'class-validator';

/**
 * CreateExerciseSubmissionDto - DTO para crear envío de ejercicio
 *
 * @description DTO usado para crear el registro final de envío de ejercicio.
 * Representa la completación del ejercicio (puede incluir múltiples intentos).
 *
 * @see ExerciseSubmission entity para la estructura completa
 */
export class CreateExerciseSubmissionDto {
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
   * Respuesta del estudiante (JSONB)
   */
  @IsObject()
  answer_data!: Record<string, any>;

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
   * Puntaje máximo
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  max_score?: number;

  /**
   * Retroalimentación
   */
  @IsOptional()
  @IsString()
  feedback?: string;

  /**
   * Indica si usó hint
   */
  @IsOptional()
  @IsBoolean()
  hint_used?: boolean;

  /**
   * Cantidad de hints usados
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  hints_count?: number;

  /**
   * Comodines utilizados
   */
  @IsOptional()
  @IsArray()
  comodines_used?: string[];

  /**
   * ML Coins gastadas
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  ml_coins_spent?: number;

  /**
   * Tiempo invertido en segundos
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  time_spent_seconds?: number;

  /**
   * Número de intento
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  attempt_number?: number;

  /**
   * Estado de la sumisión
   */
  @IsOptional()
  @IsString()
  @IsIn(['draft', 'submitted', 'graded', 'reviewed'])
  status?: string;

  /**
   * Fecha de inicio
   */
  @IsOptional()
  @IsDateString()
  started_at?: string;

  /**
   * Fecha de envío
   */
  @IsOptional()
  @IsDateString()
  submitted_at?: string;

  /**
   * Fecha de calificación
   */
  @IsOptional()
  @IsDateString()
  graded_at?: string;
}
