# US-PROG-002: Seguimiento con Curva S y Earned Value

**Épica:** MAI-005 - Control de Obra y Avances
**Sprint:** 15
**Story Points:** 5
**Prioridad:** Alta
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Director de Obra
**Quiero** visualizar la Curva S del proyecto comparando avance programado vs real con indicadores EVM
**Para** identificar desviaciones tempranamente y tomar acciones correctivas

---

## Criterios de Aceptación

### 1. Generación Automática de Snapshots ✅
- [ ] El sistema genera snapshots diarios de la Curva S automáticamente a las 23:00
- [ ] Cada snapshot incluye:
  - Fecha del snapshot
  - % Avance programado (según baseline)
  - % Avance real (promedio ponderado de actividades)
  - Varianza en %
  - Valores EVM: PV, EV, AC
  - Indicadores: SPI, CPI
  - Proyecciones: EAC, ETC, VAC

### 2. Visualización de Curva S ✅
- [ ] Puedo ver gráfica de líneas con:
  - Eje X: Fechas (timeline del proyecto)
  - Eje Y: Porcentaje de avance (0-100%)
  - Línea azul: Avance programado (baseline)
  - Línea roja: Avance real
  - Área sombreada indicando varianza
- [ ] Puedo seleccionar rango de fechas (último mes, trimestre, proyecto completo)
- [ ] Puedo hacer zoom en períodos específicos
- [ ] Puedo exportar la gráfica como imagen PNG

### 3. Indicadores EVM ✅
- [ ] Puedo ver panel con indicadores clave:
  ```
  SPI (Schedule Performance Index):
  - SPI > 1.0: Adelantado (verde)
  - SPI = 1.0: En tiempo (amarillo)
  - SPI < 1.0: Retrasado (rojo)

  CPI (Cost Performance Index):
  - CPI > 1.0: Bajo presupuesto (verde)
  - CPI = 1.0: En presupuesto (amarillo)
  - CPI < 1.0: Sobre presupuesto (rojo)
  ```
- [ ] Puedo ver valores absolutos: PV, EV, AC en pesos
- [ ] Puedo ver varianzas: SV (EV - PV), CV (EV - AC)

### 4. Proyecciones ✅
- [ ] Puedo ver proyecciones calculadas automáticamente:
  - EAC (Estimate at Completion): Costo final estimado
  - ETC (Estimate to Complete): Costo faltante estimado
  - VAC (Variance at Completion): Varianza final proyectada
- [ ] El sistema muestra alertas si:
  - VAC > 5% del presupuesto original
  - Fecha proyectada de término excede fecha contractual

### 5. Comparación Baseline vs Actual ✅
- [ ] Puedo ver tabla comparativa mostrando:
  - Fecha de corte
  - Baseline: % programado, costo planificado
  - Actual: % real, costo ejecutado
  - Varianza: Δ%, Δ$ (pesos)
  - Tendencia (mejorando/empeorando)

### 6. Análisis de Tendencias ✅
- [ ] El sistema muestra gráfica de tendencia de SPI y CPI a lo largo del tiempo
- [ ] Puedo ver si los indicadores están mejorando o empeorando
- [ ] Puedo ver proyección lineal de fecha de término basada en velocidad actual

---

