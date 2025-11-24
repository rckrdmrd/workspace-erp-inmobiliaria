# US-BI-006: Simulacion de Escenarios What-If

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 21
**Story Points:** 5
**Prioridad:** Media
**Asignado a:** Backend + Frontend

---

## Historia de Usuario

**Como** Planner (Planificador de Proyectos)
**Quiero** simular escenarios "que pasaria si" cambiando variables clave del proyecto
**Para** evaluar el impacto de decisiones antes de ejecutarlas y elegir la mejor opcion

---

## Criterios de Aceptacion

### 1. Acceso al Simulador de Escenarios
- [ ] Puedo acceder al simulador desde el dashboard del proyecto
- [ ] Veo el estado actual del proyecto como "Escenario Base"
- [ ] Puedo crear hasta 5 escenarios simultaneos para comparar
- [ ] Cada escenario tiene un nombre descriptivo y color distintivo
- [ ] Los escenarios se guardan automaticamente

### 2. Variables Ajustables del Simulador
- [ ] Puedo ajustar las siguientes variables con sliders o inputs:
  - **Duracion del proyecto:** ±30% del plazo original
  - **Costo de materiales:** ±20% del precio actual
  - **Costo de mano de obra:** ±15% del costo actual
  - **Productividad:** ±25% de la productividad base
  - **Tamaño del equipo:** ±5 personas
  - **Horario de trabajo:** Normal, Turno extra, 24/7
  - **Calidad de materiales:** Economica, Estandar, Premium
  - **Subcontratacion:** % de trabajo subcontratado (0-100%)
  - **Contingencia:** % adicional para imprevistos (0-20%)
  - **Financiamiento:** Tasa de interes (0-15%)
- [ ] Cada variable muestra valor minimo, maximo y actual
- [ ] Los sliders tienen marcas para valores comunes

### 3. Impacto Calculado Automaticamente
- [ ] Al ajustar cualquier variable, el sistema calcula automaticamente:
  - **Costo Total Final:** Nuevo costo estimado del proyecto
  - **Duracion Total:** Nueva fecha estimada de termino
  - **Margen de Utilidad:** % de utilidad final
  - **ROI:** Retorno sobre inversion
  - **Flujo de Efectivo:** Necesidad maxima de capital
  - **Nivel de Riesgo:** Bajo, Medio, Alto
- [ ] Los calculos se actualizan en tiempo real (<500ms)
- [ ] Veo indicadores visuales de cambio (↑↓) vs escenario base

### 4. Comparacion de Escenarios
- [ ] Veo una tabla comparativa de todos los escenarios creados:
  ```
  | Metrica          | Base    | Escenario A | Escenario B | Escenario C |
  |------------------|---------|-------------|-------------|-------------|
  | Costo Final      | $45.2M  | $42.8M      | $48.5M      | $46.1M      |
  | Duracion (dias)  | 350     | 380         | 320         | 350         |
  | Margen (%)       | 18.0%   | 21.5%       | 15.2%       | 19.3%       |
  | ROI (%)          | 21.0%   | 24.8%       | 17.5%       | 22.1%       |
  | Riesgo           | Medio   | Bajo        | Alto        | Medio       |
  ```
- [ ] Puedo ordenar por cualquier metrica
- [ ] Las celdas se colorean segun mejor/peor que base (verde/rojo)

### 5. Graficas de Comparacion
- [ ] Veo graficas comparando escenarios:
  - **Grafica de Barras:** Costo, Duracion, Margen de cada escenario
  - **Grafica Radar:** Multiples metricas por escenario
  - **Grafica de Dispersion:** Costo vs Duracion (trade-off)
  - **Grafica de Gantt Comparativa:** Cronogramas lado a lado
- [ ] Puedo seleccionar que escenarios mostrar en graficas
- [ ] Las graficas son interactivas (zoom, tooltips)

### 6. Analisis de Sensibilidad
- [ ] Veo un analisis de sensibilidad mostrando:
  - Que variables tienen mas impacto en el resultado
  - Grafica de tornado con impacto de cada variable
  - Rangos de variacion aceptables
