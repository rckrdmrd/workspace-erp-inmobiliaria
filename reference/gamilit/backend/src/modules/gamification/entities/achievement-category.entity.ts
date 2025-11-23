import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';

/**
 * AchievementCategory Entity
 *
 * @description Categorías para organizar achievements (logros).
 * Características:
 * - Categorías predefinidas: educational, social, missions, special, collection
 * - Sistema de ordenamiento (display_order)
 * - Soporte para iconos visuales
 * - Estados activo/inactivo
 *
 * @see DDL: gamification_system.achievement_categories
 * @constraint UNIQUE(name)
 */
@Entity({
  schema: DB_SCHEMAS.GAMIFICATION,
  name: DB_TABLES.GAMIFICATION.ACHIEVEMENT_CATEGORIES,
})
@Index(['name'])
@Index(['display_order'])
@Index('idx_achievement_categories_active', ['is_active'], { where: 'is_active = true' })
export class AchievementCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Nombre único de la categoría
   * Ejemplos: "educational", "social", "missions", "special", "collection"
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  /**
   * Descripción de la categoría
   */
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  /**
   * URL del icono representativo de la categoría
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  icon_url!: string | null;

  /**
   * Orden de visualización (menor = primero)
   */
  @Column({ type: 'integer', default: 0 })
  display_order!: number;

  /**
   * Indica si la categoría está activa y visible
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at!: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at!: Date;

  // Relación con achievements (se puede agregar después cuando se cree Achievement entity)
  // @OneToMany(() => Achievement, achievement => achievement.category)
  // achievements: Achievement[];
}
