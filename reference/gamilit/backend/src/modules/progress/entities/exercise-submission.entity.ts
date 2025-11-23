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
 * ExerciseSubmission Entity (progress_tracking.exercise_submissions)
 *
 * @description Student exercise submissions and attempts
 * @schema progress_tracking
 * @table exercise_submissions
 *
 * IMPORTANTE:
 * - Registro final de envío de ejercicio (uno por completación)
 * - Diferente de ExerciseAttempt (puede haber múltiples intentos por submission)
 * - Incluye respuesta, feedback, scoring, y comodines utilizados
 * - Soporta estados: draft, submitted, graded, reviewed
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/04-exercise_submissions.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.EXERCISE_SUBMISSIONS })
@Index('idx_exercise_submissions_user_id', ['user_id'])
@Index('idx_exercise_submissions_exercise_id', ['exercise_id'])
@Index('idx_exercise_submissions_user_exercise', ['user_id', 'exercise_id'])
@Index('idx_exercise_submissions_submitted_at', ['submitted_at'])
@Index('idx_exercise_submissions_status', ['status'])
export class ExerciseSubmission {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  /**
   * ID del usuario (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * ID del ejercicio (FK → educational_content.exercises)
   */
  @Column({ type: 'uuid' })
  exercise_id!: string;

  // =====================================================
  // ANSWER DATA
  // =====================================================

  /**
   * Respuesta del estudiante en formato JSON
   * Estructura varía según tipo de ejercicio
   */
  @Column({ type: 'jsonb' })
  answer_data!: Record<string, any>;

  // =====================================================
  // RESULTS & SCORING
  // =====================================================

  /**
   * Indica si la respuesta fue correcta
   */
  @Column({ type: 'boolean', nullable: true })
  is_correct?: boolean;

  /**
   * Puntaje obtenido (0-max_score)
   */
  @Column({ type: 'integer', default: 0 })
  score!: number;

  /**
   * Puntaje máximo posible
   */
  @Column({ type: 'integer', default: 100 })
  max_score!: number;

  /**
   * Retroalimentación del sistema o profesor
   */
  @Column({ type: 'text', nullable: true })
  feedback?: string;

  // =====================================================
  // HINTS & COMODINES
  // =====================================================

  /**
   * Indica si se usó hint
   */
  @Column({ type: 'boolean', default: false })
  hint_used!: boolean;

  /**
   * Cantidad de hints utilizados
   */
  @Column({ type: 'integer', default: 0 })
  hints_count!: number;

  /**
   * Array de comodines usados
   * Tipos: pistas, vision_lectora, segunda_oportunidad
   */
  @Column({ type: 'text', array: true, nullable: true })
  comodines_used?: string[];

  /**
   * ML Coins gastadas en comodines
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_spent!: number;

  // =====================================================
  // TIME & ATTEMPT TRACKING
  // =====================================================

  /**
   * Tiempo invertido en segundos
   */
  @Column({ type: 'integer', nullable: true })
  time_spent_seconds?: number;

  /**
   * Número de intento (1, 2, 3, ...)
   */
  @Column({ type: 'integer', default: 1 })
  attempt_number!: number;

  // =====================================================
  // STATUS & WORKFLOW
  // =====================================================

  /**
   * Estado de la sumisión
   * Valores: draft, submitted, graded, reviewed
   */
  @Column({ type: 'text', default: 'submitted' })
  status!: string;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de inicio del ejercicio
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  started_at?: Date;

  /**
   * Fecha y hora de envío de la sumisión
   */
  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  submitted_at!: Date;

  /**
   * Fecha y hora de calificación
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  graded_at?: Date;

  // =====================================================
  // METADATA & AUDIT
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
