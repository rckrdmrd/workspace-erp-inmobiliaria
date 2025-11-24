# RF-PROG-001: Programación de Obra y Curva S

**Épica:** MAI-005 - Control de Obra y Avances
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Sistema de programación de obra con calendarización de actividades, asignación de frentes de trabajo y generación automática de curva S. Permite comparar avance programado vs ejecutado en tiempo real para detección temprana de desviaciones.

---

## 2. Objetivos de Negocio

- **Planeación:** Calendario maestro de obra con hitos clave
- **Control:** Seguimiento programado vs real semanal
- **Anticipación:** Detección de retrasos antes de que impacten la entrega
- **Visibilidad:** Curva S para clientes, dirección e INFONAVIT

---

## 3. Alcance Funcional

### 3.1 Programación Maestra de Obra

**Definición de Calendario:**
```
┌───────────────────────────────────────────────────────┐
│ PROGRAMACIÓN - Fracc. Los Pinos                       │
│ Inicio: 01/Ene/2025 | Entrega: 31/Dic/2025 (52 sem)  │
├───────────────────────────────────────────────────────┤
│ ■ Hitos Clave                                         │
│   01/Ene/2025  Inicio de obra                         │
│   15/Feb/2025  Fin excavación y cimentación          │
│   30/Abr/2025  Fin estructura (muros y losas)        │
│   31/Jul/2025  Fin instalaciones                      │
│   30/Sep/2025  Fin acabados                           │
│   15/Nov/2025  Fin urbanización                       │
│   31/Dic/2025  Entrega final                          │
│                                                       │
│ ■ Estructura de Programa                              │
│   Viviendas totales: 150                              │
│   Etapas: 3 (50 viviendas c/u)                       │
│   Frentes simultáneos: 2-3 por etapa                  │
│   Duración estimada: 52 semanas                       │
│                                                       │
│ ■ Restricciones                                        │
│   No se puede iniciar estructura sin terminar cim.   │
│   Instalaciones requiere muros al 100%                │
│   Acabados requiere instalaciones al 100%             │
└───────────────────────────────────────────────────────┘
```

### 3.2 Programación por Actividad (Conceptos)

**Desglose de Conceptos:**
```
PROYECTO: Fracc. Los Pinos - Etapa 1 (50 viviendas)

┌─────────────────────────────────────────────────────────────────┐
│ Partida          │ Duración│ Inicio  │ Fin     │ % Avance│Status││
├──────────────────┼─────────┼─────────┼─────────┼─────────┼─────┤│
│ 01-Preliminares  │ 2 sem   │01/Ene/25│14/Ene/25│ 100%    │ ✓   ││
│   Limpia terreno │ 1 sem   │01/Ene/25│07/Ene/25│ 100%    │ ✓   ││
│   Trazo y niveles│ 1 sem   │08/Ene/25│14/Ene/25│ 100%    │ ✓   ││
│                                                                 │
│ 02-Cimentación   │ 6 sem   │15/Ene/25│25/Feb/25│  85%    │ 🟡  ││
│   Excavación     │ 1.5 sem │15/Ene/25│25/Ene/25│ 100%    │ ✓   ││
│   Plantilla      │ 0.5 sem │26/Ene/25│29/Ene/25│ 100%    │ ✓   ││
│   Cimentación    │ 2 sem   │30/Ene/25│12/Feb/25│  90%    │ 🟡  ││
│   Rellenos       │ 2 sem   │13/Feb/25│25/Feb/25│  60%    │ 🔴  ││
│                                                                 │
│ 03-Estructura    │ 8 sem   │26/Feb/25│22/Abr/25│  12%    │ ⏳  ││
│   Muros PB       │ 3 sem   │26/Feb/25│18/Mar/25│  35%    │ 🟡  ││
│   Losa PB        │ 2 sem   │19/Mar/25│01/Abr/25│   0%    │ ⏳  ││
│   Muros PA       │ 2 sem   │02/Abr/25│15/Abr/25│   0%    │ ⏳  ││
│   Losa azotea    │ 1 sem   │16/Abr/25│22/Abr/25│   0%    │ ⏳  ││
│                                                                 │
│ 04-Instalaciones │ 10 sem  │23/Abr/25│02/Jul/25│   0%    │ ⏳  ││
│ 05-Acabados      │ 12 sem  │03/Jul/25│24/Sep/25│   0%    │ ⏳  ││
│ 06-Urbanización  │ 6 sem   │25/Sep/25│05/Nov/25│   0%    │ ⏳  ││
└─────────────────────────────────────────────────────────────────┘

Leyenda:
  ✓ Completo  🟡 En proceso  🔴 Atrasado  ⏳ No iniciado
```

