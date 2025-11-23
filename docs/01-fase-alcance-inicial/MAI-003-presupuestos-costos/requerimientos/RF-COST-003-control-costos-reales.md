# RF-COST-003: Control de Costos Reales y Desviaciones

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Versión:** 1.0
**Fecha:** 2025-11-17
**Responsable:** Equipo de Producto

---

## 1. Descripción General

Sistema de registro, seguimiento y análisis de costos reales de construcción comparados contra el presupuesto autorizado, permitiendo:
- Registro de costos desde compras, inventarios, nómina y subcontratos
- Cálculo automático de desviaciones (presupuesto vs real)
- Alertas tempranas de sobrecostos
- Proyecciones de costo final
- Análisis de causas raíz de desviaciones

**Filosofía:**
"Medir para controlar, controlar para optimizar"

---

## 2. Objetivos de Negocio

### 2.1 Visibilidad en Tiempo Real
- Costo acumulado actualizado diariamente
- Dashboard ejecutivo con KPIs clave
- Acceso desde cualquier dispositivo

### 2.2 Control Proactivo
- Detección temprana de desviaciones (>5%)
- Alertas automáticas a responsables
- Plan de acción obligatorio para sobrecostos

### 2.3 Precisión en Proyecciones
- Proyección de costo final basada en tendencias
- Estimado al completar (EAC)
- Margen esperado actualizado

### 2.4 Trazabilidad Total
- Cada peso registrado rastreado a su origen
- Auditoría completa de movimientos
- Soporte documental (facturas, OC, recibos)

---

## 3. Alcance Funcional

### 3.1 Fuentes de Costos Reales

#### A. Compras de Materiales
```
Orden de Compra: OC-2025-00145
Proveedor: Cemex
Fecha: 15/11/2025
Proyecto: Fraccionamiento Los Pinos
Etapa: Etapa 1

┌──────────────────────┬─────────┬────────┬─────────┬──────────┐
│ Material             │ Cantidad│ Unidad │ PU      │ Total    │
├──────────────────────┼─────────┼────────┼─────────┼──────────┤
│ Cemento CPC 30R      │ 120     │ ton    │ $4,350  │ $522,000 │
│ Grava 3/4"           │ 85      │ m³     │ $380    │ $32,300  │
│                                          Subtotal: $554,300  │
│                                          IVA 16%:  $88,688   │
│                                          TOTAL:    $642,988  │
└──────────────────────────────────────────────────────────────┘

Afectación al presupuesto:
  Partida: 02-Cimentación > Materiales
  Presupuestado (50 viv al 45%): $5,163,750
  Real acumulado:                $5,008,200
  Esta compra:                   +$642,988
  Nuevo real acumulado:          $5,651,188
  Desviación:                    +9.4% 🔴
```

**Integración:**
- Cada línea de OC → Se asigna a partida presupuestal
- Al recibir material → Afecta costo real
- Si precio OC > precio presupuestado → Genera alerta

#### B. Mano de Obra
```
Nómina Quincenal: NOM-2025-22
Período: 16-30 Nov 2025
Proyecto: Fraccionamiento Los Pinos

┌──────────────────────┬──────────┬──────────┬─────────────┐
│ Cuadrilla/Empleado   │ Días     │ Salario  │ Total       │
├──────────────────────┼──────────┼──────────┼─────────────┤
│ Cuadrilla Albañilería│          │          │             │
│  - Juan Pérez (Of.)  │ 12 días  │ $675/día │ $8,100      │
│  - Pedro Gómez (Ay.) │ 12 días  │ $450/día │ $5,400      │
│  - Luis Soto (Ay.)   │ 12 días  │ $450/día │ $5,400      │
│                                    Subtotal: $18,900      │
│                                                           │
│ Cuadrilla Cimentación│          │          │             │
│  - Carlos Ruiz (Of.) │ 10 días  │ $720/día │ $7,200      │
│  - ...               │ ...      │ ...      │ ...         │
│                                                           │
│                                    TOTAL MO: $245,600     │
└───────────────────────────────────────────────────────────┘

Afectación:
  Partida: 02-Cimentación > Mano de Obra
  Presupuestado (15 días × 3 cuadrillas): $450,000
  Real acumulado (30 días):               $890,100
  Esta nómina:                            +$245,600
  Nuevo real:                             $1,135,700
  Desviación:                             -1.2% 🟢 (bajo presupuesto)
```

