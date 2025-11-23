# RF-COST-004: Análisis de Rentabilidad y Márgenes

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17
**Responsable:** Equipo de Producto

---

## 1. Descripción General

Sistema de análisis financiero para evaluación de rentabilidad de proyectos, prototipos y la constructora en su conjunto. Permite:
- Cálculo de margen bruto por proyecto/prototipo/etapa
- Análisis de punto de equilibrio
- ROI y TIR proyectados
- Comparación de rentabilidad entre proyectos
- Identificación de productos (prototipos) más rentables
- Simulaciones financieras ("qué pasa si...")

**Objetivo:**
Maximizar rentabilidad mediante decisiones basadas en datos.

---

## 2. Objetivos de Negocio

### 2.1 Visibilidad Financiera
- Margen en tiempo real por proyecto
- Dashboard ejecutivo de rentabilidad
- KPIs financieros consolidados

### 2.2 Optimización de Producto
- Identificar prototipos más rentables
- Ajustar mix de producto (más Tipo A, menos Tipo B)
- Descontinuar prototipos no rentables

### 2.3 Toma de Decisiones
- Simulaciones de escenarios (precio, costo, volumen)
- Análisis de sensibilidad
- Evaluación de oportunidades de negocio

### 2.4 Benchmarking
- Comparación entre proyectos
- Identificar mejores prácticas
- Establecer targets de rentabilidad

---

## 3. Alcance Funcional

### 3.1 Análisis de Rentabilidad por Proyecto

#### Dashboard Ejecutivo
```
┌─────────────────────────────────────────────────────────────┐
│ ANÁLISIS DE RENTABILIDAD - Fraccionamiento Los Pinos        │
│ Actualizado: 30/Nov/2025                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ■ Resumen Financiero                                        │
│                                                              │
│ Ingresos Proyectados:             $165,750,000              │
│   150 viviendas × $1,105,000 promedio                       │
│                                                              │
│ Costos:                                                     │
│   Construcción:      $127,500,000                           │
│   Terreno:           $18,750,000                            │
│   Comercialización:  $4,965,000 (3%)                        │
│   Legales/Admin:     $2,486,250 (1.5%)                      │
│   ──────────────────────────────                            │
│   Total Costos:      $153,701,250                           │
│                                                              │
│ Utilidad Bruta:                   $12,048,750               │
│ Margen Bruto:                     7.3%                      │
│                                                              │
│ ⚠️ ALERTA: Margen bajo objetivo (15%)                       │
│                                                              │
│ ■ Indicadores de Rentabilidad                               │
│                                                              │
│ ROI:                              7.8%                       │
│ TIR (18 meses):                   6.5% anual                │
│ Payback:                          14.2 meses                │
│                                                              │
│ ■ Punto de Equilibrio                                       │
│                                                              │
│ Viviendas a vender:               139 de 150 (93%)          │
│ Ingresos requeridos:              $153,701,250              │
│ Margen de seguridad:              11 viviendas (7%)         │
│                                                              │
│ ■ Estado Actual (45% avance)                                │
│                                                              │
│ Vendidas:                         82 viviendas (55%)        │
│ Escrituradas/pagadas:             68 viviendas (45%)        │
│ Ingresos reconocidos:             $75,140,000               │
│ Costos incurridos:                $58,104,250               │
│ Margen a la fecha:                $17,035,750 (22.7%)       │
│                                                              │
│ ✓ Sobre punto de equilibrio                                 │
└─────────────────────────────────────────────────────────────┘
```

