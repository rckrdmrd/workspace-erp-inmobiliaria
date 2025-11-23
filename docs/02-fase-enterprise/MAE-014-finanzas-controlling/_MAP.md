# _MAP: MAE-014 - Finanzas y Controlling de Obra

**Épica:** MAE-014
**Nombre:** Finanzas y Controlling de Obra
**Fase:** 2 - Enterprise Básico
**Presupuesto:** $45,000 MXN
**Story Points:** 80 SP
**Estado:** 📝 A crear
**Sprint:** Sprint 7-8 (Semanas 13-16)
**Última actualización:** 2025-11-17
**Prioridad:** P1

---

## 📋 Propósito

Módulo enterprise de gestión financiera integrada a nivel proyecto, elevando el sistema a competidor directo de ERPs como SAP S/4HANA Construction:
- Libro mayor integrado con proyectos y centros de costo
- Cuentas por pagar/cobrar ligadas a compras y estimaciones
- Flujo de efectivo proyectado vs real por obra
- Integración con sistemas contables externos (SAP, CONTPAQi)
- Conciliación bancaria por proyecto
- Reportes financieros (balance, PyG, cash flow)

**Integración clave:** Se vincula con todos los módulos operativos: Estimaciones (MAI-008), Compras (MAI-004), Contratos (MAI-012), Proyectos (MAI-002).

**Diferenciador:** Sistema financiero nativo vs integraciones de terceros (como Procore).

---

## 📁 Contenido

### Requerimientos Funcionales (Estimados: 6)

| ID | Título | Estado |
|----|--------|--------|
| RF-FIN-001 | Libro mayor y catálogo de cuentas contables | 📝 A crear |
| RF-FIN-002 | Cuentas por pagar ligadas a compras y contratos | 📝 A crear |
| RF-FIN-003 | Cuentas por cobrar ligadas a estimaciones | 📝 A crear |
| RF-FIN-004 | Flujo de efectivo proyectado vs real por obra | 📝 A crear |
| RF-FIN-005 | Conciliación bancaria por proyecto | 📝 A crear |
| RF-FIN-006 | Integración con ERP contable externo | 📝 A crear |

### Especificaciones Técnicas (Estimadas: 6)

| ID | Título | RF | Estado |
|----|--------|----|--------|
| ET-FIN-001 | Modelo de datos de contabilidad por proyecto | RF-FIN-001 | 📝 A crear |
| ET-FIN-002 | Sistema de cuentas por pagar y aging | RF-FIN-002 | 📝 A crear |
| ET-FIN-003 | Sistema de cuentas por cobrar y cobranza | RF-FIN-003 | 📝 A crear |
| ET-FIN-004 | Motor de proyección de cash flow | RF-FIN-004 | 📝 A crear |
| ET-FIN-005 | Conciliación automática de movimientos bancarios | RF-FIN-005 | 📝 A crear |
| ET-FIN-006 | API de integración con SAP/CONTPAQi | RF-FIN-006 | 📝 A crear |

### Historias de Usuario (Estimadas: 16)

| ID | Título | SP | Estado |
|----|--------|----|--------|
| US-FIN-001 | Configurar catálogo de cuentas contables | 5 | 📝 A crear |
| US-FIN-002 | Generar póliza contable desde compra | 5 | 📝 A crear |
| US-FIN-003 | Generar póliza contable desde estimación | 5 | 📝 A crear |
| US-FIN-004 | Registrar cuenta por pagar a proveedor | 5 | 📝 A crear |
| US-FIN-005 | Registrar pago a proveedor | 5 | 📝 A crear |
| US-FIN-006 | Consultar aging de cuentas por pagar | 5 | 📝 A crear |
| US-FIN-007 | Registrar cuenta por cobrar a cliente | 5 | 📝 A crear |
| US-FIN-008 | Registrar cobro de cliente | 5 | 📝 A crear |
| US-FIN-009 | Consultar aging de cuentas por cobrar | 5 | 📝 A crear |
| US-FIN-010 | Proyectar flujo de efectivo por obra | 5 | 📝 A crear |
| US-FIN-011 | Comparar cash flow proyectado vs real | 5 | 📝 A crear |
| US-FIN-012 | Conciliar movimientos bancarios | 5 | 📝 A crear |
| US-FIN-013 | Generar reporte de balance por proyecto | 5 | 📝 A crear |
| US-FIN-014 | Generar reporte de PyG por proyecto | 5 | 📝 A crear |
| US-FIN-015 | Exportar pólizas a SAP/CONTPAQi | 5 | 📝 A crear |
| US-FIN-016 | Dashboard financiero ejecutivo | 5 | 📝 A crear |

