import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DB_TABLES } from '@/shared/constants/database.constants';
import { ThemeEnum, LanguageEnum } from '@/shared/constants/enums.constants';
import { Profile } from './profile.entity';

/**
 * UserPreferences Entity
 *
 * @description Preferencias personalizadas de cada usuario para la interfaz y experiencia de la aplicación
 * @schema auth_management
 * @table user_preferences
 * @see DDL: apps/database/ddl/schemas/auth_management/tables/09-user_preferences.sql
 *
 * @note Esta es una tabla separada de profiles para mejor organización y performance
 * @note Relación 1:1 con Profile (cada usuario tiene exactamente un conjunto de preferencias)
 *
 * @created 2025-11-11 (DB-100 Ciclo B.1)
 * @version 1.0
 */
@Entity({ name: DB_TABLES.AUTH.USER_PREFERENCES, schema: 'auth_management' })
export class UserPreferences {
  /**
   * ID del usuario (PK y FK a profiles)
   * @primary
   * @type UUID
   * @relation Profile (1:1)
   */
  @PrimaryColumn('uuid', { name: 'user_id' })
  user_id!: string;

  /**
   * Tema de la interfaz
   * @enum ThemeEnum
   * @values 'light', 'dark', 'auto'
   * @default 'light'
   * @constraint CHECK (theme IN ('light', 'dark', 'auto'))
   */
  @Column({
    type: 'varchar',
    length: 20,
    default: ThemeEnum.LIGHT,
  })
  @Index('idx_user_preferences_theme')
  theme!: ThemeEnum;

  /**
   * Idioma preferido
   * @enum LanguageEnum
   * @values 'es', 'en'
   * @default 'es'
   * @constraint CHECK (language IN ('es', 'en'))
   */
  @Column({
    type: 'varchar',
    length: 10,
    default: LanguageEnum.ES,
  })
  @Index('idx_user_preferences_language')
  language!: LanguageEnum;

  /**
   * Habilitar notificaciones en la aplicación
   * @type boolean
   * @default true
   */
  @Column({ type: 'boolean', default: true })
  notifications_enabled!: boolean;

  /**
   * Habilitar notificaciones por correo electrónico
   * @type boolean
   * @default true
   */
  @Column({ type: 'boolean', default: true })
  email_notifications!: boolean;

  /**
   * Habilitar efectos de sonido en la aplicación
   * @type boolean
   * @default true
   */
  @Column({ type: 'boolean', default: true })
  sound_enabled!: boolean;

  /**
   * Indica si el usuario completó el tutorial inicial
   * @type boolean
   * @default false
   * @indexed Parcial (solo false) para optimizar búsquedas de usuarios que no completaron tutorial
   */
  @Column({ type: 'boolean', default: false })
  @Index('idx_user_preferences_tutorial', { where: 'tutorial_completed = false' })
  tutorial_completed!: boolean;

  /**
   * Preferencias adicionales en formato JSON
   * @type jsonb
   * @default {}
   * @indexed GIN para búsquedas eficientes en JSONB
   *
   * @example
   * {
   *   "timezone": "America/Mexico_City",
   *   "custom_theme_colors": { "primary": "#FF5733" },
   *   "dashboard_layout": "grid",
   *   "auto_save_enabled": true
   * }
   */
  @Column({ type: 'jsonb', default: {} })
  @Index('idx_user_preferences_preferences', { synchronize: false }) // GIN index creado en DDL
  preferences!: Record<string, any>;

  /**
   * Fecha de creación
   * @generated
   */
  @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
  created_at!: Date;

  /**
   * Fecha de última actualización
   * @generated
   * @trigger trg_user_preferences_updated_at (actualizado automáticamente por trigger)
   */
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at!: Date;

  // =============================================================================
  // RELACIONES
  // =============================================================================

  /**
   * Relación 1:1 con Profile
   * @description Cada conjunto de preferencias pertenece a un usuario único
   * @cascade DELETE (si se elimina el profile, se eliminan las preferencias)
   */
  @ManyToOne(() => Profile, profile => profile.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  profile!: Profile;
}
