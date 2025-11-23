import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';
import { GamilityRoleEnum } from '@/shared/constants/enums.constants';
import { Profile } from './profile.entity';
import { Tenant } from './tenant.entity';

/**
 * UserRole Entity
 *
 * @description Asignaciones de roles a usuarios con permisos específicos
 * @table auth_management.user_roles
 * @fields 14 campos (completo según DDL)
 *
 * Campos principales:
 * - id (UUID, PK)
 * - user_id (UUID, FK a profiles) - CRÍTICO
 * - tenant_id (UUID, FK a tenants) - CRÍTICO
 * - role (ENUM gamilit_role) - CRÍTICO
 * - permissions (JSONB) - Permisos específicos
 * - assigned_by (UUID, FK a profiles, nullable)
 * - assigned_at (TIMESTAMP)
 * - expires_at (TIMESTAMP, nullable)
 * - revoked_by (UUID, FK a profiles, nullable)
 * - revoked_at (TIMESTAMP, nullable)
 * - is_active (BOOLEAN)
 * - metadata (JSONB)
 * - created_at, updated_at
 *
 * Relaciones:
 * - @ManyToOne Profile (user_id) - Usuario asignado
 * - @ManyToOne Profile (assigned_by) - Usuario que asignó el rol
 * - @ManyToOne Profile (revoked_by) - Usuario que revocó el rol
 * - @ManyToOne Tenant (tenant_id) - Tenant al que pertenece
 *
 * @see DDL: /apps/database/ddl/schemas/auth_management/tables/04-roles.sql
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.USER_ROLES })
@Index('idx_user_roles_user_id', ['user_id'])
@Index('idx_user_roles_tenant_id', ['tenant_id'])
@Index('idx_user_roles_role', ['role'])
@Index('user_roles_user_id_tenant_id_role_key', ['user_id', 'tenant_id', 'role'], {
  unique: true,
})
export class UserRole {
  /**
   * ID único del user_role (UUID v4)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario (Profile) asignado
   * @foreignKey auth_management.profiles.id
   */
  @Column({ type: 'uuid', nullable: false })
  user_id!: string;

  /**
   * ID del tenant al que pertenece la asignación
   * @foreignKey auth_management.tenants.id
   */
  @Column({ type: 'uuid', nullable: false })
  tenant_id!: string;

  /**
   * Rol del sistema Gamilit asignado
   * @see GamilityRoleEnum para valores válidos
   */
  @Column({
    type: 'enum',
    enum: GamilityRoleEnum,
    nullable: false,
  })
  role!: GamilityRoleEnum;

  /**
   * Permisos específicos asociados a este rol (JSONB)
   * @default { read: true, write: false, admin: false, analytics: false }
   * @example { read: true, write: true, admin: false, analytics: true }
   */
  @Column({
    type: 'jsonb',
    nullable: false,
    default: { read: true, write: false, admin: false, analytics: false },
  })
  permissions!: Record<string, any>;

  /**
   * ID del usuario (Profile) que asignó este rol (nullable)
   * @foreignKey auth_management.profiles.id
   */
  @Column({ type: 'uuid', nullable: true })
  assigned_by!: string | null;

  /**
   * Fecha y hora de asignación del rol
   * @default now_mexico()
   */
  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  assigned_at!: Date;

  /**
   * Fecha y hora de expiración del rol (nullable)
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  expires_at!: Date | null;

  /**
   * ID del usuario (Profile) que revocó este rol (nullable)
   * @foreignKey auth_management.profiles.id
   */
  @Column({ type: 'uuid', nullable: true })
  revoked_by!: string | null;

  /**
   * Fecha y hora de revocación del rol (nullable)
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  revoked_at!: Date | null;

  /**
   * Estado activo del rol
   * @default true
   */
  @Column({ type: 'boolean', nullable: false, default: true })
  is_active!: boolean;

  /**
   * Metadata adicional del user_role (JSONB)
   * @example { notes: "Rol temporal para proyecto X", reason: "..." }
   */
  @Column({ type: 'jsonb', nullable: false, default: {} })
  metadata!: Record<string, any>;

  /**
   * Fecha de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha de última actualización del registro
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // ===========================
  // Relaciones
  // ===========================

  /**
   * Usuario (Profile) asignado a este rol
   * @relation ManyToOne con Profile
   */
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Profile;

  /**
   * Usuario (Profile) que asignó este rol
   * @relation ManyToOne con Profile
   */
  @ManyToOne(() => Profile, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigned_by' })
  assigner?: Profile;

  /**
   * Usuario (Profile) que revocó este rol
   * @relation ManyToOne con Profile
   */
  @ManyToOne(() => Profile, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'revoked_by' })
  revoker?: Profile;

  /**
   * Tenant al que pertenece esta asignación de rol
   * @relation ManyToOne con Tenant
   */
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;
}
