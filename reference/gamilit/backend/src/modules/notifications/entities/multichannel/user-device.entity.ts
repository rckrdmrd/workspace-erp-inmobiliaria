import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';

/**
 * UserDevice Entity
 *
 * Mapea a la tabla: notifications.user_devices
 *
 * @description Dispositivos registrados para push notifications (EXT-003)
 * @source orchestration/database/DB-115/HANDOFF-TO-BACKEND.md
 * @version 1.0 (2025-11-13) - Sistema Multi-Canal EXT-003
 *
 * IMPORTANTE:
 * - Almacena device tokens para Firebase Cloud Messaging (FCM)
 * - Un usuario puede tener múltiples dispositivos registrados
 * - Constraint único: (user_id, device_token)
 * - Dispositivos inactivos no reciben push notifications
 * - Se actualiza last_used_at para detectar dispositivos obsoletos
 *
 * Características:
 * - Soporte para iOS (APNS via FCM), Android (FCM) y Web (FCM)
 * - Device token es el identificador único del dispositivo en FCM
 * - Se puede desactivar sin eliminar (útil para logout temporal)
 * - Tracking de último uso para limpieza automática
 *
 * Flujo de registro:
 * 1. Usuario instala app o acepta permisos de notificaciones
 * 2. App obtiene device token de FCM
 * 3. App envía token a backend via POST /notifications/devices
 * 4. Backend registra con upsert (si ya existe, actualiza last_used_at)
 * 5. Usuario queda habilitado para recibir push
 *
 * Flujo de envío push:
 * 1. Se crea notificación con push habilitado
 * 2. Worker busca dispositivos activos del usuario
 * 3. Worker envía a FCM con device tokens
 * 4. FCM envía a dispositivos
 * 5. Se registra en notification_logs el resultado
 *
 * Limpieza de dispositivos obsoletos:
 * - Si FCM devuelve "token invalid", desactivar dispositivo
 * - Si last_used_at > 90 días, desactivar automáticamente
 * - Cron job periódico para limpieza
 *
 * Tipos de dispositivos:
 * - 'ios' - iPhone/iPad (APNS via FCM)
 * - 'android' - Android (FCM nativo)
 * - 'web' - Web Push API (FCM for web)
 *
 * NOTA sobre relaciones:
 * - userId es UUID pero NO tiene decorador @ManyToOne a User
 * - Razón: User está en datasource 'auth', UserDevice en 'notifications'
 * - TypeORM no soporta relaciones cross-datasource
 * - Las relaciones con User se resuelven manualmente en services
 */
@Entity({
  schema: DB_SCHEMAS.NOTIFICATIONS,
  name: DB_TABLES.NOTIFICATIONS.USER_DEVICES,
})
@Index(['userId'])
@Index(['deviceType'])
@Index(['isActive'])
@Index(['userId', 'deviceToken'], { unique: true })
@Index(['lastUsedAt'])
export class UserDevice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario propietario del dispositivo
   *
   * IMPORTANTE: NO tiene decorador @ManyToOne porque User está en otro datasource
   * La relación se resuelve manualmente en services
   *
   * FK en DB: → auth_management.users(id) ON DELETE CASCADE
   */
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  /**
   * Token del dispositivo para push notifications
   *
   * Este es el identificador único devuelto por FCM cuando el dispositivo
   * se registra para recibir notificaciones.
   *
   * Formato varía por plataforma:
   * - iOS: 64 caracteres hexadecimales
   * - Android: ~150 caracteres alfanuméricos
   * - Web: ~150 caracteres alfanuméricos
   *
   * Ejemplo (Android FCM):
   * "dUzV1qzxTHGKj8qY9ZxYzP:APA91bF..."
   *
   * IMPORTANTE:
   * - Un token identifica un dispositivo específico + app + usuario
   * - Los tokens pueden cambiar (app reinstalada, permisos revocados)
   * - Se debe actualizar si FCM devuelve token nuevo
   * - Se debe invalidar si FCM devuelve "token invalid"
   *
   * @unique (combinado con user_id)
   * @maxLength 500 (soporta tokens largos)
   */
  @Column({ name: 'device_token', type: 'varchar', length: 500 })
  deviceToken!: string;

  /**
   * Tipo de dispositivo/plataforma
   *
   * Valores posibles:
   * - 'ios' - iPhone/iPad (iOS 10+)
   * - 'android' - Dispositivos Android (5.0+)
   * - 'web' - Navegadores web con Web Push API
   *
   * Usado para:
   * - Estadísticas de adopción por plataforma
   * - Formato de payload (puede variar ligeramente)
   * - Troubleshooting de problemas específicos de plataforma
   *
   * IMPORTANTE:
   * - En producción, usar FCM que maneja todas las plataformas
   * - En desarrollo, puede simular con 'test'
   */
  @Column({ name: 'device_type', type: 'varchar', length: 50 })
  deviceType!: string;

  /**
   * Nombre descriptivo del dispositivo
   *
   * Proporcionado por el cliente para ayudar al usuario a identificar el dispositivo
   *
   * Ejemplos:
   * - "iPhone 13 de Juan"
   * - "Samsung Galaxy S21"
   * - "Chrome en MacBook"
   *
   * Útil para:
   * - UI de gestión de dispositivos (settings)
   * - Usuario puede ver qué dispositivos tiene registrados
   * - Usuario puede desactivar dispositivos específicos
   *
   * @optional Si no se proporciona, usar deviceType genérico
   */
  @Column({ name: 'device_name', type: 'varchar', length: 255, nullable: true })
  deviceName?: string;

  /**
   * Indica si el dispositivo está activo para recibir push
   *
   * Default: true (al registrar)
   *
   * Se desactiva en casos:
   * - Usuario hace logout explícito
   * - FCM devuelve "token invalid" o "not registered"
   * - Usuario revoca permisos de notificaciones
   * - App desinstalada (detectado por FCM)
   * - Usuario desactiva manualmente desde settings
   * - Limpieza automática de dispositivos obsoletos
   *
   * IMPORTANTE:
   * - Solo dispositivos activos reciben push notifications
   * - Worker filtra por is_active=true antes de enviar
   * - Desactivar NO elimina el registro (permite reactivar)
   */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * Última vez que se usó el dispositivo
   *
   * Se actualiza en:
   * - Cada vez que el usuario abre la app
   * - Cada vez que se envía una push notification exitosamente
   * - Cada vez que el dispositivo se reconecta
   *
   * Usado para:
   * - Detectar dispositivos obsoletos (no usado en 90+ días)
   * - Limpieza automática de dispositivos inactivos
   * - Priorizar dispositivos más recientes si hay múltiples
   *
   * Cron job de limpieza:
   * - Cada semana, desactivar dispositivos con last_used_at > 90 días
   * - Cada mes, eliminar dispositivos desactivados con last_used_at > 180 días
   *
   * @optional Se llena en el primer uso después de registro
   */
  @Column({ name: 'last_used_at', type: 'timestamp with time zone', nullable: true })
  lastUsedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}