**Distribución:**
- Empleado → Asignado a cuadrilla
- Cuadrilla → Trabajando en partida específica
- Nómina → Distribuye costo a partidas según días trabajados

#### C. Subcontratos
```
Subcontrato: SUB-2025-008
Subcontratista: Instalaciones Rodríguez S.A.
Alcance: Instalación hidráulica 50 viviendas
Monto: $191,250 (IVA incluido)

Estimaciones:
┌────────┬────────────┬──────────┬──────────┬──────────────┐
│ Est. # │ Fecha      │ Avance % │ Monto    │ Acumulado    │
├────────┼────────────┼──────────┼──────────┼──────────────┤
│ EST-01 │ 31/10/2025 │ 30%      │ $57,375  │ $57,375      │
│ EST-02 │ 15/11/2025 │ 25%      │ $47,812  │ $105,187     │
│ EST-03 │ 30/11/2025 │ 20%      │ $38,250  │ $143,437     │
│ (Pend.)│ Dic 2025   │ 25%      │ $47,813  │ $191,250     │
└────────┴────────────┴──────────┴──────────┴──────────────┘

Afectación:
  Partida: 05-Instalaciones Hidráulicas
  Presupuestado (50 viv):     $200,000
  Real (hasta EST-02):        $105,187
  Proyección al 100%:         $191,250
  Desviación esperada:        -4.4% 🟢 (ahorro)
```

**Control:**
- Cada estimación → Afecta costo real por % avance
- Comparar: Avance físico vs avance financiero
- Detectar: Pagos mayores a avance real

#### D. Maquinaria y Equipo
```
Renta de Maquinaria: RENT-2025-067
Proveedor: Renta de Equipo del Norte
Equipo: Retroexcavadora CAT 416F
Período: 01-15 Nov 2025 (15 días)
Tarifa: $4,500/día
Total: $67,500 + IVA = $78,300

Consumo de Combustible:
  Diesel: 450 litros × $24.50/lt = $11,025

Afectación:
  Partida: 02-Cimentación > Maquinaria
  Presupuestado: $85,000
  Real:          $89,325
  Desviación:    +5.1% 🟡
```

### 3.2 Dashboard de Control de Costos

#### Vista Ejecutiva
```
┌─────────────────────────────────────────────────────────────┐
│ CONTROL DE COSTOS - Fraccionamiento Los Pinos               │
│ Actualizado: 30/Nov/2025 18:45                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ■ Resumen General                                           │
│                                                              │
│   Presupuesto Autorizado (v2.1):         $127,500,000       │
│   Costo Real Acumulado:                  $58,104,250        │
│   % Avance Físico:                       45%                │
│   % Avance Financiero:                   45.6%              │
│                                                              │
│   Desviación Acumulada:                  +1.3% 🟡           │
│   Proyección Costo Final:                $129,120,555       │
│   Margen Proyectado:                     28.5% (vs 30%)     │
│                                                              │
│ ■ Curva S                                                   │
│   100%│                                          ╱───       │
│      │                                      ╱───            │
│      │                                  ╱───  Proyectado    │
│   50%│                             ╱●── Real                │
│      │                        ╱────●   Presupuestado       │
│      │                   ╱────                              │
│    0%└─────────────────────────────────────────────→       │
│       Sep   Oct   Nov   Dic   Ene   Feb   Mar              │
│                                                              │
│ ■ Top 5 Partidas con Mayor Desviación                       │
│   🔴 Estructura:           +5.0% ($428,850 sobre)           │
│   🟡 Inst. Eléctricas:     +3.8% ($145,350 sobre)           │
│   🟡 Acabados:             +2.1% ($154,087 sobre)           │
│   🟢 Cimentación:          -3.0% ($155,550 ahorro)          │
│   🟢 Inst. Hidráulicas:    -4.4% ($8,813 ahorro)            │
│                                                              │
│ ■ Alertas Activas (3)                                       │
│   ⚠️ Estructura: Sobrecosto 5% - Plan acción requerido      │
│   ⚠️ Cemento: Precio +4.5% vs presupuesto                   │
│   ⚠️ MO Albañilería: Rendimiento -8% vs estándar            │
└─────────────────────────────────────────────────────────────┘
```

