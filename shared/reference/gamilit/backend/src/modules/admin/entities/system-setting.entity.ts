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
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';
import { Profile } from '../../auth/entities/profile.entity';
import { Tenant } from '../../auth/entities/tenant.entity';

/**
 * SystemSetting Entity (system_configuration.system_settings)
 *
 * @description Configuración global de la plataforma con soporte multi-tenant.
 * @schema system_configuration
 * @table system_settings
 *
 * IMPORTANTE:
 * - Permite configurar aspectos críticos del sistema (gamificación, seguridad, email, etc.)
 * - Soporta diferentes tipos de valores: string, number, boolean, json, array
 * - Tiene validación de rangos (min_value, max_value) y valores permitidos
 * - Settings de sistema (is_system=true) no pueden ser modificados por usuarios
 * - Row Level Security habilitada
 *
 * @see DDL: apps/database/ddl/schemas/system_configuration/tables/01-system_settings.sql
 */
@Entity({ schema: DB_SCHEMAS.SYSTEM_CONFIGURATION, name: DB_TABLES.SYSTEM.SYSTEM_SETTINGS })
@Index('idx_settings_category', ['setting_category'])
@Index('idx_settings_key', ['setting_key'])
@Index('idx_settings_public', ['is_public'], { where: 'is_public = true' })
@Check(`"setting_category" IN ('general', 'gamification', 'security', 'email', 'storage', 'analytics', 'integrations')`)
@Check(`"value_type" IN ('string', 'number', 'boolean', 'json', 'array')`)
export class SystemSetting {
  /**
   * Identificador único del setting (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del tenant (nullable para settings globales)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  /**
   * Clave única del setting
   * @example 'ml_coins_welcome_bonus', 'max_login_attempts'
   */
  @Column({ type: 'text', unique: true })
  setting_key!: string;

  /**
   * Categoría del setting
   * Valores: general, gamification, security, email, storage, analytics, integrations
   */
  @Column({ type: 'text', nullable: true })
  setting_category?: 'general' | 'gamification' | 'security' | 'email' | 'storage' | 'analytics' | 'integrations';

  /**
   * Subcategoría del setting (para organización adicional)
   */
  @Column({ type: 'text', nullable: true })
  setting_subcategory?: string;

  /**
   * Valor actual del setting
   */
  @Column({ type: 'text' })
  setting_value!: string;

  /**
   * Tipo del valor: string, number, boolean, json, array
   */
  @Column({ type: 'text', default: 'string' })
  value_type!: 'string' | 'number' | 'boolean' | 'json' | 'array';

  /**
   * Valor por defecto (usado si setting_value es null)
   */
  @Column({ type: 'text', nullable: true })
  default_value?: string;

  /**
   * Nombre visible para mostrar en UI
   */
  @Column({ type: 'text', nullable: true })
  display_name?: string;

  /**
   * Descripción del setting
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Texto de ayuda para usuarios
   */
  @Column({ type: 'text', nullable: true })
  help_text?: string;

  /**
   * Indica si el setting es público (visible para todos)
   */
  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  /**
   * Indica si el setting es de solo lectura
   */
  @Column({ type: 'boolean', default: false })
  is_readonly!: boolean;

  /**
   * Indica si es un setting del sistema (no puede ser modificado por usuarios)
   */
  @Column({ type: 'boolean', default: false })
  is_system!: boolean;

  /**
   * Indica si requiere reinicio del sistema para aplicarse
   */
  @Column({ type: 'boolean', default: false })
  requires_restart!: boolean;

  /**
   * Reglas de validación en formato JSONB
   * @example { "regex": "^[a-z]+$", "minLength": 3 }
   */
  @Column({ type: 'jsonb', default: {} })
  validation_rules!: Record<string, any>;

  /**
   * Valores permitidos para el setting (array de strings)
   * @example ['low', 'medium', 'high']
   */
  @Column({ type: 'text', array: true, nullable: true })
  allowed_values?: string[];

  /**
   * Valor mínimo permitido (para valores numéricos)
   */
  @Column({ type: 'numeric', nullable: true })
  min_value?: number;

  /**
   * Valor máximo permitido (para valores numéricos)
   */
  @Column({ type: 'numeric', nullable: true })
  max_value?: number;

  /**
   * Metadatos adicionales en formato JSONB
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * ID del usuario que creó el setting
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  /**
   * ID del último usuario que actualizó el setting
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
   * Tenant asociado (opcional, null para settings globales)
   * Relación ManyToOne: Muchos settings pueden pertenecer a un tenant
   * FK: system_settings.tenant_id → auth_management.tenants.id
   */
  @ManyToOne(() => Tenant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
  tenant?: Tenant;

  /**
   * Usuario que creó el setting
   * Relación ManyToOne: Muchos settings pueden ser creados por un usuario
   * FK: system_settings.created_by → auth_management.profiles.id
   */
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator?: Profile;

  /**
   * Usuario que actualizó el setting
   * Relación ManyToOne: Muchos settings pueden ser actualizados por un usuario
   * FK: system_settings.updated_by → auth_management.profiles.id
   */
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updater?: Profile;
}
