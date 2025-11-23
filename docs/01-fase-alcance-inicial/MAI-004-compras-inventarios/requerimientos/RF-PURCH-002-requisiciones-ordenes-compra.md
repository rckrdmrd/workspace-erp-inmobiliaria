# RF-PURCH-002: Requisiciones y Órdenes de Compra

**Épica:** MAI-004 - Compras e Inventarios
**Versión:** 1.0
**Fecha:** 2025-11-17

---

## 1. Descripción General

Sistema de requisiciones desde obra y generación automatizada de órdenes de compra con flujos de aprobación, vinculación a presupuesto, control de entregas parciales y registro de facturas.

---

## 2. Objetivos de Negocio

- **Trazabilidad:** Cada compra vinculada a proyecto, partida presupuestal y requisición
- **Control:** Flujos de aprobación según montos
- **Eficiencia:** Generación automática de OC desde cotizaciones
- **Transparencia:** Historial completo de autorizaciones

---

## 3. Alcance Funcional

### 3.1 Requisiciones desde Obra

**Formulario:**
```
┌──────────────────────────────────────────────┐
│ NUEVA REQUISICIÓN                            │
├──────────────────────────────────────────────┤
│ Proyecto: [Fracc. Los Pinos ▼]              │
│ Solicitante: Ing. Pedro Ramírez (Residente)  │
│ Fecha necesaria: [25/Nov/2025]              │
│ Urgencia: [●] Normal  [ ] Urgente           │
│                                              │
│ Materiales:                [+ Agregar]       │
│ ┌────────────────┬────────┬──────┬─────────┐│
│ │ Material       │ Cant.  │ Unid │ Presup. ││
│ ├────────────────┼────────┼──────┼─────────┤│
│ │ Cemento CPC 30R│ 120    │ ton  │ $516K   ││
│ │ Grava 3/4"     │ 85     │ m³   │ $32.3K  ││
│ └────────────────┴────────┴──────┴─────────┘│
│                                              │
│ Justificación: *                             │
│ [Cimentación etapa 2 según programa]        │
│                                              │
│           [Guardar Borrador]  [Enviar]       │
└──────────────────────────────────────────────┘
```

**Validaciones:**
- Material existe en presupuesto del proyecto
- Cantidad no excede pendiente por ejercer
- Fecha necesaria >= hoy + lead time proveedor

### 3.2 Flujos de Aprobación

**Matriz de Autorización:**
| Monto | Aprobador 1 | Aprobador 2 | Aprobador 3 |
|-------|-------------|-------------|-------------|
| <$50K | Residente | - | - |
| $50K-$200K | Residente | Gerente Compras | - |
| $200K-$500K | Residente | Gerente Compras | Director Proyectos |
| >$500K | Residente | Gerente Compras | Dirección General |

**Estados de Requisición:**
```
draft → pending_approval → approved → quoted → ordered → received
          ↓
        rejected (con motivo)
```

### 3.3 Órdenes de Compra

**Generación Automática:**
- Desde cotización aprobada
- Datos pre-llenados: proveedor, materiales, precios, condiciones
- Numeración secuencial: OC-2025-00145

**Estructura de OC:**
```
╔═══════════════════════════════════════════════════════╗
║ ORDEN DE COMPRA #OC-2025-00145                        ║
╠═══════════════════════════════════════════════════════╣
║ Fecha: 15/Nov/2025             Folio: OC-2025-00145   ║
║ Proveedor: Cemex México S.A.                          ║
║ RFC: CEM850101ABC                                     ║
║ Contacto: Juan Pérez - 81-8888-1234                   ║
║                                                       ║
║ Proyecto: Fraccionamiento Los Pinos                   ║
║ Lugar entrega: Av. Los Pinos #100, Monterrey, N.L.   ║
║ Fecha entrega requerida: 25/Nov/2025                  ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║ Partida │ Descripción        │ Cant │ U │ PU   │ Total║
╠═════════╪════════════════════╪══════╪═══╪══════╪══════╣
║ 1       │ Cemento CPC 30R    │ 120  │ton│$4,350│$522K ║
║ 2       │ Grava 3/4"         │ 85   │m³ │$380  │$32.3K║
║ 3       │ Arena              │ 100  │m³ │$295  │$29.5K║
╠═════════╧════════════════════╧══════╧═══╧══════╧══════╣
║ Subtotal:                                    $583,800  ║
║ IVA (16%):                                   $93,408   ║
║ TOTAL:                                       $677,208  ║
╠═══════════════════════════════════════════════════════╣
║ Condiciones:                                          ║
║ • Forma de pago: 30 días fecha factura                ║
║ • Entrega: LAB (libre a bordo) en obra                ║
║ • Descuento pronto pago: 2% a 10 días                 ║
║ • Garantía: 30 días                                   ║
║                                                       ║
║ Autorizado por: Gerente de Compras                    ║
║ Firma: _______________________                        ║
╚═══════════════════════════════════════════════════════╝
```

