# _MAP: MAE-015 - Activos, Maquinaria y Mantenimiento

**Épica:** MAE-015
**Nombre:** Activos, Maquinaria y Mantenimiento
**Fase:** 2 - Enterprise Básico
**Presupuesto:** $40,000 MXN
**Story Points:** 70 SP
**Estado:** 📝 A crear
**Sprint:** Sprint 8-9 (Semanas 15-18)
**Última actualización:** 2025-11-17
**Prioridad:** P1

---

## 📋 Propósito

Gestión completa de activos fijos, maquinaria pesada, equipo y vehículos con control de mantenimiento:
- Catálogo de activos (maquinaria pesada, equipo, vehículos)
- Control de ubicación y asignación por obra
- Mantenimiento preventivo y correctivo programado
- Órdenes de trabajo de mantenimiento
- Costeo TCO (Total Cost of Ownership)
- Localización GPS en tiempo real (IoT opcional)

**Integración clave:** Se vincula con Proyectos (MAI-002), Finanzas (MAE-014), Compras (MAI-004) y RRHH (MAI-007).

---

## 📁 Contenido

### Requerimientos Funcionales (Estimados: 6)

| ID | Título | Estado |
|----|--------|--------|
| RF-AST-001 | Catálogo de activos y registro | 📝 A crear |
| RF-AST-002 | Control de ubicación y asignación a obras | 📝 A crear |
| RF-AST-003 | Mantenimiento preventivo programado | 📝 A crear |
| RF-AST-004 | Órdenes de trabajo de mantenimiento correctivo | 📝 A crear |
| RF-AST-005 | Costeo por hora y TCO | 📝 A crear |
| RF-AST-006 | Rastreo GPS y telemetría (IoT) | 📝 A crear |

### Especificaciones Técnicas (Estimadas: 6)

| ID | Título | RF | Estado |
|----|--------|----|--------|
| ET-AST-001 | Modelo de datos de activos y deprecación | RF-AST-001 | 📝 A crear |
| ET-AST-002 | Sistema de transferencias y asignaciones | RF-AST-002 | 📝 A crear |
| ET-AST-003 | Motor de programación de mantenimientos | RF-AST-003 | 📝 A crear |
| ET-AST-004 | Sistema de órdenes de trabajo | RF-AST-004 | 📝 A crear |
| ET-AST-005 | Cálculo de TCO y costeo | RF-AST-005 | 📝 A crear |
| ET-AST-006 | Integración con dispositivos GPS/IoT | RF-AST-006 | 📝 A crear |

### Historias de Usuario (Estimadas: 14)

| ID | Título | SP | Estado |
|----|--------|----|--------|
| US-AST-001 | Registrar activo nuevo (maquinaria/vehículo) | 5 | 📝 A crear |
| US-AST-002 | Asignar activo a obra | 5 | 📝 A crear |
| US-AST-003 | Transferir activo entre obras | 5 | 📝 A crear |
| US-AST-004 | Configurar plan de mantenimiento preventivo | 5 | 📝 A crear |
| US-AST-005 | Generar orden de mantenimiento automática | 5 | 📝 A crear |
| US-AST-006 | Crear orden de trabajo correctivo | 5 | 📝 A crear |
| US-AST-007 | Ejecutar checklist de mantenimiento | 5 | 📝 A crear |
| US-AST-008 | Registrar costo de mantenimiento | 5 | 📝 A crear |
| US-AST-009 | Calcular costo por hora de uso | 5 | 📝 A crear |
| US-AST-010 | Calcular TCO de activo | 5 | 📝 A crear |
| US-AST-011 | Rastrear ubicación GPS de activo | 5 | 📝 A crear |
| US-AST-012 | Dashboard de activos y disponibilidad | 5 | 📝 A crear |
| US-AST-013 | Reporte de utilización de activos | 5 | 📝 A crear |
| US-AST-014 | Alertas de mantenimiento vencido | 5 | 📝 A crear |

**Total Story Points:** 70 SP

### Implementación

📊 **Inventarios de trazabilidad:**
- [TRACEABILITY.yml](./implementacion/TRACEABILITY.yml) - Matriz completa de trazabilidad
- [DATABASE.yml](./implementacion/DATABASE.yml) - Objetos de base de datos
- [BACKEND.yml](./implementacion/BACKEND.yml) - Módulos backend
- [FRONTEND.yml](./implementacion/FRONTEND.yml) - Componentes frontend

### Pruebas