- [ ] Ejemplo:
  ```
  Impacto en Costo Final (±10% cambio en variable):
  1. Costo Materiales:    ±$3.2M   ████████████████
  2. Productividad:       ±$2.1M   ██████████
  3. Costo Mano de Obra:  ±$1.8M   █████████
  4. Tamaño Equipo:       ±$0.9M   ████
  5. Contingencia:        ±$0.5M   ██
  ```
- [ ] Puedo hacer clic en variable para ver detalle de sensibilidad

### 7. Escenarios Predefinidos
- [ ] El sistema incluye escenarios predefinidos comunes:
  - **Fast Track:** Terminar 20% mas rapido (con sobrecosto)
  - **Low Cost:** Reducir costo 15% (con mas tiempo)
  - **High Quality:** Usar materiales premium (+10% costo)
  - **Crash Project:** Terminar en tiempo minimo (maximo costo)
  - **Balanced:** Optimizar costo y tiempo
- [ ] Puedo cargar un escenario predefinido como punto de partida
- [ ] Puedo guardar mis escenarios personalizados como templates

### 8. Recomendaciones del Sistema
- [ ] El sistema sugiere el mejor escenario basado en criterios:
  - Maximizar ROI
  - Minimizar costo
  - Minimizar tiempo
  - Balance costo-tiempo
  - Minimizar riesgo
- [ ] Veo una recomendacion con justificacion:
  ```
  📌 Recomendado: Escenario B "Balanced"

  Razon: Ofrece el mejor balance entre costo, tiempo y riesgo.
  - Ahorra $2.4M vs escenario rapido
  - Solo 15 dias mas que el mas rapido
  - Riesgo: Bajo (vs Alto del escenario rapido)
  ```
- [ ] Puedo cambiar el criterio de optimizacion

### 9. Guardar y Compartir Escenarios
- [ ] Puedo guardar escenarios con nombre descriptivo
- [ ] Puedo compartir escenarios con mi equipo
- [ ] Puedo exportar comparacion de escenarios a:
  - PDF ejecutivo con graficas
  - Excel con datos detallados
  - PowerPoint para presentaciones
- [ ] El archivo exportado incluye supuestos de cada escenario

### 10. Aplicar Escenario al Proyecto
- [ ] Puedo marcar un escenario como "Aprobado"
- [ ] Al aprobar, puedo generar:
  - Nueva version del presupuesto
  - Nueva version del programa de obra
  - Plan de accion con cambios necesarios
