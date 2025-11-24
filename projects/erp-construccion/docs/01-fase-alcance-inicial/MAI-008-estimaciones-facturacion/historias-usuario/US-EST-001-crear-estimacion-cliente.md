# US-EST-001: Crear Estimación a Cliente

**ID:** US-EST-001  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Ingeniero de Proyecto  
**Quiero** crear una estimación a cliente desde avances de obra verificados  
**Para** cobrar por el trabajo ejecutado en el periodo

---

## Criterios de Aceptación

1. Seleccionar proyecto y periodo → Sistema carga avances verificados
2. Sistema identifica viviendas/conceptos 100% terminados
3. Calcula automáticamente: monto bruto, amortización, retenciones, neto
4. Muestra desglose detallado con previsualización
5. Validaciones: no exceder contrato, no duplicar conceptos, avances verificados
6. Guarda borrador editable hasta enviar a autorización

---

## Mockup

```
┌────────────────────────────────────────┐
│ Nueva Estimación a Cliente          [X]│
├────────────────────────────────────────┤
│ Proyecto: [v] Desarrollo 100 Viviendas│
│ Contrato: CONT-2025-001 ($50M)        │
│ Periodo: [01/11/2025] a [30/11/2025]  │
│                                        │
│ AVANCES VERIFICADOS EN EL PERIODO:     │
│ ☑️ 25 viviendas terminadas (100%)     │
│                                        │
│ CÁLCULO AUTOMÁTICO:                    │
│ Monto bruto:        $12,500,000.00    │
│ Amortización 25%:  -$ 2,500,000.00    │
│ Retención 5%:      -$   500,000.00    │
│ ─────────────────────────────────────  │
│ MONTO NETO:         $ 9,500,000.00    │
│                                        │
│ [Cancelar] [Guardar Borrador] [Enviar]│
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Crear estimación exitosa
- 25 viviendas verificadas → Calcula $9.5M neto → Guarda borrador ✅

**CP-002:** Validar límite de contrato
- Intenta estimar más del contrato → Error ❌

**CP-003:** Evitar duplicados
- Vivienda ya estimada → Alerta y bloquea ❌

---

**Generado:** 2025-11-20