#### Vista Detallada por Partida
```
Partida: 03-Estructura

┌──────────────┬──────────────┬──────────────┬──────────┬────────┐
│ Concepto     │ Presupuestado│ Real         │ Δ        │ Status │
├──────────────┼──────────────┼──────────────┼──────────┼────────┤
│ MATERIALES                                                    │
│ Concreto     │ $3,825,000   │ $3,942,750   │ +3.1%    │ 🟡     │
│ Acero        │ $2,295,000   │ $2,524,500   │ +10.0%   │ 🔴     │
│ Cimbra       │ $1,147,500   │ $1,118,875   │ -2.5%    │ 🟢     │
├──────────────┼──────────────┼──────────────┼──────────┼────────┤
│ MANO DE OBRA                                                  │
│ Cuadrilla    │ $1,530,000   │ $1,498,050   │ -2.1%    │ 🟢     │
├──────────────┼──────────────┼──────────────┼──────────┼────────┤
│ MAQUINARIA                                                    │
│ Grúa         │ $382,500     │ $394,575     │ +3.2%    │ 🟡     │
├──────────────┼──────────────┼──────────────┼──────────┼────────┤
│ SUBTOTAL     │ $9,180,000   │ $9,478,750   │ +3.3%    │ 🟡     │
│ (Hasta 45%)  │              │              │          │        │
├──────────────┼──────────────┼──────────────┼──────────┼────────┤
│ Proyección   │ $19,125,000  │ $20,082,750  │ +5.0%    │ 🔴     │
│ al 100%      │              │              │          │        │
└──────────────┴──────────────┴──────────────┴──────────┴────────┘

🔍 Análisis de Causa Raíz (Acero +10%):
  • Precio varilla aumentó de $18/kg a $20.50/kg (+13.9%)
  • Motivo: Incremento internacional del acero (Feb 2025)
  • Consumo real vs presupuesto: +2%
  • Impacto: +$229,500 en partida de estructura

📋 Plan de Acción:
  ✓ Negociar precio fijo con proveedor para compras restantes
  ✓ Analizar alternativa: perfiles de acero reciclado
  □ Evaluar ajuste en otras partidas para compensar
  □ Solicitar aprobación cliente para ajuste de precio (+0.18%)

Responsable: Ing. Pedro Ramírez
Fecha límite: 10/Dic/2025
```

### 3.3 Análisis de Desviaciones

#### Tipos de Desviaciones
```
1. Desviación en Precio (ΔP)
   ΔP = (Precio Real - Precio Presupuestado) × Cantidad Real

   Ejemplo: Cemento
   Presupuestado: $4,300/ton
   Real: $4,500/ton
   Cantidad: 120 ton
   ΔP = ($4,500 - $4,300) × 120 = +$24,000

2. Desviación en Cantidad (ΔQ)
   ΔQ = (Cantidad Real - Cantidad Presupuestada) × Precio Presupuestado

   Ejemplo: Concreto
   Presupuestado: 450 m³
   Real: 472 m³ (merma mayor)
   Precio: $2,450/m³
   ΔQ = (472 - 450) × $2,450 = +$53,900

3. Desviación Mixta (ΔM)
   ΔM = (Precio Real - Presup.) × (Cantidad Real - Presup.)

   Ejemplo: Varilla
   ΔP = +$2.50/kg
   ΔQ = +850 kg
   ΔM = $2.50 × 850 = +$2,125

Desviación Total = ΔP + ΔQ + ΔM
```

