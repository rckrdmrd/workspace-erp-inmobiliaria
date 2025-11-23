# US-COST-008: Análisis de Rentabilidad y Simulaciones

**Épica:** MAI-003 - Presupuestos y Control de Costos
**Sprint:** Sprint 10
**Story Points:** 5 SP
**Prioridad:** P2 (Media)

---

## Historia de Usuario

**Como** Director General
**Quiero** analizar rentabilidad con simulaciones de escenarios
**Para** tomar decisiones sobre precios, costos y mix de producto

---

## Criterios de Aceptación

### ✅ AC1: Dashboard de Rentabilidad

**Vista consolidada:**
```
┌────────────────────────────────────────────┐
│ ANÁLISIS DE RENTABILIDAD                   │
│ Fracc. Los Pinos                           │
├────────────────────────────────────────────┤
│                                            │
│ ■ Ingresos                                 │
│   150 viviendas × $1,105,000               │
│   Total: $165,750,000                      │
│                                            │
│ ■ Costos                                   │
│   Construcción:  $127,500,000 (76.9%)      │
│   Terreno:       $18,750,000 (11.3%)       │
│   Comercial:     $4,965,000 (3.0%)         │
│   Legales/Admin: $2,486,250 (1.5%)         │
│   ─────────────────────────────────        │
│   Total:         $153,701,250 (92.7%)      │
│                                            │
│ ■ Rentabilidad                             │
│   Utilidad bruta: $12,048,750              │
│   Margen bruto:   7.3% ⚠️                   │
│   ROI:            7.8%                     │
│   TIR:            6.5% anual               │
│                                            │
│ ⚠️ Margen bajo objetivo (15%)              │
└────────────────────────────────────────────┘
```

### ✅ AC2: Simulador de Escenarios

**Interface interactiva:**
```
┌────────────────────────────────────────────┐
│ SIMULADOR DE ESCENARIOS                    │
├────────────────────────────────────────────┤
│                                            │
│ Escenario 1: ¿Qué pasa si precio sube 3%? │
│ ───────────────────────────────────────    │
│ Precio actual:  $1,105,000                 │
│ Nuevo precio:   $1,138,150 (+3%)           │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Resultados:                            │ │
│ │ Ingresos:    $170,722,500 (+$4.97M)    │ │
│ │ Margen:      10.4% (+3.1 puntos) ✓     │ │
│ │ Utilidad:    $17,021,250 (+41%)        │ │
│ │ ROI:         11.1% (+3.3 puntos)       │ │
│ │                                        │ │
│ │ ⚠️ Riesgo: Puede reducir demanda -5%   │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ [Guardar Escenario]  [Simular Otro]        │
└────────────────────────────────────────────┘
```

**5 escenarios predefinidos:**
1. Precio +3%
2. Costo +5%
3. Ventas -10 viviendas
4. Optimista (precio +3%, costo -2%)
5. Pesimista (precio -2%, costo +3%)

### ✅ AC3: Matriz de Sensibilidad

**Tabla precio vs costo:**
```
          PRECIO
        -5%   -3%   Base  +3%   +5%
      ┌─────┬─────┬─────┬─────┬─────┐
  -5% │ 🟢  │ 🟢  │ 🟢  │ 🟢  │ 🟢  │
C -3% │ 🟡  │ 🟢  │ 🟢  │ 🟢  │ 🟢  │
O Base│ 🔴  │ 🟡  │ 🟡  │ 🟢  │ 🟢  │
S +3% │ 🔴  │ 🔴  │ 🟡  │ 🟡  │ 🟢  │
T +5% │ 🔴  │ 🔴  │ 🔴  │ 🟡  │ 🟡  │
      └─────┴─────┴─────┴─────┴─────┘

Actual: 7.3% (Amarillo)

Conclusión:
- Muy sensible a incrementos de costo
- Incremento precio +3% → Zona verde (10.4%)
- Incremento costo +5% → Zona roja (3.9%)
```

### ✅ AC4: Comparación de Prototipos

**Rentabilidad por tipo:**
```
┌──────────────┬─────────┬─────────┬─────────┐
│ Prototipo    │ Tipo A  │ Tipo B  │ Ganador │
├──────────────┼─────────┼─────────┼─────────┤
│ Unidades     │ 105     │ 45      │ A       │
│ Precio venta │ $1,095K │ $1,125K │ B       │
│ Costo const. │ $825K   │ $850K   │ A       │
│ Utilidad/ud  │ $95K    │ $99K    │ B       │
│ Margen %     │ 8.7%    │ 8.8%    │ B       │
│ Utilidad tot.│ $9.99M  │ $4.47M  │ A       │
│ Demanda sold.│ 92%     │ 78%     │ A       │
│ Velocidad    │ 10 días │ 12 días │ A       │
└──────────────┴─────────┴─────────┴─────────┘

Recomendación:
✓ Incrementar participación Tipo A en siguientes etapas
⚠️ Tipo B: Mejorar costos o precio para aumentar margen
```

### ✅ AC5: Punto de Equilibrio

**Cálculo visual:**
```
Costos Fijos:    $22,500,000
Costo Variable:  $899,725/vivienda
Precio Venta:    $1,105,000/vivienda
Margen Contrib:  $205,275/vivienda

Punto Equilibrio: 110 viviendas

Gráfica:
Ingresos
($M)    │                          ╱
  170 M │                      ╱───
        │                  ╱───   Ingresos
  150 M │              ╱───
        │          ╱───      ╱
  130 M │      ╱───      ╱───    Costos
        │  ╱───      ╱───
  110 M │●───   ╱──── PE (110 uds)
        │  ╱────
   90 M │───
        └───────────────────────────────→
        0   50   100  150      Viviendas

Zona Pérdida: 0-109 viviendas
Zona Utilidad: 110-150 viviendas (40 uds)

Margen de seguridad: 27% ✓ Saludable
```

---

## Definición de Done

- [ ] Dashboard de rentabilidad
- [ ] Simulador de 5 escenarios
- [ ] Matriz de sensibilidad interactiva
- [ ] Comparación por prototipo
- [ ] Gráfica de punto de equilibrio
- [ ] Exportar análisis completo
- [ ] Guardar escenarios favoritos

---

**Estado:** ✅ Ready for Development
