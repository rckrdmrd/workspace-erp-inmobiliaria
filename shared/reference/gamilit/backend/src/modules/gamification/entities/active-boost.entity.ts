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
 * ActiveBoost Entity
 *
 * @description Bonificadores temporales activos para usuarios.
 * Características:
 * - Tipos: XP, COINS, LUCK, DROP_RATE
 * - Multiplicadores > 1.0 (ej: 1.5 = +50%)
 * - Auto-expire mediante expires_at
 * - Tracking de origen (PREMIUM, EVENT, ITEM, ACHIEVEMENT)
 * - Sistema de activación/expiración
 *
 * @see DDL: gamification_system.active_boosts
 * @constraint multiplier > 1.0
 * @constraint expires_at > activated_at
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.ACTIVE_BOOSTS })
@Index(['user_id'])
@Index(['user_id', 'boost_type', 'is_active'])
@Index('idx_active_boosts_expires', ['expires_at'], { where: 'is_active = true' })
@Index('idx_active_boosts_type', ['boost_type'], { where: 'is_active = true' })
@Index('idx_active_boosts_active', ['is_active', 'expires_at'], { where: 'is_active = true' })
export class ActiveBoost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * Tipo de bonificador: XP, COINS, LUCK, DROP_RATE
   */
  @Column({ type: 'varchar', length: 50 })
  boost_type!: 'XP' | 'COINS' | 'LUCK' | 'DROP_RATE';

  /**
   * Multiplicador del boost (debe ser > 1.0)
   * Ejemplos:
   * - 1.5 = +50%
   * - 2.0 = +100% (doble)
   * - 1.25 = +25%
   */
  @Column({ type: 'numeric', precision: 4, scale: 2, default: 1.0 })
  multiplier!: number;

  /**
   * Origen del boost
   * Ejemplos: PREMIUM, EVENT, ITEM, ACHIEVEMENT, MISSION_REWARD
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  source!: string | null;

  /**
   * Fecha y hora de activación del boost
   */
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  activated_at!: Date;

  /**
   * Fecha y hora de expiración del boost
   * Se debe verificar automáticamente para desactivar boosts expirados
   */
  @Column({ type: 'timestamptz' })
  expires_at!: Date;

  /**
   * Indica si el boost está activo o ya expiró
   * Se debe actualizar mediante cron job o query automática
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  // Relación con Profile (se puede agregar después cuando se cree Profile entity)
  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: Profile;
}
