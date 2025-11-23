import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';

/**
 * ScheduledMission Entity (progress_tracking.scheduled_missions)
 *
 * @description Misiones programadas para aulas específicas con fechas y bonificaciones
 * @schema progress_tracking
 * @table scheduled_missions
 *
 * IMPORTANTE:
 * - Permite a profesores programar misiones para sus aulas
 * - Incluye fechas de inicio/fin y bonificaciones opcionales
 * - Control de estado activo/inactivo
 * - Asociado a aulas específicas (classroom-based)
 *
 * @see DDL: apps/database/ddl/schemas/progress_tracking/tables/05-scheduled_missions.sql
 */
@Entity({ schema: DB_SCHEMAS.PROGRESS, name: DB_TABLES.PROGRESS.SCHEDULED_MISSIONS })
@Index('idx_scheduled_missions_mission', ['mission_id'])
@Index('idx_scheduled_missions_classroom', ['classroom_id'])
@Index('idx_scheduled_missions_scheduled_by', ['scheduled_by'])
@Index('idx_scheduled_missions_dates', ['starts_at', 'ends_at'])
@Index('idx_scheduled_missions_active', ['is_active', 'starts_at'])
@Index('idx_scheduled_missions_classroom_active', ['classroom_id', 'is_active'])
export class ScheduledMission {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  /**
   * ID de la misión programada (FK → gamification_system.missions)
   */
  @Column({ type: 'uuid' })
  mission_id!: string;

  /**
   * ID del aula donde se programa la misión (FK → social_features.classrooms)
   */
  @Column({ type: 'uuid' })
  classroom_id!: string;

  /**
   * Usuario (profesor) que programó la misión (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid' })
  scheduled_by!: string;

  // =====================================================
  // SCHEDULE DATES
  // =====================================================

  /**
   * Fecha y hora de inicio de la misión
   */
  @Column({ type: 'timestamp with time zone' })
  starts_at!: Date;

  /**
   * Fecha y hora de finalización de la misión
   */
  @Column({ type: 'timestamp with time zone' })
  ends_at!: Date;

  // =====================================================
  // STATE
  // =====================================================

  /**
   * Indica si la misión programada está activa
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  // =====================================================
  // BONUS REWARDS
  // =====================================================

  /**
   * Puntos de experiencia adicionales otorgados al completar
   */
  @Column({ type: 'integer', default: 0 })
  bonus_xp!: number;

  /**
   * ML Coins adicionales otorgadas al completar
   */
  @Column({ type: 'integer', default: 0 })
  bonus_coins!: number;

  // =====================================================
  // AUDIT
  // =====================================================

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;
}
