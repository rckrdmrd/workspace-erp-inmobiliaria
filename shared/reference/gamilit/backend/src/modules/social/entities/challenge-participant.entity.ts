import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';
import { PeerChallenge } from './peer-challenge.entity';

/**
 * ChallengeParticipant Entity (social_features.challenge_participants)
 *
 * @description Participantes de peer challenges con progreso individual y rankings.
 * @schema social_features
 * @table challenge_participants
 *
 * IMPORTANTE:
 * - Una fila por usuario por desafío (UNIQUE constraint)
 * - Estados: invited, accepted, in_progress, completed, forfeit, disqualified
 * - Tracking de score, accuracy, completion percentage
 * - Sistema de ranking con winners
 * - Recompensas de XP y ML Coins
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/12-challenge_participants.sql
 * @see Epic: EXT-009 - docs/03-fase-extensiones/EXT-009-peer-challenges/
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.CHALLENGE_PARTICIPANTS })
@Unique(['challenge_id', 'user_id'])
@Index('idx_challenge_participants_challenge', ['challenge_id'])
@Index('idx_challenge_participants_user', ['user_id'])
@Index('idx_challenge_participants_status', ['participation_status'])
@Index('idx_challenge_participants_score', ['challenge_id', 'score'])
@Index('idx_challenge_participants_rank', ['challenge_id', 'rank'])
@Index('idx_challenge_participants_winner', ['challenge_id', 'is_winner'], {
  where: 'is_winner = true',
})
@Index('idx_challenge_participants_user_challenges', ['user_id', 'created_at'])
@Check(
  `"participation_status" IN ('invited', 'accepted', 'in_progress', 'completed', 'forfeit', 'disqualified')`,
)
export class ChallengeParticipant {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del desafío
   */
  @Column({ type: 'uuid' })
  challenge_id!: string;

  /**
   * ID del usuario participante
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * Estado de participación
   * - invited: Invitado pero no aceptado
   * - accepted: Aceptó el desafío
   * - in_progress: Completando el desafío
   * - completed: Terminó el desafío
   * - forfeit: Se rindió
   * - disqualified: Descalificado
   */
  @Column({ type: 'text', default: 'invited' })
  participation_status!: 'invited' | 'accepted' | 'in_progress' | 'completed' | 'forfeit' | 'disqualified';

  /**
   * Puntuación obtenida en el desafío
   */
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  score!: number;

  /**
   * Porcentaje de precisión (0-100)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  accuracy_percentage?: number;

  /**
   * Porcentaje de completitud (0-100)
   */
  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  completion_percentage!: number;

  /**
   * Número de ejercicios completados
   */
  @Column({ type: 'integer', default: 0 })
  exercises_completed!: number;

  /**
   * Fecha y hora de inicio
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  started_at?: Date;

  /**
   * Fecha y hora de finalización
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  completed_at?: Date;

  /**
   * Tiempo total invertido en segundos
   */
  @Column({ type: 'integer', nullable: true })
  time_spent_seconds?: number;

  /**
   * Posición final en el ranking (1 = ganador)
   */
  @Column({ type: 'integer', nullable: true })
  rank?: number;

  /**
   * Indica si es el ganador del desafío
   */
  @Column({ type: 'boolean', default: false })
  is_winner!: boolean;

  /**
   * XP ganado en el desafío
   */
  @Column({ type: 'integer', default: 0 })
  xp_earned!: number;

  /**
   * ML Coins ganados en el desafío
   */
  @Column({ type: 'integer', default: 0 })
  ml_coins_earned!: number;

  /**
   * Indica si las recompensas fueron reclamadas
   */
  @Column({ type: 'boolean', default: false })
  rewards_claimed!: boolean;

  /**
   * ID del intento de ejercicio asociado (si aplica)
   */
  @Column({ type: 'uuid', nullable: true })
  attempt_id?: string;

  /**
   * Fecha y hora de invitación
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  invited_at?: Date;

  /**
   * Fecha y hora de aceptación
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  accepted_at?: Date;

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

  /**
   * Metadatos adicionales en formato JSONB
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * NOTA IMPORTANTE:
   * - challenge → PeerChallenge: Relación INTERNA (social → social) ✅ PUEDE usar @ManyToOne
   * - user → Profile: Relación CROSS-DATABASE (social → auth) ❌ NO PUEDE usar @ManyToOne
   *
   * TypeORM solo soporta relaciones dentro del mismo data source.
   *
   * FK en DDL:
   * - challenge_participants.challenge_id → social_features.peer_challenges.id (ON DELETE CASCADE)
   * - challenge_participants.user_id → auth_management.profiles.id (ON DELETE CASCADE)
   */

  /**
   * Desafío asociado (relación interna en mismo schema)
   * Relación ManyToOne: Muchos participantes pueden pertenecer a un desafío
   * FK: challenge_participants.challenge_id → social_features.peer_challenges.id
   */
  @ManyToOne(() => PeerChallenge, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challenge_id', referencedColumnName: 'id' })
  challenge?: PeerChallenge;

  /**
   * Usuario participante (relación cross-database, NO usar @ManyToOne)
   * Para obtener datos del usuario:
   * - Inyectar ProfileRepository desde 'auth' connection en el service
   * - Hacer query manual: profileRepository.findOne({ where: { id: participant.user_id } })
   */
}
