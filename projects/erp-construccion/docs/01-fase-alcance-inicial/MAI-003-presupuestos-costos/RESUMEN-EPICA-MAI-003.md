# RESUMEN EJECUTIVO - MAI-003: Presupuestos y Control de Costos

**Versión:** 1.0
**Fecha:** 2025-11-17
**Estado:** ✅ COMPLETO (100%)

---

## 📊 Estado del Progreso

| Tipo de Documento | Completados | Total | % | Tamaño |
|-------------------|-------------|-------|---|--------|
| Requerimientos Funcionales (RF) | 4 | 4 | 100% ✅ | ~120 KB |
| Especificaciones Técnicas (ET) | 4 | 4 | 100% ✅ | ~95 KB |
| Historias de Usuario (US) | 8 | 8 | 100% ✅ | ~40 KB |
| **Total Documentos** | **16** | **16** | **100%** ✅ | **~255 KB** |

**Story Points Totales:** 46 SP

---

## 🎯 Objetivos de Negocio

### Problema que Resuelve
Las constructoras **pierden entre 5-15% de margen** debido a:
- ❌ Presupuestos desactualizados o imprecisos
- ❌ Falta de control sobre costos reales
- ❌ Desconocimiento de rentabilidad por prototipo
- ❌ Reacción tardía ante desviaciones

### Solución Propuesta
Sistema integral de presupuestos y costos que permite:
- ✅ **Catálogo centralizado** de 10,000+ conceptos reutilizables
- ✅ **Presupuestos en 3 niveles** (obra, etapa, prototipo) con generadores automáticos
- ✅ **Control en tiempo real** de costos con alertas proactivas
- ✅ **Análisis de rentabilidad** con simulaciones y proyecciones

### Beneficios Esperados
- **Eficiencia:** -80% tiempo elaboración presupuestos (2h vs 10h)
- **Precisión:** <3% desviación presupuesto vs real
- **Rentabilidad:** +2 puntos de margen por mejor control
- **Visibilidad:** Dashboard actualizado en tiempo real

---

## 📁 Documentos Generados

### Requerimientos Funcionales (4)

#### ✅ RF-COST-001: Catálogo de Conceptos y Precios Unitarios (~35 KB)
**Alcance:**
- 4 tipos de conceptos: material, mano de obra, maquinaria, compuesto
- Catálogo jerárquico por división CMIC (16 capítulos)
- Análisis de precios unitarios (APU) detallado
- Versionado y historial de precios
- Regionalización de precios
- Importación/exportación Excel, OPUS, Neodata

**Componentes Clave:**
```
Concepto Compuesto "Cimentación corrida":
├─ Materiales: $4,548 (concreto, acero, cimbra, alambre)
├─ Mano de Obra: $1,125 (oficial + ayudantes con FSR)
├─ Maquinaria: $226 (vibrador + herramienta menor)
├─ CD: $5,899
├─ Indirectos (12%): $708
├─ Financiamiento (3%): $177
├─ Utilidad (10%): $590
├─ Cargos (2%): $118
└─ PU Final: $7,492/m³ + IVA
```

#### ✅ RF-COST-002: Presupuestos Maestros (Obra, Etapa, Prototipo) (~38 KB)
**Alcance:**
- Presupuesto de obra con desglose CMIC
- Presupuesto de etapa por fase constructiva
- Presupuesto de prototipo con generadores automáticos
- Versionado completo (baseline, ajustes, cambios de alcance)
- Análisis de rentabilidad integrado
- Curva S y distribución temporal

**Ejemplo Generador:**
```javascript
// Excavación para cimentación
formula: "desplantDepth * buildingPerimeter * 0.60 * 0.80"
inputs: {
  desplantDepth: 0.80m,
  buildingPerimeter: 30m
}
result: 14.40 m³
```

#### ✅ RF-COST-003: Control de Costos Reales y Desviaciones (~32 KB)
**Alcance:**
- Registro automático desde compras, nómina, subcontratos
- Dashboard con curva S
- Cálculo de desviaciones (precio, cantidad, mixta)
- Proyecciones EAC (3 métodos)
- Alertas automáticas configurables
- Plan de acción obligatorio para desviaciones >5%

