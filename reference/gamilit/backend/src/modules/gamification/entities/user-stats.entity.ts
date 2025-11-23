import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';

/**
 * UserStats Entity (gamification_system.user_stats)
 *
 * @description Estadísticas de gamificación por usuario - ML Coins, XP, streaks, rankings
 * @schema gamification_system
 * @table user_stats
 *
 * IMPORTANTE:
 * - Tabla principal del sistema de gamificación (~35+ campos)
 * - Relación 1:1 con auth.users (user_id único)
 * - Incluye sistema de niveles, ML Coins, streaks, rankings
 *
 * @see DDL: apps/database/ddl/schemas/gamification_system/tables/01-user_stats.sql
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.USER_STATS })
@Index('idx_user_stats_user_id', ['user_id'])
@Index('idx_user_stats_tenant_id', ['tenant_id'])
@Index('idx_user_stats_level', ['level'])
@Index('idx_user_stats_tenant_level', ['tenant_id', 'level'])
@Index('idx_user_stats_ml_coins', ['ml_coins'])
@Index('idx_user_stats_streak', ['current_streak'])
@Index('idx_user_stats_current_rank', ['current_rank'])
@Index('idx_user_stats_perfect_scores', ['perfect_scores'])
export class UserStats {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario (FK → auth.users)
   * UNIQUE: Cada usuario tiene un único registro de stats
   */
  @Column({ type: 'uuid', unique: true })
  user_id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  // =====================================================
  // LEVEL & XP SYSTEM
  // =====================================================

  /**
   * Nivel actual del usuario (comienza en 1)
   */
  @Column({ type: 'integer', default: 1 })
  level!: number;

  /**
   * XP total acumulada
   */
  @Column({ type: 'integer', default: 0 })
  total_xp!: number;

  /**
   * XP necesaria para alcanzar el siguiente nivel
   */
  @Column({ type: 'integer', default: 100 })
  xp_to_next_level!: number;

  // =====================================================
  // RANK SYSTEM (Maya Ranks)
  // =====================================================

  /**
   * Rango Maya actual del usuario
   * Valores: 'Ajaw', 'Nacom', 'Ah K'in', 'Halach Uinic', 'K'uk'ulkan'
   */
  @Column({ type: 'text', default: 'Ajaw' })
  current_rank!: string;

  /**
   * Progreso hacia el siguiente rango (0-100%)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0.00 })
  rank_progress!: number;

  // =====================================================
  // ML COINS SYSTEM
  // =====================================================

  /**
   * Balance actual de ML Coins (monedas ML)
   */
  @Column({ type: 'integer', default: 100 })
  ml_coins!: number;

  /**
   * Total de ML Coins ganadas históricamente
   */
  @Column({ type: 'integer', default: 100 })
  ml_coins_earned_total!: number;

  /**
   * Total de ML Coins gastadas históricamente
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_spent_total!: number;

  /**
   * ML Coins ganadas hoy (se resetea diariamente)
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_earned_today!: number;

  /**
   * Fecha y hora del último reset de ML Coins diarias
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  last_ml_coins_reset?: Date;

  // =====================================================
  // STREAK SYSTEM
  // =====================================================

  /**
   * Racha de días consecutivos activa
   */
  @Column({ type: 'integer', default: 0 })
  current_streak!: number;

  /**
   * Racha máxima alcanzada
   */
  @Column({ type: 'integer', default: 0 })
  max_streak!: number;

  /**
   * Fecha y hora de inicio de la racha actual
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  streak_started_at?: Date;

  /**
   * Total de días activos en la plataforma
   */
  @Column({ type: 'integer', default: 0 })
  days_active_total!: number;

  // =====================================================
  // PROGRESS & COMPLETION METRICS
  // =====================================================

  /**
   * Cantidad de ejercicios completados
   */
  @Column({ type: 'integer', default: 0 })
  exercises_completed!: number;

  /**
   * Cantidad de módulos completados
   */
  @Column({ type: 'integer', default: 0 })
  modules_completed!: number;

  /**
   * Suma total de puntos obtenidos
   */
  @Column({ type: 'integer', default: 0 })
  total_score!: number;

  /**
   * Puntuación promedio de todos los ejercicios (0-100)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  average_score?: number;

  /**
   * Cantidad de ejercicios completados con puntuación perfecta (100%)
   */
  @Column({ type: 'integer', default: 0 })
  perfect_scores!: number;

  // =====================================================
  // ACHIEVEMENTS & REWARDS
  // =====================================================

  /**
   * Cantidad de logros (achievements) desbloqueados
   */
  @Column({ type: 'integer', default: 0 })
  achievements_earned!: number;

  /**
   * Cantidad de certificados obtenidos
   */
  @Column({ type: 'integer', default: 0 })
  certificates_earned!: number;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  /**
   * Tiempo total invertido en la plataforma
   */
  @Column({ type: 'interval', default: '00:00:00' })
  total_time_spent!: string;

  /**
   * Tiempo invertido en la última semana
   */
  @Column({ type: 'interval', default: '00:00:00' })
  weekly_time_spent!: string;

  /**
   * Cantidad de sesiones de aprendizaje
   */
  @Column({ type: 'integer', default: 0 })
  sessions_count!: number;

  // =====================================================
  // PERIODIC XP & ACTIVITY
  // =====================================================

  /**
   * XP ganada en la última semana
   */
  @Column({ type: 'integer', default: 0 })
  weekly_xp!: number;

  /**
   * XP ganada en el último mes
   */
  @Column({ type: 'integer', default: 0 })
  monthly_xp!: number;

  /**
   * Ejercicios completados en la última semana
   */
  @Column({ type: 'integer', default: 0 })
  weekly_exercises!: number;

  // =====================================================
  // RANKING POSITIONS
  // =====================================================

  /**
   * Posición en el ranking global (pre-calculado)
   */
  @Column({ type: 'integer', nullable: true })
  global_rank_position?: number;

  /**
   * Posición en el ranking del aula (pre-calculado)
   */
  @Column({ type: 'integer', nullable: true })
  class_rank_position?: number;

  /**
   * Posición en el ranking de la escuela (pre-calculado)
   */
  @Column({ type: 'integer', nullable: true })
  school_rank_position?: number;

  // =====================================================
  // ACTIVITY TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de la última actividad
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  last_activity_at?: Date;

  /**
   * Fecha y hora del último inicio de sesión
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  last_login_at?: Date;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
