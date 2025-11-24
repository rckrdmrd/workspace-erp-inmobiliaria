# Schema: audit_logging

Auditoría y logging: actividad de usuarios, eventos del sistema, métricas

## Estructura

- **tables/**: 6 archivos
- **enums/**: 2 archivos
- **functions/**: 4 archivos
- **triggers/**: 1 archivos
- **indexes/**: 14 archivos
- **rls-policies/**: 1 archivos

**Total:** 28 objetos

## Contenido Detallado

### tables/ (6 archivos)

```
01-audit_logs.sql
02-performance_metrics.sql
03-system_alerts.sql
04-system_logs.sql
05-user_activity_logs.sql
06-user_activity.sql
```

### enums/ (2 archivos)

```
aggregation_period.sql
metric_type.sql
```

### functions/ (4 archivos)

```
cleanup_old_system_logs.sql
cleanup_old_user_activity.sql
log_audit_event.sql
log_system_event.sql
```

### triggers/ (1 archivos)

```
01-trg_system_alerts_updated_at.sql
```

### indexes/ (14 archivos)

```
idx_activity_created.sql
idx_activity_module.sql
idx_activity_session.sql
idx_activity_type.sql
idx_activity_user.sql
idx_alerts_open.sql
idx_alerts_severity.sql
idx_alerts_status.sql
idx_alerts_triggered.sql
idx_alerts_type.sql
idx_audit_logs_actor.sql
idx_audit_logs_correlation.sql
idx_audit_logs_created.sql
idx_audit_logs_event_type.sql
```

### rls-policies/ (1 archivos)

```
01-policies.sql
```

---

**Última actualización:** 2025-11-09
**Reorganización:** 2025-11-09
