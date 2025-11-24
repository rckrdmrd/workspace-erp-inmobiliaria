import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { GetNotificationsQueryDto } from '../dto/get-notifications-query.dto';
import { PaginatedNotificationsDto } from '../dto/paginated-notifications.dto';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { AccountStatusGuard } from '../../../shared/guards/account-status.guard';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(AccountStatusGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications
   * Obtiene las notificaciones del usuario con filtros y paginación
   */
  @Get()
  @ApiOperation({
    summary: 'Get user notifications',
    description: 'Retrieves notifications for the authenticated user with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: PaginatedNotificationsDto,
  })
  @Permissions('gamification:read')
  async getNotifications(
    @CurrentUser('sub') userId: string,
    @Query() query: GetNotificationsQueryDto,
  ): Promise<PaginatedNotificationsDto> {
    return this.notificationsService.getNotifications(userId, query);
  }

  /**
   * GET /notifications/unread-count
   * Obtiene el número de notificaciones no leídas
   */
  @Get('unread-count')
  @ApiOperation({
    summary: 'Get unread notifications count',
    description: 'Returns the number of unread notifications for the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 5 },
      },
    },
  })
  @Permissions('gamification:read')
  async getUnreadCount(
    @CurrentUser('sub') userId: string,
  ): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  /**
   * GET /notifications/stats
   * Obtiene estadísticas de notificaciones
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get notification statistics',
    description: 'Returns statistics about user notifications (total, unread, by type)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 50 },
        unread: { type: 'number', example: 5 },
        byType: {
          type: 'object',
          properties: {
            achievement: { type: 'number', example: 10 },
            mission: { type: 'number', example: 15 },
            reward: { type: 'number', example: 8 },
            system: { type: 'number', example: 7 },
            social: { type: 'number', example: 5 },
            educational: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @Permissions('gamification:read')
  async getStats(@CurrentUser('sub') userId: string) {
    return this.notificationsService.getUserNotificationStats(userId);
  }

  /**
   * PATCH /notifications/:id/read
   * Marca una notificación como leída
   */
  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Marks a specific notification as read',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - notification does not belong to user',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  @Permissions('gamification:write')
  async markAsRead(
    @Param('id', ParseUUIDPipe) notificationId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markAsRead(notificationId, userId);
  }

  /**
   * POST /notifications/read-all
   * Marca todas las notificaciones como leídas
   */
  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description: 'Marks all user notifications as read',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    schema: {
      type: 'object',
      properties: {
        updated: { type: 'number', example: 5 },
      },
    },
  })
  @Permissions('gamification:write')
  async markAllAsRead(
    @CurrentUser('sub') userId: string,
  ): Promise<{ updated: number }> {
    return this.notificationsService.markAllAsRead(userId);
  }

  /**
   * DELETE /notifications/:id
   * Elimina una notificación específica
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete notification',
    description: 'Deletes a specific notification',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - notification does not belong to user',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  @Permissions('gamification:write')
  async deleteNotification(
    @Param('id', ParseUUIDPipe) notificationId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<{ deleted: boolean }> {
    return this.notificationsService.deleteNotification(notificationId, userId);
  }

  /**
   * DELETE /notifications/clear-all
   * Limpia todas las notificaciones leídas
   */
  @Delete('clear-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear all read notifications',
    description: 'Deletes all read notifications for the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Read notifications cleared',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'number', example: 10 },
      },
    },
  })
  @Permissions('gamification:write')
  async clearAll(
    @CurrentUser('sub') userId: string,
  ): Promise<{ deleted: number }> {
    return this.notificationsService.clearAll(userId);
  }

  /**
   * POST /notifications
   * Envía una nueva notificación (solo sistema)
   */
  @Post()
  @ApiOperation({
    summary: 'Send notification (System only)',
    description: 'Internal endpoint to send notifications to users',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification sent successfully',
    type: NotificationResponseDto,
  })
  @Permissions('system:webhook')
  async sendNotification(
    @Body() createDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.sendNotification(createDto);
  }
}