- [ ] Se registra que escenario fue aplicado y cuando
- [ ] Puedo hacer seguimiento: Escenario vs Realidad

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔬 Simulador de Escenarios What-If - Proyecto: Los Pinos                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ Escenarios Activos ─────────────────────────────────────────────────────┐│
│ │                                                                           ││
│ │ [🔵 Base] [🟢 Optimizado] [🟡 Fast Track] [🔴 Low Cost] [+ Nuevo]        ││
│ │                                                                           ││
│ │ Escenario Activo: 🟢 Optimizado                   [💾 Guardar] [🗑️ Borrar]││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Variables Ajustables ───────────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ 📅 Duracion del Proyecto                                                 │ │
│ │    [●────────────────●────────] 350 dias                                 │ │
│ │     245d          Base: 350d          455d                               │ │
│ │                                                                           │ │
│ │ 🧱 Costo de Materiales (+/- %)                                           │ │
│ │    [──────────●─────────────────] -5%                                    │ │
│ │     -20%        Base: 0%         +20%                                    │ │
│ │                                                                           │ │
│ │ 👷 Costo de Mano de Obra (+/- %)                                         │ │
│ │    [──────────────●─────────────] +3%                                    │ │
│ │     -15%        Base: 0%         +15%                                    │ │
│ │                                                                           │ │
│ │ ⚡ Productividad (+/- %)                                                  │ │
│ │    [───────────────────●────────] +12%                                   │ │
│ │     -25%        Base: 0%         +25%                                    │ │
│ │                                                                           │ │
│ │ 👥 Tamaño del Equipo                                                     │ │
│ │    [──────────●─────────────────] 18 personas                            │ │
│ │      10          Base: 15            20                                  │ │
│ │                                                                           │ │
│ │ ⏰ Horario de Trabajo                                                    │ │
│ │    ( ) Normal  (●) Turno Extra  ( ) 24/7                                │ │
│ │                                                                           │ │
│ │ 🎯 Calidad de Materiales                                                 │ │
│ │    ( ) Economica  (●) Estandar  ( ) Premium                             │ │
│ │                                                                           │ │
│ │ 🤝 Subcontratacion (%)                                                   │ │
│ │    [────────●───────────────────] 25%                                    │ │
│ │      0%         Base: 15%        100%                                    │ │
│ │                                                                           │ │
│ │ [🔄 Restablecer] [📋 Cargar Template] [💾 Guardar como Template]        │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Impacto Calculado ──────────────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│ │  │ Costo Total │  │ Duracion    │  │ Margen      │  │ ROI         │    │ │
│ │  │             │  │             │  │             │  │             │    │ │
│ │  │  $43.6M     │  │  335 dias   │  │   20.8%     │  │   24.2%     │    │ │
│ │  │  🟢 -3.5%   │  │  🟢 -15d    │  │  🟢 +2.8%   │  │  🟢 +3.2%   │    │ │
│ │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│ │                                                                           │ │
│ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │ │
│ │  │ Flujo Max   │  │ Fecha Term. │  │ Riesgo      │                      │ │
│ │  │             │  │             │  │             │                      │ │
│ │  │  $8.2M      │  │ 15/10/2025  │  │   🟡 Medio  │                      │ │
│ │  │  🟢 -$1.1M  │  │  🟢 -16d    │  │  ✓ Aceptable│                      │ │
│ │  └─────────────┘  └─────────────┘  └─────────────┘                      │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Comparacion de Escenarios ──────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐  │ │
│ │ │Metrica       │🔵 Base  │🟢 Optimiz│🟡 Fast Tr│🔴 Low Cost│Mejor  │  │ │
│ │ ├─────────────────────────────────────────────────────────────────────┤  │ │
│ │ │Costo Final   │$45.2M   │$43.6M 🏆 │$52.8M    │$41.2M 🏆  │Low Cost│  │ │
│ │ │Duracion (d)  │350      │335   🏆  │280   🏆  │390        │Fast Tr│  │ │
│ │ │Margen (%)    │18.0%    │20.8% 🏆  │12.5%     │19.5%      │Optimiz│  │ │
│ │ │ROI (%)       │21.0%    │24.2% 🏆  │15.8%     │22.5%      │Optimiz│  │ │
│ │ │Riesgo        │Medio    │Medio     │Alto      │Bajo   🏆  │Low Cost│  │ │
│ │ └─────────────────────────────────────────────────────────────────────┘  │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Grafica Costo vs Duracion ──────────┬─ Analisis de Sensibilidad ───────┐ │
│ │                                       │                                   │ │
│ │  $M                                   │ Impacto en Costo (tornado):       │ │
│ │  54│      🟡 Fast                     │                                   │ │
│ │  50│       Track                      │ Materiales  │████████████│ ±$3.2M│ │
│ │  46│                 🔵 Base          │ Productiv.  │██████████  │ ±$2.1M│ │
│ │  42│   🔴 Low    🟢 Optimiz.          │ Mano Obra   │█████████   │ ±$1.8M│ │
│ │  38│     Cost                         │ Equipo      │████        │ ±$0.9M│ │
│ │   0└──────────────────────────        │ Horario     │███         │ ±$0.7M│ │
│ │     250   300   350   400  dias       │                                   │ │
│ │                                       │ Variable mas critica: Materiales  │ │
│ └───────────────────────────────────────┴───────────────────────────────────┘ │
│                                                                              │
│ ┌─ Recomendacion del Sistema ──────────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ 📌 Escenario Recomendado: 🟢 Optimizado                                  │ │
│ │                                                                           │ │
│ │ Razon: Mejor balance entre costo, tiempo, margen y riesgo                │ │
│ │                                                                           │ │
│ │ ✓ Ahorra $1.6M vs escenario base                                         │ │
│ │ ✓ Termina 15 dias antes                                                  │ │
│ │ ✓ Incrementa margen en 2.8 puntos porcentuales                           │ │
│ │ ✓ Nivel de riesgo aceptable (Medio)                                      │ │
│ │                                                                           │ │
│ │ Supuestos clave:                                                         │ │
│ │ • Reduccion 5% en costos de materiales (via negociacion)                 │ │
│ │ • Incremento 12% en productividad (via capacitacion)                     │ │
│ │ • Turno extra en actividades criticas                                    │ │
│ │                                                                           │ │
│ │ [✅ Aprobar Escenario] [📊 Ver Detalles] [✏️ Ajustar]                     │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  [📥 Exportar Comparacion] [📧 Compartir] [⚙️ Criterios de Optimizacion]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. ACCEDER AL SIMULADOR
   ↓
   Dashboard de Proyecto → Tab "Simulador What-If"
   ↓
   Sistema carga escenario base con valores actuales del proyecto