📋 Documentación de testing:
- [TEST-PLAN.md](./pruebas/TEST-PLAN.md) - Plan de pruebas
- [TEST-CASES.md](./pruebas/TEST-CASES.md) - Casos de prueba

---

## 🔗 Referencias

- **README:** [README.md](./README.md) - Descripción detallada de la épica
- **Fase 2:** [../README.md](../README.md) - Información de la fase completa
- **Módulo relacionado MVP:** Módulo 15 - Activos y Maquinaria (MVP-APP.md)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $40,000 MXN |
| **Story Points estimados** | 70 SP |
| **Duración estimada** | 14 días |
| **Reutilización GAMILIT** | 10% (funcionalidad nueva) |
| **RF a implementar** | 6/6 |
| **ET a implementar** | 6/6 |
| **US a completar** | 14/14 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schema:** `assets`
- **Tablas principales:**
  * `assets` - Catálogo de activos
  * `asset_assignments` - Asignaciones a obras
  * `maintenance_plans` - Planes de mantenimiento
  * `maintenance_schedules` - Programación de mantenimientos
  * `work_orders` - Órdenes de trabajo
  * `maintenance_history` - Historial de mantenimientos
  * `asset_costs` - Costos de operación y mantenimiento
  * `asset_locations` - Ubicaciones GPS (histórico)
- **ENUMs:**
  * `asset_type` (heavy_machinery, light_equipment, vehicle, tool)
  * `asset_status` (active, in_maintenance, inactive, retired)
  * `maintenance_type` (preventive, corrective, predictive)
  * `work_order_status` (scheduled, in_progress, completed, cancelled)

### Backend
- **Módulo:** `assets`
- **Path:** `apps/backend/src/modules/assets/`
- **Services:** AssetService, MaintenanceService, WorkOrderService, CostingService, GPSTrackingService
- **Controllers:** AssetController, MaintenanceController, WorkOrderController
- **Middlewares:** AssetAccessGuard, MaintenanceSchedulerJob

### Frontend
- **Features:** `assets`, `maintenance`
- **Path:** `apps/frontend/src/features/assets/`
- **Componentes:**
  * AssetCatalog
  * AssetForm
  * AssetDetail
  * AssignmentManager
  * MaintenancePlanConfig
  * WorkOrderList
  * WorkOrderForm
  * MaintenanceChecklistExecutor
  * TCOCalculator
  * AssetLocationMap
  * AssetDashboard
  * UtilizationReport
- **Stores:** assetStore, maintenanceStore, workOrderStore

---

## 🚜 Tipos de Activos

| Categoría | Ejemplos | Costo típico | Vida útil | Mantenimiento |
|-----------|----------|--------------|-----------|---------------|
| **Maquinaria pesada** | Excavadoras, retroexcavadoras, grúas, revolvedoras | $500K-$2M | 10-15 años | Intensivo |
| **Equipo ligero** | Vibradores, cortadoras, compactadoras, andamios | $10K-$100K | 5-8 años | Moderado |
| **Vehículos** | Camiones, camionetas, pick-ups | $300K-$800K | 8-10 años | Regular |
| **Herramienta especializada** | Equipo topográfico, equipos eléctricos | $5K-$50K | 3-5 años | Bajo |

---

## 📋 Ficha de Activo

```yaml
asset:
  id: "AST-001"
  code: "EXC-001"
  name: "Excavadora Caterpillar 320D"
  type: "heavy_machinery"
  category: "Excavadoras"
  status: "active"

  acquisition:
    purchase_date: "2023-05-15"
    purchase_price: 1500000.00  # $1.5M MXN
    supplier: "Maquinaria del Bajío SA"
    invoice: "FAC-2023-5678"
    financing: "own"  # own, leased, rented

  specifications:
    brand: "Caterpillar"
    model: "320D"
    year: 2023
    serial_number: "CAT320D2023001234"
    engine: "Diesel C6.6"
    capacity: "20 toneladas"
    hours_rated: 10000  # Horas útiles estimadas

  accounting:
    asset_account: "1201-001"  # Cuenta contable
    depreciation_method: "straight_line"  # Línea recta
    useful_life_years: 10
    salvage_value: 300000.00  # Valor de rescate
    accumulated_depreciation: 225000.00  # $225K (18 meses)
    book_value: 1275000.00  # $1.275M

  current_assignment:
    project_id: "PROJ-001"
    location: "Fraccionamiento Los Pinos - Etapa 1"
    assigned_date: "2025-10-01"
    assigned_to_operator: "OP-045"  # Operador

  usage:
    hours_worked: 1800  # Horas acumuladas
    last_usage_date: "2025-11-17"
    avg_hours_per_month: 100

  maintenance:
    last_preventive: "2025-10-15"
    next_preventive: "2025-12-15"  # Cada 200 horas
    maintenance_plan_id: "PLAN-EXC-001"
    hours_since_maintenance: 180
```