**Indicadores Clave:**
```
CPI (Cost Performance Index) = Valor Ganado / Costo Real
SPI (Schedule Performance Index) = Valor Ganado / Valor Planificado
EAC (Estimate at Completion) = Presupuesto / CPI
```

#### ✅ RF-COST-004: Análisis de Rentabilidad y Márgenes (~15 KB)
**Alcance:**
- Análisis financiero por proyecto
- Comparación de rentabilidad por prototipo
- Punto de equilibrio y margen de seguridad
- Simulador de escenarios
- Matriz de sensibilidad (precio vs costo)
- ROI y TIR proyectados

**Ejemplo Análisis:**
```
Proyecto: 150 viviendas
Ingresos: $165.75M
Costos: $153.70M
Margen: 7.3%
PE: 110 viviendas (73%)
Margen seguridad: 27% ✓
```

---

### Especificaciones Técnicas (4)

#### ✅ ET-COST-001: Implementación del Catálogo de Conceptos (~28 KB)
**Stack Técnico:**
- **DB:** PostgreSQL con schema `budgets`
- **Backend:** NestJS + TypeORM
- **Frontend:** React + Zustand

**Tablas Principales:**
```sql
budgets.concept_catalog (conceptos base)
budgets.concept_price_history (historial precios)
budgets.regions (regionalización)
```

**Funcionalidades:**
- CRUD completo con validaciones
- Búsqueda full-text (<200ms)
- Actualización masiva de precios
- Cálculo automático PU compuestos
- Triggers para historial automático

#### ✅ ET-COST-002: Implementación de Presupuestos (~25 KB)
**Tablas:**
```sql
budgets.budgets (presupuestos maestros)
budgets.budget_items (partidas jerárquicas)
budgets.budget_versions (versionado)
```

**Funcionalidades:**
- Wizard de creación desde prototipos
- Generadores de volumetrías
- Cálculo automático de totales (trigger)
- Versionado con comparación
- Exportación Excel/PDF

#### ✅ ET-COST-003: Implementación de Control de Costos (~25 KB)
**Tablas:**
```sql
budgets.actual_costs (costos reales)
budgets.cost_variances (desviaciones)
budgets.cost_projections (proyecciones)
```

**Funcionalidades:**
- Integración con compras/nómina/subcontratos
- Recálculo automático de desviaciones
- Proyección EAC con 3 métodos
- Cron job diario (6:00 AM)
- Dashboard con Chart.js

#### ✅ ET-COST-004: Implementación de Análisis de Rentabilidad (~17 KB)
**Tablas:**
```sql
budgets.profitability_analysis
budgets.prototype_profitability
```

**Funcionalidades:**
- Cálculo automático de rentabilidad
- Simulador de escenarios
- Matriz de sensibilidad
- Comparación de prototipos
- Punto de equilibrio visual

---

### Historias de Usuario (8)

#### Sprint 7 (13 SP)
- ✅ **US-COST-001:** Catálogo de Conceptos y Búsqueda (5 SP)
- ✅ **US-COST-002:** Precios Unitarios Compuestos (5 SP)
- ✅ **US-COST-003:** Actualización Masiva de Precios (3 SP)

#### Sprint 8 (13 SP)
- ✅ **US-COST-004:** Presupuesto de Obra Completo (8 SP)
- ✅ **US-COST-005:** Presupuesto de Prototipo con Generadores (5 SP)

#### Sprint 9 (10 SP)
- ✅ **US-COST-006:** Dashboard de Control de Costos Reales (5 SP)
- ✅ **US-COST-007:** Análisis de Desviaciones y Plan de Acción (5 SP)

#### Sprint 10 (5 SP)
- ✅ **US-COST-008:** Análisis de Rentabilidad y Simulaciones (5 SP)

---

## 🏗️ Arquitectura Técnica

### Base de Datos

**Schema:** `budgets`
**Tablas:** 9 tablas principales
```
concept_catalog (catálogo de conceptos)
├─ concept_price_history
└─ regions

budgets (presupuestos)
├─ budget_items (partidas)
└─ budget_versions

actual_costs (costos reales)
├─ cost_variances
└─ cost_projections

profitability_analysis
└─ prototype_profitability
```

