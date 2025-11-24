import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';

/**
 * MasteryTracking Entity (progress_tracking.mastery_tracking)
 *
 * @description Seguimiento de dominio de temas/conceptos por usuario.
 * @schema progress_tracking
 * @table mastery_tracking
 *
 * IMPORTANTE:
 * - Una fila por usuario + módulo + tema (UNIQUE constraint)
 * - Mastery level: 0-100 basado en performance
 * - Estados: not_started, learning, practicing, mastered, needs_review
 * - Tracking de intentos totales vs correctos
 * - Usado para adaptive learning y recomendaciones
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/mastery_tracking.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.MASTERY_TRACKING })
@Unique(['user_id', 'module_id', 'topic'])
@Index('idx_mastery_tracking_user_id', ['user_id'])
@Index('idx_mastery_tracking_module_id', ['module_id'])
@Index('idx_mastery_tracking_status', ['status'])
@Index('idx_mastery_tracking_mastery_level', ['mastery_level'])
@Index('idx_mastery_tracking_user_module', ['user_id', 'module_id'])
@Index('idx_mastery_tracking_needs_review', ['user_id'], { where: "status = 'needs_review'" })
@Check(`"mastery_level" >= 0 AND "mastery_level" <= 100`)
@Check(`"status" IN ('not_started', 'learning', 'practicing', 'mastered', 'needs_review')`)
export class MasteryTracking {
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
   * ID del módulo educativo
   */
  @Column({ type: 'uuid' })
  module_id!: string;

  /**
   * Tema o concepto específico siendo rastreado
   * @example 'Comprensión Literal', 'Inferencias', 'Análisis Crítico'
   */
  @Column({ type: 'varchar', length: 200 })
  topic!: string;

  /**
   * Nivel de dominio (0-100) basado en performance
   * 0-25: Inicial
   * 26-50: En desarrollo
   * 51-75: Competente
   * 76-100: Maestría
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  mastery_level!: number;

  /**
   * Número total de intentos en ejercicios de este tema
   */
  @Column({ type: 'integer', default: 0 })
  attempts_count!: number;

  /**
   * Número de intentos correctos
   */
  @Column({ type: 'integer', default: 0 })
  correct_attempts!: number;

  /**
   * Fecha y hora del último intento
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  last_attempt_at?: Date;

  /**
   * Fecha y hora en que se alcanzó maestría (mastery_level >= 75)
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  mastered_at?: Date;

  /**
   * Estado actual del dominio
   * - not_started: Aún no iniciado
   * - learning: Aprendiendo (0-40%)
   * - practicing: Practicando (41-74%)
   * - mastered: Dominado (75-100%)
   * - needs_review: Requiere repaso (decaimiento)
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: 'learning',
  })
  status!: 'not_started' | 'learning' | 'practicing' | 'mastered' | 'needs_review';

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
   * Usuario asociado a este tracking (cross-database, no @ManyToOne)
   * FK en DDL: mastery_tracking.user_id → auth.users.id (ON DELETE CASCADE)
   * Para obtener el usuario: inyectar UserRepository desde 'auth' connection
   */

  /**
   * Módulo educativo asociado (cross-database, no @ManyToOne)
   * FK en DDL: mastery_tracking.module_id → educational_content.modules.id (ON DELETE CASCADE)
   * Para obtener el módulo: inyectar ModuleRepository desde 'educational' connection
   */
}
