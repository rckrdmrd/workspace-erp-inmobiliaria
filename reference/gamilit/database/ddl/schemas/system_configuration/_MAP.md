# Schema: system_configuration

Configuración del sistema: feature flags, ajustes, configuración del sistema, rate limiting

## Estructura

- **tables/**: 8 archivos
- **functions/**: 2 archivos
- **triggers/**: 2 archivos
- **rls-policies/**: 1 archivos

**Total:** 13 objetos

## Contenido Detallado

### tables/ (8 archivos)

```
01-system_settings.sql
02-feature_flags.sql
03-notification_settings.sql (preferencias POR USUARIO)
04-rate_limits.sql (NUEVO 2025-11-11)
05-notification_settings_global.sql (NUEVO 2025-11-11 - configuración GLOBAL)
api_configuration.sql
environment_config.sql
tenant_configurations.sql
```

### functions/ (2 archivos)

```
is_feature_enabled.sql
update_feature_flag.sql
```

### triggers/ (2 archivos)

```
29-trg_feature_flags_updated_at.sql
30-trg_system_settings_updated_at.sql
```

### rls-policies/ (1 archivos)

```
01-policies.sql
```

---

## Notas Importantes

### Notificaciones - Dos Tablas Separadas

1. **notification_settings** (03-): Preferencias POR USUARIO
   - Incluye `user_id NOT NULL`
   - Configuración individual de cada usuario
   - Ejemplos: quiet hours, max_per_day, frecuencia preferida

2. **notification_settings_global** (05-): Configuración GLOBAL del sistema
   - SIN user_id (configuración a nivel sistema)
   - Define comportamiento por defecto para todos los usuarios
   - Incluye throttling, batching, templates
   - Seeds: `seeds/prod/system_configuration/03-notification_settings_global.sql`

### Rate Limiting (04-)

- Protección de API contra uso excesivo
- Soporta múltiples scopes: ip, user, consumer, global
- Incluye burst allowance para picos temporales
- Seeds: `seeds/prod/system_configuration/04-rate_limits.sql`

---

**Última actualización:** 2025-11-11
**Reorganización:** 2025-11-09
**Nuevas tablas:** 2025-11-11 (rate_limits, notification_settings_global)