**Funciones SQL:**
- `calculate_composite_price()`: Calcula PU de concepto compuesto
- `calculate_variances()`: Genera análisis de desviaciones
- `calculate_eac()`: Proyección de costo final
- `calculate_profitability()`: Análisis de rentabilidad

**Triggers:**
- Auto-actualización de `updated_at`
- Historial automático de precios
- Recálculo de totales en presupuestos
- Alertas automáticas en desviaciones >5%

### Backend (NestJS)

**Módulos:**
- `BudgetsModule`
  - `ConceptCatalogService`
  - `BudgetService`
  - `CostControlService`
  - `ProfitabilityService`

**Controllers:**
- `ConceptCatalogController` (9 endpoints)
- `BudgetController` (12 endpoints)
- `CostControlController` (8 endpoints)
- `ProfitabilityController` (6 endpoints)

**Cron Jobs:**
- `CostAnalysisTask.analyzeDailyCosts()` - Diario 6:00 AM

### Frontend (React + Vite)

**Stores (Zustand):**
- `useConceptCatalogStore`
- `useBudgetStore`
- `useCostControlStore`
- `useProfitabilityStore`

**Páginas Principales:**
- `/concept-catalog` - Catálogo de conceptos
- `/budgets/:id` - Detalle de presupuesto
- `/cost-control/:projectId` - Control de costos
- `/profitability/:projectId` - Análisis de rentabilidad

**Componentes Clave:**
- `ConceptCatalogList` - Lista con búsqueda y filtros
- `CreateConceptModal` - Formulario de concepto compuesto
- `BudgetItemsTree` - Árbol jerárquico de partidas
- `CurveS` - Gráfica de curva S (Chart.js)
- `SensitivityMatrix` - Matriz de sensibilidad
- `ScenarioSimulator` - Simulador interactivo

---

## 📈 Estimación de Sprints

### Distribución Propuesta

**Sprint 7** (2 semanas) - **13 SP**: Catálogo de conceptos base
- US-COST-001: Catálogo de Conceptos (5 SP)
- US-COST-002: Precios Compuestos (5 SP)
- US-COST-003: Actualización Masiva (3 SP)

**Sprint 8** (2 semanas) - **13 SP**: Presupuestos
- US-COST-004: Presupuesto de Obra (8 SP)
- US-COST-005: Presupuesto de Prototipo (5 SP)

**Sprint 9** (2 semanas) - **10 SP**: Control de costos
- US-COST-006: Dashboard Control (5 SP)
- US-COST-007: Análisis Desviaciones (5 SP)

**Sprint 10** (2 semanas) - **5 SP**: Rentabilidad
- US-COST-008: Análisis Rentabilidad (5 SP)

**Total:** 4 sprints × 2 semanas = **8 semanas de desarrollo**

---

## ⚙️ Configuración SaaS Multi-tenant

### Activación del Módulo

MAI-003 es un **módulo core** incluido en los 3 planes de suscripción:

| Plan | Módulo MAI-003 | Funcionalidades | Límites |
|------|----------------|-----------------|---------|
| **Básico** | ✅ Incluido | Catálogo + Presupuestos básicos | 500 conceptos, 10 presupuestos/proyecto |
| **Profesional** | ✅ Incluido | Todo + Control de costos | 2,000 conceptos, 50 presupuestos |
| **Enterprise** | ✅ Incluido | Todo + Rentabilidad avanzada | Ilimitado |

**Activación automática:** Este módulo se activa durante el onboarding junto con MAI-002 (Proyectos).

### Portal de Administración SaaS

#### Para Super Admin (Equipo Interno)

