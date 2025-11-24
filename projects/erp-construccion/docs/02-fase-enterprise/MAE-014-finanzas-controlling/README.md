# MAE-014: Finanzas y Controlling

**Módulo:** Gestión Financiera y Control de Gestión  
**Story Points:** 55 | **Prioridad:** Alta | **Fase:** 2 (Enterprise)

## Descripción General

Sistema integral para gestión financiera de proyectos de construcción, incluyendo flujo de efectivo, cuentas por cobrar/pagar, conciliación bancaria, y control de gestión con KPIs financieros.

## Alcance Funcional

### 1. Flujo de Efectivo (Cash Flow)
- Proyección de ingresos y egresos
- Flujo real vs proyectado
- Alertas de liquidez
- Escenarios what-if

### 2. Cuentas por Cobrar (CxC)
- Facturación a clientes
- Antigüedad de saldos
- Gestión de cobranza
- Conciliación de pagos

### 3. Cuentas por Pagar (CxP)
- Registro de facturas de proveedores
- Programación de pagos
- Antigüedad de saldos
- Control de vencimientos

### 4. Conciliación Bancaria
- Importación de estados de cuenta
- Match automático de movimientos
- Partidas en conciliación
- Reportes de conciliación

### 5. Control de Gestión
- Dashboard financiero ejecutivo
- KPIs por proyecto y empresa
- Análisis de rentabilidad
- Presupuesto vs real

## Componentes Técnicos

### Backend (NestJS + TypeORM)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    CashFlow, Invoice, Payment, BankStatement,
    Receivable, Payable, BankReconciliation
  ])],
  providers: [
    CashFlowService, InvoiceService, PaymentService,
    BankReconciliationService, ControllingService
  ],
  controllers: [FinanceController, ControllingController]
})
export class FinanceModule {}
```

### Base de Datos (PostgreSQL)
```sql
CREATE SCHEMA finance;

CREATE TYPE finance.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE finance.payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue');
CREATE TYPE finance.reconciliation_status AS ENUM ('pending', 'matched', 'exception');
```

## Integraciones

- **MAI-008 (Estimaciones):** Generación automática de CxC desde estimaciones
- **MAI-004 (Compras):** Registro automático de CxP desde órdenes de compra
- **MAI-012 (Contratos):** Montos contratados para proyecciones

## Métricas Clave

- **Liquidez:** Días de cobertura de efectivo
- **DSO:** Days Sales Outstanding (días de cobranza)
- **DPO:** Days Payable Outstanding (días de pago)
- **Rentabilidad:** Margen por proyecto

---
**Generado:** 2025-11-21
