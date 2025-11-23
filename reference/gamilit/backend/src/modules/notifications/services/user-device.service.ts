import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { UserDevice } from '../entities/multichannel/user-device.entity';

/**
 * UserDeviceService
 *
 * @description Gestión de dispositivos para push notifications (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Responsabilidades:
 * - Registrar dispositivos (FCM tokens)
 * - CRUD de dispositivos por usuario
 * - Actualizar last_used_at para tracking
 * - Desactivar dispositivos obsoletos o inválidos
 * - Obtener dispositivos activos para envío de push
 * - Limpieza periódica de dispositivos obsoletos
 *
 * Flujo de registro:
 * 1. Usuario instala app o acepta permisos de notificaciones
 * 2. App obtiene device token de Firebase Cloud Messaging (FCM)
 * 3. App envía token a backend via POST /notifications/devices
 * 4. Backend registra con upsert pattern (si existe, actualiza last_used_at)
 * 5. Usuario queda habilitado para recibir push notifications
 *
 * Flujo de envío push:
 * 1. NotificationService crea notificación con push habilitado
 * 2. Worker llama a getActiveDevicesByUser(userId)
 * 3. Worker envía a FCM con array de device tokens
 * 4. FCM distribuye a dispositivos
 * 5. Si FCM devuelve "token invalid", llamar a invalidateDevice()
 *
 * Limpieza de dispositivos obsoletos:
 * - Cron job semanal: desactivar dispositivos con last_used_at > 90 días
 * - Cron job mensual: eliminar dispositivos desactivados con last_used_at > 180 días
 * - Desactivar inmediatamente si FCM devuelve error "invalid token"
 *
 * Tipos de dispositivos soportados:
 * - 'ios' - iPhone/iPad (APNS via FCM)
 * - 'android' - Android devices (FCM nativo)
 * - 'web' - Navegadores web (Web Push API via FCM)
 *
 * IMPORTANTE:
 * - Un usuario puede tener múltiples dispositivos registrados
 * - Constraint único: (user_id, device_token)
 * - Solo dispositivos activos (is_active=true) reciben push
 * - Device tokens pueden cambiar (app reinstalada, permisos revocados)
 */
@Injectable()
export class UserDeviceService {
  constructor(
    @InjectRepository(UserDevice, 'notifications')
    private readonly deviceRepository: Repository<UserDevice>,
  ) {}

  /**
   * Registrar dispositivo para push notifications
   *
   * Usa patrón upsert:
   * - Si el par (userId, deviceToken) ya existe, actualiza last_used_at y reactiva
   * - Si no existe, crea nuevo registro
   *
   * @param data - Datos del dispositivo
   * @returns Dispositivo registrado
   * @throws ConflictException si hay error de unicidad
   *
   * @example
   * const device = await this.deviceService.registerDevice({
   *   userId: 'uuid...',
   *   deviceToken: 'dUzV1qzxTHGKj8qY9ZxYzP:APA91bF...',
   *   deviceType: 'android',
   *   deviceName: 'Samsung Galaxy S21'
   * });
   */
  async registerDevice(data: {
    userId: string;
    deviceToken: string;
    deviceType: string;
    deviceName?: string;
  }): Promise<UserDevice> {
    // Validar tipo de dispositivo
    const validTypes = ['ios', 'android', 'web'];
    if (!validTypes.includes(data.deviceType)) {
      throw new BadRequestException(
        `Invalid device type. Must be one of: ${validTypes.join(', ')}`,
      );
    }

    // Buscar si ya existe
    const existing = await this.deviceRepository.findOne({
      where: {
        userId: data.userId,
        deviceToken: data.deviceToken,
      },
    });

    if (existing) {
      // Actualizar existente (reactivar si estaba desactivado)
      existing.isActive = true;
      existing.lastUsedAt = new Date();
      existing.deviceName = data.deviceName || existing.deviceName;
      existing.deviceType = data.deviceType; // Actualizar si cambió

      return this.deviceRepository.save(existing);
    }

    // Crear nuevo
    const device = this.deviceRepository.create({
      userId: data.userId,
      deviceToken: data.deviceToken,
      deviceType: data.deviceType,
      deviceName: data.deviceName,
      isActive: true,
      lastUsedAt: new Date(),
    });

    return this.deviceRepository.save(device);
  }

  /**
   * Obtener todos los dispositivos de un usuario
   *
   * @param userId - UUID del usuario
   * @param includeInactive - Incluir dispositivos desactivados (default: false)
   * @returns Lista de dispositivos
   *
   * @example
   * const devices = await this.deviceService.getUserDevices('uuid...');
   * // Retorna solo dispositivos activos
   */
  async getUserDevices(
    userId: string,
    includeInactive: boolean = false,
  ): Promise<UserDevice[]> {
    const where: any = { userId };

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.deviceRepository.find({
      where,
      order: { lastUsedAt: 'DESC' },
    });
  }

