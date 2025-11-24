import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';

/**
 * LearningPath Entity (progress_tracking.learning_paths)
 *
 * @description Rutas de aprendizaje predefinidas (secuencias de módulos).
 * @schema progress_tracking
 * @table learning_paths
 *
 * IMPORTANTE:
 * - Rutas curadas para guiar el aprendizaje
 * - Recomendadas para nuevos usuarios
 * - Niveles de dificultad: facil, intermedio, dificil, experto
 * - Estimación de horas para completar
 * - is_active permite desactivar sin eliminar
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/learning_paths.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.LEARNING_PATHS })
@Check(`"difficulty_level" IN ('facil', 'intermedio', 'dificil', 'experto')`)
@Index('idx_learning_paths_is_active', ['is_active'])
@Index('idx_learning_paths_is_recommended', ['is_recommended'])
@Index('idx_learning_paths_difficulty', ['difficulty_level'])
@Index('idx_learning_paths_created_by', ['created_by'], { where: 'created_by IS NOT NULL' })
export class LearningPath {
  /**
   * Identificador único de la ruta de aprendizaje (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Nombre de la ruta de aprendizaje
   * @example 'Fundamentos de Comprensión Lectora', 'Maestría en Lectura Digital'
   */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /**
   * Descripción detallada de la ruta
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Indica si esta ruta es recomendada para nuevos usuarios
   */
  @Column({ type: 'boolean', default: false })
  is_recommended!: boolean;

  /**
   * Nivel de dificultad de la ruta completa
   * @values 'facil', 'intermedio', 'dificil', 'experto'
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  difficulty_level?: 'facil' | 'intermedio' | 'dificil' | 'experto';

  /**
   * Estimación de horas para completar la ruta
   * @example 10, 20, 40
   */
  @Column({ type: 'integer', nullable: true })
  estimated_hours?: number;

  /**
   * Indica si la ruta está activa y disponible
   * Permite desactivar sin eliminar
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * ID del usuario que creó la ruta (opcional)
   * NULL para rutas del sistema
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * Fecha y hora de creación
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Usuario que creó la ruta de aprendizaje (cross-database, no @ManyToOne)
   * FK en DDL: learning_paths.created_by → auth.users.id (ON DELETE SET NULL)
   * NOTA: Nullable - Las rutas del sistema no tienen created_by
   * Para obtener el creador: inyectar UserRepository desde 'auth' connection
   */
}
