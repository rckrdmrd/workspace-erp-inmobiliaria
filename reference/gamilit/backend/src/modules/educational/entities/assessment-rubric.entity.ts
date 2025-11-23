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
 * AssessmentRubric Entity (educational_content.assessment_rubrics)
 *
 * @description Rúbricas de evaluación para ejercicios o módulos con criterios
 *              y escalas de puntuación. Relación polimórfica: cada rúbrica
 *              se asocia SOLO a un ejercicio O a un módulo, nunca a ambos.
 * @schema educational_content
 * @table assessment_rubrics
 *
 * IMPORTANTE:
 * - Relación polimórfica: exercise_id XOR module_id (exclusivo, nunca ambos)
 * - Criterios y escala de puntuación en formato JSONB
 * - Tipos: automatic, manual, hybrid, peer_review
 * - Peso porcentual: 1-100%
 *
 * @see DDL: apps/database/ddl/schemas/educational_content/tables/03-assessment_rubrics.sql
 */
@Entity({ schema: DB_SCHEMAS.EDUCATIONAL, name: DB_TABLES.EDUCATIONAL.ASSESSMENT_RUBRICS })
@Index('idx_rubrics_exercise_id', ['exercise_id'])
@Index('idx_rubrics_module_id', ['module_id'])
@Index('idx_rubrics_active', ['is_active'], { where: 'is_active = true' })
@Index('idx_rubrics_created_by', ['created_by'])
export class AssessmentRubric {
  /**
   * Identificador único de la rúbrica (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del ejercicio (FK → educational_content.exercises)
   * Parte de relación polimórfica con module_id (SOLO uno puede ser NOT NULL)
   */
  @Column({ type: 'uuid', nullable: true })
  exercise_id?: string;

  /**
   * ID del módulo (FK → educational_content.modules)
   * Parte de relación polimórfica con exercise_id (SOLO uno puede ser NOT NULL)
   */
  @Column({ type: 'uuid', nullable: true })
  module_id?: string;

  /**
   * Nombre de la rúbrica
   */
  @Column({ type: 'text' })
  name!: string;

  /**
   * Descripción de la rúbrica
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Tipo de evaluación
   * ENUM: automatic, manual, hybrid, peer_review
   */
  @Column({ type: 'text' })
  assessment_type!: string;

  /**
   * Criterios de evaluación en formato JSONB
   * Estructura: {"criteria_1": {"name": string, "levels": {}, "weight": number}}
   * Incluye niveles de logro con puntos y descripciones
   */
  @Column({ type: 'jsonb', default: {} })
  criteria: Record<string, any> = {};

  /**
   * Escala de puntuación en formato JSONB
   * Estructura: {"min": number, "max": number, "passing": number}
   */
  @Column({ type: 'jsonb', default: { min: 0, max: 100, passing: 70 } })
  scoring_scale!: Record<string, any>;

  /**
   * Peso porcentual de esta rúbrica en la evaluación total (1-100%)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 100 })
  weight_percentage!: number;

  /**
   * Si la rúbrica está activa y disponible
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Si se permite reenvío de ejercicios evaluados por esta rúbrica
   */
  @Column({ type: 'boolean', default: true })
  allow_resubmission!: boolean;

  /**
   * Plantilla de retroalimentación para estudiantes
   */
  @Column({ type: 'text', nullable: true })
  feedback_template?: string;

  /**
   * Si la retroalimentación automática está habilitada
   */
  @Column({ type: 'boolean', default: true })
  auto_feedback_enabled!: boolean;

  /**
   * Metadatos adicionales en formato JSON
   * Puede incluir configuraciones específicas de evaluación
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * ID del usuario que creó la rúbrica
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