## Mockup / Wireframe

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 📈 Curva S y Earned Value - Fracc. Los Pinos                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ Rango: [Último Trimestre ▼]   [Exportar PNG]                            │
│                                                                           │
│ ┌─ Curva S ────────────────────────────────────────────────────────────┐ │
│ │                                                                       │ │
│ │ 100│                                          ╱─ Programado (92%)    │ │
│ │  90│                                     ╱───                         │ │
│ │  80│                                ╱───     Real (85%)              │ │
│ │  70│                           ╱────                                 │ │
│ │  60│                      ╱────             Desviación: -7%         │ │
│ │  50│                 ╱────                                           │ │
│ │  40│            ╱────                                                │ │
│ │  30│       ╱────                                                     │ │
│ │  20│  ╱────                                                          │ │
│ │  10│╱                                                                │ │
│ │   0└───────────────────────────────────────────────────────────────→ │ │
│ │    Ene    Feb    Mar    Abr    May    Jun    Jul    Ago    Sep      │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Indicadores EVM ─────────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │ ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐  │ │
│ │ │    PV    │    EV    │    AC    │   SPI    │   CPI    │   VAC    │  │ │
│ │ ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │ │
│ │ │$15.5M    │$14.3M    │$15.1M    │  0.923   │  0.947   │ -$800K   │  │ │
│ │ │          │          │          │  🔴 Atrás│  🟡 OK   │  🔴 Sobre│  │ │
│ │ └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘  │ │
│ │                                                                        │ │
│ │ SPI = 0.923 → El proyecto avanza al 92.3% de la velocidad planificada │ │
│ │ CPI = 0.947 → Por cada $1 gastado, se genera $0.95 de valor           │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Proyecciones ────────────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │ Presupuesto Original (BAC):     $16,800,000                           │ │
│ │ Estimado al Completar (EAC):    $17,742,857                           │ │
│ │ Estimado para Completar (ETC):  $2,642,857                            │ │
│ │ Varianza al Completar (VAC):    -$942,857  (5.6% sobre presupuesto)   │ │
│ │                                                                        │ │
│ │ ⚠️ ALERTA: Proyección de sobrecosto > 5%                              │ │
│ │    Acción recomendada: Revisar partidas con mayor desviación          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Tendencia de Indicadores ────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │ 1.2│                                                                  │ │
│ │ 1.1│    ●                                                             │ │
│ │ 1.0│ ●──●───●──────────────────────────────────────────────          │ │
│ │ 0.9│            ●───●───●  ← SPI (empeorando)                        │ │
│ │ 0.8│                  ●─●  ← CPI (estable)                           │ │
│ │    └────────────────────────────────────────────────────────→        │ │
│ │    Feb    Mar    Abr    May    Jun    Jul    Ago                     │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│                                                       [Generar Reporte]   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Fórmulas EVM

```typescript
// Earned Value Management Formulas

// Valores Base
PV = Planned Value = (% planificado) × BAC
EV = Earned Value = (% real completado) × BAC
AC = Actual Cost = Costo real ejecutado
BAC = Budget at Completion = Presupuesto total

// Varianzas
SV = Schedule Variance = EV - PV  (positivo = adelantado, negativo = atrasado)
CV = Cost Variance = EV - AC      (positivo = bajo presupuesto, negativo = sobre)

// Índices de Desempeño
SPI = Schedule Performance Index = EV / PV
CPI = Cost Performance Index = EV / AC

// Proyecciones
EAC = Estimate at Completion = BAC / CPI
ETC = Estimate to Complete = EAC - AC
VAC = Variance at Completion = BAC - EAC

// Ejemplo:
// Si SPI = 0.92 y han pasado 100 días:
// Días reales necesarios = 100 / 0.92 = 108.7 días
// Retraso = 8.7 días
```

---

## Endpoints Necesarios

```typescript
GET  /api/schedules/:id/s-curve?startDate=...&endDate=...
POST /api/schedules/:id/generate-snapshot
GET  /api/schedules/project/:projectId/variance-analysis
GET  /api/schedules/:id/evm-indicators
GET  /api/schedules/:id/projections
```

---

## Definición de "Done"

- [x] CRON job generando snapshots diarios
- [x] Service calculando EVM correctamente
- [x] Frontend con Chart.js mostrando Curva S
- [x] Panel de indicadores con colores según umbrales
- [x] Alertas automáticas si VAC > 5%
- [x] Exportación de gráfica a PNG
- [x] Tests unitarios >80%
- [x] Aprobado por Product Owner

---

**Estimación:** 5 Story Points
**Dependencias:** US-PROG-001
**Fecha:** 2025-11-17
