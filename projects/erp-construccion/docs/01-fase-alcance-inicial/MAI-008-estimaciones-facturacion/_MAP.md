# _MAP: MAI-008 - Estimaciones y Facturación

**Épica:** MAI-008
**Nombre:** Estimaciones y Facturación
**Fase:** 1 - Alcance Inicial
**Presupuesto:** $25,000 MXN
**Story Points:** 45 SP
**Estado:** 📝 A crear
**Sprint:** Sprint 5-6 (Semanas 9-12)
**Última actualización:** 2025-11-17
**Prioridad:** P1

---

## 📋 Propósito

Gestión completa de estimaciones de obra hacia clientes (INFONAVIT/fideicomiso) y hacia subcontratistas/proveedores:
- Estimaciones de obra ejecutada (volúmenes, importes)
- Control de anticipos, amortizaciones y retenciones
- Estimaciones a subcontratistas vinculadas a avances
- Generación de reportes y documentos para revisión/firma
- Control de estatus y pagos

**Integración clave:** Se vincula estrechamente con Control de Obra (MAI-005), Presupuestos (MAI-003), Contratos (MAI-012) y Finanzas (MAE-014).

---

## 📁 Contenido

### Requerimientos Funcionales (Estimados: 5)

| ID | Título | Estado |
|----|--------|--------|
| RF-EST-001 | Estimaciones hacia cliente (INFONAVIT/fideicomiso) | 📝 A crear |
| RF-EST-002 | Estimaciones hacia subcontratistas y proveedores | 📝 A crear |
| RF-EST-003 | Control de anticipos, amortizaciones y retenciones | 📝 A crear |
| RF-EST-004 | Generación de documentos y exportables (PDF/Excel) | 📝 A crear |
| RF-EST-005 | Workflow de autorización y estatus de estimaciones | 📝 A crear |

### Especificaciones Técnicas (Estimadas: 5)

| ID | Título | RF | Estado |
|----|--------|----|--------|
| ET-EST-001 | Modelo de datos de estimaciones | RF-EST-001 | 📝 A crear |
| ET-EST-002 | Cálculo de volúmenes y montos | RF-EST-001, RF-EST-002 | 📝 A crear |
| ET-EST-003 | Sistema de anticipos y retenciones | RF-EST-003 | 📝 A crear |
| ET-EST-004 | Generación de reportes PDF/Excel | RF-EST-004 | 📝 A crear |
| ET-EST-005 | Workflow de estados (borrador → autorizada → pagada) | RF-EST-005 | 📝 A crear |

### Historias de Usuario (Estimadas: 9)

| ID | Título | SP | Estado |
|----|--------|----|--------|
| US-EST-001 | Crear estimación hacia cliente desde avances | 5 | 📝 A crear |
| US-EST-002 | Crear estimación a subcontratista | 5 | 📝 A crear |
| US-EST-003 | Aplicar anticipos y amortizaciones | 5 | 📝 A crear |
| US-EST-004 | Aplicar retenciones y garantías | 3 | 📝 A crear |
| US-EST-005 | Generar reporte de estimación en PDF | 5 | 📝 A crear |
| US-EST-006 | Exportar estimación a Excel | 3 | 📝 A crear |
| US-EST-007 | Workflow de autorización de estimación | 5 | 📝 A crear |
| US-EST-008 | Registrar pago de estimación | 5 | 📝 A crear |
| US-EST-009 | Dashboard de estimaciones y pagos | 5 | 📝 A crear |

**Total Story Points:** 45 SP

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
- **Fase 1:** [../README.md](../README.md) - Información de la fase completa
- **Módulo relacionado MVP:** Módulo 7 - Estimaciones y Facturación (MVP-APP.md)

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Presupuesto estimado** | $25,000 MXN |
| **Story Points estimados** | 45 SP |
| **Duración estimada** | 9 días |
| **Reutilización GAMILIT** | 5% (funcionalidad nueva) |
| **RF a implementar** | 5/5 |
| **ET a implementar** | 5/5 |
| **US a completar** | 9/9 |

---

## 🎯 Módulos Afectados

