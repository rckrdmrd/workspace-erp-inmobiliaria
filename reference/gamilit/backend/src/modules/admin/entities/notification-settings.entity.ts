import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';
import { Profile } from '../../auth/entities/profile.entity';
import { Tenant } from '../../auth/entities/tenant.entity';

/**
 * NotificationSettings Entity (system_configuration.notification_settings)
 *
 * @description Configuración de notificaciones por usuario y canal de entrega.
 * @schema system_configuration
 * @table notification_settings
 *
 * IMPORTANTE:
 * - Una configuración por usuario + tipo + canal (UNIQUE constraint)
 * - Soporta múltiples canales: email, sms, push, in_app, webhook
 * - Frecuencias: immediate, daily, weekly, never
 * - Quiet hours para no molestar (horario)
 * - Rate limiting: max_per_day
 * - Row Level Security habilitada
 *
 * @see DDL: apps/database/ddl/schemas/system_configuration/tables/03-notification_settings.sql
 */
@Entity({ schema: DB_SCHEMAS.SYSTEM_CONFIGURATION, name: DB_TABLES.SYSTEM.NOTIFICATION_SETTINGS })
@Unique(['user_id', 'notification_type', 'channel'])
@Index('idx_notification_settings_user', ['user_id'])
@Index('idx_notification_settings_enabled', ['is_enabled'], { where: 'is_enabled = true' })
@Index('idx_notification_settings_type', ['notification_type'])
@Index('idx_notification_settings_channel', ['channel'])
@Index('idx_notification_settings_tenant', ['tenant_id'])
@Check(`"channel" IN ('email', 'sms', 'push', 'in_app', 'webhook')`)
@Check(`"frequency" IN ('immediate', 'daily', 'weekly', 'never')`)
@Check(`"max_per_day" > 0`)
export class NotificationSettings {
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
   * ID del usuario propietario de la configuración
   */
  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * Tipo de notificación
   * @example 'achievement_unlocked', 'rank_up', 'friend_request', 'mission_completed'
   */
  @Column({ type: 'text' })
  notification_type!: string;

  /**
   * Canal de entrega de la notificación
   * Valores: email, sms, push, in_app, webhook
   */
  @Column({ type: 'text' })
  channel!: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';

  /**
   * Indica si las notificaciones de este tipo están habilitadas
   */
  @Column({ type: 'boolean', default: true })
  is_enabled!: boolean;

  /**
   * Frecuencia de entrega
   * - immediate: Envío inmediato
   * - daily: Digest diario
   * - weekly: Digest semanal
   * - never: Deshabilitado
   */
  @Column({ type: 'text', default: 'immediate' })
  frequency!: 'immediate' | 'daily' | 'weekly' | 'never';

  /**
   * Hora de inicio del período de silencio (no enviar notificaciones)
   * @example '22:00:00' (10 PM)
   */
  @Column({ type: 'time', nullable: true })
  quiet_hours_start?: string;

  /**
   * Hora de fin del período de silencio
   * @example '08:00:00' (8 AM)
   */
  @Column({ type: 'time', nullable: true })
  quiet_hours_end?: string;

  /**
   * Máximo número de notificaciones por día (rate limiting)
   */
  @Column({ type: 'integer', default: 999 })
  max_per_day!: number;

  /**
   * ID de la plantilla de notificación a usar
   */
  @Column({ type: 'uuid', nullable: true })
  template_id?: string;

  /**
   * Política de reintentos en formato JSONB
   * @example { "max_retries": 3, "backoff": "exponential" }
   */
  @Column({ type: 'jsonb', default: {} })
  retry_policy!: Record<string, any>;

  /**
   * Configuraciones específicas del canal de entrega
   * @example { "email_format": "html", "reply_to": "support@example.com" }
   */
  @Column({ type: 'jsonb', default: {} })
  delivery_settings!: Record<string, any>;

  /**
   * Metadatos adicionales
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
   * Tenant asociado (opcional)
   * Relación ManyToOne: Muchos settings pueden pertenecer a un tenant
   * FK: notification_settings.tenant_id → auth_management.tenants.id
   */
  @ManyToOne(() => Tenant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
  tenant?: Tenant;

  /**
   * Usuario propietario de la configuración
   * Relación ManyToOne: Muchos settings pueden pertenecer a un usuario
   * FK: notification_settings.user_id → auth_management.profiles.id
   *
   * NOTA: ON DELETE CASCADE - Si se elimina el usuario, se eliminan sus configuraciones
   */
  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Profile;

  /**
   * Usuario que creó el setting
   * Relación ManyToOne: Muchos settings pueden ser creados por un usuario
   * FK: notification_settings.created_by → auth_management.profiles.id
   */
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator?: Profile;

  /**
   * Usuario que actualizó el setting
   * Relación ManyToOne: Muchos settings pueden ser actualizados por un usuario
   * FK: notification_settings.updated_by → auth_management.profiles.id
   */
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updater?: Profile;
}
