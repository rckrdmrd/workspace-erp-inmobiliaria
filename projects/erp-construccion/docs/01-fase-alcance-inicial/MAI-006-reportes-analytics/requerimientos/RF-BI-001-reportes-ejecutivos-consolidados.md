# RF-BI-001: Reportes Ejecutivos Consolidados

**Épica:** MAI-006 - Reportes y Business Intelligence
**Módulo:** Reportes Ejecutivos
**Responsable:** Product Owner
**Fecha:** 2025-11-17
**Versión:** 1.0

---

## 1. Objetivo

Proveer reportes ejecutivos consolidados que integren información de múltiples proyectos, permitiendo a la dirección general tener visibilidad completa del portafolio de obras con KPIs corporativos, análisis de desviaciones y comparativos históricos.

---

## 2. Casos de Uso

### CU-BI-001: Dashboard Corporativo Multi-Proyecto

**Actor:** Director General, CFO, Gerente de Operaciones
**Precondiciones:**
- Usuario tiene rol de dirección o ejecutivo
- Existen proyectos activos en el sistema

**Flujo Principal:**

1. Usuario accede al dashboard corporativo
2. Sistema muestra vista consolidada de todos los proyectos
3. Usuario ve KPIs principales:
   - Total de proyectos activos: 12
   - Inversión total en curso: $850M MXN
   - Avance físico promedio: 68%
   - Avance financiero promedio: 65%
   - Margen operativo consolidado: 18.5%
   - Viviendas en construcción: 450
   - Viviendas terminadas este mes: 35
4. Usuario ve gráfica de distribución de proyectos por estado:
   - Planeación: 3 proyectos
   - En construcción: 8 proyectos
   - En cierre: 1 proyecto
5. Usuario ve ranking de proyectos por desempeño (SPI, CPI)
6. Usuario puede filtrar por:
   - Región geográfica
   - Tipo de proyecto (fraccionamiento, vertical, mixto)
   - Rango de presupuesto
   - Período de construcción

**Postcondiciones:**
- Dashboard muestra información actualizada al día
- Métricas se actualizan en tiempo real

**Wireframe:**