  /**
   * Obtener dispositivos activos de un usuario para envío de push
   *
   * Filtrado estricto:
   * - is_active = true
   * - Ordenado por last_used_at DESC (más recientes primero)
   *
   * @param userId - UUID del usuario
   * @returns Array de dispositivos activos con tokens
   *
   * @example
   * const devices = await this.deviceService.getActiveDevicesByUser('uuid...');
   * const tokens = devices.map(d => d.deviceToken);
   * // Enviar a FCM con estos tokens
   */
  async getActiveDevicesByUser(userId: string): Promise<UserDevice[]> {
    return this.deviceRepository.find({
      where: {
        userId,
        isActive: true,
      },
      order: { lastUsedAt: 'DESC' },
    });
  }

  /**
   * Obtener dispositivo por ID
   *
   * @param deviceId - UUID del dispositivo
   * @param userId - UUID del usuario (validación de ownership)
   * @returns Dispositivo
   * @throws NotFoundException si no existe o no pertenece al usuario
   *
   * @example
   * const device = await this.deviceService.getDeviceById('device-uuid', 'user-uuid');
   */
  async getDeviceById(deviceId: string, userId: string): Promise<UserDevice> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new NotFoundException('Device not found');
    }

    return device;
  }

  /**
   * Actualizar last_used_at de un dispositivo
   *
   * Debe ser llamado:
   * - Cada vez que el usuario abre la app
   * - Cada vez que se envía push notification exitosamente
   * - Cada vez que el dispositivo se reconecta
   *
   * @param deviceId - UUID del dispositivo
   * @returns void
   *
   * @example
   * await this.deviceService.updateLastUsed('device-uuid');
   */
  async updateLastUsed(deviceId: string): Promise<void> {
    await this.deviceRepository.update(deviceId, {
      lastUsedAt: new Date(),
    });
  }

  /**
   * Actualizar last_used_at por device token
   *
   * Útil cuando solo se tiene el token (ej: después de envío exitoso)
   *
   * @param userId - UUID del usuario
   * @param deviceToken - Token del dispositivo
   * @returns void
   *
   * @example
   * await this.deviceService.updateLastUsedByToken('user-uuid', 'token...');
   */
  async updateLastUsedByToken(
    userId: string,
    deviceToken: string,
  ): Promise<void> {
    await this.deviceRepository.update(
      { userId, deviceToken },
      { lastUsedAt: new Date() },
    );
  }

  /**
   * Desactivar dispositivo
   *
   * Casos de uso:
   * - Usuario hace logout explícito
   * - Usuario desactiva manualmente desde settings
   * - FCM devuelve "token invalid"
   * - App desinstalada (detectado por FCM)
   *
   * @param deviceId - UUID del dispositivo
   * @param userId - UUID del usuario (validación de ownership)
   * @throws NotFoundException si no existe o no pertenece al usuario
   *
   * @example
   * await this.deviceService.deactivateDevice('device-uuid', 'user-uuid');
   */
  async deactivateDevice(deviceId: string, userId: string): Promise<void> {
    const device = await this.getDeviceById(deviceId, userId);

    device.isActive = false;
    await this.deviceRepository.save(device);
  }

  /**
   * Reactivar dispositivo
   *
   * @param deviceId - UUID del dispositivo
   * @param userId - UUID del usuario (validación de ownership)
   * @throws NotFoundException si no existe o no pertenece al usuario
   *
   * @example
   * await this.deviceService.reactivateDevice('device-uuid', 'user-uuid');
   */
  async reactivateDevice(deviceId: string, userId: string): Promise<void> {
    const device = await this.getDeviceById(deviceId, userId);

    device.isActive = true;
    device.lastUsedAt = new Date();
    await this.deviceRepository.save(device);
  }

  /**
   * Invalidar dispositivo por token
   *
   * Llamar cuando FCM devuelve "token invalid" o "not registered"
   * Desactiva el dispositivo para prevenir futuros intentos de envío
   *
   * @param userId - UUID del usuario
   * @param deviceToken - Token del dispositivo
   * @returns void
   *
   * @example
   * // En worker después de error de FCM:
   * if (fcmError.code === 'messaging/invalid-registration-token') {
   *   await this.deviceService.invalidateDevice(userId, deviceToken);
   * }
   */
  async invalidateDevice(userId: string, deviceToken: string): Promise<void> {
    await this.deviceRepository.update(
      { userId, deviceToken },
      { isActive: false },
    );
  }

  /**
   * Eliminar dispositivo
   *
   * Elimina permanentemente el registro
   * Usuario debe volver a registrar el dispositivo si quiere recibir push
   *
   * @param deviceId - UUID del dispositivo
   * @param userId - UUID del usuario (validación de ownership)
   * @throws NotFoundException si no existe o no pertenece al usuario
   *
   * @example
   * await this.deviceService.deleteDevice('device-uuid', 'user-uuid');
   */
  async deleteDevice(deviceId: string, userId: string): Promise<void> {
    const device = await this.getDeviceById(deviceId, userId);
    await this.deviceRepository.remove(device);
  }

  /**
   * Eliminar todos los dispositivos de un usuario
   *
   * Útil para:
   * - Usuario cierra cuenta
   * - Usuario revoca todos los permisos de notificaciones
   *
   * @param userId - UUID del usuario
   * @returns Número de dispositivos eliminados
   *
   * @example
   * const deleted = await this.deviceService.deleteAllUserDevices('user-uuid');
   */
  async deleteAllUserDevices(userId: string): Promise<number> {
    const result = await this.deviceRepository.delete({ userId });
    return result.affected || 0;
  }

  /**
   * Desactivar dispositivos obsoletos (no usados en X días)
   *
   * Debe ejecutarse en cron job periódico (ej: semanal)
   *
   * Criterio:
   * - last_used_at > threshold días
   * - is_active = true (solo desactivar activos, no re-procesar inactivos)
   *
   * @param daysThreshold - Días sin uso para considerar obsoleto (default: 90)
   * @returns Número de dispositivos desactivados
   *
   * @example
   * // En cron job semanal:
   * const deactivated = await this.deviceService.deactivateStaleDevices(90);
   * this.logger.log(`Deactivated ${deactivated} stale devices`);
   */
  async deactivateStaleDevices(daysThreshold: number = 90): Promise<number> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysThreshold);

    const result = await this.deviceRepository
      .createQueryBuilder()
      .update(UserDevice)
      .set({ isActive: false })
      .where('last_used_at < :threshold', { threshold })
      .andWhere('is_active = true')
      .execute();

    return result.affected || 0;
  }

  /**
   * Eliminar dispositivos obsoletos desactivados
   *
   * Debe ejecutarse en cron job periódico (ej: mensual)
   *
   * Criterio:
   * - is_active = false
   * - last_used_at > threshold días (default: 180)
   *
   * @param daysThreshold - Días sin uso para eliminar (default: 180)
   * @returns Número de dispositivos eliminados
   *
   * @example
   * // En cron job mensual:
   * const deleted = await this.deviceService.cleanupStaleDevices(180);
   * this.logger.log(`Deleted ${deleted} stale inactive devices`);
   */
  async cleanupStaleDevices(daysThreshold: number = 180): Promise<number> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysThreshold);

    const result = await this.deviceRepository
      .createQueryBuilder()
      .delete()
      .where('last_used_at < :threshold', { threshold })
      .andWhere('is_active = false')
      .execute();

    return result.affected || 0;
  }

  /**
   * Obtener estadísticas de dispositivos
   *
   * @returns Estadísticas por tipo y estado
   *
   * @example
   * const stats = await this.deviceService.getDeviceStats();
   * // {
   * //   total: 1523,
   * //   active: 1204,
   * //   inactive: 319,
   * //   byType: { ios: 645, android: 823, web: 55 }
   * // }
   */
  async getDeviceStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
  }> {
    const total = await this.deviceRepository.count();
    const active = await this.deviceRepository.count({ where: { isActive: true } });
    const inactive = total - active;

    // Contar por tipo
    const byTypeRaw = await this.deviceRepository
      .createQueryBuilder('d')
      .select('d.device_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('d.device_type')
      .getRawMany();

    const byType: Record<string, number> = {};
    for (const row of byTypeRaw) {
      byType[row.type] = parseInt(row.count, 10);
    }

    return { total, active, inactive, byType };
  }

  /**
   * Actualizar nombre de dispositivo
   *
   * @param deviceId - UUID del dispositivo
   * @param userId - UUID del usuario (validación de ownership)
   * @param deviceName - Nuevo nombre
   * @throws NotFoundException si no existe o no pertenece al usuario
   *
   * @example
   * await this.deviceService.updateDeviceName(
   *   'device-uuid',
   *   'user-uuid',
   *   'Mi iPhone 13 Pro'
   * );
   */
  async updateDeviceName(
    deviceId: string,
    userId: string,
    deviceName: string,
  ): Promise<UserDevice> {
    const device = await this.getDeviceById(deviceId, userId);

    device.deviceName = deviceName;
    return this.deviceRepository.save(device);
  }

  /**
   * Verificar si un usuario tiene dispositivos activos
   *
   * Útil para decidir si enviar push notification
   *
   * @param userId - UUID del usuario
   * @returns true si tiene al menos un dispositivo activo
   *
   * @example
   * const canSendPush = await this.deviceService.hasActiveDevices('user-uuid');
   * if (canSendPush) {
   *   await this.notificationService.sendPush(...);
   * }
   */
  async hasActiveDevices(userId: string): Promise<boolean> {
    const count = await this.deviceRepository.count({
      where: { userId, isActive: true },
    });
    return count > 0;
  }
}
