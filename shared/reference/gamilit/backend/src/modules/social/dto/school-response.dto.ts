import { Expose, Type } from 'class-transformer';

/**
 * SchoolResponseDto - DTO para respuestas de escuelas
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see School entity para la estructura de base de datos
 */
export class SchoolResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del tenant propietario
   */
  @Expose()
  tenant_id!: string;

  /**
   * Nombre completo de la institución
   */
  @Expose()
  name!: string;

  /**
   * Código único de identificación
   */
  @Expose()
  code!: string | null;

  /**
   * Nombre corto o abreviatura
   */
  @Expose()
  short_name!: string | null;

  /**
   * Descripción de la institución
   */
  @Expose()
  description!: string | null;

  /**
   * Dirección física
   */
  @Expose()
  address!: string | null;

  /**
   * Ciudad
   */
  @Expose()
  city!: string | null;

  /**
   * Región o estado
   */
  @Expose()
  region!: string | null;

  /**
   * País
   */
  @Expose()
  country!: string;

  /**
   * Código postal
   */
  @Expose()
  postal_code!: string | null;

  /**
   * Teléfono de contacto
   */
  @Expose()
  phone!: string | null;

  /**
   * Email de contacto
   */
  @Expose()
  email!: string | null;

  /**
   * Sitio web
   */
  @Expose()
  website!: string | null;

  /**
   * ID del director/a
   */
  @Expose()
  principal_id!: string | null;

  /**
   * ID del contacto administrativo
   */
  @Expose()
  administrative_contact_id!: string | null;

  /**
   * Año académico actual
   */
  @Expose()
  academic_year!: string | null;

  /**
   * Sistema semestral
   */
  @Expose()
  semester_system!: boolean;

  /**
   * Niveles de grado que ofrece
   */
  @Expose()
  grade_levels!: string[];

  /**
   * Configuraciones adicionales
   */
  @Expose()
  settings!: Record<string, any>;

  /**
   * Capacidad máxima de estudiantes
   */
  @Expose()
  max_students!: number;

  /**
   * Capacidad máxima de profesores
   */
  @Expose()
  max_teachers!: number;

  /**
   * Contador actual de estudiantes
   */
  @Expose()
  current_students_count!: number;

  /**
   * Contador actual de profesores
   */
  @Expose()
  current_teachers_count!: number;

  /**
   * Escuela activa
   */
  @Expose()
  is_active!: boolean;

  /**
   * Escuela verificada
   */
  @Expose()
  is_verified!: boolean;

  /**
   * Metadatos adicionales
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
