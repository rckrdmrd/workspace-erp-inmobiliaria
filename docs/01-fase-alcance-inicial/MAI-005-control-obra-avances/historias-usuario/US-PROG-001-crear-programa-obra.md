# US-PROG-001: Crear Programa de Obra con Ruta Crítica

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 15
**Story Points:** 8
**Prioridad:** Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Director de Obra
**Quiero** crear y gestionar el programa maestro del proyecto con cálculo automático de ruta crítica
**Para** planificar las actividades, identificar dependencias y establecer la línea base del proyecto

---

## Criterios de Aceptación

### 1. Crear Programa de Obra ✅
- [ ] Puedo crear un nuevo programa de obra para un proyecto
- [ ] Se genera automáticamente un código único (PRG-YYYY-NNNNN)
- [ ] Puedo definir fechas de inicio y fin del proyecto
- [ ] El sistema calcula automáticamente la duración total en días
- [ ] Puedo agregar descripción y notas generales
- [ ] El programa inicia en estado "Draft"

### 2. Agregar Actividades ✅
- [ ] Puedo agregar actividades al programa con:
  - Código de actividad (ACT-001, ACT-002, etc.)
  - Nombre descriptivo
  - Código WBS (Work Breakdown Structure): 1.1, 1.2.1, etc.
  - Fechas planificadas (inicio y fin)
  - Duración en días
  - Cantidad planificada y unidad
  - Vincular a partida presupuestal
  - Asignar responsable y cuadrilla
  - Marcar como hito (milestone) si aplica

### 3. Definir Dependencias ✅
- [ ] Puedo establecer dependencias entre actividades (Finish-to-Start)
- [ ] Puedo especificar retraso (lag) positivo o adelanto negativo
- [ ] El sistema valida que no haya dependencias circulares
- [ ] Puedo visualizar las dependencias en diagrama de red

### 4. Calcular Ruta Crítica (CPM) ✅
- [ ] Puedo ejecutar el cálculo de ruta crítica con un botón "Calcular CPM"
- [ ] El sistema calcula automáticamente para cada actividad:
  - Fecha más temprana de inicio (ES - Earliest Start)
  - Fecha más temprana de fin (EF - Earliest Finish)
  - Fecha más tardía de inicio (LS - Latest Start)
  - Fecha más tardía de fin (LF - Latest Finish)
  - Holgura total (Total Float): LF - EF
  - Holgura libre (Free Float)
- [ ] Las actividades con holgura total = 0 se marcan como parte de la ruta crítica
- [ ] Las actividades críticas se destacan visualmente (color rojo o marca especial)

### 5. Aprobar y Establecer Baseline ✅
- [ ] Puedo enviar el programa para aprobación
- [ ] Al aprobar, el programa cambia a estado "Approved" → "Active"
- [ ] La primera versión aprobada se establece automáticamente como Baseline
- [ ] Se guarda la fecha de aprobación y quién aprobó
- [ ] No puedo editar un programa aprobado o baseline

### 6. Visualizar Diagrama de Gantt ✅
- [ ] Puedo ver el programa en formato Gantt
- [ ] Las barras muestran duración y fechas de cada actividad
- [ ] Las actividades críticas se muestran en color rojo
- [ ] Puedo ver líneas de dependencia entre actividades
- [ ] Puedo filtrar por frente de trabajo, etapa o responsable