**Total Story Points:** 80 SP

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
- **Módulo relacionado MVP:** Módulo 14 - Finanzas y Controlling (MVP-APP.md)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $45,000 MXN |
| **Story Points estimados** | 80 SP |
| **Duración estimada** | 16 días |
| **Reutilización GAMILIT** | 5% (funcionalidad enterprise nueva) |
| **RF a implementar** | 6/6 |
| **ET a implementar** | 6/6 |
| **US a completar** | 16/16 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schema:** `finance`
- **Tablas principales:**
  * `chart_of_accounts` - Catálogo de cuentas contables
  * `accounting_entries` - Pólizas contables
  * `accounting_entry_lines` - Detalle de pólizas (debe/haber)
  * `accounts_payable` - Cuentas por pagar
  * `ap_payments` - Pagos a proveedores
  * `accounts_receivable` - Cuentas por cobrar
  * `ar_payments` - Cobros de clientes
  * `cash_flow_projections` - Proyecciones de flujo
  * `bank_accounts` - Cuentas bancarias
  * `bank_movements` - Movimientos bancarios
  * `bank_reconciliation` - Conciliación bancaria
  * `cost_centers` - Centros de costo (hereda de admin)
- **ENUMs:**
  * `account_type` (asset, liability, equity, income, expense)
  * `account_nature` (debit, credit)
  * `entry_type` (purchase, sale, payment, collection, adjustment)
  * `payment_status` (pending, paid, partial, overdue, cancelled)
  * `payment_method` (cash, check, transfer, card)

### Backend
- **Módulo:** `finance`
- **Path:** `apps/backend/src/modules/finance/`
- **Services:**
  * AccountingService
  * APService (Accounts Payable)
  * ARService (Accounts Receivable)
  * CashFlowService
  * BankReconciliationService
  * FinancialReportsService
  * ERPIntegrationService
- **Controllers:**
  * AccountingController
  * APController
  * ARController
  * CashFlowController
  * ReportsController
- **Middlewares:** FinancialAccessGuard, AccountingPeriodGuard

### Frontend
- **Features:** `finance`, `accounting`, `cash-flow`, `reports`
- **Path:** `apps/frontend/src/features/finance/`
- **Componentes:**
  * ChartOfAccountsManager
  * AccountingEntryForm
  * AccountingEntryList
  * APDashboard
  * APPaymentForm
  * APAgingReport
  * ARDashboard
  * ARCollectionForm
  * ARAgingReport
  * CashFlowProjection
  * CashFlowComparison
  * BankReconciliationTool
  * FinancialDashboard
  * BalanceSheetReport
  * PnLReport
  * CostCenterAnalysis
- **Stores:** financeStore, accountingStore, cashFlowStore

---

## 💰 Catálogo de Cuentas Contables

### Estructura de Cuenta Contable

```yaml
account:
  code: "5101-001-01"  # Código jerárquico
  name: "Materiales de construcción - Cemento"
  type: "expense"  # Tipo: activo, pasivo, capital, ingreso, gasto
  nature: "debit"  # Naturaleza: debe o haber
  level: 3  # Nivel jerárquico (1=mayor, 2=submay or, 3=detalle)
  parent_code: "5101-001"  # Cuenta padre
  cost_center_required: true  # Requiere imputación a centro de costo
  project_required: true  # Requiere asignación a proyecto
  status: "active"
  sap_code: "410010001"  # Código equivalente en SAP (si aplica)
  contpaqi_code: "510-001-001"  # Código en CONTPAQi
```

### Catálogo Típico para Construcción