**Panel de gestión del módulo:**
```
┌─────────────────────────────────────────────────────────┐
│  Módulo MAI-003: Presupuestos y Costos                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Uso Global (Todos los Tenants)                     │
│  ────────────────────────────────────────              │
│  Tenants con módulo activo:    234/234 (100%)          │
│  Presupuestos totales:         5,678                    │
│  Conceptos en catálogos:       1,234,567               │
│  Costos reales registrados:    $2.4B MXN acum.         │
│                                                         │
│  🔧 Feature Flags                                      │
│  ────────────────────────────────────────              │
│  ☑️ budgets.composite_concepts (ENABLED)              │
│     Conceptos compuestos con APU                        │
│                                                         │
│  ☑️ budgets.cost_control_dashboard (ENABLED)          │
│     Dashboard de control de costos reales               │
│                                                         │
│  ☑️ budgets.profitability_analysis (ENABLED)          │
│     Análisis de rentabilidad y simulaciones             │
│                                                         │
│  ☐ budgets.ai_cost_prediction (BETA)                  │
│     Predicción de costos con ML (Beta)                  │
│                                                         │
│  📈 Métricas de Rendimiento                            │
│  ────────────────────────────────────────              │
│  Búsqueda conceptos (p95):        178 ms ✅             │
│  Cálculo PU compuesto (p95):       45 ms ✅             │
│  Generación presupuesto (100 partidas): 1.8s ✅         │
│  Actualización masiva (500 conceptos): 4.2s ✅          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Para Tenant Admin (Cliente/Constructora)

**Panel de configuración del módulo:**
```
┌─────────────────────────────────────────────────────────┐
│  Configuración: Módulo de Presupuestos                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Uso Actual (Constructora ABC)                      │
│  ────────────────────────────────────────              │
│  Plan: Profesional ($799/mes)                           │
│  Conceptos en catálogo: 842 / 2,000  (42%)             │
│  Presupuestos activos: 23                               │
│  Proyectos con control de costos: 8 / 12               │
│                                                         │
│  ⚙️ Configuraciones Personalizadas                     │
│  ────────────────────────────────────────              │
│  Indirectos por defecto: [12%___]                       │
│  Financiamiento: [3%___]                                │
│  Utilidad esperada: [10%___]                            │
│  Cargos adicionales: [2%___]                            │
│                                                         │
│  ☑️ Alertar cuando desviación > [5%___]                │
│  ☑️ Requerir plan de acción para desviaciones >5%      │
│  ☐ Enviar reporte semanal de costos                    │
│                                                         │
│  📂 Catálogo de Conceptos                              │
│  ────────────────────────────────────────              │
│  Materiales: 423 conceptos                              │
│  Mano de Obra: 156 conceptos                            │
│  Maquinaria: 89 conceptos                               │
│  Compuestos: 174 conceptos                              │
│                                                         │
│  [Importar Catálogo OPUS]  [Exportar a Excel]          │
│                                                         │
│  🌍 Regionalización de Precios                         │
│  ────────────────────────────────────────              │
│  Regiones configuradas: 3                               │
│  • Región Centro (base)                                 │
│  • Región Norte (+8% en materiales)                    │
│  • Región Sur (-3% en mano de obra)                    │
│                                                         │
│  [Gestionar Regiones]                                   │
│                                                         │
│  ⚠️ Límites del Plan                                   │
│  ────────────────────────────────────────              │
│  Estás usando 842 de 2,000 conceptos permitidos.       │
│  ¿Necesitas catálogo más grande?                       │
│  [Actualizar a Plan Enterprise] (ilimitados)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Provisioning Automático

Durante el onboarding, el sistema ejecuta:

```sql
-- 1. Activar módulo MAI-003
INSERT INTO constructoras.constructora_modules (
  constructora_id,
  module_code,
  is_active,
  plan_included
) VALUES (
  $constructora_id,
  'MAI-003',
  true,
  true
);

-- 2. Crear regiones base
INSERT INTO budgets.regions (
  constructora_id,
  code,
  name,
  description
) VALUES
  ($constructora_id, 'CENTRO', 'Región Centro', 'Región base sin ajustes'),
  ($constructora_id, 'NORTE', 'Región Norte', 'Ajuste +8% materiales'),
  ($constructora_id, 'SUR', 'Región Sur', 'Ajuste -3% mano de obra');

-- 3. Importar catálogo seed (100 conceptos básicos)
INSERT INTO budgets.concept_catalog (
  constructora_id,
  code,
  name,
  concept_type,
  category,
  unit,
  base_price
) SELECT
  $constructora_id,
  seed_code,
  seed_name,
  seed_type,
  seed_category,
  seed_unit,
  seed_price
FROM budgets.seed_concept_catalog;

-- 4. Configurar límites por plan
INSERT INTO constructoras.constructora_limits (
  constructora_id,
  limit_key,
  limit_value
) VALUES
  ($constructora_id, 'max_concepts', 2000),  -- Plan Profesional
  ($constructora_id, 'max_budgets_per_project', 50),
  ($constructora_id, 'max_regions', 5);

-- 5. Configurar parámetros por defecto
INSERT INTO budgets.constructora_budget_config (
  constructora_id,
  indirect_percentage,
  financing_percentage,
  utility_percentage,
  additional_charges_percentage
) VALUES (
  $constructora_id,
  12.00,  -- 12% indirectos
  3.00,   -- 3% financiamiento
  10.00,  -- 10% utilidad
  2.00    -- 2% cargos
);
```

### Aislamiento de Datos (RLS)

**Garantía de seguridad multi-tenant:**

```sql
-- Configuración de contexto por sesión
SET app.current_constructora_id = 'uuid-de-constructora-abc';
SET app.current_user_role = 'budget_manager';

-- Toda query automáticamente filtra por constructora
SELECT * FROM budgets.concept_catalog;
-- Internamente ejecuta:
-- SELECT * FROM budgets.concept_catalog
-- WHERE constructora_id = current_setting('app.current_constructora_id')::UUID;

-- Imposible ver conceptos de otras constructoras
SELECT * FROM budgets.concept_catalog WHERE constructora_id = 'otra-uuid';
-- Retorna: 0 rows (bloqueado por RLS policy)
```

**Políticas RLS completas:** Ver `implementacion/ET-COST-001-002-rls-policies.sql`

### Migraciones y Actualizaciones

**Actualización de catálogo nacional (semestral):**

```typescript
// Cron job: Actualizar precios según índices INPC/CMIC
@Cron('0 0 1 */6 *')  // Cada 6 meses, día 1 a medianoche
async updateNationalCatalogPrices() {
  // Solo actualizar conceptos que usen índice nacional
  await this.db.query(`
    UPDATE budgets.concept_catalog
    SET base_price = base_price * (1 + $index_increase / 100),
        price_update_source = 'auto_inpc_cmic',
        updated_at = NOW()
    WHERE constructora_id = ANY($constructora_ids)
      AND use_national_index = true
  `, {
    index_increase: 5.2,  // 5.2% incremento semestral
    constructora_ids: allConstructoraIds
  });

  // Crear registro en historial de precios
  await this.createPriceHistoryEntries();
}
```

### Monitoreo por Tenant

**Métricas capturadas:**

```javascript
// Evento de auditoría
{
  "event": "budget.created",
  "timestamp": "2025-11-20T10:30:00Z",
  "constructora_id": "uuid-constructora-abc",
  "user_id": "uuid-user-123",
  "budget_id": "uuid-budget-456",
  "metadata": {
    "budget_code": "PRES-PROJ-2025-001",
    "project_id": "uuid-project",
    "scope": "project",  // project | stage | prototype
    "total_amount": 15750000.00,
    "items_count": 247,
    "generation_time_ms": 1842
  }
}
```

**Dashboard de métricas:**
- Presupuestos generados por mes
- Conceptos más utilizados
- Desviación promedio presupuesto vs real
- Tiempo promedio de generación
- Alertas de costos activadas

### Upgrade de Plan

**Desbloqueo de límites:**

```sql
-- Actualizar de Profesional a Enterprise
UPDATE constructoras.constructora_limits
SET limit_value = -1  -- -1 = ilimitado
WHERE constructora_id = $tenant_id
  AND limit_key IN ('max_concepts', 'max_budgets_per_project');

-- Activar feature de análisis avanzado
UPDATE constructoras.constructora_feature_flags
SET is_enabled = true
WHERE constructora_id = $tenant_id
  AND flag_key = 'budgets.profitability_analysis';
```

