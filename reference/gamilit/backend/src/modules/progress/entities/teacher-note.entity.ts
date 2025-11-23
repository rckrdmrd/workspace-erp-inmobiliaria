import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';

/**
 * TeacherNote Entity (progress_tracking.teacher_notes)
 *
 * @description Notas de profesores sobre estudiantes para seguimiento de progreso.
 * @schema progress_tracking
 * @table teacher_notes
 *
 * IMPORTANTE:
 * - Permite a los profesores registrar observaciones sobre estudiantes
 * - Las notas pueden ser privadas (solo visible para el profesor) o compartidas
 * - Movido desde public.teacher_notes el 2025-11-08
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/teacher_notes.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.TEACHER_NOTES })
@Index('idx_teacher_notes_teacher_id', ['teacher_id'])
@Index('idx_teacher_notes_student_id', ['student_id'])
@Index('idx_teacher_notes_created_at', ['created_at'])
@Index('idx_teacher_notes_teacher_student', ['teacher_id', 'student_id'])
export class TeacherNote {
  /**
   * Identificador único de la nota (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del profesor que creó la nota
   */
  @Column({ type: 'uuid' })
  teacher_id!: string;

  /**
   * ID del estudiante sobre el que se hace la nota
   */
  @Column({ type: 'uuid' })
  student_id!: string;

  /**
   * Contenido de la nota
   */
  @Column({ type: 'text' })
  note!: string;

  /**
   * Indica si la nota es privada (solo visible para el profesor)
   * Si es true: Solo el profesor puede ver la nota
   * Si es false: La nota puede ser compartida con el estudiante o padres
   */
  @Column({ type: 'boolean', default: true })
  is_private!: boolean;

  /**
   * Fecha y hora de creación de la nota
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * NOTA IMPORTANTE: Las relaciones a User no se pueden definir con @ManyToOne
   * porque cruzan diferentes data sources (progress → auth).
   * TypeORM no soporta relaciones cross-database.
   *
   * En su lugar, usamos los campos teacher_id y student_id (UUID) y hacemos
   * joins manuales en los services cuando sea necesario.
   *
   * FK en DDL:
   * - teacher_notes.teacher_id → auth_management.users.id (ON DELETE CASCADE)
   * - teacher_notes.student_id → auth_management.users.id (ON DELETE CASCADE)
   *
   * Para obtener los datos del profesor/estudiante:
   * - Inyectar UserRepository desde 'auth' connection en el service
   * - Hacer query manual: userRepository.findOne({ where: { id: teacherNote.teacher_id } })
   */
}
