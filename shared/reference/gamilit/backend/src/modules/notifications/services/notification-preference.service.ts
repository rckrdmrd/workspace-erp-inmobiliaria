import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotificationPreference } from '../entities/multichannel/notification-preference.entity';

/**
 * NotificationPreferenceService
 *
 * @description Gestión de preferencias de notificaciones por usuario (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Responsabilidades:
 * - CRUD de preferencias por usuario y tipo
 * - Obtener preferencias con defaults automáticos
 * - Integración con función SQL get_user_preferences()
 * - Validar si se debe enviar por un canal específico
 *
 * Características:
 * - Defaults: in_app=true, email=true, push=false
 * - Granularidad por tipo de notificación
 * - Upsert pattern (actualiza si existe, crea si no)
 * - Función SQL retorna defaults si no hay preferencias configuradas
 *
 * Casos de uso:
 * - Usuario configura preferencias desde settings
 * - Sistema consulta preferencias antes de enviar
 * - Usuario resetea a defaults
 */
@Injectable()
export class NotificationPreferenceService {
  constructor(
    @InjectRepository(NotificationPreference, 'notifications')
    private readonly preferenceRepository: Repository<NotificationPreference>,
    @InjectDataSource('notifications')
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Obtener preferencias de un usuario
   *
   * Si el usuario no tiene preferencias configuradas, retorna defaults:
   * - in_app_enabled: true
   * - email_enabled: true
   * - push_enabled: false
   *
   * Integración opcional con función SQL get_user_preferences()
   *
   * @param userId - UUID del usuario
   * @returns Array de preferencias (configuradas + defaults para tipos no configurados)
   *
   * @example
   * const prefs = await this.preferenceService.getUserPreferences(userId);
   * // [
   * //   { notificationType: 'achievement', inAppEnabled: true, emailEnabled: false, ... },
   * //   { notificationType: 'assignment_due', inAppEnabled: true, emailEnabled: true, ... }
   * // ]
   */
  async getUserPreferences(userId: string): Promise<NotificationPreference[]> {
    const preferences = await this.preferenceRepository.find({
      where: { userId },
      order: { notificationType: 'ASC' },
    });

    // Si no tiene preferencias, retornar array vacío
    // (el frontend o el sistema usarán defaults)
    return preferences;
  }

  /**
   * Obtener preferencias usando función SQL (con defaults automáticos)
   *
   * Llama a la función PostgreSQL notifications.get_user_preferences()
   * que retorna defaults si no existen preferencias configuradas
   *
   * @param userId - UUID del usuario
   * @returns Array de preferencias desde función SQL
   *
   * @example
   * const prefs = await this.preferenceService.getUserPreferencesFromSQL(userId);
   */
  async getUserPreferencesFromSQL(userId: string): Promise<any[]> {
    const result = await this.dataSource.query(
      'SELECT * FROM notifications.get_user_preferences($1)',
      [userId],
    );
    return result;
  }

  /**
   * Obtener preferencia para un tipo específico
   *
   * Si no existe, retorna defaults
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación
   * @returns Preferencia (configurada o defaults)
   *
   * @example
   * const pref = await this.preferenceService.getPreferenceForType(
   *   userId,
   *   'achievement'
   * );
   */
  async getPreferenceForType(
    userId: string,
    notificationType: string,
  ): Promise<NotificationPreference> {
    const preference = await this.preferenceRepository.findOne({
      where: { userId, notificationType },
    });

    // Si no existe, retornar defaults
    if (!preference) {
      const defaultPreference = new NotificationPreference();
      defaultPreference.userId = userId;
      defaultPreference.notificationType = notificationType;
      defaultPreference.inAppEnabled = true;
      defaultPreference.emailEnabled = true;
      defaultPreference.pushEnabled = false;
      return defaultPreference;
    }

    return preference;
  }

  /**
   * Actualizar preferencia para un tipo
   *
   * Usa patrón upsert: actualiza si existe, crea si no
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación
   * @param updates - Campos a actualizar
   * @returns Preferencia actualizada
   *
   * @example
   * const pref = await this.preferenceService.updatePreference(
   *   userId,
   *   'achievement',
   *   { emailEnabled: false, pushEnabled: true }
   * );
   */
  async updatePreference(
    userId: string,
    notificationType: string,
    updates: {
      inAppEnabled?: boolean;
      emailEnabled?: boolean;
      pushEnabled?: boolean;
    },
  ): Promise<NotificationPreference> {
    // Buscar preferencia existente
    let preference = await this.preferenceRepository.findOne({
      where: { userId, notificationType },
    });

    if (preference) {
      // Actualizar existente
      Object.assign(preference, updates);
    } else {
      // Crear nueva con defaults + updates
      preference = this.preferenceRepository.create({
        userId,
        notificationType,
        inAppEnabled: updates.inAppEnabled ?? true,
        emailEnabled: updates.emailEnabled ?? true,
        pushEnabled: updates.pushEnabled ?? false,
      });
    }

    return this.preferenceRepository.save(preference);
  }

  /**
   * Actualizar múltiples preferencias de un usuario
   *
   * Permite actualizar varias preferencias en una sola llamada
   *
   * @param userId - UUID del usuario
   * @param preferences - Array de preferencias a actualizar
   * @returns Array de preferencias actualizadas
   *
   * @example
   * const prefs = await this.preferenceService.updateMultiple(userId, [
   *   { notificationType: 'achievement', emailEnabled: false },
   *   { notificationType: 'friend_request', pushEnabled: true }
   * ]);
   */
  async updateMultiple(
    userId: string,
    preferences: Array<{
      notificationType: string;
      inAppEnabled?: boolean;
      emailEnabled?: boolean;
      pushEnabled?: boolean;
    }>,
  ): Promise<NotificationPreference[]> {
    const updated: NotificationPreference[] = [];

    for (const pref of preferences) {
      const { notificationType, ...updates } = pref;
      const result = await this.updatePreference(userId, notificationType, updates);
      updated.push(result);
    }

    return updated;
  }

  /**
   * Resetear preferencias de un usuario a defaults
   *
   * Elimina todas las preferencias configuradas
   * El sistema usará defaults automáticamente
   *
   * @param userId - UUID del usuario
   *
   * @example
   * await this.preferenceService.resetToDefaults(userId);
   */
  async resetToDefaults(userId: string): Promise<void> {
    await this.preferenceRepository.delete({ userId });
  }

  /**
   * Resetear preferencia de un tipo específico
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación
   *
   * @example
   * await this.preferenceService.resetTypeToDefault(userId, 'achievement');
   */
  async resetTypeToDefault(userId: string, notificationType: string): Promise<void> {
    await this.preferenceRepository.delete({ userId, notificationType });
  }

  /**
   * Verificar si se debe enviar notificación por un canal específico
   *
   * Consulta las preferencias del usuario para el tipo de notificación
   * y retorna si el canal está habilitado
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación
   * @param channel - Canal a verificar ('in_app' | 'email' | 'push')
   * @returns true si debe enviar, false si no
   *
   * @example
   * const shouldSend = await this.preferenceService.shouldSendOnChannel(
   *   userId,
   *   'achievement',
   *   'email'
   * );
   * if (shouldSend) {
   *   // Enviar notificación por email
   * }
   */
  async shouldSendOnChannel(
    userId: string,
    notificationType: string,
    channel: 'in_app' | 'email' | 'push',
  ): Promise<boolean> {
    const preference = await this.getPreferenceForType(userId, notificationType);

    switch (channel) {
      case 'in_app':
        return preference.inAppEnabled;
      case 'email':
        return preference.emailEnabled;
      case 'push':
        return preference.pushEnabled;
      default:
        return false;
    }
  }

  /**
   * Obtener canales habilitados para un usuario y tipo
   *
   * Retorna array de canales que están habilitados
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación
   * @returns Array de canales habilitados
   *
   * @example
   * const channels = await this.preferenceService.getEnabledChannels(
   *   userId,
   *   'achievement'
   * );
   * // ['in_app', 'email'] - si solo esos dos están habilitados
   */
  async getEnabledChannels(
    userId: string,
    notificationType: string,
  ): Promise<string[]> {
    const preference = await this.getPreferenceForType(userId, notificationType);

    const enabledChannels: string[] = [];

    if (preference.inAppEnabled) {
      enabledChannels.push('in_app');
    }
    if (preference.emailEnabled) {
      enabledChannels.push('email');
    }
    if (preference.pushEnabled) {
      enabledChannels.push('push');
    }

    return enabledChannels;
  }

  /**
   * Deshabilitar completamente un tipo de notificación
   *
   * Desactiva todos los canales para un tipo de notificación
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación a silenciar
   *
   * @example
   * await this.preferenceService.disableNotificationType(userId, 'friend_request');
   */
  async disableNotificationType(
    userId: string,
    notificationType: string,
  ): Promise<void> {
    await this.updatePreference(userId, notificationType, {
      inAppEnabled: false,
      emailEnabled: false,
      pushEnabled: false,
    });
  }

  /**
   * Habilitar completamente un tipo de notificación
   *
   * Activa todos los canales para un tipo de notificación
   *
   * @param userId - UUID del usuario
   * @param notificationType - Tipo de notificación a habilitar
   *
   * @example
   * await this.preferenceService.enableNotificationType(userId, 'assignment_due');
   */
  async enableNotificationType(
    userId: string,
    notificationType: string,
  ): Promise<void> {
    await this.updatePreference(userId, notificationType, {
      inAppEnabled: true,
      emailEnabled: true,
      pushEnabled: true,
    });
  }
}
