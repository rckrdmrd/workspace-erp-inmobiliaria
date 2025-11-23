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
import {
  MembershipRoleEnum,
  MembershipStatusEnum,
} from '@/shared/constants/enums.constants';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

/**
 * MembershipEntity - Entidad para membresías user-tenant (auth_management.memberships)
 *
 * @description Representa la relación many-to-many entre usuarios y tenants con roles específicos.
 * Permite que un usuario pertenezca a múltiples tenants con diferentes roles.
 *
 * @see DDL: /apps/database/ddl/schemas/auth_management/tables/memberships.sql
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.MEMBERSHIPS })
@Index('idx_memberships_user_id', ['user_id'])
@Index('idx_memberships_tenant_id', ['tenant_id'])
@Index('idx_memberships_status', ['status'])
@Index('idx_memberships_user_tenant', ['user_id', 'tenant_id'], { unique: true })
export class Membership {
  /**
   * ID único de la membresía (UUID v4)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario (FK a auth.users)
   */
  @Column({ type: 'uuid', nullable: false })
  user_id!: string;

  /**
   * ID del tenant (FK a auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: false })
  tenant_id!: string;

  /**
   * Rol del usuario en el tenant
   * @see MembershipRoleEnum para valores válidos
   */
  @Column({
    type: 'enum',
    enum: MembershipRoleEnum,
    nullable: false,
    default: MembershipRoleEnum.MEMBER,
  })
  role!: MembershipRoleEnum;

  /**
   * Estado de la membresía
   * @see MembershipStatusEnum para valores válidos
   */
  @Column({
    type: 'enum',
    enum: MembershipStatusEnum,
    nullable: false,
    default: MembershipStatusEnum.ACTIVE,
  })
  status!: MembershipStatusEnum;

  /**
   * ID del usuario que invitó (FK a auth.users, nullable)
   */
  @Column({ type: 'uuid', nullable: true })
  invited_by!: string | null;

  /**
   * Fecha y hora en que el usuario se unió al tenant
   */
  @Column({ type: 'timestamp with time zone', nullable: false })
  joined_at!: Date;

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
   * Usuario asociado a esta membresía
   * @relation ManyToOne con User
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /**
   * Tenant asociado a esta membresía
   * @relation ManyToOne con Tenant
   */
  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  /**
   * Usuario que invitó (nullable)
   * @relation ManyToOne con User
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'invited_by' })
  inviter!: User | null;
}
