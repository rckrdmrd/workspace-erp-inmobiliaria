# RF-PROG-002: Captura de Avances Físicos

**Épica:** MAI-005 - Control de Obra y Avances
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Sistema para registro diario/semanal de avances físicos por concepto, frente de trabajo o vivienda individual. Incluye captura desde web y app móvil con validaciones, aprobaciones y actualización automática de curva S.

---

## 2. Objetivos de Negocio

- **Registro oportuno:** Captura diaria desde obra
- **Precisión:** Avances validados vs presupuesto
- **Trazabilidad:** Historial completo por concepto/vivienda
- **Automatización:** Actualización de curva S en tiempo real

---

## 3. Alcance Funcional

### 3.1 Captura de Avance por Concepto

**Formulario de Registro:**
```
┌──────────────────────────────────────────────────────┐
│ REGISTRO DE AVANCE                                   │
├──────────────────────────────────────────────────────┤
│ Proyecto: Fracc. Los Pinos                           │
│ Etapa: 1                                             │
│ Fecha: 15/Feb/2025                                   │
│ Registrado por: Ing. Pedro Ramírez (Residente)       │
│                                                      │
│ Frente de trabajo: [Frente B - Lotes 18-33 ▼]      │
│ Concepto: [02.03 - Cimentación ▼]                   │
│                                                      │
│ ■ Método de Registro                                 │
│ (●) Por porcentaje  ( ) Por cantidad                │
│                                                      │
│ Avance registrado: [90] %                            │
│                                                      │
│ Presupuestado:     125.50 m³                         │
│ Acumulado anterior: 85%  (106.68 m³)                │
│ Avance hoy:         5%   (6.28 m³)                  │
│ Nuevo acumulado:    90%  (112.95 m³)                │
│ Pendiente:          10%  (12.55 m³)                 │
│                                                      │
│ Cuadrilla: [Cimentación A ▼]  (8 trabajadores)     │
│ Horas-hombre: [64] h                                │
│                                                      │
│ Observaciones:                                       │
│ [Cimentación de 8 viviendas (lotes 18-25).         ]│
│ [Clima despejado, buen avance.                      ]│
│                                                      │
│          [Guardar Borrador]  [Registrar Avance]     │
└──────────────────────────────────────────────────────┘

Validaciones:
- Nuevo % debe ser ≥ acumulado anterior
- No puede exceder 100%
- Si es por cantidad: <= cantidad presupuestada
- Fecha no puede ser futura
```

### 3.2 Captura de Avance por Vivienda/Lote

**Vista Individual:**
```
┌──────────────────────────────────────────────────────┐
│ AVANCE VIVIENDA - Lote 23                            │
│ Prototipo: Tipo A (2 rec, 1 baño, 54 m²)           │
│ Frente: B                                            │
├──────────────────────────────────────────────────────┤
│ Partida           │Presup.│Real │Avance│Status     ││
├───────────────────┼───────┼─────┼──────┼───────────┤│
│ 01-Preliminares   │ 100%  │100% │100%  │ ✓         ││
│ 02-Cimentación    │ 100%  │100% │100%  │ ✓         ││
│ 03-Estructura     │ 100%  │ 75% │ 75%  │ 🟡 En proc││
│   Muros PB        │ 100%  │100% │100%  │ ✓         ││
│   Losa PB         │ 100%  │100% │100%  │ ✓         ││
│   Muros PA        │ 100%  │ 50% │ 50%  │ 🟡        ││
│   Losa azotea     │ 100%  │  0% │  0%  │ ⏳        ││
│ 04-Instalaciones  │ 100%  │  0% │  0%  │ ⏳        ││
│ 05-Acabados       │ 100%  │  0% │  0%  │ ⏳        ││
├───────────────────┴───────┴─────┴──────┴───────────┤│
│ AVANCE TOTAL:                   55%                 ││
│ Status: 🟡 En proceso (15 días de antigüedad)       ││
│ Fecha estimada de término: 30/Abr/2025             ││
└──────────────────────────────────────────────────────┘

Acciones:
  [📷 Ver Fotos (15)]  [✏️ Registrar Avance]  [📊 Historial]
```

### 3.3 Registro Masivo (Lote/Batch)

**Actualización Múltiple:**
```
┌──────────────────────────────────────────────────────┐
│ REGISTRO MASIVO DE AVANCE                            │
│ Concepto: 03.01 - Muros PB                          │
│ Frente: B                                            │
│ Fecha: 15/Feb/2025                                  │
├──────────────────────────────────────────────────────┤
│ Lote │ Prototipo │ Previo │ Nuevo │ Incremento     ││
├──────┼───────────┼────────┼───────┼────────────────┤│
│  18  │ Tipo A    │  75%   │ [100%]│ +25%  ✓       ││
│  19  │ Tipo A    │  75%   │ [100%]│ +25%  ✓       ││
│  20  │ Tipo B    │  80%   │ [100%]│ +20%  ✓       ││
│  21  │ Tipo A    │  50%   │ [ 75%]│ +25%  ✓       ││
│  22  │ Tipo A    │  50%   │ [ 75%]│ +25%  ✓       ││
│  23  │ Tipo B    │  25%   │ [ 50%]│ +25%  ✓       ││
│  24  │ Tipo A    │   0%   │ [ 25%]│ +25%  ✓       ││
│  25  │ Tipo A    │   0%   │ [ 25%]│ +25%  ✓       ││
└──────┴───────────┴────────┴───────┴────────────────┘

Total viviendas actualizadas: 8
Promedio de avance: 71.9% (+25.0% vs anterior)

        [Previsualizar Impacto]  [Aplicar Cambios]
```