#### Dashboard de Análisis
```
┌─────────────────────────────────────────────────────────────┐
│ ANÁLISIS DE DESVIACIONES - Etapa 1 (Completada)            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Presupuesto:  $42,500,000                                   │
│ Costo Real:   $43,140,000                                   │
│ Desviación:   +$640,000 (+1.5%)                             │
│                                                              │
│ ■ Descomposición de Desviación:                             │
│                                                              │
│   Por Precio:              +$850,000 (↑ acero, cemento)     │
│   Por Cantidad:            -$275,000 (↓ mermas en concreto) │
│   Por Rendimiento MO:      +$125,000 (↓ productividad)      │
│   Por Otros:               -$60,000  (ahorros varios)       │
│   ────────────────────────────────────────────────          │
│   TOTAL:                   +$640,000                         │
│                                                              │
│ ■ Top Causas de Sobrecosto:                                 │
│   1. Acero fy=4200:        +$458,000 (Precio +13.9%)        │
│   2. Cemento CPC:          +$287,000 (Precio +4.5%)         │
│   3. MO Albañilería:       +$125,000 (Rendimiento -8%)      │
│                                                              │
│ ■ Top Ahorros:                                              │
│   1. Concreto:             -$135,000 (Merma -2% vs -5%)     │
│   2. Instalación hidráu:   -$8,813   (Subcontrato -4.4%)   │
│   3. Cimbra:               -$28,625  (Reutilización +15%)   │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Proyecciones y Estimados

#### Estimado al Completar (EAC)
```
Métodos de Proyección:

1. Método de Tendencia Lineal
   EAC = (Costo Real Acumulado / % Avance Real) × 100%

   Ejemplo:
   Real: $58,104,250
   Avance: 45%
   EAC = $58,104,250 / 0.45 = $129,120,555

   vs Presupuesto: $127,500,000
   Sobrecosto proyectado: +$1,620,555 (+1.3%)

2. Método de Índice de Desempeño (CPI)
   CPI = Valor Ganado / Costo Real
   EAC = Presupuesto / CPI

   Ejemplo:
   Valor Ganado = $127,500,000 × 45% = $57,375,000
   Costo Real = $58,104,250
   CPI = $57,375,000 / $58,104,250 = 0.987
   EAC = $127,500,000 / 0.987 = $129,179,331

3. Método Ponderado (50% tendencia + 50% presupuesto restante)
   EAC = Real + [(Presup - Valor Ganado) / CPI]

   Ejemplo:
   EAC = $58,104,250 + [($127,500,000 - $57,375,000) / 0.987]
   EAC = $58,104,250 + $71,015,181
   EAC = $129,119,431
```

#### Dashboard de Proyecciones
```
┌─────────────────────────────────────────────────────────────┐
│ PROYECCIÓN DE COSTO FINAL                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Presupuesto Autorizado:              $127,500,000           │
│                                                              │
│ Escenario Optimista (CPI mejora 2%): $126,843,755           │
│   Ahorro esperado:                   -$656,245 (-0.5%)      │
│                                                              │
│ Escenario Más Probable (tendencia):  $129,120,555           │
│   Sobrecosto esperado:               +$1,620,555 (+1.3%)    │
│                                                              │
│ Escenario Pesimista (CPI empeora 2%):$131,463,265           │
│   Sobrecosto esperado:               +$3,963,265 (+3.1%)    │
│                                                              │
│ ■ Impacto en Rentabilidad                                   │
│                                                              │
│ Precio Venta:                        $165,750,000           │
│                                                              │
│ Optimista:  Margen $38,906,245 (30.7%)  ✓ Sobre objetivo    │
│ Probable:   Margen $36,629,445 (28.3%)  ⚠️ Bajo objetivo    │
│ Pesimista:  Margen $34,286,735 (26.0%)  ⚠️ Riesgo alto      │
│                                                              │
│ Objetivo: Mantener margen ≥ 28%                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.5 Alertas Automáticas

#### Configuración de Alertas
```
Reglas de Alertas:

1. Desviación por Partida
   Amarillo (⚠️): Desviación > ±3%
   Rojo (🔴):     Desviación > ±5%

   Notificar: Residente (amarillo), Director (rojo)

2. Proyección de Sobrecosto
   Amarillo: EAC > Presupuesto + 2%
   Rojo:     EAC > Presupuesto + 5%

   Notificar: Director (amarillo), Dirección General (rojo)

3. Precio vs Presupuesto
   Alerta si precio compra > precio presupuesto + 5%
   Requiere aprobación Director

4. Consumo Acelerado
   Alerta si % costo real > % avance físico + 5 puntos
   Ejemplo: Avance 45%, pero gastado 52%

5. Tendencia Negativa
   Alerta si CPI disminuye 2 semanas consecutivas
```