2. CREAR NUEVO ESCENARIO
   ↓
   Usuario hace clic en [+ Nuevo Escenario]
   ↓
   Modal: Nombre del escenario: "Optimizado"
   ↓
   Se crea escenario como copia del base
   ↓
   Escenario "Optimizado" queda activo para edicion

3. AJUSTAR VARIABLES
   ↓
   Usuario mueve slider "Costo Materiales" a -5%
   ↓
   Sistema recalcula impacto en tiempo real:
   - Costo Total: $45.2M → $43.0M
   - Margen: 18.0% → 19.5%
   ↓
   Usuario ajusta "Productividad" a +12%
   ↓
   Sistema recalcula:
   - Duracion: 350d → 335d
   - Costo MO: Reduccion por eficiencia
   ↓
   Impacto total se muestra en tarjetas

4. COMPARAR ESCENARIOS
   ↓
   Usuario crea escenario "Fast Track"
   - Duracion: -20% (280 dias)
   - Horario: 24/7
   - Tamaño equipo: +5 personas
   ↓
   Sistema calcula:
   - Costo: $52.8M (+16.8%)
   - Margen: 12.5%
   - Riesgo: Alto
   ↓
   Tabla comparativa se actualiza con 3 escenarios

5. ANALIZAR SENSIBILIDAD
   ↓
   Usuario hace clic en [Analisis de Sensibilidad]
   ↓
   Sistema ejecuta variacion ±10% en cada variable
   ↓
   Grafica de tornado muestra:
   - Materiales: Mayor impacto (±$3.2M)
   - Productividad: Segundo mayor (±$2.1M)
   ↓
   Usuario identifica variables criticas a controlar

6. REVISAR RECOMENDACION
   ↓
   Sistema analiza los 3 escenarios
   ↓
   Algoritmo de optimizacion evalua:
   - ROI de cada escenario
   - Balance costo-tiempo
   - Nivel de riesgo
   ↓
   Recomendacion: "Optimizado" (mejor ROI con riesgo medio)
   ↓
   Justificacion se muestra al usuario

7. APROBAR Y APLICAR ESCENARIO
   ↓
   Usuario revisa escenario "Optimizado"
   ↓
   Hace clic en [✅ Aprobar Escenario]
   ↓
   Modal de confirmacion:
   - Se generara nueva version del presupuesto
   - Se ajustara el programa de obra
   - Se creara plan de accion
   ↓
   Usuario confirma
   ↓
   Sistema:
   - Marca escenario como "Aprobado"
   - Registra fecha y usuario
   - Genera plan de accion con cambios necesarios

8. EXPORTAR PARA PRESENTACION
   ↓
   Usuario hace clic en [Exportar Comparacion]
   ↓
   Selecciona formato: PowerPoint
   ↓
   Sistema genera PPTX con:
   - Slide 1: Resumen de escenarios
   - Slide 2: Tabla comparativa
   - Slide 3: Graficas de costo vs duracion
   - Slide 4: Analisis de sensibilidad
   - Slide 5: Recomendacion
   - Slide 6: Supuestos de cada escenario
   ↓
   Archivo listo para junta con cliente/direccion
```

---

## Notas Tecnicas

### Motor de Calculo de Escenarios

```typescript
// Interface de escenario
interface Scenario {
  id: string;
  name: string;
  color: string;
  baseProjectId: string;
  variables: ScenarioVariables;
  calculatedImpact: CalculatedImpact;
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'approved' | 'archived';
}

// Variables ajustables
interface ScenarioVariables {
  durationMultiplier: number;      // 0.7 a 1.3 (±30%)
  materialCostMultiplier: number;  // 0.8 a 1.2 (±20%)
  laborCostMultiplier: number;     // 0.85 a 1.15 (±15%)
  productivityMultiplier: number;  // 0.75 a 1.25 (±25%)
  teamSize: number;                // base ±5
  workSchedule: 'normal' | 'overtime' | '24x7';
  materialQuality: 'economic' | 'standard' | 'premium';
  subcontractingPercentage: number; // 0 a 100
  contingencyPercentage: number;    // 0 a 20
  financingRate: number;            // 0 a 15
}

