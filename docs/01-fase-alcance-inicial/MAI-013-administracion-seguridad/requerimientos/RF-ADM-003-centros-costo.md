# RF-ADM-003: Centros de Costo y Estructura Organizacional

**ID:** RF-ADM-003
**Módulo:** MAI-013 - Administración & Seguridad
**Tipo:** Requerimiento Funcional
**Prioridad:** P1 (Alta)
**Fecha de creación:** 2025-11-20
**Versión:** 1.0

---

## 📋 Descripción

El sistema debe proporcionar una **estructura de centros de costo jerárquica** que permita:

- Organización de gastos e ingresos por **unidades de negocio**
- Imputación automática de costos (compras, RRHH, maquinaria, gastos generales)
- Análisis de rentabilidad por **obra, etapa y frente de trabajo**
- Distribución de **gastos indirectos** corporativos
- Reportes financieros consolidados y detallados

Los centros de costo son fundamentales para el **control financiero** y la toma de decisiones estratégicas en constructoras que manejan múltiples proyectos simultáneamente.

---

## 🎯 Objetivos

### Objetivos de Negocio

1. **Trazabilidad de costos:** Saber exactamente dónde se gasta cada peso
2. **Análisis de rentabilidad:** Identificar proyectos/etapas rentables vs deficitarios
3. **Control presupuestal:** Comparar presupuestado vs real por centro de costo
4. **Distribución equitativa:** Prorrateo de gastos indirectos según criterios objetivos
5. **Reportes ejecutivos:** Dashboards financieros por obra y consolidados

### Objetivos Técnicos

1. **Jerarquía ilimitada:** Estructura de árbol con N niveles
2. **Imputación automática:** Asignación de gastos sin intervención manual
3. **Cierre mensual:** Proceso de cierre contable por centro de costo
4. **Performance:** Consultas de costos consolidados < 500ms
5. **Integración:** Sincronización con módulo de Finanzas (MAE-014)

---

## 🏢 Tipos de Centros de Costo

### 1. Centros de Costo Directos (Producción)

Vinculados a **obras específicas** que generan ingresos.

**Características:**
- Asociados a proyectos/etapas/frentes de obra
- Costos directamente atribuibles
- Generan ingresos (venta de viviendas, estimaciones)
- Análisis de rentabilidad individual

**Ejemplos:**
```
100 - Obra: Fraccionamiento Los Pinos
  ├── 101 - Etapa 1
  │   ├── 101.1 - Urbanización
  │   ├── 101.2 - Cimentación
  │   ├── 101.3 - Estructura
  │   └── 101.4 - Acabados
  └── 102 - Etapa 2
      └── ...

200 - Obra: Torre Residencial Aura
  ├── 201 - Subsuelo y Cimentación
  ├── 202 - Estructura (Niveles 1-10)
  ├── 203 - Instalaciones
  └── 204 - Acabados
```

### 2. Centros de Costo Indirectos (Administración)

Gastos **corporativos** que no se pueden atribuir a una obra específica.

**Características:**
- Gastos administrativos centrales
- Se distribuyen proporcionalmente a las obras
- No generan ingresos directos
- Necesarios para operación del negocio

**Ejemplos:**
```
000 - Dirección General
  ├── 001 - Finanzas y Administración
  ├── 002 - Recursos Humanos
  ├── 003 - Sistemas y TI
  ├── 004 - Legal y Cumplimiento
  └── 005 - Marketing y Ventas
```

### 3. Centros de Costo de Servicios Compartidos

Servicios internos que **prestan apoyo** a múltiples obras.

**Características:**
- Costos se redistribuyen a obras según uso
- Ejemplos: Almacén central, taller de maquinaria, laboratorio de calidad
- Tarifa interna por servicio prestado

**Ejemplos:**
```
900 - Servicios Compartidos
  ├── 901 - Almacén Central
  ├── 902 - Taller de Mantenimiento
  ├── 903 - Laboratorio de Control de Calidad
  └── 904 - Pool de Maquinaria
```

---

## 📊 Modelo de Datos de Centro de Costo

### Entidad Principal