```
┌────────────────────────────────────────────────────────────────────────┐
│ 📊 Dashboard Corporativo - Grupo Constructor ABC                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─ Resumen Global ──────────────────────────────────────────────────┐  │
│ │                                                                    │  │
│ │ ┌──────────┬──────────┬──────────┬──────────┬──────────┐          │  │
│ │ │Proyectos │Inversión │Av. Físico│Av. Financ│Margen Op.│          │  │
│ │ ├──────────┼──────────┼──────────┼──────────┼──────────┤          │  │
│ │ │   12     │ $850M    │   68%    │   65%    │  18.5%   │          │  │
│ │ │ 🟢 +2    │ 🟡 +$50M │ 🟡 -3%   │ 🟡 -5%   │ 🟢 +1.2% │          │  │
│ │ └──────────┴──────────┴──────────┴──────────┴──────────┘          │  │
│ │                                                                    │  │
│ │ ┌──────────┬──────────┬──────────┬──────────┐                     │  │
│ │ │Viviendas │Terminadas│En Proceso│Vendidas  │                     │  │
│ │ ├──────────┼──────────┼──────────┼──────────┤                     │  │
│ │ │   450    │   35     │   180    │   230    │                     │  │
│ │ │(Este mes)│(Este mes)│          │  (51%)   │                     │  │
│ │ └──────────┴──────────┴──────────┴──────────┘                     │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ ┌─ Proyectos por Estado ─────────┐ ┌─ Top 5 Proyectos por SPI ──────┐ │
│ │                                 │ │                                 │ │
│ │     ┌───┐                       │ │ 1. Fracc. Del Valle  1.15 ✅   │ │
│ │  8  │   │ En Construcción       │ │ 2. Torres Sol       1.08 ✅   │ │
│ │     └───┘                       │ │ 3. Privada Roble    0.98 🟡   │ │
│ │  3  ┌─┐   Planeación            │ │ 4. Fracc. Pinos     0.92 🟡   │ │
│ │     └─┘                         │ │ 5. Residencial Lago 0.85 🔴   │ │
│ │  1  ┌┐    En Cierre             │ │                                 │ │
│ │     └┘                          │ │ [Ver Todos los Proyectos]      │ │
│ └─────────────────────────────────┘ └─────────────────────────────────┘ │
│                                                                         │
│ ┌─ Distribución de Inversión por Tipo de Proyecto ──────────────────┐  │
│ │                                                                     │  │
│ │ Fraccionamientos: $520M (61%)  ████████████████████                │  │
│ │ Edificios Verticales: $250M (29%) ████████████                     │  │
│ │ Mixtos: $80M (10%)  ████                                            │  │
│ └─────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│ ┌─ Alertas Corporativas ────────────────────────────────────────────┐  │
│ │                                                                     │  │
│ │ 🔴 2 proyectos con SPI < 0.90 (retraso crítico)                    │  │
│ │ 🟡 3 proyectos con sobrecosto > 5%                                 │  │
│ │ 🟡 1 proyecto con liquidez < 30 días                               │  │
│ │ ℹ️ 5 proyectos próximos a hito de financiamiento                   │  │
│ └─────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                                   [Exportar Reporte] [Configurar]      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### CU-BI-002: Reporte de Desempeño por Proyecto

**Actor:** Director General, Gerente de Operaciones
**Precondiciones:**
- Proyectos tienen datos históricos (al menos 1 mes)

**Flujo Principal:**

1. Usuario solicita reporte de desempeño
2. Sistema muestra tabla comparativa de todos los proyectos:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Proyecto          │Presupuesto│Av.Fís│Av.Fin│ SPI │ CPI │Margen│Alertas│
├───────────────────────────────────────────────────────────────────────────┤
│Fracc. Del Valle   │ $120M     │ 85%  │ 82%  │1.15 │1.08 │ 22%  │  0🔴  │
│Torres del Sol     │ $95M      │ 72%  │ 70%  │1.08 │1.02 │ 19%  │  0🔴  │
│Privada Roble      │ $80M      │ 65%  │ 68%  │0.98 │0.95 │ 17%  │  1🟡  │
│Fracc. Los Pinos   │ $150M     │ 58%  │ 60%  │0.92 │0.94 │ 16%  │  3🟡  │
│Residencial Lago   │ $110M     │ 45%  │ 52%  │0.85 │0.88 │ 12%  │  2🔴  │
│...                │           │      │      │     │     │      │       │
└───────────────────────────────────────────────────────────────────────────┘

Leyenda:
SPI > 1.0: Adelantado  |  SPI = 1.0: En tiempo  |  SPI < 1.0: Retrasado
CPI > 1.0: Bajo presupuesto  |  CPI < 1.0: Sobre presupuesto
```

3. Usuario puede ordenar por cualquier columna
4. Usuario puede hacer clic en un proyecto para ver drill-down
5. Usuario puede exportar a Excel/PDF

**Postcondiciones:**
- Reporte generado y disponible para descarga

---

### CU-BI-003: Análisis de Márgenes Consolidado

**Actor:** CFO, Director General
**Precondiciones:**
- Proyectos tienen presupuestos y costos registrados

**Flujo Principal:**

1. Usuario accede a módulo de análisis de márgenes
2. Sistema calcula y muestra:
   - **Margen Bruto Consolidado:**
     ```
     Ingresos Totales:      $950M
     Costos Directos:       $720M
     Margen Bruto:          $230M (24.2%)
     ```
   - **Margen Operativo Consolidado:**
     ```
     Margen Bruto:          $230M
     Gastos Indirectos:     -$45M
     Margen Operativo:      $185M (19.5%)
     ```
   - **Margen Neto Consolidado:**
     ```
     Margen Operativo:      $185M
     Gastos Financieros:    -$12M
     Margen Neto:           $173M (18.2%)
     ```

3. Usuario ve gráfica de evolución de márgenes por trimestre:
   ```
   30%│
   25%│    ●─────●                        Margen Bruto
   20%│  ●           ●───●───●            Margen Operativo
   15%│●                       ●          Margen Neto
   10%│
      └────────────────────────────────→
      Q1   Q2   Q3   Q4   Q1   Q2
     2024 2024 2024 2024 2025 2025
   ```

4. Usuario ve desglose de márgenes por tipo de proyecto
5. Usuario identifica proyectos con margen < umbral (ej: <15%)

**Postcondiciones:**
- Análisis muestra oportunidades de mejora

