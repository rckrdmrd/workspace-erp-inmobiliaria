import { ApiProperty } from '@nestjs/swagger';

/**
 * PreferenceResponseDto
 *
 * @description DTO de respuesta para preferencias de notificaciones
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en responses de:
 * - GET /notifications/preferences
 * - PATCH /notifications/preferences/:notificationType
 * - PATCH /notifications/preferences (batch update)
 *
 * @example
 * {
 *   "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
 *   "userId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   "notificationType": "achievement",
 *   "inAppEnabled": true,
 *   "emailEnabled": false,
 *   "pushEnabled": true,
 *   "createdAt": "2025-11-13T10:00:00.000Z",
 *   "updatedAt": "2025-11-13T15:30:00.000Z"
 * }
 */
export class PreferenceResponseDto {
  /**
   * UUID de la preferencia
   */
  @ApiProperty({
    description: 'UUID de la preferencia',
    example: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  })
  id!: string;

  /**
   * UUID del usuario
   */
  @ApiProperty({
    description: 'UUID del usuario',
    example: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  })
  userId!: string;

  /**
   * Tipo de notificación
   *
   * Tipos comunes:
   * - achievement, rank_up, mission_completed
   * - assignment_due, assignment_graded
   * - friend_request, friend_accepted
   * - system_announcement
   */
  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'achievement',
  })
  notificationType!: string;

  /**
   * Indica si las notificaciones in-app están habilitadas
   */
  @ApiProperty({
    description: 'In-app habilitado',
    example: true,
  })
  inAppEnabled!: boolean;

  /**
   * Indica si las notificaciones por email están habilitadas
   */
  @ApiProperty({
    description: 'Email habilitado',
    example: false,
  })
  emailEnabled!: boolean;

  /**
   * Indica si las push notifications están habilitadas
   */
  @ApiProperty({
    description: 'Push habilitado',
    example: true,
  })
  pushEnabled!: boolean;

  /**
   * Fecha de creación
   */
  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-13T10:00:00.000Z',
  })
  createdAt!: Date;

  /**
   * Fecha de última actualización
   */
  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-11-13T15:30:00.000Z',
  })
  updatedAt!: Date;
}

/**
 * PreferencesListResponseDto
 *
 * @description DTO de respuesta para lista de preferencias
 *
 * Usado en: GET /notifications/preferences
 *
 * @example
 * {
 *   "preferences": [
 *     {
 *       "id": "...",
 *       "userId": "...",
 *       "notificationType": "achievement",
 *       "inAppEnabled": true,
 *       "emailEnabled": false,
 *       "pushEnabled": true,
 *       ...
 *     },
 *     {
 *       "id": "...",
 *       "userId": "...",
 *       "notificationType": "friend_request",
 *       "inAppEnabled": true,
 *       "emailEnabled": true,
 *       "pushEnabled": false,
 *       ...
 *     }
 *   ]
 * }
 */
export class PreferencesListResponseDto {
  /**
   * Array de preferencias
   */
  @ApiProperty({
    description: 'Array de preferencias del usuario',
    type: [PreferenceResponseDto],
  })
  preferences!: PreferenceResponseDto[];
}
