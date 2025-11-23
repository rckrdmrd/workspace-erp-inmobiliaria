import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
  IsArray,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * SendFromTemplateDto
 *
 * @description DTO para enviar notificación desde template predefinido
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: POST /notifications/send-from-template
 *
 * Ventajas de usar templates:
 * - Mensajes consistentes y profesionales
 * - Soporte multi-idioma (futuro)
 * - Interpolación automática de variables
 * - HTML pre-diseñado para emails
 * - Fácil de actualizar sin cambiar código
 *
 * Templates disponibles (seeded en DB):
 * 1. welcome_message - Mensaje de bienvenida
 * 2. achievement_unlocked - Logro desbloqueado
 * 3. rank_up - Subida de rango
 * 4. assignment_due_reminder - Recordatorio de tarea
 * 5. friend_request - Solicitud de amistad
 * 6. mission_completed - Misión completada
 * 7. system_announcement - Anuncio del sistema
 * 8. password_reset - Reseteo de contraseña
 *
 * @example
 * {
 *   "templateKey": "achievement_unlocked",
 *   "userId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   "variables": {
 *     "user_name": "Juan Pérez",
 *     "achievement_name": "Maestro del Pensamiento Crítico",
 *     "achievement_icon": "🏆",
 *     "points": "100"
 *   },
 *   "channels": ["in_app", "email"],
 *   "relatedEntityType": "achievement",
 *   "relatedEntityId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
 * }
 */
export class SendFromTemplateDto {
  /**
   * Clave única del template
   *
   * Debe existir en la tabla notification_templates y estar activo
   *
   * Templates disponibles:
   * - welcome_message
   * - achievement_unlocked
   * - rank_up
   * - assignment_due_reminder
   * - friend_request
   * - mission_completed
   * - system_announcement
   * - password_reset
   *
   * @example "achievement_unlocked"
   */
  @ApiProperty({
    description: 'Clave única del template',
    example: 'achievement_unlocked',
  })
  @IsString()
  @IsNotEmpty()
  templateKey!: string;

  /**
   * UUID del usuario destinatario
   *
   * @example "cccccccc-cccc-cccc-cccc-cccccccccccc"
   */
  @ApiProperty({
    description: 'UUID del usuario destinatario',
    example: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  })
  @IsUUID(4)
  @IsNotEmpty()
  userId!: string;

  /**
   * Variables para interpolar en el template
   *
   * Cada template tiene sus propias variables requeridas
   * (definidas en notification_templates.variables)
   *
   * Formato Mustache: {{variable_name}}
   *
   * Ejemplo para "achievement_unlocked":
   * {
   *   "user_name": "Juan",
   *   "achievement_name": "Maestro del Pensamiento",
   *   "achievement_icon": "🏆",
   *   "points": "100"
   * }
   *
   * Si falta una variable requerida, se retorna error 400
   *
   * @example { "user_name": "Juan", "achievement_name": "Maestro", "achievement_icon": "🏆" }
   */
  @ApiProperty({
    description: 'Variables para interpolar en el template',
    example: {
      user_name: 'Juan',
      achievement_name: 'Maestro del Pensamiento',
      achievement_icon: '🏆',
      points: '100',
    },
  })
  @IsObject()
  @IsNotEmpty()
  variables!: Record<string, string>;

  /**
   * Canales por los que enviar (opcional)
   *
   * Si no se especifica, usa default_channels del template
   *
   * Valores posibles: 'in_app', 'email', 'push'
   *
   * IMPORTANTE: Las preferencias del usuario SIEMPRE se respetan
   *
   * @example ["in_app", "email"]
   */
  @ApiPropertyOptional({
    description: 'Canales por los que enviar (sobrescribe defaults del template)',
    example: ['in_app', 'email'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsIn(['in_app', 'email', 'push'], { each: true })
  @IsOptional()
  channels?: string[];

  /**
   * Tipo de entidad relacionada (opcional)
   *
   * @example "achievement"
   */
  @ApiPropertyOptional({
    description: 'Tipo de entidad relacionada',
    example: 'achievement',
  })
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  /**
   * UUID de la entidad relacionada (opcional)
   *
   * @example "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
   */
  @ApiPropertyOptional({
    description: 'UUID de la entidad relacionada',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  @IsUUID(4)
  @IsOptional()
  relatedEntityId?: string;

  /**
   * Metadata adicional (opcional)
   *
   * Complementa las variables del template con datos extra
   *
   * @example { "category": "academic", "priority": "high" }
   */
  @ApiPropertyOptional({
    description: 'Metadata adicional',
    example: { category: 'academic', priority: 'high' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
