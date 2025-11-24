import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ThemeEnum, LanguageEnum } from '@/shared/constants/enums.constants';

/**
 * UserPreferencesResponseDto
 *
 * @description DTO para respuesta de API con preferencias de usuario
 * @see Entity: UserPreferences
 * @see DDL: auth_management.user_preferences
 *
 * @created 2025-11-11 (DB-100 Ciclo B.1)
 * @version 1.0
 */
export class UserPreferencesResponseDto {
  /**
   * ID del usuario (PK y FK a profiles)
   * @type UUID
   */
  @ApiProperty({
    description: 'ID del usuario (PK y FK a profiles)',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  /**
   * Tema de la interfaz
   * @enum ThemeEnum
   */
  @ApiProperty({
    description: 'Tema de la interfaz',
    enum: ThemeEnum,
    example: ThemeEnum.LIGHT,
  })
  theme!: ThemeEnum;

  /**
   * Idioma preferido
   * @enum LanguageEnum
   */
  @ApiProperty({
    description: 'Idioma preferido',
    enum: LanguageEnum,
    example: LanguageEnum.ES,
  })
  language!: LanguageEnum;

  /**
   * Notificaciones habilitadas en la aplicación
   */
  @ApiProperty({
    description: 'Notificaciones habilitadas en la aplicación',
    type: Boolean,
    example: true,
  })
  notifications_enabled!: boolean;

  /**
   * Notificaciones por email habilitadas
   */
  @ApiProperty({
    description: 'Notificaciones por email habilitadas',
    type: Boolean,
    example: true,
  })
  email_notifications!: boolean;

  /**
   * Efectos de sonido habilitados
   */
  @ApiProperty({
    description: 'Efectos de sonido habilitados',
    type: Boolean,
    example: true,
  })
  sound_enabled!: boolean;

  /**
   * Tutorial inicial completado
   */
  @ApiProperty({
    description: 'Indica si el usuario completó el tutorial inicial',
    type: Boolean,
    example: false,
  })
  tutorial_completed!: boolean;

  /**
   * Preferencias adicionales en formato JSON
   */
  @ApiPropertyOptional({
    description: 'Preferencias adicionales personalizadas',
    type: 'object',
    additionalProperties: true,
    example: {
      timezone: 'America/Mexico_City',
      custom_theme_colors: { primary: '#FF5733' },
      dashboard_layout: 'grid',
    },
  })
  preferences!: Record<string, any>;

  /**
   * Fecha de creación
   */
  @ApiProperty({
    description: 'Fecha de creación',
    type: String,
    format: 'date-time',
    example: '2025-11-11T10:00:00.000Z',
  })
  created_at!: Date;

  /**
   * Fecha de última actualización
   */
  @ApiProperty({
    description: 'Fecha de última actualización',
    type: String,
    format: 'date-time',
    example: '2025-11-11T15:30:00.000Z',
  })
  updated_at!: Date;
}