```typescript
interface CostCenter {
  // Identificación
  id: string; // UUID
  code: string; // "101.2" (único)
  name: string; // "Cimentación - Etapa 1"
  description?: string;

  // Jerarquía
  parentId?: string; // UUID del centro padre
  level: number; // 0 (raíz), 1, 2, 3...
  path: string; // "100/101/101.2" (para queries jerárquicas)
  fullPath: string; // "Obra Los Pinos / Etapa 1 / Cimentación"

  // Clasificación
  type: CostCenterType; // direct | indirect | shared_service
  category?: string; // "Construcción", "Administración", "Servicios"

  // Vinculación
  constructoraId: string; // Multi-tenancy
  projectId?: string; // Si es centro directo (obra)
  stageId?: string; // Si es centro de etapa

  // Control presupuestal
  budgetAmount?: number; // Presupuesto asignado
  budgetYear?: number; // 2025
  responsibleUserId?: string; // Responsable del centro

  // Estado
  isActive: boolean;
  startDate: Date; // Fecha de apertura
  endDate?: Date; // Fecha de cierre (si aplica)

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### ENUMs

```typescript
enum CostCenterType {
  DIRECT = 'direct',               // Producción (obras)
  INDIRECT = 'indirect',           // Administración
  SHARED_SERVICE = 'shared_service' // Servicios compartidos
}