### 3.3 Curva S (Programado vs Real)

**Vista Gráfica:**
```
CURVA S - Fracc. Los Pinos Etapa 1
Avance Acumulado (%)

100│                                              ╱─
   │                                         ╱───
 90│                                    ╱───
   │                              ╱────          Real (85%)
 80│                        ╱────
   │                  ╱────                     Programado (92%)
 70│            ╱────
   │      ╱────                                 Desviación: -7%
 60│╱────
   │                                            Status: 🟡 RETRASO LEVE
 50│
   │
 40│
   │
 30│
   │
 20│
   │
 10│
   │
  0└─────────────────────────────────────────────────────→
    Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic

■ Programado acumulado: 92%
■ Real acumulado:        85%
■ Desviación:            -7 puntos porcentuales
■ Tendencia: Retraso leve, recuperable con aceleración
```

**Análisis de Desviación:**
```
┌──────────────────────────────────────────────────────┐
│ ANÁLISIS DE DESVIACIÓN - Semana 10                  │
├──────────────────────────────────────────────────────┤
│ Avance programado:     92%                           │
│ Avance real:           85%                           │
│ Desviación:            -7% 🟡                        │
│                                                      │
│ ■ Conceptos críticos atrasados:                      │
│   • Rellenos:           -30% (60% vs 90% esperado)  │
│     Causa: Lluvia y material húmedo                 │
│     Impacto: Retraso de 2 semanas                   │
│                                                      │
│   • Muros PB:           -15% (35% vs 50% esperado)  │
│     Causa: Falta de cuadrilla de block             │
│     Impacto: Retraso de 1 semana                    │
│                                                      │
│ ■ Proyección al 100%:                                │
│   Si continúa tendencia:  3 semanas de retraso      │
│   Entrega proyectada:     21/Ene/2026 ⚠️            │
│   vs Comprometida:        31/Dic/2025               │
│                                                      │
│ ■ Plan de recuperación:                              │
│   ✓ Contratar cuadrilla adicional de block         │
│   ✓ Acelerar rellenos (2 frentes simultáneos)      │
│   ✓ Turno extra fin de semana por 3 semanas        │
│   → Recuperación estimada: 2 semanas                │
│   → Nueva proyección: 07/Ene/2026 (1 sem retraso)  │
└──────────────────────────────────────────────────────┘
```

### 3.4 Programación por Frentes de Trabajo

