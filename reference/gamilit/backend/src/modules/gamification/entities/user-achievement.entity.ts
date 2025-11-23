import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';

/**
 * UserAchievement Entity
 *
 * @description Relación many-to-many entre usuarios y logros (achievements).
 * Características:
 * - Tracking de progreso incremental (0-100%)
 * - Sistema de milestones intermedios
 * - Gestión de recompensas reclamadas
 * - Notificaciones de desbloqueo
 * - JSONB para datos de progreso dinámicos
 *
 * @see DDL: gamification_system.user_achievements
 * @constraint UNIQUE(user_id, achievement_id) - un achievement por usuario
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.USER_ACHIEVEMENTS })
@Index(['user_id'])
@Index(['achievement_id'])
@Index(['user_id', 'is_completed'])
@Index(['user_id', 'is_completed', 'completed_at'])
@Index('idx_user_achievements_unclaimed', ['user_id'], {
  where: '(is_completed = true) AND (rewards_claimed = false)',
})
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid' })
  achievement_id!: string;

  /**
   * Progreso numérico actual (ej: 3 ejercicios completados de 10)
   */
  @Column({ type: 'integer', default: 0 })
  progress!: number;

  /**
   * Progreso máximo requerido para completar
   */
  @Column({ type: 'integer', default: 100 })
  max_progress!: number;

  /**
   * Indica si el achievement está completado
   */
  @Column({ type: 'boolean', default: false })
  is_completed!: boolean;

  /**
   * Porcentaje de completitud (0.00 - 100.00)
   * Se calcula automáticamente: (progress / max_progress) * 100
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0.0 })
  completion_percentage!: number;

  /**
   * Fecha de completitud del achievement
   */
  @Column({ type: 'timestamptz', nullable: true })
  completed_at!: Date | null;

  /**
   * Indica si el usuario fue notificado del desbloqueo
   */
  @Column({ type: 'boolean', default: false })
  notified!: boolean;

  /**
   * Indica si el usuario vio la notificación
   */
  @Column({ type: 'boolean', default: false })
  viewed!: boolean;

  /**
   * Indica si el usuario reclamó las recompensas (ML coins, items, etc.)
   */
  @Column({ type: 'boolean', default: false })
  rewards_claimed!: boolean;

  /**
   * Recompensas recibidas en formato JSONB
   * Ejemplo: { "ml_coins": 50, "items": [{"type": "boost_xp", "quantity": 1}] }
   */
  @Column({ type: 'jsonb', default: {} })
  rewards_received!: Record<string, any>;

  /**
   * Datos de progreso específicos por achievement (JSONB)
   * Ejemplo: { "levels_completed": [1, 2, 5], "current_streak": 3 }
   */
  @Column({ type: 'jsonb', default: {} })
  progress_data!: Record<string, any>;

  /**
   * Milestones alcanzados (array de strings)
   * Ejemplo: ["25%", "50%", "75%"]
   */
  @Column({ type: 'text', array: true, nullable: true })
  milestones_reached: string[] | null = null;

  /**
   * Metadata adicional en JSONB
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * Fecha en que el usuario comenzó a trabajar en el achievement
   */
  @Column({ type: 'timestamptz', default: () => "gamilit.now_mexico()" })
  started_at!: Date;

  @Column({ type: 'timestamptz', default: () => "gamilit.now_mexico()" })
  created_at!: Date;

  // Relaciones (se pueden agregar después cuando se creen Achievement y Profile entities)
  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: Profile;

  // @ManyToOne(() => Achievement, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'achievement_id' })
  // achievement: Achievement;
}
