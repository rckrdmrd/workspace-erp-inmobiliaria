import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';
import { GamilityRoleEnum, UserStatusEnum } from '@/shared/constants/enums.constants';
import { UserPreferencesSchema } from '../dto/user-preferences.schema';

/**
 * Profile Entity
 *
 * @description Perfiles de usuario con información básica, rol y configuraciones
 * @table auth_management.profiles
 * @fields 25 campos (completo según DDL)
 *
 * Campos agregados vs legacy (11 nuevos):
 * - email (NOT NULL) - CRÍTICO
 * - first_name
 * - last_name
 * - bio
 * - date_of_birth
 * - role (NOT NULL) - CRÍTICO
 * - status (NOT NULL) - CRÍTICO
 * - email_verified (BOOLEAN) - CRÍTICO
 * - phone_verified
 * - last_sign_in_at
 * - last_activity_at
 *
 * @see DDL: /apps/database/ddl/schemas/auth_management/tables/03-profiles.sql
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.PROFILES })
@Index('idx_profiles_email', ['email'])
@Index('idx_profiles_email_status', ['email', 'status'])
@Index('idx_profiles_last_activity', ['last_activity_at'])
@Index('idx_profiles_role', ['role'])
@Index('idx_profiles_status', ['status'])
@Index('idx_profiles_tenant_id', ['tenant_id'])
@Index('idx_profiles_tenant_role_status', ['tenant_id', 'role', 'status'])
@Index('idx_profiles_user_id', ['user_id'])
@Index('idx_profiles_school_id', ['school_id'])
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  tenant_id!: string;

  @Column({ type: 'text', nullable: true })
  display_name!: string | null;

  @Column({ type: 'text', nullable: true })
  full_name!: string | null;

  @Column({ type: 'text', nullable: true })
  first_name!: string | null;

  @Column({ type: 'text', nullable: true })
  last_name!: string | null;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  avatar_url!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ type: 'text', nullable: true })
  phone!: string | null;

  @Column({ type: 'date', nullable: true })
  date_of_birth!: Date | null;

  @Column({ type: 'text', nullable: true })
  grade_level!: string | null;

  @Column({ type: 'text', nullable: true })
  student_id!: string | null;

  @Column({ type: 'uuid', nullable: true })
  school_id!: string | null;

  @Column({
    type: 'enum',
    enum: GamilityRoleEnum,
    default: GamilityRoleEnum.STUDENT,
  })
  role!: GamilityRoleEnum;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status!: UserStatusEnum;

  @Column({ type: 'boolean', default: false })
  email_verified!: boolean;

  @Column({ type: 'boolean', default: false })
  phone_verified!: boolean;

  @Column({
    type: 'jsonb',
    default: {
      theme: 'detective',
      language: 'es',
      timezone: 'America/Mexico_City',
      sound_enabled: true,
      notifications_enabled: true,
    },
  })
  preferences!: UserPreferencesSchema;

  @Column({ type: 'timestamp with time zone', nullable: true })
  last_sign_in_at!: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  last_activity_at!: Date | null;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  @Column({ type: 'uuid', nullable: true })
  user_id!: string | null;

  // Relación a auth.users (schema diferente, se maneja manualmente)
  // @ManyToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user?: User;

  // Relación a tenants (pendiente de implementar)
  // @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'tenant_id' })
  // tenant?: Tenant;
}
