import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdatePreferenceDto
 *
 * @description DTO para actualizar preferencias de notificaciones
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: PATCH /notifications/preferences/:notificationType
 *
 * Permite al usuario configurar por qué canales quiere recibir
 * cada tipo de notificación
 *
 * Defaults si no se configura:
 * - in_app_enabled: true
 * - email_enabled: true
 * - push_enabled: false
 *
 * @example
 * {
 *   "inAppEnabled": true,
 *   "emailEnabled": false,
 *   "pushEnabled": true
 * }
 */
export class UpdatePreferenceDto {
  /**
   * Habilitar notificaciones in-app
   *
   * In-app = notificaciones dentro de la plataforma
   * (campana de notificaciones en UI)
   *
   * @example true
   */
  @ApiPropertyOptional({
    description: 'Habilitar notificaciones in-app',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean;

  /**
   * Habilitar notificaciones por email
   *
   * @example false
   */
  @ApiPropertyOptional({
    description: 'Habilitar notificaciones por email',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  /**
   * Habilitar push notifications
   *
   * Requiere que el usuario tenga dispositivos registrados
   *
   * @example true
   */
  @ApiPropertyOptional({
    description: 'Habilitar push notifications',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;
}

/**
 * UpdateMultiplePreferencesItemDto
 *
 * @description Item individual para actualización batch de preferencias
 *
 * Usado dentro de UpdateMultiplePreferencesDto
 */
export class UpdateMultiplePreferencesItemDto {
  /**
   * Tipo de notificación
   *
   * @example "achievement"
   */
  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'achievement',
  })
  @IsString()
  @IsNotEmpty()
  notificationType!: string;

  /**
   * Habilitar in-app
   */
  @ApiPropertyOptional({
    description: 'Habilitar in-app',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean;

  /**
   * Habilitar email
   */
  @ApiPropertyOptional({
    description: 'Habilitar email',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  /**
   * Habilitar push
   */
  @ApiPropertyOptional({
    description: 'Habilitar push',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;
}

/**
 * UpdateMultiplePreferencesDto
 *
 * @description DTO para actualizar múltiples preferencias en batch
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: PATCH /notifications/preferences
 *
 * Permite actualizar preferencias de varios tipos de notificaciones
 * en una sola llamada
 *
 * Útil para:
 * - Pantalla de settings con múltiples toggles
 * - Sincronizar preferencias desde otra fuente
 * - Configuración inicial del usuario
 *
 * @example
 * {
 *   "preferences": [
 *     {
 *       "notificationType": "achievement",
 *       "inAppEnabled": true,
 *       "emailEnabled": false,
 *       "pushEnabled": true
 *     },
 *     {
 *       "notificationType": "friend_request",
 *       "inAppEnabled": true,
 *       "emailEnabled": true,
 *       "pushEnabled": false
 *     }
 *   ]
 * }
 */
export class UpdateMultiplePreferencesDto {
  /**
   * Array de preferencias a actualizar
   */
  @ApiProperty({
    description: 'Array de preferencias a actualizar',
    type: [UpdateMultiplePreferencesItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMultiplePreferencesItemDto)
  preferences!: UpdateMultiplePreferencesItemDto[];
}