### Base de Datos
- **Schema:** `estimations`
- **Tablas principales:**
  * `estimations` - Estimaciones (hacia cliente y hacia subcontratistas)
  * `estimation_items` - Detalle de partidas por estimación
  * `estimation_payments` - Pagos de estimaciones
  * `retentions` - Retenciones por estimación
  * `advances` - Anticipos y amortizaciones
- **ENUMs:**
  * `estimation_type` (to_client, to_subcontractor)
  * `estimation_status` (draft, submitted, reviewed, authorized, paid, rejected)
  * `retention_type` (performance_bond, warranty, tax, other)

### Backend
- **Módulo:** `estimations`
- **Path:** `apps/backend/src/modules/estimations/`
- **Services:** EstimationService, EstimationCalculator, RetentionService, AdvanceService
- **Controllers:** EstimationController, EstimationReportController
- **Middlewares:** EstimationAuthGuard, ProjectAccessGuard

### Frontend
- **Features:** `estimations`, `estimation-reports`
- **Path:** `apps/frontend/src/features/estimations/`
- **Componentes:**
  * EstimationList
  * EstimationForm (create/edit)
  * EstimationDetail
  * AdvancesManager
  * RetentionsManager
  * EstimationWorkflow
  * EstimationReportViewer
  * EstimationDashboard
- **Stores:** estimationStore, advanceStore, retentionStore

---

## 🔄 Flujo de Trabajo de Estimaciones

### Hacia Cliente (INFONAVIT/Fideicomiso)

1. **Captura de avances** → Control de Obra registra avances físicos
2. **Generación de estimación** → Se crea borrador desde avances acumulados
3. **Revisión interna** → Ingeniero revisa volúmenes y montos
4. **Aplicación de retenciones** → Se aplican retenciones (5%, fondo de garantía, etc.)
5. **Amortización de anticipos** → Se amortiza anticipo si aplica
6. **Autorización** → Director/Finanzas autoriza
7. **Envío a cliente** → Se genera PDF/Excel y se envía
8. **Pago** → Se registra pago recibido

### Hacia Subcontratista/Proveedor

1. **Avance de subcontrato** → Residente verifica avance en campo
2. **Generación de estimación** → Subcontratista genera o se crea desde avances
3. **Revisión** → Residente/Ingeniero verifica volúmenes
4. **Retenciones** → Se aplica retención (10% típico)
5. **Autorización** → Finanzas autoriza pago
6. **Programación de pago** → Se agenda pago según calendario
7. **Pago** → Se ejecuta pago

---

## 💡 Casos de Uso Clave

### Estimación a INFONAVIT

**Contexto:** Constructora con contrato de 100 viviendas a $500K c/u = $50M
- **Anticipo:** 20% = $10M (recibido al inicio)
- **Amortización:** 25% por estimación
- **Retención:** 5% fondo de garantía

**Flujo:**
1. Se completan 25 viviendas (25% avance)
2. Monto bruto estimación: 25 × $500K = $12.5M
3. **Menos** amortización anticipo (25% × $10M): -$2.5M
4. **Menos** retención 5%: -$0.625M
5. **Pago neto:** $9.375M

### Estimación a Subcontratista de Plomería

**Contexto:** Subcontrato de plomería por $2M en 100 viviendas
- **Anticipo:** 10% = $200K (ya pagado)
- **Retención:** 10%

**Flujo:**
1. Subcontratista completa 30 viviendas (30% avance)
2. Monto bruto: 30% × $2M = $600K
3. **Menos** amortización anticipo (30% × $200K): -$60K
4. **Menos** retención 10%: -$60K
5. **Pago neto:** $480K

---

## 🚨 Puntos Críticos

1. **Cálculo preciso:** Errores en cálculo de amortizaciones/retenciones → problemas de flujo de caja
2. **Trazabilidad:** Cada estimación debe estar respaldada por avances verificados
3. **Workflow estricto:** No se puede pagar sin autorización
4. **Integración con finanzas:** Módulo MAE-014 consumirá estos datos para cuentas por cobrar/pagar
5. **Reportes auditables:** INFONAVIT y auditores piden trazabilidad completa

---

## 🎯 Siguiente Paso

Crear documentación de requerimientos y especificaciones técnicas del módulo.

---

**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @database-team
**Estado:** 📝 A crear
