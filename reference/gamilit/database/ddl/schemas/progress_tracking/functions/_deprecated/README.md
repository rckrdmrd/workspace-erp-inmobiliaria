# Funciones Deprecadas - progress_tracking

Este directorio contiene funciones que han sido deprecadas y removidas del esquema activo de `progress_tracking`.

---

## 02-check_mechanic_completion.sql

**Fecha de deprecación:** 2025-11-07
**Razón:** Feature no implementada - tabla `mechanic_progress` no existe

### Detalles

La función `check_mechanic_completion` fue creada para verificar el progreso de "mecánicas" educativas individuales, pero:

1. **Tabla inexistente**: Referencia `progress_tracking.mechanic_progress` que nunca fue creada
2. **Concepto no definido**: No existe tabla `educational_content.mechanics`
3. **Sin uso**: La función no es llamada por ningún otro código del sistema
4. **Sin especificación**: No hay documentación que defina qué es una "mecánica" como concepto separado

### Decisión Arquitectural

**Decisión D3-B** del documento `DECISIONES-ARQUITECTURALES-REQUERIDAS.md`:
- Se decidió **eliminar** la función en lugar de implementar el feature completo
- Razón: Simplifica el sistema sin perder funcionalidad documentada
- Alternativa considerada: Crear tabla + feature completo, pero rechazada por falta de especificación clara

### Migración

Si en el futuro se necesita tracking granular de "mecánicas":

1. Definir primero qué es una "mecánica" en el modelo de datos
2. Crear tabla `educational_content.mechanics`
3. Crear tabla `progress_tracking.mechanic_progress`
4. Revisar esta función como punto de partida
5. Integrar con sistema de progreso existente

### Archivos relacionados

- **Documentación**: `apps/database/docs/DECISIONES-ARQUITECTURALES-REQUERIDAS.md` (D3)
- **Tracking**: `apps/database/docs/TRACKING-CORRECCIONES.md`
- **Validación**: `apps/database/docs/REPORTE-VALIDACION-INTEGRIDAD-2025-11-07.md`

---

**Última actualización:** 2025-11-07
**Autor:** Sistema de Validación de Integridad