enum AllocationMethod {
  DIRECT = 'direct',                    // Asignación directa
  PROPORTIONAL_REVENUE = 'proportional_revenue',  // % sobre ingresos
  PROPORTIONAL_COST = 'proportional_cost',        // % sobre costos directos
  PROPORTIONAL_HEADCOUNT = 'proportional_headcount', // % sobre headcount
  EQUAL = 'equal',                      // Distribución equitativa
  CUSTOM = 'custom'                     // Fórmula personalizada
}
```

---

## 💰 Imputación Automática de Costos

### 1. Compras e Inventarios

**Regla:** Toda compra se imputa al centro de costo de la **obra destino**.

**Flujo:**
1. Se crea orden de compra para "Obra Los Pinos - Etapa 1"
2. Sistema identifica `projectId` y `stageId`
3. Busca centro de costo correspondiente: `101 - Etapa 1`
4. Imputa monto de compra a centro `101`

```typescript
interface PurchaseOrder {
  id: string;
  projectId: string;
  stageId?: string;
  costCenterId: string; // Auto-calculado
  totalAmount: number;
  // ...
}
```

**Excepciones:**
- Compras corporativas (papelería, licencias) → Centro `001 - Administración`
- Maquinaria compartida → Centro `904 - Pool de Maquinaria` (luego se redistribuye)

### 2. RRHH y Nómina

**Regla:** Horas-hombre se imputan según **asignación de cuadrillas** a frentes de obra.

**Flujo:**
1. Cuadrilla de albañilería trabaja en "Cimentación - Etapa 1"
2. Registro de asistencia captura: 8 trabajadores × 8 horas = 64 hrs
3. Costo por hora promedio: $80 MXN
4. Costo total: 64 hrs × $80 = $5,120 MXN
5. Se imputa a centro `101.2 - Cimentación`

```typescript
interface LaborCostImputation {
  attendanceId: string;
  employeeId: string;
  hoursWorked: number;
  costPerHour: number;
  totalCost: number;
  costCenterId: string; // Según asignación de cuadrilla
  date: Date;
}
```

**Distribución:**
- Si cuadrilla trabaja en múltiples frentes → Se prorratea horas por frente
- Ejemplo: 4 hrs en Cimentación + 4 hrs en Estructura → 50% cada uno

### 3. Maquinaria y Equipos

**Regla:** Uso de maquinaria se imputa según **tarifa interna** por hora de uso.

**Flujo:**
1. Retroexcavadora trabaja 10 horas en Obra A
2. Tarifa interna: $500 MXN/hora
3. Costo total: 10 hrs × $500 = $5,000 MXN
4. Se imputa a centro de costo de Obra A
5. Se abona a centro `904 - Pool de Maquinaria` (ingreso interno)

```typescript
interface EquipmentUsage {
  equipmentId: string;
  projectId: string;
  costCenterId: string;
  hoursUsed: number;
  ratePerHour: number;
  totalCost: number;
  date: Date;
}
```

### 4. Gastos Indirectos (Overhead)

**Regla:** Gastos administrativos se **distribuyen proporcionalmente** a obras activas.

**Métodos de Distribución:**

#### a) Proporcional a Ingresos
```
% Distribución = Ingresos de Obra A / Total Ingresos
Overhead asignado = % × Total Overhead
```

**Ejemplo:**
- Obra A: $10M ingresos (50%)
- Obra B: $10M ingresos (50%)
- Total overhead: $1M
- **Obra A recibe:** 50% × $1M = $500K
- **Obra B recibe:** 50% × $1M = $500K

#### b) Proporcional a Costos Directos
```
% Distribución = Costos Directos Obra A / Total Costos Directos
```

**Ejemplo:**
- Obra A: $8M costos directos (60%)
- Obra B: $5.33M costos directos (40%)
- Total overhead: $1M
- **Obra A recibe:** 60% × $1M = $600K
- **Obra B recibe:** 40% × $1M = $400K

#### c) Proporcional a Headcount
```
% Distribución = Empleados en Obra A / Total Empleados
```

**Ejemplo:**
- Obra A: 60 empleados (60%)
- Obra B: 40 empleados (40%)
- Total overhead: $1M
- **Obra A recibe:** 60% × $1M = $600K
- **Obra B recibe:** 40% × $1M = $400K

#### d) Distribución Equitativa
```
Overhead por obra = Total Overhead / Número de Obras Activas
```

**Configuración:**

```typescript
interface OverheadAllocationRule {
  id: string;
  costCenterId: string; // Centro indirecto (ej: "001 - Finanzas")
  method: AllocationMethod;
  frequency: 'monthly' | 'quarterly' | 'annual';
  isActive: boolean;
}
```

---

## 📈 Estructura Jerárquica

### Ejemplo Completo: Constructora ABC

```
Constructora ABC S.A. de C.V.
│
├── 000 - Dirección General
│   ├── 001 - Finanzas y Administración
│   │   ├── 001.1 - Contabilidad
│   │   ├── 001.2 - Tesorería
│   │   └── 001.3 - Cuentas por Pagar
│   ├── 002 - Recursos Humanos
│   │   ├── 002.1 - Reclutamiento
│   │   ├── 002.2 - Nómina
│   │   └── 002.3 - Capacitación
│   ├── 003 - Sistemas y TI
│   ├── 004 - Legal y Cumplimiento
│   └── 005 - Marketing y Ventas
│
├── 100 - Obra: Fraccionamiento Los Pinos
│   ├── 101 - Etapa 1 (100 viviendas)
│   │   ├── 101.1 - Urbanización
│   │   │   ├── 101.1.1 - Terracerías
│   │   │   ├── 101.1.2 - Pavimentación
│   │   │   └── 101.1.3 - Alumbrado
│   │   ├── 101.2 - Cimentación
│   │   ├── 101.3 - Estructura
│   │   ├── 101.4 - Muros y Techos
│   │   ├── 101.5 - Instalaciones
│   │   └── 101.6 - Acabados
│   └── 102 - Etapa 2 (80 viviendas)
│       └── ...
│
├── 200 - Obra: Torre Residencial Aura
│   ├── 201 - Subsuelo y Cimentación
│   ├── 202 - Estructura (Niveles 1-10)
│   ├── 203 - Estructura (Niveles 11-20)
│   ├── 204 - Instalaciones
│   ├── 205 - Acabados Comunes
│   └── 206 - Acabados Departamentos
│
└── 900 - Servicios Compartidos
    ├── 901 - Almacén Central
    ├── 902 - Taller de Mantenimiento
    ├── 903 - Laboratorio de Calidad
    └── 904 - Pool de Maquinaria
```

### Navegación Jerárquica

**Queries eficientes con path:**

```sql
-- Obtener todos los centros hijos de "101 - Etapa 1"
SELECT * FROM cost_centers
WHERE path LIKE '100/101/%'
  AND constructora_id = 'uuid-abc';

-- Consolidar costos de Etapa 1 (incluyendo hijos)
SELECT
  cc.code,
  cc.name,
  SUM(ci.amount) AS total_cost
FROM cost_centers cc
JOIN cost_imputations ci ON ci.cost_center_id = cc.id
WHERE cc.path LIKE '100/101/%'
  AND ci.date BETWEEN '2025-11-01' AND '2025-11-30'
GROUP BY cc.code, cc.name;
```

---

## 📊 Reportes de Centros de Costo

### 1. Estado de Resultados por Centro de Costo

```
Centro: 101 - Etapa 1 (Fraccionamiento Los Pinos)
Periodo: Noviembre 2025

