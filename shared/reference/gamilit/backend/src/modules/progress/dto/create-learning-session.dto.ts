import {
  IsUUID,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsObject,
  IsIn,
  Min,
} from 'class-validator';

/**
 * CreateLearningSessionDto - DTO para crear sesión de aprendizaje
 *
 * @description DTO usado para iniciar una nueva sesión de aprendizaje.
 * Captura información de contexto, dispositivo y configuración inicial.
 *
 * @see LearningSession entity para la estructura completa
 */
export class CreateLearningSessionDto {
  /**
   * ID del usuario
   */
  @IsUUID('4')
  user_id!: string;

  /**
   * ID del tenant (opcional)
   */
  @IsOptional()
  @IsUUID('4')
  tenant_id?: string;

  /**
   * Token único de sesión
   */
  @IsOptional()
  @IsString()
  session_token?: string;

  /**
   * Tipo de sesión
   */
  @IsOptional()
  @IsString()
  @IsIn(['learning', 'practice', 'assessment', 'review'])
  session_type?: string;

  /**
   * ID del módulo (opcional)
   */
  @IsOptional()
  @IsUUID('4')
  module_id?: string;

  /**
   * ID del ejercicio (opcional)
   */
  @IsOptional()
  @IsUUID('4')
  exercise_id?: string;

  /**
   * ID del aula (opcional)
   */
  @IsOptional()
  @IsUUID('4')
  classroom_id?: string;

  /**
   * Fecha y hora de inicio
   */
  @IsOptional()
  @IsDateString()
  started_at?: string;

  /**
   * Información del dispositivo
   */
  @IsOptional()
  @IsObject()
  device_info?: Record<string, any>;

  /**
   * Información del navegador
   */
  @IsOptional()
  @IsObject()
  browser_info?: Record<string, any>;

  /**
   * Calidad de conexión
   */
  @IsOptional()
  @IsString()
  @IsIn(['excellent', 'good', 'fair', 'poor'])
  connection_quality?: string;

  /**
   * Metadatos adicionales
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