---

### CU-BI-004: Reporte de Flujo de Efectivo Consolidado

**Actor:** CFO, Director Financiero
**Precondiciones:**
- Proyectos tienen estimaciones, pagos y facturación registrados

**Flujo Principal:**

1. Usuario solicita reporte de flujo de efectivo
2. Sistema genera proyección de flujo consolidado:

```
┌─────────────────────────────────────────────────────────────┐
│ Flujo de Efectivo Consolidado - Próximos 6 Meses           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  $50M│                ╱──╲                                  │
│  $40M│           ╱───╱    ╲                                 │
│  $30M│      ╱───╱          ╲─╲                              │
│  $20M│ ╱───╱                  ╲                             │
│  $10M│╱                        ╲                            │
│   $0M├──────────────────────────────────────────→           │
│ -$10M│                                                      │
│      Ene  Feb  Mar  Abr  May  Jun                          │
│                                                              │
│ ─ Ingresos Esperados  ─ Egresos Proyectados                │
│                                                              │
│ Análisis:                                                   │
│ • Liquidez actual: $45M                                     │
│ • Saldo mínimo proyectado: $8M (Abril)                      │
│ • ⚠️ Requiere línea de crédito: $15M para Abril-Mayo        │
│ • Recuperación esperada: Junio (+$25M por entrega Fracc)   │
└─────────────────────────────────────────────────────────────┘
```

3. Usuario ve detalle de ingresos esperados:
   - Por estimaciones aprobadas no cobradas
   - Por anticipos contratados
   - Por entrega de viviendas
4. Usuario ve detalle de egresos proyectados:
   - Nómina
   - Proveedores (OCs pendientes)
   - Subcontratistas (estimaciones por pagar)
   - Otros gastos operativos
5. Usuario identifica meses con déficit de liquidez
6. Sistema sugiere acciones (acelerar cobros, diferir pagos, línea de crédito)

**Postcondiciones:**
- CFO tiene visibilidad de necesidades de financiamiento

---

### CU-BI-005: Comparativo Histórico de Proyectos

**Actor:** Director General, Gerente de Operaciones
**Precondiciones:**
- Existen proyectos terminados en el sistema

**Flujo Principal:**

