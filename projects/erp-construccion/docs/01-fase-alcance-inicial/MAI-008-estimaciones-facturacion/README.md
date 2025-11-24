# MAI-008: Estimaciones y Facturación

**ID:** MAI-008  
**Fase:** 1 - Alcance Inicial  
**Presupuesto:** $25,000 MXN  
**Story Points:** 45 SP  
**Sprint:** Sprint 5-6 (Semanas 9-12)  
**Prioridad:** P1  
**Estado:** 📝 En documentación

---

## 📋 Resumen Ejecutivo

Este módulo gestiona el ciclo completo de estimaciones de obra, tanto hacia clientes (INFONAVIT, fideicomisos) como hacia subcontratistas y proveedores. Incluye control de anticipos, amortizaciones, retenciones, workflow de autorización y generación de reportes auditables.

### Problema que Resuelve

Las constructoras manejan flujos de caja complejos con:
- Múltiples estimaciones simultáneas a diferentes clientes
- Anticipos que deben amortizarse gradualmente
- Retenciones de garantía (5-10%) que impactan liquidez
- Subcontratistas esperando pagos por avances
- Documentación formal requerida por INFONAVIT y auditores

**Sin este módulo:** Cálculos en Excel propensos a errores, falta de trazabilidad, retrasos en pagos, problemas de flujo de caja.

**Con este módulo:** Automatización de cálculos, workflow controlado, trazabilidad completa, visibilidad en tiempo real del estado de pagos.

---

## 🎯 Objetivos

1. **Automatizar cálculo** de estimaciones con anticipos, retenciones y amortizaciones
2. **Vincular avances físicos** con estimaciones económicas
3. **Workflow de autorización** multinivel (residente → ingeniero → finanzas → director)
4. **Generación de reportes** en formatos oficiales (PDF/Excel) para clientes y auditorías
5. **Visibilidad completa** del estado de cobros y pagos

---

## 📊 Alcance Funcional

### Estimaciones hacia Cliente (INFONAVIT/Fideicomiso)

- Generación desde avances de obra verificados
- Cálculo automático de:
  - Monto bruto por viviendas/conceptos terminados
  - Amortización de anticipo (% configurable)
  - Retenciones (fondo de garantía, ISR, IVA)
  - Monto neto a cobrar
- Estados: Borrador → Enviada → Revisada → Autorizada → Cobrada
- Exportación a PDF/Excel con formato oficial

### Estimaciones hacia Subcontratistas/Proveedores

- Vinculación con subcontratos y avances verificados
- Cálculo de:
  - Monto por avance físico (%)
  - Amortización de anticipo
  - Retenciones (10% típico, configurable)
  - Monto neto a pagar
- Estados: Borrador → Revisada → Autorizada → Programada → Pagada
- Control de fechas de pago comprometidas

### Control de Anticipos

- Registro de anticipos recibidos/otorgados
- Amortización automática por estimación
- Saldo pendiente de amortizar
- Alertas de desviaciones

### Control de Retenciones

- Tipos: Fondo de garantía, ISR, IVA, otras
- Acumulación por proyecto/subcontrato
- Liberación al cumplir garantías
- Reportes de retenciones acumuladas

### Reportes y Dashboard

- Dashboard de estimaciones por estado
- Proyección de cobros/pagos
- Análisis de flujo de caja
- Reportes para auditorías

---

## 🏗️ Arquitectura del Módulo

### Schema de Base de Datos: `estimations`

**Tablas principales:**
- `estimations` - Cabecera de estimaciones
- `estimation_items` - Detalle de partidas/conceptos
- `estimation_payments` - Registro de pagos
- `advances` - Anticipos y amortizaciones
- `retentions` - Retenciones por tipo
- `estimation_workflow` - Historial de aprobaciones

**ENUMs:**
- `estimation_type`: to_client, to_subcontractor
- `estimation_status`: draft, submitted, reviewed, authorized, paid, rejected
- `retention_type`: performance_bond, warranty, tax, other

### Backend: NestJS

**Services:**
- `EstimationService` - CRUD de estimaciones
- `EstimationCalculator` - Lógica de cálculo compleja
- `AdvanceService` - Gestión de anticipos/amortizaciones
- `RetentionService` - Control de retenciones
- `EstimationReportService` - Generación de PDFs/Excel

**Controllers:**
- `EstimationController` - API REST principal
- `EstimationReportController` - Endpoints de reportes
- `EstimationWorkflowController` - Endpoints de workflow

### Frontend: React + TypeScript

**Componentes principales:**
- `EstimationList` - Lista de estimaciones con filtros
- `EstimationForm` - Crear/editar estimación
- `EstimationDetail` - Vista detallada con workflow
- `AdvancesManager` - Gestión de anticipos
- `RetentionsManager` - Gestión de retenciones
- `EstimationReportViewer` - Preview de reportes
- `EstimationDashboard` - Métricas y gráficos

---

## 🔄 Flujos de Trabajo

### Flujo: Estimación a Cliente (INFONAVIT)

```
1. [Residente] Registra avance físico → MAI-005 Control de Obra
2. [Ingeniero] Genera estimación desde avances acumulados
3. [Sistema] Calcula automáticamente:
   - Monto bruto: Viviendas terminadas × Precio unitario
   - Amortización anticipo: % de amortización × Saldo anticipo
   - Retención 5%: (Monto bruto - Amortización) × 5%
   - Monto neto = Monto bruto - Amortización - Retención
4. [Ingeniero] Revisa y envía a autorización
5. [Finanzas] Valida cálculos financieros
6. [Director] Autoriza estimación final
7. [Sistema] Genera PDF/Excel con formato oficial
8. [Finanzas] Envía a cliente y registra fecha estimada de cobro
9. [Sistema] Registra cobro al recibir transferencia
```

