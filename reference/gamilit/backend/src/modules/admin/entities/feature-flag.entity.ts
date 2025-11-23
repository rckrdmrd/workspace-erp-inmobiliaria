import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES, GamilityRoleEnum } from '@shared/constants';
import { Profile } from '../../auth/entities/profile.entity';
import { Tenant } from '../../auth/entities/tenant.entity';

/**
 * FeatureFlag Entity (system_configuration.feature_flags)
 *
 * @description Feature flags para activación gradual de funcionalidades.
 * @schema system_configuration
 * @table feature_flags
 *
 * IMPORTANTE:
 * - Permite activar/desactivar features dinámicamente sin redespliegue
 * - Soporta rollout gradual por porcentaje de usuarios
 * - Puede dirigirse a usuarios específicos o roles
 * - Soporta condiciones personalizadas vía target_conditions
 * - Puede tener período de validez (starts_at/ends_at)
 * - Row Level Security habilitada
 *
 * @see DDL: apps/database/ddl/schemas/system_configuration/tables/02-feature_flags.sql
 */
@Entity({ schema: DB_SCHEMAS.SYSTEM_CONFIGURATION, name: DB_TABLES.SYSTEM.FEATURE_FLAGS })
@Index('idx_feature_flags_key', ['feature_key'])
@Index('idx_feature_flags_enabled', ['is_enabled'], { where: 'is_enabled = true' })
@Index('idx_feature_flags_active', ['starts_at', 'ends_at'], { where: 'is_enabled = true' })
@Check(`"rollout_percentage" >= 0 AND "rollout_percentage" <= 100`)
export class FeatureFlag {
  /**
   * Identificador único de la feature flag (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del tenant (nullable para feature flags globales)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  /**
   * Nombre descriptivo de la feature
   * @example 'Nuevo Sistema de Rankings Maya'
   */
  @Column({ type: 'text' })
  feature_name!: string;

  /**
   * Clave única de la feature (snake_case)
   * @example 'maya_ranks_system', 'peer_challenges', 'lti_integration'
   */
  @Column({ type: 'text', unique: true })
  feature_key!: string;

  /**
   * Descripción de la funcionalidad
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Indica si la feature está habilitada
   */
  @Column({ type: 'boolean', default: false })
  is_enabled!: boolean;

  /**
   * Porcentaje de usuarios con acceso (0-100)
   * 0 = ninguno, 100 = todos
   * Usado para rollout gradual
   */
  @Column({ type: 'integer', default: 0 })
  rollout_percentage!: number;

  /**
   * Array de UUIDs de usuarios específicos con acceso
   * Útil para testing o early access
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  target_users?: string[];

  /**
   * Array de roles con acceso a la feature
   * Valores: student, admin_teacher, super_admin
   */
  @Column({ type: 'enum', enum: GamilityRoleEnum, array: true, nullable: true })
  target_roles?: GamilityRoleEnum[];

  /**
   * Condiciones personalizadas en formato JSONB
   * @example { "min_level": 5, "schools": ["uuid1", "uuid2"] }
   */
  @Column({ type: 'jsonb', default: {} })
  target_conditions!: Record<string, any>;

  /**
   * Fecha y hora de inicio de la feature
   * Null = sin restricción de inicio
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  starts_at?: Date;

  /**
   * Fecha y hora de fin de la feature
   * Null = sin restricción de fin
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  ends_at?: Date;

  /**
   * Metadatos adicionales en formato JSONB
   * @example { "ab_test_group": "A", "tracking_id": "GA-123" }
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * ID del usuario que creó la feature flag
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * ID del último usuario que actualizó la feature flag
   */
  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

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

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Tenant asociado (opcional, null para feature flags globales)
   * Relación ManyToOne: Muchas feature flags pueden pertenecer a un tenant
   * FK: feature_flags.tenant_id → auth_management.tenants.id
   */
  @ManyToOne(() => Tenant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
  tenant?: Tenant;

  /**
   * Usuario que creó la feature flag
   * Relación ManyToOne: Muchas feature flags pueden ser creadas por un usuario
   * FK: feature_flags.created_by → auth_management.profiles.id
   */
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator?: Profile;

  /**
   * Usuario que actualizó la feature flag
   * Relación ManyToOne: Muchas feature flags pueden ser actualizadas por un usuario
   * FK: feature_flags.updated_by → auth_management.profiles.id
   */
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updater?: Profile;
}
