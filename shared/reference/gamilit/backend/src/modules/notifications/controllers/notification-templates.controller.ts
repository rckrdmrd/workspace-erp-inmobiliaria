import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationTemplateService } from '../services/notification-template.service';
import { JwtAuthGuard } from '@/modules/auth/guards';
import {
  RenderTemplateDto,
  TemplateResponseDto,
  TemplatesListResponseDto,
  RenderedTemplateResponseDto,
} from '../dto/templates';

/**
 * NotificationTemplatesController
 *
 * @description Controller para templates de notificaciones multi-canal (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Rutas: /notifications/templates/*
 *
 * Endpoints:
 * - GET /templates - Obtener todos los templates
 * - GET /templates/:templateKey - Obtener template específico
 * - POST /templates/:templateKey/render - Renderizar template (preview)
 *
 * Seguridad:
 * - Todos los endpoints requieren autenticación JWT
 * - Acceso de solo lectura para usuarios normales
 * - Solo admin puede modificar templates (endpoints futuros)
 *
 * IMPORTANTE:
 * - Templates disponibles (seeded en DB):
 *   1. welcome_message
 *   2. achievement_unlocked
 *   3. rank_up
 *   4. assignment_due_reminder
 *   5. friend_request
 *   6. mission_completed
 *   7. system_announcement
 *   8. password_reset
 */
@ApiTags('notifications-templates')
@Controller('notifications/templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationTemplatesController {
  constructor(
    private readonly templateService: NotificationTemplateService,
  ) {}

  /**
   * GET /notifications/templates
   *
   * Obtener todos los templates activos
   *
   * Útil para:
   * - UI de admin (gestión de templates)
   * - UI de developer (ver templates disponibles)
   * - Documentación de API
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los templates',
    description:
      'Retorna lista de templates activos disponibles para enviar notificaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de templates obtenida exitosamente',
    type: TemplatesListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getAllTemplates(): Promise<TemplatesListResponseDto> {
    const templates = await this.templateService.findAll({ isActive: true });

    return {
      templates: templates as TemplateResponseDto[],
    };
  }

  /**
   * GET /notifications/templates/:templateKey
   *
   * Obtener template específico por clave
   *
   * Retorna:
   * - subject_template con placeholders {{variable}}
   * - body_template con placeholders
   * - html_template (si existe)
   * - variables requeridas
   * - default_channels
   */
  @Get(':templateKey')
  @ApiOperation({
    summary: 'Obtener template por clave',
    description:
      'Retorna un template específico con toda su configuración y variables requeridas',
  })
  @ApiParam({
    name: 'templateKey',
    description: 'Clave única del template (ej: achievement_unlocked)',
    example: 'achievement_unlocked',
  })
  @ApiResponse({
    status: 200,
    description: 'Template encontrado',
    type: TemplateResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Template no encontrado o inactivo',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getTemplateByKey(
    @Param('templateKey') templateKey: string,
  ): Promise<TemplateResponseDto> {
    const template = await this.templateService.findByKey(templateKey);
    return template as TemplateResponseDto;
  }

  /**
   * POST /notifications/templates/:templateKey/render
   *
   * Renderizar template con variables (preview)
   *
   * Casos de uso:
   * - Preview en UI de admin antes de enviar
   * - Testing de interpolación de variables
   * - Validar que todas las variables están presentes
   *
   * IMPORTANTE:
   * - NO crea ni envía notificación
   * - Solo renderiza el template con las variables proporcionadas
   * - Retorna subject, body y html renderizados
   */
  @Post(':templateKey/render')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renderizar template (preview)',
    description:
      'Renderiza un template con variables sin crear notificación. ' +
      'Útil para preview y testing.',
  })
  @ApiParam({
    name: 'templateKey',
    description: 'Clave única del template',
    example: 'achievement_unlocked',
  })
  @ApiResponse({
    status: 200,
    description: 'Template renderizado exitosamente',
    type: RenderedTemplateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Variables faltantes o inválidas',
  })
  @ApiResponse({
    status: 404,
    description: 'Template no encontrado o inactivo',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async renderTemplate(
    @Param('templateKey') templateKey: string,
    @Body() renderDto: RenderTemplateDto,
  ): Promise<RenderedTemplateResponseDto> {
    const rendered = await this.templateService.renderTemplate(
      templateKey,
      renderDto.variables,
    );

    return {
      subject: rendered.subject,
      body: rendered.body,
      html: rendered.html,
    };
  }
}
