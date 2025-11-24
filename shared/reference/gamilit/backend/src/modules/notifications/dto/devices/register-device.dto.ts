import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * RegisterDeviceDto
 *
 * @description DTO para registrar dispositivo para push notifications
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: POST /notifications/devices
 *
 * Flujo de registro:
 * 1. App obtiene device token de Firebase Cloud Messaging (FCM)
 * 2. App envía token + metadata a backend
 * 3. Backend registra con upsert (actualiza si existe)
 * 4. Usuario queda habilitado para recibir push
 *
 * IMPORTANTE:
 * - Device tokens son únicos por dispositivo + app + usuario
 * - Pueden cambiar si app se reinstala o permisos se revocan
 * - Cliente debe re-registrar cuando obtiene nuevo token
 * - Backend maneja duplicados automáticamente (upsert)
 *
 * Tipos de dispositivos:
 * - 'ios' - iPhone/iPad (APNS via FCM)
 * - 'android' - Android devices (FCM nativo)
 * - 'web' - Navegadores web (Web Push API via FCM)
 *
 * @example
 * {
 *   "deviceToken": "dUzV1qzxTHGKj8qY9ZxYzP:APA91bF8h2k...",
 *   "deviceType": "android",
 *   "deviceName": "Samsung Galaxy S21"
 * }
 */
export class RegisterDeviceDto {
  /**
   * Token del dispositivo (FCM token)
   *
   * Identificador único del dispositivo en Firebase Cloud Messaging
   *
   * Formato varía por plataforma:
   * - iOS: 64 caracteres hexadecimales
   * - Android: ~150 caracteres alfanuméricos
   * - Web: ~150 caracteres alfanuméricos
   *
   * IMPORTANTE:
   * - Obtener con Firebase SDK en cliente
   * - iOS: `messaging().getToken()`
   * - Android: `FirebaseMessaging.getInstance().token`
   * - Web: `getToken(messaging, { vapidKey: '...' })`
   *
   * @example "dUzV1qzxTHGKj8qY9ZxYzP:APA91bF8h2k3jL9pQ..."
   */
  @ApiProperty({
    description: 'Token del dispositivo (FCM token)',
    example: 'dUzV1qzxTHGKj8qY9ZxYzP:APA91bF8h2k3jL9pQ...',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  deviceToken!: string;

  /**
   * Tipo de dispositivo/plataforma
   *
   * Valores permitidos:
   * - 'ios' - iPhone/iPad (iOS 10+)
   * - 'android' - Dispositivos Android (5.0+)
   * - 'web' - Navegadores web con Web Push API
   *
   * Usado para:
   * - Estadísticas de adopción
   * - Troubleshooting de problemas específicos
   * - Formato de payload (puede variar ligeramente)
   *
   * @example "android"
   */
  @ApiProperty({
    description: 'Tipo de dispositivo',
    example: 'android',
    enum: ['ios', 'android', 'web'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ios', 'android', 'web'])
  deviceType!: string;

  /**
   * Nombre descriptivo del dispositivo (opcional)
   *
   * Proporcionado por cliente para ayudar al usuario a identificar
   * el dispositivo en settings
   *
   * Ejemplos:
   * - "iPhone 13 de Juan"
   * - "Samsung Galaxy S21"
   * - "Chrome en MacBook"
   * - "Firefox en Windows"
   *
   * Útil para:
   * - UI de gestión de dispositivos
   * - Usuario puede ver qué dispositivos tiene registrados
   * - Usuario puede desactivar dispositivos específicos
   *
   * Si no se proporciona, backend usa deviceType genérico
   *
   * @example "Samsung Galaxy S21"
   */
  @ApiPropertyOptional({
    description: 'Nombre descriptivo del dispositivo',
    example: 'Samsung Galaxy S21',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  deviceName?: string;
}

/**
 * UpdateDeviceNameDto
 *
 * @description DTO para actualizar nombre de dispositivo
 *
 * Usado en: PATCH /notifications/devices/:deviceId
 *
 * @example
 * {
 *   "deviceName": "Mi iPhone 13 Pro"
 * }
 */
export class UpdateDeviceNameDto {
  /**
   * Nuevo nombre descriptivo
   *
   * @example "Mi iPhone 13 Pro"
   */
  @ApiProperty({
    description: 'Nuevo nombre descriptivo del dispositivo',
    example: 'Mi iPhone 13 Pro',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  deviceName!: string;
}