#### Ejemplo de Alerta
```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 ALERTA CRÍTICA DE SOBRECOSTO                             │
├─────────────────────────────────────────────────────────────┤
│ Proyecto: Fraccionamiento Los Pinos                         │
│ Partida: 03-Estructura                                      │
│ Fecha: 30/Nov/2025                                          │
│                                                              │
│ Desviación Actual:         +5.0% ($428,850)                 │
│ Umbral Crítico:            ±5.0%                            │
│                                                              │
│ Causas Identificadas:                                       │
│   • Precio acero +13.9% vs presupuesto                      │
│   • Consumo +2% por ajustes de diseño                       │
│                                                              │
│ Impacto Proyectado:                                         │
│   • Sobrecosto total partida: $957,750                      │
│   • Impacto en margen: -0.6%                                │
│                                                              │
│ Acción Requerida:                                           │
│   ✓ Enviar plan de acción en 48 horas                       │
│   ✓ Aprobar acciones correctivas                            │
│   ✓ Reportar a Dirección General                            │
│                                                              │
│ Responsable: Ing. Pedro Ramírez                             │
│ Notificado: Director de Proyectos, Gerencia Administrativa  │
└─────────────────────────────────────────────────────────────┘
```

### 3.6 Integración con Módulos

#### Flujo de Costos Reales
```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   COMPRAS   │─────>│ Recepción de │─────>│ Costo Real      │
│   (OC)      │      │ Material     │      │ Actualizado     │
└─────────────┘      └──────────────┘      └─────────────────┘
       │
       │                                            │
       v                                            v
┌─────────────┐                              ┌─────────────┐
│ Validación  │                              │  Dashboard  │
│ Precio vs   │                              │  Control    │
│ Presupuesto │                              │  Costos     │
└─────────────┘                              └─────────────┘
       │
       v (si precio > presup +5%)
┌─────────────┐
│ Alerta y    │
│ Aprobación  │
└─────────────┘


┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   NÓMINA    │─────>│ Distribución │─────>│ Costo Real MO   │
│   (Pagos)   │      │ a Partidas   │      │ por Partida     │
└─────────────┘      └──────────────┘      └─────────────────┘


┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│ SUBCONTRATOS│─────>│ Estimaciones │─────>│ Costo Real      │
│   (SC)      │      │ Aprobadas    │      │ Subcontratos    │
└─────────────┘      └──────────────┘      └─────────────────┘
```

---

## 4. Casos de Uso Principales

### CU-001: Consultar Estado de Costos
**Actor:** Director de Proyectos
**Flujo:**
1. Accede a Dashboard de Control de Costos
2. Selecciona proyecto "Fraccionamiento Los Pinos"
3. Ve resumen ejecutivo:
   - Presupuesto: $127.5M
   - Real: $58.1M (45% avance)
   - Desviación: +1.3%
   - Proyección final: $129.1M
4. Identifica alerta roja: Estructura +5%
5. Drill-down en partida Estructura
6. Ve detalle: Acero +13.9% causa principal
7. Exporta reporte para junta directiva

### CU-002: Investigar Desviación
**Actor:** Residente de Obra
**Flujo:**
1. Recibe alerta: "Mano de Obra Albañilería +3.8%"
2. Accede a análisis detallado
3. Sistema muestra:
   - Presupuesto: 0.25 jornales/m²
   - Real: 0.27 jornales/m² (-8% rendimiento)
4. Compara con cuadrillas:
   - Cuadrilla A: 0.24 jor/m² ✓
   - Cuadrilla B: 0.31 jor/m² ⚠️ (problema)
5. Identifica: Cuadrilla B tiene ayudantes sin experiencia
6. Crea plan de acción:
   - Rotar ayudantes entre cuadrillas
   - Capacitación en sitio
7. Actualiza sistema con plan
8. Programa seguimiento en 2 semanas

### CU-003: Aprobar Compra Fuera de Presupuesto
**Actor:** Director de Proyectos
**Flujo:**
1. Residente solicita OC: Acero fy=4200
   - Cantidad: 8,500 kg
   - Precio cotizado: $20.50/kg
   - Total: $174,250
