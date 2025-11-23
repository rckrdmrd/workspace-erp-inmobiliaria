import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * TemplateResponseDto
 *
 * @description DTO de respuesta para templates de notificaciones
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en responses de:
 * - GET /notifications/templates
 * - GET /notifications/templates/:templateKey
 *
 * @example
 * {
 *   "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
 *   "templateKey": "achievement_unlocked",
 *   "name": "Logro Desbloqueado",
 *   "description": "Notificación cuando un usuario desbloquea un logro",
 *   "subjectTemplate": "¡Felicidades {{user_name}}! Has desbloqueado {{achievement_icon}}",
 *   "bodyTemplate": "Has desbloqueado el logro '{{achievement_name}}' y ganaste {{points}} puntos.",
 *   "htmlTemplate": "<html>...</html>",
 *   "variables": ["user_name", "achievement_name", "achievement_icon", "points"],
 *   "defaultChannels": ["in_app", "email"],
 *   "isActive": true,
 *   "createdAt": "2025-11-01T00:00:00.000Z",
 *   "updatedAt": "2025-11-01T00:00:00.000Z"
 * }
 */
export class TemplateResponseDto {
  /**
   * UUID del template
   */
  @ApiProperty({
    description: 'UUID del template',
    example: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
  })
  id!: string;

  /**
   * Clave única del template
   *
   * Usado para referenciar el template al enviar notificaciones
   */
  @ApiProperty({
    description: 'Clave única del template',
    example: 'achievement_unlocked',
  })
  templateKey!: string;

  /**
   * Nombre descriptivo del template
   */
  @ApiProperty({
    description: 'Nombre descriptivo',
    example: 'Logro Desbloqueado',
  })
  name!: string;

  /**
   * Descripción del propósito del template
   */
  @ApiPropertyOptional({
    description: 'Descripción del template',
    example: 'Notificación cuando un usuario desbloquea un logro',
    nullable: true,
  })
  description?: string | null;

  /**
   * Template del asunto/título
   *
   * Soporta interpolación Mustache: {{variable_name}}
   */
  @ApiProperty({
    description: 'Template del asunto/título',
    example: '¡Felicidades {{user_name}}! Has desbloqueado {{achievement_icon}}',
  })
  subjectTemplate!: string;

  /**
   * Template del cuerpo (texto plano)
   *
   * Soporta interpolación Mustache: {{variable_name}}
   */
  @ApiProperty({
    description: 'Template del cuerpo',
    example: "Has desbloqueado el logro '{{achievement_name}}' y ganaste {{points}} puntos.",
  })
  bodyTemplate!: string;

  /**
   * Template HTML (para emails)
   *
   * Opcional, si no se proporciona se usa bodyTemplate
   */
  @ApiPropertyOptional({
    description: 'Template HTML',
    example: '<html><body>...</body></html>',
    nullable: true,
  })
  htmlTemplate?: string | null;

  /**
   * Variables requeridas para este template
   *
   * Array de nombres de variables que deben proporcionarse
   * al renderizar o enviar desde este template
   */
  @ApiPropertyOptional({
    description: 'Variables requeridas',
    example: ['user_name', 'achievement_name', 'achievement_icon', 'points'],
    type: [String],
    nullable: true,
  })
  variables?: string[] | null;

  /**
   * Canales por defecto para este template
   *
   * Usado si no se especifican canales al enviar
   */
  @ApiProperty({
    description: 'Canales por defecto',
    example: ['in_app', 'email'],
    type: [String],
  })
  defaultChannels!: string[];

  /**
   * Indica si el template está activo
   *
   * Templates inactivos no pueden ser usados para enviar notificaciones
   */
  @ApiProperty({
    description: 'Indica si el template está activo',
    example: true,
  })
  isActive!: boolean;

  /**
   * Fecha de creación
   */
  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-01T00:00:00.000Z',
  })
  createdAt!: Date;

  /**
   * Fecha de última actualización
   */
  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-11-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}

/**
 * TemplatesListResponseDto
 *
 * @description DTO de respuesta para lista de templates
 *
 * Usado en: GET /notifications/templates
 *
 * @example
 * {
 *   "templates": [
 *     { ...TemplateResponseDto },
 *     { ...TemplateResponseDto }
 *   ]
 * }
 */
export class TemplatesListResponseDto {
  /**
   * Array de templates
   */
  @ApiProperty({
    description: 'Array de templates',
    type: [TemplateResponseDto],
  })
  templates!: TemplateResponseDto[];
}

/**
 * RenderedTemplateResponseDto
 *
 * @description DTO de respuesta para template renderizado
 *
 * Usado en: POST /notifications/templates/:templateKey/render
 *
 * Retorna el template con las variables interpoladas
 * Sin crear ni enviar notificación (solo preview)
 *
 * @example
 * {
 *   "subject": "¡Felicidades Juan! Has desbloqueado 🏆",
 *   "body": "Has desbloqueado el logro 'Maestro del Pensamiento' y ganaste 100 puntos.",
 *   "html": "<html><body>...</body></html>"
 * }
 */
export class RenderedTemplateResponseDto {
  /**
   * Asunto/título renderizado
   */
  @ApiProperty({
    description: 'Asunto renderizado',
    example: '¡Felicidades Juan! Has desbloqueado 🏆',
  })
  subject!: string;

  /**
   * Cuerpo renderizado (texto plano)
   */
  @ApiProperty({
    description: 'Cuerpo renderizado',
    example: "Has desbloqueado el logro 'Maestro del Pensamiento' y ganaste 100 puntos.",
  })
  body!: string;

  /**
   * HTML renderizado
   */
  @ApiProperty({
    description: 'HTML renderizado',
    example: '<html><body>...</body></html>',
  })
  html!: string;
}
