import { IsBoolean, IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ThemeEnum, LanguageEnum } from '@/shared/constants/enums.constants';

/**
 * CreateUserPreferencesDto
 *
 * @description DTO para crear preferencias de usuario
 * @see Entity: UserPreferences
 * @see DDL: auth_management.user_preferences
 *
 * @created 2025-11-11 (DB-100 Ciclo B.1)
 * @version 1.0
 */
export class CreateUserPreferencesDto {
  /**
   * ID del usuario (FK a profiles)
   * @required
   * @type UUID
   */
  @ApiProperty({
    description: 'ID del usuario (FK a profiles)',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  user_id!: string;

  /**
   * Tema de la interfaz
   * @optional
   * @enum ThemeEnum
   * @default 'light'
   */
  @ApiPropertyOptional({
    description: 'Tema de la interfaz',
    enum: ThemeEnum,
    default: ThemeEnum.LIGHT,
    example: ThemeEnum.LIGHT,
  })
  @IsOptional()
  @IsEnum(ThemeEnum, {
    message: 'Theme must be one of: light, dark, auto',
  })
  theme?: ThemeEnum;

  /**
   * Idioma preferido
   * @optional
   * @enum LanguageEnum
   * @default 'es'
   */
  @ApiPropertyOptional({
    description: 'Idioma preferido',
    enum: LanguageEnum,
    default: LanguageEnum.ES,
    example: LanguageEnum.ES,
  })
  @IsOptional()
  @IsEnum(LanguageEnum, {
    message: 'Language must be one of: es, en',
  })
  language?: LanguageEnum;

  /**
   * Habilitar notificaciones en la aplicación
   * @optional
   * @default true
   */
  @ApiPropertyOptional({
    description: 'Habilitar notificaciones en la aplicación',
    type: Boolean,
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notifications_enabled?: boolean;

  /**
   * Habilitar notificaciones por correo electrónico
   * @optional
   * @default true
   */
  @ApiPropertyOptional({
    description: 'Habilitar notificaciones por correo electrónico',
    type: Boolean,
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  /**
   * Habilitar efectos de sonido en la aplicación
   * @optional
   * @default true
   */
  @ApiPropertyOptional({
    description: 'Habilitar efectos de sonido en la aplicación',
    type: Boolean,
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  sound_enabled?: boolean;

  /**
   * Indica si el usuario completó el tutorial inicial
   * @optional
   * @default false
   */
  @ApiPropertyOptional({
    description: 'Indica si el usuario completó el tutorial inicial',
    type: Boolean,
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  tutorial_completed?: boolean;

  /**
   * Preferencias adicionales en formato JSON
   * @optional
   * @default {}
   */
  @ApiPropertyOptional({
    description: 'Preferencias adicionales en formato JSON',
    type: 'object',
    additionalProperties: true,
    default: {},
    example: {
      timezone: 'America/Mexico_City',
      custom_theme_colors: { primary: '#FF5733' },
      dashboard_layout: 'grid',
    },
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}