### 3.4 Aprobación de Avances

**Flujo de Aprobación:**
```
AVANCE REG-2025-00234
Registrado por: Maestro Juan Pérez
Fecha: 15/Feb/2025

┌──────────────────────────────────────────────────────┐
│ REVISIÓN DE AVANCE                                   │
├──────────────────────────────────────────────────────┤
│ Concepto: Cimentación (Frente B)                    │
│ Avance reportado: 85% → 90% (+5%)                   │
│ Cantidad: 106.68 m³ → 112.95 m³ (+6.27 m³)         │
│                                                      │
│ Evidencias:                                          │
│ 📷 5 fotos adjuntas                                 │
│ 📍 Geolocalización: Verificada                      │
│ ✓ Dentro de radio de obra (50m)                    │
│                                                      │
│ Validaciones:                                        │
│ ✓ Incremento razonable (+5%)                        │
│ ✓ No excede presupuesto                            │
│ ✓ Cuadrilla asignada (8 trab.)                     │
│ ✓ Materiales disponibles en almacén                │
│                                                      │
│ ■ Decisión                                           │
│ ( ) Aprobar                                         │
│ ( ) Aprobar con observaciones                      │
│ (●) Rechazar                                        │
│                                                      │
│ Motivo de rechazo:                                   │
│ [Avance reportado no coincide con visita de campo. ]│
│ [Solo se observó colado en 4 viviendas, no 8.     ]│
│ [Favor de verificar y ajustar reporte.             ]│
│                                                      │
│               [Cancelar]  [Enviar Decisión]         │
└──────────────────────────────────────────────────────┘

Estados:
  pending → approved → reflected_in_s_curve
            ↓
          rejected (con motivo)
```

### 3.5 Historial de Avances

**Trazabilidad Completa:**
```
HISTORIAL - Concepto: 02.03 Cimentación

┌──────────────────────────────────────────────────────┐
│ Fecha    │ % Ant│ % Nuevo│ Δ   │ Registró  │ Status ││
├──────────┼──────┼────────┼─────┼───────────┼────────┤│
│15/Feb/25 │  85% │   90%  │ +5% │ J.Pérez   │ Rechaz ││
│14/Feb/25 │  80% │   85%  │ +5% │ J.Pérez   │ ✓ Aprob││
│13/Feb/25 │  75% │   80%  │ +5% │ J.Pérez   │ ✓ Aprob││
│12/Feb/25 │  65% │   75%  │+10% │ J.Pérez   │ ✓ Aprob││
│09/Feb/25 │  50% │   65%  │+15% │ J.Pérez   │ ✓ Aprob││
│08/Feb/25 │  35% │   50%  │+15% │ J.Pérez   │ ✓ Aprob││
│07/Feb/25 │  20% │   35%  │+15% │ J.Pérez   │ ✓ Aprob││
│06/Feb/25 │   0% │   20%  │+20% │ J.Pérez   │ ✓ Aprob││
└──────────┴──────┴────────┴─────┴───────────┴────────┘

Métricas:
  Días trabajados: 8
  Incremento promedio: +10.6% por día
  Aprobados: 7 (87.5%)
  Rechazados: 1 (12.5%)

[Ver Gráfica de Tendencia]  [Exportar]
```

### 3.6 Dashboard de Avance Semanal

**Vista Consolidada:**
```
REPORTE SEMANAL DE AVANCES
Semana 07 (12-18 Feb 2025)

┌──────────────────────────────────────────────────────┐
│ ■ Resumen General                                    │
│   Registros de avance: 45                           │
│   Aprobados:           42 (93.3%)                   │
│   Rechazados:           3 (6.7%)                    │
│   Pendientes:           0                           │
│                                                      │
│ ■ Avance Global del Proyecto                         │
│   Inicio semana:   32.5%                            │
│   Fin semana:      38.2%                            │
│   Incremento:      +5.7 puntos                      │
│   Meta semanal:    +6.0 puntos                      │
│   Cumplimiento:    95% 🟡                           │
│                                                      │
│ ■ Top 5 Conceptos con Mayor Avance                   │
│   1. Excavación:        +25% (0% → 25%)            │
│   2. Cimentación:       +15% (70% → 85%)           │
│   3. Muros PB:          +12% (38% → 50%)           │
│   4. Preliminares:      +10% (90% → 100%)          │
│   5. Losa PB (Frente A):+10% (85% → 95%)           │
│                                                      │
│ ■ Conceptos Sin Avance (Requieren Atención)          │
│   • Instalaciones hidráulicas                       │
│   • Instalaciones sanitarias                        │
│   • Acabados                                         │
│   (Aún no programados)                              │
└──────────────────────────────────────────────────────┘
```

