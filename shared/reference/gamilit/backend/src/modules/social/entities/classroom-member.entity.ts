import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import {
  ClassroomMemberStatusEnum,
  EnrollmentMethodEnum,
} from '@shared/constants/enums.constants';

/**
 * ClassroomMember Entity (social_features.classroom_members)
 *
 * @description Membresía de estudiantes en aulas - relación many-to-many
 * @schema social_features
 * @table classroom_members
 *
 * IMPORTANTE:
 * - Relación many-to-many entre classrooms y students (profiles)
 * - UNIQUE constraint: (classroom_id, student_id) - un estudiante por aula
 * - Estados: active, inactive, withdrawn, completed
 * - Métodos de inscripción: teacher_invite, self_enroll, admin_add, bulk_import
 * - Tracking de calificaciones, asistencia, y notas del profesor
 * - Trigger: trg_update_classroom_count (actualiza current_students_count)
 * - RLS (Row Level Security): policies para teacher/student/admin
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/04-classroom_members.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.CLASSROOM_MEMBERS })
@Index('idx_classroom_members_classroom', ['classroom_id'])
@Index('idx_classroom_members_student', ['student_id'])
@Index('idx_classroom_members_classroom_status', ['classroom_id', 'status'], {
  where: "status = 'active'",
})
@Index('idx_classroom_members_active', ['student_id', 'status'], {
  where: "status = 'active'",
})
@Unique('classroom_members_classroom_id_student_id_key', ['classroom_id', 'student_id'])
export class ClassroomMember {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  /**
   * ID del aula (FK → social_features.classrooms)
   * UNIQUE con student_id: Cada estudiante aparece una vez por aula
   */
  @Column({ type: 'uuid' })
  classroom_id!: string;

  /**
   * ID del estudiante (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid' })
  student_id!: string;

  // =====================================================
  // ENROLLMENT TRACKING
  // =====================================================

  /**
   * Fecha y hora de inscripción al aula
   */
  @Column({ type: 'timestamp with time zone' })
  enrollment_date!: Date;

  /**
   * Método de inscripción
   * Valores: teacher_invite, self_enroll, admin_add, bulk_import
   */
  @Column({
    type: 'text',
    default: EnrollmentMethodEnum.TEACHER_INVITE,
  })
  enrollment_method!: string;

  /**
   * ID del usuario que inscribió al estudiante (FK → auth_management.profiles)
   * Puede ser profesor, admin, o el mismo estudiante (self_enroll)
   */
  @Column({ type: 'uuid', nullable: true })
  enrolled_by?: string;

  // =====================================================
  // STATUS & STATE
  // =====================================================

  /**
   * Estado de la membresía
   * Valores: active, inactive, withdrawn, completed
   */
  @Column({
    type: 'text',
    default: ClassroomMemberStatusEnum.ACTIVE,
  })
  status!: string;

  /**
   * Fecha y hora de retiro del aula
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  withdrawal_date?: Date;

  /**
   * Razón del retiro (si aplica)
   */
  @Column({ type: 'text', nullable: true })
  withdrawal_reason?: string;

  // =====================================================
  // STUDENT IDENTIFICATION
  // =====================================================

  /**
   * Número de matrícula del estudiante (identificador institucional)
   */
  @Column({ type: 'text', nullable: true })
  student_number?: string;

  // =====================================================
  // ACADEMIC PERFORMANCE
  // =====================================================

  /**
   * Calificación final (0.0 - 10.0)
   */
  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  final_grade?: number;

  /**
   * Porcentaje de asistencia (0.00 - 100.00)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  attendance_percentage?: number;

  // =====================================================
  // PERMISSIONS & CONFIGURATION
  // =====================================================

  /**
   * Permisos especiales del estudiante en el aula (JSONB)
   * Ejemplo: { can_post: true, can_comment: true, can_view_others: true }
   */
  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, any> = {};

  // =====================================================
  // NOTES & COMMENTS
  // =====================================================

  /**
   * Notas del profesor sobre el estudiante
   */
  @Column({ type: 'text', nullable: true })
  teacher_notes?: string;

  /**
   * Información de contacto de padres/tutores (JSONB)
   * Ejemplo: { parent_name: "...", phone: "...", email: "..." }
   */
  @Column({ type: 'jsonb', default: {} })
  parent_contact_info!: Record<string, any>;

  // =====================================================
  // METADATA & FLAGS
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * Flag de membresía activa
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   * Trigger: trg_classroom_members_updated_at
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