┌─────────────────────────────┬──────────────┬──────────────┬──────────────┐
│ Concepto                    │ Presupuesto  │ Real         │ Variación    │
├─────────────────────────────┼──────────────┼──────────────┼──────────────┤
│ INGRESOS                    │              │              │              │
│ Venta de viviendas          │ $50,000,000  │ $48,500,000  │ -3.0% ⚠️     │
│                             │              │              │              │
│ COSTOS DIRECTOS             │              │              │              │
│ Materiales                  │ $15,000,000  │ $15,800,000  │ +5.3% 🔴     │
│ Mano de obra                │ $10,000,000  │ $9,750,000   │ -2.5% ✅     │
│ Maquinaria                  │  $3,000,000  │ $3,100,000   │ +3.3% ⚠️     │
│ Subcontratos                │  $8,000,000  │ $7,900,000   │ -1.3% ✅     │
│ Total Costos Directos       │ $36,000,000  │ $36,550,000  │ +1.5%        │
│                             │              │              │              │
│ MARGEN BRUTO                │ $14,000,000  │ $11,950,000  │ -14.6% 🔴    │
│ Margen %                    │     28.0%    │     24.6%    │              │
│                             │              │              │              │
│ GASTOS INDIRECTOS (Prorrateo)│             │              │              │
│ Administración              │  $1,200,000  │ $1,250,000   │              │
│ Finanzas                    │    $400,000  │   $420,000   │              │
│ RRHH                        │    $300,000  │   $310,000   │              │
│ Sistemas                    │    $200,000  │   $200,000   │              │
│ Total Indirectos            │  $2,100,000  │ $2,180,000   │              │
│                             │              │              │              │
│ UTILIDAD NETA               │ $11,900,000  │ $9,770,000   │ -17.9% 🔴    │
│ Margen Neto %               │     23.8%    │     20.1%    │              │
└─────────────────────────────┴──────────────┴──────────────┴──────────────┘
```

### 2. Análisis de Desviaciones

**Alertas automáticas:**
- 🔴 Materiales: +5.3% sobre presupuesto → Alerta enviada a Ingeniero y Compras
- 🔴 Margen bruto: -14.6% → Alerta enviada a Director
- ✅ Mano de obra: -2.5% bajo presupuesto → Dentro de rango

### 3. Consolidado de Múltiples Obras

```
Constructora ABC - Consolidado Noviembre 2025

