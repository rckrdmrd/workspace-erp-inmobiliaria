import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';

/**
 * LearningSession Entity (progress_tracking.learning_sessions)
 *
 * @description Sesiones de aprendizaje con tracking de tiempo y actividad
 * @schema progress_tracking
 * @table learning_sessions
 *
 * IMPORTANTE:
 * - Tracking detallado de sesiones individuales de aprendizaje
 * - Incluye métricas de tiempo activo, idle, engagement
 * - Captura información de dispositivo y navegador
 * - Soporta múltiples tipos: learning, practice, assessment, review
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/02-learning_sessions.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.LEARNING_SESSIONS })
@Index('idx_sessions_user', ['user_id'])
@Index('idx_sessions_module', ['module_id'])
@Index('idx_sessions_started', ['started_at'])
@Index('idx_sessions_active', ['is_active'])
export class LearningSession {
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
   * ID del tenant (FK → auth_management.tenants) - Nullable
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  /**
   * Token único de sesión
   */
  @Column({ type: 'text', unique: true, nullable: true })
  session_token?: string;

  // =====================================================
  // SESSION TYPE & CONTEXT
  // =====================================================

  /**
   * Tipo de sesión
   * Valores: learning, practice, assessment, review
   */
  @Column({ type: 'text', default: 'learning' })
  session_type!: string;

  /**
   * ID del módulo (FK → educational_content.modules) - Nullable
   */
  @Column({ type: 'uuid', nullable: true })
  module_id?: string;

  /**
   * ID del ejercicio (FK → educational_content.exercises) - Nullable
   */
  @Column({ type: 'uuid', nullable: true })
  exercise_id?: string;

  /**
   * ID del aula (FK → social_features.classrooms) - Nullable
   */
  @Column({ type: 'uuid', nullable: true })
  classroom_id?: string;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  /**
   * Fecha y hora de inicio de la sesión
   */
  @Column({ type: 'timestamp with time zone' })
  started_at!: Date;

  /**
   * Fecha y hora de fin de la sesión
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  ended_at?: Date;

  /**
   * Duración total de la sesión
   */
  @Column({ type: 'interval', nullable: true })
  duration?: string;

  /**
   * Tiempo activo (usuario interactuando)
   */
  @Column({ type: 'interval', nullable: true })
  active_time?: string;

  /**
   * Tiempo inactivo/idle
   */
  @Column({ type: 'interval', nullable: true })
  idle_time?: string;

  // =====================================================
  // ACTIVITY METRICS
  // =====================================================

  /**
   * Cantidad de ejercicios intentados en la sesión
   */
  @Column({ type: 'integer', default: 0 })
  exercises_attempted!: number;

  /**
   * Cantidad de ejercicios completados en la sesión
   */
  @Column({ type: 'integer', default: 0 })
  exercises_completed!: number;

  /**
   * Cantidad de contenido visualizado
   */
  @Column({ type: 'integer', default: 0 })
  content_viewed!: number;

  // =====================================================
  // PERFORMANCE METRICS
  // =====================================================

  /**
   * Suma total de puntos en la sesión
   */
  @Column({ type: 'integer', default: 0 })
  total_score!: number;

  /**
   * Total de XP ganada en la sesión
   */
  @Column({ type: 'integer', default: 0 })
  total_xp_earned!: number;

  /**
   * Total de ML Coins ganadas en la sesión
   */
  @Column({ type: 'integer', default: 0 })
  total_ml_coins_earned!: number;

  // =====================================================
  // INTERACTION METRICS
  // =====================================================

  /**
   * Cantidad de clicks/interacciones
   */
  @Column({ type: 'integer', default: 0 })
  clicks_count!: number;

  /**
   * Cantidad de vistas de página
   */
  @Column({ type: 'integer', default: 0 })
  page_views!: number;

  /**
   * Cantidad de recursos descargados
   */
  @Column({ type: 'integer', default: 0 })
  resource_downloads!: number;

  // =====================================================
  // DEVICE & BROWSER INFO
  // =====================================================

  /**
   * Información del dispositivo (JSONB)
   * Ejemplo: { type: 'mobile', os: 'iOS', model: 'iPhone 12' }
   */
  @Column({ type: 'jsonb', default: {} })
  device_info: Record<string, any> = {};

  /**
   * Información del navegador (JSONB)
   * Ejemplo: { name: 'Chrome', version: '96.0.4664.110' }
   */
  @Column({ type: 'jsonb', default: {} })
  browser_info!: Record<string, any>;

  /**
   * Calidad de conexión
   * Valores: excellent, good, fair, poor
   */
  @Column({ type: 'text', nullable: true })
  connection_quality?: string;

  // =====================================================
  // ERROR TRACKING
  // =====================================================

  /**
   * Cantidad de errores encontrados en la sesión
   */
  @Column({ type: 'integer', default: 0 })
  errors_encountered: number = 0;

  // =====================================================
  // SESSION STATE
  // =====================================================

  /**
   * Indica si la sesión está activa
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Estado de completitud de la sesión
   * Valores: ongoing, completed, abandoned, timed_out
   */
  @Column({ type: 'text', default: 'ongoing' })
  completion_status: string = 'ongoing';

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
}
