/**
 * Notifications Controllers (EXT-003)
 *
 * @description Exporta controllers para sistema multi-canal de notificaciones
 * @version 1.0 (2025-11-13)
 *
 * Controllers exportados:
 * 1. NotificationMultiChannelController - Creación de notificaciones multi-canal
 * 2. NotificationPreferencesController - Gestión de preferencias por usuario
 * 3. NotificationDevicesController - Gestión de dispositivos para push
 * 4. NotificationTemplatesController - Gestión de templates
 *
 * IMPORTANTE:
 * - NotificationsController (sistema básico) ya existe y se mantiene
 * - Estos controllers complementan el sistema básico con funcionalidad multi-canal
 * - Rutas base diferenciadas para evitar conflictos
 */

export { NotificationMultiChannelController } from './notification-multichannel.controller';
export { NotificationPreferencesController } from './notification-preferences.controller';
export { NotificationDevicesController } from './notification-devices.controller';
export { NotificationTemplatesController } from './notification-templates.controller';
