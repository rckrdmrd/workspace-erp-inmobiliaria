import { ThemeEnum, LanguageEnum } from '@/shared/constants/enums.constants';

/**
 * UserPreferencesSchema
 *
 * @description Schema TypeScript para el campo JSONB 'preferences' en profiles
 * @usage En ProfileEntity: preferences: UserPreferencesSchema
 *
 * Proporciona type-safety para el campo JSONB según el default del DDL:
 * {
 *   "theme": "detective",
 *   "language": "es",
 *   "timezone": "America/Mexico_City",
 *   "sound_enabled": true,
 *   "notifications_enabled": true
 * }
 *
 * @see DDL: auth_management.profiles.preferences (JSONB)
 */
export interface UserPreferencesSchema {
  /**
   * Tema visual de la aplicación
   * @default 'detective'
   * @enum ThemeEnum (light, dark, auto) o custom theme
   */
  theme?: string;

  /**
   * Idioma de la interfaz
   * @default 'es'
   * @enum LanguageEnum (es, en)
   */
  language?: LanguageEnum;

  /**
   * Zona horaria del usuario
   * @default 'America/Mexico_City'
   * @format IANA timezone string
   */
  timezone?: string;

  /**
   * Sonido habilitado en la aplicación
   * @default true
   */
  sound_enabled?: boolean;

  /**
   * Notificaciones habilitadas
   * @default true
   */
  notifications_enabled?: boolean;

  /**
   * Notificaciones por email habilitadas
   * @default false
   */
  email_notifications?: boolean;

  /**
   * Notificaciones push habilitadas
   * @default false
   */
  push_notifications?: boolean;

  /**
   * Preferencias adicionales personalizadas
   * @flexible Permite agregar campos custom sin modificar schema
   */
  [key: string]: any;
}

/**
 * Default preferences según DDL
 */
export const DEFAULT_USER_PREFERENCES: UserPreferencesSchema = {
  theme: 'detective',
  language: LanguageEnum.ES,
  timezone: 'America/Mexico_City',
  sound_enabled: true,
  notifications_enabled: true,
};