1. Usuario selecciona opción "Comparativo Histórico"
2. Usuario selecciona proyectos a comparar (hasta 5)
3. Sistema muestra tabla comparativa:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Métrica                │Fracc.   │Torres  │Privada │Fracc.  │Promedio│
│                        │Del Valle│Sol     │Roble   │Pinos   │        │
├──────────────────────────────────────────────────────────────────────┤
│ Presupuesto Original   │$120M    │$95M    │$80M    │$150M   │$111M   │
│ Costo Final            │$115M    │$97M    │$83M    │$158M   │$113M   │
│ Varianza de Costo      │-4.2%    │+2.1%   │+3.8%   │+5.3%   │+1.75%  │
│                        │                                              │
│ Duración Planificada   │18 meses │15 meses│12 meses│24 meses│17.25m  │
│ Duración Real          │17 meses │16 meses│13 meses│26 meses│18m     │
│ Varianza de Tiempo     │-5.6%    │+6.7%   │+8.3%   │+8.3%   │+4.4%   │
│                        │                                              │
│ Viviendas Entregadas   │50       │80      │40      │60      │57.5    │
│ Costo por Vivienda     │$2.3M    │$1.21M  │$2.08M  │$2.63M  │$1.96M  │
│                        │                                              │
│ Margen Neto Final      │22%      │19%     │17%     │12%     │17.5%   │
│ ROI                    │31%      │26%     │23%     │16%     │24%     │
└──────────────────────────────────────────────────────────────────────┘
```

4. Usuario identifica patrones:
   - Proyectos de fraccionamientos tienden a tener sobrecosto de +2-5%
   - Proyectos verticales son más rentables (menor costo/unidad)
   - Proyectos >$100M tienen mayor riesgo de retraso
5. Usuario ve gráficas de benchmarking
6. Sistema sugiere mejores prácticas basadas en proyectos exitosos

**Postcondiciones:**
- Lecciones aprendidas documentadas

---

## 3. Requerimientos Funcionales

### RF-BI-001.1: Dashboard Corporativo
- El sistema DEBE mostrar dashboard consolidado con KPIs de todos los proyectos
- El sistema DEBE actualizar métricas en tiempo real
- El sistema DEBE permitir filtrado por región, tipo, presupuesto
- El sistema DEBE mostrar alertas corporativas prioritarias

### RF-BI-001.2: Reportes de Desempeño
- El sistema DEBE generar tabla comparativa de proyectos con SPI, CPI, margen
- El sistema DEBE permitir ordenamiento por cualquier métrica
- El sistema DEBE permitir drill-down a detalle de proyecto
- El sistema DEBE permitir exportación a Excel y PDF

### RF-BI-001.3: Análisis de Márgenes
- El sistema DEBE calcular margen bruto, operativo y neto consolidado
- El sistema DEBE mostrar evolución histórica de márgenes
- El sistema DEBE identificar proyectos con margen < umbral configurable
- El sistema DEBE desglosar márgenes por tipo de proyecto

### RF-BI-001.4: Flujo de Efectivo Consolidado
- El sistema DEBE proyectar flujo de efectivo consolidado para 6 meses
- El sistema DEBE identificar meses con déficit de liquidez
- El sistema DEBE detallar ingresos esperados (estimaciones, anticipos, entregas)
- El sistema DEBE detallar egresos proyectados (nómina, proveedores, subcontratistas)
- El sistema DEBE sugerir acciones para cerrar gaps de liquidez

### RF-BI-001.5: Comparativo Histórico
- El sistema DEBE permitir comparar hasta 5 proyectos simultáneamente
- El sistema DEBE calcular varianzas de costo y tiempo
- El sistema DEBE calcular métricas de eficiencia (costo/vivienda, ROI)
- El sistema DEBE identificar patrones y tendencias
- El sistema DEBE sugerir mejores prácticas

---

## 4. Modelo de Datos

```typescript
// Dashboard Corporativo
interface CorporateDashboard {
  totalProjects: number;
  totalInvestment: number;
  avgPhysicalProgress: number;
  avgFinancialProgress: number;
  operatingMargin: number;
  unitsUnderConstruction: number;
  unitsCompletedThisMonth: number;
  unitsSold: number;

  projectsByStatus: {
    planning: number;
    construction: number;
    closing: number;
  };

  topProjectsBySPI: {
    projectId: string;
    projectName: string;
    spi: number;
  }[];

  investmentByType: {
    type: 'fraccionamiento' | 'vertical' | 'mixto';
    amount: number;
    percentage: number;
  }[];

  corporateAlerts: {
    critical: number;
    warning: number;
    info: number;
  };
}

// Reporte de Desempeño
interface ProjectPerformanceReport {
  projects: {
    projectId: string;
    projectName: string;
    budget: number;
    physicalProgress: number;
    financialProgress: number;
    spi: number;
    cpi: number;
    margin: number;
    criticalAlerts: number;
    warningAlerts: number;
  }[];

  summary: {
    totalProjects: number;
    avgSPI: number;
    avgCPI: number;
    avgMargin: number;
    projectsOnTrack: number; // SPI >= 0.95
    projectsDelayed: number; // SPI < 0.95
    projectsOverBudget: number; // CPI < 0.95
  };
}

// Análisis de Márgenes
interface MarginAnalysis {
  consolidated: {
    totalRevenue: number;
    directCosts: number;
    grossMargin: number;
    grossMarginPct: number;

    indirectCosts: number;
    operatingMargin: number;
    operatingMarginPct: number;

    financialExpenses: number;
    netMargin: number;
    netMarginPct: number;
  };

  quarterlyTrend: {
    quarter: string; // "Q1-2024"
    grossMarginPct: number;
    operatingMarginPct: number;
    netMarginPct: number;
  }[];

  byProjectType: {
    projectType: string;
    avgGrossMargin: number;
    avgOperatingMargin: number;
    avgNetMargin: number;
  }[];

  lowMarginProjects: {
    projectId: string;
    projectName: string;
    netMarginPct: number;
    threshold: number;
  }[];
}

// Flujo de Efectivo Consolidado
interface CashFlowProjection {
  currentLiquidity: number;

  monthlyProjection: {
    month: string; // "2025-01"
    expectedIncome: number;
    projectedExpenses: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
  }[];

