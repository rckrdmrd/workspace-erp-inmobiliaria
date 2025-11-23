import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';

/**
 * ProgressSnapshot Entity (progress_tracking.progress_snapshots)
 *
 * @description Snapshots históricos de progreso de usuarios (diario/semanal/mensual).
 * @schema progress_tracking
 * @table progress_snapshots
 *
 * IMPORTANTE:
 * - Capturas de progreso en puntos específicos del tiempo
 * - UNIQUE constraint en (user_id, snapshot_date) - un snapshot por usuario por día
 * - JSONB para datos detallados (flexible)
 * - Campos agregados para queries rápidas
 * - Útil para reportes y analytics históricos
 * - GIN index en snapshot_data para búsquedas JSONB
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/progress_snapshots.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.PROGRESS_SNAPSHOTS })
@Unique(['user_id', 'snapshot_date'])
@Index('idx_progress_snapshots_user_id', ['user_id'])
@Index('idx_progress_snapshots_date', ['snapshot_date'])
@Index('idx_progress_snapshots_user_date', ['user_id', 'snapshot_date'])
// NOTE: GIN index on snapshot_data is created via DDL (not supported by TypeORM decorators)
export class ProgressSnapshot {
  /**
   * Identificador único del snapshot (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * Fecha del snapshot
   * Un solo snapshot por usuario por día
   */
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  snapshot_date!: Date;

  /**
   * Datos detallados del progreso en formato JSONB
   * Estructura flexible para capturar cualquier métrica
   * @example {
   *   "modules": {...},
   *   "exercises": {...},
   *   "achievements": [...],
   *   "streaks": {...}
   * }
   */
  @Column({ type: 'jsonb' })
  snapshot_data!: Record<string, any>;

  /**
   * Total de módulos completados hasta esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  total_modules_completed!: number;

  /**
   * Total de ejercicios completados hasta esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  total_exercises_completed!: number;

  /**
   * Tiempo total gastado en segundos
   */
  @Column({ type: 'integer', default: 0 })
  total_time_spent_seconds!: number;

  /**
   * Total de XP acumulado hasta esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  total_xp!: number;

  /**
   * Rango Maya actual del usuario
   * @example 'Ah Puch', 'Itzamna', etc.
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  current_rank?: string;

  /**
   * Fecha y hora de creación del snapshot
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Usuario al que pertenece el snapshot (cross-database, no @ManyToOne)
   * FK en DDL: progress_snapshots.user_id → auth.users.id (ON DELETE CASCADE)
   * Para obtener el usuario: inyectar UserRepository desde 'auth' connection
   */
}
