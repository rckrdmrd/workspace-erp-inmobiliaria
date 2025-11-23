import { Entity, PrimaryColumn, Column } from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';

/**
 * LeaderboardMetadata Entity
 *
 * @description Metadata para vistas materializadas de leaderboards.
 * Características:
 * - Tracking de última actualización (last_refresh_at)
 * - Estadísticas de rendimiento (refresh_duration_ms)
 * - Conteo de usuarios totales
 * - Soporte para cache (Redis futuro)
 * - Tipos: global, school, classroom, weekly
 *
 * @see DDL: gamification_system.leaderboard_metadata
 * @note view_name es PK (ej: "leaderboard_global", "leaderboard_weekly")
 */
@Entity({
  schema: DB_SCHEMAS.GAMIFICATION,
  name: DB_TABLES.GAMIFICATION.LEADERBOARD_METADATA,
})
export class LeaderboardMetadata {
  /**
   * Nombre de la vista materializada o leaderboard
   * Ejemplos: "leaderboard_global", "leaderboard_weekly", "leaderboard_school_123"
   */
  @PrimaryColumn({ type: 'text' })
  view_name!: string;

  /**
   * Fecha y hora de la última actualización del leaderboard
   */
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  last_refresh_at!: Date;

  /**
   * Total de usuarios en el leaderboard
   */
  @Column({ type: 'integer', nullable: true })
  total_users!: number | null;

  /**
   * Duración del refresh en milisegundos (para métricas de performance)
   */
  @Column({ type: 'integer', nullable: true })
  refresh_duration_ms!: number | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at!: Date;
}