// Impacto calculado
interface CalculatedImpact {
  totalCost: number;
  duration: number;
  completionDate: Date;
  profitMargin: number;
  roi: number;
  maxCashflow: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Funcion de calculo principal
function calculateScenarioImpact(
  baseProject: Project,
  variables: ScenarioVariables
): CalculatedImpact {

  // 1. Calcular costo de materiales
  const baseMaterialCost = baseProject.budget.materials;
  const materialCost = baseMaterialCost * variables.materialCostMultiplier;

  // Ajuste por calidad
  const qualityMultiplier = {
    'economic': 0.85,
    'standard': 1.0,
    'premium': 1.20
  };
  const adjustedMaterialCost = materialCost * qualityMultiplier[variables.materialQuality];

  // 2. Calcular costo de mano de obra
  const baseLaborCost = baseProject.budget.labor;
  const laborCost = baseLaborCost * variables.laborCostMultiplier;

  // Ajuste por horario
  const scheduleMultiplier = {
    'normal': 1.0,
    'overtime': 1.25,
    '24x7': 1.50
  };
  const adjustedLaborCost = laborCost * scheduleMultiplier[variables.workSchedule];

  // 3. Calcular duracion
  const baseDuration = baseProject.schedule.totalDays;
  let duration = baseDuration * variables.durationMultiplier;

  // Ajuste por productividad
  duration = duration / variables.productivityMultiplier;

  // Ajuste por tamaño de equipo
  const teamSizeEffect = variables.teamSize / baseProject.teamSize;
  duration = duration / Math.sqrt(teamSizeEffect); // Ley de rendimientos decrecientes

  // Ajuste por horario
  const scheduleDurationMultiplier = {
    'normal': 1.0,
    'overtime': 0.85,
    '24x7': 0.70
  };
  duration = duration * scheduleDurationMultiplier[variables.workSchedule];

  // 4. Calcular costo de subcontratacion
  const totalWorkCost = adjustedMaterialCost + adjustedLaborCost;
  const subcontractingCost = totalWorkCost * (variables.subcontractingPercentage / 100) * 1.15;

  // 5. Calcular costo total
  const directCost = adjustedMaterialCost + adjustedLaborCost + subcontractingCost;
  const contingency = directCost * (variables.contingencyPercentage / 100);
  const indirectCost = directCost * 0.08; // 8% gastos indirectos
  const totalCost = directCost + contingency + indirectCost;

  // 6. Calcular financiamiento
  const financingCost = totalCost * (variables.financingRate / 100) * (duration / 365);
  const finalCost = totalCost + financingCost;

  // 7. Calcular metricas financieras
  const revenue = baseProject.contractAmount;
  const profit = revenue - finalCost;
  const profitMargin = (profit / revenue) * 100;
  const roi = (profit / finalCost) * 100;

  // 8. Estimar flujo de efectivo maximo
  const avgMonthlyCost = finalCost / (duration / 30);
  const maxCashflow = avgMonthlyCost * 2; // Peak typically 2x average

  // 9. Calcular nivel de riesgo
  const riskLevel = calculateRiskLevel({
    profitMargin,
    durationCompression: baseDuration / duration,
    workSchedule: variables.workSchedule,
    contingency: variables.contingencyPercentage
  });

  // 10. Calcular fecha de termino
  const completionDate = addBusinessDays(baseProject.startDate, duration);

  return {
    totalCost: finalCost,
    duration: Math.round(duration),
    completionDate,
    profitMargin,
    roi,
    maxCashflow,
    riskLevel
  };
}

// Calculo de nivel de riesgo
function calculateRiskLevel(factors: any): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Margen bajo = mas riesgo
  if (factors.profitMargin < 10) riskScore += 3;
  else if (factors.profitMargin < 15) riskScore += 2;
  else if (factors.profitMargin < 20) riskScore += 1;

