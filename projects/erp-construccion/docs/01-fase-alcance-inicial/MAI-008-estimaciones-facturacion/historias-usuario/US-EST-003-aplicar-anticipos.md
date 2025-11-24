# US-EST-003: Aplicar Anticipos y Amortizaciones

**ID:** US-EST-003  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Finanzas  
**Quiero** que el sistema aplique automáticamente amortizaciones de anticipo  
**Para** mantener control preciso del saldo pendiente

---

## Criterios de Aceptación

1. Al crear estimación → Sistema detecta anticipo activo
2. Calcula amortización según % configurado en contrato
3. Actualiza saldo pendiente de anticipo
4. Alerta cuando anticipo está próximo a amortizarse 100%
5. Dashboard muestra estado de anticipos por proyecto
6. Reportes de anticipos recibidos/otorgados

---

## Mockup

```
┌────────────────────────────────────────┐
│ Control de Anticipos                   │
├────────────────────────────────────────┤
│ ANTICIPOS RECIBIDOS (Clientes):        │
│ PRJ-001: $10M | Amortizado: $7M (70%) │
│          Saldo: $3M | Est. 2 más      │
│                                        │
│ ANTICIPOS OTORGADOS (Subcontratistas):│
│ SUB-PLOM: $200K | Amortizado: $60K    │
│           Saldo: $140K (70%)          │
│                                        │
│ [Ver Detalle] [Exportar Reporte]      │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Estimación $12.5M → Amortiza 25% = $2.5M ✅  
**CP-002:** Saldo $1M, calcula $2M → Amortiza solo $1M ✅  
**CP-003:** Anticipo agotado → Alerta director ✅

---

**Generado:** 2025-11-20