┌──────────────────────┬──────────────┬──────────────┬──────────┐
│ Obra                 │ Ingresos     │ Costos       │ Margen % │
├──────────────────────┼──────────────┼──────────────┼──────────┤
│ Los Pinos - Etapa 1  │ $48,500,000  │ $36,550,000  │  24.6%   │
│ Los Pinos - Etapa 2  │ $32,000,000  │ $24,800,000  │  22.5%   │
│ Torre Aura           │ $25,000,000  │ $19,500,000  │  22.0%   │
│                      │              │              │          │
│ TOTAL OBRAS          │$105,500,000  │ $80,850,000  │  23.4%   │
│                      │              │              │          │
│ Gastos Indirectos    │         -    │  $4,200,000  │          │
│                      │              │              │          │
│ UTILIDAD NETA        │$105,500,000  │ $85,050,000  │  19.4%   │
└──────────────────────┴──────────────┴──────────────┴──────────┘
```

---

## 📋 Casos de Uso

### Caso 1: Crear Centro de Costo para Nueva Obra

**Actor:** Director de Finanzas

**Flujo:**
1. Se gana licitación de "Fraccionamiento Valle Verde" (200 viviendas)
2. Director Finanzas va a "Centros de Costo" → "Crear Centro"
3. Completa formulario:
   - Código: `300` (auto-sugerido)
   - Nombre: "Obra: Fraccionamiento Valle Verde"
   - Tipo: Directo (Producción)
   - Proyecto: [Selecciona Proyecto Valle Verde]
   - Presupuesto: $100,000,000 MXN
   - Responsable: Ing. Juan Pérez
4. Click en "Crear"
5. Sistema crea centro padre `300`
6. Director crea sub-centros (hijos):
   - `301` - Etapa 1
   - `302` - Etapa 2
7. Para cada etapa, crea frentes de trabajo:
   - `301.1` - Urbanización
   - `301.2` - Cimentación
   - `301.3` - Estructura
   - `301.4` - Instalaciones
   - `301.5` - Acabados

**Resultado:**
- Estructura jerárquica creada
- Todas las compras/gastos se imputan automáticamente según obra/etapa

### Caso 2: Distribución Mensual de Gastos Indirectos

**Actor:** Sistema (Cron Job automatizado)

**Flujo:**
1. Fin de mes (30 de noviembre 23:59)
2. Cron job ejecuta: `processOverheadAllocation()`
3. Sistema identifica centros indirectos:
   - `001 - Finanzas`: $1,500,000 MXN
   - `002 - RRHH`: $800,000 MXN
   - `003 - Sistemas`: $600,000 MXN
   - **Total overhead:** $2,900,000 MXN
4. Sistema identifica obras activas:
   - Obra A: $50M ingresos (50%)
   - Obra B: $30M ingresos (30%)
   - Obra C: $20M ingresos (20%)
5. Distribuye overhead según regla "Proporcional a ingresos":
   - Obra A: 50% × $2.9M = **$1,450,000**
   - Obra B: 30% × $2.9M = **$870,000**
   - Obra C: 20% × $2.9M = **$580,000**
6. Crea asientos contables:
   ```
   Obra A - Centro 100
     Cargo: $1,450,000 (Gastos Indirectos Asignados)
     Abono: Centro 001/002/003 (Gastos Indirectos)
   ```
7. Genera reporte: "Distribución de Overhead - Noviembre 2025.pdf"
8. Envía email a Director y CFO

**Resultado:**
- Gastos indirectos distribuidos automáticamente
- Cada obra refleja su parte proporcional
- Cálculo de margen neto preciso

### Caso 3: Análisis de Rentabilidad por Etapa

**Actor:** Director General

**Flujo:**
1. Director va a "Reportes" → "Análisis de Rentabilidad"
2. Selecciona:
   - Obra: Fraccionamiento Los Pinos
   - Nivel: Por Etapa
   - Periodo: Año 2025
3. Sistema genera reporte:

```
Obra: Fraccionamiento Los Pinos
Análisis de Rentabilidad por Etapa - 2025

┌────────┬──────────────┬──────────────┬──────────────┬──────────┐
│ Etapa  │ Ingresos     │ Costos       │ Utilidad     │ Margen % │
├────────┼──────────────┼──────────────┼──────────────┼──────────┤
│ Etapa 1│ $48,500,000  │ $38,730,000  │  $9,770,000  │  20.1% ⚠️│
│ Etapa 2│ $32,000,000  │ $24,800,000  │  $7,200,000  │  22.5% ✅│
│        │              │              │              │          │
│ TOTAL  │ $80,500,000  │ $63,530,000  │ $16,970,000  │  21.1%   │
└────────┴──────────────┴──────────────┴──────────────┴──────────┘