2. Sistema compara con presupuesto:
   - Precio presupuestado: $18.00/kg
   - Desviación: +13.9% 🔴
3. Genera alerta automática a Director
4. Director revisa:
   - Justificación: "Incremento internacional del acero"
   - Cotizaciones alternativas: Similar pricing
   - Impacto: +$21,250 en partida
5. Aprueba con condiciones:
   - Negociar precio fijo para compras restantes
   - Buscar compensación en otras partidas
6. Sistema registra aprobación con notas
7. OC procede a emitirse

---

## 5. Modelo de Datos Simplificado

```typescript
// Tabla: actual_costs
{
  id: UUID,
  constructoraId: UUID,
  projectId: UUID,
  stageId: UUID NULLABLE,
  budgetItemId: UUID, // Partida presupuestal afectada

  // Origen del costo
  sourceType: ENUM('purchase', 'payroll', 'subcontract', 'equipment', 'other'),
  sourceId: UUID, // ID de OC, nómina, subcontrato, etc.
  sourceDocumentNumber: VARCHAR(50),

  // Montos
  amount: DECIMAL(15,2),
  currency: ENUM('MXN', 'USD'),
  includesVAT: BOOLEAN,

  // Fechas
  transactionDate: DATE,
  accountingPeriod: VARCHAR(7), // 2025-11

  // Clasificación
  costType: ENUM('material', 'labor', 'equipment', 'subcontract', 'indirect'),

  // Notas
  notes: TEXT,

  // Auditoría
  createdBy: UUID,
  createdAt: TIMESTAMP
}

// Tabla: cost_variances
{
  id: UUID,
  projectId: UUID,
  budgetItemId: UUID,

  // Período de análisis
  analysisDate: DATE,

  // Montos
  budgetedAmount: DECIMAL(15,2),
  actualAmount: DECIMAL(15,2),
  variance: DECIMAL(15,2),
  variancePercentage: DECIMAL(6,2),

  // Descomposición
  priceVariance: DECIMAL(15,2),
  quantityVariance: DECIMAL(15,2),
  mixedVariance: DECIMAL(15,2),

  // Clasificación
  status: ENUM('within_tolerance', 'warning', 'critical'),

  // Causa raíz
  rootCause: TEXT,
  actionPlan: TEXT,
  responsibleUserId: UUID,

  createdAt: TIMESTAMP
}

// Tabla: cost_projections
{
  id: UUID,
  projectId: UUID,

  projectionDate: DATE,
  physicalProgress: DECIMAL(5,2),

  // Métodos de proyección
  budgetedTotalCost: DECIMAL(15,2),
  actualCostToDate: DECIMAL(15,2),

  linearProjection: DECIMAL(15,2),
  cpiBasedProjection: DECIMAL(15,2),
  weightedProjection: DECIMAL(15,2),

  recommendedEAC: DECIMAL(15,2),

  // Índices
  cpi: DECIMAL(5,3), // Cost Performance Index
  spi: DECIMAL(5,3), // Schedule Performance Index

  createdAt: TIMESTAMP
}
```

---

## 6. Criterios de Aceptación

- [ ] Registro automático de costos desde Compras, Nómina, Subcontratos
- [ ] Dashboard ejecutivo con KPIs en tiempo real
- [ ] Curva S (Presupuestado vs Real vs Proyectado)
- [ ] Análisis de desviaciones (precio, cantidad, mixta)
- [ ] Proyección de costo final (3 métodos)
- [ ] Alertas automáticas configurables
- [ ] Plan de acción obligatorio para desviaciones >5%
- [ ] Comparación presupuesto vs real por partida
- [ ] Trazabilidad: cada costo rastreado a origen
- [ ] Exportación de reportes a Excel/PDF

---

## 7. Métricas de Éxito

- **Precisión**: Proyección EAC vs costo real final <2%
- **Oportunidad**: Alertas generadas <24h del evento
- **Acción**: 100% de alertas críticas con plan de acción en 48h
- **Rentabilidad**: Mantener margen ≥ objetivo (ej: 28%)

---

**Estado:** ✅ Ready for Development
