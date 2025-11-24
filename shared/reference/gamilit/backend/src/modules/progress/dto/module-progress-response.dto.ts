import { Expose, Type } from 'class-transformer';
import { ProgressStatusEnum } from '@shared/constants/enums.constants';

/**
 * ModuleProgressResponseDto - DTO para respuestas de progreso de módulo
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see ModuleProgress entity para la estructura de base de datos
 */
export class ModuleProgressResponseDto {
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
   * ID del módulo educativo
   */
  @Expose()
  module_id!: string;

  /**
   * Estado actual del progreso
   */
  @Expose()
  status!: ProgressStatusEnum;

  /**
   * Porcentaje de progreso (0-100)
   */
  @Expose()
  progress_percentage!: number;

  /**
   * Ejercicios completados
   */
  @Expose()
  completed_exercises!: number;

  /**
   * Total de ejercicios
   */
  @Expose()
  total_exercises!: number;

  /**
   * Ejercicios omitidos
   */
  @Expose()
  skipped_exercises!: number;

  /**
   * Score total acumulado
   */
  @Expose()
  total_score!: number;

  /**
   * Score máximo posible
   */
  @Expose()
  max_possible_score!: number | null;

  /**
   * Score promedio
   */
  @Expose()
  average_score!: number | null;

  /**
   * Mejor score obtenido
   */
  @Expose()
  best_score!: number | null;

  /**
   * XP total ganada
   */
  @Expose()
  total_xp_earned!: number;

  /**
   * ML Coins totales ganadas
   */
  @Expose()
  total_ml_coins_earned!: number;

  /**
   * Tiempo total invertido
   */
  @Expose()
  time_spent!: string;

  /**
   * Cantidad de sesiones
   */
  @Expose()
  sessions_count!: number;

  /**
   * Cantidad de intentos
   */
  @Expose()
  attempts_count!: number;

  /**
   * Hints usados total
   */
  @Expose()
  hints_used_total!: number;

  /**
   * Comodines usados total
   */
  @Expose()
  comodines_used_total!: number;

  /**
   * Costo total de comodines
   */
  @Expose()
  comodines_cost_total!: number;

  /**
   * Fecha de inicio
   */
  @Expose()
  @Type(() => Date)
  started_at!: Date | null;

  /**
   * Fecha de completación
   */
  @Expose()
  @Type(() => Date)
  completed_at!: Date | null;

  /**
   * Último acceso
   */
  @Expose()
  @Type(() => Date)
  last_accessed_at!: Date | null;

  /**
   * Fecha límite
   */
  @Expose()
  @Type(() => Date)
  deadline!: Date | null;

  /**
   * ID del aula
   */
  @Expose()
  classroom_id!: string | null;

  /**
   * ID de la asignación
   */
  @Expose()
  assignment_id!: string | null;

  /**
   * Permitir reintentos
   */
  @Expose()
  allow_retry!: boolean;

  /**
   * Completar secuencialmente
   */
  @Expose()
  sequential_completion!: boolean;

  /**
   * Dificultad adaptativa
   */
  @Expose()
  adaptive_difficulty!: boolean;

  /**
   * Ruta de aprendizaje
   */
  @Expose()
  learning_path!: any[];

  /**
   * Analíticas de rendimiento
   */
  @Expose()
  performance_analytics!: Record<string, any>;

  /**
   * Observaciones del sistema
   */
  @Expose()
  system_observations!: Record<string, any>;

  /**
   * Notas del estudiante
   */
  @Expose()
  student_notes!: string | null;

  /**
   * Notas del profesor
   */
  @Expose()
  teacher_notes!: string | null;

  /**
   * Metadatos
   */
  @Expose()
  metadata!: Record<string, any>;

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
