import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '@/modules/auth/guards';
import {
  CreateNotificationDto,
  SendFromTemplateDto,
  NotificationResponseDto,
} from '../dto/notifications';

/**
 * NotificationMultiChannelController
 *
 * @description Controller para creación de notificaciones multi-canal (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Rutas: /notifications/multichannel/*
 *
 * Endpoints:
 * - POST /multichannel - Crear notificación ad-hoc multi-canal
 * - POST /multichannel/send-from-template - Enviar desde template
 *
 * Seguridad:
 * - Todos los endpoints requieren autenticación JWT
 * - Usuario normal solo puede crear para sí mismo
 * - Admin puede crear para cualquier usuario (validación futura)
 *
 * IMPORTANTE:
 * - userId se extrae del JWT (req.user.sub)
 * - Las preferencias del usuario se respetan automáticamente
 * - Integración con función SQL send_notification()
 * - Sistema de cola asíncrona para email/push
 *
 * Diferencia con sistema básico (/notifications):
 * - Sistema básico: notificaciones in-app simples (gamification_system.notifications)
 * - Sistema multi-canal: in_app + email + push con templates (notifications schema)
 */
@ApiTags('notifications-multichannel')
@Controller('notifications/multichannel')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationMultiChannelController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * POST /notifications/multichannel
   *
   * Crear notificación ad-hoc multi-canal
   *
   * Casos de uso:
   * - Notificaciones administrativas personalizadas
   * - Notificaciones de sistema no predefinidas
   * - Testing de notificaciones multi-canal
   *
   * Flujo:
   * 1. Se crea notificación en tabla notifications.notifications
   * 2. Se llama función SQL send_notification()
   * 3. Función SQL valida preferencias del usuario
   * 4. Se encola para cada canal habilitado (email, push)
   * 5. In-app se procesa síncronamente
   * 6. Worker procesa cola asíncronamente
   *
   * IMPORTANTE:
   * - Usuario normal solo puede crear para sí mismo
   * - Admin puede crear para cualquier usuario (futuro)
   * - Las preferencias del usuario SIEMPRE se respetan
   * - Si usuario tiene email deshabilitado, no se envía aunque se especifique
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear notificación multi-canal ad-hoc',
    description:
      'Crea y envía una notificación personalizada por múltiples canales. ' +
      'Las preferencias del usuario se respetan automáticamente. ' +
      'In-app se procesa síncronamente, email/push se encolan.',
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada exitosamente',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'No puedes crear notificaciones para otros usuarios',
  })
  async createMultiChannel(
    @Body() createDto: CreateNotificationDto,
    @Request() req: any,
  ): Promise<NotificationResponseDto> {
    // Validar que el usuario solo crea notificaciones para sí mismo
    // (a menos que sea admin - validación futura)
    if (createDto.userId !== req.user.sub) {
      // TODO: Permitir si es admin
      throw new Error('Cannot create notifications for other users');
    }

    const notification = await this.notificationService.create({
      userId: createDto.userId,
      title: createDto.title,
      content: createDto.content,
      notificationType: createDto.notificationType,
      relatedEntityType: createDto.relatedEntityType,
      relatedEntityId: createDto.relatedEntityId,
      metadata: createDto.metadata,
      channels: createDto.channels,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
    });

    return notification as NotificationResponseDto;
  }

  /**
   * POST /notifications/multichannel/send-from-template
   *
   * Enviar notificación multi-canal desde template predefinido
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
   * Flujo:
   * 1. Se obtiene template de DB
   * 2. Se validan variables requeridas
   * 3. Se interpolan variables (Mustache-style: {{variable}})
   * 4. Se crea notificación con contenido renderizado
   * 5. Se envía por canales especificados (o defaults del template)
   */
  @Post('send-from-template')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enviar notificación multi-canal desde template',
    description:
      'Crea y envía una notificación usando un template predefinido. ' +
      'Las variables se interpolan automáticamente. ' +
      'Las preferencias del usuario se respetan.',
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación enviada exitosamente',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Template no encontrado o variables faltantes',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'No puedes crear notificaciones para otros usuarios',
  })
  async sendFromTemplate(
    @Body() sendDto: SendFromTemplateDto,
    @Request() req: any,
  ): Promise<NotificationResponseDto> {
    // Validar ownership
    if (sendDto.userId !== req.user.sub) {
      // TODO: Permitir si es admin
      throw new Error('Cannot create notifications for other users');
    }

    const notification = await this.notificationService.sendFromTemplate({
      templateKey: sendDto.templateKey,
      userId: sendDto.userId,
      variables: sendDto.variables,
      channels: sendDto.channels,
      relatedEntityType: sendDto.relatedEntityType,
      relatedEntityId: sendDto.relatedEntityId,
      metadata: sendDto.metadata,
    });

    return notification as NotificationResponseDto;
  }
}
