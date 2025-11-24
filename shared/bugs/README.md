# SISTEMA DE GESTIÓN DE BUGS

## Estructura

- `global/` - Bugs que afectan a componentes compartidos
- `by-component/` - Bugs organizados por componente

## Workflow

### Bug Local (específico de un proyecto)

Reportar en: `projects/{proyecto}/bugs/BUGS-ACTIVOS.md`

### Bug Global (afecta componente compartido)

1. Reportar en: `shared/bugs/global/BUGS-ACTIVOS.md`
2. Identificar proyectos afectados
3. Priorizar según impacto
4. Corregir en `shared/components/`
5. Actualizar todos los proyectos afectados
6. Validar en todos los proyectos
7. Cerrar bug y documentar

## Template de Bug Global

```yaml
## BUG-GLOBAL-XXX: Título del bug
**Componente:** shared/components/...
**Afecta a:**
  - proyecto-1 ✅
  - proyecto-2 ❌
**Prioridad:** 🔴 Alta | 🟡 Media | 🟢 Baja
**Estado:** 🔧 En corrección | 🧪 En testing | ✅ Resuelto
**Detectado en:** proyecto-x
**Fecha:** YYYY-MM-DD
**Asignado a:** Agente-X

### Descripción
...

### Impacto
...

### Plan de corrección
1. ...
```
