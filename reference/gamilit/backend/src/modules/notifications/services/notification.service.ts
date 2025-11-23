import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere, Between } from 'typeorm';
import { Notification } from '../entities/multichannel/notification.entity';
import { NotificationTemplateService } from './notification-template.service';

/**
 * NotificationService
 *
 * @description Service principal para gestión de notificaciones multi-canal (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Responsabilidades:
 * - Crear notificaciones (ad-hoc o desde templates)
 * - Enviar notificaciones respetando preferencias
 * - Integración con función SQL send_notification()
 * - CRUD con validación de ownership
 * - Marcar como leídas
 * - Obtener con filtros y paginación
 *
 * Flujo principal:
 * 1. Se crea notificación (create o sendFromTemplate)
 * 2. Se llama función SQL send_notification()
 * 3. Función SQL valida preferencias y encola
 * 4. Worker procesa cola asíncronamente
 * 5. Se actualiza channels_sent cuando se procesa
 */
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification, 'notifications')
    private readonly notificationRepository: Repository<Notification>,
    private readonly templateService: NotificationTemplateService,
    @InjectDataSource('notifications')
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crear notificación ad-hoc
   *
   * @param data - Datos de la notificación
   * @returns Notificación creada
   */
  async create(data: {
    userId: string;
    title: string;
    content: string;
    notificationType: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    metadata?: Record<string, any>;
    channels?: string[];
    expiresAt?: Date;
  }): Promise<Notification> {
    // Crear notificación
    const notification = this.notificationRepository.create({
      userId: data.userId,
      title: data.title,
      content: data.content,
      notificationType: data.notificationType,
      relatedEntityType: data.relatedEntityType,
      relatedEntityId: data.relatedEntityId,
      metadata: data.metadata,
      expiresAt: data.expiresAt,
      isRead: false,
    });

    const saved = await this.notificationRepository.save(notification);

    // Enviar por función SQL (respeta preferencias y encola)
    const channels = data.channels || ['in_app', 'email'];
    await this.callSendNotificationFunction(
      data.userId,
      data.title,
      data.content,
      data.notificationType,
      channels,
    );

    return saved;
  }

  /**
   * Enviar notificación desde template
   *
   * @param data - Datos para renderizar template
   * @returns Notificación creada y enviada
   */
  async sendFromTemplate(data: {
    templateKey: string;
    userId: string;
    variables: Record<string, string>;
    channels?: string[];
    relatedEntityType?: string;
    relatedEntityId?: string;
    metadata?: Record<string, any>;
  }): Promise<Notification> {
    // 1. Renderizar template
    const rendered = await this.templateService.renderTemplate(
      data.templateKey,
      data.variables,
    );

    // 2. Obtener template para canales por defecto
    const template = await this.templateService.findByKey(data.templateKey);
    const channels = data.channels || template.defaultChannels;

    // 3. Crear notificación
    const notification = this.notificationRepository.create({
      userId: data.userId,
      title: rendered.subject,
      content: rendered.body,
      notificationType: data.templateKey, // usar templateKey como tipo
      templateKey: data.templateKey,
      relatedEntityType: data.relatedEntityType,
      relatedEntityId: data.relatedEntityId,
      metadata: data.metadata,
      isRead: false,
    });

    const saved = await this.notificationRepository.save(notification);

    // 4. Enviar por función SQL
    await this.callSendNotificationFunction(
      data.userId,
      rendered.subject,
      rendered.body,
      data.templateKey,
      channels,
    );

    return saved;
  }

  /**
   * Obtener notificaciones de un usuario con filtros
   *
   * @param userId - UUID del usuario
   * @param filters - Filtros opcionales
   * @returns Lista paginada de notificaciones
   */
  async findAllByUser(
    userId: string,
    filters?: {
      isRead?: boolean;
      notificationType?: string;
      from?: Date;
      to?: Date;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: Notification[]; total: number }> {
    const query = this.notificationRepository.createQueryBuilder('n');

    query.where('n.user_id = :userId', { userId });

    // Filtro por isRead
    if (filters?.isRead !== undefined) {
      query.andWhere('n.is_read = :isRead', { isRead: filters.isRead });
    }

    // Filtro por tipo
    if (filters?.notificationType) {
      query.andWhere('n.notification_type = :type', { type: filters.notificationType });
    }

    // Filtro por rango de fechas
    if (filters?.from) {
      query.andWhere('n.created_at >= :from', { from: filters.from });
    }
    if (filters?.to) {
      query.andWhere('n.created_at <= :to', { to: filters.to });
    }

    // Paginación
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    query.orderBy('n.created_at', 'DESC');
    query.skip(offset);
    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  /**
   * Obtener notificación por ID (con validación de ownership)
   *
   * @param notificationId - UUID de la notificación
   * @param userId - UUID del usuario (para validar ownership)
   * @returns Notificación
   * @throws NotFoundException si no existe
   * @throws ForbiddenException si no pertenece al usuario
   */
  async findOne(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['template'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have access to this notification');
    }

    return notification;
  }

  /**
   * Marcar notificación como leída
   *
   * @param notificationId - UUID de la notificación
   * @param userId - UUID del usuario (validación de ownership)
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.findOne(notificationId, userId);

    if (notification.isRead) {
      return; // Ya estaba leída
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await this.notificationRepository.save(notification);
  }

  /**
   * Marcar todas las notificaciones como leídas
   *
   * @param userId - UUID del usuario
   * @returns Número de notificaciones actualizadas
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true, readAt: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('is_read = false')
      .execute();

    return result.affected || 0;
  }

  /**
   * Obtener contador de notificaciones no leídas
   *
   * @param userId - UUID del usuario
   * @returns Número de notificaciones no leídas
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Eliminar notificación (con validación de ownership)
   *
   * @param notificationId - UUID de la notificación
   * @param userId - UUID del usuario (validación de ownership)
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await this.findOne(notificationId, userId);
    await this.notificationRepository.remove(notification);
  }

  /**
   * Eliminar notificaciones antiguas o expiradas
   *
   * @param olderThanDays - Eliminar notificaciones más antiguas que X días
   * @returns Número de notificaciones eliminadas
   */
  async cleanupOldNotifications(olderThanDays: number = 90): Promise<number> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - olderThanDays);

    const result = await this.notificationRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :threshold', { threshold: dateThreshold })
      .orWhere('expires_at IS NOT NULL AND expires_at < :now', { now: new Date() })
      .execute();

    return result.affected || 0;
  }

  /**
   * Llamar función SQL send_notification()
   *
   * Esta función:
   * 1. Valida preferencias del usuario
   * 2. Filtra canales según preferencias
   * 3. Encola para cada canal habilitado
   *
   * @private
   * @param userId - UUID del usuario
   * @param title - Título de la notificación
   * @param content - Contenido
   * @param notificationType - Tipo
   * @param channels - Canales deseados
   * @returns UUID de la notificación creada por la función
   */
  private async callSendNotificationFunction(
    userId: string,
    title: string,
    content: string,
    notificationType: string,
    channels: string[],
  ): Promise<string> {
    try {
      const result = await this.dataSource.query(
        'SELECT notifications.send_notification($1, $2, $3, $4, $5) as notification_id',
        [userId, title, content, notificationType, channels],
      );

      return result[0]?.notification_id;
    } catch (error) {
      // Log error pero no fallar (la notificación ya fue creada)
      console.error('Error calling send_notification function:', error);
      return '';
    }
  }
}
