import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsObject,
  Min,
} from 'class-validator';

/**
 * CreateSchoolDto - DTO para crear institución educativa
 *
 * @description DTO usado para crear una nueva escuela.
 * Incluye campos requeridos y opcionales para configurar la institución.
 *
 * @see School entity para la estructura completa
 */
export class CreateSchoolDto {
  /**
   * ID del tenant propietario
   */
  @IsUUID('4')
  tenant_id!: string;

  /**
   * Nombre completo de la institución
   */
  @IsString()
  name!: string;

  /**
   * Código único de identificación
   */
  @IsOptional()
  @IsString()
  code?: string;

  /**
   * Nombre corto o abreviatura
   */
  @IsOptional()
  @IsString()
  short_name?: string;

  /**
   * Descripción de la institución
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Dirección física
   */
  @IsOptional()
  @IsString()
  address?: string;

  /**
   * Ciudad
   */
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * Región o estado
   */
  @IsOptional()
  @IsString()
  region?: string;

  /**
   * País
   */
  @IsOptional()
  @IsString()
  country?: string;

  /**
   * Código postal
   */
  @IsOptional()
  @IsString()
  postal_code?: string;

  /**
   * Teléfono de contacto
   */
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * Email de contacto
   */
  @IsOptional()
  @IsString()
  email?: string;

  /**
   * Sitio web
   */
  @IsOptional()
  @IsString()
  website?: string;

  /**
   * ID del director/a
   */
  @IsOptional()
  @IsUUID('4')
  principal_id?: string;

  /**
   * ID del contacto administrativo
   */
  @IsOptional()
  @IsUUID('4')
  administrative_contact_id?: string;

  /**
   * Año académico actual
   */
  @IsOptional()
  @IsString()
  academic_year?: string;

  /**
   * Sistema semestral
   */
  @IsOptional()
  @IsBoolean()
  semester_system?: boolean;

  /**
   * Niveles de grado que ofrece
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grade_levels?: string[];

  /**
   * Configuraciones adicionales
   */
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  /**
   * Capacidad máxima de estudiantes
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  max_students?: number;

  /**
   * Capacidad máxima de profesores
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  max_teachers?: number;

  /**
   * Escuela activa
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Escuela verificada
   */
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  /**
   * Metadatos adicionales
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