#### Desglose Financiero Detallado
```
ESTRUCTURA DE COSTOS E INGRESOS

┌────────────────────────┬──────────────┬─────────┬────────────┐
│ Concepto               │ Monto        │ %Ingreso│ $/Vivienda │
├────────────────────────┼──────────────┼─────────┼────────────┤
│ INGRESOS                                                     │
│ Venta viviendas        │ $165,750,000 │ 100.0%  │ $1,105,000 │
├────────────────────────┼──────────────┼─────────┼────────────┤
│ COSTOS DIRECTOS                                              │
│ Construcción           │ $127,500,000 │ 76.9%   │ $850,000   │
│ Terreno (prorrateado)  │ $18,750,000  │ 11.3%   │ $125,000   │
│ ────────────────────── │ ──────────── │ ─────── │ ─────────  │
│ Subtotal Directo       │ $146,250,000 │ 88.2%   │ $975,000   │
│ Margen Bruto I         │ $19,500,000  │ 11.8%   │ $130,000   │
├────────────────────────┼──────────────┼─────────┼────────────┤
│ COSTOS INDIRECTOS                                            │
│ Comercialización (3%)  │ $4,965,000   │ 3.0%    │ $33,100    │
│ Legales/Admin (1.5%)   │ $2,486,250   │ 1.5%    │ $16,575    │
│ ────────────────────── │ ──────────── │ ─────── │ ─────────  │
│ Subtotal Indirecto     │ $7,451,250   │ 4.5%    │ $49,675    │
│                                                              │
│ Margen Bruto II        │ $12,048,750  │ 7.3%    │ $80,325    │
├────────────────────────┼──────────────┼─────────┼────────────┤
│ FINANCIEROS                                                  │
│ Intereses (estimado)   │ $3,145,000   │ 1.9%    │ $20,967    │
│ ────────────────────── │ ──────────── │ ─────── │ ─────────  │
│ Utilidad Neta Proyect. │ $8,903,750   │ 5.4%    │ $59,358    │
└────────────────────────┴──────────────┴─────────┴────────────┘

Análisis:
✓ Margen Bruto I (11.8%) aceptable para segmento
⚠️ Margen Bruto II (7.3%) bajo por costos indirectos altos
⚠️ Utilidad Neta (5.4%) por debajo de target (8-10%)

Recomendaciones:
1. Reducir costo comercialización (negociar comisiones)
2. Evaluar aumento de precio de venta (+3% = $3.3M adicionales)
3. Optimizar costos de construcción (objetivo -2% = $2.6M ahorro)
```

### 3.2 Análisis por Prototipo

#### Comparación de Rentabilidad
```
┌─────────────────────────────────────────────────────────────┐
│ RENTABILIDAD POR PROTOTIPO                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Casa Tipo A v2                                              │
│ ──────────────────────────────────────────────────────      │
│ Unidades: 105 (70% del proyecto)                            │
│                                                              │
│ Precio venta:             $1,095,000                        │
│ Costo construcción:       $825,500                          │
│ Costo terreno:            $125,000                          │
│ Costos indirectos:        $49,275                           │
│ ──────────────────────────────────────────────              │
│ Utilidad unitaria:        $95,225                           │
│ Margen:                   8.7%                              │
│ Utilidad total (105 uds): $9,998,625                        │
│                                                              │
│ Características:                                            │
│ - 2 recámaras, 1 baño, 45 m²                                │
│ - Costo/m²: $18,344                                         │
│ - Precio/m²: $24,333                                        │
│ - Rendimiento: 10 días/vivienda                             │
│                                                              │
│ 🟢 Prototipo RENTABLE - Producto estrella                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Casa Tipo B v1                                              │
│ ──────────────────────────────────────────────────────      │
│ Unidades: 45 (30% del proyecto)                             │
│                                                              │
│ Precio venta:             $1,125,000                        │
│ Costo construcción:       $850,000                          │
│ Costo terreno:            $125,000                          │
│ Costos indirectos:        $50,625                           │
│ ──────────────────────────────────────────────              │
│ Utilidad unitaria:        $99,375                           │
│ Margen:                   8.8%                              │
│ Utilidad total (45 uds):  $4,471,875                        │
│                                                              │
│ Características:                                            │
│ - 2 recámaras, 1.5 baños, 48 m²                             │
│ - Costo/m²: $17,708                                         │
│ - Precio/m²: $23,438                                        │
│ - Rendimiento: 12 días/vivienda                             │
│                                                              │
│ 🟢 Prototipo RENTABLE - Ligeramente mejor margen            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

ANÁLISIS COMPARATIVO:
┌───────────────────┬──────────┬──────────┬────────────────┐
│ Métrica           │ Tipo A   │ Tipo B   │ Mejor          │
├───────────────────┼──────────┼──────────┼────────────────┤
│ Margen %          │ 8.7%     │ 8.8%     │ Tipo B ✓       │
│ Utilidad unitaria │ $95,225  │ $99,375  │ Tipo B ✓       │
│ Utilidad total    │ $9,998K  │ $4,471K  │ Tipo A ✓       │
│ Velocidad (días)  │ 10       │ 12       │ Tipo A ✓       │
│ Demanda (vendidas)│ 92%      │ 78%      │ Tipo A ✓       │
└───────────────────┴──────────┴──────────┴────────────────┘

RECOMENDACIÓN:
✓ Tipo A: Mayor volumen en futuros proyectos (mejor demanda + velocidad)
⚠️ Tipo B: Reducir participación o mejorar costos para aumentar margen
```

