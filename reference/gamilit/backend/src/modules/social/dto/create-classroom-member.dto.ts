import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsObject,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import {
  ClassroomMemberStatusEnum,
  EnrollmentMethodEnum,
} from '@shared/constants/enums.constants';

/**
 * CreateClassroomMemberDto - DTO para inscribir estudiante en aula
 *
 * @description DTO usado para crear una nueva membresía de estudiante en aula.
 * Incluye campos requeridos y opcionales para el proceso de inscripción.
 *
 * @see ClassroomMember entity para la estructura completa
 */
export class CreateClassroomMemberDto {
  /**
   * ID del aula
   */
  @IsUUID('4')
  classroom_id!: string;

  /**
   * ID del estudiante
   */
  @IsUUID('4')
  student_id!: string;

  /**
   * Fecha de inscripción
   */
  @IsOptional()
  @IsDateString()
  enrollment_date?: string;

  /**
   * Método de inscripción
   */
  @IsOptional()
  @IsEnum(EnrollmentMethodEnum)
  enrollment_method?: string;

  /**
   * ID del usuario que inscribió
   */
  @IsOptional()
  @IsUUID('4')
  enrolled_by?: string;

  /**
   * Estado de la membresía
   */
  @IsOptional()
  @IsEnum(ClassroomMemberStatusEnum)
  status?: string;

  /**
   * Número de matrícula del estudiante
   */
  @IsOptional()
  @IsString()
  student_number?: string;

  /**
   * Calificación final
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  final_grade?: number;

  /**
   * Porcentaje de asistencia
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  attendance_percentage?: number;

  /**
   * Permisos especiales del estudiante
   */
  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;

  /**
   * Notas del profesor
   */
  @IsOptional()
  @IsString()
  teacher_notes?: string;

  /**
   * Información de contacto de padres
   */
  @IsOptional()
  @IsObject()
  parent_contact_info?: Record<string, any>;

  /**
   * Metadatos adicionales
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  /**
   * Membresía activa
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
