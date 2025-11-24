import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';
import { Notification } from './notification.entity';

/**
 * NotificationQueue Entity
 *
 * Mapea a la tabla: notifications.notification_queue
 *
 * @description Cola de envíos pendientes para notificaciones multi-canal (EXT-003)
 * @source orchestration/database/DB-115/HANDOFF-TO-BACKEND.md
 * @version 1.0 (2025-11-13) - Sistema Multi-Canal EXT-003
 *
 * IMPORTANTE:
 * - Cola asíncrona para envío de notificaciones
 * - Una entrada por cada combinación (notificación + canal)
 * - Soporte para reintentos automáticos (max_retries: 3)
 * - Worker procesa cola periódicamente
 * - Estados: 'pending', 'processing', 'completed', 'failed'
 *
 * Características:
 * - Envío asíncrono: Notificación se crea instantáneamente, envío se procesa después
 * - Reintentos: Si falla un envío, se reintenta hasta max_retries
 * - Scheduling: Puede programarse envío para fecha/hora específica
 * - Prioridad: Se procesa por orden de creación (FIFO)
 *
 * Flujo de uso:
 * 1. Se crea notificación
 * 2. Función SQL send_notification() encola para cada canal habilitado
 * 3. Worker (cron job) procesa items con status='pending'
 * 4. Worker actualiza status a 'processing'
 * 5. Worker intenta enviar por el canal
 * 6. Si éxito: status='completed', se crea log con status='sent'
 * 7. Si fallo: incrementa retry_count, si < max_retries vuelve a 'pending'
 * 8. Si retry_count >= max_retries: status='failed', se crea log con error
 *
 * Casos de uso:
 * - Envío asíncrono de emails (no bloquea API)
 * - Reintentos automáticos si proveedor está caído
 * - Scheduling de notificaciones futuras
 * - Batch sending (enviar a muchos usuarios)
 *
 * Worker implementación:
 * - Cron job cada 1-5 minutos
 * - SELECT donde status='pending' AND scheduled_for <= NOW()
 * - Procesa en batches de 100-500
 * - Usa transaction para evitar procesamiento duplicado
 */
@Entity({
  schema: DB_SCHEMAS.NOTIFICATIONS,
  name: DB_TABLES.NOTIFICATIONS.NOTIFICATION_QUEUE,
})
@Index(['notificationId'])
@Index(['status'])
@Index(['channel'])
@Index(['scheduledFor'])
@Index(['status', 'scheduledFor']) // Índice compuesto para worker query
export class NotificationQueue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID de la notificación a enviar
   *
   * Relación: @ManyToOne a Notification
   *
   * FK en DB: → notifications.notifications(id) ON DELETE CASCADE
   */
  @Column({ name: 'notification_id', type: 'uuid' })
  notificationId!: string;

  /**
   * Relación con la notificación
   *
   * Un queue item pertenece a una notificación
   * Una notificación puede tener múltiples queue items (uno por canal)
   */
  @ManyToOne(() => Notification, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'notification_id' })
  notification!: Notification;

  /**
   * Canal por el que se debe enviar
   *
   * Valores posibles:
   * - 'in_app' - Ya procesado (no se encola, se crea directamente)
   * - 'email' - Se encola para envío asíncrono
   * - 'push' - Se encola para envío asíncrono
   *
   * IMPORTANTE:
   * - Normalmente solo email y push se encolan
   * - in_app es instantáneo (crear notificación = enviar)
   */
  @Column({ type: 'varchar', length: 50 })
  channel!: string;

  /**
   * Estado del item en la cola
   *
   * Estados del ciclo de vida:
   * - 'pending' - Pendiente de procesamiento
   * - 'processing' - Siendo procesado por worker (lock)
   * - 'completed' - Enviado exitosamente
   * - 'failed' - Falló después de max_retries
   *
   * Worker busca items con status='pending'
   * Worker actualiza a 'processing' antes de enviar (evita duplicados)
   * Si envío exitoso: 'completed'
   * Si fallo y retry_count < max_retries: vuelve a 'pending'
   * Si fallo y retry_count >= max_retries: 'failed'
   */
  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status!: string;

  /**
   * Número de intentos realizados
   *
   * Incrementa cada vez que falla el envío
   * Si alcanza max_attempts, el status cambia a 'failed'
   *
   * Default: 0 (primer intento)
   */
  @Column({ name: 'attempts', type: 'integer', default: 0 })
  attempts!: number;

  /**
   * Número máximo de intentos permitidos
   *
   * Default: 3
   *
   * Después de 3 fallos, se marca como 'failed' definitivamente
   *
   * Configurable por tipo de notificación:
   * - Críticas (password_reset): 5 reintentos
   * - Normales (achievement): 3 reintentos
   * - Informativas (friend_request): 1 reintento
   */
  @Column({ name: 'max_attempts', type: 'integer', default: 3 })
  maxAttempts!: number;

  /**
   * Prioridad de procesamiento
   *
   * Mayor número = mayor prioridad
   *
   * Valores:
   * - 10: Urgente (password_reset)
   * - 5: Alta (assignment_due)
   * - 0: Normal (achievement, friend_request)
   * - -5: Baja (marketing)
   *
   * Worker procesa items con mayor prioridad primero
   *
   * Default: 0 (normal)
   */
  @Column({ type: 'integer', default: 0 })
  priority!: number;

  /**
   * Fecha y hora programada para envío
   *
   * Permite scheduling de notificaciones futuras
   *
   * Worker solo procesa items donde scheduled_for <= NOW()
   *
   * Casos de uso:
   * - Recordatorios de tareas (enviar 1 día antes del due_date)
   * - Anuncios programados (enviar a las 9am)
   * - Reengagement (enviar después de 7 días de inactividad)
   *
   * @optional Si NULL, se procesa inmediatamente
   */
  @Column({ name: 'scheduled_for', type: 'timestamp with time zone', nullable: true })
  scheduledFor?: Date;

  /**
   * Fecha y hora del último intento de procesamiento
   *
   * Se actualiza cada vez que el worker intenta procesar el item
   * (exitoso o fallido)
   *
   * Útil para:
   * - Detectar items stuck (último intento hace > X horas)
   * - Calcular tiempo entre reintentos
   * - Métricas de throughput del worker
   *
   * @optional Solo después del primer intento
   */
  @Column({ name: 'last_attempt_at', type: 'timestamp with time zone', nullable: true })
  lastAttemptAt?: Date;

  /**
   * Mensaje de error del último intento fallido
   *
   * Se actualiza en cada reintento fallido
   * Útil para debugging
   *
   * Ejemplos:
   * - "SMTP connection timeout"
   * - "Invalid FCM device token"
   * - "Rate limit exceeded"
   *
   * @optional Solo si hay error
   */
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}
