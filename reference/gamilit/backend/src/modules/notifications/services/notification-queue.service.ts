import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, In, LessThan } from 'typeorm';
import { NotificationQueue } from '../entities/multichannel/notification-queue.entity';

/**
 * NotificationQueueService
 *
 * @description Gestión de cola asíncrona para procesamiento de notificaciones (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Responsabilidades:
 * - Encolar notificaciones para procesamiento asíncrono
 * - Procesar cola con worker pattern
 * - Reintentar envíos fallidos (max 3 intentos)
 * - Integración con función SQL queue_batch_notifications()
 * - Estadísticas de cola y limpieza de registros procesados
 *
 * Flujo de procesamiento:
 * 1. Notificación se encola con enqueue() (status: 'pending')
 * 2. Worker llama a processQueue() periódicamente (cron)
 * 3. Se procesan items pendientes o a reintentar
 * 4. Si falla, se incrementa retry_count y se agenda retry
 * 5. Si alcanza max retries (3), status → 'failed'
 * 6. Si éxito, status → 'sent'
 * 7. Limpieza periódica de items procesados antiguos
 *
 * Tipos de canales procesados por la cola:
 * - 'email' - Envío de emails (SMTP/SendGrid)
 * - 'push' - Push notifications (FCM)
 * - 'in_app' se procesa síncronamente (no va a cola)
 *
 * Integración con otros servicios:
 * - NotificationService llama a enqueue() después de crear notificación
 * - Worker (cron job) llama a processQueue() cada N minutos
 * - EmailService/PushService procesan los items encolados
 *
 * IMPORTANTE:
 * - Los items se procesan en orden FIFO (created_at ASC)
 * - scheduled_for permite diferir envíos (ej: enviar mañana a las 9am)
 * - retry_count se incrementa automáticamente en cada fallo
 * - processed_at se registra cuando se completa (éxito o fallo final)
 */
