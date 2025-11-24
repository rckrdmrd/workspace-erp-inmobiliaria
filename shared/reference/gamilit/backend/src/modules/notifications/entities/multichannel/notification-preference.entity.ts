import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';

/**
 * NotificationPreference Entity
 *
 * Mapea a la tabla: notifications.notification_preferences
 *
 * @description Preferencias de notificaciones por usuario y tipo (EXT-003)
 * @source orchestration/database/DB-115/HANDOFF-TO-BACKEND.md
 * @version 1.0 (2025-11-13) - Sistema Multi-Canal EXT-003
 *
 * IMPORTANTE:
 * - Cada usuario puede tener preferencias distintas por tipo de notificación
 * - 3 canales configurables: in_app, email, push
 * - Defaults: in_app=true, email=true, push=false
 * - Constraint único: (user_id, notification_type)
 * - Función SQL get_user_preferences() retorna defaults si no existen
 *
 * Características:
 * - Granularidad por tipo de notificación (ej: 'achievement', 'assignment_due')
 * - El usuario puede silenciar completamente un tipo en todos los canales
 * - El usuario puede elegir recibir solo por ciertos canales
 * - El sistema respeta preferencias antes de enviar
 *
 * Flujo de uso:
 * 1. Usuario actualiza preferencias desde settings
 * 2. Service guarda/actualiza con upsert
 * 3. Función SQL send_notification() consulta preferencias
 * 4. Solo se encolan canales habilitados por el usuario
 *
 * Ejemplos de configuración:
 * - User quiere achievements solo in_app: (in_app=true, email=false, push=false)
 * - User quiere assignment_due en todos: (in_app=true, email=true, push=true)
 * - User NO quiere friend_request: (in_app=false, email=false, push=false)
 *
 * NOTA sobre relaciones:
 * - userId es UUID pero NO tiene decorador @ManyToOne a User
 * - Razón: User está en datasource 'auth', NotificationPreference en 'notifications'
 * - TypeORM no soporta relaciones cross-datasource
 * - Las relaciones con User se resuelven manualmente en services
 */
@Entity({
  schema: DB_SCHEMAS.NOTIFICATIONS,
  name: DB_TABLES.NOTIFICATIONS.NOTIFICATION_PREFERENCES,
})
@Index(['userId'])
@Index(['notificationType'])
@Index(['userId', 'notificationType'], { unique: true })
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario
   *
   * IMPORTANTE: NO tiene decorador @ManyToOne porque User está en otro datasource
   * La relación se resuelve manualmente en services
   *
   * FK en DB: → auth_management.users(id) ON DELETE CASCADE
   */
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  /**
   * Tipo de notificación
   *
   * Define qué tipo de notificación se está configurando
   *
   * Ejemplos comunes:
   * - 'achievement' - Logros desbloqueados
   * - 'rank_up' - Subida de rango
   * - 'friend_request' - Solicitudes de amistad
   * - 'assignment_due' - Recordatorios de tareas
   * - 'mission_complete' - Misiones completadas
   * - 'system_announcement' - Anuncios del sistema
   * - 'password_reset' - Reseteo de contraseña
   *
   * IMPORTANTE: Este valor debe coincidir con notification_type en notifications
   *
   * @unique (combinado con user_id)
   */
  @Column({ name: 'notification_type', type: 'varchar', length: 50 })
  notificationType!: string;

  /**
   * Habilitar notificaciones in-app (popups dentro de la aplicación)
   *
   * Default: true
   *
   * Cuando está habilitado:
   * - El usuario ve notificaciones en el bell icon
   * - Se muestran popups/toasts cuando ocurre el evento
   * - Se actualiza el contador de notificaciones no leídas
   *
   * Es el canal más común y menos intrusivo
   */
  @Column({ name: 'in_app_enabled', type: 'boolean', default: true })
  inAppEnabled!: boolean;

  /**
   * Habilitar notificaciones por email
   *
   * Default: true
   *
   * Cuando está habilitado:
   * - Se envía email al correo del usuario
   * - Se usa template HTML si está disponible
   * - Se encola en notification_queue
   * - Se envía mediante proveedor (SendGrid, AWS SES, etc.)
   *
   * Recomendado para notificaciones importantes:
   * - assignment_due
   * - password_reset
   * - system_announcement
   */
  @Column({ name: 'email_enabled', type: 'boolean', default: true })
  emailEnabled!: boolean;

  /**
   * Habilitar notificaciones push (móvil y web)
   *
   * Default: false (requiere registro explícito de dispositivo)
   *
   * Cuando está habilitado:
   * - Se envía push notification a dispositivos registrados
   * - Usa Firebase Cloud Messaging (FCM) o similar
   * - Requiere que el usuario haya registrado al menos un dispositivo
   * - El dispositivo debe tener permisos de notificaciones
   *
   * Recomendado para notificaciones urgentes:
   * - friend_request
   * - mission_complete (tiempo real)
   * - assignment_due (recordatorios críticos)
   *
   * IMPORTANTE: Si no hay dispositivos registrados, este canal se ignora
   */
  @Column({ name: 'push_enabled', type: 'boolean', default: false })
  pushEnabled!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
