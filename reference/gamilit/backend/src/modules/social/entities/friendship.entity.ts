import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { FriendshipStatusEnum } from '@shared/constants/enums.constants';

/**
 * Friendship Entity (social_features.friendships)
 *
 * @description Relaciones de amistad entre usuarios - tracking de conexiones sociales
 * @schema social_features
 * @table friendships
 *
 * IMPORTANTE:
 * - Gestiona relaciones de amistad entre usuarios del sistema
 * - Estados: pending (pendiente), accepted (aceptada), rejected (rechazada), blocked (bloqueada)
 * - UNIQUE constraint: (user_id, friend_id) - previene duplicados
 * - CHECK constraint: user_id <> friend_id - previene auto-amistad
 * - Bidirectional: Requiere crear relación inversa para amistad aceptada
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/01-friendships.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.FRIENDSHIPS })
@Index('idx_friendships_user_id', ['user_id'])
@Index('idx_friendships_friend_id', ['friend_id'])
@Index('idx_friendships_status', ['status'])
@Unique('friendships_user_id_friend_id_key', ['user_id', 'friend_id'])
export class Friendship {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  /**
   * ID del usuario que solicita o tiene la amistad (FK → auth.users)
   * UNIQUE con friend_id: Previene solicitudes duplicadas
   * CHECK: user_id <> friend_id (no puede ser amigo de sí mismo)
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * ID del amigo (usuario receptor de la solicitud) (FK → auth.users)
   */
  @Column({ type: 'uuid' })
  friend_id!: string;

  // =====================================================
  // STATUS & STATE
  // =====================================================

  /**
   * Estado de la amistad
   * Valores: pending, accepted, rejected, blocked
   */
  @Column({
    type: 'varchar',
    length: 20,
    default: FriendshipStatusEnum.PENDING,
  })
  status!: string;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de creación de la solicitud de amistad
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización (cambio de estado)
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
