import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
  IsArray,
  IsDateString,
  MaxLength,
  MinLength,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateNotificationDto
 *
 * @description DTO para crear notificación ad-hoc (sin template)
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: POST /notifications
 *
 * Casos de uso:
 * - Notificaciones administrativas personalizadas
 * - Notificaciones de sistema no predefinidas
 * - Testing de notificaciones
 *
 * Para notificaciones basadas en templates, usar SendFromTemplateDto
 *
 * @example
 * {
 *   "userId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   "title": "Mantenimiento programado",
 *   "content": "El sistema estará en mantenimiento mañana de 2am a 4am",
 *   "notificationType": "system_maintenance",
 *   "channels": ["in_app", "email"],
 *   "metadata": { "maintenanceWindow": "2025-11-14T02:00:00Z" }
 * }
 */
export class CreateNotificationDto {
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
   * Título de la notificación
   *
   * Longitud: 1-255 caracteres
   *
   * @example "¡Felicidades! Has desbloqueado un logro"
   */
  @ApiProperty({
    description: 'Título de la notificación',
    example: '¡Felicidades! Has desbloqueado un logro',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  /**
   * Contenido/cuerpo de la notificación
   *
   * Puede ser texto plano o markdown
   *
   * @example "Has completado el módulo 1 y desbloqueaste el logro 'Pensador Crítico'"
   */
  @ApiProperty({
    description: 'Contenido/cuerpo de la notificación',
    example: "Has completado el módulo 1 y desbloqueaste el logro 'Pensador Crítico'",
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  /**
   * Tipo de notificación
   *
   * Determina:
   * - Preferencias del usuario (qué canales usar)
   * - Categorización en UI
   * - Iconos y colores en frontend
   *
   * Tipos comunes:
   * - achievement, rank_up, mission_completed
   * - assignment_due, assignment_graded
   * - friend_request, friend_accepted
   * - system_announcement, system_maintenance
   *
   * @example "achievement_unlocked"
   */
  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'achievement_unlocked',
  })
  @IsString()
  @IsNotEmpty()
  notificationType!: string;

  /**
   * Tipo de entidad relacionada (opcional)
   *
   * Permite enlazar la notificación a una entidad del sistema
   *
   * Ejemplos:
   * - "exercise" (ejercicio completado)
   * - "assignment" (tarea asignada)
   * - "achievement" (logro desbloqueado)
   * - "friend" (solicitud de amistad)
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
   * Junto con relatedEntityType, permite navegar desde la notificación
   * a la entidad correspondiente en el frontend
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
   * Objeto JSON con datos extra para la notificación
   *
   * Ejemplos:
   * - { achievementIcon: '🏆', points: 100 }
   * - { assignmentTitle: 'Ensayo Final', dueDate: '2025-11-20' }
   * - { friendName: 'Juan Pérez', friendAvatar: 'https://...' }
   *
   * @example { "achievementIcon": "🏆", "points": 100 }
   */
  @ApiPropertyOptional({
    description: 'Metadata adicional en formato JSON',
    example: { achievementIcon: '🏆', points: 100 },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  /**
   * Canales por los que enviar (opcional)
   *
   * Si no se especifica, usa defaults:
   * - in_app: true (siempre)
   * - email: depende de preferencias
   * - push: depende de preferencias
   *
   * Valores posibles: 'in_app', 'email', 'push'
   *
   * IMPORTANTE: Las preferencias del usuario SIEMPRE se respetan
   * Si el usuario tiene email deshabilitado, no se enviará aunque
   * se especifique aquí
   *
   * @example ["in_app", "email"]
   */
  @ApiPropertyOptional({
    description: 'Canales por los que enviar',
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
   * Fecha de expiración (opcional)
   *
   * Después de esta fecha, la notificación no se muestra al usuario
   * Útil para notificaciones con fecha límite (ej: "Oferta válida hasta...")
   *
   * Formato: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
   *
   * @example "2025-12-31T23:59:59.999Z"
   */
  @ApiPropertyOptional({
    description: 'Fecha de expiración (ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
