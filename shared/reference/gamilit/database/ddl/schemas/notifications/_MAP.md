# Schema: notifications

Sistema de notificaciones multi-canal (in-app, email, push web)

## Estructura

- **00-create-schema.sql**: 1 archivo (creación del schema)
- **tables/**: 6 archivos
- **functions/**: 3 archivos

**Total:** 10 objetos

## Contenido Detallado

### Schema

```
00-create-schema.sql              (creado 2025-11-11 - EXT-003)
```

### tables/ (6 archivos)

```
01-notifications.sql              (creado 2025-11-11 - EXT-003)
02-notification_preferences.sql   (creado 2025-11-11 - EXT-003)
03-notification_logs.sql          (creado 2025-11-11 - EXT-003)
04-notification_templates.sql     (creado 2025-11-11 - EXT-003)
05-notification_queue.sql         (creado 2025-11-11 - EXT-003)
06-user_devices.sql               (creado 2025-11-11 - EXT-003)
```

### functions/ (3 archivos)

```
01-send_notification.sql          (creado 2025-11-11 - EXT-003)
02-get_user_preferences.sql       (creado 2025-11-11 - EXT-003)
03-queue_batch_notifications.sql  (creado 2025-11-11 - EXT-003)
```

## Descripción

### Tablas

- **notifications**: Notificaciones enviadas a usuarios (in-app, email, push)
- **notification_preferences**: Preferencias de notificaciones por usuario y tipo
- **notification_logs**: Historial de envíos por canal con estado y respuesta de proveedor
- **notification_templates**: Plantillas reutilizables con variables {{placeholder}}
- **notification_queue**: Cola de envío para procesamiento asíncrono
- **user_devices**: Dispositivos registrados para push notifications

### Funciones

- **send_notification()**: Crea notificación respetando preferencias del usuario y la encola
- **get_user_preferences()**: Obtiene preferencias configuradas por un usuario
- **queue_batch_notifications()**: Encola notificaciones masivas a múltiples usuarios

## Características

- **Multi-canal**: Soporte para in-app, email y push notifications
- **Preferencias de usuario**: Control granular por tipo de notificación
- **Sistema de cola**: Envío asíncrono con reintentos
- **Templates**: Plantillas reutilizables con variables
- **Tracking completo**: Logs de envío por canal
- **Priorización**: Sistema de prioridades (urgent, high, normal, low)
- **Quiet hours**: Respeto de horarios de silencio por usuario

---

**Última actualización:** 2025-11-11
**Relacionado:** EXT-003 (Notificaciones Multi-Canal)
**Estado:** Implementado - Capa Database
