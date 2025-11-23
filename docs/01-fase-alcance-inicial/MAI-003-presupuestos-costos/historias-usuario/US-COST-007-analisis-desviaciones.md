# US-COST-007: Análisis de Desviaciones y Plan de Acción

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 9
**Story Points:** 5 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Residente de Obra
**Quiero** analizar desviaciones con descomposición precio/cantidad
**Para** identificar causas y crear plan de acción

---

## Criterios de Aceptación

### ✅ AC1: Descomposición de Desviación

**Partida:** Estructura
**Presupuestado:** $9,180,000
**Real:** $9,478,750
**Desviación:** +$298,750 (+3.3%)

**Análisis automático:**
```
Descomposición:

1. Desviación en Precio (ΔP)
   Acero fy=4200:
   - Presup: $18/kg × 42,500 kg = $765,000
   - Real: $20.50/kg × 42,500 kg = $871,250
   ΔP = $106,250

2. Desviación en Cantidad (ΔQ)
   Concreto f'c=250:
   - Presup: 450 m³ × $2,450 = $1,102,500
   - Real: 472 m³ × $2,450 = $1,156,400
   ΔQ = $53,900 (merma extra 4.9%)

3. Desviación Mixta (ΔM)
   Cimbra:
   ΔM = $12,150

TOTAL = $106,250 + $53,900 + $12,150 = $172,300
```

### ✅ AC2: Identificación de Causas

**Por cada material con desviación >5%:**
```
🔴 Acero fy=4200 (+13.9%)

Análisis de causa raíz:
├─ Precio incrementó de $18/kg a $20.50/kg
├─ Motivo: Incremento internacional del acero (Feb 2025)
├─ Fuente: 3 OCs recientes
├─ Afecta: 85 viviendas restantes
└─ Impacto proyectado: +$229,500 adicionales

Recomendaciones:
1. Negociar precio fijo con proveedor
2. Explorar perfiles de acero reciclado
3. Optimizar diseño estructural (-5% acero)
```

### ✅ AC3: Plan de Acción Obligatorio

**Para desviaciones >5%:**

**Formulario:**
```
┌──────────────────────────────────────────┐
│ PLAN DE ACCIÓN                           │
├──────────────────────────────────────────┤
│ Partida: 03-Estructura                   │
│ Desviación: +5.0% ($428,850)             │
│                                          │
│ Causa raíz: *                            │
│ [Incremento precio acero +13.9%]         │
│                                          │
│ Acciones correctivas: *                  │
│ [ ] Negociar precio fijo proveedor       │
│ [ ] Analizar acero reciclado             │
│ [ ] Compensar en otras partidas          │
│                                          │
│ Responsable: *                           │
│ [Ing. Pedro Ramírez ▼]                   │
│                                          │
│ Fecha límite: *                          │
│ [10/Dic/2025]                            │
│                                          │
│           [Cancelar]  [Guardar Plan]     │
└──────────────────────────────────────────┘
```

**Seguimiento:**
- Estado: Pendiente / En ejecución / Completado
- Notificación a Director en 48h si no hay plan

### ✅ AC4: Proyección de Impacto

**Sistema calcula:**
```
Proyección al 100% del Proyecto:

Partida: Estructura
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Presupuesto total:     $19,125,000
Ejecutado (45%):       $8,606,250
Real ejecutado:        $9,035,100
Desviación actual:     +5.0%

Si tendencia continúa:
Proyección al 100%:    $20,077,778
Sobrecosto esperado:   +$952,778

⚠️ Impacto en margen del proyecto:
- Margen actual:       30.0%
- Margen proyectado:   29.4% (-0.6 puntos)
```

---

## Definición de Done

- [ ] Descomposición automática (precio/cantidad/mixta)
- [ ] Identificación de causas
- [ ] Plan de acción obligatorio para >5%
- [ ] Seguimiento de planes
- [ ] Proyección de impacto al 100%
- [ ] Notificaciones automáticas
- [ ] Historial de planes

---

**Estado:** ✅ Ready for Development
