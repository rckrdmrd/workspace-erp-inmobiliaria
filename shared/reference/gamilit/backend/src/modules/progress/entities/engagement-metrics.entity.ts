import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';

/**
 * EngagementMetrics Entity (progress_tracking.engagement_metrics)
 *
 * @description Métricas diarias de engagement y actividad de usuarios.
 * @schema progress_tracking
 * @table engagement_metrics
 *
 * IMPORTANTE:
 * - Una fila por usuario por día (UNIQUE constraint en user_id + metric_date)
 * - Tracking de sesiones, tiempo, ejercicios, módulos, logros, interacciones
 * - Engagement score calculado (0-100) basado en actividad
 * - Útil para analytics, reportes y detección de estudiantes en riesgo
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/engagement_metrics.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.ENGAGEMENT_METRICS })
@Unique(['user_id', 'metric_date'])
@Index('idx_engagement_metrics_user_id', ['user_id'])
@Index('idx_engagement_metrics_date', ['metric_date'])
@Index('idx_engagement_metrics_user_date', ['user_id', 'metric_date'])
@Index('idx_engagement_metrics_daily_active', ['metric_date'], { where: 'daily_active = true' })
@Index('idx_engagement_metrics_score', ['engagement_score'])
export class EngagementMetrics {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * Fecha de las métricas (una fila por día)
   */
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  metric_date!: Date;

  /**
   * Indica si el usuario estuvo activo en esta fecha
   */
  @Column({ type: 'boolean', default: false })
  daily_active!: boolean;

  /**
   * Número de sesiones de aprendizaje en esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  sessions_count!: number;

  /**
   * Tiempo total en la plataforma (segundos)
   */
  @Column({ type: 'integer', default: 0 })
  total_time_seconds!: number;

  /**
   * Ejercicios intentados en esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  exercises_attempted!: number;

  /**
   * Ejercicios completados en esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  exercises_completed!: number;

  /**
   * Módulos iniciados en esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  modules_started!: number;

  /**
   * Módulos completados en esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  modules_completed!: number;

  /**
   * Logros desbloqueados en esta fecha
   */
  @Column({ type: 'integer', default: 0 })
  achievements_unlocked!: number;

  /**
   * Interacciones sociales (mensajes, likes, etc.)
   */
  @Column({ type: 'integer', default: 0 })
  social_interactions!: number;

  /**
   * Score de engagement calculado (0-100)
   * Basado en actividad, tiempo, completitud, etc.
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  engagement_score!: number;

  /**
   * Fecha y hora de creación del registro
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
   * NOTA IMPORTANTE: La relación a User no se puede definir con @ManyToOne
   * porque cruza diferentes data sources (progress → auth).
   * TypeORM no soporta relaciones cross-database.
   *
   * En su lugar, usamos el campo user_id (UUID) y hacemos joins manuales
   * en los services cuando sea necesario.
   *
   * FK en DDL:
   * - engagement_metrics.user_id → auth_management.users.id (ON DELETE CASCADE)
   *
   * Para obtener los datos del usuario:
   * - Inyectar UserRepository desde 'auth' connection en el service
   * - Hacer query manual: userRepository.findOne({ where: { id: engagementMetrics.user_id } })
   */
}
