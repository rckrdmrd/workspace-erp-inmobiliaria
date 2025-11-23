import {
  IsString,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * RenderTemplateDto
 *
 * @description DTO para renderizar template (preview sin enviar)
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: POST /notifications/templates/:templateKey/render
 *
 * Casos de uso:
 * - Preview de template en UI de admin
 * - Testing de interpolación de variables
 * - Validar que todas las variables están presentes
 *
 * NO crea ni envía notificación, solo renderiza el template
 *
 * @example
 * {
 *   "variables": {
 *     "user_name": "Juan Pérez",
 *     "achievement_name": "Maestro del Pensamiento Crítico",
 *     "achievement_icon": "🏆",
 *     "points": "100"
 *   }
 * }
 */
export class RenderTemplateDto {
  /**
   * Variables para interpolar en el template
   *
   * Las variables requeridas dependen del template
   * (definidas en notification_templates.variables)
   *
   * Formato Mustache: {{variable_name}}
   *
   * Si falta una variable requerida, se retorna error 400
   *
   * @example
   * {
   *   "user_name": "Juan",
   *   "achievement_name": "Maestro",
   *   "achievement_icon": "🏆",
   *   "points": "100"
   * }
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
}