```
ACTIVOS (1000)
├── ACTIVO CIRCULANTE (1100)
│   ├── Bancos (1101)
│   │   ├── Banco BBVA Cuenta General (1101-001)
│   │   ├── Banco BBVA Obra A (1101-002)
│   │   └── Banco Santander Nómina (1101-003)
│   ├── Cuentas por Cobrar (1102)
│   │   ├── Clientes (1102-001)
│   │   ├── Estimaciones por Cobrar (1102-002)
│   │   └── Anticipos Otorgados (1102-003)
│   └── Inventarios (1103)
│       ├── Materiales en Almacén (1103-001)
│       └── Obra en Proceso (1103-002)
├── ACTIVO FIJO (1200)
│   ├── Maquinaria y Equipo (1201)
│   ├── Vehículos (1202)
│   └── Equipo de Oficina (1203)

PASIVOS (2000)
├── PASIVO A CORTO PLAZO (2100)
│   ├── Proveedores (2101)
│   ├── Acreedores Diversos (2102)
│   ├── Retenciones por Pagar (2103)
│   │   ├── Retenciones IMSS (2103-001)
│   │   ├── Retenciones INFONAVIT (2103-002)
│   │   └── Retenciones ISR (2103-003)
│   └── Estimaciones por Pagar (2104)

CAPITAL (3000)
├── Capital Social (3101)
├── Utilidades Retenidas (3102)
└── Utilidad del Ejercicio (3103)

INGRESOS (4000)
├── Ingresos por Obra (4101)
│   ├── Venta de Vivienda (4101-001)
│   ├── Obra por Administración (4101-002)
│   └── Obra Extraordinaria (4101-003)

GASTOS (5000)
├── COSTO DE VENTAS (5100)
│   ├── Materiales (5101)
│   │   ├── Cemento (5101-001)
│   │   ├── Acero (5101-002)
│   │   ├── Block (5101-003)
│   │   └── Arena y Grava (5101-004)
│   ├── Mano de Obra Directa (5102)
│   ├── Subcontratos (5103)
│   └── Maquinaria y Equipo (5104)
├── GASTOS DE OPERACIÓN (5200)
│   ├── Sueldos Administrativos (5201)
│   ├── Renta de Oficinas (5202)
│   └── Servicios (5203)
└── GASTOS FINANCIEROS (5300)
    └── Intereses Bancarios (5301)
```

---

## 📒 Pólizas Contables

### Tipos de Pólizas

| Tipo | Fuente | Generación | Ejemplo |
|------|--------|------------|---------|
| **Ingresos** | Estimaciones cobradas | Automática | Cobro de estimación a INFONAVIT |
| **Egresos** | Pagos a proveedores | Automática | Pago de factura de cemento |
| **Diario** | Ajustes, depreciación | Manual | Depreciación mensual de maquinaria |
| **Traspaso** | Reclasificaciones | Manual | Reclasificación de anticipos |

---

### Ejemplo de Póliza: Compra de Materiales

**Transacción:** Compra de 100 toneladas de cemento por $150,000 + IVA

```yaml
accounting_entry:
  id: "POL-2025-001234"
  type: "purchase"
  date: "2025-11-17"
  description: "Compra cemento Portland - Proveedor Cementos Mexicanos"
  reference: "Factura A-12345"
  source_module: "purchases"
  source_id: "PO-2025-456"  # Orden de compra
  project_id: "PROJ-001"
  cost_center: "Obra A - Etapa 1"
  created_by: "Sistema"
  approved_by: "Dir. Finanzas"
  status: "posted"

  lines:
    - line_number: 1
      account_code: "5101-001"  # Materiales - Cemento
      description: "100 ton cemento Portland"
      debit: 150000.00
      credit: 0.00
      cost_center: "Obra A - Etapa 1"
      project_id: "PROJ-001"

    - line_number: 2
      account_code: "1105-001"  # IVA Acreditable
      description: "IVA 16%"
      debit: 24000.00
      credit: 0.00
      cost_center: null
      project_id: null

    - line_number: 3
      account_code: "2101-001"  # Proveedores
      description: "Cementos Mexicanos SA"
      debit: 0.00
      credit: 174000.00
      cost_center: null
      project_id: null

  totals:
    total_debit: 174000.00
    total_credit: 174000.00
    balanced: true
```

---

### Ejemplo de Póliza: Estimación Cobrada

**Transacción:** Cobro de estimación #3 a INFONAVIT por $5,000,000

```yaml
accounting_entry:
  id: "POL-2025-001235"
  type: "collection"
  date: "2025-11-17"
  description: "Cobro estimación #3 - INFONAVIT Fraccionamiento Los Pinos"
  reference: "Transferencia 789456"
  source_module: "estimations"
  source_id: "EST-2025-003"
  project_id: "PROJ-001"
  status: "posted"

  lines:
    - line_number: 1
      account_code: "1101-002"  # Banco BBVA Obra A
      description: "Transferencia INFONAVIT"
      debit: 5000000.00
      credit: 0.00

    - line_number: 2
      account_code: "1102-002"  # Estimaciones por Cobrar
      description: "Aplicación estimación #3"
      debit: 0.00
      credit: 5000000.00
      project_id: "PROJ-001"

  totals:
    total_debit: 5000000.00
    total_credit: 5000000.00
    balanced: true
```