### 3.3 Análisis de Punto de Equilibrio

#### Cálculo Detallado
```
PUNTO DE EQUILIBRIO

Costos Fijos (no varían con volumen):
  Terreno:                 $18,750,000
  Urbanización:            $2,500,000
  Legales/permisos:        $1,250,000
  ──────────────────────── ─────────────
  Total Fijos:             $22,500,000

Costos Variables (por vivienda):
  Construcción:            $850,000
  Comercialización (3%):   $33,150
  Administrativos:         $16,575
  ──────────────────────── ─────────────
  Total Variables:         $899,725/vivienda

Precio de Venta Promedio:  $1,105,000/vivienda

Margen de Contribución:
  MC = Precio - Costo Variable
  MC = $1,105,000 - $899,725
  MC = $205,275/vivienda

Punto de Equilibrio:
  PE = Costos Fijos / Margen de Contribución
  PE = $22,500,000 / $205,275
  PE = 109.6 ≈ 110 viviendas

De 150 viviendas totales:
  Equilibrio:    110 viviendas (73%)
  Utilidad:      40 viviendas (27%)
  Margen seg.:   40/150 = 27% ✓ Saludable
```

#### Gráfica de Equilibrio
```
Ingresos
y Costos
($M)     │
         │                                    ╱
  170 M  │                               ╱────  Ingresos
         │                          ╱────
  150 M  │                     ╱────
         │                ╱────       ╱
  130 M  │           ╱────       ╱────  Costos Totales
         │      ╱────       ╱────
  110 M  │ ╱────       ●────   ← Punto Equilibrio (110 uds)
         │        ╱────
   90 M  │   ╱────
         │───────────────────────────────────────────→
         0   25   50   75  110  125  150   Viviendas
                              ↑
                        Punto de
                        Equilibrio

Zona de Pérdida: 0-109 viviendas
Zona de Utilidad: 110-150 viviendas (40 viviendas × $205K = $8.2M utilidad)
```

### 3.4 Análisis de Sensibilidad

