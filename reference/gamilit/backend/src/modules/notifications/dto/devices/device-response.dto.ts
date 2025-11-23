import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DeviceResponseDto
 *
 * @description DTO de respuesta para dispositivos registrados
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en responses de:
 * - POST /notifications/devices
 * - GET /notifications/devices
 * - GET /notifications/devices/:id
 * - PATCH /notifications/devices/:id
 *
 * IMPORTANTE:
 * - deviceToken se oculta parcialmente por seguridad (primeros 20 chars)
 * - Solo se muestra completo en registro inicial
 *
 * @example
 * {
 *   "id": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
 *   "userId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   "deviceToken": "dUzV1qzxTHGKj8qY9ZxY...",
 *   "deviceType": "android",
 *   "deviceName": "Samsung Galaxy S21",
 *   "isActive": true,
 *   "lastUsedAt": "2025-11-13T10:30:00.000Z",
 *   "createdAt": "2025-11-01T08:00:00.000Z"
 * }
 */
export class DeviceResponseDto {
  /**
   * UUID del dispositivo
   */
  @ApiProperty({
    description: 'UUID del dispositivo',
    example: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  })
  id!: string;

  /**
   * UUID del usuario propietario
   */
  @ApiProperty({
    description: 'UUID del usuario propietario',
    example: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  })
  userId!: string;

  /**
   * Token del dispositivo (parcialmente oculto)
   *
   * Por seguridad, se muestra solo los primeros 20 caracteres + "..."
   * Token completo solo se necesita internamente para envío
   *
   * @example "dUzV1qzxTHGKj8qY9ZxY..."
   */
  @ApiProperty({
    description: 'Token del dispositivo (parcialmente oculto)',
    example: 'dUzV1qzxTHGKj8qY9ZxY...',
  })
  deviceToken!: string;

  /**
   * Tipo de dispositivo
   *
   * Valores: 'ios', 'android', 'web'
   */
  @ApiProperty({
    description: 'Tipo de dispositivo',
    example: 'android',
    enum: ['ios', 'android', 'web'],
  })
  deviceType!: string;

  /**
   * Nombre descriptivo del dispositivo
   */
  @ApiPropertyOptional({
    description: 'Nombre descriptivo del dispositivo',
    example: 'Samsung Galaxy S21',
    nullable: true,
  })
  deviceName?: string | null;

  /**
   * Indica si el dispositivo está activo
   *
   * Solo dispositivos activos reciben push notifications
   */
  @ApiProperty({
    description: 'Indica si el dispositivo está activo',
    example: true,
  })
  isActive!: boolean;

  /**
   * Última vez que se usó el dispositivo
   *
   * Se actualiza:
   * - Al abrir la app
   * - Al enviar push exitosamente
   * - Al reconectar el dispositivo
   */
  @ApiPropertyOptional({
    description: 'Última vez que se usó el dispositivo',
    example: '2025-11-13T10:30:00.000Z',
    nullable: true,
  })
  lastUsedAt?: Date | null;

  /**
   * Fecha de registro del dispositivo
   */
  @ApiProperty({
    description: 'Fecha de registro',
    example: '2025-11-01T08:00:00.000Z',
  })
  createdAt!: Date;
}

/**
 * DevicesListResponseDto
 *
 * @description DTO de respuesta para lista de dispositivos
 *
 * Usado en: GET /notifications/devices
 *
 * @example
 * {
 *   "devices": [
 *     {
 *       "id": "...",
 *       "userId": "...",
 *       "deviceToken": "dUzV1qzxTHGKj8qY9ZxY...",
 *       "deviceType": "android",
 *       "deviceName": "Samsung Galaxy S21",
 *       "isActive": true,
 *       "lastUsedAt": "2025-11-13T10:30:00.000Z",
 *       "createdAt": "2025-11-01T08:00:00.000Z"
 *     },
 *     {
 *       "id": "...",
 *       "userId": "...",
 *       "deviceToken": "fR9kL2mP4qT7s...",
 *       "deviceType": "ios",
 *       "deviceName": "iPhone 13",
 *       "isActive": true,
 *       "lastUsedAt": "2025-11-12T18:45:00.000Z",
 *       "createdAt": "2025-10-15T12:00:00.000Z"
 *     }
 *   ]
 * }
 */
export class DevicesListResponseDto {
  /**
   * Array de dispositivos
   */
  @ApiProperty({
    description: 'Array de dispositivos del usuario',
    type: [DeviceResponseDto],
  })
  devices!: DeviceResponseDto[];
}

/**
 * DeviceStatsResponseDto
 *
 * @description DTO de respuesta para estadísticas de dispositivos
 *
 * Usado en: GET /notifications/devices/stats (admin endpoint)
 *
 * @example
 * {
 *   "total": 1523,
 *   "active": 1204,
 *   "inactive": 319,
 *   "byType": {
 *     "ios": 645,
 *     "android": 823,
 *     "web": 55
 *   }
 * }
 */
export class DeviceStatsResponseDto {
  /**
   * Número total de dispositivos registrados
   */
  @ApiProperty({
    description: 'Número total de dispositivos',
    example: 1523,
  })
  total!: number;

  /**
   * Número de dispositivos activos
   */
  @ApiProperty({
    description: 'Número de dispositivos activos',
    example: 1204,
  })
  active!: number;

  /**
   * Número de dispositivos inactivos
   */
  @ApiProperty({
    description: 'Número de dispositivos inactivos',
    example: 319,
  })
  inactive!: number;

  /**
   * Distribución por tipo de dispositivo
   */
  @ApiProperty({
    description: 'Distribución por tipo',
    example: { ios: 645, android: 823, web: 55 },
  })
  byType!: Record<string, number>;
}