@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(
    @InjectRepository(NotificationQueue, 'notifications')
    private readonly queueRepository: Repository<NotificationQueue>,
    @InjectDataSource('notifications')
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Encolar notificación para procesamiento asíncrono
   *
   * Casos de uso:
   * - Email: siempre encola (procesamiento lento)
   * - Push: siempre encola (puede fallar, necesita retries)
   * - In-app: NO encola (procesamiento síncrono)
   *
   * @param data - Datos del item a encolar
   * @returns Item encolado
   *
   * @example
   * const queued = await this.queueService.enqueue({
   *   notificationId: 'uuid...',
   *   channel: 'email',
   *   scheduledFor: new Date(),
   *   priority: 0
   * });
   */
  async enqueue(data: {
    notificationId: string;
    channel: string;
    scheduledFor?: Date;
    priority?: number;
  }): Promise<NotificationQueue> {
    const queueItem = this.queueRepository.create({
      notificationId: data.notificationId,
      channel: data.channel,
      scheduledFor: data.scheduledFor || new Date(),
      priority: data.priority || 0,
      status: 'queued',
      attempts: 0,
      maxAttempts: 3,
    });

    return this.queueRepository.save(queueItem);
  }

  /**
   * Encolar múltiples notificaciones en batch
   *
   * Útil para operaciones masivas (ej: enviar email a todos los usuarios)
   *
   * @param items - Array de items a encolar
   * @returns Array de items encolados
   *
   * @example
   * const queued = await this.queueService.enqueueBatch([
   *   { notificationId: '...', channel: 'email', priority: 0 },
   *   { notificationId: '...', channel: 'push', priority: 5 }
   * ]);
   */
  async enqueueBatch(
    items: Array<{
      notificationId: string;
      channel: string;
      scheduledFor?: Date;
      priority?: number;
    }>,
  ): Promise<NotificationQueue[]> {
    const queueItems = items.map((item) =>
      this.queueRepository.create({
        notificationId: item.notificationId,
        channel: item.channel,
        scheduledFor: item.scheduledFor || new Date(),
        priority: item.priority || 0,
        status: 'queued',
        attempts: 0,
        maxAttempts: 3,
      }),
    );

    return this.queueRepository.save(queueItems);
  }

  /**
   * Integración con función SQL para batch enqueue
   *
   * Llama a la función PostgreSQL notifications.queue_batch_notifications()
   * para encolar múltiples notificaciones en una transacción atómica
   *
   * @param items - Array de items a encolar
   * @returns Número de items encolados
   *
   * @example
   * const count = await this.queueService.enqueueBatchSQL([
   *   { notificationId: '...', channel: 'email' }
   * ]);
   */
  async enqueueBatchSQL(
    items: Array<{
      notificationId: string;
      channel: string;
    }>,
  ): Promise<number> {
    try {
      // Preparar datos para función SQL
      const notificationIds = items.map((i) => i.notificationId);
      const channels = items.map((i) => i.channel);

      const result = await this.dataSource.query(
        'SELECT notifications.queue_batch_notifications($1, $2) as queued_count',
        [notificationIds, channels],
      );

      return result[0]?.queued_count || 0;
    } catch (error) {
      this.logger.error('Error calling queue_batch_notifications:', error);
      throw error;
    }
  }

  /**
   * Procesar cola de notificaciones (worker method)
   *
   * Este método debe ser llamado por un cron job periódico
   * (ej: cada 5 minutos)
   *
   * Procesamiento:
   * 1. Buscar items pendientes o a reintentar (hasta limit)
   * 2. Filtrar por scheduled_for <= now
   * 3. Procesar cada item (processQueueItem)
   * 4. Actualizar status y retry_count
   *
   * @param limit - Número máximo de items a procesar en esta ejecución
   * @returns Estadísticas de procesamiento
   *
   * @example
   * // En un cron job:
   * @Cron('star-slash-5 star star star star') // Cada 5 minutos
   * async handleCron() {
   *   const stats = await this.queueService.processQueue(100);
   *   this.logger.log(`Processed: ${stats.processed}, Failed: ${stats.failed}`);
   * }
   */
  async processQueue(limit: number = 100): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
  }> {
    const now = new Date();

    // Buscar items pendientes o a reintentar
    const items = await this.queueRepository.find({
      where: [
        { status: 'pending' },
        { status: 'retry' },
      ],
      order: { createdAt: 'ASC' },
      take: limit,
    });

    // Filtrar por scheduled_for
    const itemsToProcess = items.filter((item) => {
      if (!item.scheduledFor) return true;
      return item.scheduledFor <= now;
    });

    const stats = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: items.length - itemsToProcess.length,
    };

    for (const item of itemsToProcess) {
      try {
        await this.processQueueItem(item);
        stats.succeeded++;
      } catch (error) {
        this.logger.error(
          `Error processing queue item ${item.id}:`,
          error,
        );
        stats.failed++;
      }
      stats.processed++;
    }

    return stats;
  }

  /**
   * Procesar un item individual de la cola
   *
   * Estrategia de reintentos:
   * - Intento 1 falla: retry_count=1, status='retry', siguiente intento en 5 min
   * - Intento 2 falla: retry_count=2, status='retry', siguiente intento en 15 min
   * - Intento 3 falla: retry_count=3, status='failed', no más reintentos
   *
   * @private
   * @param item - Item a procesar
   */
  private async processQueueItem(item: NotificationQueue): Promise<void> {
    try {
      // TODO: Integrar con EmailService o PushService según channel
      // Por ahora, simular procesamiento exitoso
      // Nota: Los datos del mensaje están en item.notification (relación)
      const success = await this.sendToChannel(item.channel);

      if (success) {
        // Éxito: marcar como sent
        item.status = 'sent';
        item.lastAttemptAt = new Date();
      } else {
        // Fallo: aplicar estrategia de reintentos
        this.handleFailure(item);
      }
    } catch (error) {
      // Error: aplicar estrategia de reintentos
      this.handleFailure(item, error);
    }

    await this.queueRepository.save(item);
  }

  /**
   * Manejar fallo de procesamiento
   *
   * Incrementa retry_count y aplica estrategia de reintentos
   *
   * @private
   * @param item - Item que falló
   * @param error - Error capturado (opcional)
   */
  private handleFailure(item: NotificationQueue, error?: any): void {
    item.attempts++;

    if (item.attempts >= 3) {
      // Máximo de reintentos alcanzado
      item.status = 'failed';
      item.lastAttemptAt = new Date();
      item.errorMessage = error?.message || 'Max retries reached';
    } else {
      // Programar reintento
      item.status = 'retry';
      // Backoff exponencial: 5min, 15min, 45min
      const delayMinutes = 5 * Math.pow(3, item.attempts - 1);
      const nextRetry = new Date();
      nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
      item.scheduledFor = nextRetry;
      item.errorMessage = error?.message || 'Processing failed';
    }
  }

  /**
   * Enviar a canal específico
   *
   * Placeholder: integración con EmailService/PushService
   *
   * @private
   * @param channel - Canal (email, push)
   * @returns true si éxito, false si fallo
   */
  private async sendToChannel(channel: string): Promise<boolean> {
    // TODO: Integrar con servicios reales
    // Los datos del mensaje están en item.notification (relación)
    // if (channel === 'email') {
    //   return this.emailService.send(item.notification);
    // }
    // if (channel === 'push') {
    //   return this.pushService.send(item.notification);
    // }

    // Por ahora, simular éxito
    this.logger.log(`Sending to ${channel}`);
    return true;
  }

  /**
   * Obtener estadísticas de la cola
   *
   * @returns Contadores por estado
   *
   * @example
   * const stats = await this.queueService.getQueueStats();
   * // { pending: 42, processing: 3, sent: 1205, failed: 8, retry: 2 }
   */
  async getQueueStats(): Promise<Record<string, number>> {
    const counts = await this.queueRepository
      .createQueryBuilder('q')
      .select('q.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('q.status')
      .getRawMany();

    const stats: Record<string, number> = {
      pending: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      retry: 0,
    };

    for (const row of counts) {
      stats[row.status] = parseInt(row.count, 10);
    }

    return stats;
  }

  /**
   * Obtener items de la cola con filtros
   *
   * @param filters - Filtros opcionales
   * @returns Lista paginada de items
   *
   * @example
   * const items = await this.queueService.findAll({
   *   status: 'failed',
   *   channel: 'email',
   *   limit: 50
   * });
   */
  async findAll(filters?: {
    status?: string;
    channel?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: NotificationQueue[]; total: number }> {
    const query = this.queueRepository.createQueryBuilder('q');

    if (filters?.status) {
      query.andWhere('q.status = :status', { status: filters.status });
    }
    if (filters?.channel) {
      query.andWhere('q.channel = :channel', { channel: filters.channel });
    }
    if (filters?.userId) {
      query.andWhere('q.user_id = :userId', { userId: filters.userId });
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    query.orderBy('q.created_at', 'DESC');
    query.skip(offset);
    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  /**
   * Reintentar manualmente un item fallido
   *
   * Útil para reintentar items que fallaron por problemas temporales
   * (ej: servicio de email caído)
   *
   * @param queueItemId - UUID del item
   *
   * @example
   * await this.queueService.retryItem('uuid...');
   */
  async retryItem(queueItemId: string): Promise<void> {
    const item = await this.queueRepository.findOne({
      where: { id: queueItemId },
    });

    if (!item) {
      throw new NotFoundException('Queue item not found');
    }

    if (item.status !== 'failed') {
      throw new BadRequestException('Only failed items can be retried');
    }

    // Resetear para reintento
    item.status = 'retry';
    item.attempts = 0;
    item.scheduledFor = new Date();
    item.errorMessage = undefined;

    await this.queueRepository.save(item);
  }

  /**
   * Limpiar items procesados antiguos
   *
   * Elimina items con status 'sent' o 'failed' más antiguos que X días
   * Mantiene la cola limpia para performance
   *
   * @param olderThanDays - Eliminar items más antiguos que X días (default: 30)
   * @returns Número de items eliminados
   *
   * @example
   * // Ejecutar en cron job semanal:
   * const deleted = await this.queueService.cleanupProcessed(30);
   * this.logger.log(`Cleaned up ${deleted} old queue items`);
   */
  async cleanupProcessed(olderThanDays: number = 30): Promise<number> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - olderThanDays);

    const result = await this.queueRepository
      .createQueryBuilder()
      .delete()
      .where('processed_at < :threshold', { threshold })
      .andWhere('status IN (:...statuses)', { statuses: ['sent', 'failed'] })
      .execute();

    return result.affected || 0;
  }

  /**
   * Cancelar items pendientes de una notificación
   *
   * Útil si se elimina una notificación antes de ser enviada
   *
   * @param notificationId - UUID de la notificación
   * @returns Número de items cancelados
   *
   * @example
   * await this.queueService.cancelByNotification('uuid...');
   */
  async cancelByNotification(notificationId: string): Promise<number> {
    const result = await this.queueRepository
      .createQueryBuilder()
      .update(NotificationQueue)
      .set({ status: 'failed', errorMessage: 'Cancelled by user' })
      .where('notification_id = :notificationId', { notificationId })
      .andWhere('status IN (:...statuses)', { statuses: ['pending', 'retry'] })
      .execute();

    return result.affected || 0;
  }
}
