import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { TeamMemberRoleEnum } from '@shared/constants/enums.constants';

/**
 * TeamMember Entity (social_features.team_members)
 *
 * @description Miembros de equipos colaborativos - relación many-to-many
 * @schema social_features
 * @table team_members
 *
 * IMPORTANTE:
 * - Relación many-to-many entre teams y users
 * - UNIQUE constraint: (team_id, user_id) - un usuario por equipo
 * - Roles: owner (propietario), admin (administrador), member (miembro)
 * - left_at: NULL = miembro activo, NOT NULL = miembro retirado
 * - Índice especial: idx_team_members_active (WHERE left_at IS NULL)
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/06-team_members.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.TEAM_MEMBERS })
@Index('idx_team_members_team_id', ['team_id'])
@Index('idx_team_members_user_id', ['user_id'])
@Index('idx_team_members_active', ['team_id', 'user_id'], {
  where: 'left_at IS NULL',
})
@Unique('team_members_team_id_user_id_key', ['team_id', 'user_id'])
export class TeamMember {
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
   * UNIQUE con user_id: Cada usuario aparece una vez por equipo
   */
  @Column({ type: 'uuid' })
  team_id!: string;

  /**
   * ID del usuario miembro (FK → auth.users)
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  // =====================================================
  // ROLE & PERMISSIONS
  // =====================================================

  /**
   * Rol del miembro en el equipo
   * Valores: owner, admin, member
   */
  @Column({
    type: 'varchar',
    length: 20,
    default: TeamMemberRoleEnum.MEMBER,
  })
  role!: string;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de ingreso al equipo
   */
  @Column({ type: 'timestamp with time zone' })
  joined_at!: Date;

  /**
   * Fecha y hora de salida del equipo
   * NULL = miembro activo
   * NOT NULL = miembro retirado
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  left_at?: Date;
}
