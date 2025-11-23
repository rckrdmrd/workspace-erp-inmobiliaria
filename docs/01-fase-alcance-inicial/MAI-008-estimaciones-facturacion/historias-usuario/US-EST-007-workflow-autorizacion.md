# US-EST-007: Workflow de Autorización

**ID:** US-EST-007  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Director  
**Quiero** autorizar estimaciones >$100K con workflow controlado  
**Para** mantener control de pagos significativos

---

## Criterios de Aceptación

1. Workflow: Borrador → Enviada → Revisada → Autorizada → Pagada
2. Validaciones por rol y monto
3. Notificaciones en cada transición
4. Historial inmutable de aprobaciones
5. Escalación automática si >48h sin respuesta
6. Dashboard de estimaciones pendientes

---

## Mockup

```
┌────────────────────────────────────────┐
│ Estimaciones Pendientes de Autorizar   │
├────────────────────────────────────────┤
│ 🔴 EST-001 | $9.5M | Hace 36h  [Ver]  │
│ 🟡 EST-003 | $2.1M | Hace 12h  [Ver]  │
│ 🟢 EST-005 | $573K | Hace 2h   [Ver]  │
│                                        │
│ [Autorizar Múltiples]                  │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Monto $150K → Requiere director ✅  
**CP-002:** 48h sin revisar → Alerta SMS director ✅  
**CP-003:** Ingeniero intenta autorizar → Bloquea ❌

---

**Generado:** 2025-11-20
