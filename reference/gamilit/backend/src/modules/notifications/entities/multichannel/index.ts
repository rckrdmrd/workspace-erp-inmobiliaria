/**
 * Multi-Channel Notifications Entities (EXT-003)
 *
 * Este módulo exporta las 6 entities del sistema multi-canal de notificaciones.
 *
 * @description Sistema completo de notificaciones multi-canal
 * @source orchestration/database/DB-115/HANDOFF-TO-BACKEND.md
 * @version 1.0 (2025-11-13)
 *
 * IMPORTANTE:
 * - Este es el sistema NUEVO (schema: notifications)
 * - NO confundir con el sistema básico (schema: gamification_system.notifications)
 * - 6 entities mapeando al schema notifications
 * - Datasource: 'notifications' (8vo datasource)
 *
 * Entities incluidas:
 * 1. NotificationTemplate - Plantillas reutilizables
 * 2. Notification - Notificaciones multi-canal
 * 3. NotificationPreference - Preferencias por usuario y tipo
 * 4. NotificationLog - Registro de envíos
 * 5. NotificationQueue - Cola asíncrona
 * 6. UserDevice - Dispositivos para push
 */

export { NotificationTemplate } from './notification-template.entity';
export { Notification } from './notification.entity';
export { NotificationPreference } from './notification-preference.entity';
export { NotificationLog } from './notification-log.entity';
export { NotificationQueue } from './notification-queue.entity';
export { UserDevice } from './user-device.entity';
