import { Expose, Type } from 'class-transformer';

/**
 * LearningSessionResponseDto - DTO para respuestas de sesión de aprendizaje
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la sesión con métricas de actividad.
 *
 * @see LearningSession entity para la estructura de base de datos
 */
export class LearningSessionResponseDto {
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
   * ID del tenant
   */
  @Expose()
  tenant_id!: string | null;

  /**
   * Token de sesión
   */
  @Expose()
  session_token!: string | null;

  /**
   * Tipo de sesión
   */
  @Expose()
  session_type!: string;

  /**
   * ID del módulo
   */
  @Expose()
  module_id!: string | null;

  /**
   * ID del ejercicio
   */
  @Expose()
  exercise_id!: string | null;

  /**
   * ID del aula
   */
  @Expose()
  classroom_id!: string | null;

  /**
   * Fecha de inicio
   */
  @Expose()
  @Type(() => Date)
  started_at!: Date;

  /**
   * Fecha de fin
   */
  @Expose()
  @Type(() => Date)
  ended_at!: Date | null;

  /**
   * Duración total
   */
  @Expose()
  duration!: string | null;

  /**
   * Tiempo activo
   */
  @Expose()
  active_time!: string | null;

  /**
   * Tiempo inactivo
   */
  @Expose()
  idle_time!: string | null;

  /**
   * Ejercicios intentados
   */
  @Expose()
  exercises_attempted!: number;

  /**
   * Ejercicios completados
   */
  @Expose()
  exercises_completed!: number;

  /**
   * Contenido visualizado
   */
  @Expose()
  content_viewed!: number;

  /**
   * Score total
   */
  @Expose()
  total_score!: number;

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
   * Cantidad de clicks
   */
  @Expose()
  clicks_count!: number;

  /**
   * Vistas de página
   */
  @Expose()
  page_views!: number;

  /**
   * Descargas de recursos
   */
  @Expose()
  resource_downloads!: number;

  /**
   * Información del dispositivo
   */
  @Expose()
  device_info!: Record<string, any>;

  /**
   * Información del navegador
   */
  @Expose()
  browser_info!: Record<string, any>;

  /**
   * Calidad de conexión
   */
  @Expose()
  connection_quality!: string | null;

  /**
   * Errores encontrados
   */
  @Expose()
  errors_encountered!: number;

  /**
   * Sesión activa
   */
  @Expose()
  is_active!: boolean;

  /**
   * Estado de completitud
   */
  @Expose()
  completion_status!: string;

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
}
