/**
 * Admin Entities - Barrel Export
 *
 * @description Exportación centralizada de entidades del módulo Admin
 * @module admin/entities
 *
 * Entidades incluidas:
 * - SystemSetting: Configuración global de la plataforma
 * - FeatureFlag: Feature flags para activación gradual de funcionalidades
 * - NotificationSettings: Configuración de notificaciones por usuario
 * - BulkOperation: Registro de operaciones bulk/masivas (EXT-002)
 */

export { SystemSetting } from './system-setting.entity';
export { FeatureFlag } from './feature-flag.entity';
export { NotificationSettings } from './notification-settings.entity';
export { BulkOperation } from './bulk-operation.entity';
