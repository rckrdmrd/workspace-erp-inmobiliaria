/**
 * AssignmentClassroom Entity
 *
 * Mapea a la tabla: social_features.assignment_classrooms
 *
 * Tabla de join entre assignments y classrooms (many-to-many)
 *
 * CORREGIDO (2025-11-08): Migrado de 'public' a 'social_features'
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  DB_SCHEMAS,
  DB_TABLES,
} from '../../../shared/constants/database.constants';

@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.ASSIGNMENT_CLASSROOMS })
@Index(['assignment_id'])
@Index(['classroom_id'])
export class AssignmentClassroom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'assignment_id' })
  assignmentId!: string;

  @Column('uuid', { name: 'classroom_id' })
  classroomId!: string;

  @Column('timestamp with time zone', { name: 'deadline_override', nullable: true })
  deadlineOverride!: Date | null;

  @Column('integer', { name: 'students_count', default: 0 })
  studentsCount!: number;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamp with time zone' })
  assignedAt!: Date;

  // Relations
  // @ManyToOne(() => Assignment, assignment => assignment.assignmentClassrooms)
  // @JoinColumn({ name: 'assignment_id' })
  // assignment: Assignment;

  // @ManyToOne(() => Classroom)
  // @JoinColumn({ name: 'classroom_id' })
  // classroom: Classroom;
}
