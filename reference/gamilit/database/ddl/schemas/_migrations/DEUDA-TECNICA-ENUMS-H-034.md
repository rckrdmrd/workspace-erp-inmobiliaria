# Deuda Técnica: ENUMs Sin Uso (H-034)

**Fecha:** 2025-11-19
**Auditoría:** DB-124
**Hallazgo:** H-034
**Prioridad:** P2 (Mediana)
**Estado:** 📋 DOCUMENTADO (Backlog)

---

## Resumen

Se identificaron **10 ENUMs sin uso** en schemas `audit_logging` y `social_features` que tienen tablas implementadas, pero las tablas usan tipos primitivos (TEXT/VARCHAR) con CHECK constraints en lugar de ENUMs.

---

## ENUMs Afectados

### audit_logging (6 ENUMs - 0% uso)

| ENUM | Valores | Columna Objetivo | Bloqueador |
|------|---------|------------------|------------|
| `audit_action` | create, update, delete, login, logout, access, export, import | audit_logs.action | ✅ YA IMPLEMENTADO |
| `alert_severity` | info, warning, error, critical | audit_logs.severity, system_alerts.severity | CHECK constraint + índice WHERE |
| `alert_status` | active, acknowledged, resolved, ignored | system_alerts.status | CHECK constraint + índice WHERE |
| `log_level` | debug, info, warning, error, critical | system_logs.log_level | - |
| `metric_type` | engagement, performance, completion, time_spent, accuracy, streak, social_interaction | performance_metrics.metric_type | - |
| `aggregation_period` | daily, weekly, monthly, quarterly, yearly | (sin columna) | Sin uso planeado |

### social_features (4 ENUMs - 25% uso)

| ENUM | Valores | Columna Objetivo | Bloqueador |
|------|---------|------------------|------------|
| `classroom_role` | teacher, student, assistant | teacher_classrooms.role | ✅ YA IMPLEMENTADO |
| `team_role` | leader, member, coordinator | team_members.role | ✅ YA IMPLEMENTADO |
| `friendship_status` | pending, accepted, blocked | friendships.status | Policy RLS |
| `social_event_type` | competition, collaboration, challenge, tournament, workshop | social_interactions.interaction_type | Requiere análisis |

**Total:** 10 ENUMs (3 implementados, 7 pendientes)

---

## Problema Técnico

Las tablas usan CHECK constraints en lugar de ENUMs:

```sql
-- Ejemplo: system_alerts
ALTER TABLE audit_logging.system_alerts
  ADD CONSTRAINT system_alerts_severity_check
  CHECK (severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]));

ALTER TABLE audit_logging.system_alerts
  ADD CONSTRAINT system_alerts_status_check
  CHECK (status = ANY (ARRAY['open'::text, 'acknowledged'::text, 'resolved'::text, 'suppressed'::text]));
```

Además, hay índices con predicados TEXT:

```sql
CREATE INDEX idx_alerts_open
  ON audit_logging.system_alerts(status, severity)
  WHERE status = 'open'::text;
```

**Impacto de migración:**
- Requiere DROP constraints (6+ constraints)
- Requiere DROP/CREATE índices con predicados
- Requiere ALTER TYPE con trigger deshabilitado
- Requiere recrear constraints con ENUM values
- ~60-90 minutos de trabajo

---

## Razón de NO Implementación Inmediata

1. **Tablas vacías**: audit_logging tiene 0 registros, social_features solo 5 registros
2. **Bajo ROI**: Trabajo extenso para beneficio mínimo en entorno actual
3. **CHECK constraints suficientes**: Validan datos correctamente
4. **Índices funcionales**: Funcionan correctamente con TEXT

---

## Decisión

**Mantener ENUMs definidos** y documentar como **deuda técnica** para refactorización futura.

**Razones:**
- Los ENUMs ya existen y no causan problemas
- Si en futuro se decide refactorizar, ya están definidos
- Eliminarlos y recrearlos después sería trabajo adicional

---

## Plan de Refactorización Futura