#### Simulador de Escenarios
```
┌─────────────────────────────────────────────────────────────┐
│ SIMULADOR DE ESCENARIOS - Análisis de Sensibilidad          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Escenario Base (Actual)                                     │
│ ─────────────────────                                       │
│ Precio venta:    $1,105,000                                 │
│ Costo construc:  $850,000                                   │
│ Unidades:        150                                        │
│ Margen:          7.3%                                       │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ SIMULACIONES                                         │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │                                                      │   │
│ │ 1. ¿Qué pasa si aumentamos precio +3%?              │   │
│ │    Precio:     $1,138,150                           │   │
│ │    Margen:     10.4% (+3.1 puntos) ✓                │   │
│ │    Utilidad:   +$4,972,500                          │   │
│ │    Riesgo:     Puede reducir demanda -5%            │   │
│ │                                                      │   │
│ │ 2. ¿Qué pasa si costos suben +5%?                   │   │
│ │    Costo:      $892,500                             │   │
│ │    Margen:     3.2% (-4.1 puntos) ⚠️                │   │
│ │    Utilidad:   $5,293,750 (-56%)                    │   │
│ │    Acción:     CRÍTICO - Requiere aumento precio    │   │
│ │                                                      │   │
│ │ 3. ¿Qué pasa si vendemos solo 140 viviendas?        │   │
│ │    Ingresos:   $154,700,000                         │   │
│ │    Margen:     4.8%                                 │   │
│ │    Utilidad:   $7,421,650                           │   │
│ │    Análisis:   Aún sobre punto equilibrio ✓        │   │
│ │                                                      │   │
│ │ 4. Escenario Optimista (precio +3%, costo -2%)      │   │
│ │    Margen:     13.7%                                │   │
│ │    Utilidad:   $22,706,475 (+88%)                   │   │
│ │                                                      │   │
│ │ 5. Escenario Pesimista (precio -2%, costo +3%)      │   │
│ │    Margen:     1.1%                                 │   │
│ │    Utilidad:   $1,822,950 (-85%) 🔴                 │   │
│ │                                                      │   │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Matriz de Sensibilidad
```
Margen según variaciones de Precio vs Costo:

              PRECIO DE VENTA
        -5%    -3%    Base   +3%    +5%
      ┌─────┬──────┬──────┬──────┬──────┐
  -5% │ 7.2%│  9.6%│ 11.9%│ 14.3%│ 16.6%│
      ├─────┼──────┼──────┼──────┼──────┤
C -3% │ 5.3%│  7.6%│  9.9%│ 12.2%│ 14.5%│
O     ├─────┼──────┼──────┼──────┼──────┤
S Base│ 3.3%│  5.6%│  7.3%│  9.6%│ 11.9%│ ← Escenario Actual
T     ├─────┼──────┼──────┼──────┼──────┤
O +3% │ 1.3%│  3.6%│  5.9%│  8.2%│ 10.5%│
      ├─────┼──────┼──────┼──────┼──────┤
  +5% │-0.7%│  1.6%│  3.9%│  6.2%│  8.5%│
      └─────┴──────┴──────┴──────┴──────┘

Leyenda:
🟢 Verde: Margen > 10%
🟡 Amarillo: Margen 5-10%
🔴 Rojo: Margen < 5%

Análisis:
- Escenario actual (7.3%) es sensible a cambios
- Incremento precio +3% lleva a zona verde (9.6%)
- Incremento costo +5% lleva a zona roja (3.9%)
- Mayor sensibilidad a costos que a precio
```

### 3.5 Comparación entre Proyectos

#### Dashboard Comparativo
```
┌─────────────────────────────────────────────────────────────┐
│ COMPARACIÓN DE RENTABILIDAD - Portafolio Activo             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────┬──────────────┬──────────┬────────────┐│
│ │ Proyecto         │ Margen %     │ Utilidad │ Estado     ││
│ ├──────────────────┼──────────────┼──────────┼────────────┤│
│ │ Fracc. Los Pinos │ 7.3% 🟡      │ $12.0M   │ Ejecución  ││
│ │ (Este análisis)  │              │          │ 45%        ││
│ │                  │              │          │            ││
│ │ Conjunto Jardines│ 14.2% 🟢     │ $18.5M   │ Terminado  ││
│ │                  │              │          │ 100%       ││
│ │ Tipo: Medio      │ Target: 12%  │ Real     │            ││
│ │                  │              │          │            ││
│ │ Torre Central    │ 9.8% 🟡      │ $8.3M    │ Ejecución  ││
│ │ Tipo: Vertical   │ Target: 10%  │          │ 62%        ││
│ │                  │              │          │            ││
│ │ Resid. Vista     │ 18.5% 🟢     │ $15.2M   │ Ejecución  ││
│ │ Tipo: Premium    │ Target: 15%  │          │ 78%        ││
│ │                  │              │          │            ││
│ │ Plaza Comercial  │ 4.2% 🔴      │ $3.1M    │ Ejecución  ││
│ │ Tipo: Comercial  │ Target: 8%   │          │ 38%        ││
│ │                  │              │          │            ││
│ └──────────────────┴──────────────┴──────────┴────────────┘│
│                                                              │
│ PORTAFOLIO CONSOLIDADO:                                     │
│   Margen Promedio Ponderado:      11.2%                     │
│   Utilidad Total Proyectada:      $57.1M                    │
│   Inversión Total:                 $510M                    │
│   ROI Portafolio:                  11.2%                    │
│                                                              │
│ ANÁLISIS:                                                   │
│ ✓ 2 proyectos sobre target (Jardines, Vista)               │
│ ⚠️ 2 proyectos cerca de target (Los Pinos, Torre)           │
│ 🔴 1 proyecto bajo target (Plaza Comercial) - Requiere plan │
│                                                              │
│ MEJORES PRÁCTICAS:                                          │
│ • Conjunto Jardines: Excelente control de costos           │
│ • Residencial Vista: Alto precio de venta, buen mercado    │
│                                                              │
│ ÁREAS DE OPORTUNIDAD:                                       │
│ • Los Pinos: Reducir costos indirectos -1.5 puntos         │
│ • Plaza Comercial: Renegociar precios o reducir costos     │
└─────────────────────────────────────────────────────────────┘
```

### 3.6 Indicadores Financieros Avanzados

#### ROI y TIR
```
RETORNO SOBRE INVERSIÓN (ROI)

