# Schema: gamilit

Funciones y utilidades compartidas del sistema GAMILIT

## Estructura

- **functions/**: 14 archivos
- **views/**: 1 archivo

**Total:** 15 objetos

## Contenido Detallado

### functions/ (14 archivos)

```
01-audit_profile_changes.sql
02-get_current_user_id.sql
03-get_current_user_role.sql
04-initialize_user_stats.sql
05-is_admin.sql
08-now_mexico.sql
09-set_profile_defaults.sql
10-update_classroom_member_count.sql
11-update_user_last_login.sql
12-validate_email_format.sql
13-validate_username.sql
14-update_user_stats_on_exercise_complete.sql
15-update_updated_at_column.sql
validate_date_range.sql
```

### views/ (1 archivo)

```
number_series.sql    (migrado desde public 2025-11-11)
```

## Descripción

Funciones y vistas utilitarias reutilizables en todo el sistema:

- **Funciones de auditoría**: audit_profile_changes
- **Funciones de contexto**: get_current_user_id, get_current_user_role, is_admin
- **Funciones de inicialización**: initialize_user_stats, set_profile_defaults
- **Funciones de actualización**: update_*, set_*
- **Funciones de validación**: validate_*
- **Funciones de timestamp**: now_mexico (zona horaria Mexico City)
- **Vistas utilitarias**: number_series (generador de números 1-1000)

---

**Última actualización:** 2025-11-11
**Reorganización:** 2025-11-11 (agregada vista number_series migrada desde public)