**Distribución de Viviendas:**
```
Etapa 1: 50 viviendas (Lotes 1-50)

┌──────────────────────────────────────────────────────┐
│ FRENTES DE TRABAJO - Semana 10                       │
├──────────────────────────────────────────────────────┤
│ Frente A (Lotes 1-17)                                │
│   Actividad actual: Losa PB                         │
│   Avance: 95% (16 de 17 viviendas)                  │
│   Status: ✓ En tiempo                               │
│   Maestro: Juan Pérez                               │
│                                                      │
│ Frente B (Lotes 18-33)                               │
│   Actividad actual: Muros PB                        │
│   Avance: 75% (12 de 16 viviendas)                  │
│   Status: 🟡 Leve retraso                           │
│   Maestro: Carlos López                             │
│                                                      │
│ Frente C (Lotes 34-50)                               │
│   Actividad actual: Cimentación                     │
│   Avance: 85% (14 de 17 viviendas)                  │
│   Status: ✓ En tiempo                               │
│   Maestro: Miguel Hernández                         │
└──────────────────────────────────────────────────────┘

Vista Gantt por Frente:
       │ S8  │ S9  │ S10 │ S11 │ S12 │ S13 │
───────┼─────┼─────┼─────┼─────┼─────┼─────┤
Frente A│████│████│████│Inst.│Inst.│Acab.│
Frente B│████│████│Muro│Losa │Inst.│Inst.│
Frente C│Cim.│Cim.│████│Muro│Losa │Inst.│
```

### 3.5 Hitos y Entregables

**Seguimiento de Hitos:**
```
┌──────────────────────────────────────────────────────┐
│ HITOS DEL PROYECTO                                   │
├──────────────────────────────────────────────────────┤
│ Hito               │ Fecha Prog│ Fecha Real│ Status ││
├────────────────────┼───────────┼───────────┼────────┤│
│ Inicio de obra     │ 01/Ene/25 │ 01/Ene/25 │ ✓      ││
│ Fin trazo          │ 14/Ene/25 │ 14/Ene/25 │ ✓      ││
│ Fin cimentación    │ 15/Feb/25 │ 18/Feb/25 │ 🟡 +3d ││
│ 30% avance físico  │ 28/Feb/25 │ 28/Feb/25 │ ✓      ││
│ Fin estructura     │ 30/Abr/25 │ Proyect.  │ ⏳     ││
│ 50% avance físico  │ 15/May/25 │ Proyect.  │ ⏳     ││
│ Fin instalaciones  │ 31/Jul/25 │ Proyect.  │ ⏳     ││
│ 80% avance físico  │ 15/Ago/25 │ Proyect.  │ ⏳     ││
│ Fin acabados       │ 30/Sep/25 │ Proyect.  │ ⏳     ││
│ Fin urbanización   │ 15/Nov/25 │ Proyect.  │ ⏳     ││
│ Entrega final      │ 31/Dic/25 │ Proyect.  │ ⏳     ││
└──────────────────────────────────────────────────────┘

Hitos críticos para financiamiento/INFONAVIT:
  → 30% avance: Desbloquea ministracion 2 ✓ Cumplido
  → 50% avance: Desbloquea ministracion 3  Pendiente
  → 80% avance: Desbloquea ministracion 4  Pendiente
```

### 3.6 Alertas Automáticas

**Tipos de Alertas:**
```
🔴 CRÍTICO: Retraso >10% en ruta crítica
   Partida: Cimentación
   Desviación: -12% (60% vs 72% programado)
   Impacto: 2.5 semanas de retraso proyectado
   Acción: Plan de aceleración requerido

🟡 WARNING: Retraso 5-10%
   Partida: Muros PB
   Desviación: -7% (35% vs 42% programado)
   Impacto: 1 semana de retraso
   Acción: Monitoreo estrecho

🟢 OK: En tiempo o adelantado
   Partida: Losa PB (Frente A)
   Avance: +3% (adelantado)
   Status: Excelente

⏰ PRÓXIMO HITO: 15/Mar/2025 (3 días)
   Hito: Fin de Muros PB
   Probabilidad de cumplimiento: 85% 🟡
   Requiere aceleración leve
```

---

## 4. Modelo de Datos