---

## 🔧 Mantenimiento Preventivo

### Plan de Mantenimiento

**Activo:** Excavadora CAT 320D
**Código:** PLAN-EXC-001

| Actividad | Frecuencia | Última | Próxima | Responsable |
|-----------|------------|--------|---------|-------------|
| **Cambio de aceite motor** | 250 hrs | 1750 hrs | 2000 hrs | Mecánico |
| **Cambio de filtros** | 250 hrs | 1750 hrs | 2000 hrs | Mecánico |
| **Revisión de orugas** | 500 hrs | 1500 hrs | 2000 hrs | Mecánico |
| **Lubricación general** | 100 hrs | 1700 hrs | 1800 hrs | 🔴 Vencido | Operador |
| **Inspección hidráulica** | 1000 hrs | 1000 hrs | 2000 hrs | Mecánico |

**Alertas:**
- 🔴 Lubricación general vencida (1800 hrs alcanzadas)
- 🟡 Cambio de aceite próximo (faltan 20 horas)

---

### Checklist de Mantenimiento

**Orden de trabajo:** WO-2025-123
**Actividad:** Mantenimiento preventivo 2000 horas
**Activo:** EXC-001 - Excavadora CAT 320D
**Fecha:** 2025-11-20

```yaml
checklist:
  - task: "Drenar aceite de motor"
    completed: true
    technician: "Juan Pérez"
    time: "09:00"

  - task: "Reemplazar filtro de aceite"
    completed: true
    part_used: "Filtro CAT 1R-0750"
    quantity: 1

  - task: "Llenar con aceite nuevo (25 litros)"
    completed: true
    part_used: "Aceite CAT 15W-40"
    quantity: 25

  - task: "Cambiar filtro de combustible"
    completed: true
    part_used: "Filtro CAT 1R-0749"

  - task: "Cambiar filtro de aire"
    completed: true
    part_used: "Filtro CAT 6I-2503"

  - task: "Lubricación de pivotes"
    completed: true
    notes: "Aplicados 10 puntos de grasa"

  - task: "Inspección de orugas (tensión, desgaste)"
    completed: true
    notes: "Tensión OK, desgaste 40%, reemplazar en 3000 hrs"

  - task: "Revisión de mangueras hidráulicas"
    completed: true
    notes: "Todas en buen estado"

  - task: "Prueba de funcionamiento"
    completed: true
    notes: "Operación normal, sin ruidos anormales"

totals:
  hours_worked: 3.5
  parts_cost: 4500.00  # MXN
  labor_cost: 1200.00  # MXN
  total_cost: 5700.00  # MXN
```

---

## 💵 Costeo de Activos

### Costo por Hora de Uso

**Fórmula:**

```
Costo/hora = (Depreciación + Mantenimiento + Combustible + Operador + Seguro) / Horas trabajadas
```

**Ejemplo: Excavadora CAT 320D**

| Concepto | Costo anual | Horas/año | Costo/hora |
|----------|-------------|-----------|------------|
| **Depreciación** | $120,000 | 1,200 | $100.00 |
| **Mantenimiento** | $36,000 | 1,200 | $30.00 |
| **Combustible** | $60,000 | 1,200 | $50.00 |
| **Operador** | $180,000 | 1,200 | $150.00 |
| **Seguro** | $24,000 | 1,200 | $20.00 |
| **TOTAL** | **$420,000** | **1,200** | **$350.00/hr** |

**Imputación a proyecto:**

```yaml
usage_record:
  asset_id: "AST-001"
  project_id: "PROJ-001"
  date: "2025-11-17"
  hours_worked: 8
  cost_per_hour: 350.00
  total_cost: 2800.00  # 8 hrs × $350
  charged_to_account: "5104-001"  # Maquinaria y equipo
  cost_center: "Obra A - Excavación"
```

---

### TCO (Total Cost of Ownership)

**Análisis de TCO - 5 años**

**Activo:** Excavadora CAT 320D

