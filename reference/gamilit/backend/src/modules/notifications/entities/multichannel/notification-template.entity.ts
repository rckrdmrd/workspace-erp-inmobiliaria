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
 * NotificationTemplate Entity
 *
 * Mapea a la tabla: notifications.notification_templates
 *
 * @description Plantillas reutilizables para notificaciones multi-canal
 * @source orchestration/database/DB-115/HANDOFF-TO-BACKEND.md
 * @version 1.0 (2025-11-13) - Sistema Multi-Canal EXT-003
 *
 * IMPORTANTE:
 * - Plantillas con interpolación de variables (Mustache-style)
 * - Soporte para subject, body y HTML
 * - Variables definidas en JSONB array
 * - Canales por defecto configurables
 * - 8 templates de producción + 3 de testing cargados en seeds
 *
 * Características:
 * - template_key: Identificador único (ej: 'welcome_message', 'achievement_unlocked')
 * - subject_template: Asunto del mensaje (email)
 * - body_template: Cuerpo del mensaje (texto plano)
 * - html_template: Cuerpo HTML (email)
 * - variables: Array de variables requeridas (ej: ['user_name', 'achievement_name'])
 * - default_channels: Canales por defecto (['in_app', 'email', 'push'])
 * - is_active: Habilitar/deshabilitar template
 *
 * Templates cargados en producción:
 * 1. welcome_message - Mensaje de bienvenida
 * 2. achievement_unlocked - Logro desbloqueado
 * 3. rank_up - Subida de rango
 * 4. assignment_due_reminder - Recordatorio de tarea
 * 5. friend_request - Solicitud de amistad
 * 6. mission_completed - Misión completada
 * 7. system_announcement - Anuncio del sistema
 * 8. password_reset - Reseteo de contraseña
 */
@Entity({
  schema: DB_SCHEMAS.NOTIFICATIONS,
  name: DB_TABLES.NOTIFICATIONS.NOTIFICATION_TEMPLATES,
})
@Index(['templateKey'], { unique: true })
@Index(['isActive'])
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Identificador único del template
   *
   * Ejemplos: 'welcome_message', 'achievement_unlocked', 'rank_up'
   *
   * @unique
   */
  @Column({ name: 'template_key', type: 'varchar', length: 100, unique: true })
  templateKey!: string;

  /**
   * Nombre descriptivo del template
   */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /**
   * Descripción del propósito del template
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Plantilla del asunto (para email)
   *
   * Soporta interpolación con {{variable_name}}
   *
   * Ejemplo: "¡Felicidades {{user_name}}! Has desbloqueado {{achievement_name}}"
   */
  @Column({ name: 'subject_template', type: 'text' })
  subjectTemplate!: string;

  /**
   * Plantilla del cuerpo (texto plano)
   *
   * Soporta interpolación con {{variable_name}}
   *
   * Ejemplo: "Hola {{user_name}}, has completado la misión {{mission_name}}..."
   */
  @Column({ name: 'body_template', type: 'text' })
  bodyTemplate!: string;

  /**
   * Plantilla del cuerpo HTML (para email)
   *
   * Soporta interpolación con {{variable_name}}
   * Puede incluir HTML completo con estilos inline
   *
   * @optional Si no se proporciona, se usa bodyTemplate
   */
  @Column({ name: 'html_template', type: 'text', nullable: true })
  htmlTemplate?: string;

  /**
   * Variables requeridas para renderizar el template
   *
   * Array de nombres de variables en JSONB
   *
   * Ejemplo: ["user_name", "achievement_name", "achievement_icon"]
   *
   * El sistema validará que todas las variables requeridas sean proporcionadas
   * antes de renderizar el template.
   */
  @Column({ type: 'jsonb', nullable: true })
  variables?: string[];

  /**
   * Canales por defecto para este template
   *
   * Array de canales: 'in_app' | 'email' | 'push'
   *
   * Ejemplo: ["in_app", "email"]
   *
   * IMPORTANTE: Los canales finales dependen de las preferencias del usuario
   * Este campo solo define los canales sugeridos
   */
  @Column({ name: 'default_channels', type: 'varchar', array: true })
  defaultChannels!: string[];

  /**
   * Indica si el template está activo
   *
   * Templates inactivos no pueden ser usados para enviar notificaciones
   * Útil para deshabilitar temporalmente sin eliminar
   */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
