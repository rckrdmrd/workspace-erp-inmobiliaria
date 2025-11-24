import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { Classroom } from './classroom.entity';

/**
 * Enum for teacher roles in classroom
 */
export enum TeacherClassroomRole {
  OWNER = 'owner',
  TEACHER = 'teacher',
  ASSISTANT = 'assistant',
}

/**
 * TeacherClassroom Entity (social_features.teacher_classrooms)
 *
 * @description Relación many-to-many entre teachers y classrooms con roles
 * @schema social_features
 * @table teacher_classrooms
 *
 * IMPORTANTE:
 * - Permite múltiples teachers por classroom con diferentes roles
 * - owner: Creador del classroom, permisos completos
 * - teacher: Permisos completos de enseñanza
 * - assistant: Permisos limitados de apoyo
 * - Un teacher puede tener múltiples classrooms
 * - Un classroom puede tener múltiples teachers
 * - Constraint UNIQUE(teacher_id, classroom_id) previene duplicados
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/teacher_classrooms.sql
 */
@Entity({
  schema: DB_SCHEMAS.SOCIAL,
  name: DB_TABLES.SOCIAL.TEACHER_CLASSROOMS,
})
@Index('idx_teacher_classrooms_teacher_id', ['teacher_id'])
@Index('idx_teacher_classrooms_classroom_id', ['classroom_id'])
@Index('idx_teacher_classrooms_role', ['role'])
export class TeacherClassroom {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // RELATIONS
  // =====================================================

  /**
   * ID del teacher (FK → auth.users.id)
   * Referencia al usuario con rol teacher
   */
  @Column({ type: 'uuid' })
  teacher_id!: string;

  /**
   * ID del classroom (FK → social_features.classrooms.id)
   */
  @Column({ type: 'uuid' })
  classroom_id!: string;

  /**
   * Relación Many-to-One con Classroom
   */
  @ManyToOne(() => Classroom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  // =====================================================
  // ROLE & STATUS
  // =====================================================

  /**
   * Rol del teacher en el classroom
   * - owner: Creador, permisos completos
   * - teacher: Permisos de enseñanza completos
   * - assistant: Permisos limitados
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: TeacherClassroomRole.TEACHER,
  })
  role!: TeacherClassroomRole;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de asignación
   */
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assigned_at!: Date;

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;
}