### Flujo: Estimación a Subcontratista

```
1. [Residente] Verifica avance de subcontratista en obra
2. [Subcontratista] Genera estimación o [Residente] la crea
3. [Sistema] Calcula:
   - Monto bruto: Avance % × Monto contrato
   - Amortización anticipo
   - Retención 10%
   - Monto neto
4. [Residente] Revisa y autoriza avance físico
5. [Ingeniero] Valida estimación
6. [Finanzas] Autoriza pago y programa fecha
7. [Sistema] Registra pago ejecutado
```

---

## 📐 Fórmulas de Cálculo

### Estimación hacia Cliente

```typescript
// Ejemplo: 25 viviendas terminadas a $500K c/u
const montoBruto = viviendas × precioUnitario;  // 25 × $500K = $12.5M

// Anticipo inicial: 20% del contrato = $10M
const amortizacion = (porcentajeAmortizacion / 100) × saldoAnticipo;
// 25% × $10M = $2.5M

const baseRetenciones = montoBruto - amortizacion;  // $12.5M - $2.5M = $10M
const retencion = baseRetenciones × 0.05;  // $10M × 5% = $0.5M

const montoNeto = montoBruto - amortizacion - retencion;
// $12.5M - $2.5M - $0.5M = $9.5M
```

### Estimación a Subcontratista

```typescript
// Ejemplo: Subcontrato $2M, avance 30%
const montoBruto = montoContrato × (avanceFisico / 100);
// $2M × 30% = $600K

// Anticipo: 10% del contrato = $200K
const amortizacion = (avanceFisico / 100) × anticipoTotal;
// 30% × $200K = $60K

const retencion = (montoBruto - amortizacion) × 0.10;
// ($600K - $60K) × 10% = $54K

const montoNeto = montoBruto - amortizacion - retencion;
// $600K - $60K - $54K = $486K
```

---

## 🔗 Integraciones

| Módulo | Relación | Datos Compartidos |
|--------|----------|-------------------|
| **MAI-005** Control de Obra | ➡️ Consume avances físicos | Avances de partidas, viviendas terminadas |
| **MAI-003** Presupuestos | ➡️ Lee precios unitarios | Catálogo de conceptos, precios |
| **MAI-012** Contratos | ➡️ Lee contratos y subcontratos | Montos, anticipos, condiciones |
| **MAE-014** Finanzas | ⬅️ Provee cuentas por cobrar/pagar | Estimaciones autorizadas, pagos |
| **MAI-004** Compras | ↔️ Valida ordenes vs estimaciones | Materiales entregados |

---

## 👥 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Residente** | Crear estimaciones a subcontratistas, verificar avances |
| **Ingeniero** | Crear estimaciones a clientes, revisar todas, autorizar a subcontratistas |
| **Finanzas** | Revisar todas, autorizar pagos, registrar cobros/pagos |
| **Director** | Autorizar estimaciones >$100K, ver dashboard global |
| **Subcontratista** | Ver estimaciones propias, generar borradores |

---

## 📊 Indicadores Clave (KPIs)

- **Tiempo promedio de autorización:** <48 horas
- **Precisión de cálculos:** 100% sin errores manuales
- **Estimaciones pagadas a tiempo:** >90%
- **Saldo de retenciones acumulado**
- **Flujo de caja proyectado** (próximos 30/60/90 días)
- **Antigüedad de estimaciones por cobrar**

---

## 🚨 Puntos Críticos

1. **Errores de cálculo** → Problemas de flujo de caja críticos
2. **Workflow roto** → Pagos sin autorización → fraude
3. **Falta de trazabilidad** → Rechazos de INFONAVIT en auditorías
4. **Sincronización con avances** → Estimaciones sin respaldo físico
5. **Control de retenciones** → Pérdida de liquidez si no se liberan a tiempo

---

## 📝 Documentos Relacionados

### Requerimientos Funcionales
- [RF-EST-001: Estimaciones hacia cliente](./requerimientos/RF-EST-001-estimaciones-cliente.md)
- [RF-EST-002: Estimaciones hacia subcontratistas](./requerimientos/RF-EST-002-estimaciones-subcontratistas.md)
- [RF-EST-003: Control de anticipos y retenciones](./requerimientos/RF-EST-003-anticipos-retenciones.md)
- [RF-EST-004: Generación de documentos](./requerimientos/RF-EST-004-reportes-documentos.md)
- [RF-EST-005: Workflow de autorización](./requerimientos/RF-EST-005-workflow-autorizacion.md)

### Especificaciones Técnicas
- [ET-EST-001: Modelo de datos](./especificaciones/ET-EST-001-modelo-datos.md)
- [ET-EST-002: Cálculo de montos](./especificaciones/ET-EST-002-calculo-montos.md)
- [ET-EST-003: Sistema de anticipos/retenciones](./especificaciones/ET-EST-003-anticipos-retenciones.md)
- [ET-EST-004: Generación de reportes](./especificaciones/ET-EST-004-generacion-reportes.md)
- [ET-EST-005: Workflow de estados](./especificaciones/ET-EST-005-workflow-estados.md)

### Historias de Usuario
- [US-EST-001: Crear estimación a cliente](./historias-usuario/US-EST-001-crear-estimacion-cliente.md)
- [US-EST-002: Crear estimación a subcontratista](./historias-usuario/US-EST-002-crear-estimacion-subcontratista.md)
- [US-EST-003 a US-EST-009](./historias-usuario/)

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo  
**Mantenedores:** @tech-lead @backend-team @frontend-team