### Soporte y Troubleshooting

**Queries de diagnóstico:**

```sql
-- Ver estado de presupuestos de un tenant
SELECT
  c.name AS constructora,
  COUNT(DISTINCT b.id) AS total_budgets,
  COUNT(DISTINCT cc.id) AS total_concepts,
  SUM(CASE WHEN b.status = 'approved' THEN 1 ELSE 0 END) AS approved_budgets,
  AVG(b.total_amount) AS avg_budget_amount,
  cl.limit_value AS max_concepts_allowed
FROM constructoras.constructoras c
LEFT JOIN budgets.budgets b ON b.constructora_id = c.id
LEFT JOIN budgets.concept_catalog cc ON cc.constructora_id = c.id
LEFT JOIN constructoras.constructora_limits cl ON cl.constructora_id = c.id
  AND cl.limit_key = 'max_concepts'
WHERE c.subdomain = 'constructora-abc'
GROUP BY c.id, c.name, cl.limit_value;

-- Análisis de performance de generación de presupuestos
SELECT
  constructora_id,
  AVG(generation_time_ms) AS avg_generation_time,
  MAX(generation_time_ms) AS max_generation_time,
  COUNT(*) AS budgets_generated,
  AVG(items_count) AS avg_items_per_budget
FROM audit.budget_generation_logs
WHERE created_at > NOW() - INTERVAL '30 days'
  AND constructora_id = $tenant_id
GROUP BY constructora_id;
```

---

## 🔗 Integraciones

### Módulos que Consume (Input)
- **MAI-002 (Proyectos):**
  - Estructura de proyectos/etapas
  - Prototipos de vivienda
  - Características para generadores
- **MAI-004 (Compras):**
  - Órdenes de compra → Costos reales
  - Precios de proveedores
- **MAI-007 (RR.HH.):**
  - Nómina → Costos de mano de obra
- **MAI-008 (Configuración):**
  - Índices INPC/CMIC
  - Regiones/plazas

### Módulos que Alimenta (Output)
- **MAI-002 (Proyectos):**
  - Costo unitario por prototipo
- **MAI-004 (Compras):**
  - Presupuesto de materiales
  - Alertas de precios fuera de presupuesto
- **MAI-006 (Reportes):**
  - Datos financieros
  - Indicadores de rentabilidad
  - Análisis de desviaciones

---

## ✅ Criterios de Éxito

### Métricas de Adopción
- [ ] 100% de proyectos con presupuesto formal
- [ ] 90% de presupuestos usan catálogo estándar
- [ ] <5% de conceptos duplicados en catálogo

### Métricas de Eficiencia
- [ ] Reducción 80% tiempo de elaboración (-8h por presupuesto)
- [ ] Búsqueda de conceptos <200ms
- [ ] Actualización masiva de precios <5 seg para 500 conceptos

### Métricas de Calidad
- [ ] Precisión presupuesto vs real <3% de desviación
- [ ] 100% de alertas críticas con plan de acción en 48h
- [ ] Proyección EAC vs costo final <2% de error

### Métricas de Rentabilidad
- [ ] 80% de proyectos con margen ≥ target
- [ ] Incremento de margen promedio +2 puntos anuales
- [ ] ROI portafolio ≥ 12% anual

---

## 🚀 Próximos Pasos

### Opción 1: Comenzar Implementación (Recomendado)
El equipo de desarrollo puede iniciar Sprint 7 con la documentación completa. Prioridad alta debido a impacto directo en rentabilidad.

### Opción 2: Continuar Documentación
Generar épica siguiente:
- **MAI-004:** Compras e Inventarios (45 SP estimados)
- **MAI-005:** Control de Obra y Avances (50 SP estimados)

### Opción 3: Enfoque Paralelo
- Equipo A: Implementa MAI-003
- Equipo B: Documenta MAI-004

---

## 📋 Documentos Pendientes

**Ninguno - Épica 100% Completa** ✅

---

**Última Actualización:** 2025-11-17
**Responsable:** Equipo de Producto
**Estado:** ✅ LISTO PARA DESARROLLO