  // Compresion alta = mas riesgo
  if (factors.durationCompression > 1.3) riskScore += 3;
  else if (factors.durationCompression > 1.15) riskScore += 2;
  else if (factors.durationCompression > 1.0) riskScore += 1;

  // Horario intensivo = mas riesgo
  if (factors.workSchedule === '24x7') riskScore += 2;
  else if (factors.workSchedule === 'overtime') riskScore += 1;

  // Contingencia baja = mas riesgo
  if (factors.contingency < 5) riskScore += 2;
  else if (factors.contingency < 10) riskScore += 1;

  // Clasificacion final
  if (riskScore >= 6) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}
```

### Analisis de Sensibilidad

```typescript
// Analisis de sensibilidad (tornado chart)
function performSensitivityAnalysis(
  baseProject: Project,
  baseScenario: ScenarioVariables
): SensitivityResult[] {

  const results: SensitivityResult[] = [];
  const variationPercentage = 0.10; // ±10%

  const variables = [
    'materialCostMultiplier',
    'laborCostMultiplier',
    'productivityMultiplier',
    'teamSize',
    'subcontractingPercentage',
    'contingencyPercentage'
  ];

  for (const variable of variables) {
    // Escenario con variable +10%
    const scenarioHigh = { ...baseScenario };
    scenarioHigh[variable] = baseScenario[variable] * (1 + variationPercentage);
    const impactHigh = calculateScenarioImpact(baseProject, scenarioHigh);

    // Escenario con variable -10%
    const scenarioLow = { ...baseScenario };
    scenarioLow[variable] = baseScenario[variable] * (1 - variationPercentage);
    const impactLow = calculateScenarioImpact(baseProject, scenarioLow);

    // Calcular rango de impacto
    const costImpactRange = Math.abs(impactHigh.totalCost - impactLow.totalCost);
    const durationImpactRange = Math.abs(impactHigh.duration - impactLow.duration);

    results.push({
      variable,
      costImpact: costImpactRange,
      durationImpact: durationImpactRange,
      importance: costImpactRange // Ordenar por impacto en costo
    });
  }

  // Ordenar por importancia
  return results.sort((a, b) => b.importance - a.importance);
}
```

### Endpoints Necesarios

```typescript
// Escenarios
POST   /api/scenarios                          // Crear escenario
GET    /api/scenarios/project/:projectId       // Listar escenarios
GET    /api/scenarios/:id                      // Obtener escenario
PUT    /api/scenarios/:id                      // Actualizar variables
DELETE /api/scenarios/:id                      // Eliminar escenario
POST   /api/scenarios/:id/approve              // Aprobar escenario

// Calculos
POST   /api/scenarios/:id/calculate            // Calcular impacto
POST   /api/scenarios/compare                  // Comparar multiples escenarios
POST   /api/scenarios/:id/sensitivity          // Analisis de sensibilidad

// Templates
GET    /api/scenario-templates                 // Listar templates
POST   /api/scenarios/from-template/:id        // Crear desde template
POST   /api/scenarios/:id/save-as-template     // Guardar como template

// Recomendaciones
POST   /api/scenarios/recommend                // Obtener recomendacion

// Exportacion
POST   /api/scenarios/export-comparison        // Exportar comparacion
```

---

## Definicion de "Done"

- [ ] Simulador de escenarios accesible desde dashboard
- [ ] 10 variables ajustables con sliders funcionales
- [ ] Calculo de impacto en tiempo real (<500ms)
- [ ] Creacion de hasta 5 escenarios simultaneos
- [ ] Tabla comparativa de escenarios
- [ ] Graficas de comparacion (barras, radar, dispersion)
- [ ] Analisis de sensibilidad con tornado chart
- [ ] 5 escenarios predefinidos incluidos
- [ ] Sistema de recomendacion funcional
- [ ] Guardar y compartir escenarios
- [ ] Exportacion a PDF, Excel y PowerPoint
- [ ] Aprobacion de escenarios
- [ ] Calculo de nivel de riesgo automatico
- [ ] Tests unitarios de formulas de calculo
- [ ] Performance: calculo <500ms
- [ ] Documentacion de formulas
- [ ] Validado con Planners y Directores

---

**Estimacion:** 5 Story Points
**Dependencias:** Requiere MAI-002 (Proyectos), MAI-003 (Presupuestos)
**Fecha:** 2025-11-18
