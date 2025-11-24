import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { MayaRank } from '@shared/constants/enums.constants';

/**
 * UserRank Entity (gamification_system.user_ranks)
 *
 * @description Progresión de rangos maya del sistema de gamificación.
 *              Historial de rangos alcanzados por usuario.
 *              Progresión: Ajaw → Nacom → Ah K'in → Halach Uinic → K'uk'ulkan
 * @schema gamification_system
 * @table user_ranks
 *
 * IMPORTANTE:
 * - Tabla de historial de rangos (múltiples registros por usuario)
 * - current_rank usa ENUM maya_rank del DDL
 * - Campo is_current indica el rango activo actual
 *
 * @see DDL: apps/database/ddl/schemas/gamification_system/tables/02-user_ranks.sql
 * @see ENUM: apps/database/ddl/schemas/gamification_system/enums/maya_rank.sql
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.USER_RANKS })
@Index('idx_user_ranks_user_id', ['user_id'])
@Index('idx_user_ranks_current', ['current_rank'])
@Index('idx_user_ranks_is_current', ['user_id', 'is_current'], { where: 'is_current = true' })
export class UserRank {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario (FK → auth.users)
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  // =====================================================
  // RANK INFORMATION
  // =====================================================

  /**
   * Rango maya actual del usuario
   * ENUM: 'Ajaw', 'Nacom', 'Ah K'in', 'Halach Uinic', 'K'uk'ulkan'
   * (Basado en ENUM maya_rank del DDL)
   */
  @Column({
    type: 'text',
    default: MayaRank.AJAW,
    enum: MayaRank,
  })
  current_rank!: MayaRank;

  /**
   * Rango maya anterior
   */
  @Column({
    type: 'text',
    nullable: true,
    enum: MayaRank,
  })
  previous_rank?: MayaRank;

  // =====================================================
  // PROGRESS & METRICS
  // =====================================================

  /**
   * Porcentaje de progreso hacia el siguiente rango (0-100)
   */
  @Column({ type: 'integer', default: 0 })
  rank_progress_percentage!: number;

  /**
   * Módulos requeridos para alcanzar el siguiente rango
   */
  @Column({ type: 'integer', nullable: true })
  modules_required_for_next?: number;

  /**
   * Módulos completados para el rango actual
   */
  @Column({ type: 'integer', default: 0 })
  modules_completed_for_rank!: number;

  /**
   * XP requerida para alcanzar el siguiente rango
   */
  @Column({ type: 'integer', nullable: true })
  xp_required_for_next?: number;

  /**
   * XP ganada para el rango actual
   */
  @Column({ type: 'integer', default: 0 })
  xp_earned_for_rank!: number;

  /**
   * Bonus de ML Coins otorgado al alcanzar el rango
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_bonus!: number;

  // =====================================================
  // CERTIFICATES & BADGES
  // =====================================================

  /**
   * URL del certificado obtenido al alcanzar el rango
   */
  @Column({ type: 'text', nullable: true })
  certificate_url?: string;

  /**
   * URL del badge/insignia del rango
   */
  @Column({ type: 'text', nullable: true })
  badge_url?: string;

  // =====================================================
  // ACHIEVEMENT DATES
  // =====================================================

  /**
   * Fecha y hora en que se alcanzó el rango actual
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  achieved_at?: Date;

  /**
   * Fecha y hora en que se alcanzó el rango anterior
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  previous_rank_achieved_at?: Date;

  // =====================================================
  // STATUS CONTROL
  // =====================================================

  /**
   * Indica si este es el rango actual del usuario
   * Solo un registro por usuario debe tener is_current = true
   */
  @Column({ type: 'boolean', default: true })
  is_current!: boolean;

  /**
   * Metadatos adicionales del rango en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  rank_metadata!: Record<string, any>;

  // =====================================================
  // AUDIT
  // =====================================================

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
