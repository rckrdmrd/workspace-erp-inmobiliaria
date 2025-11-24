# US-PROJ-008: Calendario de Hitos del Proyecto

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 6
**Story Points:** 3 SP
**Prioridad:** P1 (Alta)
**Estimación:** 1-2 días

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** definir y dar seguimiento a los hitos clave del proyecto
**Para** controlar el avance contra el calendario planificado y detectar retrasos

---

## Criterios de Aceptación

### ✅ AC1: Timeline de Hitos

**Dado** que accedo a tab "Calendario" del proyecto
**Entonces** veo timeline visual:

```
┌────────────────────────────────────────────────────────────┐
│ Hitos del Proyecto                           [+ Nuevo Hito]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ●─────────────────────────────────────────────────────●   │
│ │                                                     │   │
│ ✅ Arranque                 🔵 Permisos        ⏱️ Cimiento│
│ 01/09/25                   15/10/25          01/12/25    │
│ Completado                 En progreso      Próximo (12d)│
│                                                            │
│ ⏱️ Estructura               ⏸️ Instalaciones  ⏸️ Acabados  │
│ 15/01/26                   01/03/26          15/05/26    │
│ Próximo (45d)              Pendiente        Pendiente    │
│                                                            │
│ ⏸️ Primera Entrega         ⏸️ Entrega Final  ⏸️ Cierre    │
│ 01/08/26                   15/10/26          30/11/26    │
│ Pendiente                  Pendiente        Pendiente    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Estados:**
- ✅ Completado (verde)
- 🔵 En progreso (azul)
- ⏱️ Próximo (amarillo, <30 días)
- ⏸️ Pendiente (gris)
- ⚠️ Retrasado (rojo, fecha pasada)

### ✅ AC2: Crear Hito

**Formulario:**
- Nombre: "Obtención de licencias"
- Tipo: Permisos obtenidos / Inicio construcción / Estructura completa / etc.
- Fecha planificada: [15/10/2025]
- Responsable: [Juan Pérez ▼]
- Depende de: [Hito anterior ▼] (opcional)
- Entregables:
  - ☑ Licencia de construcción
  - ☑ Permisos municipales
  - ☑ Póliza de seguro
- Alerta (días antes): [7]

**Tipos predefinidos:**
- Arranque del proyecto
- Permisos obtenidos
- Inicio de construcción
- Cimentación completa
- Estructura completa
- Instalaciones completas
- Acabados completos
- Primera entrega
- Entrega final
- Cierre del proyecto
- Otro (personalizado)

### ✅ AC3: Marcar Hito como Completado

**Dado** hito "Permisos obtenidos" en estado pendiente
**Cuando** hago clic "Marcar como Completado"
**Entonces** veo modal:

```
┌──────────────────────────────────────────────┐
│ Completar Hito                               │
├──────────────────────────────────────────────┤
│                                              │
│ Hito: Permisos obtenidos                     │
│ Planificado: 15/10/2025                      │
│                                              │
│ Fecha real de completación:                  │
│ [📅 18/10/2025]                              │
│                                              │
│ ⚠️ Retraso: 3 días                            │
│                                              │
│ Notas de completación:                       │
│ ┌──────────────────────────────────────────┐│
│ │ Se obtuvieron todos los permisos.        ││
│ │ Retraso menor por trámite de MIA.        ││
│ └──────────────────────────────────────────┘│
│                                              │
│               [Cancelar]  [Marcar Completado]│
└──────────────────────────────────────────────┘
```

**Al completar:**
- Status = "completed"
- actualDate = fecha seleccionada
- Si fecha > planificada: calcular días de retraso
- Desbloquear hitos dependientes

### ✅ AC4: Validación de Dependencias

**Dado** hito B depende de hito A
**Cuando** intento completar hito B
**Y** hito A aún está pendiente
**Entonces** sistema muestra:
```
⚠️ No se puede completar

Este hito depende de:
  • Permisos obtenidos (pendiente)

Completa las dependencias primero.
```

### ✅ AC5: Alertas de Hitos Próximos

**Dado** hito "Cimentación completa" planificado para 01/12/2025
**Y** alerta configurada a 7 días antes
**Cuando** llega 24/11/2025
**Entonces** sistema envía notificación:
- Email al responsable
- Notificación in-app
- Mensaje: "El hito 'Cimentación completa' vence en 7 días"

**Frecuencia de alertas:**
- 1 alerta diaria (no spam)
- Hasta que se complete el hito

---

## Escenarios de Prueba

**Escenario 1:** Crear 11 hitos del proyecto
**Given** proyecto "Fraccionamiento Los Pinos"
**When** creo 11 hitos desde arranque hasta cierre
**Then** timeline muestra todos en orden cronológico
**And** primer hito no tiene dependencias
**And** cada hito siguiente depende del anterior

**Escenario 2:** Completar hito con retraso
**Given** hito planificado para 15/10/2025
**When** lo marco completado el 18/10/2025
**Then** sistema calcula 3 días de retraso
**And** muestra badge "⚠️ +3 días de retraso"

**Escenario 3:** Intentar completar con dependencia pendiente
**Given** hito B depende de hito A (pendiente)
**When** intento completar hito B
**Then** sistema bloquea con mensaje de error

---

## Definición de Done

- [ ] Timeline visual funcional
- [ ] CRUD de hitos completo
- [ ] Validación de dependencias
- [ ] Marcar como completado con notas
- [ ] Cálculo de días de retraso/adelanto
- [ ] Alertas automáticas (cron job)
- [ ] 11 tipos de hitos predefinidos
- [ ] Tests de validación de dependencias
- [ ] Notificaciones funcionando

---

## Notas Técnicas

**Endpoints:**
```
POST   /api/projects/:projectId/milestones
GET    /api/projects/:projectId/milestones
GET    /api/projects/:projectId/milestones/timeline
PUT    /api/milestones/:id/complete
DELETE /api/milestones/:id
```

**Cron Job (diario 9:00 AM):**
```typescript
@Cron('0 9 * * *')
async checkMilestoneAlerts() {
  // Buscar hitos próximos
  // Enviar notificaciones
}
```

---

**Estado:** ✅ Ready for Development
