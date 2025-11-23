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
import { NotificationTemplate } from './notification-template.entity';

/**
 * Notification Entity (Multi-Canal)
 *
 * Mapea a la tabla: notifications.notifications
 *
 * @description Notificaciones multi-canal del sistema (EXT-003)
 * @source orchestration/database/DB-115/HANDOFF-TO-BACKEND.md
 * @version 1.0 (2025-11-13) - Sistema Multi-Canal EXT-003
 *
 * IMPORTANTE:
 * - Este es el sistema NUEVO de notificaciones multi-canal
 * - NO confundir con gamification_system.notifications (sistema básico)
 * - Soporte para 3 canales: in_app, email, push
 * - Integración con notification_templates
 * - Respeta preferencias de usuario por canal
 * - Se encola automáticamente en notification_queue
 *
 * Características:
 * - Notificaciones pueden ser creadas desde templates o ad-hoc
 * - Metadata JSONB para datos adicionales específicos del tipo
 * - Tracking de lectura (is_read, read_at)
 * - Tracking de canales enviados (channels_sent)
 * - Expiración configurable (expires_at)
 * - Relación opcional con entidades del sistema (related_entity_type/id)
 *
 * Flujo de envío:
 * 1. Se crea notificación (desde template o ad-hoc)
 * 2. Se llama función SQL notifications.send_notification()
 * 3. La función valida preferencias del usuario
 * 4. Se encola en notification_queue para cada canal habilitado
 * 5. Worker procesa cola y envía por cada canal
 * 6. Se registra en notification_logs el resultado
 *
 * NOTA sobre relaciones:
 * - userId es UUID pero NO tiene decorador @ManyToOne a User
 * - Razón: User está en datasource 'auth', Notification en 'notifications'
 * - TypeORM no soporta relaciones cross-datasource
 * - Las relaciones con User se resuelven manualmente en services
 */
@Entity({
  schema: DB_SCHEMAS.NOTIFICATIONS,
  name: DB_TABLES.NOTIFICATIONS.NOTIFICATIONS,
})
@Index(['userId'])
@Index(['notificationType'])
@Index(['userId', 'isRead'])
@Index(['createdAt'])
@Index(['expiresAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario destinatario
   *
   * IMPORTANTE: NO tiene decorador @ManyToOne porque User está en otro datasource
   * La relación se resuelve manualmente en services
   *
   * FK en DB: → auth_management.users(id) ON DELETE CASCADE
   */
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  /**
   * Título de la notificación
   *
   * Ejemplo: "¡Logro desbloqueado!", "Recordatorio de tarea"
   *
   * Máximo 255 caracteres
   */
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  /**
   * Contenido de la notificación
   *
   * Puede ser texto plano o markdown
   *
   * Ejemplo: "Has desbloqueado el logro 'Maestro del Pensamiento Crítico'..."
   */
  @Column({ type: 'text' })
  content!: string;

  /**
   * Tipo de notificación
   *
   * Usado para agrupar notificaciones y aplicar preferencias
   *
   * Ejemplos:
   * - 'achievement'
   * - 'rank_up'
   * - 'friend_request'
   * - 'assignment_due'
   * - 'mission_complete'
   * - 'system_announcement'
   *
   * Máximo 50 caracteres
   */
  @Column({ name: 'notification_type', type: 'varchar', length: 50 })
  notificationType!: string;

  /**
   * Tipo de entidad relacionada
   *
   * Usado para navegar a la entidad desde la notificación
   *
   * Ejemplos: 'achievement', 'assignment', 'mission', 'exercise'
   *
   * @optional
   */
  @Column({ name: 'related_entity_type', type: 'varchar', length: 100, nullable: true })
  relatedEntityType?: string;

  /**
   * ID de la entidad relacionada
   *
   * Usado para navegar a la entidad desde la notificación
   *
   * Ejemplo: ID del achievement, assignment, mission, etc.
   *
   * @optional
   */
  @Column({ name: 'related_entity_id', type: 'uuid', nullable: true })
  relatedEntityId?: string;

  /**
   * Key del template usado para crear esta notificación
   *
   * Si la notificación fue creada desde un template, este campo contiene el template_key
   *
   * Ejemplo: 'welcome_message', 'achievement_unlocked'
   *
   * @optional
   */
  @Column({ name: 'template_key', type: 'varchar', length: 100, nullable: true })
  templateKey?: string;

  /**
   * Relación con el template usado
   *
   * IMPORTANTE: La relación es por template_key, no por id
   *
   * @optional Solo si la notificación fue creada desde template
   */
  @ManyToOne(() => NotificationTemplate, { nullable: true, eager: false })
  @JoinColumn({ name: 'template_key', referencedColumnName: 'templateKey' })
  template?: NotificationTemplate;

  /**
   * Metadata adicional en JSONB
   *
   * Estructura varía según el tipo de notificación
   *
   * Ejemplos:
   * - achievement: { achievement_name, achievement_icon, xp_earned }
   * - rank_up: { new_rank, previous_rank, rank_icon }
   * - assignment_due: { assignment_title, due_date, course_name }
   * - mission_complete: { mission_name, coins_earned, xp_earned }
   *
   * @optional
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  /**
   * Indica si la notificación fue leída por el usuario
   *
   * Usado para mostrar badge de notificaciones no leídas
   */
  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead!: boolean;

  /**
   * Fecha y hora en que se leyó la notificación
   *
   * Se actualiza cuando el usuario marca como leída o abre la notificación
   *
   * @optional Solo si isRead=true
   */
  @Column({ name: 'read_at', type: 'timestamp with time zone', nullable: true })
  readAt?: Date;

  /**
   * Canales por los que se envió la notificación
   *
   * Array de strings: 'in_app' | 'email' | 'push'
   *
   * Ejemplo: ["in_app", "email"]
   *
   * Se actualiza después de procesar notification_queue
   *
   * @optional
   */
  @Column({ name: 'channels_sent', type: 'varchar', array: true, nullable: true })
  channelsSent?: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  /**
   * Fecha de expiración de la notificación
   *
   * Después de esta fecha, la notificación puede ser archivada o eliminada
   *
   * Útil para notificaciones temporales como recordatorios o anuncios
   *
   * @optional Si no se especifica, la notificación no expira
   */
  @Column({ name: 'expires_at', type: 'timestamp with time zone', nullable: true })
  expiresAt?: Date;
}