### 3.7 App Móvil para Captura

**Interfaz Simplificada:**
```
┌────────────────────────────┐
│ ≡  Registro de Avance      │
├────────────────────────────┤
│                            │
│ 📍 Fracc. Los Pinos       │
│    Frente B                │
│                            │
│ Concepto:                  │
│ ┌────────────────────────┐│
│ │ 02.03 Cimentación    ▼││
│ └────────────────────────┘│
│                            │
│ Avance:                    │
│ ┌─────┐                   │
│ │ 90% │                   │
│ └─────┘                   │
│ [━━━━━━━━━━━━━━━━━━━] 90%│
│                            │
│ Viviendas completadas hoy: │
│ ☑ Lote 18                 │
│ ☑ Lote 19                 │
│ ☑ Lote 20                 │
│ ☐ Lote 21 (50%)           │
│                            │
│ 📷 [Tomar Fotos (3)]      │
│                            │
│ 📝 Notas:                  │
│ [Buen ritmo, clima OK]    │
│                            │
│ ┌──────────────────────┐  │
│ │  REGISTRAR AVANCE    │  │
│ └──────────────────────┘  │
│                            │
└────────────────────────────┘

Features móvil:
- Captura offline (sincroniza al reconectar)
- Geolocalización automática
- Cámara integrada
- Reconocimiento de voz para notas
- Selector rápido de lotes
```

---

## 4. Modelo de Datos

```typescript
// progress_records (registros de avance)
{
  id: UUID,
  projectId: UUID,
  stageId: UUID,
  workfrontId: UUID NULLABLE,
  activityId: UUID, // vinculado a schedule_activities

  recordDate: DATE,
  recordType: ENUM('by_percent', 'by_quantity', 'by_unit'),

  previousPercent: DECIMAL(5,2),
  currentPercent: DECIMAL(5,2),
  incrementPercent: DECIMAL(5,2) GENERATED,

  previousQuantity: DECIMAL(12,4),
  currentQuantity: DECIMAL(12,4),
  incrementQuantity: DECIMAL(12,4) GENERATED,

  budgetedQuantity: DECIMAL(12,4),
  unit: VARCHAR(10),

  crewId: UUID, // cuadrilla
  laborHours: DECIMAL(8,2),

  notes: TEXT,
  photos: VARCHAR[],
  geolocation: POINT, // PostGIS

  recordedBy: UUID,
  recordedVia: ENUM('web', 'mobile', 'api'),

  status: ENUM('draft', 'submitted', 'approved', 'rejected'),
  reviewedBy: UUID NULLABLE,
  reviewedAt: TIMESTAMP NULLABLE,
  reviewNotes: TEXT NULLABLE,

  createdAt: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

// unit_progress (avance por vivienda/lote)
{
  id: UUID,
  unitId: UUID, // lote/vivienda
  activityId: UUID,

  percentComplete: DECIMAL(5,2),
  lastUpdated: DATE,
  updatedBy: UUID,

  status: ENUM('not_started', 'in_progress', 'completed'),

  startDate: DATE NULLABLE,
  completionDate: DATE NULLABLE,

  totalDuration: INTEGER, // días reales
  plannedDuration: INTEGER, // días programados
}

// batch_progress_updates (actualizaciones masivas)
{
  id: UUID,
  batchCode: VARCHAR(20),
  projectId: UUID,
  activityId: UUID,

  affectedUnits: UUID[], // array de unit IDs
  incrementPercent: DECIMAL(5,2),

  recordDate: DATE,
  recordedBy: UUID,

  status: ENUM('pending', 'applied', 'cancelled'),
  appliedAt: TIMESTAMP NULLABLE
}

// progress_snapshots (snapshot diario para histórico)
{
  id: UUID,
  projectId: UUID,
  snapshotDate: DATE,

  totalProgressPercent: DECIMAL(5,2),
  activities: JSONB,
  /* [{
    activityId: UUID,
    percent: number,
    quantity: number
  }] */

  createdAt: TIMESTAMP
}

// approval_workflow (flujo de aprobación)
{
  id: UUID,
  progressRecordId: UUID,

  steps: JSONB,
  /* [{
    level: 1,
    approverRole: 'supervisor',
    approverId: UUID,
    status: 'approved',
    approvedAt: timestamp,
    comments: string
  }] */

  currentLevel: INTEGER,
  overallStatus: ENUM('pending', 'approved', 'rejected'),

  createdAt: TIMESTAMP
}
```

---

## 5. Criterios de Aceptación

- [ ] Captura de avance por porcentaje y por cantidad
- [ ] Registro por concepto y por vivienda individual
- [ ] Actualización masiva de múltiples lotes
- [ ] Validaciones automáticas (no retroceso, no exceder 100%)
- [ ] Flujo de aprobación configurable
- [ ] Historial completo con trazabilidad
- [ ] App móvil con captura offline
- [ ] Geolocalización automática
- [ ] Integración con fotos (galería y cámara)
- [ ] Dashboard semanal de avances
- [ ] Actualización automática de curva S

---

**Estado:** ✅ Ready for Development
