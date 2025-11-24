import {
  IsUUID,
  IsEnum,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsString,
  IsObject,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ProgressStatusEnum } from '@shared/constants/enums.constants';

/**
 * CreateModuleProgressDto - DTO para crear registro de progreso de módulo
 *
 * @description DTO usado para crear un nuevo registro de progreso de módulo.
 * Incluye campos requeridos y opcionales para inicializar el tracking.
 *
 * @see ModuleProgress entity para la estructura completa
 */
export class CreateModuleProgressDto {
  /**
   * ID del usuario
   */
  @IsUUID('4')
  user_id!: string;

  /**
   * ID del módulo educativo
   */
  @IsUUID('4')
  module_id!: string;

  /**
   * Estado inicial del progreso
   */
  @IsOptional()
  @IsEnum(ProgressStatusEnum)
  status?: ProgressStatusEnum;

  /**
   * Porcentaje de progreso inicial (0-100)
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress_percentage?: number;

  /**
   * Ejercicios completados inicial
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  completed_exercises?: number;

  /**
   * Total de ejercicios en el módulo
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  total_exercises?: number;

  /**
   * ID del aula (si aplica)
   */
  @IsOptional()
  @IsUUID('4')
  classroom_id?: string;

  /**
   * ID de la asignación (si aplica)
   */
  @IsOptional()
  @IsUUID('4')
  assignment_id?: string;

  /**
   * Fecha límite de entrega
   */
  @IsOptional()
  @IsDateString()
  deadline?: string;

  /**
   * Permitir reintentos
   */
  @IsOptional()
  @IsBoolean()
  allow_retry?: boolean;

  /**
   * Requiere completar secuencialmente
   */
  @IsOptional()
  @IsBoolean()
  sequential_completion?: boolean;

  /**
   * Dificultad adaptativa habilitada
   */
  @IsOptional()
  @IsBoolean()
  adaptive_difficulty?: boolean;

  /**
   * Ruta de aprendizaje personalizada
   */
  @IsOptional()
  @IsArray()
  learning_path?: any[];

  /**
   * Notas del estudiante
   */
  @IsOptional()
  @IsString()
  student_notes?: string;

  /**
   * Notas del profesor
   */
  @IsOptional()
  @IsString()
  teacher_notes?: string;

  /**
   * Metadatos adicionales
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
