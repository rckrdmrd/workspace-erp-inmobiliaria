# US-EST-006: Exportar a Excel

**ID:** US-EST-006  
**Módulo:** MAI-008  
**Story Points:** 3

---

## Historia de Usuario

**Como** Finanzas  
**Quiero** exportar estimaciones a Excel con fórmulas  
**Para** análisis detallado y auditorías

---

## Criterios de Aceptación

1. Excel con 5 hojas: Resumen, Detalle, Amortizaciones, Retenciones, Números Generadores
2. Fórmulas activas para cálculos
3. Formato profesional con colores y bordes
4. Exporta en <5 segundos
5. Compatible con Excel 2016+

---

## Mockup

```
Excel Generado:

Hoja 1: Resumen
┌────────────────────────────┐
│ ESTIMACIÓN EST-001         │
│ Monto Bruto:   $12,500,000│
│ Amortización: -$ 2,500,000│
│ Retenciones:  -$   500,000│
│ ════════════════════════   │
│ NETO:          $ 9,500,000│
└────────────────────────────┘

Hoja 2: Detalle
[Tabla con fórmulas =D2*E2]
```

---

## Casos de Prueba

**CP-001:** Exporta con fórmulas funcionales ✅  
**CP-002:** Formato con colores aplicado ✅  
**CP-003:** 200 items → Exporta en 4 segundos ✅

---

**Generado:** 2025-11-20
