# US-COST-006: Dashboard de Control de Costos Reales

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 9
**Story Points:** 5 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** ver dashboard de control de costos con curva S
**Para** monitorear presupuesto vs real en tiempo real

---

## Criterios de Aceptación

### ✅ AC1: Resumen Ejecutivo

**Dashboard muestra:**
```
┌──────────────────────────────────────────┐
│ CONTROL DE COSTOS                        │
│ Fracc. Los Pinos | Actualizado: Hoy 18:45│
├──────────────────────────────────────────┤
│ Presupuesto:       $127,500,000          │
│ Real acumulado:    $58,104,250           │
│ % Avance físico:   45%                   │
│ % Avance financ:   45.6%                 │
│                                          │
│ Desviación:        +1.3% 🟡               │
│ Proyección final:  $129,120,555          │
│ Sobrecosto estim:  +$1,620,555           │
│                                          │
│ Margen proyect:    28.5% (vs 30% target) │
└──────────────────────────────────────────┘
```

### ✅ AC2: Curva S

**Gráfica interactiva:**
```
100%│                                ╱─── Proyectado
    │                            ╱───
    │                        ╱───
 50%│                   ╱●── Real (45.6%)
    │              ╱────●   Presupuestado (45%)
    │         ╱────
  0%└──────────────────────────────────→
     Sep Oct Nov Dic Ene Feb Mar Abr
```

**Leyenda:**
- Azul: Presupuestado
- Verde: Real
- Rojo punteado: Proyectado (EAC)

### ✅ AC3: Desviaciones por Partida

**Top 5 desviaciones:**
```
Partida              Presup.    Real       Δ      Status
─────────────────────────────────────────────────────────
🔴 Estructura        $8.6M      $9.0M      +5.0%  Crítico
🟡 Inst. Eléctricas  $3.8M      $3.9M      +3.8%  Alerta
🟡 Acabados          $7.3M      $7.4M      +2.1%  Alerta
🟢 Cimentación       $5.2M      $5.0M      -3.0%  OK
🟢 Inst. Hidráulicas $2.3M      $2.2M      -4.4%  OK
```

### ✅ AC4: Alertas Activas

**Panel de alertas:**
```
⚠️ 3 ALERTAS ACTIVAS

1. 🔴 CRÍTICA: Estructura +5.0%
   Causa: Precio acero +13.9%
   Plan acción: Pendiente
   Responsable: Ing. Pedro Ramírez

2. 🟡 ALERTA: MO Albañilería -8% rendimiento
   Causa: Cuadrilla B sin experiencia
   Plan acción: En ejecución
   Responsable: Residente

3. 🟡 ALERTA: Cemento +4.5% vs presupuesto
   Causa: Ajuste INPC
   Plan acción: Completado
```

---

## Definición de Done

- [ ] Dashboard con 4 widgets principales
- [ ] Curva S interactiva (Chart.js)
- [ ] Desviaciones en tiempo real
- [ ] Top 5 desviaciones
- [ ] Panel de alertas
- [ ] Actualización automática
- [ ] Exportar dashboard a PDF

---

**Estado:** ✅ Ready for Development
