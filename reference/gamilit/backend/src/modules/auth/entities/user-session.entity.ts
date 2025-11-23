import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

/**
 * UserSession Entity
 *
 * @description Gestión de sesiones de usuario activas.
 * Características:
 * - Máximo 5 sesiones concurrentes por usuario
 * - Soporte multi-tenant
 * - Tracking de dispositivo, IP, última actividad
 * - Gestión de refresh tokens para renovación automática
 *
 * @see DDL: auth_management.user_sessions
 * @constraint MAX_SESSIONS_PER_USER = 5 (validar en service)
 * @constraint device_type CHECK: 'desktop', 'mobile', 'tablet', 'unknown'
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.USER_SESSIONS })
@Index(['user_id'])
@Index(['tenant_id'])
@Index(['session_token'])
@Index(['expires_at'])
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  tenant_id!: string | null;

  @Column({ type: 'text' })
  session_token!: string;

  @Column({ type: 'text', nullable: true })
  @Exclude() // CRITICAL: NO serializar refresh_token en respuestas
  refresh_token!: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent!: string | null;

  @Column({ type: 'inet', nullable: true })
  ip_address!: string | null;

  @Column({ type: 'text', nullable: true })
  device_type!: string | null;

  @Column({ type: 'text', nullable: true })
  browser!: string | null;

  @Column({ type: 'text', nullable: true })
  os!: string | null;

  @Column({ type: 'text', nullable: true })
  country!: string | null;

  @Column({ type: 'text', nullable: true })
  city!: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_activity_at!: Date;

  @Column({ type: 'timestamptz' })
  expires_at!: Date;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;
}
