import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';

/**
 * Team Entity (social_features.teams)
 *
 * @description Equipos colaborativos de estudiantes
 * @schema social_features
 * @table teams
 *
 * IMPORTANTE:
 * - Equipos para colaboración y competencia entre estudiantes
 * - Puede estar vinculado a un aula (classroom_id) o ser independiente
 * - team_code: Código único de invitación al equipo
 * - Soporta creador, líder, y configuración de membresía
 * - Tracking de XP, ML Coins, módulos completados, achievements
 * - Gamificación: badges, colores personalizados, avatar, banner
 * - RLS (Row Level Security): row level security enabled
 *
 * TERMINOLOGÍA:
 * - Esta entidad usa "Team" en lugar de "Guild" (decisión arquitectural)
 * - Documentación legacy puede referirse a "Guild" - ambos términos son equivalentes
 * - @see ADR: docs/ADR-TEAM-VS-GUILD.md para justificación completa
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/05-teams.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.TEAMS })
@Index('idx_teams_classroom', ['classroom_id'])
@Index('idx_teams_leader', ['leader_id'])
@Index('idx_teams_xp', ['total_xp']) // DESC in DDL
@Index('idx_teams_active', ['is_active'], { where: 'is_active = true' })
@Index('idx_teams_classroom_active_xp', ['classroom_id', 'is_active', 'total_xp'], {
  where: 'is_active = true',
})
export class Team {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // MULTI-TENANT & OWNERSHIP
  // =====================================================

  /**
   * ID del aula (FK → social_features.classrooms) - Nullable
   * Null = equipo independiente sin vinculación a aula
   */
  @Column({ type: 'uuid', nullable: true })
  classroom_id?: string;

  /**
   * ID del tenant propietario (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid' })
  tenant_id!: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre del equipo
   */
  @Column({ type: 'text' })
  name!: string;

  /**
   * Descripción del equipo
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Lema o motto del equipo
   */
  @Column({ type: 'text', nullable: true })
  motto?: string;

  // =====================================================
  // VISUAL CUSTOMIZATION
  // =====================================================

  /**
   * Color primario del equipo (hex)
   */
  @Column({ type: 'text', default: '#3B82F6' })
  color_primary!: string;

  /**
   * Color secundario del equipo (hex)
   */
  @Column({ type: 'text', default: '#10B981' })
  color_secondary!: string;

  /**
   * URL del avatar del equipo
   */
  @Column({ type: 'text', nullable: true })
  avatar_url?: string;

  /**
   * URL del banner del equipo
   */
  @Column({ type: 'text', nullable: true })
  banner_url?: string;

  /**
   * Badges o insignias ganadas (JSONB array)
   */
  @Column({ type: 'jsonb', default: [] })
  badges!: any[];

  // =====================================================
  // LEADERSHIP
  // =====================================================

  /**
   * ID del creador del equipo (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid' })
  creator_id!: string;

  /**
   * ID del líder actual del equipo (FK → auth_management.profiles)
   * Puede ser diferente del creator_id
   */
  @Column({ type: 'uuid', nullable: true })
  leader_id?: string;

  // =====================================================
  // ACCESS & MEMBERSHIP
  // =====================================================

  /**
   * Código único de invitación al equipo
   * UNIQUE constraint aplicado
   */
  @Column({ type: 'text', unique: true, nullable: true })
  team_code?: string;

  /**
   * Capacidad máxima de miembros
   */
  @Column({ type: 'integer', default: 5 })
  max_members!: number;

  /**
   * Contador actual de miembros
   */
  @Column({ type: 'integer', default: 0 })
  current_members_count!: number;

  /**
   * Equipo público (visible en directorio)
   */
  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  /**
   * Permitir solicitudes de ingreso
   */
  @Column({ type: 'boolean', default: true })
  allow_join_requests!: boolean;

  /**
   * Requiere aprobación para unirse
   */
  @Column({ type: 'boolean', default: true })
  require_approval!: boolean;

  // =====================================================
  // GAMIFICATION STATS
  // =====================================================

  /**
   * XP total acumulada por el equipo
   */
  @Column({ type: 'integer', default: 0 })
  total_xp!: number;

  /**
   * ML Coins totales acumuladas por el equipo
   */
  @Column({ type: 'integer', default: 0 })
  total_ml_coins!: number;

  /**
   * Módulos completados por el equipo
   */
  @Column({ type: 'integer', default: 0 })
  modules_completed!: number;

  /**
   * Achievements ganados por el equipo
   */
  @Column({ type: 'integer', default: 0 })
  achievements_earned!: number;

  // =====================================================
  // STATUS FLAGS
  // =====================================================

  /**
   * Equipo activo (puede aceptar nuevos miembros y participar en desafíos)
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Equipo verificado por administración
   */
  @Column({ type: 'boolean', default: false })
  is_verified!: boolean;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * Fecha y hora de fundación del equipo
   */
  @Column({ type: 'timestamp with time zone' })
  founded_at!: Date;

  /**
   * Fecha y hora de última actividad del equipo
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  last_activity_at?: Date;

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
   * Trigger: trg_teams_updated_at
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
