/**
 * AssignmentExercise Entity
 *
 * Mapea a la tabla: educational_content.assignment_exercises
 *
 * Tabla M2M que vincula assignments con exercises del catálogo educativo.
 * Permite:
 * - Reutilizar exercises existentes en múltiples assignments
 * - Mantener orden de presentación con order_index
 * - Configurar points_override por exercise
 *
 * CREADO (2025-11-08): Implementación de funcionalidad faltante crítica
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
  name: DB_TABLES.EDUCATIONAL.ASSIGNMENT_EXERCISES,
})
@Index(['assignment_id'])
@Index(['exercise_id'])
@Index(['order_index'])
@Unique(['assignment_id', 'exercise_id'])
export class AssignmentExercise {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'assignment_id' })
  @Index()
  assignmentId!: string;

  @Column('uuid', { name: 'exercise_id' })
  @Index()
  exerciseId!: string;

  @Column('integer', { name: 'order_index' })
  @Index()
  orderIndex!: number;

  @Column('decimal', {
    name: 'points_override',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  pointsOverride?: number | null;

  @Column('boolean', { name: 'is_required', default: true })
  isRequired!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  // Relations (commented out - uncomment when Assignment and Exercise entities are fully configured)
  // @ManyToOne(() => Assignment, assignment => assignment.assignmentExercises)
  // @JoinColumn({ name: 'assignment_id' })
  // assignment!: Assignment;

  // @ManyToOne(() => Exercise)
  // @JoinColumn({ name: 'exercise_id' })
  // exercise!: Exercise;
}
