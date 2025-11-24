# US-COST-004: Presupuesto de Obra Completo

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 8
**Story Points:** 8 SP
**Prioridad:** P1 (Alta)

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** crear presupuesto maestro del proyecto desde prototipos
**Para** estimar costos totales y calcular rentabilidad

---

## Criterios de Aceptación

### ✅ AC1: Crear Presupuesto Desde Prototipos

**Wizard de 3 pasos:**

**Paso 1: Alcance**
- Proyecto: Fraccionamiento Los Pinos
- Total viviendas: 150
- Distribución:
  - Casa Tipo A (v2): 105 uds
  - Casa Tipo B (v1): 45 uds

**Paso 2: Cálculo Automático**
Sistema calcula:
```
Costo Viviendas:
  105 × $825,500 (Tipo A) = $86,677,500
   45 × $850,000 (Tipo B) = $38,250,000
  ────────────────────────────────────
  Subtotal viviendas:      $124,927,500

Obras Generales:
  Urbanización:            $2,500,000
  Infraestructura:         $125,000
  ────────────────────────────────────
  TOTAL PROYECTO:          $127,552,500
```

**Paso 3: Análisis Financiero**
- Precio venta promedio: $1,105,000/vivienda
- Ingresos totales: $165,750,000
- Margen bruto: 30%
- ROI: 16.3%

### ✅ AC2: Desglose por División CMIC

**Vista jerárquica:**
```
01 - PRELIMINARES              $1,913,288 (1.5%)
02 - CIMENTACIÓN              $11,479,725 (9.0%)
  ├─ 02.01 Excavación          $1,275,969
  ├─ 02.02 Plantilla           $637,985
  └─ 02.03 Cimiento corrido    $9,565,771
03 - ESTRUCTURA               $19,132,875 (15.0%)
  ├─ 03.01 Castillos           $5,739,862
  ├─ 03.02 Dalas               $3,826,575
  └─ 03.03 Losa                $9,566,438
...
16 - JARDINERÍA                $2,551,050 (2.0%)
  ────────────────────────────────────────
  TOTAL COSTO DIRECTO        $127,552,500 (100%)
```

### ✅ AC3: Indicadores

**Dashboard de presupuesto:**
```
┌──────────────────────────────────────┐
│ INDICADORES DEL PRESUPUESTO          │
├──────────────────────────────────────┤
│ Costo total:       $127,552,500      │
│ $/m²:              $18,897           │
│ $/vivienda:        $850,350          │
│                                      │
│ Precio venta:      $165,750,000      │
│ Margen bruto:      $38,197,500       │
│ % Margen:          30.0% ✓           │
│                                      │
│ ROI:               16.3%             │
│ Punto equilibrio:  110 viviendas     │
│ Margen seguridad:  27%               │
└──────────────────────────────────────┘
```

---

## Definición de Done

- [ ] Wizard de creación desde prototipos
- [ ] Cálculo automático desde presupuestos de prototipo
- [ ] Obras generales (urbanización)
- [ ] Desglose por 16 divisiones CMIC
- [ ] Indicadores: $/m², $/vivienda, margen, ROI
- [ ] Exportar a Excel/PDF
- [ ] Versionado (baseline)

---

**Estado:** ✅ Ready for Development
