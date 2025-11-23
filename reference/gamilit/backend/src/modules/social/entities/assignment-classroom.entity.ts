import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';
import { Classroom } from './classroom.entity';

/**
 * AssignmentClassroom Entity (social_features.assignment_classrooms)
 *
 * @description Relación M2M entre asignaciones y aulas.
 *              Permite asignar tareas a aulas completas.
 * @schema social_features
 * @table assignment_classrooms
 *
 * IMPORTANTE:
 * - Una asignación puede ser asignada a múltiples aulas
 * - Un aula puede tener múltiples asignaciones
 * - UNIQUE constraint en (assignment_id, classroom_id)
 * - Movido desde public.assignment_classrooms (2025-11-08)
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/assignment_classrooms.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.ASSIGNMENT_CLASSROOMS })
@Unique(['assignment_id', 'classroom_id'])
@Index('idx_assignment_classrooms_assignment_id', ['assignment_id'])
@Index('idx_assignment_classrooms_classroom_id', ['classroom_id'])
export class AssignmentClassroom {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID de la asignación
   */
  @Column({ type: 'uuid' })
  assignment_id!: string;

  /**
   * ID del aula
   */
  @Column({ type: 'uuid' })
  classroom_id!: string;

  /**
   * Fecha y hora de asignación
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  assigned_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Aula asociada
   * Relación ManyToOne: Muchas asignaciones pueden pertenecer a un aula
   * FK: assignment_classrooms.classroom_id → social_features.classrooms.id
   *
   * NOTA: ON DELETE CASCADE - Si se elimina el aula, se eliminan sus asignaciones
   */
  @ManyToOne(() => Classroom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id', referencedColumnName: 'id' })
  classroom?: Classroom;

  /**
   * Asignación asociada
   * NOTA: La entidad Assignment está en educational_content schema
   * La relación se puede definir cuando se implemente Assignment entity
   * FK: assignment_classrooms.assignment_id → educational_content.assignments.id
   */
  // @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'assignment_id', referencedColumnName: 'id' })
  // assignment?: Assignment;
}
