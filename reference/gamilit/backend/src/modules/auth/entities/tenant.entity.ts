import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';
import { SubscriptionTierEnum } from '@/shared/constants/enums.constants';

/**
 * TenantEntity - Entidad para multi-tenancy (auth_management.tenants)
 *
 * @description Representa un tenant (organización) en el sistema multi-tenant.
 * Cada tenant tiene aislamiento de datos completo para sus usuarios y recursos.
 *
 * @see DDL: /apps/database/ddl/schemas/auth_management/tables/01-tenants.sql
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.TENANTS })
@Index('idx_tenants_slug', ['slug'])
@Index('idx_tenants_active', ['is_active'], { where: 'is_active = true' })
export class Tenant {
  /**
   * ID único del tenant (UUID v4)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Nombre completo del tenant/organización
   * @example "Universidad Nacional Autónoma de México"
   */
  @Column({ type: 'text', nullable: false })
  name!: string;

  /**
   * Slug URL-friendly único para el tenant
   * @example "unam-fes-aragon"
   */
  @Column({ type: 'text', nullable: false, unique: true })
  slug!: string;

  /**
   * Dominio personalizado del tenant (opcional)
   * @example "unam.gamilit.com"
   */
  @Column({ type: 'text', nullable: true })
  domain!: string | null;

  /**
   * URL del logo del tenant (opcional)
   * @example "https://cdn.gamilit.com/logos/unam.png"
   */
  @Column({ type: 'text', nullable: true })
  logo_url!: string | null;

  /**
   * Nivel de suscripción del tenant
   * @see SubscriptionTierEnum para valores válidos
   */
  @Column({
    type: 'text',
    nullable: false,
    default: SubscriptionTierEnum.FREE,
  })
  subscription_tier!: SubscriptionTierEnum;

  /**
   * Número máximo de usuarios permitidos
   * @default 100
   * @constraint CHECK (max_users > 0)
   */
  @Column({ type: 'integer', nullable: false, default: 100 })
  max_users!: number;

  /**
   * Almacenamiento máximo en GB
   * @default 5
   * @constraint CHECK (max_storage_gb > 0)
   */
  @Column({ type: 'integer', nullable: false, default: 5 })
  max_storage_gb!: number;

  /**
   * Estado activo del tenant
   * @default true
   */
  @Column({ type: 'boolean', nullable: false, default: true })
  is_active!: boolean;

  /**
   * Fecha de fin del período de prueba (nullable)
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  trial_ends_at!: Date | null;

  /**
   * Configuraciones del tenant (JSONB)
   * @example { theme: "detective", features: {...}, language: "es", timezone: "America/Mexico_City" }
   */
  @Column({
    type: 'jsonb',
    nullable: false,
    default: {
      theme: 'detective',
      features: {
        analytics_enabled: true,
        gamification_enabled: true,
        social_features_enabled: true,
      },
      language: 'es',
      timezone: 'America/Mexico_City',
    },
  })
  settings!: Record<string, any>;

  /**
   * Metadata adicional del tenant (JSONB)
   * @example { billing_contact: "admin@example.com", notes: "..." }
   */
  @Column({ type: 'jsonb', nullable: false, default: {} })
  metadata!: Record<string, any>;

  /**
   * Fecha de creación del tenant
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha de última actualización del tenant
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // ===========================
  // Relaciones
  // ===========================

  /**
   * Usuarios asociados a este tenant
   * @relation OneToMany con User
   */
  // @OneToMany(() => User, (user) => user.tenant)
  // users: User[];

  /**
   * Perfiles asociados a este tenant
   * @relation OneToMany con Profile
   */
  // @OneToMany(() => Profile, (profile) => profile.tenant)
  // profiles: Profile[];
}