🔍 Insights:
- Etapa 1: Margen bajo por sobrecosto en materiales (+5.3%)
- Etapa 2: Desempeño en línea con presupuesto
- Recomendación: Revisar proveedores de Etapa 1
```

4. Director drill-down en Etapa 1 → Ver por frente de trabajo
5. Identifica que `101.1 - Urbanización` tiene desviación de +8%
6. Convoca reunión con Ingeniero y Compras

**Resultado:**
- Identificación de problemas de rentabilidad
- Decisiones basadas en datos
- Acciones correctivas

---

## ✅ Criterios de Aceptación

### AC1: Creación de Jerarquía

**DADO** un Director de Finanzas
**CUANDO** crea un centro de costo padre con 3 niveles de hijos
**ENTONCES**
- ✅ Estructura jerárquica se guarda correctamente
- ✅ Códigos son únicos (ej: 100, 101, 101.1)
- ✅ Campo `path` se calcula automáticamente (ej: "100/101/101.1")
- ✅ Campo `level` refleja nivel correcto (0, 1, 2)
- ✅ Queries de consolidación funcionan (SUM de costos de hijos)

### AC2: Imputación Automática de Compras

**DADO** una orden de compra de $50,000 para "Obra A - Etapa 1"
**CUANDO** se aprueba la orden
**ENTONCES**
- ✅ Sistema identifica centro de costo: `101 - Etapa 1`
- ✅ Crea registro de imputación:
  ```json
  {
    "costCenterId": "101",
    "amount": 50000,
    "sourceType": "purchase_order",
    "sourceId": "po-uuid"
  }
  ```
- ✅ Reporte de centro `101` refleja $50K adicionales

### AC3: Distribución de Overhead

**DADO** $1M en gastos indirectos y 2 obras activas
**CUANDO** se ejecuta proceso de distribución mensual
**ENTONCES**
- ✅ Sistema calcula % de distribución según regla configurada
- ✅ Crea asientos de distribución para cada obra
- ✅ Total distribuido = Total overhead (balance cero)
- ✅ Reporte generado y enviado a stakeholders

### AC4: Análisis de Rentabilidad Multi-Nivel

**DADO** una obra con 3 etapas y 15 frentes de trabajo
**CUANDO** se consulta rentabilidad
**ENTONCES**
- ✅ Reporte muestra 3 niveles: Obra, Etapa, Frente
- ✅ Consolidación automática (suma de hijos)
- ✅ Drill-down funcional (click en Etapa → ver Frentes)
- ✅ Comparación presupuesto vs real
- ✅ Alertas de desviaciones >5%

### AC5: Cierre Mensual

**DADO** fin de mes (30 de noviembre)
**CUANDO** se ejecuta cierre mensual
**ENTONCES**
- ✅ Todos los gastos del mes están imputados
- ✅ Overhead distribuido
- ✅ Estado de resultados generado por centro
- ✅ Saldos de centros cerrados (no editables)
- ✅ Reporte enviado a Director y CFO

---

## 🧪 Escenarios de Prueba

### Test 1: Jerarquía Ilimitada

```typescript
describe('RF-ADM-003: Cost Center Hierarchy', () => {
  it('should support unlimited hierarchy levels', async () => {
    const root = await createCostCenter({
      code: '100',
      name: 'Obra A',
      level: 0
    });

    const level1 = await createCostCenter({
      code: '101',
      name: 'Etapa 1',
      parentId: root.id,
      level: 1
    });

    const level2 = await createCostCenter({
      code: '101.1',
      name: 'Urbanización',
      parentId: level1.id,
      level: 2
    });

    const level3 = await createCostCenter({
      code: '101.1.1',
      name: 'Terracerías',
      parentId: level2.id,
      level: 3
    });

    expect(level3.path).toBe('100/101/101.1/101.1.1');
    expect(level3.level).toBe(3);

    // Test consolidación
    await imputeCost(level3.id, 10000);

    const consolidated = await getConsolidatedCosts(root.id);
    expect(consolidated).toBe(10000); // Suma de todos los hijos
  });
});
```

### Test 2: Distribución de Overhead

```typescript
describe('RF-ADM-003: Overhead Allocation', () => {
  it('should distribute overhead proportionally', async () => {
    const overhead = await createCostCenter({
      code: '001',
      name: 'Finanzas',
      type: 'indirect'
    });

    const obraA = await createCostCenter({
      code: '100',
      type: 'direct'
    });

    const obraB = await createCostCenter({
      code: '200',
      type: 'direct'
    });

    // Registrar ingresos
    await recordRevenue(obraA.id, 50000000); // 50M (50%)
    await recordRevenue(obraB.id, 50000000); // 50M (50%)

    // Registrar overhead
    await imputeCost(overhead.id, 1000000); // 1M

    // Ejecutar distribución
    await distributeOverhead({
      method: 'proportional_revenue',
      period: '2025-11'
    });

    // Validar
    const allocationA = await getAllocatedOverhead(obraA.id, '2025-11');
    const allocationB = await getAllocatedOverhead(obraB.id, '2025-11');

    expect(allocationA).toBe(500000); // 50% × 1M
    expect(allocationB).toBe(500000); // 50% × 1M
  });
});
```

---

## 🔗 Referencias

- **Especificación técnica:** [ET-ADM-002](../especificaciones/ET-ADM-002-centros-costo-jerarquicos.md)
- **Historia de usuario:** [US-ADM-003](../historias-usuario/US-ADM-003-centros-costo.md)
- **RF relacionados:** [RF-ADM-001](./RF-ADM-001-usuarios-roles.md)
- **Módulo de Finanzas:** MAE-014 (Fase 2)
- **Módulo:** [README.md](../README.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Estado:** ✅ Completo
