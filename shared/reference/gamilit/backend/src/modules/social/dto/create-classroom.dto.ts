import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsObject,
  IsDateString,
  Min,
} from 'class-validator';

/**
 * CreateClassroomDto - DTO para crear aula virtual
 *
 * @description DTO usado para crear una nueva aula.
 * Incluye campos requeridos y opcionales para configurar el aula.
 *
 * @see Classroom entity para la estructura completa
 */
export class CreateClassroomDto {
  /**
   * ID de la escuela (opcional)
   */
  @IsOptional()
  @IsUUID('4')
  school_id?: string;

  /**
   * ID del tenant propietario
   */
  @IsUUID('4')
  tenant_id!: string;

  /**
   * Nombre del aula
   */
  @IsString()
  name!: string;

  /**
   * Código único de acceso
   */
  @IsOptional()
  @IsString()
  code?: string;

  /**
   * Descripción del aula
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Nivel de grado
   */
  @IsOptional()
  @IsString()
  grade_level?: string;

  /**
   * Sección
   */
  @IsOptional()
  @IsString()
  section?: string;

  /**
   * Materia o asignatura
   */
  @IsOptional()
  @IsString()
  subject?: string;

  /**
   * Año académico
   */
  @IsOptional()
  @IsString()
  academic_year?: string;

  /**
   * Semestre
   */
  @IsOptional()
  @IsString()
  semester?: string;

  /**
   * ID del profesor principal
   */
  @IsUUID('4')
  teacher_id!: string;

  /**
   * IDs de co-profesores
   */
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  co_teachers?: string[];

  /**
   * Capacidad máxima de estudiantes
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  /**
   * Configuraciones del aula
   */
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  /**
   * Horario de clases
   */
  @IsOptional()
  @IsArray()
  schedule?: any[];

  /**
   * URL de reunión virtual
   */
  @IsOptional()
  @IsString()
  meeting_url?: string;

  /**
   * Aula activa
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Aula archivada
   */
  @IsOptional()
  @IsBoolean()
  is_archived?: boolean;

  /**
   * Fecha de inicio del curso
   */
  @IsOptional()
  @IsDateString()
  start_date?: string;

  /**
   * Fecha de fin del curso
   */
  @IsOptional()
  @IsDateString()
  end_date?: string;

  /**
   * Metadatos adicionales
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