---

## 📥 Cuentas por Pagar (AP)

### Aging de Cuentas por Pagar

| Proveedor | Factura | Fecha | Monto | Vencimiento | Días | Estado | Proyecto |
|-----------|---------|-------|-------|-------------|------|--------|----------|
| Cementos MX | A-12345 | 2025-10-15 | $174,000 | 2025-11-14 | **3 días vencida** | 🔴 Vencida | Obra A |
| Aceros del Norte | B-567 | 2025-11-01 | $350,000 | 2025-12-01 | 14 días | 🟢 Vigente | Obra A |
| Instalaciones SA | C-890 | 2025-11-10 | $125,000 | 2025-12-10 | 23 días | 🟢 Vigente | Obra B |
| Subcontratista XYZ | S-123 | 2025-10-01 | $500,000 | 2025-10-31 | **17 días vencida** | 🔴 Vencida | Obra A |

**Resumen:**
- Total por pagar: $1,149,000
- Vencidas: $674,000 (59%)
- Por vencer 0-30 días: $475,000 (41%)

---

### Flujo de Cuenta por Pagar

1. **Origen:** Orden de compra aprobada
2. **Recepción:** Entrada de mercancía al almacén
3. **Factura:** Proveedor envía factura
4. **Validación:** Se valida factura vs OC y recepción (3-way match)
5. **Registro:** Se crea cuenta por pagar
6. **Aprobación:** Finanzas aprueba para pago
7. **Programación:** Se programa pago según fecha de vencimiento
8. **Pago:** Se ejecuta pago (transferencia/cheque)
9. **Conciliación:** Se concilia pago con estado de cuenta bancario

---

## 📤 Cuentas por Cobrar (AR)

### Aging de Cuentas por Cobrar

| Cliente | Estimación | Fecha | Monto | Vencimiento | Días | Estado | Proyecto |
|---------|------------|-------|-------|-------------|------|--------|----------|
| INFONAVIT | EST-003 | 2025-10-01 | $5,000,000 | 2025-10-31 | **17 días vencida** | 🔴 Vencida | Obra A |
| Fideicomiso XYZ | EST-002 | 2025-11-10 | $2,500,000 | 2025-12-10 | 23 días | 🟢 Vigente | Obra B |
| Desarrollador ABC | EST-001 | 2025-11-15 | $1,000,000 | 2025-12-15 | 28 días | 🟢 Vigente | Obra C |

**Resumen:**
- Total por cobrar: $8,500,000
- Vencidas: $5,000,000 (59%)
- Por vencer 0-30 días: $3,500,000 (41%)

**Acciones:**
- 🔴 Seguimiento urgente con INFONAVIT (17 días vencida)
- 📞 Llamada a contacto de cobranza
- 📧 Email de recordatorio formal

---

## 💵 Flujo de Efectivo (Cash Flow)

### Proyección de Cash Flow

**Proyecto: Fraccionamiento Los Pinos**
**Periodo: Noviembre 2025**

#### Ingresos Proyectados

| Concepto | Semana 1 | Semana 2 | Semana 3 | Semana 4 | Total mes |
|----------|----------|----------|----------|----------|-----------|
| Cobro estimación #3 | $5,000,000 | - | - | - | $5,000,000 |
| Cobro estimación #4 | - | - | $4,500,000 | - | $4,500,000 |
| Venta de viviendas | $500,000 | $750,000 | $500,000 | $1,000,000 | $2,750,000 |
| **Total ingresos** | **$5,500,000** | **$750,000** | **$5,000,000** | **$1,000,000** | **$12,250,000** |

#### Egresos Proyectados

| Concepto | Semana 1 | Semana 2 | Semana 3 | Semana 4 | Total mes |
|----------|----------|----------|----------|----------|-----------|
| Pago a proveedores | $1,500,000 | $1,200,000 | $1,500,000 | $1,000,000 | $5,200,000 |
| Pago a subcontratistas | $800,000 | $600,000 | $900,000 | $500,000 | $2,800,000 |
| Nómina | - | $400,000 | - | $400,000 | $800,000 |
| IMSS/INFONAVIT | $150,000 | - | - | $150,000 | $300,000 |
| Gastos operativos | $100,000 | $100,000 | $100,000 | $100,000 | $400,000 |
| **Total egresos** | **$2,550,000** | **$2,300,000** | **$2,500,000** | **$2,150,000** | **$9,500,000** |

#### Saldo de Efectivo