Inversión Inicial:
  Terreno:               $18,750,000
  Urbanización inicial:  $2,500,000
  ────────────────────── ─────────────
  Total Inicial:         $21,250,000

Inversión durante obra: $132,451,250 (construcción + gastos)

Inversión Total:         $153,701,250

Utilidad Neta Proyectada: $12,048,750

ROI = (Utilidad / Inversión) × 100
ROI = ($12,048,750 / $153,701,250) × 100
ROI = 7.8%

Plazo: 18 meses
ROI Anualizado: 7.8% × (12/18) = 5.2% anual


TASA INTERNA DE RETORNO (TIR)

Flujo de Efectivo Proyectado:

Mes 0:    -$21,250,000 (inversión inicial)
Mes 1-6:  -$25,000,000 (construcción sin ventas)
Mes 7-12: +$45,000,000 (ventas) - $35,000,000 (obra) = +$10M
Mes 13-18:+$120,750,000 (ventas) - $72,451,250 (obra) = +$48.3M

TIR Calculada: 6.5% anual

Análisis:
⚠️ TIR 6.5% < WACC (costo capital 8.5%)
⚠️ Proyecto NO crea valor con estructura actual
✓ Requiere mejora en margen o aceleración de ventas
```

---

## 4. Casos de Uso Principales

### CU-001: Evaluar Rentabilidad de Nuevo Proyecto
**Actor:** Director General
**Flujo:**
1. Accede a "Simulador de Proyecto"
2. Ingresa parámetros:
   - 180 viviendas (120 Tipo A + 60 Tipo B)
   - Precio venta: $1,150,000 promedio
   - Costo terreno: $22M
   - Costo construcción: estimado desde prototipos
3. Sistema calcula:
   - Inversión total: $178M
   - Ingresos: $207M
   - Utilidad: $29M
   - Margen: 14%
   - ROI: 16.3%
   - TIR: 12.8% anual
   - Punto equilibrio: 131 viviendas (73%)
4. Compara con portafolio actual (margen prom: 11.2%)
5. Decisión: ✓ APROBADO - Rentabilidad sobre target

### CU-002: Optimizar Mix de Producto
**Actor:** Director de Proyectos
**Flujo:**
1. Analiza rentabilidad por prototipo en proyecto actual
2. Ve que Tipo A tiene mejor demanda (92% vendido) que Tipo B (78%)
3. Simula escenarios para siguiente etapa:
   - Actual: 30 Tipo A + 20 Tipo B
   - Opción 1: 40 Tipo A + 10 Tipo B
   - Opción 2: 35 Tipo A + 15 Tipo B
4. Sistema calcula utilidad por opción:
   - Actual: $4.97M
   - Opción 1: $5.51M (+10.9%)
   - Opción 2: $5.24M (+5.4%)
5. Decisión: Implementar Opción 1
6. Actualiza plan maestro

### CU-003: Análisis de Sensibilidad Pre-licitación
**Actor:** Gerente de Licitaciones
**Flujo:**
1. Participa en licitación de proyecto INFONAVIT
2. Accede a simulador de sensibilidad
3. Define rangos de incertidumbre:
   - Precio venta: $950K-$980K (definido por INFONAVIT)
   - Costo: ±5% (incertidumbre en precios)
   - Volumen: 200-250 viviendas (depende de adjudicación)
4. Sistema genera matriz de escenarios (25 combinaciones)
5. Identifica:
   - Mejor caso: Margen 15.2%
   - Peor caso: Margen 3.8%
   - Caso probable: Margen 9.5%
6. Evalúa riesgo vs recompensa
7. Decisión: Participar con precio de $965K (margen esperado 10%)

---

## 5. Modelo de Datos Simplificado

```typescript
// Tabla: profitability_analysis
{
  id: UUID,
  constructoraId: UUID,
  projectId: UUID,

  analysisDate: DATE,
  analysisType: ENUM('actual', 'projected', 'scenario'),

  // Ingresos
  totalRevenue: DECIMAL(15,2),
  averageSalePrice: DECIMAL(12,2),
  unitsToSell: INTEGER,

  // Costos
  constructionCost: DECIMAL(15,2),
  landCost: DECIMAL(15,2),
  marketingCost: DECIMAL(15,2),
  administrativeCost: DECIMAL(15,2),
  financialCost: DECIMAL(15,2),
  totalCosts: DECIMAL(15,2),

  // Rentabilidad
  grossProfit: DECIMAL(15,2),
  grossMargin: DECIMAL(6,2),
  netProfit: DECIMAL(15,2),
  netMargin: DECIMAL(6,2),

  // Indicadores
  roi: DECIMAL(6,2),
  irr: DECIMAL(6,2),
  paybackMonths: INTEGER,
  breakEvenUnits: INTEGER,

  // Punto equilibrio
  fixedCosts: DECIMAL(15,2),
  variableCostPerUnit: DECIMAL(12,2),
  contributionMargin: DECIMAL(12,2),

  createdBy: UUID,
  createdAt: TIMESTAMP
}

