# US-PROJ-002: Transiciones de Estado de Proyectos

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 3
**Story Points:** 5 SP
**Prioridad:** P0 (Crítica)
**Estimación:** 2-3 días
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** cambiar el estado de un proyecto siguiendo un flujo controlado y validado
**Para** reflejar el avance del ciclo de vida del proyecto y asegurar que solo se realicen transiciones válidas con las condiciones cumplidas

---

## Contexto de Negocio

Los proyectos de construcción pasan por un ciclo de vida bien definido:

```
Licitación → Adjudicado → Ejecución → Entregado → Cerrado
```

Cada transición de estado debe:
- Validarse contra reglas de negocio
- Actualizar fechas automáticamente
- Verificar condiciones previas (checklist)
- Emitir notificaciones a equipo relevante
- Quedar registrada en auditoría (quién, cuándo, por qué)

No se permiten saltos de estado ni regresiones (excepto casos especiales con aprobación).

---

## Criterios de Aceptación

### ✅ AC1: Visualización de Estado Actual y Permitidos

**Dado** que estoy viendo el detalle de un proyecto
**Entonces** debo ver:

- **Badge visual del estado actual** con color distintivo:
  - 🟰 Licitación: Gris (#6B7280)
  - 🔵 Adjudicado: Azul (#3B82F6)
  - 🟢 Ejecución: Verde (#10B981)
  - 🟣 Entregado: Púrpura (#8B5CF6)
  - ⚫ Cerrado: Gris Oscuro (#374151)

- **Botón "Cambiar Estado"** (solo visible para Director/Admin)
- **Historial de cambios de estado** (timeline):
  ```
  📅 15/11/2025 10:30 - Juan Pérez cambió estado a "Ejecución"
     Nota: "Licencias obtenidas, inicia construcción"

  📅 10/10/2025 09:15 - María López cambió estado a "Adjudicado"
     Nota: "Contrato firmado con INFONAVIT"
  ```

---

### ✅ AC2: Flujo de Cambio de Estado

**Dado** que soy Director o Admin
**Y** el proyecto está en estado "Adjudicado"
**Cuando** hago clic en "Cambiar Estado"
**Entonces** debo ver un modal con:

```
┌───────────────────────────────────────────────────────────┐
│ Cambiar Estado del Proyecto                               │
│ PROJ-2025-001 - Fraccionamiento Los Pinos                │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Estado actual: 🔵 Adjudicado                              │
│                                                           │
│ Nuevo estado:                                             │
│ ⚪ Licitación (no permitido - regresión)                  │
│ 🔵 Adjudicado (estado actual)                             │
│ 🟢 Ejecución ✓ PERMITIDO                                 │
│ ⚪ Entregado (no permitido - debe pasar por Ejecución)    │
│ ⚪ Cerrado (no permitido - debe pasar por Entregado)      │
│                                                           │
│ Seleccionado: 🟢 Ejecución                                │
│                                                           │
│ ✅ Condiciones para cambiar a Ejecución:                  │
│ ☑ Licencia de construcción obtenida                      │
│ ☑ Equipo de proyecto asignado                            │
│ ☑ Estructura del proyecto creada                         │
│ ☐ Fecha de inicio actualizada                            │
│                                                           │
│ Notas del cambio (obligatorio):                          │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Licencias obtenidas, inicio de construcción         │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ Actualizar fecha de inicio real: [📅 2025-11-15]         │
│                                                           │
│                              [Cancelar]  [Cambiar Estado] │
└───────────────────────────────────────────────────────────┘
```

**Y** solo debo poder seleccionar estados permitidos según flujo
**Y** debo completar el checklist de condiciones (si aplica)
**Y** debo ingresar nota obligatoria del cambio

---

### ✅ AC3: Validación de Transiciones Permitidas

**Reglas de flujo:**

| Estado Actual | Estados Permitidos | Condiciones |
|---------------|-------------------|-------------|
| Licitación | Adjudicado | - Monto de contrato definido<br>- Cliente asignado |
| Adjudicado | Ejecución | - Licencia de construcción<br>- Equipo asignado<br>- Estructura creada |
| Ejecución | Entregado | - Avance físico >= 95%<br>- Finiquitos firmados<br>- Acta de entrega |
| Entregado | Cerrado | - Garantías verificadas<br>- Documentación completa<br>- Cierre administrativo |

**Dado** que el proyecto está en "Ejecución"
**Cuando** intento cambiar directamente a "Cerrado"
**Entonces** sistema debe:
- Mostrar error: "No se puede cambiar de Ejecución a Cerrado directamente. Debe pasar por Entregado primero"
- No permitir seleccionar estado "Cerrado"
- Resaltar en rojo opciones no permitidas

---

### ✅ AC4: Actualización Automática de Fechas

**Cuando** cambio el estado del proyecto
**Entonces** sistema debe actualizar fechas automáticamente:

| Transición | Campo Actualizado | Valor |
|------------|-------------------|-------|
| Licitación → Adjudicado | `awardDate` | Fecha actual |
| Adjudicado → Ejecución | `actualStartDate` | Fecha seleccionada en modal |
| Ejecución → Entregado | `deliveryDate` | Fecha seleccionada en modal |
| Entregado → Cerrado | `closureDate` | Fecha actual |

**Y** si una fecha ya existe (transición repetida), debe preguntarse:
```
⚠️ Ya existe una fecha de inicio: 2025-06-01
¿Deseas actualizarla a la nueva fecha: 2025-11-15?

[Mantener fecha anterior]  [Actualizar fecha]
```

---

### ✅ AC5: Checklist de Condiciones por Transición

**Adjudicado → Ejecución:**
- [ ] Licencia de construcción obtenida
- [ ] Equipo de proyecto asignado (mínimo: 1 Director, 1 Residente)
- [ ] Estructura del proyecto creada (al menos 1 etapa)
- [ ] Presupuesto aprobado (si módulo presupuesto está activo)

**Ejecución → Entregado:**
- [ ] Avance físico global >= 95%
- [ ] Finiquitos firmados
- [ ] Acta de entrega-recepción firmada
- [ ] Bitácora de obra cerrada
- [ ] Planos as-built entregados

**Entregado → Cerrado:**
- [ ] Garantías verificadas y vigentes
- [ ] Documentación legal completa
- [ ] Cierre administrativo aprobado
- [ ] Sin pendientes legales o financieros
- [ ] Archivo de proyecto respaldado

**Cuando** el checklist no está 100% completo
**Entonces** sistema debe mostrar advertencia:
```
⚠️ Advertencia: 1 condición pendiente

No se ha marcado: "Planos as-built entregados"

¿Deseas continuar de todos modos? (requiere aprobación de Admin)

[Regresar a completar]  [Continuar (Admin)]
```

**Y** si no soy Admin, no debo poder continuar sin checklist completo

---

### ✅ AC6: Notificaciones de Cambio de Estado

**Cuando** se cambia el estado de un proyecto
**Entonces** sistema debe enviar notificaciones a:

| Destinatarios | Tipo | Ejemplo |
|---------------|------|---------|
| Equipo del proyecto (todos) | Email + In-app | "El proyecto PROJ-2025-001 cambió a estado Ejecución" |
| Director del proyecto | Email | Resumen detallado con próximos pasos |
| Administradores | In-app | Registro de auditoría |
| Cliente (opcional) | Email | Solo en transiciones: Ejecución, Entregado, Cerrado |

**Contenido de notificación:**
```
Asunto: Proyecto PROJ-2025-001 cambió a estado "Ejecución"

Proyecto: Fraccionamiento Los Pinos
Estado anterior: Adjudicado
Estado nuevo: Ejecución
Fecha de cambio: 15/11/2025 10:30
Cambiado por: Juan Pérez (Director)

Notas:
"Licencias obtenidas, inicio de construcción"

Fecha de inicio actualizada: 15/11/2025

Próximos pasos:
- Asignar cuadrillas de construcción
- Iniciar control de avances semanales
- Programar juntas de obra quincenales

[Ver Proyecto en Sistema]
```

---

### ✅ AC7: Historial y Auditoría de Cambios

**Dado** que estoy viendo el detalle de un proyecto
**Cuando** accedo a la pestaña "Historial"
**Entonces** debo ver un timeline completo de cambios de estado:

```
┌─────────────────────────────────────────────────────────────┐
│ Historial de Estados                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ● 🟢 Ejecución                                              │
│   15/11/2025 10:30 - Juan Pérez                            │
│   "Licencias obtenidas, inicio de construcción"            │
│   Actualizado: actualStartDate → 2025-11-15               │
│                                                             │
│ ● 🔵 Adjudicado                                            │
│   10/10/2025 09:15 - María López                           │
│   "Contrato firmado con INFONAVIT"                         │
│   Actualizado: awardDate → 2025-10-10                      │
│                                                             │
│ ● 🟰 Licitación                                            │
│   01/09/2025 14:00 - Sistema                               │
│   "Proyecto creado"                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Y** cada registro debe incluir:
- Timestamp exacto
- Usuario que realizó el cambio
- Estado anterior y nuevo
- Notas/motivo del cambio
- Campos actualizados automáticamente

---

### ✅ AC8: Permisos por Rol

| Acción | Director | Residente | Ingeniero | Supervisor | Admin |
|--------|----------|-----------|-----------|------------|-------|
| Cambiar estado | ✅ | ❌ | ❌ | ❌ | ✅ |
| Ver historial | ✅ | ✅ | ✅ | ✅ | ✅ |
| Forzar transición sin checklist | ❌ | ❌ | ❌ | ❌ | ✅ (con aprobación) |
| Revertir estado (regresión) | ❌ | ❌ | ❌ | ❌ | ✅ (con justificación) |

**Dado** que soy Residente
**Cuando** intento cambiar el estado de un proyecto
**Entonces** sistema muestra error: "Solo Director y Admin pueden cambiar el estado del proyecto"
**Y** el botón "Cambiar Estado" no debe estar visible

---

## Escenarios de Prueba

### Escenario 1: Transición Exitosa Adjudicado → Ejecución

**Given** proyecto en estado "Adjudicado"
**And** soy Director autenticado
**And** condiciones cumplidas:
- Licencia obtenida ✅
- Equipo asignado ✅
- Estructura creada ✅
**When** hago clic en "Cambiar Estado"
**And** selecciono "Ejecución"
**And** ingreso nota "Inicio de obra"
**And** selecciono fecha inicio: 2025-11-15
**And** hago clic en "Cambiar Estado"
**Then** estado cambia a "Ejecución"
**And** actualStartDate = 2025-11-15
**And** se envían notificaciones a equipo
**And** se registra en historial

---

### Escenario 2: Transición Bloqueada por Falta de Condiciones

**Given** proyecto en estado "Adjudicado"
**And** soy Director
**And** NO hay equipo asignado
**When** intento cambiar a "Ejecución"
**Then** sistema muestra checklist con:
- ☐ Equipo de proyecto asignado (PENDIENTE)
**And** muestra advertencia
**And** botón "Cambiar Estado" está deshabilitado hasta completar

---

### Escenario 3: Intento de Transición Inválida

**Given** proyecto en estado "Ejecución"
**When** intento cambiar directamente a "Cerrado"
**Then** opción "Cerrado" aparece deshabilitada (gris)
**And** tooltip muestra: "Debe pasar por Entregado primero"
**And** no puedo seleccionar "Cerrado"

---

### Escenario 4: Regresión de Estado (Solo Admin)

**Given** proyecto en estado "Ejecución"
**And** soy Admin
**When** solicito revertir a "Adjudicado" (regresión)
**Then** sistema muestra confirmación:
```
⚠️ ADVERTENCIA: Regresión de Estado

Estás a punto de revertir el proyecto de "Ejecución" a "Adjudicado".
Esta es una acción excepcional y quedará registrada en auditoría.

Motivo de regresión (obligatorio):
[_______________________________________________________]

[Cancelar]  [Confirmar Regresión]
```
**And** registro queda marcado en auditoría como "REGRESIÓN"

---

### Escenario 5: Notificación de Cambio de Estado

**Given** proyecto "PROJ-2025-001" cambia a "Ejecución"
**When** se completa el cambio de estado
**Then** equipo del proyecto recibe email
**And** notificación in-app aparece en dashboard
**And** cliente recibe email (si configurado)

---

## Mockups / Wireframes

### Modal de Cambio de Estado

```
┌───────────────────────────────────────────────────────────┐
│ Cambiar Estado del Proyecto                         [✕]  │
│ PROJ-2025-001 - Fraccionamiento Los Pinos                │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Estado actual: 🔵 Adjudicado                              │
│                                                           │
│ Selecciona nuevo estado:                                 │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ ⚪ Licitación                              [bloqueado]│  │
│ │ ● 🔵 Adjudicado                              [actual] │  │
│ │ ○ 🟢 Ejecución                            [permitido] │  │
│ │ ⚪ Entregado                               [bloqueado]│  │
│ │ ⚪ Cerrado                                 [bloqueado]│  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ✅ Condiciones para Ejecución:                            │
│ ☑ Licencia de construcción obtenida                      │
│ ☑ Equipo de proyecto asignado                            │
│ ☐ Estructura del proyecto creada            [PENDIENTE]  │
│                                                           │
│ ⚠️ 1 condición pendiente                                  │
│                                                           │
│ Notas del cambio *:                                      │
│ ┌─────────────────────────────────────────────────────┐  │
│ │                                                     │  │
│ │                                                     │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ Fecha de inicio real:  [📅 __/__/____]                   │
│                                                           │
│ ☐ Notificar al cliente                                   │
│                                                           │
│                              [Cancelar]  [Cambiar Estado] │
│                                             [deshabilitado]│
└───────────────────────────────────────────────────────────┘
```

### Timeline de Historial

```
┌─────────────────────────────────────────────────────────────┐
│ Historial de Estados                              [Exportar]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     ●────────────────────────────────────────────────      │
│     │                                                       │
│     🟢 Ejecución                                            │
│     15/11/2025 10:30                                        │
│     👤 Juan Pérez (Director)                                │
│     📝 "Licencias obtenidas, inicio de construcción"        │
│     🔄 actualStartDate → 2025-11-15                         │
│     │                                                       │
│     ●────────────────────────────────────────────────      │
│     │                                                       │
│     🔵 Adjudicado                                           │
│     10/10/2025 09:15                                        │
│     👤 María López (Admin)                                  │
│     📝 "Contrato firmado con INFONAVIT"                     │
│     🔄 awardDate → 2025-10-10                               │
│     │                                                       │
│     ●────────────────────────────────────────────────      │
│     │                                                       │
│     🟰 Licitación                                           │
│     01/09/2025 14:00                                        │
│     👤 Sistema (Auto)                                       │
│     📝 "Proyecto creado"                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Definición de Done (DoD)

- [ ] Validación de transiciones según flujo implementada (backend)
- [ ] Modal de cambio de estado funcional (frontend)
- [ ] Checklist de condiciones por transición implementado
- [ ] Actualización automática de fechas funcionando
- [ ] Historial de cambios de estado visible y completo
- [ ] Notificaciones enviadas a equipo y cliente
- [ ] Permisos por rol implementados
- [ ] Tests unitarios de validación de transiciones (>80% coverage)
- [ ] Tests de integración para flujo completo de cambio
- [ ] Regresión de estado (solo Admin) implementada con auditoría
- [ ] Documentación de API actualizada (Swagger)
- [ ] Código revisado y aprobado
- [ ] Probado en QA con diferentes escenarios
- [ ] Sin issues de seguridad o performance

---

## Notas Técnicas

### Backend

**Endpoint:**
```typescript
PUT /api/projects/:id/status

Body:
{
  "newStatus": "ejecucion",
  "notes": "Licencias obtenidas, inicio de construcción",
  "actualStartDate": "2025-11-15",
  "notifyClient": true,
  "checklist": {
    "licenseObtained": true,
    "teamAssigned": true,
    "structureCreated": true
  }
}

Response:
{
  "id": "uuid",
  "status": "ejecucion",
  "actualStartDate": "2025-11-15",
  "updatedBy": "userId",
  "updatedAt": "2025-11-15T10:30:00Z",
  "statusHistory": [...]
}
```

**Service Method:**
```typescript
async changeStatus(
  id: string,
  newStatus: ProjectStatus,
  dto: ChangeStatusDto,
  userId: string
): Promise<Project> {
  const project = await this.findOne(id);

  // Validate transition
  this.validateStatusTransition(project.status, newStatus);

  // Check conditions (if applicable)
  await this.validateConditions(project, newStatus, dto.checklist);

  // Update status and dates
  const oldStatus = project.status;
  project.status = newStatus;
  this.updateStatusDates(project, newStatus, dto);

  // Save and emit event
  const updated = await this.projectRepo.save(project);
  this.eventEmitter.emit('project.status_changed', {
    project: updated,
    oldStatus,
    newStatus,
    changedBy: userId,
    notes: dto.notes
  });

  return updated;
}
```

### Frontend

**Components:**
- `ChangeStatusModal.tsx` - Modal de cambio de estado
- `StatusBadge.tsx` - Badge visual de estado
- `StatusTimeline.tsx` - Timeline de historial
- `StatusChecklist.tsx` - Checklist de condiciones

**State Machine (XState - opcional):**
```typescript
const projectStatusMachine = createMachine({
  id: 'projectStatus',
  initial: 'licitacion',
  states: {
    licitacion: {
      on: { ADJUDICAR: 'adjudicado' }
    },
    adjudicado: {
      on: { INICIAR_EJECUCION: 'ejecucion' }
    },
    ejecucion: {
      on: { ENTREGAR: 'entregado' }
    },
    entregado: {
      on: { CERRAR: 'cerrado' }
    },
    cerrado: {
      type: 'final'
    }
  }
});
```

---

## Dependencias

**Depende de:**
- ✅ US-PROJ-001: Catálogo de Proyectos (necesita proyectos existentes)
- ✅ ET-PROJ-001: Especificación técnica de catálogo

**Bloquea a:**
- Ninguna (independiente)

**Relacionado con:**
- US-PROJ-007: Asignación de Equipo (condición para Ejecución)
- US-PROJ-003: Crear Estructura (condición para Ejecución)

---

## Criterios de Aceptación del Product Owner

- [ ] Solo se permiten transiciones válidas según flujo definido
- [ ] Checklist de condiciones se verifica antes de permitir cambio
- [ ] Fechas se actualizan automáticamente según transición
- [ ] Historial completo y auditable de todos los cambios
- [ ] Notificaciones enviadas correctamente a equipo
- [ ] Solo Director y Admin pueden cambiar estados
- [ ] Regresiones solo permitidas para Admin con justificación
- [ ] Modal es intuitivo y muestra claramente opciones permitidas/bloqueadas

---

**Fecha de generación:** 2025-11-17
**Autor:** Equipo de Producto
**Aprobado por:** Product Owner
**Estado:** ✅ Ready for Development
