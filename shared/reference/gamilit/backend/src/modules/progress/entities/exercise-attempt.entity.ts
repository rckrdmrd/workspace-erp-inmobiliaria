import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';

/**
 * ExerciseAttempt Entity (progress_tracking.exercise_attempts)
 *
 * @description Intentos de ejercicios con respuestas, puntajes y uso de comodines
 * @schema progress_tracking
 * @table exercise_attempts
 *
 * IMPORTANTE:
 * - Captura cada intento individual de un ejercicio (múltiples intentos permitidos)
 * - Incluye respuestas del estudiante, scores, tiempo invertido
 * - Tracking de hints y comodines utilizados
 * - Dispara triggers para actualizar user_stats al completar
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/03-exercise_attempts.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.EXERCISE_ATTEMPTS })
@Index('idx_exercise_attempts_user', ['user_id'])
@Index('idx_exercise_attempts_exercise', ['exercise_id'])
@Index('idx_exercise_attempts_user_exercise', ['user_id', 'exercise_id'])
@Index('idx_exercise_attempts_user_exercise_date', ['user_id', 'exercise_id', 'submitted_at'])
@Index('idx_exercise_attempts_submitted', ['submitted_at'])
export class ExerciseAttempt {
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

  /**
   * Número de intento (1, 2, 3, ...)
   */
  @Column({ type: 'integer', default: 1 })
  attempt_number!: number;

  // =====================================================
  // ANSWER DATA
  // =====================================================

  /**
   * Respuestas enviadas por el estudiante (JSONB)
   * Estructura varía según tipo de ejercicio
   */
  @Column({ type: 'jsonb' })
  submitted_answers!: Record<string, any>;

  // =====================================================
  // RESULTS & SCORING
  // =====================================================

  /**
   * Indica si la respuesta fue correcta
   */
  @Column({ type: 'boolean', nullable: true })
  is_correct?: boolean;

  /**
   * Puntaje obtenido en el intento
   */
  @Column({ type: 'integer', nullable: true })
  score?: number;

  /**
   * Tiempo invertido en el intento (segundos)
   */
  @Column({ type: 'integer', nullable: true })
  time_spent_seconds?: number;

  // =====================================================
  // HINTS & COMODINES
  // =====================================================

  /**
   * Cantidad de hints/pistas utilizadas
   */
  @Column({ type: 'integer', default: 0 })
  hints_used!: number;

  /**
   * Comodines utilizados en el intento (JSONB array)
   * Ejemplo: ["pistas", "vision_lectora", "segunda_oportunidad"]
   */
  @Column({ type: 'jsonb', default: [] })
  comodines_used!: string[];

  // =====================================================
  // REWARDS
  // =====================================================

  /**
   * XP ganada en este intento
   */
  @Column({ type: 'integer', default: 0 })
  xp_earned!: number;

  /**
   * ML Coins ganadas en este intento
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_earned!: number;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de envío del intento
   */
  @Column({ type: 'timestamp with time zone' })
  submitted_at!: Date;

  // =====================================================
  // METADATA
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   * Incluye: browser, device_type, response_pattern
   */
  @Column({
    type: 'jsonb',
    default: { browser: null, device_type: null, response_pattern: [] },
  })
  metadata!: Record<string, any>;
}