// Tabla: prototype_profitability
{
  id: UUID,
  projectId: UUID,
  prototypeId: UUID,

  // Volumen
  unitsPlanned: INTEGER,
  unitsSold: INTEGER,
  unitsDelivered: INTEGER,

  // Financiero
  salePrice: DECIMAL(12,2),
  constructionCost: DECIMAL(12,2),
  landCostAllocated: DECIMAL(12,2),
  indirectCosts: DECIMAL(12,2),

  unitProfit: DECIMAL(12,2),
  unitMargin: DECIMAL(6,2),

  totalProfit: DECIMAL(15,2),

  // Performance
  averageConstructionDays: INTEGER,
  salesConversionRate: DECIMAL(5,2),

  updatedAt: TIMESTAMP
}
```

---

## 6. Criterios de Aceptación

- [ ] Dashboard de rentabilidad por proyecto
- [ ] Análisis por prototipo con comparación
- [ ] Cálculo de punto de equilibrio
- [ ] ROI y TIR proyectados
- [ ] Simulador de escenarios (qué pasa si...)
- [ ] Análisis de sensibilidad (matriz precio vs costo)
- [ ] Comparación entre proyectos del portafolio
- [ ] Identificación de mejores prácticas
- [ ] Alertas de margen bajo target
- [ ] Exportación de análisis a Excel/PDF

---

## 7. Métricas de Éxito

- **Rentabilidad**: 80% de proyectos con margen ≥ target
- **ROI**: Portafolio con ROI ≥ 12% anual
- **Decisiones**: 100% de proyectos nuevos con análisis de rentabilidad pre-aprobación
- **Optimización**: Incremento margen promedio +2 puntos anuales

---

**Estado:** ✅ Ready for Development
