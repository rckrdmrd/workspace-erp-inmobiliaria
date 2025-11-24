import { Expose, Type } from 'class-transformer';

/**
 * ClassroomResponseDto - DTO para respuestas de aulas
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see Classroom entity para la estructura de base de datos
 */
export class ClassroomResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID de la escuela
   */
  @Expose()
  school_id!: string | null;

  /**
   * ID del tenant propietario
   */
  @Expose()
  tenant_id!: string;

  /**
   * Nombre del aula
   */
  @Expose()
  name!: string;

  /**
   * Código único de acceso
   */
  @Expose()
  code!: string | null;

  /**
   * Descripción del aula
   */
  @Expose()
  description!: string | null;

  /**
   * Nivel de grado
   */
  @Expose()
  grade_level!: string | null;

  /**
   * Sección
   */
  @Expose()
  section!: string | null;

  /**
   * Materia o asignatura
   */
  @Expose()
  subject!: string | null;

  /**
   * Año académico
   */
  @Expose()
  academic_year!: string | null;

  /**
   * Semestre
   */
  @Expose()
  semester!: string | null;

  /**
   * ID del profesor principal
   */
  @Expose()
  teacher_id!: string;

  /**
   * IDs de co-profesores
   */
  @Expose()
  co_teachers!: string[] | null;

  /**
   * Capacidad máxima de estudiantes
   */
  @Expose()
  capacity!: number;

  /**
   * Contador actual de estudiantes
   */
  @Expose()
  current_students_count!: number;

  /**
   * Configuraciones del aula
   */
  @Expose()
  settings!: Record<string, any>;

  /**
   * Horario de clases
   */
  @Expose()
  schedule!: any[];

  /**
   * URL de reunión virtual
   */
  @Expose()
  meeting_url!: string | null;

  /**
   * Aula activa
   */
  @Expose()
  is_active!: boolean;

  /**
   * Aula archivada
   */
  @Expose()
  is_archived!: boolean;

  /**
   * Fecha de inicio del curso
   */
  @Expose()
  @Type(() => Date)
  start_date!: Date | null;

  /**
   * Fecha de fin del curso
   */
  @Expose()
  @Type(() => Date)
  end_date!: Date | null;

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
