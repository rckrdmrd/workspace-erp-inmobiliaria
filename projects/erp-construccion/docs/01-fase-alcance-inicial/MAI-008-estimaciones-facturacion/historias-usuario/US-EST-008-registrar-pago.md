# US-EST-008: Registrar Pago de Estimación

**ID:** US-EST-008  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Finanzas  
**Quiero** registrar pagos recibidos/realizados de estimaciones  
**Para** mantener control de flujo de caja actualizado

---

## Criterios de Aceptación

1. Registrar pago con: fecha, monto, referencia bancaria, comprobante
2. Validar que monto coincida con neto de estimación
3. Actualiza estado a "Pagada"
4. Actualiza dashboard de flujo de caja
5. Notifica a ingeniero/subcontratista
6. Integra con módulo de finanzas (cuentas por cobrar/pagar)

---

## Mockup

```
┌────────────────────────────────────────┐
│ Registrar Pago EST-001              [X]│
├────────────────────────────────────────┤
│ Monto estimación: $9,500,000.00       │
│                                        │
│ Fecha de pago: [20/11/2025] 📅       │
│ Monto recibido: [$9,500,000.00]      │
│ Referencia: [TRANSF-20251120-001]    │
│                                        │
│ Comprobante (PDF/JPG):                │
│ 📎 [Seleccionar archivo]              │
│                                        │
│ Observaciones:                         │
│ ┌──────────────────────────────────┐  │
│ │ Pago completo recibido           │  │
│ └──────────────────────────────────┘  │
│                                        │
│      [Cancelar] [Registrar Pago]      │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Registra pago $9.5M → Estado "Pagada" ✅  
**CP-002:** Monto incorrecto → Alerta diferencia ⚠️  
**CP-003:** Sin comprobante → Permite pero marca pendiente ⚠️

---

**Generado:** 2025-11-20