### 3.4 Recepción de Material

**Proceso:**
1. Proveedor entrega material
2. Almacenista registra entrada
3. Vincula a OC
4. Puede ser parcial o completa

**Ejemplo Recepción Parcial:**
```
OC-2025-00145: Cemento CPC 30R
Ordenado: 120 ton
Recibido: 80 ton (66.7%)
Pendiente: 40 ton

Status: Parcialmente recibida
Próxima entrega: 22/Nov/2025
```

### 3.5 Registro de Facturas

**Vinculación OC → Factura:**
```
Factura: A-12345
Proveedor: Cemex
Fecha: 20/Nov/2025
UUID: 1234-5678-90AB-CDEF

Vinculada a:
  OC-2025-00145: $677,208
  Recibido: 80 ton (entrega parcial)
  Monto factura: $451,472 (80/120 de $677K)

Status pago:
  Fecha vencimiento: 20/Dic/2025 (30 días)
  Descuento PP (2%): Disponible hasta 30/Nov
  Status: Pendiente
```

---

## 4. Casos de Uso Principales

### CU-001: Crear Requisición
**Actor:** Residente de Obra
**Flujo:**
1. Accede a proyecto
2. Crea requisición con 3 materiales
3. Sistema valida contra presupuesto
4. Envía a aprobación
5. Gerente Compras aprueba en 2h
6. Genera RFQ automáticamente

### CU-002: Aprobar OC
**Actor:** Gerente de Compras
**Flujo:**
1. Recibe 3 cotizaciones
2. Compara y selecciona mejor
3. Sistema genera OC-2025-00145
4. Revisa condiciones
5. Aprueba OC
6. Sistema envía email a proveedor con PDF

---

## 5. Modelo de Datos

```typescript
// requisitions
{
  id: UUID,
  code: VARCHAR(20),
  projectId: UUID,
  requestedBy: UUID,
  requiredDate: DATE,
  urgency: ENUM('normal', 'urgent'),
  items: JSONB,
  status: ENUM('draft', 'pending', 'approved', 'rejected', 'ordered'),
  approvalFlow: JSONB, // [{level, userId, status, date}]
}

// purchase_orders
{
  id: UUID,
  code: VARCHAR(20),
  supplierId: UUID,
  projectId: UUID,
  requisitionId: UUID,
  rfqId: UUID,
  quoteId: UUID,
  
  items: JSONB,
  subtotal: DECIMAL(15,2),
  tax: DECIMAL(15,2),
  total: DECIMAL(15,2),
  
  deliveryDate: DATE,
  deliveryAddress: TEXT,
  paymentTerms: VARCHAR(50),
  
  status: ENUM('pending', 'approved', 'sent', 'partially_received', 'received', 'cancelled'),
  approvedBy: UUID,
  approvedAt: TIMESTAMP,
}

// purchase_order_receipts
{
  id: UUID,
  purchaseOrderId: UUID,
  receiptDate: DATE,
  receivedBy: UUID,
  items: JSONB, // [{itemId, quantityReceived}]
  notes: TEXT,
  attachments: VARCHAR[],
}

// invoices
{
  id: UUID,
  supplierId: UUID,
  purchaseOrderId: UUID,
  invoiceNumber: VARCHAR(50),
  fiscalUUID: VARCHAR(36),
  invoiceDate: DATE,
  dueDate: DATE,
  amount: DECIMAL(15,2),
  status: ENUM('pending', 'approved', 'paid'),
}
```

---

## 6. Criterios de Aceptación

- [ ] Requisiciones desde obra
- [ ] Flujos de aprobación configurables
- [ ] Generación automática de OC desde cotización
- [ ] Numeración secuencial de OCs
- [ ] Recepción parcial/completa
- [ ] Vinculación OC → Recepción → Factura
- [ ] Alertas de vencimiento de pago
- [ ] Dashboard de OCs pendientes
- [ ] Exportación de OC a PDF

---

**Estado:** ✅ Ready for Development
