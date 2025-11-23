import { Expose, Type } from 'class-transformer';

/**
 * ClassroomMemberResponseDto - DTO para respuestas de membresía en aulas
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad con sus valores actuales.
 *
 * @see ClassroomMember entity para la estructura de base de datos
 */
export class ClassroomMemberResponseDto {
  /**
   * ID único del registro
   */
  @Expose()
  id!: string;

  /**
   * ID del aula
   */
  @Expose()
  classroom_id!: string;

  /**
   * ID del estudiante
   */
  @Expose()
  student_id!: string;

  /**
   * Fecha de inscripción
   */
  @Expose()
  @Type(() => Date)
  enrollment_date!: Date;

  /**
   * Método de inscripción
   */
  @Expose()
  enrollment_method!: string;

  /**
   * ID del usuario que inscribió
   */
  @Expose()
  enrolled_by!: string | null;

  /**
   * Estado de la membresía
   */
  @Expose()
  status!: string;

  /**
   * Fecha de retiro del aula
   */
  @Expose()
  @Type(() => Date)
  withdrawal_date!: Date | null;

  /**
   * Razón del retiro
   */
  @Expose()
  withdrawal_reason!: string | null;

  /**
   * Número de matrícula del estudiante
   */
  @Expose()
  student_number!: string | null;

  /**
   * Calificación final
   */
  @Expose()
  final_grade!: number | null;

  /**
   * Porcentaje de asistencia
   */
  @Expose()
  attendance_percentage!: number | null;

  /**
   * Permisos especiales del estudiante
   */
  @Expose()
  permissions!: Record<string, any>;

  /**
   * Notas del profesor
   */
  @Expose()
  teacher_notes!: string | null;

  /**
   * Información de contacto de padres
   */
  @Expose()
  parent_contact_info!: Record<string, any>;

  /**
   * Metadatos adicionales
   */
  @Expose()
  metadata!: Record<string, any>;

  /**
   * Membresía activa
   */
  @Expose()
  is_active!: boolean;

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
