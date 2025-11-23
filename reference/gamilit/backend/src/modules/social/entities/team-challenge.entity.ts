import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { TeamChallengeStatusEnum } from '@shared/constants/enums.constants';

/**
 * TeamChallenge Entity (social_features.team_challenges)
 *
 * @description Desafíos asignados a equipos
 * @schema social_features
 * @table team_challenges
 *
 * IMPORTANTE:
 * - Relación entre equipos y desafíos/challenges
 * - UNIQUE constraint: (team_id, challenge_id) - un equipo por desafío
 * - Estados: active, in_progress, completed, failed, cancelled
 * - Tracking de score, fechas de inicio y completación
 * - Note: El DDL actual tiene challenge_id referenciando una tabla de challenges
 *   que aún no existe en el esquema. Probablemente se vincula a ejercicios o módulos.
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/07-team_challenges.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.TEAM_CHALLENGES })
@Index('idx_team_challenges_team_id', ['team_id'])
@Index('idx_team_challenges_challenge_id', ['challenge_id'])
@Index('idx_team_challenges_status', ['status'])
@Unique('team_challenges_team_id_challenge_id_key', ['team_id', 'challenge_id'])
export class TeamChallenge {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  /**
   * ID del equipo (FK → social_features.teams)
   * UNIQUE con challenge_id: Cada equipo puede participar una vez por desafío
   */
  @Column({ type: 'uuid' })
  team_id!: string;

  /**
   * ID del desafío/challenge
   * Note: FK reference a tabla de challenges (aún no definida en DDL)
   * Puede ser: educational_content.exercises, módulos, misiones, etc.
   */
  @Column({ type: 'uuid' })
  challenge_id!: string;

  // =====================================================
  // STATUS & STATE
  // =====================================================

  /**
   * Estado del desafío
   * Valores: active, in_progress, completed, failed, cancelled
   */
  @Column({
    type: 'varchar',
    length: 20,
    default: TeamChallengeStatusEnum.ACTIVE,
  })
  status!: string;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de inicio del desafío
   */
  @Column({ type: 'timestamp with time zone' })
  started_at!: Date;

  /**
   * Fecha y hora de completación del desafío
   * NULL = aún no completado
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  completed_at?: Date;

  // =====================================================
  // SCORE & PERFORMANCE
  // =====================================================

  /**
   * Puntuación obtenida en el desafío
   */
  @Column({ type: 'integer', default: 0 })
  score!: number;
}
