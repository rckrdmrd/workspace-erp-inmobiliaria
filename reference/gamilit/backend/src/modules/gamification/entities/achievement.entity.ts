import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import {
  AchievementCategoryEnum,
  DifficultyLevelEnum,
} from '@shared/constants/enums.constants';

/**
 * Achievement Entity (gamification_system.achievements)
 *
 * @description Definiciones de logros/achievements con condiciones y recompensas.
 *              Catálogo de logros desbloqueables del sistema de gamificación.
 * @schema gamification_system
 * @table achievements
 *
 * IMPORTANTE:
 * - Tabla de catálogo (definiciones de logros, NO asignaciones)
 * - Para logros desbloqueados por usuario ver user_achievements
 * - Condiciones y recompensas en formato JSONB
 *
 * @see DDL: apps/database/ddl/schemas/gamification_system/tables/03-achievements.sql
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.ACHIEVEMENTS })
@Index('idx_achievements_category', ['category'])
@Index('idx_achievements_active', ['is_active'], { where: 'is_active = true' })
@Index('idx_achievements_secret', ['is_secret'], { where: 'is_secret = true' })
@Index('idx_achievements_conditions_gin', ['conditions'])
export class Achievement {
  /**
   * Identificador único del achievement (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre del logro
   */
  @Column({ type: 'text' })
  name!: string;

  /**
   * Descripción del logro
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Icono del logro
   */
  @Column({ type: 'text', default: 'trophy' })
  icon!: string;

  // =====================================================
  // CATEGORIZATION
  // =====================================================

  /**
   * Categoría del logro
   * ENUM: progress, streak, completion, social, special, mastery, exploration
   */
  @Column({ type: 'enum', enum: AchievementCategoryEnum })
  category!: AchievementCategoryEnum;

  /**
   * Rareza del logro
   * CHECK: common, rare, epic, legendary
   */
  @Column({ type: 'text', default: 'common' })
  rarity!: string;

  /**
   * Nivel de dificultad del logro
   */
  @Column({
    type: 'enum',
    enum: DifficultyLevelEnum,
    default: DifficultyLevelEnum.BEGINNER,
  })
  difficulty_level!: DifficultyLevelEnum;

  // =====================================================
  // CONDITIONS & REWARDS
  // =====================================================

  /**
   * Condiciones JSON para desbloquear el achievement
   * Ejemplo: {"type": "progress", "requirements": {"exercises_completed": 10}}
   */
  @Column({ type: 'jsonb' })
  conditions!: Record<string, any>;

  /**
   * Recompensas JSON otorgadas al desbloquear
   * Ejemplo: {"xp": 100, "badge": null, "ml_coins": 50}
   */
  @Column({ type: 'jsonb', default: { xp: 100, badge: null, ml_coins: 50 } })
  rewards!: Record<string, any>;

  /**
   * Recompensa de ML Coins (campo adicional para queries rápidas)
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_reward!: number;

  // =====================================================
  // VISIBILITY & STATUS
  // =====================================================

  /**
   * Si es true, el achievement está oculto hasta desbloquearlo
   */
  @Column({ type: 'boolean', default: false })
  is_secret!: boolean;

  /**
   * Si el logro está activo y disponible
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Si el logro puede desbloquearse múltiples veces
   */
  @Column({ type: 'boolean', default: false })
  is_repeatable!: boolean;

  // =====================================================
  // ORDERING & POINTS
  // =====================================================

  /**
   * Índice de orden para listados
   */
  @Column({ type: 'integer', default: 0 })
  order_index!: number;

  /**
   * Valor en puntos del logro
   */
  @Column({ type: 'integer', default: 0 })
  points_value!: number;

  // =====================================================
  // MESSAGING & GUIDANCE
  // =====================================================

  /**
   * Mensaje mostrado al desbloquear el logro
   */
  @Column({ type: 'text', nullable: true })
  unlock_message?: string;

  /**
   * Instrucciones de cómo desbloquear el logro
   */
  @Column({ type: 'text', nullable: true })
  instructions?: string;

  /**
   * Tips adicionales para el usuario
   */
  @Column({ type: 'text', array: true, nullable: true })
  tips?: string[];

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * ID del usuario que creó el achievement
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

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
