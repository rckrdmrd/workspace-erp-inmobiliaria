# US-EST-004: Aplicar Retenciones y Garantías

**ID:** US-EST-004  
**Módulo:** MAI-008  
**Story Points:** 3

---

## Historia de Usuario

**Como** Finanzas  
**Quiero** gestionar retenciones acumuladas y su liberación  
**Para** cumplir con garantías contractuales y optimizar flujo de caja

---

## Criterios de Aceptación

1. Sistema acumula retenciones por tipo (fondo garantía, ISR, IVA)
2. Dashboard muestra retenciones acumuladas por proyecto
3. Alertas cuando retenciones son elegibles para liberación
4. Proceso de liberación con aprobación de director
5. Reporte de retenciones pendientes de liberar

---

## Mockup

```
┌────────────────────────────────────────┐
│ Retenciones Acumuladas                 │
├────────────────────────────────────────┤
│ PROYECTO PRJ-001:                      │
│ Fondo Garantía 5%:    $2,500,000      │
│   Elegible liberación: 2027-01-01     │
│   [Solicitar Liberación]              │
│                                        │
│ ISR Retenido:          $150,000       │
│   Liberación: Al finiquito            │
│                                        │
│ TOTAL RETENIDO:        $2,650,000     │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Acumula retención 5% en cada estimación ✅  
**CP-002:** Cumple periodo garantía → Permite liberar ✅  
**CP-003:** Libera sin autorización director → Bloquea ❌

---

**Generado:** 2025-11-20
