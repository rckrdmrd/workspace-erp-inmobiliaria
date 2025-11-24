import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTypeEnum } from '@shared/constants/enums.constants';
import { Notification } from '../entities/notification.entity';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { GetNotificationsQueryDto } from '../dto/get-notifications-query.dto';
import { PaginatedNotificationsDto } from '../dto/paginated-notifications.dto';
import { WebSocketService } from '../../websocket/websocket.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification, 'gamification')
    private readonly notificationRepository: Repository<Notification>,
    private readonly webSocketService: WebSocketService,
  ) {}

  /**
   * Obtiene las notificaciones del usuario con filtros y paginación
   */
  async getNotifications(
    userId: string,
    query: GetNotificationsQueryDto,
  ): Promise<PaginatedNotificationsDto> {
    const { type, read, page = 1, limit = 20 } = query;

    // Build where clause
    const where: any = { userId };

    if (type !== undefined) {
      where.type = type;
    }

    if (read !== undefined) {
      where.read = read;
    }

    // Get total count
    const total = await this.notificationRepository.count({ where });

    // Get paginated results
    const notifications = await this.notificationRepository.find({
      where,
      order: {
        createdAt: 'DESC', // Most recent first
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: notifications.map((n) => this.mapToResponseDto(n)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Obtiene el número de notificaciones no leídas
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, read: false },
    });
  }

  /**
   * Marca una notificación como leída
   */
  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    // Verify ownership
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this notification',
      );
    }

    // Mark as read if not already
    if (!notification.read) {
      notification.read = true;
      await this.notificationRepository.save(notification);
      this.logger.log(
        `Notification ${notificationId} marked as read by user ${userId}`,
      );

      // Emit unread count update via WebSocket
      const unreadCount = await this.getUnreadCount(userId);
      this.webSocketService.emitUnreadCountUpdate(userId, unreadCount);
    }

    return this.mapToResponseDto(notification);
  }

  /**
   * Marca todas las notificaciones del usuario como leídas
   */
  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationRepository.update(
      { userId, read: false },
      { read: true },
    );

    const updated = result.affected || 0;

    this.logger.log(`Marked ${updated} notifications as read for user ${userId}`);

    // Emit unread count update via WebSocket (should be 0 now)
    if (updated > 0) {
      this.webSocketService.emitUnreadCountUpdate(userId, 0);
    }

    return { updated };
  }

  /**
   * Elimina una notificación específica
   */
  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<{ deleted: boolean }> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    // Verify ownership
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this notification',
      );
    }

    await this.notificationRepository.remove(notification);

    this.logger.log(
      `Notification ${notificationId} deleted by user ${userId}`,
    );

    // Emit notification deleted event via WebSocket
    this.webSocketService.emitNotificationDeleted(userId, notificationId);

    return { deleted: true };
  }

  /**
   * Limpia todas las notificaciones leídas del usuario
   */
  async clearAll(userId: string): Promise<{ deleted: number }> {
    const result = await this.notificationRepository.delete({
      userId,
      read: true,
    });

    const deleted = result.affected || 0;

    this.logger.log(
      `Cleared ${deleted} read notifications for user ${userId}`,
    );

    return { deleted };
  }

  /**
   * Envía una nueva notificación (uso interno del sistema)
   */
  async sendNotification(
    createDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = this.notificationRepository.create({
      userId: createDto.userId,
      type: createDto.type,
      title: createDto.title,
      message: createDto.message,
      data: createDto.data || null,
      read: false,
    });

    const saved = await this.notificationRepository.save(notification);

    this.logger.log(
      `Notification sent to user ${createDto.userId}: ${createDto.title}`,
    );

    // Emit notification via WebSocket for real-time delivery
    const responseDto = this.mapToResponseDto(saved);
    this.webSocketService.emitNotificationToUser(createDto.userId, responseDto);

    // Also emit unread count update
    const unreadCount = await this.getUnreadCount(createDto.userId);
    this.webSocketService.emitUnreadCountUpdate(createDto.userId, unreadCount);

    // TODO: También se podría enviar push notification si el usuario tiene habilitadas

    return responseDto;
  }

  /**
   * Envía notificaciones masivas (uso interno)
   */
  async sendBulkNotifications(
    notifications: CreateNotificationDto[],
  ): Promise<{ sent: number }> {
    const entities = notifications.map((dto) =>
      this.notificationRepository.create({
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data || null,
        read: false,
      }),
    );

    const saved = await this.notificationRepository.save(entities);

    this.logger.log(`Sent ${entities.length} bulk notifications`);

    // Emit each notification via WebSocket
    for (const notification of saved) {
      const responseDto = this.mapToResponseDto(notification);
      this.webSocketService.emitNotificationToUser(notification.userId, responseDto);
    }

    // Group by userId and emit unread count updates
    const userIds = [...new Set(saved.map((n) => n.userId))];
    for (const userId of userIds) {
      const unreadCount = await this.getUnreadCount(userId);
      this.webSocketService.emitUnreadCountUpdate(userId, unreadCount);
    }

    return { sent: entities.length };
  }

  /**
   * Elimina notificaciones antiguas (limpieza automática)
   * Para ejecutar como tarea programada (cron job)
   */
  async deleteOldNotifications(daysOld: number = 30): Promise<{ deleted: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.notificationRepository
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('read = :read', { read: true })
      .andWhere('created_at < :cutoffDate', { cutoffDate })
      .execute();

    const deleted = result.affected || 0;

    this.logger.log(
      `Deleted ${deleted} old notifications (older than ${daysOld} days)`,
    );

    return { deleted };
  }

  /**
   * Obtiene estadísticas de notificaciones del usuario
   */
  async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationTypeEnum, number>;
  }> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
    });

    const unread = notifications.filter((n) => !n.read).length;

    // Count notifications by type
    const byType: Record<NotificationTypeEnum, number> = {
      [NotificationTypeEnum.ACHIEVEMENT_UNLOCKED]: notifications.filter((n) => n.type === NotificationTypeEnum.ACHIEVEMENT_UNLOCKED).length,
      [NotificationTypeEnum.RANK_UP]: notifications.filter((n) => n.type === NotificationTypeEnum.RANK_UP).length,
      [NotificationTypeEnum.FRIEND_REQUEST]: notifications.filter((n) => n.type === NotificationTypeEnum.FRIEND_REQUEST).length,
      [NotificationTypeEnum.GUILD_INVITATION]: notifications.filter((n) => n.type === NotificationTypeEnum.GUILD_INVITATION).length,
      [NotificationTypeEnum.MISSION_COMPLETED]: notifications.filter((n) => n.type === NotificationTypeEnum.MISSION_COMPLETED).length,
      [NotificationTypeEnum.LEVEL_UP]: notifications.filter((n) => n.type === NotificationTypeEnum.LEVEL_UP).length,
      [NotificationTypeEnum.MESSAGE_RECEIVED]: notifications.filter((n) => n.type === NotificationTypeEnum.MESSAGE_RECEIVED).length,
      [NotificationTypeEnum.SYSTEM_ANNOUNCEMENT]: notifications.filter((n) => n.type === NotificationTypeEnum.SYSTEM_ANNOUNCEMENT).length,
      [NotificationTypeEnum.ML_COINS_EARNED]: notifications.filter((n) => n.type === NotificationTypeEnum.ML_COINS_EARNED).length,
      [NotificationTypeEnum.STREAK_MILESTONE]: notifications.filter((n) => n.type === NotificationTypeEnum.STREAK_MILESTONE).length,
      [NotificationTypeEnum.EXERCISE_FEEDBACK]: notifications.filter((n) => n.type === NotificationTypeEnum.EXERCISE_FEEDBACK).length,
    };

    return {
      total: notifications.length,
      unread,
      byType,
    };
  }

  /**
   * Mapea Notification a NotificationResponseDto
   */
  private mapToResponseDto(
    notification: Notification,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
