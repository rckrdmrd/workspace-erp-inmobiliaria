import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { ProgressStatusEnum } from '@shared/constants/enums.constants';

/**
 * ModuleProgress Entity (progress_tracking.module_progress)
 *
 * @description Progreso del estudiante por módulo - tracking completo de avance
 * @schema progress_tracking
 * @table module_progress
 *
 * IMPORTANTE:
 * - Tracking completo de progreso en módulos educativos
 * - Incluye estadísticas de ejercicios, tiempo, scores y recursos pedagógicos
 * - Relación 1:1 con (user_id, module_id) - UNIQUE constraint
 * - Soporta modalidades: aula, asignaciones, autoestudio
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/01-module_progress.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.MODULE_PROGRESS })
@Index('idx_module_progress_user', ['user_id'])
@Index('idx_module_progress_module', ['module_id'])
@Index('idx_module_progress_status', ['status'])
@Index('idx_module_progress_classroom', ['classroom_id'])
@Index('idx_module_progress_user_status_updated', ['user_id', 'status', 'updated_at'])
export class ModuleProgress {
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
   * UNIQUE con module_id: Cada usuario tiene un único progreso por módulo
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * ID del módulo educativo (FK → educational_content.modules)
   */
  @Column({ type: 'uuid' })
  module_id!: string;

  // =====================================================
  // PROGRESS TRACKING
  // =====================================================

  /**
   * Estado actual del progreso
   *
   * @see DDL: progress_tracking.module_progress.status (progress_tracking.progress_status ENUM)
   * @see Enum: ProgressStatusEnum
   * @version 1.0 (2025-11-08) - Migrado de public a progress_tracking schema
   *
   * VALORES: not_started, in_progress, completed, reviewed, mastered
   * FLUJO: not_started → in_progress → completed → reviewed → mastered
   */
  @Column({
    type: 'enum',
    enum: ProgressStatusEnum,
    enumName: 'progress_status',
    default: ProgressStatusEnum.NOT_STARTED,
  })
  status!: ProgressStatusEnum;

  /**
   * Porcentaje de progreso (0-100)
   */
  @Column({ type: 'integer', default: 0 })
  progress_percentage!: number;

  // =====================================================
  // EXERCISE METRICS
  // =====================================================

  /**
   * Cantidad de ejercicios completados en el módulo
   */
  @Column({ type: 'integer', default: 0 })
  completed_exercises!: number;

  /**
   * Cantidad total de ejercicios en el módulo
   */
  @Column({ type: 'integer', default: 0 })
  total_exercises!: number;

  /**
   * Cantidad de ejercicios omitidos/saltados
   */
  @Column({ type: 'integer', default: 0 })
  skipped_exercises!: number;

  // =====================================================
  // SCORE METRICS
  // =====================================================

  /**
   * Suma total de puntos obtenidos
   */
  @Column({ type: 'integer', default: 0 })
  total_score!: number;

  /**
   * Máximo puntaje posible en el módulo
   */
  @Column({ type: 'integer', nullable: true })
  max_possible_score?: number;

  /**
   * Promedio de scores (0-100)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  average_score?: number;

  /**
   * Mejor score obtenido en un ejercicio
   */
  @Column({ type: 'integer', nullable: true })
  best_score?: number;

  // =====================================================
  // GAMIFICATION REWARDS
  // =====================================================

  /**
   * XP total ganada en este módulo
   */
  @Column({ type: 'integer', default: 0 })
  total_xp_earned!: number;

  /**
   * ML Coins totales ganadas en este módulo
   */
  @Column({ type: 'integer', default: 0 })
  total_ml_coins_earned!: number;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  /**
   * Tiempo total invertido en el módulo
   */
  @Column({ type: 'interval', default: '00:00:00' })
  time_spent!: string;

  /**
   * Cantidad de sesiones de aprendizaje
   */
  @Column({ type: 'integer', default: 0 })
  sessions_count!: number;

  /**
   * Cantidad total de intentos en ejercicios
   */
  @Column({ type: 'integer', default: 0 })
  attempts_count!: number;

  // =====================================================
  // COMODINES (POWER-UPS)
  // =====================================================

  /**
   * Total de hints/pistas utilizadas
   */
  @Column({ type: 'integer', default: 0 })
  hints_used_total!: number;

  /**
   * Total de comodines usados
   */
  @Column({ type: 'integer', default: 0 })
  comodines_used_total!: number;

  /**
   * Costo total en ML Coins de comodines usados
   */
  @Column({ type: 'integer', default: 0 })
  comodines_cost_total!: number;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de inicio del módulo
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  started_at?: Date;

  /**
   * Fecha y hora de completación del módulo
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  completed_at?: Date;

  /**
   * Fecha y hora del último acceso
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  last_accessed_at?: Date;

  /**
   * Fecha límite de entrega (para asignaciones)
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  deadline?: Date;

  // =====================================================
  // CLASSROOM CONTEXT
  // =====================================================

  /**
   * ID del aula (FK → social_features.classrooms) - Nullable
   */
  @Column({ type: 'uuid', nullable: true })
  classroom_id?: string;

  /**
   * ID de la asignación (FK → assignments) - Nullable
   */
  @Column({ type: 'uuid', nullable: true })
  assignment_id?: string;

  // =====================================================
  // MODULE CONFIGURATION
  // =====================================================

  /**
   * Permitir reintentos de ejercicios
   */
  @Column({ type: 'boolean', default: true })
  allow_retry!: boolean;

  /**
   * Requiere completar ejercicios secuencialmente
   */
  @Column({ type: 'boolean', default: false })
  sequential_completion!: boolean;

  /**
   * Dificultad adaptativa habilitada
   */
  @Column({ type: 'boolean', default: false })
  adaptive_difficulty!: boolean;

  // =====================================================
  // LEARNING ANALYTICS
  // =====================================================

  /**
   * Ruta de aprendizaje personalizada (JSONB array)
   */
  @Column({ type: 'jsonb', default: [] })
  learning_path!: any[];

  /**
   * Analíticas de rendimiento (JSONB)
   */
  @Column({ type: 'jsonb', default: {} })
  performance_analytics!: Record<string, any>;

  /**
   * Observaciones del sistema (JSONB)
   */
  @Column({ type: 'jsonb', default: {} })
  system_observations: Record<string, any> = {};

  // =====================================================
  // NOTES & FEEDBACK
  // =====================================================

  /**
   * Notas del estudiante
   */
  @Column({ type: 'text', nullable: true })
  student_notes?: string;

  /**
   * Notas del profesor
   */
  @Column({ type: 'text', nullable: true })
  teacher_notes?: string;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

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