```typescript
// schedule (programa de obra)
{
  id: UUID,
  projectId: UUID,
  version: INTEGER, // 1, 2, 3 (reprogramaciones)
  status: ENUM('draft', 'approved', 'active', 'closed'),

  startDate: DATE,
  endDate: DATE,
  totalDuration: INTEGER, // semanas

  baselineDate: DATE, // fecha de aprobación de línea base
  approvedBy: UUID,

  metadata: JSONB,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}

// schedule_activities (actividades programadas)
{
  id: UUID,
  scheduleId: UUID,
  activityCode: VARCHAR(20), // 02.01.03
  activityName: VARCHAR(255),

  budgetItemId: UUID, // vinculado a partida presupuestal

  plannedStartDate: DATE,
  plannedEndDate: DATE,
  plannedDuration: INTEGER, // días
  plannedQuantity: DECIMAL(12,4),

  // Dependencias (finish-to-start por defecto)
  predecessors: UUID[], // array de activity IDs
  lag: INTEGER DEFAULT 0, // días de desfase

  // Asignación
  workfrontId: UUID, // frente de trabajo
  responsibleId: UUID,

  // Control
  actualStartDate: DATE,
  actualEndDate: DATE,
  actualQuantity: DECIMAL(12,4),
  percentComplete: DECIMAL(5,2) DEFAULT 0,

  status: ENUM('not_started', 'in_progress', 'completed', 'delayed'),

  isCriticalPath: BOOLEAN DEFAULT false,
  isM ilestone: BOOLEAN DEFAULT false,
}

// workfronts (frentes de trabajo)
{
  id: UUID,
  projectId: UUID,
  code: VARCHAR(20),
  name: VARCHAR(255),

  type: ENUM('by_zone', 'by_prototype', 'by_trade'),

  assignedUnits: UUID[], // lotes/viviendas asignados
  foremanId: UUID, // maestro responsable
  crewSize: INTEGER,

  isActive: BOOLEAN DEFAULT true,
}

// project_milestones (hitos)
{
  id: UUID,
  projectId: UUID,
  code: VARCHAR(20),
  name: VARCHAR(255),

  milestoneType: ENUM('contractual', 'financing', 'internal'),

  plannedDate: DATE,
  baselineDate: DATE,
  actualDate: DATE,

  percentRequired: DECIMAL(5,2), // % de avance requerido
  isFinancingGate: BOOLEAN, // desbloquea ministración

  status: ENUM('pending', 'at_risk', 'achieved', 'missed'),
  impact: VARCHAR(20), // low, medium, high, critical
}

// s_curve_snapshots (curva S histórica)
{
  id: UUID,
  projectId: UUID,
  snapshotDate: DATE,

  plannedProgressPct: DECIMAL(5,2),
  actualProgressPct: DECIMAL(5,2),
  variance: DECIMAL(5,2),

  plannedValuePV: DECIMAL(15,2),
  earnedValueEV: DECIMAL(15,2),
  actualCostAC: DECIMAL(15,2),

  spi: DECIMAL(5,3), // Schedule Performance Index = EV/PV
  cpi: DECIMAL(5,3), // Cost Performance Index = EV/AC

  createdAt: TIMESTAMP
}

// recovery_plans (planes de recuperación)
{
  id: UUID,
  projectId: UUID,

  reason: TEXT,
  plannedActions: JSONB,
  /* [{
    action: string,
    responsibleId: UUID,
    dueDate: DATE,
    status: 'pending'|'done'
  }] */

  expectedRecovery: INTEGER, // días
  actualRecovery: INTEGER,

  status: ENUM('draft', 'approved', 'in_execution', 'completed'),
  createdAt: TIMESTAMP
}
```

---

## 5. Criterios de Aceptación

- [ ] Programación maestra con inicio/fin de proyecto
- [ ] Desglose de actividades vinculadas a presupuesto
- [ ] Dependencias entre actividades (lógica finish-to-start)
- [ ] Asignación de frentes de trabajo
- [ ] Curva S programado vs real
- [ ] Cálculo automático de SPI (Schedule Performance Index)
- [ ] Registro de hitos contractuales y de financiamiento
- [ ] Alertas automáticas de desviaciones >5%
- [ ] Proyección de fecha de término
- [ ] Plan de recuperación para retrasos

---

**Estado:** ✅ Ready for Development
