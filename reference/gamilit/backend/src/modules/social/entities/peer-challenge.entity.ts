import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES, DifficultyLevelEnum } from '@shared/constants';

/**
 * PeerChallenge Entity (social_features.peer_challenges)
 *
 * @description Desafíos peer-to-peer entre estudiantes para competir en ejercicios.
 * @schema social_features
 * @table peer_challenges
 *
 * IMPORTANTE:
 * - Soporta múltiples tipos: head_to_head, multiplayer, tournament, leaderboard
 * - Estados: open, full, in_progress, completed, cancelled, expired
 * - Sistema de recompensas con bonus para ganadores
 * - Timing configurable con límites de tiempo
 * - Soporte para espectadores y aprobación de participantes
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/11-peer_challenges.sql
 * @see Epic: EXT-009 - docs/03-fase-extensiones/EXT-009-peer-challenges/
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.PEER_CHALLENGES })
@Index('idx_peer_challenges_creator', ['created_by'])
@Index('idx_peer_challenges_module', ['module_id'])
@Index('idx_peer_challenges_exercise', ['exercise_id'])
@Index('idx_peer_challenges_status', ['status'])
@Index('idx_peer_challenges_type', ['challenge_type'])
@Index('idx_peer_challenges_open', ['status', 'is_public', 'created_at'], {
  where: "status IN ('open', 'in_progress')",
})
@Index('idx_peer_challenges_timing', ['start_time', 'end_time'])
@Index('idx_peer_challenges_created_at', ['created_at'])
@Check(
  `"challenge_type" IN ('head_to_head', 'multiplayer', 'tournament', 'leaderboard')`,
)
@Check(
  `"status" IN ('open', 'full', 'in_progress', 'completed', 'cancelled', 'expired')`,
)
export class PeerChallenge {
  /**
   * Identificador único del desafío (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Tipo de desafío
   * - head_to_head: 1v1 directo
   * - multiplayer: Múltiples participantes
   * - tournament: Torneo eliminatorio
   * - leaderboard: Competencia por ranking
   */
  @Column({ type: 'text' })
  challenge_type!: 'head_to_head' | 'multiplayer' | 'tournament' | 'leaderboard';

  /**
   * ID del creador del desafío
   */
  @Column({ type: 'uuid' })
  created_by!: string;

  /**
   * ID del módulo (opcional)
   */
  @Column({ type: 'uuid', nullable: true })
  module_id?: string;

  /**
   * ID del ejercicio (opcional)
   */
  @Column({ type: 'uuid', nullable: true })
  exercise_id?: string;

  /**
   * Título del desafío
   */
  @Column({ type: 'text' })
  title!: string;

  /**
   * Descripción del desafío
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Nivel de dificultad
   */
  @Column({ type: 'enum', enum: DifficultyLevelEnum, nullable: true })
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Máximo de participantes permitidos
   */
  @Column({ type: 'integer', default: 2 })
  max_participants!: number;

  /**
   * Mínimo de participantes para iniciar
   */
  @Column({ type: 'integer', default: 2 })
  min_participants!: number;

  /**
   * Contador de participantes actuales
   */
  @Column({ type: 'integer', default: 1 })
  current_participants!: number;

  /**
   * Fecha y hora de inicio del desafío
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  start_time?: Date;

  /**
   * Fecha y hora de fin del desafío
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  end_time?: Date;

  /**
   * Límite de tiempo en minutos por participante
   */
  @Column({ type: 'integer', nullable: true })
  time_limit_minutes?: number;

  /**
   * Estado del desafío
   * - open: Abierto para unirse
   * - full: Lleno (max participants)
   * - in_progress: En curso
   * - completed: Terminado
   * - cancelled: Cancelado
   * - expired: Expirado sin completarse
   */
  @Column({ type: 'text', default: 'open' })
  status!: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

  /**
   * Recompensas del desafío en formato JSONB
   * @example { "xp": 100, "ml_coins": 50, "achievement_id": "uuid" }
   */
  @Column({ type: 'jsonb', default: {} })
  rewards!: Record<string, any>;

  /**
   * Multiplicador de bonus para el ganador
   * @default 1.5 (150% de las recompensas)
   */
  @Column({ type: 'numeric', precision: 3, scale: 2, default: 1.5 })
  winner_bonus_multiplier!: number;

  /**
   * Permite espectadores
   */
  @Column({ type: 'boolean', default: true })
  allow_spectators!: boolean;

  /**
   * Visible en lista pública de desafíos
   */
  @Column({ type: 'boolean', default: true })
  is_public!: boolean;

  /**
   * Requiere aprobación del creador para unirse
   */
  @Column({ type: 'boolean', default: false })
  requires_approval!: boolean;

  /**
   * Reglas personalizadas en formato JSONB
   */
  @Column({ type: 'jsonb', default: {} })
  custom_rules!: Record<string, any>;

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
   * Fecha y hora de inicio real (cuando comenzó)
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  started_at?: Date;

  /**
   * Fecha y hora de finalización
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  completed_at?: Date;

  /**
   * Metadatos adicionales en formato JSONB
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * NOTA IMPORTANTE: Las relaciones a Profile, Module y Exercise no se pueden
   * definir con @ManyToOne porque cruzan diferentes data sources:
   * - created_by: social → auth (Profile)
   * - module_id: social → educational (Module)
   * - exercise_id: social → educational (Exercise)
   *
   * TypeORM no soporta relaciones cross-database.
   *
   * En su lugar, usamos los campos UUID (created_by, module_id, exercise_id)
   * y hacemos joins manuales en los services cuando sea necesario.
   *
   * FK en DDL:
   * - peer_challenges.created_by → auth_management.profiles.id (ON DELETE CASCADE)
   * - peer_challenges.module_id → educational_content.modules.id (ON DELETE SET NULL)
   * - peer_challenges.exercise_id → educational_content.exercises.id (ON DELETE SET NULL)
   *
   * Para obtener datos relacionados:
   * - Inyectar ProfileRepository desde 'auth' connection
   * - Inyectar ModuleRepository desde 'educational' connection
   * - Inyectar ExerciseRepository desde 'educational' connection
   * - Hacer queries manuales en el service
   */
}