### Cuándo ejecutar

Ejecutar cuando se cumpla **cualquiera** de estas condiciones:

1. **Alta carga de datos**: Tablas superan 10,000 registros
2. **Performance crítica**: Queries de audit_logging/social_features son >10% de carga total
3. **Migración mayor**: Se planea refactorización de schemas completos
4. **Nuevo proyecto**: Se implementa auditoría/social features desde cero

### Pasos de migración (CUANDO se ejecute)

```sql
-- 1. Desactivar triggers
ALTER TABLE audit_logging.system_alerts DISABLE TRIGGER ALL;

-- 2. DROP CHECK constraints
ALTER TABLE audit_logging.system_alerts
  DROP CONSTRAINT system_alerts_severity_check,
  DROP CONSTRAINT system_alerts_status_check;

-- 3. DROP índices con predicados TEXT
DROP INDEX audit_logging.idx_alerts_open;

-- 4. ALTER columnas a ENUM
ALTER TABLE audit_logging.system_alerts
  ALTER COLUMN severity TYPE audit_logging.alert_severity
    USING severity::audit_logging.alert_severity,
  ALTER COLUMN status TYPE audit_logging.alert_status
    USING CASE
      WHEN status = 'open' THEN 'active'::audit_logging.alert_status
      WHEN status::text = ANY(ARRAY['active', 'acknowledged', 'resolved', 'ignored'])
      THEN status::audit_logging.alert_status
      ELSE 'active'::audit_logging.alert_status
    END;

-- 5. RECREAR índices con ENUM
CREATE INDEX idx_alerts_open
  ON audit_logging.system_alerts(status, severity)
  WHERE status = 'active'::audit_logging.alert_status;

-- 6. Reactivar triggers
ALTER TABLE audit_logging.system_alerts ENABLE TRIGGER ALL;
```

Repetir para todas las tablas afectadas.

### Tiempo estimado (cuando se ejecute)

- Análisis de datos existentes: 30 min
- Migración de 6+ tablas: 60-90 min
- Testing: 30 min
- **Total: 2-2.5 horas**

---

## Beneficios de Migración Futura

1. **Validación a nivel BD**: Imposible insertar valores inválidos
2. **Performance**: Índices más eficientes con ENUMs
3. **Autocomplete**: Herramientas de BD muestran valores permitidos
4. **Menor storage**: ENUMs usan menos espacio que TEXT
5. **Type safety**: APIs y ORMs detectan errores en compile-time

---

## Estado Actual

**Implementado:**
- ✅ audit_logs.action → audit_action ENUM
- ✅ teacher_classrooms.role → classroom_role ENUM
- ✅ team_members.role → team_role ENUM

**Pendiente (backlog):**
- ⏳ audit_logs.severity → alert_severity ENUM
- ⏳ system_alerts.severity → alert_severity ENUM
- ⏳ system_alerts.status → alert_status ENUM
- ⏳ system_logs.log_level → log_level ENUM
- ⏳ performance_metrics.metric_type → metric_type ENUM
- ⏳ friendships.status → friendship_status ENUM
- ⏳ social_interactions.interaction_type → social_event_type ENUM (requiere análisis)

**Sin uso planeado:**
- ❌ aggregation_period → (eliminar si no se usa en 6 meses)

---

## Referencias

- **Auditoría:** orchestration/database/DB-124/
- **Hallazgo:** H-034
- **Scripts parciales:**
  - `ddl/schemas/_migrations/01-implement-enums-audit-social.sql` (v1 - fallida)
  - `ddl/schemas/_migrations/02-implement-enums-audit-social-v2.sql` (v2 - parcial)
- **Documentación:** Este archivo

---

## Revisión

**Próxima revisión:** 2025-05 (6 meses)
**Criterio de cierre:**
- Opción A: Migración completa ejecutada
- Opción B: Se decide eliminar ENUMs sin uso si no hay plan de implementación

---

**Responsable:** Database Agent
**Estado:** 📋 BACKLOG (Deuda Técnica Documentada)