| Concepto | Semana 1 | Semana 2 | Semana 3 | Semana 4 |
|----------|----------|----------|----------|----------|
| Saldo inicial | $2,000,000 | $4,950,000 | $3,400,000 | $5,900,000 |
| (+) Ingresos | $5,500,000 | $750,000 | $5,000,000 | $1,000,000 |
| (-) Egresos | ($2,550,000) | ($2,300,000) | ($2,500,000) | ($2,150,000) |
| **Saldo final** | **$4,950,000** | **$3,400,000** | **$5,900,000** | **$4,750,000** |

**Análisis:**
- ✅ Liquidez positiva durante todo el mes
- ⚠️ Semana 2 con menor saldo ($3.4M), monitorear
- ✅ Capacidad para cubrir compromisos

---

### Comparación Proyectado vs Real

**Análisis de Varianza - Octubre 2025**

| Concepto | Proyectado | Real | Varianza | % Var |
|----------|------------|------|----------|-------|
| **Ingresos totales** | $10,000,000 | $9,500,000 | -$500,000 | -5% |
| - Estimaciones | $8,000,000 | $7,500,000 | -$500,000 | -6.25% |
| - Ventas | $2,000,000 | $2,000,000 | $0 | 0% |
| **Egresos totales** | $8,500,000 | $9,000,000 | $500,000 | 5.88% |
| - Materiales | $4,000,000 | $4,500,000 | $500,000 | 12.5% |
| - Mano de obra | $2,500,000 | $2,400,000 | -$100,000 | -4% |
| - Subcontratos | $2,000,000 | $2,100,000 | $100,000 | 5% |
| **Flujo neto** | **$1,500,000** | **$500,000** | **-$1,000,000** | **-66.7%** |

**Causas de varianza:**
- 🔴 Estimación #3 retrasada por INFONAVIT (impacto -$500K)
- 🔴 Sobrecosto en materiales por incremento de precios (+12.5%)
- 🟢 Ahorro en mano de obra directa (-4%)

**Acciones:**
- Seguimiento urgente de estimación #3
- Revisión de precios con proveedores
- Ajuste de proyección para noviembre

---

## 🏦 Conciliación Bancaria

### Proceso de Conciliación

1. **Importación:** Descarga de estado de cuenta bancario (archivo .xlsx o API)
2. **Matching automático:** Sistema vincula movimientos con registros contables
3. **Partidas en conciliación:** Se identifican diferencias
4. **Ajustes:** Se registran ajustes necesarios (comisiones, intereses, errores)
5. **Validación:** Se confirma saldo conciliado = saldo en bancos

---

### Ejemplo de Conciliación

**Banco:** BBVA Obra A
**Periodo:** Octubre 2025
**Fecha de corte:** 2025-10-31

| Concepto | Monto |
|----------|-------|
| **Saldo según bancos** | $4,850,000 |
| (-) Cheques en tránsito | -$50,000 |
| (+) Depósitos en tránsito | +$200,000 |
| (-) Comisiones bancarias no registradas | -$5,000 |
| (+) Intereses ganados no registrados | +$1,000 |
| **Saldo según libros** | **$4,996,000** |

**Estado:** ✅ Conciliado

**Ajustes a registrar:**
- Comisión bancaria: $5,000 (cuenta 5301 - Gastos Financieros)
- Intereses ganados: $1,000 (cuenta 4201 - Productos Financieros)

---

## 📊 Reportes Financieros

### 1. Balance General por Proyecto

**Proyecto:** Fraccionamiento Los Pinos
**Fecha:** 30 de Noviembre 2025

```
ACTIVO
  Circulante
    Bancos                                    $4,750,000
    Estimaciones por cobrar                   $3,500,000
    Inventarios                               $2,000,000
  Total Activo Circulante                     $10,250,000

  Fijo
    Maquinaria y equipo (asignado)            $5,000,000
    Depreciación acumulada                   -$1,000,000
  Total Activo Fijo                           $4,000,000

TOTAL ACTIVO                                  $14,250,000

PASIVO
  Corto Plazo
    Proveedores                               $2,500,000
    Estimaciones por pagar                    $1,500,000
    Retenciones                                 $300,000
  Total Pasivo Corto Plazo                    $4,300,000

TOTAL PASIVO                                  $4,300,000

CAPITAL
  Inversión del proyecto                      $8,000,000
  Utilidad acumulada                          $1,950,000
TOTAL CAPITAL                                 $9,950,000

TOTAL PASIVO + CAPITAL                        $14,250,000
```

---

