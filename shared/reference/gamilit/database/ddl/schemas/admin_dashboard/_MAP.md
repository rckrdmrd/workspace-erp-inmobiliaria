# Schema: admin_dashboard

Tablas, funciones y vistas para panel de administración y reportes analíticos

## Estructura

- **tables/**: 1 archivo
- **functions/**: 1 archivo
- **views/**: 6 archivos

**Total:** 8 objetos

## Contenido Detallado

### tables/ (1 archivo)

```
07-bulk_operations.sql              (creado 2025-11-11 - EXT-002)
```

### functions/ (1 archivo)

```
01-update_bulk_operation_progress.sql  (creado 2025-11-11 - EXT-002)
```

### views/ (6 archivos)

```
assignment_submission_stats.sql    (migrado desde public 2025-11-11)
classroom_overview.sql              (migrado desde public 2025-11-11)
moderation_queue.sql
organization_stats_summary.sql
recent_admin_actions.sql
user_stats_summary.sql
```

## Descripción

### Tablas
- **bulk_operations**: Registro de operaciones masivas (bulk) realizadas por administradores sobre múltiples usuarios/recursos

### Funciones
- **update_bulk_operation_progress**: Actualiza el progreso de operaciones bulk incrementando contadores

### Vistas
Vistas SQL optimizadas para consultas analíticas del dashboard administrativo:

- **assignment_submission_stats**: Estadísticas de entregas de assignments
- **classroom_overview**: Overview completo de aulas y estudiantes
- **moderation_queue**: Cola de moderación de contenido
- **organization_stats_summary**: Resumen de estadísticas organizacionales
- **recent_admin_actions**: Acciones administrativas recientes
- **user_stats_summary**: Resumen de estadísticas de usuarios

---

**Última actualización:** 2025-11-11
**Reorganización:** 2025-11-11 (migración de 2 vistas desde public)
**Extensión:** 2025-11-11 (agregadas tabla bulk_operations y función helper para EXT-002)
