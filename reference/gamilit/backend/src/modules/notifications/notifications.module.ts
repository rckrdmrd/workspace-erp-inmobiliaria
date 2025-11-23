import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ========== SISTEMA BÁSICO (gamification_system.notifications) ==========
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';

// ========== SISTEMA MULTI-CANAL (notifications schema - EXT-003) ==========
// Entities
import {
  NotificationTemplate,
  Notification as NotificationMultiChannel,
  NotificationPreference,
  NotificationLog,
  NotificationQueue,
  UserDevice,
} from './entities/multichannel';

// Services
import { NotificationTemplateService } from './services/notification-template.service';
import { NotificationPreferenceService } from './services/notification-preference.service';
import { NotificationService } from './services/notification.service';
import { NotificationQueueService } from './services/notification-queue.service';
import { UserDeviceService } from './services/user-device.service';

// Controllers
import {
  NotificationMultiChannelController,
  NotificationPreferencesController,
  NotificationDevicesController,
  NotificationTemplatesController,
} from './controllers';

// Other modules
import { WebSocketModule } from '../websocket/websocket.module';

/**
 * NotificationsModule
 *
 * @description Módulo que integra dos sistemas de notificaciones
 * @version 2.0 (2025-11-13) - Agregado sistema multi-canal EXT-003
 *
 * SISTEMAS INCLUIDOS:
 *
 * 1. Sistema Básico (gamification_system.notifications):
 *    - Notificaciones in-app simples
 *    - Para sistema de gamificación
 *    - Entity: Notification (gamification datasource)
 *    - Service: NotificationsService
 *    - Controller: NotificationsController
 *
 * 2. Sistema Multi-Canal (notifications schema):
 *    - Notificaciones multi-canal (in_app, email, push)
 *    - Templates con interpolación de variables
 *    - Preferencias por usuario y tipo
 *    - Cola asíncrona para procesamiento
 *    - Dispositivos para push notifications
 *    - 6 Entities (notifications datasource)
 *    - 5 Services
 *    - 4 Controllers
 *
 * IMPORTANTE:
 * - Ambos sistemas coexisten y son complementarios
 * - Sistema básico: notificaciones in-app rápidas
 * - Sistema multi-canal: notificaciones profesionales con templates
 * - Rutas diferenciadas para evitar conflictos
 */
@Module({
  imports: [
    // Sistema básico (gamification datasource)
    TypeOrmModule.forFeature([Notification], 'gamification'),

    // Sistema multi-canal (notifications datasource)
    TypeOrmModule.forFeature(
      [
        NotificationTemplate,
        NotificationMultiChannel,
        NotificationPreference,
        NotificationLog,
        NotificationQueue,
        UserDevice,
      ],
      'notifications',
    ),

    WebSocketModule,
  ],
  controllers: [
    // Sistema básico
    NotificationsController,

    // Sistema multi-canal
    NotificationMultiChannelController,
    NotificationPreferencesController,
    NotificationDevicesController,
    NotificationTemplatesController,
  ],
  providers: [
    // Sistema básico
    NotificationsService,

    // Sistema multi-canal
    NotificationTemplateService,
    NotificationPreferenceService,
    NotificationService,
    NotificationQueueService,
    UserDeviceService,
  ],
  exports: [
    // Exportar para uso en otros módulos
    NotificationsService, // Sistema básico
    NotificationService, // Sistema multi-canal
    NotificationQueueService, // Para workers/cron jobs
  ],
})
export class NotificationsModule {}
