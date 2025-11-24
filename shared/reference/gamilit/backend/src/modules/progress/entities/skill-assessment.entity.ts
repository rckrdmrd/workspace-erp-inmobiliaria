import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';

/**
 * SkillAssessment Entity (progress_tracking.skill_assessments)
 *
 * @description Evaluaciones de habilidades específicas de usuarios.
 * @schema progress_tracking
 * @table skill_assessments
 *
 * IMPORTANTE:
 * - Tracking granular de competencias específicas
 * - Score numérico (0-100) + nivel de competencia
 * - Evidencia en JSONB (flexible)
 * - Opcional: enlace al módulo que generó la evaluación
 * - Permite tracking histórico de progreso por habilidad
 * - Niveles: novice, beginner, intermediate, advanced, expert
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/skill_assessments.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.SKILL_ASSESSMENTS })
@Check(`"assessment_score" >= 0 AND "assessment_score" <= 100`)
@Check(`"proficiency_level" IN ('novice', 'beginner', 'intermediate', 'advanced', 'expert')`)
@Index('idx_skill_assessments_user_id', ['user_id'])
@Index('idx_skill_assessments_skill', ['skill_name'])
@Index('idx_skill_assessments_category', ['skill_category'], {
  where: 'skill_category IS NOT NULL',
})
@Index('idx_skill_assessments_level', ['proficiency_level'])
@Index('idx_skill_assessments_user_skill', ['user_id', 'skill_name', 'assessed_at'])
export class SkillAssessment {
  /**
   * Identificador único de la evaluación (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario evaluado
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * Nombre de la habilidad evaluada
   * @example 'lectura literal', 'inferencia', 'comprensión crítica'
   */
  @Column({ type: 'varchar', length: 100 })
  skill_name!: string;

  /**
   * Categoría de la habilidad
   * @example 'comprension_lectora', 'matematicas', 'ciencias'
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  skill_category?: string;

  /**
   * Puntuación numérica de la evaluación (0-100)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2 })
  assessment_score!: number;

  /**
   * Nivel de competencia alcanzado
   * @values 'novice', 'beginner', 'intermediate', 'advanced', 'expert'
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  proficiency_level?: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

  /**
   * Fecha y hora de la evaluación
   */
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  assessed_at!: Date;

  /**
   * ID del módulo que generó esta evaluación (opcional)
   */
  @Column({ type: 'uuid', nullable: true })
  assessed_by_module_id?: string;

  /**
   * Evidencia que respalda esta evaluación (JSONB)
   * @example {
   *   "exercises": ["ex1", "ex2"],
   *   "scores": [90, 85],
   *   "attempts": 2
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  evidence?: Record<string, any>;

  /**
   * Fecha y hora de creación
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
   * Usuario evaluado (cross-database, no @ManyToOne)
   * FK en DDL: skill_assessments.user_id → auth.users.id (ON DELETE CASCADE)
   * Para obtener el usuario: inyectar UserRepository desde 'auth' connection
   */

  /**
   * Módulo que generó la evaluación (opcional, cross-database, no @ManyToOne)
   * FK en DDL: skill_assessments.assessed_by_module_id → educational_content.modules.id (ON DELETE SET NULL)
   * NOTA: Nullable - No todas las evaluaciones están ligadas a un módulo específico
   * Para obtener el módulo: inyectar ModuleRepository desde 'educational' connection
   */
}