| Año | Depreciación | Mantenimiento | Combustible | Operador | Seguro | **Total** |
|-----|--------------|---------------|-------------|----------|--------|-----------|
| 1 | $120,000 | $24,000 | $60,000 | $180,000 | $24,000 | $408,000 |
| 2 | $120,000 | $30,000 | $60,000 | $180,000 | $24,000 | $414,000 |
| 3 | $120,000 | $36,000 | $60,000 | $180,000 | $24,000 | $420,000 |
| 4 | $120,000 | $45,000 | $60,000 | $180,000 | $24,000 | $429,000 |
| 5 | $120,000 | $60,000 | $60,000 | $180,000 | $24,000 | $444,000 |
| **Total 5 años** | **$600,000** | **$195,000** | **$300,000** | **$900,000** | **$120,000** | **$2,115,000** |

**Análisis:**
- Costo inicial: $1,500,000
- TCO 5 años: $2,115,000
- **TCO total:** $3,615,000 (2.4× costo inicial)
- Horas trabajadas: 6,000 hrs
- **Costo promedio/hora:** $602.50

**Decisión:**
- ¿Comprar vs rentar? Si renta = $400/hr → Costo 5 años = $2.4M (más económico)
- ¿Mantener vs vender? Si valor de reventa año 5 = $600K → TCO neto = $3.015M

---

## 📍 Rastreo GPS y Telemetría

### Datos de Localización

```yaml
gps_tracking:
  asset_id: "AST-001"
  timestamp: "2025-11-17T14:30:00Z"
  location:
    latitude: 20.588818
    longitude: -100.389880
    address: "Fraccionamiento Los Pinos, Querétaro"
    project: "PROJ-001"
    geofence_status: "inside"  # inside, outside, near

  telemetry:
    engine_status: "running"
    rpm: 1800
    fuel_level: 75  # %
    engine_hours: 1850
    oil_pressure: 45  # PSI
    coolant_temp: 85  # °C
    battery_voltage: 24.5  # V

  alerts:
    - type: "geofence_exit"
      timestamp: "2025-11-17T08:15:00Z"
      message: "Activo salió de geofence de proyecto"
      acknowledged: true

    - type: "idle_time"
      timestamp: "2025-11-17T12:00:00Z"
      message: "Motor encendido sin uso por 30 minutos"
      acknowledged: false
```

---

### Dashboard de Activos

**Indicadores en tiempo real:**

| Activo | Ubicación | Estado | Operador | Horas hoy | Combustible | Alertas |
|--------|-----------|--------|----------|-----------|-------------|---------|
| EXC-001 | Obra A | 🟢 Operando | Juan P. | 6.5 hrs | 75% | - |
| RET-002 | Obra A | 🟢 Operando | Pedro M. | 5.0 hrs | 60% | ⚠️ Mtto próximo |
| CAM-003 | En tránsito | 🟡 Moviendo | Carlos R. | 3.0 hrs | 40% | - |
| VIB-004 | Obra B | 🔴 Parado | - | 0 hrs | N/A | 🔴 Mtto vencido |

---

## 📊 Reportes de Utilización

### Reporte Mensual - Octubre 2025

| Activo | Tipo | Hrs disponibles | Hrs trabajadas | Utilización | Costo/hora | Costo total |
|--------|------|-----------------|----------------|-------------|------------|-------------|
| EXC-001 | Excavadora | 200 | 180 | 90% | $350 | $63,000 |
| RET-002 | Retroexcavadora | 200 | 150 | 75% | $300 | $45,000 |
| GRU-003 | Grúa | 200 | 80 | 40% | $450 | $36,000 |
| CAM-004 | Camión volteo | 200 | 160 | 80% | $200 | $32,000 |
| **TOTAL** | - | **800** | **570** | **71.3%** | - | **$176,000** |

**Análisis:**
- ✅ Excavadora: Alta utilización (90%)
- ⚠️ Grúa: Baja utilización (40%) → Evaluar renta vs propiedad
- ✅ Promedio general: 71% (meta: >70%)

---

## 🚨 Puntos Críticos

1. **Mantenimiento preventivo:** No omitir para evitar fallas costosas
2. **Registro de horas:** Captura diaria para costeo preciso
3. **Asignación clara:** Siempre debe haber responsable del activo
4. **Alertas de mantenimiento:** Atender a tiempo para evitar tiempos muertos
5. **Rastreo GPS:** Prevenir robo y uso no autorizado
6. **Análisis TCO:** Decisiones de compra vs renta basadas en datos
7. **Depreciación correcta:** Impacto en estados financieros

---

## 🎯 Siguiente Paso

Crear documentación de requerimientos y especificaciones técnicas del módulo.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @maintenance-team
**Estado:** 📝 A crear
