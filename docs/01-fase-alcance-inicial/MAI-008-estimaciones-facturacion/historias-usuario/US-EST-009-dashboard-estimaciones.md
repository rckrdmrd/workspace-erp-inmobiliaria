# US-EST-009: Dashboard de Estimaciones y Pagos

**ID:** US-EST-009  
**Módulo:** MAI-008  
**Story Points:** 5

---

## Historia de Usuario

**Como** Director  
**Quiero** ver dashboard consolidado de estimaciones y flujo de caja  
**Para** tomar decisiones informadas sobre proyectos

---

## Criterios de Aceptación

1. Widgets: Estimaciones por estado, Flujo de caja proyectado, Retenciones acumuladas
2. Gráficos: Tendencia mensual, Distribución cliente vs subcontratistas
3. Alertas: Pagos vencidos, Estimaciones pendientes >48h
4. Filtros por: Proyecto, Periodo, Estado
5. Exportar dashboard a PDF
6. Actualización en tiempo real

---

## Mockup

```
┌────────────────────────────────────────┐
│ Dashboard de Estimaciones              │
├────────────────────────────────────────┤
│ ┌─────────────┐ ┌──────────────────┐  │
│ │ Por Estado  │ │ Flujo de Caja    │  │
│ │ Borradores:3│ │ Próximos 30 días:│  │
│ │ Pendientes:5│ │ Por cobrar: $25M │  │
│ │ Autorizadas │ │ Por pagar:  $8M  │  │
│ │ :2          │ │ Neto:      +$17M │  │
│ └─────────────┘ └──────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ 📊 Tendencia Mensual             │  │
│ │ [Gráfico de barras]              │  │
│ └──────────────────────────────────┘  │
│                                        │
│ 🚨 ALERTAS:                            │
│ • 2 pagos a subcontratistas vencidos  │
│ • EST-001 pendiente hace 52h          │
└────────────────────────────────────────┘
```

---

## Casos de Prueba

**CP-001:** Dashboard carga en <2 segundos ✅  
**CP-002:** Actualiza en tiempo real al cambiar estado ✅  
**CP-003:** Exporta PDF con gráficos ✅

---

**Generado:** 2025-11-20