  incomeBreakdown: {
    month: string;
    estimationsReceivable: number;
    anticipations: number;
    unitDeliveries: number;
    other: number;
  }[];

  expenseBreakdown: {
    month: string;
    payroll: number;
    suppliers: number;
    subcontractors: number;
    otherOperating: number;
  }[];

  analysis: {
    minProjectedBalance: number;
    minBalanceMonth: string;
    creditLineNeeded: number;
    suggestedActions: string[];
  };
}

// Comparativo Histórico
interface HistoricalComparison {
  projects: {
    projectId: string;
    projectName: string;

    budgetOriginal: number;
    finalCost: number;
    costVariance: number;
    costVariancePct: number;

    plannedDuration: number; // meses
    actualDuration: number;
    timeVariance: number;
    timeVariancePct: number;

    unitsDelivered: number;
    costPerUnit: number;

    netMarginPct: number;
    roi: number;
  }[];

  averages: {
    avgCostVariancePct: number;
    avgTimeVariancePct: number;
    avgCostPerUnit: number;
    avgNetMarginPct: number;
    avgROI: number;
  };

  patterns: {
    pattern: string; // "Fraccionamientos > $100M tienden a +5% sobrecosto"
    confidence: number; // 0-100%
    sampleSize: number;
  }[];

  bestPractices: {
    practice: string;
    basedOnProjects: string[]; // project IDs
  }[];
}
```

---

## 5. Criterios de Aceptación

### Generales
- [ ] Dashboard corporativo muestra información consolidada de todos los proyectos
- [ ] Métricas se actualizan en tiempo real (<5 minutos de latencia)
- [ ] Todos los reportes permiten exportación a Excel y PDF
- [ ] Sistema maneja correctamente proyectos en diferentes etapas
- [ ] Cálculos de SPI, CPI, márgenes son matemáticamente correctos

### Dashboard Corporativo
- [ ] Muestra KPIs principales con tendencia vs mes anterior
- [ ] Gráfica de distribución de proyectos por estado es precisa
- [ ] Ranking de proyectos se actualiza automáticamente
- [ ] Filtros funcionan correctamente
- [ ] Alertas corporativas son relevantes y priorizadas

### Análisis de Márgenes
- [ ] Cálculo de margen bruto = (Ingresos - Costos Directos) / Ingresos
- [ ] Cálculo de margen operativo = (Margen Bruto - Gastos Indirectos) / Ingresos
- [ ] Cálculo de margen neto = (Margen Operativo - Gastos Financieros) / Ingresos
- [ ] Gráfica de tendencia muestra correctamente evolución trimestral
- [ ] Proyectos con margen < umbral se identifican correctamente

### Flujo de Efectivo
- [ ] Proyección de flujo es precisa (±10% de valores reales históricos)
- [ ] Sistema identifica meses con liquidez < 30 días operativos
- [ ] Detalle de ingresos incluye todas las fuentes
- [ ] Detalle de egresos incluye todas las categorías
- [ ] Sugerencias de acciones son relevantes

### Comparativo Histórico
- [ ] Se pueden seleccionar hasta 5 proyectos
- [ ] Varianzas de costo y tiempo se calculan correctamente
- [ ] Costo por unidad = Costo Total / Unidades Entregadas
- [ ] ROI = (Ingresos - Costos) / Costos × 100
- [ ] Patrones identificados tienen confianza > 70%

---

## 6. Notas Técnicas

### Cálculo de Métricas Consolidadas

```typescript
// Promedio Ponderado de SPI
const consolidatedSPI = projects.reduce((sum, p) => sum + (p.spi * p.budget), 0) /
                        projects.reduce((sum, p) => sum + p.budget, 0);

// Margen Operativo Consolidado
const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
const totalDirectCosts = projects.reduce((sum, p) => sum + p.directCosts, 0);
const totalIndirectCosts = overhead + adminExpenses + salesExpenses;
const operatingMargin = ((totalRevenue - totalDirectCosts - totalIndirectCosts) / totalRevenue) * 100;

// Proyección de Flujo de Efectivo
const projectedIncome = estimationsReceivable + anticipations + unitDeliveries;
const projectedExpenses = payroll + suppliers + subcontractors + other;
const netCashFlow = projectedIncome - projectedExpenses;
```

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo de Producto
**Versión:** 1.0
**Estado:** ✅ Listo para Revisión
