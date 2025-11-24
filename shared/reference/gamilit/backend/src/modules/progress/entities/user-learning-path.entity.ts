import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';
import { LearningPath } from './learning-path.entity';

/**
 * UserLearningPath Entity (progress_tracking.user_learning_paths)
 *
 * @description Rutas de aprendizaje asignadas a usuarios con seguimiento de progreso.
 * @schema progress_tracking
 * @table user_learning_paths
 *
 * IMPORTANTE:
 * - M2M entre usuarios y rutas de aprendizaje
 * - Tracking de progreso granular (porcentaje, módulo actual)
 * - Estados: enrolled, in_progress, completed, abandoned
 * - UNIQUE constraint en (user_id, learning_path_id)
 * - Timestamps de enrolled_at, started_at, completed_at
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/user_learning_paths.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.USER_LEARNING_PATHS })
@Unique(['user_id', 'learning_path_id'])
@Check(`"completion_percentage" >= 0 AND "completion_percentage" <= 100`)
@Check(`"status" IN ('enrolled', 'in_progress', 'completed', 'abandoned')`)
@Index('idx_user_learning_paths_user_id', ['user_id'])
@Index('idx_user_learning_paths_path_id', ['learning_path_id'])
@Index('idx_user_learning_paths_status', ['status'])
@Index('idx_user_learning_paths_user_status', ['user_id', 'status'])
@Index('idx_user_learning_paths_enrolled_at', ['enrolled_at'])
export class UserLearningPath {
  /**
   * Identificador único de la asignación (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario asignado
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * ID de la ruta de aprendizaje
   */
  @Column({ type: 'uuid' })
  learning_path_id!: string;

  /**
   * Fecha y hora de inscripción en la ruta
   */
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  enrolled_at!: Date;

  /**
   * Fecha y hora de inicio (primer módulo)
   * NULL si aún no ha comenzado
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  started_at?: Date;

  /**
   * Fecha y hora de finalización
   * NULL si aún no ha completado
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  completed_at?: Date;

  /**
   * Porcentaje de completitud de la ruta (0-100)
   * @example 0, 25.50, 100
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  completion_percentage!: number;

  /**
   * Índice del módulo actual en la secuencia
   * @example 0 (primer módulo), 1, 2, etc.
   */
  @Column({ type: 'integer', default: 0 })
  current_module_index!: number;

  /**
   * Estado de la ruta de aprendizaje
   * @values 'enrolled', 'in_progress', 'completed', 'abandoned'
   */
  @Column({ type: 'varchar', length: 50, default: 'enrolled' })
  status!: 'enrolled' | 'in_progress' | 'completed' | 'abandoned';

  /**
   * Fecha y hora de última actualización
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Usuario asignado a la ruta (cross-database, no @ManyToOne)
   * FK en DDL: user_learning_paths.user_id → auth.users.id (ON DELETE CASCADE)
   * Para obtener el usuario: inyectar UserRepository desde 'auth' connection
   */

  /**
   * Ruta de aprendizaje asignada
   * Relación ManyToOne: Muchas asignaciones pertenecen a una ruta
   * FK: user_learning_paths.learning_path_id → progress_tracking.learning_paths.id
   *
   * NOTA: ON DELETE CASCADE - Si se elimina la ruta, se eliminan las asignaciones
   */
  @ManyToOne(() => LearningPath, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'learning_path_id', referencedColumnName: 'id' })
  learning_path?: LearningPath;
}