### 7. Reprogramar (Nueva Versión) ✅
- [ ] Puedo crear una reprogramación desde un programa activo
- [ ] Se crea una nueva versión (v2, v3, etc.)
- [ ] Debo especificar el motivo de la reprogramación
- [ ] Se copian todas las actividades de la versión anterior
- [ ] Puedo editar fechas y dependencias en la nueva versión
- [ ] El baseline original se mantiene para comparación

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📊 Programa de Obra - Fracc. Los Pinos                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ┌─ Información General ─────────────────────────────────────────────┐  │
│ │                                                                    │  │
│ │ Código: PRG-2025-00001         Versión: 1                         │  │
│ │ Nombre: [Programa Maestro - 50 Viviendas_________________]        │  │
│ │                                                                    │  │
│ │ Fecha Inicio:  [15/01/2025]    Fecha Fin: [31/12/2025]            │  │
│ │ Duración Total: 350 días       Semanas: 50                        │  │
│ │                                                                    │  │
│ │ Estado: [Draft ▼]              Baseline: [ ] Esta es la baseline  │  │
│ │                                                                    │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Actividades ──────────────────────────────────────────────────────┐  │
│ │                                                                     │  │
│ │ [+ Nueva Actividad]  [Calcular CPM]  [💾 Guardar]  [✓ Aprobar]    │  │
│ │                                                                     │  │
│ │ ┌───────────────────────────────────────────────────────────────┐  │  │
│ │ │ Código│WBS  │Actividad          │Inicio   │Fin      │Dur│TF │CP│ │  │
│ │ ├───────────────────────────────────────────────────────────────┤  │  │
│ │ │ACT-001│1.1  │Excavación General │15/01/25 │29/01/25 │14 │0  │🔴│ │  │
│ │ │ACT-002│1.2  │Cimentación        │30/01/25 │20/02/25 │21 │0  │🔴│ │  │
│ │ │ACT-003│2.1  │Estructura Tipo 1  │21/02/25 │15/03/25 │22 │5  │  │ │  │
│ │ │ACT-004│2.2  │Estructura Tipo 2  │21/02/25 │10/03/25 │17 │0  │🔴│ │  │
│ │ │ACT-005│3.1  │Instalaciones      │11/03/25 │05/04/25 │25 │3  │  │ │  │
│ │ │ACT-006│4.1  │Acabados           │06/04/25 │30/04/25 │24 │0  │🔴│ │  │
│ │ └───────────────────────────────────────────────────────────────┘  │  │
│ │                                                                     │  │
│ │ TF = Total Float (Holgura Total)  |  CP = Ruta Crítica (🔴)        │  │
│ └─────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Vista Gantt ──────────────────────────────────────────────────────┐  │
│ │                                                                     │  │
│ │             Ene         Feb         Mar         Abr                │  │
│ │ ACT-001  ████████████                                              │  │
│ │ ACT-002              ██████████████                                │  │
│ │ ACT-003                          ████████████                      │  │
│ │ ACT-004                          ██████████                        │  │
│ │ ACT-005                                  ██████████████            │  │
│ │ ACT-006                                              ████████████  │  │
│ │                                                                     │  │
│ │ Leyenda: █ Normal  █ Crítica                                       │  │
│ └─────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Resumen de Ruta Crítica ──────────────────────────────────────────┐  │
│ │                                                                     │  │
│ │ Duración del Proyecto:  350 días                                   │  │
│ │ Actividades Críticas:   4 (ACT-001, ACT-002, ACT-004, ACT-006)     │  │
│ │ % Actividades Críticas: 66.7%                                      │  │
│ │                                                                     │  │
│ │ ⚠️ Las actividades críticas no tienen margen de retraso            │  │
│ │    Cualquier demora impacta la fecha final del proyecto            │  │
│ └─────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│                                   [Cancelar]  [Guardar y Aprobar]       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. CREAR PROGRAMA
   ↓
   Usuario crea programa → Captura info general → [Guardar]
   ↓
   Estado: Draft

2. AGREGAR ACTIVIDADES
   ↓
   Agregar actividades → Definir fechas y duraciones → Establecer dependencias
   ↓
   [Calcular CPM]

3. CALCULAR RUTA CRÍTICA
   ↓
   Sistema ejecuta algoritmo CPM:
   - Forward Pass: Calcula ES y EF
   - Backward Pass: Calcula LS y LF
   - Calcula holguras (Total Float, Free Float)
   - Identifica ruta crítica (TF = 0)
   ↓
   Se actualizan campos en BD

4. APROBAR Y BASELINE
   ↓
   Usuario revisa → [Aprobar]
   ↓
   Estado: Active
   isBaseline: true (si es v1)
   ↓
   Línea base establecida

5. REPROGRAMAR (si es necesario)
   ↓
   [Crear Reprogramación]
   ↓
   Nueva versión (v2) en Draft
   ↓
   Editar fechas → Recalcular CPM → Aprobar
```

---

## Notas Técnicas

### Algoritmo CPM Implementado

```typescript
// Critical Path Method (CPM)

// 1. Forward Pass (Recorrido hacia adelante)
for each activity in topological_order:
  ES[activity] = max(EF[predecessors])
  EF[activity] = ES[activity] + duration[activity]

// 2. Backward Pass (Recorrido hacia atrás)
for each activity in reverse_topological_order:
  if activity has no successors:
    LF[activity] = project_end_date
  else:
    LF[activity] = min(LS[successors])
  LS[activity] = LF[activity] - duration[activity]

// 3. Calculate Float
for each activity:
  TF[activity] = LF[activity] - EF[activity]
  FF[activity] = min(ES[successors]) - EF[activity]

// 4. Identify Critical Path
critical_path = activities where TF == 0
```

### Endpoints Necesarios

```typescript
POST   /api/schedules                    // Crear programa
GET    /api/schedules/:id                // Obtener programa
PUT    /api/schedules/:id                // Actualizar programa
POST   /api/schedules/:id/approve        // Aprobar programa
POST   /api/schedules/:id/calculate-critical-path  // Calcular CPM
POST   /api/schedules/:id/reprogram      // Crear reprogramación

POST   /api/schedule-activities          // Crear actividad
PUT    /api/schedule-activities/:id      // Actualizar actividad
DELETE /api/schedule-activities/:id      // Eliminar actividad
```

### Validaciones Importantes

1. **Dependencias Circulares:** Validar que no haya ciclos en el grafo de dependencias
2. **Fechas Coherentes:** `endDate >= startDate` para cada actividad
3. **Baseline Protección:** No permitir editar baseline
4. **Versiones:** Incrementar versión automáticamente al reprogramar

---

## Definición de "Done"

- [x] Código implementado y testeado
- [x] CRUD de programas de obra funcional
- [x] CRUD de actividades funcional
- [x] Algoritmo CPM calculando correctamente
- [x] Triggers actualizando status automáticamente
- [x] Frontend con formularios y Gantt
- [x] Tests unitarios >80%
- [x] Documentación de API actualizada
- [x] Aprobado por Product Owner

---

**Estimación:** 8 Story Points
**Dependencias:** Requiere MAI-002 (Proyectos) y MAI-003 (Presupuestos)
**Fecha:** 2025-11-17
