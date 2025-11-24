import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';

/**
 * Mission Type Enum
 * @description Tipos de misiones disponibles
 */
export enum MissionTypeEnum {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SPECIAL = 'special',
}

/**
 * Mission Status Enum
 * @description Estados del ciclo de vida de una misión
 */
export enum MissionStatusEnum {
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CLAIMED = 'claimed',
  EXPIRED = 'expired',
}

/**
 * Mission Objectives Schema
 * @description Estructura de objetivos de la misión
 */
export interface MissionObjective {
  type: string;
  target: number;
  current: number;
  description?: string;
}

/**
 * Mission Rewards Schema
 * @description Estructura de recompensas de la misión
 */
export interface MissionRewards {
  ml_coins?: number;
  xp?: number;
  items?: Array<{
    type: string;
    quantity: number;
  }>;
}

/**
 * Mission Entity
 *
 * @description Misiones/quests de usuario con objetivos y recompensas
 * @table gamification_system.missions
 * @fields 15 campos según DDL
 *
 * Características:
 * - Misiones diarias, semanales y especiales
 * - Múltiples objetivos con tracking
 * - Sistema de recompensas flexible
 * - Progreso en porcentaje (0-100)
 * - Control de fechas (inicio, fin, completado, reclamado)
 *
 * Validaciones críticas:
 * - end_date debe ser futuro
 * - progress entre 0 y 100
 * - mission_type en lista permitida
 * - status en lista permitida
 *
 * @see DDL: /apps/database/ddl/schemas/gamification_system/tables/06-missions.sql
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.MISSIONS })
@Index('idx_missions_user_id', ['user_id'])
@Index('idx_missions_type', ['mission_type'])
@Index('idx_missions_status', ['status'])
@Index('idx_missions_template_id', ['template_id'])
@Index('idx_missions_end_date', ['end_date'])
@Index('idx_missions_user_type_status', ['user_id', 'mission_type', 'status'])
@Check(`"progress" >= 0 AND "progress" <= 100`)
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'text' })
  template_id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: MissionTypeEnum,
  })
  mission_type!: MissionTypeEnum;

  @Column({ type: 'jsonb' })
  objectives!: MissionObjective[];

  @Column({ type: 'jsonb' })
  rewards!: MissionRewards;

  @Column({
    type: 'enum',
    enum: MissionStatusEnum,
    default: MissionStatusEnum.ACTIVE,
  })
  status!: MissionStatusEnum;

  @Column({ type: 'float', default: 0 })
  progress!: number;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  start_date!: Date;

  @Column({ type: 'timestamp with time zone' })
  end_date!: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  completed_at!: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  claimed_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // Relación a auth_management.profiles (FK)
  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user?: Profile;
}
