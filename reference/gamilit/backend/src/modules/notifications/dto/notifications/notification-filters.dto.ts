import {
  IsOptional,
  IsBoolean,
  IsString,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * NotificationFiltersDto
 *
 * @description DTO para filtrar y paginar notificaciones
 * @version 1.0 (2025-11-13) - EXT-003
 *
 * Usado en: GET /notifications (query params)
 *
 * Casos de uso:
 * - Obtener solo notificaciones no leídas
 * - Filtrar por tipo de notificación
 * - Obtener notificaciones de un rango de fechas
 * - Paginar resultados
 *
 * @example
 * GET /notifications?isRead=false&limit=20&offset=0
 * GET /notifications?notificationType=achievement&from=2025-11-01&to=2025-11-30
 */
export class NotificationFiltersDto {
  /**
   * Filtrar por estado leído/no leído
   *
   * - true: solo notificaciones leídas
   * - false: solo notificaciones no leídas
   * - undefined: todas las notificaciones
   *
   * @example false
   */
  @ApiPropertyOptional({
    description: 'Filtrar por estado leído (true) o no leído (false)',
    example: false,
    type: Boolean,
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  /**
   * Filtrar por tipo de notificación
   *
   * Tipos comunes:
   * - achievement, rank_up, mission_completed
   * - assignment_due, assignment_graded
   * - friend_request, friend_accepted
   * - system_announcement
   *
   * @example "achievement"
   */
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de notificación',
    example: 'achievement',
  })
  @IsString()
  @IsOptional()
  notificationType?: string;

  /**
   * Fecha desde (inclusive)
   *
   * Formato: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
   *
   * @example "2025-11-01T00:00:00.000Z"
   */
  @ApiPropertyOptional({
    description: 'Fecha desde (ISO 8601)',
    example: '2025-11-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  /**
   * Fecha hasta (inclusive)
   *
   * Formato: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
   *
   * @example "2025-11-30T23:59:59.999Z"
   */
  @ApiPropertyOptional({
    description: 'Fecha hasta (ISO 8601)',
    example: '2025-11-30T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  /**
   * Número de resultados por página
   *
   * Rango: 1-100
   * Default: 50
   *
   * @example 20
   */
  @ApiPropertyOptional({
    description: 'Número de resultados por página (1-100)',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 50,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  /**
   * Offset para paginación
   *
   * Número de resultados a saltar
   *
   * @example 0
   */
  @ApiPropertyOptional({
    description: 'Offset para paginación',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;
}
