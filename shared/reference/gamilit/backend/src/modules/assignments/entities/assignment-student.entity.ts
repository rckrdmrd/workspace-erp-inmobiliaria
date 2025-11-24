/**
 * AssignmentStudent Entity
 *
 * Mapea a la tabla: educational_content.assignment_students
 *
 * Tabla M2M para asignación de assignments a estudiantes individuales.
 * Permite:
 * - Asignaciones remediales (estudiantes específicos que necesitan refuerzo)
 * - Asignaciones para estudiantes avanzados
 * - Asignaciones individualizadas fuera del classroom
 * - Tracking de cuándo se asignó a cada estudiante
 *
 * Diferencia con AssignmentClassroom:
 * - AssignmentClassroom: Asignación grupal a todo un classroom
 * - AssignmentStudent: Asignación individual a estudiantes específicos
 *
 * CREADO (2025-11-08): Implementación de funcionalidad faltante
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import {
  DB_SCHEMAS,
  DB_TABLES,
} from '../../../shared/constants/database.constants';

@Entity({
  schema: DB_SCHEMAS.EDUCATIONAL,
  name: DB_TABLES.EDUCATIONAL.ASSIGNMENT_STUDENTS,
})
@Index(['assignment_id'])
@Index(['student_id'])
@Unique(['assignment_id', 'student_id'])
export class AssignmentStudent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'assignment_id' })
  @Index()
  assignmentId!: string;

  @Column('uuid', { name: 'student_id' })
  @Index()
  studentId!: string;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamp with time zone' })
  assignedAt!: Date;

  // Relations (commented out - uncomment when Assignment entity is fully configured)
  // @ManyToOne(() => Assignment, assignment => assignment.assignmentStudents)
  // @JoinColumn({ name: 'assignment_id' })
  // assignment!: Assignment;

  // @ManyToOne(() => Profile)
  // @JoinColumn({ name: 'student_id' })
  // student!: Profile;
}