### 2. Estado de Resultados por Proyecto

**Proyecto:** Fraccionamiento Los Pinos
**Periodo:** Enero - Noviembre 2025

```
INGRESOS
  Venta de viviendas                          $50,000,000
  Obra por administración                      $5,000,000
TOTAL INGRESOS                                $55,000,000

COSTO DE VENTAS
  Materiales                                  $20,000,000
  Mano de obra directa                        $12,000,000
  Subcontratos                                 $8,000,000
  Maquinaria y equipo                          $2,000,000
TOTAL COSTO DE VENTAS                         $42,000,000

UTILIDAD BRUTA                                $13,000,000
Margen bruto                                      23.6%

GASTOS DE OPERACIÓN
  Sueldos administrativos                      $3,000,000
  Gastos generales                             $1,500,000
TOTAL GASTOS DE OPERACIÓN                      $4,500,000

UTILIDAD DE OPERACIÓN                          $8,500,000

GASTOS FINANCIEROS
  Intereses bancarios                            $500,000

UTILIDAD ANTES DE IMPUESTOS                    $8,000,000

IMPUESTOS (30%)                                $2,400,000

UTILIDAD NETA                                  $5,600,000
Margen neto                                       10.2%
```

---

### 3. Dashboard Financiero Ejecutivo

**KPIs Principales:**

| Métrica | Valor | Meta | Estado |
|---------|-------|------|--------|
| **Margen bruto** | 23.6% | ≥25% | 🟡 Cerca de meta |
| **Margen neto** | 10.2% | ≥12% | 🟡 Cerca de meta |
| **Liquidez** | $4.75M | ≥$3M | 🟢 Saludable |
| **Cuentas por cobrar vencidas** | 59% | ≤20% | 🔴 Alto riesgo |
| **Cuentas por pagar vencidas** | 59% | ≤10% | 🔴 Alto riesgo |
| **Cash flow proyectado (30 días)** | +$2.75M | Positivo | 🟢 OK |

**Alertas:**
- 🔴 Seguimiento urgente de cobranza (59% vencidas)
- 🔴 Negociar prórroga con proveedores vencidos
- 🟡 Mejorar margen bruto (optimizar compras)

---

## 🔌 Integración con ERP Externo

### Tipos de Integración

| Sistema | Método | Dirección | Datos |
|---------|--------|-----------|-------|
| **SAP S/4HANA** | API REST | Bidireccional | Pólizas, cuentas, saldos |
| **CONTPAQi** | XML/TXT | Exportación | Pólizas, catálogo |
| **ASPEL COI** | Archivo | Exportación | Pólizas |
| **QuickBooks** | API | Bidireccional | Facturas, pagos |

---

### Exportación de Pólizas a CONTPAQi

**Formato:** XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Poliza>
  <Tipo>Eg</Tipo>  <!-- Egreso -->
  <Numero>1234</Numero>
  <Fecha>2025-11-17</Fecha>
  <Concepto>Compra cemento Portland</Concepto>
  <Movimientos>
    <Movimiento>
      <Cuenta>5101-001</Cuenta>
      <Descripcion>100 ton cemento</Descripcion>
      <Debe>150000.00</Debe>
      <Haber>0.00</Haber>
      <CentroCostos>Obra A</CentroCostos>
    </Movimiento>
    <Movimiento>
      <Cuenta>1105-001</Cuenta>
      <Descripcion>IVA Acreditable</Descripcion>
      <Debe>24000.00</Debe>
      <Haber>0.00</Haber>
    </Movimiento>
    <Movimiento>
      <Cuenta>2101-001</Cuenta>
      <Descripcion>Cementos Mexicanos</Descripcion>
      <Debe>0.00</Debe>
      <Haber>174000.00</Haber>
    </Movimiento>
  </Movimientos>
</Poliza>
```

---

## 🚨 Puntos Críticos

1. **Balances cuadrados:** Toda póliza debe estar balanceada (debe = haber)
2. **Centros de costo:** Imputación obligatoria a proyecto/obra
3. **Conciliación bancaria mensual:** No acumular meses sin conciliar
4. **Aging de cuentas:** Monitoreo semanal para evitar atrasos
5. **Cash flow:** Proyección actualizada semanalmente
6. **Integración ERP:** Evitar doble captura, sincronización diaria
7. **Cierre mensual:** Proceso formal de cierre contable

---

## 🎯 Siguiente Paso

Crear documentación de requerimientos y especificaciones técnicas del módulo.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @finance-team
**Estado:** 📝 A crear
